#!/usr/bin/env node

/**
 * Simplified DecentraMind N8N Integration Service
 * This is a simplified version that works without n8n for now
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import winston from 'winston';

// Load environment variables
dotenv.config();

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

class SimpleN8NIntegrationService {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    this.port = process.env.PORT || 3001;
    this.workflows = new Map();
    this.executions = new Map();
    
    this.initializeWorkflows();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketIO();
    this.setupErrorHandling();
  }

  initializeWorkflows() {
    // Initialize some mock workflows
    this.workflows.set('care-prior-auth-workflow', {
      id: 'care-prior-auth-workflow',
      name: 'Care Orchestrator - Prior Authorization Workflow',
      category: 'healthcare',
      description: 'Automates prior authorization requests for healthcare procedures',
      nodes: [
        { id: 'webhook', type: 'webhook', name: 'Prior Auth Webhook' },
        { id: 'validate', type: 'validate', name: 'Validate Input' },
        { id: 'fetch-patient', type: 'http', name: 'Fetch Patient Data' },
        { id: 'check-insurance', type: 'http', name: 'Check Insurance Coverage' },
        { id: 'ai-analysis', type: 'ai', name: 'AI Analysis' },
        { id: 'submit-auth', type: 'http', name: 'Submit Prior Auth' },
        { id: 'process-payment', type: 'blockchain', name: 'Process DMT Payment' },
        { id: 'send-notification', type: 'notification', name: 'Send Notification' }
      ],
      connections: [
        { from: 'webhook', to: 'validate' },
        { from: 'validate', to: 'fetch-patient' },
        { from: 'fetch-patient', to: 'check-insurance' },
        { from: 'check-insurance', to: 'ai-analysis' },
        { from: 'ai-analysis', to: 'submit-auth' },
        { from: 'submit-auth', to: 'process-payment' },
        { from: 'process-payment', to: 'send-notification' }
      ],
      template: true
    });

    this.workflows.set('cfo-audit-workflow', {
      id: 'cfo-audit-workflow',
      name: 'Autonomous CFO - Audit Workflow',
      category: 'finance',
      description: 'Automates financial audit processes and compliance checks',
      nodes: [
        { id: 'webhook', type: 'webhook', name: 'Audit Webhook' },
        { id: 'validate', type: 'validate', name: 'Validate Input' },
        { id: 'fetch-financial', type: 'http', name: 'Fetch Financial Data' },
        { id: 'fetch-banking', type: 'http', name: 'Fetch Banking Data' },
        { id: 'ai-audit', type: 'ai', name: 'AI Audit Analysis' },
        { id: 'compliance-check', type: 'http', name: 'Regulatory Compliance Check' },
        { id: 'generate-report', type: 'document', name: 'Generate Audit Report' },
        { id: 'create-attestation', type: 'blockchain', name: 'Create On-Chain Attestation' }
      ],
      connections: [
        { from: 'webhook', to: 'validate' },
        { from: 'validate', to: 'fetch-financial' },
        { from: 'validate', to: 'fetch-banking' },
        { from: 'fetch-financial', to: 'ai-audit' },
        { from: 'fetch-banking', to: 'ai-audit' },
        { from: 'ai-audit', to: 'compliance-check' },
        { from: 'compliance-check', to: 'generate-report' },
        { from: 'generate-report', to: 'create-attestation' }
      ],
      template: true
    });

    logger.info(`Initialized ${this.workflows.size} workflow templates`);
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Wallet-Address', 'X-Agent-ID']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        walletAddress: req.get('X-Wallet-Address'),
        agentId: req.get('X-Agent-ID')
      });
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        workflows: this.workflows.size,
        executions: this.executions.size
      });
    });

    // Get all workflows
    this.app.get('/api/workflows', (req, res) => {
      const workflows = Array.from(this.workflows.values());
      res.json({
        success: true,
        workflows,
        total: workflows.length
      });
    });

    // Get workflow by ID
    this.app.get('/api/workflows/:workflowId', (req, res) => {
      const { workflowId } = req.params;
      const workflow = this.workflows.get(workflowId);
      
      if (!workflow) {
        return res.status(404).json({
          error: 'Workflow not found',
          workflowId
        });
      }
      
      res.json({
        success: true,
        workflow
      });
    });

    // Execute workflow
    this.app.post('/api/workflows/:workflowId/execute', (req, res) => {
      const { workflowId } = req.params;
      const { inputData, context = {} } = req.body;
      const walletAddress = req.get('X-Wallet-Address');
      const agentId = req.get('X-Agent-ID');
      
      if (!walletAddress) {
        return res.status(401).json({
          error: 'Wallet address required',
          code: 'WALLET_REQUIRED'
        });
      }

      const workflow = this.workflows.get(workflowId);
      if (!workflow) {
        return res.status(404).json({
          error: 'Workflow not found',
          workflowId
        });
      }

      const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate workflow execution
      const execution = {
        executionId,
        workflowId,
        agentId,
        walletAddress,
        inputData,
        status: 'running',
        startTime: new Date(),
        result: null
      };

      this.executions.set(executionId, execution);

      // Simulate async execution
      setTimeout(() => {
        execution.status = 'completed';
        execution.endTime = new Date();
        execution.result = {
          success: true,
          data: {
            ...inputData,
            processed: true,
            timestamp: new Date().toISOString(),
            workflow: workflow.name
          }
        };
        
        // Emit to WebSocket clients
        this.io.emit('workflow-completed', {
          executionId,
          workflowId,
          agentId,
          walletAddress,
          result: execution.result
        });
      }, 2000);

      logger.info('Workflow execution started', {
        executionId,
        workflowId,
        agentId,
        walletAddress
      });

      res.json({
        success: true,
        executionId,
        message: 'Workflow execution started'
      });
    });

    // Get execution status
    this.app.get('/api/executions/:executionId', (req, res) => {
      const { executionId } = req.params;
      const execution = this.executions.get(executionId);
      
      if (!execution) {
        return res.status(404).json({
          error: 'Execution not found',
          executionId
        });
      }
      
      res.json({
        success: true,
        execution
      });
    });

    // Agent-specific webhooks
    this.app.post('/api/webhooks/agent/:agentId', (req, res) => {
      const { agentId } = req.params;
      const { workflowId, data } = req.body;
      
      logger.info('Agent webhook triggered', {
        agentId,
        workflowId,
        dataKeys: Object.keys(data || {})
      });

      res.json({
        success: true,
        message: 'Agent webhook processed',
        agentId,
        workflowId
      });
    });

    // Care Orchestrator webhook
    this.app.post('/api/webhooks/care/orchestrator', (req, res) => {
      const { patientId, action, data } = req.body;
      
      logger.info('Care Orchestrator webhook triggered', {
        patientId,
        action,
        dataKeys: Object.keys(data || {})
      });

      res.json({
        success: true,
        message: 'Care Orchestrator webhook processed',
        patientId,
        action
      });
    });

    // Autonomous CFO webhook
    this.app.post('/api/webhooks/cfo/autonomous', (req, res) => {
      const { companyId, action, data } = req.body;
      
      logger.info('Autonomous CFO webhook triggered', {
        companyId,
        action,
        dataKeys: Object.keys(data || {})
      });

      res.json({
        success: true,
        message: 'Autonomous CFO webhook processed',
        companyId,
        action
      });
    });

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        service: 'DecentraMind N8N Integration (Simplified)',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/health',
          workflows: '/api/workflows',
          execute: '/api/workflows/:id/execute',
          webhooks: '/api/webhooks/*'
        }
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
      });
    });
  }

  setupSocketIO() {
    this.io.on('connection', (socket) => {
      logger.info('Client connected:', socket.id);
      
      // Join agent-specific rooms
      socket.on('join-agent', (agentId) => {
        socket.join(`agent-${agentId}`);
        logger.info(`Client ${socket.id} joined agent room: ${agentId}`);
      });
      
      // Join user-specific rooms
      socket.on('join-user', (walletAddress) => {
        socket.join(`user-${walletAddress}`);
        logger.info(`Client ${socket.id} joined user room: ${walletAddress}`);
      });
      
      socket.on('disconnect', () => {
        logger.info('Client disconnected:', socket.id);
      });
    });
  }

  setupErrorHandling() {
    // Global error handler
    this.app.use((error, req, res, next) => {
      logger.error('Unhandled error:', error);
      
      res.status(error.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message,
        timestamp: new Date().toISOString(),
        path: req.path
      });
    });

    // Process error handlers
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  async start() {
    try {
      this.server.listen(this.port, () => {
        logger.info(`🚀 DecentraMind N8N Integration Service running on port ${this.port}`);
        logger.info(`📊 Health check: http://localhost:${this.port}/health`);
        logger.info(`🔗 API docs: http://localhost:${this.port}/api`);
        logger.info(`⚡ WebSocket: ws://localhost:${this.port}`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async stop() {
    logger.info('Shutting down services...');
    this.server.close(() => {
      logger.info('Server stopped');
      process.exit(0);
    });
  }
}

// Start the service
const service = new SimpleN8NIntegrationService();

// Graceful shutdown
process.on('SIGTERM', () => service.stop());
process.on('SIGINT', () => service.stop());

// Start the service
service.start().catch((error) => {
  logger.error('Failed to start service:', error);
  process.exit(1);
});

export default SimpleN8NIntegrationService;
