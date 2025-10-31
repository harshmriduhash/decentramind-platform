/**
 * Authentication Service for N8N Integration
 * Handles wallet-based authentication and access control
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import winston from 'winston';

export class AuthService {
  constructor(mongodbService) {
    this.mongodb = mongodbService;
    this.jwtSecret = process.env.JWT_SECRET || 'decentramind-jwt-secret-2024';
    this.jwtExpiry = process.env.JWT_EXPIRY || '24h';
    
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/auth.log' })
      ]
    });
  }

  async validateWalletSignature(walletAddress, message, signature) {
    try {
      // In a real implementation, you would verify the signature using Solana's crypto
      // For now, we'll simulate validation
      const expectedSignature = this.generateMockSignature(walletAddress, message);
      
      if (signature === expectedSignature) {
        this.logger.info('Wallet signature validated', { walletAddress });
        return true;
      }
      
      this.logger.warn('Invalid wallet signature', { walletAddress, signature });
      return false;
    } catch (error) {
      this.logger.error('Failed to validate wallet signature:', error);
      return false;
    }
  }

  generateMockSignature(walletAddress, message) {
    // This is a mock implementation - in production, use actual Solana signature verification
    const data = `${walletAddress}:${message}:${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  async generateAccessToken(walletAddress, agentId = null) {
    try {
      const payload = {
        walletAddress,
        agentId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      };

      const token = jwt.sign(payload, this.jwtSecret);
      
      this.logger.info('Access token generated', { walletAddress, agentId });
      return token;
    } catch (error) {
      this.logger.error('Failed to generate access token:', error);
      throw error;
    }
  }

  async verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      this.logger.info('Access token verified', { 
        walletAddress: decoded.walletAddress,
        agentId: decoded.agentId 
      });
      
      return decoded;
    } catch (error) {
      this.logger.error('Failed to verify access token:', error);
      return null;
    }
  }

  async checkWorkflowAccess(walletAddress, workflowId, requiredDMT = 0) {
    try {
      // Check if user has sufficient DMT balance
      if (requiredDMT > 0) {
        const hasBalance = await this.checkDMTBalance(walletAddress, requiredDMT);
        if (!hasBalance) {
          return {
            allowed: false,
            reason: 'Insufficient DMT balance',
            requiredDMT
          };
        }
      }

      // Check if workflow requires specific permissions
      const workflow = await this.mongodb.getWorkflow(workflowId);
      if (!workflow) {
        return {
          allowed: false,
          reason: 'Workflow not found'
        };
      }

      // Check if workflow is public or user has access
      if (workflow.visibility === 'private' && workflow.createdBy !== walletAddress) {
        return {
          allowed: false,
          reason: 'Workflow access denied'
        };
      }

      // Check if workflow requires DAO approval
      if (workflow.requiresDAOApproval) {
        const isDAOApproved = await this.checkDAOApproval(walletAddress);
        if (!isDAOApproved) {
          return {
            allowed: false,
            reason: 'DAO approval required'
          };
        }
      }

      this.logger.info('Workflow access granted', { 
        walletAddress, 
        workflowId, 
        requiredDMT 
      });

      return {
        allowed: true,
        reason: 'Access granted'
      };
    } catch (error) {
      this.logger.error('Failed to check workflow access:', error);
      return {
        allowed: false,
        reason: 'Access check failed'
      };
    }
  }

  async checkDMTBalance(walletAddress, requiredAmount) {
    try {
      // In a real implementation, you would check the actual DMT balance on Solana
      // For now, we'll simulate a balance check
      const mockBalance = 1000; // Mock balance
      
      this.logger.info('DMT balance checked', { 
        walletAddress, 
        requiredAmount, 
        balance: mockBalance 
      });
      
      return mockBalance >= requiredAmount;
    } catch (error) {
      this.logger.error('Failed to check DMT balance:', error);
      return false;
    }
  }

  async checkDAOApproval(walletAddress) {
    try {
      // In a real implementation, you would check DAO governance status
      // For now, we'll simulate DAO approval
      const mockDAOApproval = true;
      
      this.logger.info('DAO approval checked', { 
        walletAddress, 
        approved: mockDAOApproval 
      });
      
      return mockDAOApproval;
    } catch (error) {
      this.logger.error('Failed to check DAO approval:', error);
      return false;
    }
  }

  async logAccessAttempt(walletAddress, action, success, details = {}) {
    try {
      const accessLog = {
        walletAddress,
        action,
        success,
        details,
        timestamp: new Date(),
        ip: details.ip || 'unknown',
        userAgent: details.userAgent || 'unknown'
      };

      await this.mongodb.logAuditEvent({
        ...accessLog,
        type: 'access_attempt'
      });

      this.logger.info('Access attempt logged', accessLog);
    } catch (error) {
      this.logger.error('Failed to log access attempt:', error);
    }
  }

  async getWorkflowPermissions(walletAddress) {
    try {
      // Get user's workflow permissions based on their DMT holdings and DAO status
      const permissions = {
        canCreateWorkflows: true,
        canExecuteWorkflows: true,
        canModifyWorkflows: true,
        canDeleteWorkflows: true,
        maxWorkflowExecutions: 100,
        maxWorkflowSize: 1000,
        allowedCategories: ['general', 'healthcare', 'finance', 'logistics', 'security'],
        requiresApproval: false
      };

      // Check DMT holdings for premium features
      const dmtBalance = await this.getDMTBalance(walletAddress);
      if (dmtBalance >= 1000) {
        permissions.maxWorkflowExecutions = 1000;
        permissions.maxWorkflowSize = 5000;
        permissions.allowedCategories.push('premium', 'enterprise');
      }

      // Check DAO status for governance features
      const isDAOMember = await this.checkDAOMembership(walletAddress);
      if (isDAOMember) {
        permissions.canCreatePublicWorkflows = true;
        permissions.canApproveWorkflows = true;
      }

      this.logger.info('Workflow permissions retrieved', { 
        walletAddress, 
        permissions 
      });

      return permissions;
    } catch (error) {
      this.logger.error('Failed to get workflow permissions:', error);
      return {
        canCreateWorkflows: false,
        canExecuteWorkflows: false,
        canModifyWorkflows: false,
        canDeleteWorkflows: false,
        maxWorkflowExecutions: 0,
        maxWorkflowSize: 0,
        allowedCategories: [],
        requiresApproval: true
      };
    }
  }

  async getDMTBalance(walletAddress) {
    try {
      // Mock DMT balance - in production, query Solana blockchain
      return 1000;
    } catch (error) {
      this.logger.error('Failed to get DMT balance:', error);
      return 0;
    }
  }

  async checkDAOMembership(walletAddress) {
    try {
      // Mock DAO membership check - in production, query governance contract
      return true;
    } catch (error) {
      this.logger.error('Failed to check DAO membership:', error);
      return false;
    }
  }

  async createAPIKey(walletAddress, name, permissions = {}) {
    try {
      const apiKey = crypto.randomBytes(32).toString('hex');
      const keyData = {
        walletAddress,
        name,
        apiKey,
        permissions,
        createdAt: new Date(),
        lastUsed: null,
        isActive: true
      };

      await this.mongodb.createAPIKey(keyData);
      
      this.logger.info('API key created', { 
        walletAddress, 
        name, 
        keyId: apiKey.substring(0, 8) + '...' 
      });

      return {
        apiKey,
        name,
        permissions,
        createdAt: keyData.createdAt
      };
    } catch (error) {
      this.logger.error('Failed to create API key:', error);
      throw error;
    }
  }

  async validateAPIKey(apiKey) {
    try {
      const keyData = await this.mongodb.getAPIKey(apiKey);
      if (!keyData || !keyData.isActive) {
        return null;
      }

      // Update last used timestamp
      await this.mongodb.updateAPIKey(apiKey, { lastUsed: new Date() });

      this.logger.info('API key validated', { 
        walletAddress: keyData.walletAddress,
        name: keyData.name 
      });

      return keyData;
    } catch (error) {
      this.logger.error('Failed to validate API key:', error);
      return null;
    }
  }

  async revokeAPIKey(apiKey, walletAddress) {
    try {
      const keyData = await this.mongodb.getAPIKey(apiKey);
      if (!keyData || keyData.walletAddress !== walletAddress) {
        throw new Error('API key not found or access denied');
      }

      await this.mongodb.updateAPIKey(apiKey, { isActive: false, revokedAt: new Date() });
      
      this.logger.info('API key revoked', { 
        walletAddress, 
        name: keyData.name 
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to revoke API key:', error);
      throw error;
    }
  }
}
