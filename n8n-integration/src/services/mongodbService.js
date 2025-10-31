/**
 * MongoDB Service for N8N Integration
 * Handles data persistence and audit logging
 */

import { MongoClient, ObjectId } from 'mongodb';
import winston from 'winston';

export class MongoDBService {
  constructor() {
    this.client = null;
    this.db = null;
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    this.databaseName = process.env.MONGODB_DB || 'decentramind_n8n';
    
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/mongodb.log' })
      ]
    });
  }

  async connect() {
    try {
      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      this.db = this.client.db(this.databaseName);
      
      // Create indexes
      await this.createIndexes();
      
      this.logger.info('MongoDB connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.close();
        this.logger.info('MongoDB disconnected');
      }
    } catch (error) {
      this.logger.error('Failed to disconnect from MongoDB:', error);
    }
  }

  async createIndexes() {
    try {
      // Workflow executions index
      await this.db.collection('workflow_executions').createIndexes([
        { key: { executionId: 1 }, unique: true },
        { key: { agentId: 1, createdAt: -1 } },
        { key: { walletAddress: 1, createdAt: -1 } },
        { key: { status: 1 } },
        { key: { createdAt: -1 } }
      ]);

      // Workflows index
      await this.db.collection('workflows').createIndexes([
        { key: { workflowId: 1 }, unique: true },
        { key: { category: 1 } },
        { key: { agentId: 1 } },
        { key: { createdAt: -1 } }
      ]);

      // HITL approvals index
      await this.db.collection('hitl_approvals').createIndexes([
        { key: { executionId: 1 }, unique: true },
        { key: { status: 1 } },
        { key: { expiresAt: 1 }, expireAfterSeconds: 0 }
      ]);

      // Audit logs index
      await this.db.collection('audit_logs').createIndexes([
        { key: { walletAddress: 1, timestamp: -1 } },
        { key: { agentId: 1, timestamp: -1 } },
        { key: { action: 1, timestamp: -1 } },
        { key: { timestamp: -1 } }
      ]);

      this.logger.info('MongoDB indexes created successfully');
    } catch (error) {
      this.logger.error('Failed to create indexes:', error);
      throw error;
    }
  }

  // Workflow Execution Methods
  async logExecution(execution) {
    try {
      const result = await this.db.collection('workflow_executions').insertOne({
        ...execution,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      this.logger.info('Workflow execution logged', {
        executionId: execution.executionId,
        agentId: execution.agentId
      });
      
      return result.insertedId;
    } catch (error) {
      this.logger.error('Failed to log execution:', error);
      throw error;
    }
  }

  async getExecution(executionId) {
    try {
      const execution = await this.db.collection('workflow_executions').findOne({
        executionId
      });
      
      return execution;
    } catch (error) {
      this.logger.error('Failed to get execution:', error);
      throw error;
    }
  }

  async getExecutionsByAgent(agentId, limit = 10) {
    try {
      const executions = await this.db.collection('workflow_executions')
        .find({ agentId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      
      return executions;
    } catch (error) {
      this.logger.error('Failed to get executions by agent:', error);
      throw error;
    }
  }

  async getExecutionsByWallet(walletAddress, limit = 10) {
    try {
      const executions = await this.db.collection('workflow_executions')
        .find({ walletAddress })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      
      return executions;
    } catch (error) {
      this.logger.error('Failed to get executions by wallet:', error);
      throw error;
    }
  }

  async updateExecution(executionId, updates) {
    try {
      const result = await this.db.collection('workflow_executions').updateOne(
        { executionId },
        { 
          $set: {
            ...updates,
            updatedAt: new Date()
          }
        }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      this.logger.error('Failed to update execution:', error);
      throw error;
    }
  }

  // Workflow Management Methods
  async createWorkflow(workflow) {
    try {
      const result = await this.db.collection('workflows').insertOne({
        ...workflow,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      this.logger.info('Workflow created', {
        workflowId: workflow.id,
        category: workflow.category
      });
      
      return result.insertedId;
    } catch (error) {
      this.logger.error('Failed to create workflow:', error);
      throw error;
    }
  }

  async getWorkflow(workflowId) {
    try {
      const workflow = await this.db.collection('workflows').findOne({
        id: workflowId
      });
      
      return workflow;
    } catch (error) {
      this.logger.error('Failed to get workflow:', error);
      throw error;
    }
  }

  async updateWorkflow(workflowId, updates) {
    try {
      const result = await this.db.collection('workflows').updateOne(
        { id: workflowId },
        { 
          $set: {
            ...updates,
            updatedAt: new Date()
          }
        }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      this.logger.error('Failed to update workflow:', error);
      throw error;
    }
  }

  async deleteWorkflow(workflowId) {
    try {
      const result = await this.db.collection('workflows').deleteOne({
        id: workflowId
      });
      
      this.logger.info('Workflow deleted', { workflowId });
      return result.deletedCount > 0;
    } catch (error) {
      this.logger.error('Failed to delete workflow:', error);
      throw error;
    }
  }

  async getWorkflowsByCategory(category) {
    try {
      const workflows = await this.db.collection('workflows')
        .find({ category })
        .sort({ createdAt: -1 })
        .toArray();
      
      return workflows;
    } catch (error) {
      this.logger.error('Failed to get workflows by category:', error);
      throw error;
    }
  }

  // HITL Approval Methods
  async createHITLApproval(approval) {
    try {
      const result = await this.db.collection('hitl_approvals').insertOne({
        ...approval,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      this.logger.info('HITL approval created', {
        executionId: approval.executionId
      });
      
      return result.insertedId;
    } catch (error) {
      this.logger.error('Failed to create HITL approval:', error);
      throw error;
    }
  }

  async getHITLApproval(executionId) {
    try {
      const approval = await this.db.collection('hitl_approvals').findOne({
        executionId
      });
      
      return approval;
    } catch (error) {
      this.logger.error('Failed to get HITL approval:', error);
      throw error;
    }
  }

  async updateHITLApproval(executionId, updates) {
    try {
      const result = await this.db.collection('hitl_approvals').updateOne(
        { executionId },
        { 
          $set: {
            ...updates,
            updatedAt: new Date()
          }
        }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      this.logger.error('Failed to update HITL approval:', error);
      throw error;
    }
  }

  async getPendingHITLApprovals() {
    try {
      const approvals = await this.db.collection('hitl_approvals')
        .find({ 
          status: 'pending',
          expiresAt: { $gt: new Date() }
        })
        .sort({ createdAt: -1 })
        .toArray();
      
      return approvals;
    } catch (error) {
      this.logger.error('Failed to get pending HITL approvals:', error);
      throw error;
    }
  }

  // Audit Logging Methods
  async logAuditEvent(event) {
    try {
      const auditLog = {
        ...event,
        _id: new ObjectId(),
        timestamp: new Date()
      };
      
      await this.db.collection('audit_logs').insertOne(auditLog);
      
      this.logger.info('Audit event logged', {
        action: event.action,
        walletAddress: event.walletAddress,
        agentId: event.agentId
      });
    } catch (error) {
      this.logger.error('Failed to log audit event:', error);
      // Don't throw error for audit logging failures
    }
  }

  async getAuditLogs(walletAddress, limit = 50) {
    try {
      const logs = await this.db.collection('audit_logs')
        .find({ walletAddress })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
      
      return logs;
    } catch (error) {
      this.logger.error('Failed to get audit logs:', error);
      throw error;
    }
  }

  async getAuditLogsByAgent(agentId, limit = 50) {
    try {
      const logs = await this.db.collection('audit_logs')
        .find({ agentId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
      
      return logs;
    } catch (error) {
      this.logger.error('Failed to get audit logs by agent:', error);
      throw error;
    }
  }

  // Analytics Methods
  async getWorkflowStats(agentId = null, timeRange = 30) {
    try {
      const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
      const matchStage = {
        createdAt: { $gte: startDate }
      };
      
      if (agentId) {
        matchStage.agentId = agentId;
      }
      
      const stats = await this.db.collection('workflow_executions').aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalExecutions: { $sum: 1 },
            successfulExecutions: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            failedExecutions: {
              $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
            },
            averageDuration: { $avg: '$duration' }
          }
        }
      ]).toArray();
      
      return stats[0] || {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        averageDuration: 0
      };
    } catch (error) {
      this.logger.error('Failed to get workflow stats:', error);
      throw error;
    }
  }

  async getAgentPerformance(agentId, timeRange = 30) {
    try {
      const startDate = new Date(Date.now() - timeRange * 24 * 60 * 60 * 1000);
      
      const performance = await this.db.collection('workflow_executions').aggregate([
        {
          $match: {
            agentId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$agentId',
            totalExecutions: { $sum: 1 },
            successfulExecutions: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            averageDuration: { $avg: '$duration' },
            lastExecution: { $max: '$createdAt' }
          }
        }
      ]).toArray();
      
      return performance[0] || null;
    } catch (error) {
      this.logger.error('Failed to get agent performance:', error);
      throw error;
    }
  }
}
