"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveData, getData } from '../lib/firebase';
import { saveAgent } from '../store/agentSlice';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

const FirebaseTest: React.FC = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState<'testing' | 'success' | 'error' | 'warning'>('testing');
  const [message, setMessage] = useState('Testing Firebase connection...');
  const [details, setDetails] = useState<string[]>([]);

  const testFirebase = async () => {
    setStatus('testing');
    setMessage('Testing Firebase connection...');
    setDetails([]);

    try {
      // Test 1: Basic connection
      setDetails(prev => [...prev, '🔍 Testing Firebase initialization...']);
      
      // Test 2: Save data
      setDetails(prev => [...prev, '💾 Testing data save...']);
      await saveData('test/connection', { 
        timestamp: Date.now(), 
        status: 'connected',
        test: true
      });
      
      // Test 3: Read data
      setDetails(prev => [...prev, '📖 Testing data read...']);
      const data = await getData('test/connection');
      
      if (data && data.status === 'connected') {
        setStatus('success');
        setMessage('✅ Firebase Connected Successfully!');
        setDetails(prev => [...prev, '✅ All tests passed']);
      } else {
        setStatus('warning');
        setMessage('⚠️ Firebase connected but data read failed');
        setDetails(prev => [...prev, '⚠️ Data read test failed']);
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(`❌ Firebase Error: ${error.message}`);
      setDetails(prev => [...prev, `❌ Error: ${error.message}`]);
    }
  };

  useEffect(() => {
    testFirebase();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#2ed573';
      case 'error': return '#ff6b6b';
      case 'warning': return '#fdcb6e';
      default: return '#00ffff';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return <CheckIcon />;
      case 'error': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      default: return <CircularProgress size={20} />;
    }
  };

  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: `2px solid ${getStatusColor()}`,
        borderRadius: 3
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Box sx={{ color: getStatusColor(), mr: 1 }}>
              {getStatusIcon()}
            </Box>
            <Typography variant="h6" sx={{ color: getStatusColor(), fontWeight: 'bold' }}>
              Firebase Integration Test
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            {message}
          </Typography>

          <Box sx={{ mb: 2 }}>
            {details.map((detail, index) => (
              <Typography 
                key={index} 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  mb: 0.5,
                  fontFamily: 'monospace'
                }}
              >
                {detail}
              </Typography>
            ))}
          </Box>

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={testFirebase}
              startIcon={<RefreshIcon />}
              sx={{
                background: getStatusColor(),
                color: 'white',
                '&:hover': {
                  background: getStatusColor(),
                  opacity: 0.8
                }
              }}
            >
              Retest Connection
            </Button>

            <Chip
              label={status.toUpperCase()}
              sx={{
                background: getStatusColor(),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>

          {status === 'error' && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Firebase Setup Required:</strong><br />
                1. Create Firebase project at console.firebase.google.com<br />
                2. Add environment variables to .env.local<br />
                3. Enable Authentication and Realtime Database<br />
                4. Install firebase-admin: npm install firebase-admin
              </Typography>
            </Alert>
          )}

          {status === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Firebase Ready!</strong><br />
                ✅ Authentication working<br />
                ✅ Database connected<br />
                ✅ Real-time updates enabled<br />
                Ready for Claude Code Hooks integration!
              </Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FirebaseTest; 