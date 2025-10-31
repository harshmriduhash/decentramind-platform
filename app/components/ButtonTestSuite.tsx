"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Alert,
  Grid,
  Paper,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { 
  buttonTracker, 
  runButtonTests, 
  getButtonStatusSummary, 
  getButtonsByCategory,
  ButtonTestResult 
} from '../utils/buttonTracker';

const ButtonTestSuite: React.FC = () => {
  const [testResults, setTestResults] = useState<ButtonTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      const results = await runButtonTests();
      setTestResults(results);
      setLastRun(new Date());
    } catch (error) {
      console.error('Test suite error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: 'working' | 'broken' | 'pending') => {
    switch (status) {
      case 'working':
        return '#2ed573';
      case 'broken':
        return '#ff3860';
      case 'pending':
        return '#fdcb6e';
      default:
        return '#666';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'agent':
        return '#00ffff';
      case 'staking':
        return '#2ed573';
      case 'governance':
        return '#ff3860';
      case 'analytics':
        return '#fdcb6e';
      case 'communication':
        return '#9c27b0';
      default:
        return '#666';
    }
  };

  const summary = getButtonStatusSummary();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
        🔧 Button Functionality Test Suite
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00ffff' }}>
                Total Buttons
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {summary.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#2ed573' }}>
                Working
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {summary.working}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff3860' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ff3860' }}>
                Broken
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {summary.broken}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fdcb6e' }}>
                Success Rate
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {summary.successRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Control Panel */}
      <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={runAllTests}
              disabled={isRunning}
              sx={{
                background: '#00ffff',
                color: 'black',
                fontWeight: 'bold',
                '&:hover': {
                  background: '#00cccc',
                },
              }}
            >
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{ borderColor: '#00ffff', color: '#00ffff' }}
            >
              Refresh
            </Button>
            {lastRun && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Last run: {lastRun.toLocaleTimeString()}
              </Typography>
            )}
          </Box>
          
          {isRunning && (
            <Box sx={{ width: '100%' }}>
              <LinearProgress 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  '& .MuiLinearProgress-bar': {
                    background: '#00ffff',
                  },
                }} 
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Test Results by Category */}
      {['agent', 'staking', 'governance', 'analytics', 'communication'].map((category) => {
        const categoryButtons = getButtonsByCategory(category as any);
        const categoryResults = testResults.filter(result => 
          categoryButtons.some(button => button.id === result.id)
        );
        
        return (
          <Card key={category} sx={{ background: 'rgba(25, 25, 25, 0.9)', border: `2px solid ${getCategoryColor(category)}`, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: getCategoryColor(category), fontWeight: 'bold', mb: 2 }}>
                {category.charAt(0).toUpperCase() + category.slice(1)} Functions
              </Typography>
              
              <List>
                {categoryButtons.map((button) => {
                  const result = testResults.find(r => r.id === button.id);
                  const isWorking = result?.passed || button.status === 'working';
                  
                  return (
                    <ListItem key={button.id} sx={{ mb: 1 }}>
                      <ListItemIcon>
                        {isWorking ? (
                          <CheckCircleIcon sx={{ color: '#2ed573' }} />
                        ) : (
                          <ErrorIcon sx={{ color: '#ff3860' }} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={button.name}
                        secondary={button.description}
                        primaryTypographyProps={{ sx: { color: 'white', fontWeight: 'bold' } }}
                        secondaryTypographyProps={{ sx: { color: 'text.secondary' } }}
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={button.status}
                          size="small"
                          sx={{
                            background: getStatusColor(button.status),
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                        {result && (
                          <Tooltip title={`Tested: ${result.timestamp.toLocaleTimeString()}`}>
                            <IconButton size="small">
                              <InfoIcon sx={{ color: '#00ffff' }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        );
      })}

      {/* Detailed Results */}
      {testResults.length > 0 && (
        <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2 }}>
              Detailed Test Results
            </Typography>
            
            {testResults.map((result) => (
              <Alert
                key={result.id}
                severity={result.passed ? 'success' : 'error'}
                sx={{ mb: 1 }}
                action={
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {result.timestamp.toLocaleTimeString()}
                  </Typography>
                }
              >
                <Typography variant="body2">
                  <strong>{result.name}</strong>: {result.passed ? 'PASSED' : 'FAILED'}
                  {result.error && ` - ${result.error}`}
                </Typography>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ButtonTestSuite; 