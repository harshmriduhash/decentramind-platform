'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Snackbar,
  Tooltip,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  Schedule as ClockIcon,
  FlashOn as ZapIcon,
  Psychology as BrainIcon,
  AttachMoney as DollarSignIcon,
  Refresh as RefreshIcon,
  LocalHospital as HealthcareIcon,
  AccountBalance as FinanceIcon,
  AccountBalanceWallet as WalletIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { n8nService, Workflow, Execution } from '../services/n8nService';

// Interfaces are now imported from n8nService

export default function N8NIntegration() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [executionParams, setExecutionParams] = useState<string>('{}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [runningWorkflows, setRunningWorkflows] = useState<Set<string>>(new Set());
  const [walletConnected, setWalletConnected] = useState(false);
  const [dmtBalance, setDmtBalance] = useState(0);

  // Load workflows on component mount
  useEffect(() => {
    loadWorkflows();
    checkWalletConnection();
  }, []);

  const loadWorkflows = async () => {
    try {
      const workflows = await n8nService.getWorkflows();
      const workflowsWithSteps = workflows.map((workflow: Workflow) => ({
        ...workflow,
        steps: workflow.nodes?.length || 0,
        requiredTokens: n8nService.calculateTokenCost(workflow)
      }));
      setWorkflows(workflowsWithSteps);
    } catch (err) {
      console.error('Failed to load workflows:', err);
      setError('Failed to load workflows. Please check if the n8n service is running.');
    }
  };

  const checkWalletConnection = async () => {
    // Mock wallet connection check - replace with actual Solana wallet integration
    setWalletConnected(true);
    setDmtBalance(10); // Mock balance
  };

  const executeWorkflow = async (workflowId: string) => {
    if (!walletConnected) {
      setError('Please connect your wallet to execute workflows');
      return;
    }

    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    if (dmtBalance < (workflow.requiredTokens?.DMT || 0)) {
      setError(`Insufficient DMT balance. Required: ${workflow.requiredTokens?.DMT} DMT, Available: ${dmtBalance} DMT`);
      return;
    }

    setRunningWorkflows(prev => new Set([...prev, workflowId]));
    setError(null);
    setSuccess(null);

    try {
      const params = JSON.parse(executionParams);
      const execution = await n8nService.executeWorkflow(workflowId, {
        parameters: params,
        agentId: 'current-agent',
        walletAddress: 'current-wallet',
      });

      setSuccess(`Workflow "${workflow.name}" executed successfully!`);
      setExecutions(prev => [execution, ...prev]);
      loadWorkflows();
      // Update DMT balance after successful execution
      setDmtBalance(prev => prev - (workflow.requiredTokens?.DMT || 0));
    } catch (err: any) {
      setError(err.message || 'Failed to execute workflow');
    } finally {
      setRunningWorkflows(prev => {
        const newSet = new Set(prev);
        newSet.delete(workflowId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <ClockIcon sx={{ color: '#ffa726' }} />;
      case 'completed':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      case 'failed':
        return <XCircleIcon sx={{ color: '#f44336' }} />;
      default:
        return <ClockIcon sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'healthcare':
        return <HealthcareIcon sx={{ color: '#2196f3' }} />;
      case 'finance':
        return <FinanceIcon sx={{ color: '#4caf50' }} />;
      default:
        return <ZapIcon sx={{ color: '#9c27b0' }} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'healthcare':
        return '#2196f3';
      case 'finance':
        return '#4caf50';
      default:
        return '#9c27b0';
    }
  };

  const TabPanel = ({ children, value, index, ...other }: any) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box sx={{ p: 4, bgcolor: '#121212', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold' }}>
          🧠 Agent Workflows
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
          Execute AI-powered workflows and automate complex processes
        </Typography>
        
        {/* Wallet Status */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <Chip
            icon={<WalletIcon />}
            label={walletConnected ? `Connected (${dmtBalance} DMT)` : 'Not Connected'}
            color={walletConnected ? 'success' : 'error'}
            variant="outlined"
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadWorkflows}
            sx={{
              borderColor: '#00ffff',
              color: '#00ffff',
              '&:hover': { borderColor: '#00ffff', bgcolor: 'rgba(0, 255, 255, 0.1)' }
            }}
          >
            Refresh Workflows
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(244, 67, 54, 0.1)', border: '1px solid #f44336' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', border: '1px solid #4caf50' }}>
          {success}
        </Alert>
      )}

      <Card sx={{ bgcolor: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="🏥 Healthcare Agent" />
            <Tab label="💰 Finance Agent" />
            <Tab label="📊 All Workflows" />
            <Tab label="📈 Execution History" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {workflows.filter(w => w.category === 'healthcare').map((workflow) => (
              <Grid item xs={12} sm={6} md={4} key={workflow.id}>
                <Card sx={{ 
                  bgcolor: 'rgba(25, 25, 25, 0.9)', 
                  border: `2px solid ${getCategoryColor(workflow.category)}`,
                  position: 'relative',
                  overflow: 'visible'
                }}>
                  {runningWorkflows.has(workflow.id) && (
                    <LinearProgress 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0,
                        height: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#00ffff'
                        }
                      }} 
                    />
                  )}
                  
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCategoryIcon(workflow.category)}
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          {workflow.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={workflow.status}
                        color={workflow.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      {workflow.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Steps: {workflow.steps || 0} • Executions: {workflow.executions}
                      </Typography>
                      {workflow.lastExecuted && (
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Last Run: {new Date(workflow.lastExecuted).toLocaleString()}
                        </Typography>
                      )}
                    </Box>

                    {workflow.requiredTokens && (
                      <Box sx={{ pt: 2, borderTop: '1px solid #333', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Token Requirements:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                          {workflow.requiredTokens.DMT > 0 && (
                            <Chip 
                              label={`${workflow.requiredTokens.DMT} DMT`} 
                              size="small" 
                              variant="outlined"
                              color={dmtBalance >= workflow.requiredTokens.DMT ? 'success' : 'error'}
                            />
                          )}
                          {workflow.requiredTokens.DMTX > 0 && (
                            <Chip 
                              label={`${workflow.requiredTokens.DMTX} DMTX`} 
                              size="small" 
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={runningWorkflows.has(workflow.id) ? <CircularProgress size={16} /> : <PlayIcon />}
                      onClick={() => executeWorkflow(workflow.id)}
                      disabled={runningWorkflows.has(workflow.id) || !walletConnected || dmtBalance < (workflow.requiredTokens?.DMT || 0)}
                      sx={{
                        bgcolor: getCategoryColor(workflow.category),
                        '&:hover': { bgcolor: getCategoryColor(workflow.category), opacity: 0.8 },
                        '&:disabled': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                      }}
                      fullWidth
                    >
                      {runningWorkflows.has(workflow.id) ? 'Executing...' : 'Run Workflow'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {workflows.filter(w => w.category === 'finance').map((workflow) => (
              <Grid item xs={12} sm={6} md={4} key={workflow.id}>
                <Card sx={{ 
                  bgcolor: 'rgba(25, 25, 25, 0.9)', 
                  border: `2px solid ${getCategoryColor(workflow.category)}`,
                  position: 'relative',
                  overflow: 'visible'
                }}>
                  {runningWorkflows.has(workflow.id) && (
                    <LinearProgress 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0,
                        height: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#00ffff'
                        }
                      }} 
                    />
                  )}
                  
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCategoryIcon(workflow.category)}
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          {workflow.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={workflow.status}
                        color={workflow.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      {workflow.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Steps: {workflow.steps || 0} • Executions: {workflow.executions}
                      </Typography>
                      {workflow.lastExecuted && (
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Last Run: {new Date(workflow.lastExecuted).toLocaleString()}
                        </Typography>
                      )}
                    </Box>

                    {workflow.requiredTokens && (
                      <Box sx={{ pt: 2, borderTop: '1px solid #333', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Token Requirements:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                          {workflow.requiredTokens.DMT > 0 && (
                            <Chip 
                              label={`${workflow.requiredTokens.DMT} DMT`} 
                              size="small" 
                              variant="outlined"
                              color={dmtBalance >= workflow.requiredTokens.DMT ? 'success' : 'error'}
                            />
                          )}
                          {workflow.requiredTokens.DMTX > 0 && (
                            <Chip 
                              label={`${workflow.requiredTokens.DMTX} DMTX`} 
                              size="small" 
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={runningWorkflows.has(workflow.id) ? <CircularProgress size={16} /> : <PlayIcon />}
                      onClick={() => executeWorkflow(workflow.id)}
                      disabled={runningWorkflows.has(workflow.id) || !walletConnected || dmtBalance < (workflow.requiredTokens?.DMT || 0)}
                      sx={{
                        bgcolor: getCategoryColor(workflow.category),
                        '&:hover': { bgcolor: getCategoryColor(workflow.category), opacity: 0.8 },
                        '&:disabled': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                      }}
                      fullWidth
                    >
                      {runningWorkflows.has(workflow.id) ? 'Executing...' : 'Run Workflow'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {workflows.map((workflow) => (
              <Grid item xs={12} sm={6} md={4} key={workflow.id}>
                <Card sx={{ 
                  bgcolor: 'rgba(25, 25, 25, 0.9)', 
                  border: `2px solid ${getCategoryColor(workflow.category)}`,
                  position: 'relative',
                  overflow: 'visible'
                }}>
                  {runningWorkflows.has(workflow.id) && (
                    <LinearProgress 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0,
                        height: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#00ffff'
                        }
                      }} 
                    />
                  )}
                  
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getCategoryIcon(workflow.category)}
                        <Typography variant="h6" sx={{ color: 'white' }}>
                          {workflow.name}
                        </Typography>
                      </Box>
                      <Chip
                        label={workflow.status}
                        color={workflow.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      {workflow.description}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        Steps: {workflow.steps || 0} • Executions: {workflow.executions}
                      </Typography>
                      {workflow.lastExecuted && (
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Last Run: {new Date(workflow.lastExecuted).toLocaleString()}
                        </Typography>
                      )}
                    </Box>

                    {workflow.requiredTokens && (
                      <Box sx={{ pt: 2, borderTop: '1px solid #333', mb: 2 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          Token Requirements:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                          {workflow.requiredTokens.DMT > 0 && (
                            <Chip 
                              label={`${workflow.requiredTokens.DMT} DMT`} 
                              size="small" 
                              variant="outlined"
                              color={dmtBalance >= workflow.requiredTokens.DMT ? 'success' : 'error'}
                            />
                          )}
                          {workflow.requiredTokens.DMTX > 0 && (
                            <Chip 
                              label={`${workflow.requiredTokens.DMTX} DMTX`} 
                              size="small" 
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={runningWorkflows.has(workflow.id) ? <CircularProgress size={16} /> : <PlayIcon />}
                      onClick={() => executeWorkflow(workflow.id)}
                      disabled={runningWorkflows.has(workflow.id) || !walletConnected || dmtBalance < (workflow.requiredTokens?.DMT || 0)}
                      sx={{
                        bgcolor: getCategoryColor(workflow.category),
                        '&:hover': { bgcolor: getCategoryColor(workflow.category), opacity: 0.8 },
                        '&:disabled': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                      }}
                      fullWidth
                    >
                      {runningWorkflows.has(workflow.id) ? 'Executing...' : 'Run Workflow'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
            Execution History
          </Typography>
          {executions.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              No executions yet. Run a workflow to see history here.
            </Typography>
          ) : (
            <List>
              {executions.map((execution) => (
                <ListItem key={execution.id} sx={{ border: '1px solid #333', borderRadius: 1, mb: 1 }}>
                  <ListItemIcon>
                    {getStatusIcon(execution.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={`Workflow: ${execution.workflowId}`}
                    secondary={`Status: ${execution.status} • Started: ${new Date(execution.startTime).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>
      </Card>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        message={success}
      />
    </Box>
  );
}