/**
 * Webhook Routes for N8N Integration
 * Handles webhook triggers and external integrations
 */

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import crypto from 'crypto';
import winston from 'winston';

const router = express.Router();

// Middleware for validation
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Middleware for webhook signature verification
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.get('X-Webhook-Signature');
  const secret = process.env.WEBHOOK_SECRET || 'decentramind-webhook-secret';
  
  if (!signature) {
    return res.status(401).json({
      error: 'Webhook signature required',
      code: 'SIGNATURE_REQUIRED'
    });
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({
      error: 'Invalid webhook signature',
      code: 'INVALID_SIGNATURE'
    });
  }
  
  next();
};

// Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/webhook-routes.log' })
  ]
});

// Generic webhook endpoint for agent triggers
router.post('/agent/:agentId', [
  param('agentId').isString().notEmpty(),
  body('workflowId').isString().notEmpty().withMessage('Workflow ID is required'),
  body('data').isObject().withMessage('Data payload is required'),
  body('source').optional().isString(),
  validateRequest,
  verifyWebhookSignature
], async (req, res) => {
  try {
    const { agentId } = req.params;
    const { workflowId, data, source = 'external' } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    logger.info('Agent webhook triggered', {
      agentId,
      workflowId,
      source,
      dataKeys: Object.keys(data)
    });
    
    // Execute workflow
    const result = await workflowService.executeWorkflow(
      workflowId,
      data,
      {
        agentId,
        source,
        webhook: true,
        timestamp: new Date()
      }
    );
    
    if (result.success) {
      logger.info('Agent webhook executed successfully', {
        agentId,
        workflowId,
        executionId: result.executionId
      });
      
      res.json({
        success: true,
        executionId: result.executionId,
        message: 'Workflow triggered successfully'
      });
    } else {
      logger.error('Agent webhook execution failed', {
        agentId,
        workflowId,
        error: result.error
      });
      
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Failed to process agent webhook:', error);
    res.status(500).json({
      error: 'Failed to process webhook',
      message: error.message
    });
  }
});

// Care Orchestrator specific webhooks
router.post('/care/orchestrator', [
  body('patientId').isString().notEmpty().withMessage('Patient ID is required'),
  body('action').isIn(['prior_auth', 'claim_processing', 'care_plan', 'medication_review']),
  body('data').isObject().withMessage('Patient data is required'),
  validateRequest,
  verifyWebhookSignature
], async (req, res) => {
  try {
    const { patientId, action, data } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    logger.info('Care Orchestrator webhook triggered', {
      patientId,
      action,
      dataKeys: Object.keys(data)
    });
    
    // Map action to workflow
    const workflowMap = {
      'prior_auth': 'care-prior-auth-workflow',
      'claim_processing': 'care-claim-processing-workflow',
      'care_plan': 'care-plan-generation-workflow',
      'medication_review': 'care-medication-review-workflow'
    };
    
    const workflowId = workflowMap[action];
    if (!workflowId) {
      return res.status(400).json({
        error: 'Invalid action',
        action,
        validActions: Object.keys(workflowMap)
      });
    }
    
    const result = await workflowService.executeWorkflow(
      workflowId,
      {
        patientId,
        action,
        ...data
      },
      {
        agentId: 'care-orchestrator',
        category: 'healthcare',
        source: 'care-webhook'
      }
    );
    
    res.json({
      success: result.success,
      executionId: result.executionId,
      message: `Care ${action} workflow triggered`
    });
  } catch (error) {
    logger.error('Failed to process care webhook:', error);
    res.status(500).json({
      error: 'Failed to process care webhook',
      message: error.message
    });
  }
});

// Autonomous CFO specific webhooks
router.post('/cfo/autonomous', [
  body('companyId').isString().notEmpty().withMessage('Company ID is required'),
  body('action').isIn(['audit', 'financial_analysis', 'compliance_check', 'report_generation']),
  body('data').isObject().withMessage('Financial data is required'),
  validateRequest,
  verifyWebhookSignature
], async (req, res) => {
  try {
    const { companyId, action, data } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    logger.info('Autonomous CFO webhook triggered', {
      companyId,
      action,
      dataKeys: Object.keys(data)
    });
    
    const workflowMap = {
      'audit': 'cfo-audit-workflow',
      'financial_analysis': 'cfo-analysis-workflow',
      'compliance_check': 'cfo-compliance-workflow',
      'report_generation': 'cfo-report-workflow'
    };
    
    const workflowId = workflowMap[action];
    if (!workflowId) {
      return res.status(400).json({
        error: 'Invalid action',
        action,
        validActions: Object.keys(workflowMap)
      });
    }
    
    const result = await workflowService.executeWorkflow(
      workflowId,
      {
        companyId,
        action,
        ...data
      },
      {
        agentId: 'autonomous-cfo',
        category: 'finance',
        source: 'cfo-webhook'
      }
    );
    
    res.json({
      success: result.success,
      executionId: result.executionId,
      message: `CFO ${action} workflow triggered`
    });
  } catch (error) {
    logger.error('Failed to process CFO webhook:', error);
    res.status(500).json({
      error: 'Failed to process CFO webhook',
      message: error.message
    });
  }
});

// TruthChain Logistics specific webhooks
router.post('/logistics/truthchain', [
  body('shipmentId').isString().notEmpty().withMessage('Shipment ID is required'),
  body('action').isIn(['verify', 'track', 'attest', 'compliance_check']),
  body('data').isObject().withMessage('Logistics data is required'),
  validateRequest,
  verifyWebhookSignature
], async (req, res) => {
  try {
    const { shipmentId, action, data } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    logger.info('TruthChain Logistics webhook triggered', {
      shipmentId,
      action,
      dataKeys: Object.keys(data)
    });
    
    const workflowMap = {
      'verify': 'logistics-verification-workflow',
      'track': 'logistics-tracking-workflow',
      'attest': 'logistics-attestation-workflow',
      'compliance_check': 'logistics-compliance-workflow'
    };
    
    const workflowId = workflowMap[action];
    if (!workflowId) {
      return res.status(400).json({
        error: 'Invalid action',
        action,
        validActions: Object.keys(workflowMap)
      });
    }
    
    const result = await workflowService.executeWorkflow(
      workflowId,
      {
        shipmentId,
        action,
        ...data
      },
      {
        agentId: 'truthchain-logistics',
        category: 'logistics',
        source: 'logistics-webhook'
      }
    );
    
    res.json({
      success: result.success,
      executionId: result.executionId,
      message: `Logistics ${action} workflow triggered`
    });
  } catch (error) {
    logger.error('Failed to process logistics webhook:', error);
    res.status(500).json({
      error: 'Failed to process logistics webhook',
      message: error.message
    });
  }
});

// Polyglot Security Auditor specific webhooks
router.post('/security/auditor', [
  body('projectId').isString().notEmpty().withMessage('Project ID is required'),
  body('action').isIn(['code_scan', 'vulnerability_check', 'compliance_audit', 'security_report']),
  body('data').isObject().withMessage('Security data is required'),
  validateRequest,
  verifyWebhookSignature
], async (req, res) => {
  try {
    const { projectId, action, data } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    logger.info('Polyglot Security Auditor webhook triggered', {
      projectId,
      action,
      dataKeys: Object.keys(data)
    });
    
    const workflowMap = {
      'code_scan': 'security-code-scan-workflow',
      'vulnerability_check': 'security-vulnerability-workflow',
      'compliance_audit': 'security-compliance-workflow',
      'security_report': 'security-report-workflow'
    };
    
    const workflowId = workflowMap[action];
    if (!workflowId) {
      return res.status(400).json({
        error: 'Invalid action',
        action,
        validActions: Object.keys(workflowMap)
      });
    }
    
    const result = await workflowService.executeWorkflow(
      workflowId,
      {
        projectId,
        action,
        ...data
      },
      {
        agentId: 'polyglot-security-auditor',
        category: 'security',
        source: 'security-webhook'
      }
    );
    
    res.json({
      success: result.success,
      executionId: result.executionId,
      message: `Security ${action} workflow triggered`
    });
  } catch (error) {
    logger.error('Failed to process security webhook:', error);
    res.status(500).json({
      error: 'Failed to process security webhook',
      message: error.message
    });
  }
});

// External system webhooks (EHR, Fintech, etc.)
router.post('/external/:system', [
  param('system').isIn(['ehr', 'fintech', 'blockchain', 'api']),
  body('event').isString().notEmpty().withMessage('Event type is required'),
  body('data').isObject().withMessage('Event data is required'),
  validateRequest,
  verifyWebhookSignature
], async (req, res) => {
  try {
    const { system } = req.params;
    const { event, data } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    logger.info('External system webhook triggered', {
      system,
      event,
      dataKeys: Object.keys(data)
    });
    
    // Map external system events to workflows
    const systemWorkflowMap = {
      'ehr': {
        'patient_admission': 'ehr-patient-admission-workflow',
        'discharge': 'ehr-discharge-workflow',
        'lab_results': 'ehr-lab-results-workflow'
      },
      'fintech': {
        'transaction': 'fintech-transaction-workflow',
        'account_update': 'fintech-account-workflow',
        'compliance_alert': 'fintech-compliance-workflow'
      },
      'blockchain': {
        'transaction_confirmed': 'blockchain-confirmation-workflow',
        'smart_contract_event': 'blockchain-contract-workflow',
        'token_transfer': 'blockchain-transfer-workflow'
      },
      'api': {
        'rate_limit': 'api-rate-limit-workflow',
        'error_alert': 'api-error-workflow',
        'usage_analytics': 'api-analytics-workflow'
      }
    };
    
    const workflowId = systemWorkflowMap[system]?.[event];
    if (!workflowId) {
      return res.status(400).json({
        error: 'Invalid event for system',
        system,
        event,
        validEvents: Object.keys(systemWorkflowMap[system] || {})
      });
    }
    
    const result = await workflowService.executeWorkflow(
      workflowId,
      {
        system,
        event,
        ...data
      },
      {
        agentId: `external-${system}`,
        category: 'external',
        source: `${system}-webhook`
      }
    );
    
    res.json({
      success: result.success,
      executionId: result.executionId,
      message: `External ${system} ${event} workflow triggered`
    });
  } catch (error) {
    logger.error('Failed to process external webhook:', error);
    res.status(500).json({
      error: 'Failed to process external webhook',
      message: error.message
    });
  }
});

// Webhook status and health check
router.get('/status', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    webhooks: {
      agent: '/webhooks/agent/:agentId',
      care: '/webhooks/care/orchestrator',
      cfo: '/webhooks/cfo/autonomous',
      logistics: '/webhooks/logistics/truthchain',
      security: '/webhooks/security/auditor',
      external: '/webhooks/external/:system'
    }
  });
});

// Webhook test endpoint (for development)
router.post('/test', [
  body('workflowId').isString().notEmpty(),
  body('data').isObject(),
  validateRequest
], async (req, res) => {
  try {
    const { workflowId, data } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    logger.info('Webhook test triggered', {
      workflowId,
      dataKeys: Object.keys(data)
    });
    
    const result = await workflowService.executeWorkflow(
      workflowId,
      data,
      {
        agentId: 'test-agent',
        category: 'test',
        source: 'test-webhook'
      }
    );
    
    res.json({
      success: result.success,
      executionId: result.executionId,
      message: 'Test webhook executed'
    });
  } catch (error) {
    logger.error('Failed to process test webhook:', error);
    res.status(500).json({
      error: 'Failed to process test webhook',
      message: error.message
    });
  }
});

export default router;
