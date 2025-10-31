"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Button,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from './ToastNotifications';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  duration: number;
  progress: number;
  steps: WorkflowStep[];
  result?: any;
}

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
  result?: any;
}

const TestWorkflows: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: 'agent-analysis',
      name: 'Agent Performance Analysis',
      description: 'Analyze agent performance metrics and generate optimization recommendations',
      status: 'idle',
      duration: 0,
      progress: 0,
      steps: [
        { id: '1', name: 'Collect agent data', status: 'pending' },
        { id: '2', name: 'Analyze performance metrics', status: 'pending' },
        { id: '3', name: 'Generate recommendations', status: 'pending' },
        { id: '4', name: 'Create report', status: 'pending' },
      ],
    },
    {
      id: 'crypto-scan',
      name: 'Crypto Market Scan',
      description: 'Scan crypto markets for high-potential opportunities using AI analysis',
      status: 'idle',
      duration: 0,
      progress: 0,
      steps: [
        { id: '1', name: 'Fetch market data', status: 'pending' },
        { id: '2', name: 'Run AI analysis', status: 'pending' },
        { id: '3', name: 'Score opportunities', status: 'pending' },
        { id: '4', name: 'Generate alerts', status: 'pending' },
      ],
    },
    {
      id: 'portfolio-optimization',
      name: 'Portfolio Optimization',
      description: 'Optimize user portfolio based on risk tolerance and market conditions',
      status: 'idle',
      duration: 0,
      progress: 0,
      steps: [
        { id: '1', name: 'Analyze current portfolio', status: 'pending' },
        { id: '2', name: 'Assess risk profile', status: 'pending' },
        { id: '3', name: 'Generate optimization strategy', status: 'pending' },
        { id: '4', name: 'Execute rebalancing', status: 'pending' },
      ],
    },
  ]);

  const runWorkflow = async (workflowId: string) => {
    if (!connected) {
      showError('Please connect your wallet to run workflows');
      return;
    }

    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    // Update workflow status to running
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: 'running', progress: 0, duration: 0 }
        : w
    ));

    showInfo(`Starting ${workflow.name}...`);

    try {
      // Simulate workflow execution
      for (let i = 0; i < workflow.steps.length; i++) {
        const stepIndex = i;
        const step = workflow.steps[stepIndex];
        
        // Update step status to running
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId 
            ? {
                ...w,
                steps: w.steps.map((s, idx) => 
                  idx === stepIndex ? { ...s, status: 'running' } : s
                )
              }
            : w
        ));

        // Simulate step execution time
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        // Update step status to completed
        setWorkflows(prev => prev.map(w => 
          w.id === workflowId 
            ? {
                ...w,
                steps: w.steps.map((s, idx) => 
                  idx === stepIndex ? { ...s, status: 'completed', duration: 1000 + Math.random() * 2000 } : s
                ),
                progress: ((stepIndex + 1) / workflow.steps.length) * 100
              }
            : w
        ));
      }

      // Complete workflow
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { 
              ...w, 
              status: 'completed', 
              progress: 100,
              duration: 5000 + Math.random() * 3000,
              result: {
                success: true,
                message: `${workflow.name} completed successfully`,
                data: `Generated ${Math.floor(Math.random() * 50) + 10} insights`
              }
            }
          : w
      ));

      showSuccess(`${workflow.name} completed successfully!`);
    } catch (error) {
      setWorkflows(prev => prev.map(w => 
        w.id === workflowId 
          ? { 
              ...w, 
              status: 'error',
              result: {
                success: false,
                message: 'Workflow execution failed',
                error: 'Simulated error'
              }
            }
          : w
      ));
      showError(`${workflow.name} failed to execute`);
    }
  };

  const stopWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { ...w, status: 'idle', progress: 0, duration: 0 }
        : w
    ));
    showInfo('Workflow stopped');
  };

  const resetWorkflow = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId 
        ? { 
            ...w, 
            status: 'idle', 
            progress: 0, 
            duration: 0,
            steps: w.steps.map(s => ({ ...s, status: 'pending', duration: undefined, result: undefined })),
            result: undefined
          }
        : w
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return '#b0b0b0';
      case 'running': return '#0984e3';
      case 'completed': return '#2ed573';
      case 'error': return '#ff6b6b';
      default: return '#b0b0b0';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle': return <ScheduleIcon sx={{ color: '#b0b0b0' }} />;
      case 'running': return <CircularProgress size={20} sx={{ color: '#0984e3' }} />;
      case 'completed': return <CheckCircleIcon sx={{ color: '#2ed573' }} />;
      case 'error': return <ErrorIcon sx={{ color: '#ff6b6b' }} />;
      default: return <ScheduleIcon sx={{ color: '#b0b0b0' }} />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ 
          color: '#00ffff', 
          fontWeight: 'bold',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <AutoAwesomeIcon sx={{ fontSize: 40 }} />
          Test Workflows
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Simulate AI agent workflows and test system capabilities
        </Typography>
        
        {!connected && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Wallet Required:</strong> Please connect your wallet to run test workflows.
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Workflows */}
      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} md={6} lg={4} key={workflow.id}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: `2px solid ${getStatusColor(workflow.status)}`,
              borderRadius: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getStatusIcon(workflow.status)}
                  <Typography variant="h6" sx={{ color: '#ffffff', ml: 1, flex: 1 }}>
                    {workflow.name}
                  </Typography>
                  <Chip
                    label={workflow.status.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(workflow.status),
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>

                {/* Description */}
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
                  {workflow.description}
                </Typography>

                {/* Progress */}
                {workflow.status === 'running' && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#ffffff' }}>
                        Progress
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        {workflow.progress.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={workflow.progress} 
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#0984e3'
                        }
                      }}
                    />
                  </Box>
                )}

                {/* Steps */}
                <Box sx={{ mb: 3, flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                    Steps:
                  </Typography>
                  {workflow.steps.map((step, index) => (
                    <Box key={step.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ 
                        width: 20, 
                        height: 20, 
                        borderRadius: '50%', 
                        backgroundColor: step.status === 'completed' ? '#2ed573' :
                                        step.status === 'running' ? '#0984e3' :
                                        step.status === 'error' ? '#ff6b6b' : 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1
                      }}>
                        {step.status === 'completed' && <CheckCircleIcon sx={{ fontSize: 12, color: '#ffffff' }} />}
                        {step.status === 'running' && <CircularProgress size={12} sx={{ color: '#ffffff' }} />}
                        {step.status === 'error' && <ErrorIcon sx={{ fontSize: 12, color: '#ffffff' }} />}
                        {step.status === 'pending' && (
                          <Typography variant="caption" sx={{ color: '#ffffff', fontSize: '0.6rem' }}>
                            {index + 1}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: step.status === 'completed' ? '#2ed573' :
                               step.status === 'running' ? '#0984e3' :
                               step.status === 'error' ? '#ff6b6b' : '#b0b0b0',
                        flex: 1
                      }}>
                        {step.name}
                      </Typography>
                      {step.duration && (
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          {formatDuration(step.duration)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Result */}
                {workflow.result && (
                  <Alert 
                    severity={workflow.result.success ? 'success' : 'error'} 
                    sx={{ mb: 3 }}
                  >
                    <Typography variant="body2">
                      {workflow.result.message}
                    </Typography>
                    {workflow.result.data && (
                      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                        {workflow.result.data}
                      </Typography>
                    )}
                  </Alert>
                )}

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  {workflow.status === 'idle' && (
                    <Button
                      variant="contained"
                      startIcon={<PlayIcon />}
                      onClick={() => runWorkflow(workflow.id)}
                      disabled={!connected}
                      sx={{
                        backgroundColor: '#2ed573',
                        color: '#ffffff',
                        flex: 1,
                        '&:hover': { backgroundColor: '#26c965' }
                      }}
                    >
                      Run Workflow
                    </Button>
                  )}
                  
                  {workflow.status === 'running' && (
                    <Button
                      variant="contained"
                      startIcon={<StopIcon />}
                      onClick={() => stopWorkflow(workflow.id)}
                      sx={{
                        backgroundColor: '#ff6b6b',
                        color: '#ffffff',
                        flex: 1,
                        '&:hover': { backgroundColor: '#e55a5a' }
                      }}
                    >
                      Stop
                    </Button>
                  )}
                  
                  {(workflow.status === 'completed' || workflow.status === 'error') && (
                    <Button
                      variant="contained"
                      startIcon={<PlayIcon />}
                      onClick={() => resetWorkflow(workflow.id)}
                      sx={{
                        backgroundColor: '#0984e3',
                        color: '#ffffff',
                        flex: 1,
                        '&:hover': { backgroundColor: '#0770c4' }
                      }}
                    >
                      Run Again
                    </Button>
                  )}
                </Box>

                {/* Duration */}
                {workflow.duration > 0 && (
                  <Typography variant="caption" sx={{ color: '#b0b0b0', mt: 1, textAlign: 'center' }}>
                    Duration: {formatDuration(workflow.duration)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Workflow Statistics */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #fdcb6e',
        borderRadius: 2,
        mt: 4
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#fdcb6e', mb: 3 }}>
            Workflow Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  {workflows.filter(w => w.status === 'completed').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Completed Workflows
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  {workflows.filter(w => w.status === 'running').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Running Workflows
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  {workflows.filter(w => w.status === 'error').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Failed Workflows
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  {workflows.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Total Workflows
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TestWorkflows;

