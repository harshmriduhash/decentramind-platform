/**
 * Health Check Routes for N8N Integration
 * Provides health monitoring and system status endpoints
 */

import express from 'express';
import winston from 'winston';

const router = express.Router();

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/health.log' })
  ]
});

// Basic health check
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
    
    res.json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Detailed health check with service dependencies
router.get('/detailed', async (req, res) => {
  try {
    const services = req.app.locals.services || {};
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {}
    };
    
    // Check MongoDB
    if (services.mongodb) {
      try {
        await services.mongodb.connection?.admin().ping();
        health.services.mongodb = {
          status: 'healthy',
          connected: true
        };
      } catch (error) {
        health.services.mongodb = {
          status: 'unhealthy',
          connected: false,
          error: error.message
        };
        health.status = 'degraded';
      }
    } else {
      health.services.mongodb = {
        status: 'not_configured',
        connected: false
      };
    }
    
    // Check Redis (if configured)
    if (services.redis) {
      try {
        // Mock Redis check - in real implementation, ping Redis
        health.services.redis = {
          status: 'healthy',
          connected: true
        };
      } catch (error) {
        health.services.redis = {
          status: 'unhealthy',
          connected: false,
          error: error.message
        };
        health.status = 'degraded';
      }
    } else {
      health.services.redis = {
        status: 'not_configured',
        connected: false
      };
    }
    
    // Check Solana service
    if (services.solana) {
      try {
        const networkInfo = await services.solana.getNetworkInfo();
        health.services.solana = {
          status: 'healthy',
          connected: true,
          network: networkInfo.network,
          rpcEndpoint: networkInfo.rpcEndpoint
        };
      } catch (error) {
        health.services.solana = {
          status: 'unhealthy',
          connected: false,
          error: error.message
        };
        health.status = 'degraded';
      }
    } else {
      health.services.solana = {
        status: 'not_configured',
        connected: false
      };
    }
    
    // Check workflow service
    if (services.workflow) {
      try {
        const workflows = await services.workflow.getWorkflows();
        health.services.workflow = {
          status: 'healthy',
          connected: true,
          workflowCount: workflows.length
        };
      } catch (error) {
        health.services.workflow = {
          status: 'unhealthy',
          connected: false,
          error: error.message
        };
        health.status = 'degraded';
      }
    } else {
      health.services.workflow = {
        status: 'not_configured',
        connected: false
      };
    }
    
    // Check notification service
    if (services.notification) {
      try {
        const testResults = await services.notification.testNotificationChannels();
        health.services.notification = {
          status: 'healthy',
          connected: true,
          channels: testResults
        };
      } catch (error) {
        health.services.notification = {
          status: 'unhealthy',
          connected: false,
          error: error.message
        };
        health.status = 'degraded';
      }
    } else {
      health.services.notification = {
        status: 'not_configured',
        connected: false
      };
    }
    
    // Determine overall status
    const unhealthyServices = Object.values(health.services).filter(
      service => service.status === 'unhealthy'
    );
    
    if (unhealthyServices.length > 0) {
      health.status = 'degraded';
    }
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
    
  } catch (error) {
    logger.error('Detailed health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Readiness check
router.get('/ready', async (req, res) => {
  try {
    const services = req.app.locals.services || {};
    const readiness = {
      ready: true,
      timestamp: new Date().toISOString(),
      checks: {}
    };
    
    // Check if MongoDB is ready
    if (services.mongodb) {
      try {
        await services.mongodb.connection?.admin().ping();
        readiness.checks.mongodb = 'ready';
      } catch (error) {
        readiness.checks.mongodb = 'not_ready';
        readiness.ready = false;
      }
    } else {
      readiness.checks.mongodb = 'not_configured';
      readiness.ready = false;
    }
    
    // Check if workflow service is ready
    if (services.workflow) {
      try {
        await services.workflow.getWorkflows();
        readiness.checks.workflow = 'ready';
      } catch (error) {
        readiness.checks.workflow = 'not_ready';
        readiness.ready = false;
      }
    } else {
      readiness.checks.workflow = 'not_configured';
      readiness.ready = false;
    }
    
    const statusCode = readiness.ready ? 200 : 503;
    res.status(statusCode).json(readiness);
    
  } catch (error) {
    logger.error('Readiness check failed:', error);
    res.status(500).json({
      ready: false,
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Liveness check
router.get('/live', (req, res) => {
  res.json({
    alive: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    const services = req.app.locals.services || {};
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
    
    // Add workflow metrics
    if (services.workflow) {
      try {
        const workflows = await services.workflow.getWorkflows();
        metrics.workflows = {
          total: workflows.length,
          byCategory: workflows.reduce((acc, workflow) => {
            acc[workflow.category] = (acc[workflow.category] || 0) + 1;
            return acc;
          }, {})
        };
      } catch (error) {
        metrics.workflows = {
          error: error.message
        };
      }
    }
    
    // Add execution metrics
    if (services.mongodb) {
      try {
        const stats = await services.mongodb.getWorkflowStats();
        metrics.executions = stats;
      } catch (error) {
        metrics.executions = {
          error: error.message
        };
      }
    }
    
    res.json(metrics);
    
  } catch (error) {
    logger.error('Metrics collection failed:', error);
    res.status(500).json({
      error: 'Failed to collect metrics',
      message: error.message
    });
  }
});

// System information
router.get('/info', (req, res) => {
  res.json({
    service: 'DecentraMind N8N Integration',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

export default router;
