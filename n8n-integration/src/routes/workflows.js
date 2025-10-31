/**
 * Workflow Routes for N8N Integration
 * Handles workflow management and execution endpoints
 */

import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
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

// Middleware for authentication (simplified)
const authenticateRequest = (req, res, next) => {
  const walletAddress = req.get('X-Wallet-Address');
  const agentId = req.get('X-Agent-ID');
  
  if (!walletAddress) {
    return res.status(401).json({
      error: 'Wallet address required',
      code: 'WALLET_REQUIRED'
    });
  }
  
  req.walletAddress = walletAddress;
  req.agentId = agentId;
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
    new winston.transports.File({ filename: 'logs/workflow-routes.log' })
  ]
});

// Get all workflows
router.get('/', [
  query('category').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validateRequest
], async (req, res) => {
  try {
    const { category, limit = 10 } = req.query;
    
    // Get workflow service from app context
    const workflowService = req.app.locals.services.workflow;
    const workflows = await workflowService.getWorkflows(category);
    
    const limitedWorkflows = workflows.slice(0, parseInt(limit));
    
    logger.info('Workflows retrieved', {
      category,
      count: limitedWorkflows.length,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      workflows: limitedWorkflows,
      total: workflows.length
    });
  } catch (error) {
    logger.error('Failed to get workflows:', error);
    res.status(500).json({
      error: 'Failed to retrieve workflows',
      message: error.message
    });
  }
});

// Get workflow by ID
router.get('/:workflowId', [
  param('workflowId').isString().notEmpty(),
  validateRequest
], async (req, res) => {
  try {
    const { workflowId } = req.params;
    const workflowService = req.app.locals.services.workflow;
    
    const workflow = await workflowService.getWorkflow(workflowId);
    if (!workflow) {
      return res.status(404).json({
        error: 'Workflow not found',
        workflowId
      });
    }
    
    logger.info('Workflow retrieved', {
      workflowId,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      workflow
    });
  } catch (error) {
    logger.error('Failed to get workflow:', error);
    res.status(500).json({
      error: 'Failed to retrieve workflow',
      message: error.message
    });
  }
});

// Execute workflow
router.post('/:workflowId/execute', [
  param('workflowId').isString().notEmpty(),
  body('inputData').isObject().withMessage('Input data is required'),
  body('context').optional().isObject(),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { workflowId } = req.params;
    const { inputData, context = {} } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    // Add authentication context
    const executionContext = {
      ...context,
      agentId: req.agentId,
      walletAddress: req.walletAddress
    };
    
    logger.info('Workflow execution requested', {
      workflowId,
      agentId: req.agentId,
      walletAddress: req.walletAddress
    });
    
    const result = await workflowService.executeWorkflow(
      workflowId,
      inputData,
      executionContext
    );
    
    if (result.success) {
      logger.info('Workflow executed successfully', {
        workflowId,
        executionId: result.executionId,
        duration: result.duration
      });
      
      res.json({
        success: true,
        executionId: result.executionId,
        result: result.result,
        duration: result.duration
      });
    } else {
      logger.error('Workflow execution failed', {
        workflowId,
        error: result.error
      });
      
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    logger.error('Failed to execute workflow:', error);
    res.status(500).json({
      error: 'Failed to execute workflow',
      message: error.message
    });
  }
});

// Get workflow execution status
router.get('/executions/:executionId', [
  param('executionId').isString().notEmpty(),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { executionId } = req.params;
    const workflowService = req.app.locals.services.workflow;
    
    const execution = await workflowService.getWorkflowStatus(executionId);
    if (!execution) {
      return res.status(404).json({
        error: 'Execution not found',
        executionId
      });
    }
    
    // Verify ownership
    if (execution.walletAddress !== req.walletAddress) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own executions'
      });
    }
    
    logger.info('Execution status retrieved', {
      executionId,
      status: execution.status,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      execution
    });
  } catch (error) {
    logger.error('Failed to get execution status:', error);
    res.status(500).json({
      error: 'Failed to retrieve execution status',
      message: error.message
    });
  }
});

// Get workflow executions for agent
router.get('/agent/:agentId/executions', [
  param('agentId').isString().notEmpty(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId } = req.params;
    const { limit = 10 } = req.query;
    const workflowService = req.app.locals.services.workflow;
    
    const executions = await workflowService.getWorkflowExecutions(
      agentId,
      parseInt(limit)
    );
    
    // Filter by wallet address for security
    const userExecutions = executions.filter(
      execution => execution.walletAddress === req.walletAddress
    );
    
    logger.info('Agent executions retrieved', {
      agentId,
      count: userExecutions.length,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      executions: userExecutions,
      total: userExecutions.length
    });
  } catch (error) {
    logger.error('Failed to get agent executions:', error);
    res.status(500).json({
      error: 'Failed to retrieve agent executions',
      message: error.message
    });
  }
});

// Create new workflow
router.post('/', [
  body('name').isString().notEmpty().withMessage('Workflow name is required'),
  body('category').isString().notEmpty().withMessage('Category is required'),
  body('description').optional().isString(),
  body('nodes').isArray().withMessage('Workflow nodes are required'),
  body('connections').isArray().withMessage('Workflow connections are required'),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const workflowData = {
      ...req.body,
      createdBy: req.walletAddress,
      agentId: req.agentId
    };
    
    const workflowService = req.app.locals.services.workflow;
    const workflow = await workflowService.createWorkflow(workflowData);
    
    logger.info('Workflow created', {
      workflowId: workflow.id,
      name: workflow.name,
      category: workflow.category,
      walletAddress: req.walletAddress
    });
    
    res.status(201).json({
      success: true,
      workflow
    });
  } catch (error) {
    logger.error('Failed to create workflow:', error);
    res.status(500).json({
      error: 'Failed to create workflow',
      message: error.message
    });
  }
});

// Update workflow
router.put('/:workflowId', [
  param('workflowId').isString().notEmpty(),
  body('name').optional().isString(),
  body('description').optional().isString(),
  body('nodes').optional().isArray(),
  body('connections').optional().isArray(),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { workflowId } = req.params;
    const updates = req.body;
    
    const workflowService = req.app.locals.services.workflow;
    const workflow = await workflowService.getWorkflow(workflowId);
    
    if (!workflow) {
      return res.status(404).json({
        error: 'Workflow not found',
        workflowId
      });
    }
    
    // Verify ownership
    if (workflow.createdBy !== req.walletAddress) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own workflows'
      });
    }
    
    const updatedWorkflow = await workflowService.updateWorkflow(workflowId, updates);
    
    logger.info('Workflow updated', {
      workflowId,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      workflow: updatedWorkflow
    });
  } catch (error) {
    logger.error('Failed to update workflow:', error);
    res.status(500).json({
      error: 'Failed to update workflow',
      message: error.message
    });
  }
});

// Delete workflow
router.delete('/:workflowId', [
  param('workflowId').isString().notEmpty(),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { workflowId } = req.params;
    const workflowService = req.app.locals.services.workflow;
    
    const workflow = await workflowService.getWorkflow(workflowId);
    if (!workflow) {
      return res.status(404).json({
        error: 'Workflow not found',
        workflowId
      });
    }
    
    // Verify ownership
    if (workflow.createdBy !== req.walletAddress) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own workflows'
      });
    }
    
    await workflowService.deleteWorkflow(workflowId);
    
    logger.info('Workflow deleted', {
      workflowId,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      message: 'Workflow deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete workflow:', error);
    res.status(500).json({
      error: 'Failed to delete workflow',
      message: error.message
    });
  }
});

// HITL Approval endpoints
router.post('/executions/:executionId/approve', [
  param('executionId').isString().notEmpty(),
  body('approved').isBoolean().withMessage('Approval status is required'),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { executionId } = req.params;
    const { approved } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    const result = await workflowService.processHITLApproval(
      executionId,
      approved,
      req.walletAddress
    );
    
    logger.info('HITL approval processed', {
      executionId,
      approved,
      approverWallet: req.walletAddress
    });
    
    res.json({
      success: true,
      approval: result
    });
  } catch (error) {
    logger.error('Failed to process HITL approval:', error);
    res.status(500).json({
      error: 'Failed to process approval',
      message: error.message
    });
  }
});

export default router;
