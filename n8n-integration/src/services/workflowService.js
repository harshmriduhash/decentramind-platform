/**
 * Workflow Service for N8N Integration
 * Handles workflow execution, management, and monitoring
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class WorkflowService {
  constructor(mongodbService) {
    this.mongodb = mongodbService;
    this.n8nProcess = null;
    this.workflows = new Map();
    this.executionQueue = [];
    this.isProcessing = false;
    
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/workflow.log' })
      ]
    });
  }

  async initializeN8N() {
    try {
      this.logger.info('Initializing N8N...');
      
      // Set N8N environment variables
      process.env.N8N_HOST = process.env.N8N_HOST || 'localhost';
      process.env.N8N_PORT = process.env.N8N_PORT || '5678';
      process.env.N8N_PROTOCOL = process.env.N8N_PROTOCOL || 'http';
      process.env.N8N_USER_MANAGEMENT_DISABLED = 'true';
      process.env.N8N_BASIC_AUTH_ACTIVE = 'true';
      process.env.N8N_BASIC_AUTH_USER = process.env.N8N_BASIC_AUTH_USER || 'admin';
      process.env.N8N_BASIC_AUTH_PASSWORD = process.env.N8N_BASIC_AUTH_PASSWORD || 'admin123';
      process.env.N8N_ENCRYPTION_KEY = process.env.N8N_ENCRYPTION_KEY || 'decentramind-n8n-key-2024';
      process.env.WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3001';
      
      // Load workflow templates
      await this.loadWorkflowTemplates();
      
      this.logger.info('N8N initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize N8N:', error);
      throw error;
    }
  }

  async loadWorkflowTemplates() {
    try {
      const workflowsDir = path.join(__dirname, '../workflows');
      const categories = await fs.readdir(workflowsDir);
      
      for (const category of categories) {
        const categoryPath = path.join(workflowsDir, category);
        const stat = await fs.stat(categoryPath);
        
        if (stat.isDirectory()) {
          const workflowFiles = await fs.readdir(categoryPath);
          
          for (const file of workflowFiles) {
            if (file.endsWith('.json')) {
              const workflowPath = path.join(categoryPath, file);
              const workflowData = await fs.readFile(workflowPath, 'utf8');
              const workflow = JSON.parse(workflowData);
              
              // Store workflow template
              const workflowId = `${category}-${file.replace('.json', '')}`;
              this.workflows.set(workflowId, {
                ...workflow,
                category,
                template: true,
                path: workflowPath
              });
              
              this.logger.info(`Loaded workflow template: ${workflowId}`);
            }
          }
        }
      }
      
      this.logger.info(`Loaded ${this.workflows.size} workflow templates`);
    } catch (error) {
      this.logger.error('Failed to load workflow templates:', error);
      throw error;
    }
  }

  async executeWorkflow(workflowId, inputData, context = {}) {
    try {
      const executionId = this.generateExecutionId();
      
      this.logger.info(`Executing workflow: ${workflowId}`, {
        executionId,
        agentId: context.agentId,
        walletAddress: context.walletAddress
      });

      // Get workflow template
      const workflow = this.workflows.get(workflowId);
      if (!workflow) {
        throw new Error(`Workflow not found: ${workflowId}`);
      }

      // Create execution context
      const executionContext = {
        executionId,
        workflowId,
        agentId: context.agentId,
        walletAddress: context.walletAddress,
        inputData,
        startTime: new Date(),
        status: 'running'
      };

      // Log execution start
      await this.logExecution(executionContext);

      // Execute workflow based on type
      let result;
      if (workflow.type === 'webhook') {
        result = await this.executeWebhookWorkflow(workflow, inputData, executionContext);
      } else if (workflow.type === 'scheduled') {
        result = await this.executeScheduledWorkflow(workflow, inputData, executionContext);
      } else {
        result = await this.executeCustomWorkflow(workflow, inputData, executionContext);
      }

      // Update execution status
      executionContext.status = 'completed';
      executionContext.endTime = new Date();
      executionContext.result = result;

      await this.logExecution(executionContext);

      this.logger.info(`Workflow completed: ${workflowId}`, {
        executionId,
        duration: executionContext.endTime - executionContext.startTime
      });

      return {
        success: true,
        executionId,
        result,
        duration: executionContext.endTime - executionContext.startTime
      };

    } catch (error) {
      this.logger.error(`Workflow execution failed: ${workflowId}`, error);
      
      // Log failed execution
      await this.logExecution({
        executionId: this.generateExecutionId(),
        workflowId,
        agentId: context.agentId,
        walletAddress: context.walletAddress,
        inputData,
        startTime: new Date(),
        endTime: new Date(),
        status: 'failed',
        error: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async executeWebhookWorkflow(workflow, inputData, context) {
    // Simulate webhook workflow execution
    // In a real implementation, this would trigger the actual N8N workflow
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          type: 'webhook',
          status: 'completed',
          data: {
            ...inputData,
            processed: true,
            timestamp: new Date().toISOString()
          }
        });
      }, 1000);
    });
  }

  async executeScheduledWorkflow(workflow, inputData, context) {
    // Simulate scheduled workflow execution
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          type: 'scheduled',
          status: 'completed',
          data: {
            ...inputData,
            scheduled: true,
            timestamp: new Date().toISOString()
          }
        });
      }, 2000);
    });
  }

  async executeCustomWorkflow(workflow, inputData, context) {
    // Simulate custom workflow execution
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          type: 'custom',
          status: 'completed',
          data: {
            ...inputData,
            custom: true,
            timestamp: new Date().toISOString()
          }
        });
      }, 1500);
    });
  }

  async getWorkflowStatus(executionId) {
    try {
      const execution = await this.mongodb.getExecution(executionId);
      return execution;
    } catch (error) {
      this.logger.error('Failed to get workflow status:', error);
      throw error;
    }
  }

  async getWorkflowExecutions(agentId, limit = 10) {
    try {
      const executions = await this.mongodb.getExecutionsByAgent(agentId, limit);
      return executions;
    } catch (error) {
      this.logger.error('Failed to get workflow executions:', error);
      throw error;
    }
  }

  async createWorkflow(workflowData) {
    try {
      const workflowId = this.generateWorkflowId();
      const workflow = {
        id: workflowId,
        ...workflowData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to database
      await this.mongodb.createWorkflow(workflow);

      // Add to memory
      this.workflows.set(workflowId, workflow);

      this.logger.info(`Created workflow: ${workflowId}`);
      return workflow;
    } catch (error) {
      this.logger.error('Failed to create workflow:', error);
      throw error;
    }
  }

  async updateWorkflow(workflowId, updates) {
    try {
      const workflow = this.workflows.get(workflowId);
      if (!workflow) {
        throw new Error(`Workflow not found: ${workflowId}`);
      }

      const updatedWorkflow = {
        ...workflow,
        ...updates,
        updatedAt: new Date()
      };

      // Update in database
      await this.mongodb.updateWorkflow(workflowId, updates);

      // Update in memory
      this.workflows.set(workflowId, updatedWorkflow);

      this.logger.info(`Updated workflow: ${workflowId}`);
      return updatedWorkflow;
    } catch (error) {
      this.logger.error('Failed to update workflow:', error);
      throw error;
    }
  }

  async deleteWorkflow(workflowId) {
    try {
      // Remove from database
      await this.mongodb.deleteWorkflow(workflowId);

      // Remove from memory
      this.workflows.delete(workflowId);

      this.logger.info(`Deleted workflow: ${workflowId}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to delete workflow:', error);
      throw error;
    }
  }

  async getWorkflows(category = null) {
    try {
      if (category) {
        return Array.from(this.workflows.values())
          .filter(workflow => workflow.category === category);
      }
      return Array.from(this.workflows.values());
    } catch (error) {
      this.logger.error('Failed to get workflows:', error);
      throw error;
    }
  }

  async logExecution(execution) {
    try {
      await this.mongodb.logExecution(execution);
    } catch (error) {
      this.logger.error('Failed to log execution:', error);
    }
  }

  generateExecutionId() {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  generateWorkflowId() {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Human-in-the-Loop methods
  async requestHITLApproval(executionId, approvalData) {
    try {
      const approval = {
        executionId,
        approvalData,
        status: 'pending',
        requestedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      };

      await this.mongodb.createHITLApproval(approval);
      
      this.logger.info(`HITL approval requested: ${executionId}`);
      return approval;
    } catch (error) {
      this.logger.error('Failed to request HITL approval:', error);
      throw error;
    }
  }

  async processHITLApproval(executionId, approved, approverWallet) {
    try {
      const approval = await this.mongodb.getHITLApproval(executionId);
      if (!approval) {
        throw new Error('Approval not found');
      }

      approval.status = approved ? 'approved' : 'rejected';
      approval.approvedAt = new Date();
      approval.approverWallet = approverWallet;

      await this.mongodb.updateHITLApproval(executionId, approval);

      this.logger.info(`HITL approval processed: ${executionId}`, {
        approved,
        approverWallet
      });

      return approval;
    } catch (error) {
      this.logger.error('Failed to process HITL approval:', error);
      throw error;
    }
  }
}
