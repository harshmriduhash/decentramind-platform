'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

const SimpleTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [agents, setAgents] = useState<any[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  useEffect(() => {
    const runSimpleTest = () => {
      addTestResult('Starting simple test...');
      
      // Test 1: Basic JavaScript
      addTestResult('Testing basic JavaScript...');
      const testArray = [1, 2, 3];
      addTestResult(`Array length: ${testArray.length}`);
      
      // Test 2: Static agent data
      addTestResult('Testing static agent data...');
      const staticAgents = [
        {
          id: 'agent-cfo',
          name: 'Autonomous CFO',
          domain: 'Finance',
          xp: 2500,
          level: 5
        },
        {
          id: 'agent-care',
          name: 'Care Orchestrator',
          domain: 'Health',
          xp: 1200,
          level: 3
        },
        {
          id: 'agent-crypto',
          name: 'Crypto Alpha Assistant',
          domain: 'Crypto',
          xp: 0,
          level: 1
        }
      ];
      
      addTestResult(`Static agents created: ${staticAgents.length}`);
      setAgents(staticAgents);
      
      // Test 3: React state
      addTestResult('Testing React state...');
      addTestResult(`State updated with ${staticAgents.length} agents`);
      
      addTestResult('Simple test completed successfully!');
    };

    runSimpleTest();
  }, []);

  const runTestAgain = () => {
    setTestResults([]);
    setAgents([]);
    
    setTimeout(() => {
      addTestResult('Re-running simple test...');
      const staticAgents = [
        {
          id: 'agent-cfo',
          name: 'Autonomous CFO',
          domain: 'Finance',
          xp: 2500,
          level: 5
        },
        {
          id: 'agent-care',
          name: 'Care Orchestrator',
          domain: 'Health',
          xp: 1200,
          level: 3
        },
        {
          id: 'agent-crypto',
          name: 'Crypto Alpha Assistant',
          domain: 'Crypto',
          xp: 0,
          level: 1
        }
      ];
      
      setAgents(staticAgents);
      addTestResult(`Re-test completed with ${staticAgents.length} agents`);
    }, 100);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Simple Test Page</Typography>
      
      <Button 
        variant="contained" 
        onClick={runTestAgain}
        sx={{ mb: 3 }}
      >
        Run Test Again
      </Button>
      
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
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SimpleTestPage;




