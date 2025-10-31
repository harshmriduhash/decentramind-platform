#!/usr/bin/env node

/**
 * DecentraMind N8N Integration Service
 * Main entry point for the N8N workflow orchestration service
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import winston from 'winston';

// Import services
import { WorkflowService } from './services/workflowService.js';
import { WebhookService } from './services/webhookService.js';
import { SolanaService } from './services/solanaService.js';
import { MongoDBService } from './services/mongodbService.js';
import { AuthService } from './services/authService.js';
import { NotificationService } from './services/notificationService.js';

// Import routes
import workflowRoutes from './routes/workflows.js';
import webhookRoutes from './routes/webhooks.js';
import agentRoutes from './routes/agents.js';
import healthRoutes from './routes/health.js';

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

class N8NIntegrationService {
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
    this.services = {};
    
    this.initializeServices();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketIO();
    this.setupErrorHandling();
  }

  async initializeServices() {
    try {
      logger.info('Initializing services...');
      
      // Initialize MongoDB
      this.services.mongodb = new MongoDBService();
      await this.services.mongodb.connect();
      
      // Initialize other services
      this.services.workflow = new WorkflowService(this.services.mongodb);
      this.services.webhook = new WebhookService(this.services.mongodb);
      this.services.solana = new SolanaService();
      this.services.auth = new AuthService(this.services.mongodb);
      this.services.notification = new NotificationService();
      
      // Initialize N8N
      await this.services.workflow.initializeN8N();
      
      logger.info('All services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      process.exit(1);
    }
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
    this.app.use('/health', healthRoutes);
    
    // API routes
    this.app.use('/api/workflows', workflowRoutes);
    this.app.use('/api/webhooks', webhookRoutes);
    this.app.use('/api/agents', agentRoutes);
    
    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        service: 'DecentraMind N8N Integration',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
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
      
      // Handle workflow status updates
      socket.on('workflow-status', (data) => {
        this.io.to(`agent-${data.agentId}`).emit('workflow-update', data);
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
    
    // Close database connections
    if (this.services.mongodb) {
      await this.services.mongodb.disconnect();
    }
    
    // Close server
    this.server.close(() => {
      logger.info('Server stopped');
      process.exit(0);
    });
  }
}

// Start the service
const service = new N8NIntegrationService();

// Graceful shutdown
process.on('SIGTERM', () => service.stop());
process.on('SIGINT', () => service.stop());

// Start the service
service.start().catch((error) => {
  logger.error('Failed to start service:', error);
  process.exit(1);
});

export default N8NIntegrationService;
