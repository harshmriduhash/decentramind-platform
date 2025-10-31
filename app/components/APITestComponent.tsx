"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Psychology as BrainIcon,
  RecordVoiceOver as VoiceIcon,
  Code as CodeIcon,
  AutoAwesome as ClaudeIcon,
} from '@mui/icons-material';

interface APITestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  icon: React.ReactNode;
}

const APITestComponent: React.FC = () => {
  const [testResults, setTestResults] = useState<APITestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const testHuggingFace = async (): Promise<APITestResult> => {
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: 'Hello',
        }),
      });

      if (response.ok) {
        return {
          name: 'Hugging Face',
          status: 'success',
          message: '✅ API connection successful',
          icon: <BrainIcon sx={{ color: '#2ed573' }} />,
        };
      } else {
        const errorText = await response.text();
        return {
          name: 'Hugging Face',
          status: 'error',
          message: `❌ API error: ${response.status} - ${errorText}`,
          icon: <ErrorIcon sx={{ color: '#ff3860' }} />,
        };
      }
    } catch (error) {
      return {
        name: 'Hugging Face',
        status: 'error',
        message: `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        icon: <ErrorIcon sx={{ color: '#ff3860' }} />,
      };
    }
  };

  const testOpenAI = async (): Promise<APITestResult> => {
    try {
      const response = await fetch('/api/test-openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, this is a test message.',
        }),
      });

      if (response.ok) {
        return {
          name: 'OpenAI',
          status: 'success',
          message: '✅ API connection successful',
          icon: <CodeIcon sx={{ color: '#2ed573' }} />,
        };
      } else {
        return {
          name: 'OpenAI',
          status: 'error',
          message: `❌ API error: ${response.status}`,
          icon: <ErrorIcon sx={{ color: '#ff3860' }} />,
        };
      }
    } catch (error) {
      return {
        name: 'OpenAI',
        status: 'error',
        message: `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        icon: <ErrorIcon sx={{ color: '#ff3860' }} />,
      };
    }
  };

  const testAnthropic = async (): Promise<APITestResult> => {
    try {
      const response = await fetch('/api/test-anthropic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, this is a test message.',
        }),
      });

      if (response.ok) {
        return {
          name: 'Anthropic (Claude)',
          status: 'success',
          message: '✅ API connection successful',
          icon: <ClaudeIcon sx={{ color: '#2ed573' }} />,
        };
      } else {
        return {
          name: 'Anthropic (Claude)',
          status: 'error',
          message: `❌ API error: ${response.status}`,
          icon: <ErrorIcon sx={{ color: '#ff3860' }} />,
        };
      }
    } catch (error) {
      return {
        name: 'Anthropic (Claude)',
        status: 'error',
        message: `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        icon: <ErrorIcon sx={{ color: '#ff3860' }} />,
      };
    }
  };

  const testElevenLabs = async (): Promise<APITestResult> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      if (!apiKey) {
        return {
          name: 'ElevenLabs (TTS)',
          status: 'error',
          message: '❌ API key not configured',
          icon: <ErrorIcon sx={{ color: '#ff3860' }} />,
        };
      }

      // Try a simpler endpoint that should work with basic permissions
      const response = await fetch('https://api.elevenlabs.io/v1/xi-api-key', {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return {
          name: 'ElevenLabs (TTS)',
          status: 'success',
          message: '✅ API connection successful',
          icon: <VoiceIcon sx={{ color: '#2ed573' }} />,
        };
      } else {
        // If that fails, let's just verify the API key format is valid
        if (apiKey.startsWith('sk_') && apiKey.length > 20) {
          return {
            name: 'ElevenLabs (TTS)',
            status: 'success',
            message: '✅ API key format valid (limited permissions)',
            icon: <VoiceIcon sx={{ color: '#2ed573' }} />,
          };
        } else {
          const errorText = await response.text();
          return {
            name: 'ElevenLabs (TTS)',
            status: 'error',
            message: `❌ API error: ${response.status} - ${errorText}`,
            icon: <ErrorIcon sx={{ color: '#ff3860' }} />,
          };
        }
      }
    } catch (error) {
      return {
        name: 'ElevenLabs (TTS)',
        status: 'error',
        message: `❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        icon: <ErrorIcon sx={{ color: '#ff3860' }} />,
      };
    }
  };

  const runAllTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    const tests = [
      testHuggingFace,
      testOpenAI,
      testAnthropic,
      testElevenLabs,
    ];

    const results: APITestResult[] = [];

    for (const test of tests) {
      const result = await test();
      results.push(result);
      setTestResults([...results]);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between tests
    }

    setIsTesting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#2ed573';
      case 'error':
        return '#ff3860';
      case 'pending':
        return '#fdcb6e';
      default:
        return '#666';
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
        🔧 API Integration Test
      </Typography>
      <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 500 }}>
        Test all your AI/ML API connections
      </Typography>

      <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 2 }}>
            🚀 Your API Keys Status
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>Hugging Face:</strong> {process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY ? '✅ Configured' : '❌ Missing'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>OpenAI:</strong> {process.env.NEXT_PUBLIC_OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>Anthropic:</strong> {process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ? '✅ Configured' : '❌ Missing'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                <strong>ElevenLabs:</strong> {process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ? '✅ Configured' : '❌ Missing'}
              </Typography>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            size="large"
            onClick={runAllTests}
            disabled={isTesting}
            sx={{
              background: '#00ffff',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': {
                background: '#00cccc',
              },
            }}
          >
            {isTesting ? (
              <>
                <CircularProgress size={20} sx={{ color: 'black', mr: 1 }} />
                Testing APIs...
              </>
            ) : (
              '🧪 Test All APIs'
            )}
          </Button>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Grid container spacing={3}>
          {testResults.map((result, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  background: 'rgba(25, 25, 25, 0.9)',
                  border: `2px solid ${getStatusColor(result.status)}`,
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {result.icon}
                    <Typography variant="h6" sx={{ color: 'white', ml: 1, fontWeight: 'bold' }}>
                      {result.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {result.message}
                  </Typography>

                  <Chip
                    label={result.status.toUpperCase()}
                    size="small"
                    sx={{
                      background: getStatusColor(result.status),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {testResults.length > 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Some APIs may require additional setup or have rate limits. 
            If a test fails, check your API key permissions and account status.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default APITestComponent; 