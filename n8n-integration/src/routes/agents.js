/**
 * Agent Routes for N8N Integration
 * Handles agent-specific workflow operations
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

// Middleware for authentication
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
    new winston.transports.File({ filename: 'logs/agent-routes.log' })
  ]
});

// Get agent workflows
router.get('/:agentId/workflows', [
  param('agentId').isString().notEmpty(),
  query('category').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId } = req.params;
    const { category, limit = 10 } = req.query;
    const workflowService = req.app.locals.services.workflow;
    
    // Get workflows for specific agent
    const workflows = await workflowService.getWorkflows(category);
    const agentWorkflows = workflows.filter(workflow => 
      workflow.agentId === agentId || 
      workflow.category === category ||
      workflow.visibility === 'public'
    );
    
    const limitedWorkflows = agentWorkflows.slice(0, parseInt(limit));
    
    logger.info('Agent workflows retrieved', {
      agentId,
      category,
      count: limitedWorkflows.length,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      agentId,
      workflows: limitedWorkflows,
      total: agentWorkflows.length
    });
  } catch (error) {
    logger.error('Failed to get agent workflows:', error);
    res.status(500).json({
      error: 'Failed to retrieve agent workflows',
      message: error.message
    });
  }
});

// Execute agent workflow
router.post('/:agentId/workflows/:workflowId/execute', [
  param('agentId').isString().notEmpty(),
  param('workflowId').isString().notEmpty(),
  body('inputData').isObject().withMessage('Input data is required'),
  body('context').optional().isObject(),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId, workflowId } = req.params;
    const { inputData, context = {} } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    // Add agent context
    const executionContext = {
      ...context,
      agentId,
      walletAddress: req.walletAddress,
      source: 'agent-api'
    };
    
    logger.info('Agent workflow execution requested', {
      agentId,
      workflowId,
      walletAddress: req.walletAddress
    });
    
    const result = await workflowService.executeWorkflow(
      workflowId,
      inputData,
      executionContext
    );
    
    if (result.success) {
      logger.info('Agent workflow executed successfully', {
        agentId,
        workflowId,
        executionId: result.executionId,
        duration: result.duration
      });
      
      res.json({
        success: true,
        agentId,
        workflowId,
        executionId: result.executionId,
        result: result.result,
        duration: result.duration
      });
    } else {
      logger.error('Agent workflow execution failed', {
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
    logger.error('Failed to execute agent workflow:', error);
    res.status(500).json({
      error: 'Failed to execute agent workflow',
      message: error.message
    });
  }
});

// Get agent execution history
router.get('/:agentId/executions', [
  param('agentId').isString().notEmpty(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['running', 'completed', 'failed', 'pending']),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId } = req.params;
    const { limit = 10, status } = req.query;
    const workflowService = req.app.locals.services.workflow;
    
    let executions = await workflowService.getWorkflowExecutions(
      agentId,
      parseInt(limit)
    );
    
    // Filter by status if provided
    if (status) {
      executions = executions.filter(execution => execution.status === status);
    }
    
    // Filter by wallet address for security
    const userExecutions = executions.filter(
      execution => execution.walletAddress === req.walletAddress
    );
    
    logger.info('Agent executions retrieved', {
      agentId,
      status,
      count: userExecutions.length,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      agentId,
      executions: userExecutions,
      total: userExecutions.length,
      filters: { status }
    });
  } catch (error) {
    logger.error('Failed to get agent executions:', error);
    res.status(500).json({
      error: 'Failed to retrieve agent executions',
      message: error.message
    });
  }
});

// Get agent performance metrics
router.get('/:agentId/performance', [
  param('agentId').isString().notEmpty(),
  query('timeRange').optional().isInt({ min: 1, max: 365 }),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId } = req.params;
    const { timeRange = 30 } = req.query;
    const mongodbService = req.app.locals.services.mongodb;
    
    const performance = await mongodbService.getAgentPerformance(
      agentId,
      parseInt(timeRange)
    );
    
    if (!performance) {
      return res.status(404).json({
        error: 'Agent performance data not found',
        agentId
      });
    }
    
    logger.info('Agent performance retrieved', {
      agentId,
      timeRange,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      agentId,
      performance,
      timeRange: parseInt(timeRange)
    });
  } catch (error) {
    logger.error('Failed to get agent performance:', error);
    res.status(500).json({
      error: 'Failed to retrieve agent performance',
      message: error.message
    });
  }
});

// Create agent-specific workflow
router.post('/:agentId/workflows', [
  param('agentId').isString().notEmpty(),
  body('name').isString().notEmpty().withMessage('Workflow name is required'),
  body('category').isString().notEmpty().withMessage('Category is required'),
  body('description').optional().isString(),
  body('nodes').isArray().withMessage('Workflow nodes are required'),
  body('connections').isArray().withMessage('Workflow connections are required'),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId } = req.params;
    const workflowData = {
      ...req.body,
      agentId,
      createdBy: req.walletAddress,
      visibility: 'private'
    };
    
    const workflowService = req.app.locals.services.workflow;
    const workflow = await workflowService.createWorkflow(workflowData);
    
    logger.info('Agent workflow created', {
      agentId,
      workflowId: workflow.id,
      name: workflow.name,
      category: workflow.category,
      walletAddress: req.walletAddress
    });
    
    res.status(201).json({
      success: true,
      agentId,
      workflow
    });
  } catch (error) {
    logger.error('Failed to create agent workflow:', error);
    res.status(500).json({
      error: 'Failed to create agent workflow',
      message: error.message
    });
  }
});

// Update agent workflow
router.put('/:agentId/workflows/:workflowId', [
  param('agentId').isString().notEmpty(),
  param('workflowId').isString().notEmpty(),
  body('name').optional().isString(),
  body('description').optional().isString(),
  body('nodes').optional().isArray(),
  body('connections').optional().isArray(),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId, workflowId } = req.params;
    const updates = req.body;
    
    const workflowService = req.app.locals.services.workflow;
    const workflow = await workflowService.getWorkflow(workflowId);
    
    if (!workflow) {
      return res.status(404).json({
        error: 'Workflow not found',
        workflowId
      });
    }
    
    // Verify ownership and agent association
    if (workflow.createdBy !== req.walletAddress || workflow.agentId !== agentId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own agent workflows'
      });
    }
    
    const updatedWorkflow = await workflowService.updateWorkflow(workflowId, updates);
    
    logger.info('Agent workflow updated', {
      agentId,
      workflowId,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      agentId,
      workflow: updatedWorkflow
    });
  } catch (error) {
    logger.error('Failed to update agent workflow:', error);
    res.status(500).json({
      error: 'Failed to update agent workflow',
      message: error.message
    });
  }
});

// Delete agent workflow
router.delete('/:agentId/workflows/:workflowId', [
  param('agentId').isString().notEmpty(),
  param('workflowId').isString().notEmpty(),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId, workflowId } = req.params;
    const workflowService = req.app.locals.services.workflow;
    
    const workflow = await workflowService.getWorkflow(workflowId);
    if (!workflow) {
      return res.status(404).json({
        error: 'Workflow not found',
        workflowId
      });
    }
    
    // Verify ownership and agent association
    if (workflow.createdBy !== req.walletAddress || workflow.agentId !== agentId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own agent workflows'
      });
    }
    
    await workflowService.deleteWorkflow(workflowId);
    
    logger.info('Agent workflow deleted', {
      agentId,
      workflowId,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      message: 'Agent workflow deleted successfully'
    });
  } catch (error) {
    logger.error('Failed to delete agent workflow:', error);
    res.status(500).json({
      error: 'Failed to delete agent workflow',
      message: error.message
    });
  }
});

// Get agent workflow templates
router.get('/:agentId/templates', [
  param('agentId').isString().notEmpty(),
  query('category').optional().isString(),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId } = req.params;
    const { category } = req.query;
    const workflowService = req.app.locals.services.workflow;
    
    // Get template workflows
    const allWorkflows = await workflowService.getWorkflows(category);
    const templates = allWorkflows.filter(workflow => workflow.template === true);
    
    logger.info('Agent workflow templates retrieved', {
      agentId,
      category,
      count: templates.length,
      walletAddress: req.walletAddress
    });
    
    res.json({
      success: true,
      agentId,
      templates,
      total: templates.length
    });
  } catch (error) {
    logger.error('Failed to get agent workflow templates:', error);
    res.status(500).json({
      error: 'Failed to retrieve agent workflow templates',
      message: error.message
    });
  }
});

// Clone workflow template for agent
router.post('/:agentId/templates/:templateId/clone', [
  param('agentId').isString().notEmpty(),
  param('templateId').isString().notEmpty(),
  body('name').optional().isString(),
  validateRequest,
  authenticateRequest
], async (req, res) => {
  try {
    const { agentId, templateId } = req.params;
    const { name } = req.body;
    const workflowService = req.app.locals.services.workflow;
    
    // Get template workflow
    const template = await workflowService.getWorkflow(templateId);
    if (!template || !template.template) {
      return res.status(404).json({
        error: 'Template not found',
        templateId
      });
    }
    
    // Create new workflow based on template
    const workflowData = {
      ...template,
      id: undefined, // Let the service generate a new ID
      name: name || `${template.name} (Cloned)`,
      agentId,
      createdBy: req.walletAddress,
      template: false,
      visibility: 'private'
    };
    
    const workflow = await workflowService.createWorkflow(workflowData);
    
    logger.info('Agent workflow template cloned', {
      agentId,
      templateId,
      workflowId: workflow.id,
      walletAddress: req.walletAddress
    });
    
    res.status(201).json({
      success: true,
      agentId,
      templateId,
      workflow
    });
  } catch (error) {
    logger.error('Failed to clone agent workflow template:', error);
    res.status(500).json({
      error: 'Failed to clone workflow template',
      message: error.message
    });
  }
});

export default router;
