/**
 * Notification Service for N8N Integration
 * Handles notifications via Telegram, Discord, Email, and other channels
 */

import axios from 'axios';
import nodemailer from 'nodemailer';
import winston from 'winston';

export class NotificationService {
  constructor() {
    this.telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    this.discordBotToken = process.env.DISCORD_BOT_TOKEN;
    this.emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };
    
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/notifications.log' })
      ]
    });

    this.initializeEmailTransporter();
  }

  initializeEmailTransporter() {
    if (this.emailConfig.auth.user && this.emailConfig.auth.pass) {
      this.emailTransporter = nodemailer.createTransporter(this.emailConfig);
      this.logger.info('Email transporter initialized');
    } else {
      this.logger.warn('Email configuration incomplete - email notifications disabled');
    }
  }

  async sendTelegramMessage(chatId, message, options = {}) {
    try {
      if (!this.telegramBotToken) {
        throw new Error('Telegram bot token not configured');
      }

      const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
      const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        ...options
      };

      const response = await axios.post(url, payload);
      
      this.logger.info('Telegram message sent', {
        chatId,
        messageId: response.data.result.message_id
      });

      return {
        success: true,
        messageId: response.data.result.message_id
      };
    } catch (error) {
      this.logger.error('Failed to send Telegram message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendDiscordMessage(channelId, message, options = {}) {
    try {
      if (!this.discordBotToken) {
        throw new Error('Discord bot token not configured');
      }

      const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
      const payload = {
        content: message,
        ...options
      };

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bot ${this.discordBotToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      this.logger.info('Discord message sent', {
        channelId,
        messageId: response.data.id
      });

      return {
        success: true,
        messageId: response.data.id
      };
    } catch (error) {
      this.logger.error('Failed to send Discord message:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendEmail(to, subject, html, text = null) {
    try {
      if (!this.emailTransporter) {
        throw new Error('Email transporter not configured');
      }

      const mailOptions = {
        from: this.emailConfig.auth.user,
        to,
        subject,
        html,
        text: text || this.htmlToText(html)
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      
      this.logger.info('Email sent', {
        to,
        subject,
        messageId: result.messageId
      });

      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendWorkflowNotification(notification) {
    try {
      const { type, workflowId, executionId, status, message, recipients } = notification;
      
      const notificationMessage = this.formatWorkflowNotification(notification);
      
      // Send to all configured channels
      const results = [];
      
      // Telegram notifications
      if (recipients.telegram) {
        for (const chatId of recipients.telegram) {
          const result = await this.sendTelegramMessage(chatId, notificationMessage);
          results.push({ channel: 'telegram', chatId, ...result });
        }
      }
      
      // Discord notifications
      if (recipients.discord) {
        for (const channelId of recipients.discord) {
          const result = await this.sendDiscordMessage(channelId, notificationMessage);
          results.push({ channel: 'discord', channelId, ...result });
        }
      }
      
      // Email notifications
      if (recipients.email) {
        for (const email of recipients.email) {
          const result = await this.sendEmail(
            email,
            `Workflow ${status}: ${workflowId}`,
            this.formatWorkflowEmail(notification)
          );
          results.push({ channel: 'email', email, ...result });
        }
      }
      
      this.logger.info('Workflow notification sent', {
        workflowId,
        executionId,
        status,
        results: results.length
      });
      
      return {
        success: true,
        results
      };
    } catch (error) {
      this.logger.error('Failed to send workflow notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendAgentNotification(notification) {
    try {
      const { agentId, type, message, walletAddress, recipients } = notification;
      
      const notificationMessage = this.formatAgentNotification(notification);
      
      const results = [];
      
      // Send to agent-specific channels
      if (recipients.telegram) {
        for (const chatId of recipients.telegram) {
          const result = await this.sendTelegramMessage(chatId, notificationMessage);
          results.push({ channel: 'telegram', chatId, ...result });
        }
      }
      
      if (recipients.discord) {
        for (const channelId of recipients.discord) {
          const result = await this.sendDiscordMessage(channelId, notificationMessage);
          results.push({ channel: 'discord', channelId, ...result });
        }
      }
      
      this.logger.info('Agent notification sent', {
        agentId,
        type,
        walletAddress,
        results: results.length
      });
      
      return {
        success: true,
        results
      };
    } catch (error) {
      this.logger.error('Failed to send agent notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendHITLApprovalRequest(approval) {
    try {
      const { executionId, workflowId, agentId, walletAddress, approvalData } = approval;
      
      const message = `🔔 **Human-in-the-Loop Approval Required**\n\n` +
        `**Workflow:** ${workflowId}\n` +
        `**Agent:** ${agentId}\n` +
        `**Execution ID:** ${executionId}\n` +
        `**Requested by:** ${walletAddress}\n` +
        `**Details:** ${JSON.stringify(approvalData, null, 2)}\n\n` +
        `**Action Required:** Please review and approve/reject this workflow execution.`;
      
      const results = [];
      
      // Send to admin channels
      const adminChannels = process.env.ADMIN_TELEGRAM_CHAT_IDS?.split(',') || [];
      for (const chatId of adminChannels) {
        const result = await this.sendTelegramMessage(chatId, message);
        results.push({ channel: 'telegram', chatId, ...result });
      }
      
      const adminDiscordChannels = process.env.ADMIN_DISCORD_CHANNEL_IDS?.split(',') || [];
      for (const channelId of adminDiscordChannels) {
        const result = await this.sendDiscordMessage(channelId, message);
        results.push({ channel: 'discord', channelId, ...result });
      }
      
      this.logger.info('HITL approval request sent', {
        executionId,
        workflowId,
        agentId,
        results: results.length
      });
      
      return {
        success: true,
        results
      };
    } catch (error) {
      this.logger.error('Failed to send HITL approval request:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  formatWorkflowNotification(notification) {
    const { type, workflowId, executionId, status, message, agentId, walletAddress } = notification;
    
    const statusEmoji = {
      'started': '🚀',
      'completed': '✅',
      'failed': '❌',
      'pending': '⏳',
      'approved': '👍',
      'rejected': '👎'
    };
    
    return `${statusEmoji[status] || '📋'} **Workflow ${status.toUpperCase()}**\n\n` +
      `**Workflow:** ${workflowId}\n` +
      `**Execution:** ${executionId}\n` +
      `**Agent:** ${agentId || 'N/A'}\n` +
      `**Wallet:** ${walletAddress || 'N/A'}\n` +
      `**Message:** ${message}\n` +
      `**Time:** ${new Date().toISOString()}`;
  }

  formatAgentNotification(notification) {
    const { agentId, type, message, walletAddress } = notification;
    
    const typeEmoji = {
      'created': '🤖',
      'updated': '🔄',
      'deleted': '🗑️',
      'evolved': '🧬',
      'error': '⚠️',
      'warning': '⚠️'
    };
    
    return `${typeEmoji[type] || '📋'} **Agent ${type.toUpperCase()}**\n\n` +
      `**Agent ID:** ${agentId}\n` +
      `**Wallet:** ${walletAddress}\n` +
      `**Message:** ${message}\n` +
      `**Time:** ${new Date().toISOString()}`;
  }

  formatWorkflowEmail(notification) {
    const { type, workflowId, executionId, status, message, agentId, walletAddress } = notification;
    
    return `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>DecentraMind Workflow Notification</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <h3>Workflow ${status.toUpperCase()}</h3>
            <p><strong>Workflow ID:</strong> ${workflowId}</p>
            <p><strong>Execution ID:</strong> ${executionId}</p>
            <p><strong>Agent ID:</strong> ${agentId || 'N/A'}</p>
            <p><strong>Wallet Address:</strong> ${walletAddress || 'N/A'}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          </div>
          <p style="color: #666; font-size: 12px;">
            This is an automated notification from DecentraMind N8N Integration Service.
          </p>
        </body>
      </html>
    `;
  }

  htmlToText(html) {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }

  async testNotificationChannels() {
    const results = {
      telegram: false,
      discord: false,
      email: false
    };
    
    try {
      // Test Telegram
      if (this.telegramBotToken) {
        const testResult = await this.sendTelegramMessage(
          process.env.TEST_TELEGRAM_CHAT_ID,
          '🧪 Test notification from DecentraMind N8N Integration'
        );
        results.telegram = testResult.success;
      }
      
      // Test Discord
      if (this.discordBotToken) {
        const testResult = await this.sendDiscordMessage(
          process.env.TEST_DISCORD_CHANNEL_ID,
          '🧪 Test notification from DecentraMind N8N Integration'
        );
        results.discord = testResult.success;
      }
      
      // Test Email
      if (this.emailTransporter) {
        const testResult = await this.sendEmail(
          process.env.TEST_EMAIL_ADDRESS,
          'Test Notification - DecentraMind N8N Integration',
          '<h2>Test Notification</h2><p>This is a test notification from DecentraMind N8N Integration Service.</p>'
        );
        results.email = testResult.success;
      }
      
      this.logger.info('Notification channels tested', results);
      return results;
    } catch (error) {
      this.logger.error('Failed to test notification channels:', error);
      return results;
    }
  }
}
