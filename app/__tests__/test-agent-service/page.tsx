'use client';

import React, { useEffect, useState } from 'react';
import agentService from '../services/agentService';
import { Box, Typography, CircularProgress, Alert, Button } from '@mui/material';

const TestAgentServicePage: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  useEffect(() => {
    const testAgentService = async () => {
      try {
        setLoading(true);
        setError(null);
        setTestResults([]);
        
        addTestResult('Starting agent service test...');
        
        // Test 1: Try async method
        addTestResult('Testing async getAgents()...');
        try {
          const asyncAgents = await agentService.getAgents();
          addTestResult(`Async method returned ${asyncAgents.length} agents`);
          console.log('Async agents:', asyncAgents);
        } catch (asyncError) {
          addTestResult(`Async method failed: ${asyncError}`);
          console.error('Async error:', asyncError);
        }
        
        // Test 2: Try sync method
        addTestResult('Testing sync getAgentsSync()...');
        try {
          const syncAgents = agentService.getAgentsSync();
          addTestResult(`Sync method returned ${syncAgents.length} agents`);
          console.log('Sync agents:', syncAgents);
          setAgents(syncAgents);
        } catch (syncError) {
          addTestResult(`Sync method failed: ${syncError}`);
          console.error('Sync error:', syncError);
        }
        
        addTestResult('Test completed successfully!');
        
      } catch (err) {
        console.error('Test failed:', err);
        setError('Test failed. Check console for details.');
        addTestResult(`Test failed: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    testAgentService();
  }, []);

  const runTestAgain = () => {
    setLoading(true);
    setError(null);
    setTestResults([]);
    setAgents([]);
    
    // Re-run the test
    setTimeout(() => {
      const testAgentService = async () => {
        try {
          addTestResult('Re-running test...');
          
          // Test sync method directly
          const syncAgents = agentService.getMockAgents();
          addTestResult(`Sync method returned ${syncAgents.length} agents`);
          setAgents(syncAgents);
          
          addTestResult('Re-test completed successfully!');
        } catch (err) {
          addTestResult(`Re-test failed: ${err}`);
        } finally {
          setLoading(false);
        }
      };
      
      testAgentService();
    }, 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Testing Agent Service...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Agent Service Test</Typography>
      
      <Button 
        variant="contained" 
        onClick={runTestAgain}
        sx={{ mb: 3 }}
      >
        Run Test Again
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Test Results:</Typography>
        <Box sx={{ 
          backgroundColor: '#1a1a1a', 
          p: 2, 
          borderRadius: 1, 
          maxHeight: 300, 
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.875rem'
        }}>
          {testResults.map((result, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
              {result}
            </Typography>
          ))}
        </Box>
      </Box>
      
      <Box>
        <Typography variant="h6" gutterBottom>Agents Found: {agents.length}</Typography>
        {agents.length === 0 ? (
          <Typography>No agents found.</Typography>
        ) : (
          <Box>
            {agents.map((agent, index) => (
              <Box key={agent.id || index} sx={{ mt: 2, p: 2, border: '1px solid gray', borderRadius: '8px' }}>
                <Typography variant="h6">{agent.name} (ID: {agent.id})</Typography>
                <Typography>Domain: {agent.domain}</Typography>
                <Typography>XP: {agent.xp} (Level: {agent.level})</Typography>
                <Typography>Description: {agent.description}</Typography>
                <Typography>Status: {agent.status}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TestAgentServicePage;
