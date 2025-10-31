"use client";

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { signInWithSolana } from '../lib/firebase';
import {
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const SolanaLoginButton: React.FC = () => {
  const { publicKey, signMessage, connect, connected, disconnect, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Monitor wallet state changes
  useEffect(() => {
    console.log('Wallet state changed:', {
      connected,
      publicKey: publicKey?.toBase58(),
      signMessage: !!signMessage,
      wallet: wallet?.adapter?.name
    });
  }, [connected, publicKey, signMessage, wallet]);

  // Debug wallet status
  console.log('Wallet status:', {
    connected,
    publicKey: publicKey?.toBase58(),
    signMessage: !!signMessage,
    wallet: wallet?.adapter?.name
  });

  const handleConnectWallet = async () => {
    try {
      console.log('Opening wallet modal...');
      setIsLoading(true);
      setErrorMessage('');
      setLoginStatus('idle');
      
      // Open the wallet modal
      setVisible(true);
      
      // Wait for user to select wallet
      setTimeout(async () => {
        console.log('Checking wallet connection status...');
        if (!connected) {
          console.log('Wallet not connected after modal, trying direct connection...');
          try {
            await connect();
            console.log('Direct connection successful');
            
            // Wait for connection to stabilize
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            if (!publicKey || !signMessage) {
              console.error('Wallet connected but not ready:', { 
                publicKey: !!publicKey, 
                signMessage: !!signMessage,
                connected,
                walletName: wallet?.adapter?.name
              });
              setErrorMessage('Wallet connected but not ready. Please try refreshing the page.');
              setLoginStatus('error');
            } else {
              console.log('Wallet fully ready!');
              setLoginStatus('idle');
            }
          } catch (error) {
            console.error('Direct connection failed:', error);
            setErrorMessage('Failed to connect wallet. Please make sure Phantom is unlocked and try again.');
            setLoginStatus('error');
          }
        } else {
          console.log('Wallet already connected');
          setLoginStatus('idle');
        }
      }, 3000);
    } catch (error) {
      console.error('Wallet modal failed:', error);
      setErrorMessage('Failed to open wallet modal. Please try again.');
      setLoginStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceConnect = async () => {
    try {
      console.log('Force connection attempt...');
      setIsLoading(true);
      setErrorMessage('');
      setLoginStatus('idle');
      
      // Try to connect directly
      console.log('Attempting direct connection...');
      await connect();
      console.log('Force connection successful');
      
      // Wait for connection to stabilize
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check if wallet is fully ready
      if (!publicKey || !signMessage) {
        console.error('Force connection succeeded but wallet not ready:', { 
          publicKey: !!publicKey, 
          signMessage: !!signMessage,
          connected,
          walletName: wallet?.adapter?.name
        });
        setErrorMessage('Wallet connected but not fully ready. Please try refreshing the page and connecting again.');
        setLoginStatus('error');
      } else {
        console.log('Force connection fully successful');
        setLoginStatus('idle');
      }
    } catch (error) {
      console.error('Force connection failed:', error);
      setErrorMessage('Force connection failed. Please check if Phantom is unlocked and on Devnet.');
      setLoginStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!connected || !publicKey || !signMessage) {
      setErrorMessage('Wallet not ready. Please connect your Phantom wallet first.');
      setLoginStatus('error');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setLoginStatus('loading');

      const message = `Log in to DecentraMind at ${new Date().toISOString()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      const response = await fetch('/api/auth/solana', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          signature: Array.from(signature),
          message,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API response data:', responseData);
      
      const { token } = responseData;

      if (!token) {
        throw new Error('No token received from API');
      }

      // Sign in to Firebase with the custom token
      const { getAuth, signInWithCustomToken } = await import('firebase/auth');
      const auth = getAuth();
      await signInWithCustomToken(auth, token);

      setLoginStatus('success');
      setSuccessMessage('Successfully logged in with Solana wallet!');
      setShowSuccessMessage(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
      }, 5000);

    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please try again.');
      setLoginStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setLoginStatus('idle');
    setErrorMessage('');
  };

  const handleRefreshAndConnect = async () => {
    try {
      console.log('Refreshing page and attempting connection...');
      setIsLoading(true);
      setErrorMessage('');
      
      // Store a flag in localStorage to indicate we're refreshing for connection
      localStorage.setItem('decentramind_wallet_refresh', 'true');
      
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Refresh failed:', error);
      setErrorMessage('Failed to refresh page. Please refresh manually.');
      setLoginStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we're returning from a refresh
  useEffect(() => {
    const wasRefreshing = localStorage.getItem('decentramind_wallet_refresh');
    if (wasRefreshing === 'true') {
      console.log('Returning from wallet refresh, attempting auto-connection...');
      localStorage.removeItem('decentramind_wallet_refresh');
      
      // Wait a bit then try to connect
      setTimeout(async () => {
        try {
          await connect();
          console.log('Auto-connection after refresh successful');
        } catch (error) {
          console.error('Auto-connection after refresh failed:', error);
        }
      }, 2000);
    }
  }, [connect]);

  // Cleanup effect to prevent multiple notifications
  useEffect(() => {
    if (loginStatus === 'success' && !showSuccessMessage) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessage('');
        setLoginStatus('idle');
      }, 5000);
    }
  }, [loginStatus, showSuccessMessage]);

  // Reset success message when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setShowSuccessMessage(false);
      setSuccessMessage('');
      setLoginStatus('idle');
    }
  }, [connected]);

  const getStatusColor = () => {
    switch (loginStatus) {
      case 'success': return '#2ed573';
      case 'error': return '#ff6b6b';
      default: return '#00ffff';
    }
  };

  const getStatusIcon = () => {
    switch (loginStatus) {
      case 'success': return <CheckIcon />;
      case 'error': return <ErrorIcon />;
      default: return <WalletIcon />;
    }
  };

  const testWalletConnection = () => {
    console.log('=== WALLET CONNECTION TEST ===');
    console.log('Connected:', connected);
    console.log('Public Key:', publicKey ? publicKey.toBase58() : 'Not available');
    console.log('Sign Message:', !!signMessage);
    console.log('Wallet:', wallet?.adapter?.name);
    console.log('Wallet Connected:', wallet?.adapter?.connected);
    console.log('Wallet Adapter:', wallet?.adapter);
    console.log('==============================');
  };

  // Test wallet connection on component mount
  useEffect(() => {
    testWalletConnection();
  }, [connected, publicKey, signMessage, wallet]);

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        🔗 Solana Wallet Authentication
      </Typography>

      {/* Main Login Button */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={connected ? handleLogin : handleConnectWallet}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : getStatusIcon()}
          sx={{
            background: getStatusColor(),
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            py: 1.5,
            px: 4,
            '&:hover': {
              background: getStatusColor(),
              opacity: 0.8
            }
          }}
        >
          {isLoading ? 'Connecting...' : connected ? 'Log In with Solana' : 'Select Wallet'}
        </Button>
      </Box>

      {/* Error Message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2, background: 'rgba(255, 107, 107, 0.1)', border: '1px solid #ff6b6b' }}>
          <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
            ❌ {errorMessage}
          </Typography>
        </Alert>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <Box sx={{ mt: 2 }}>
          <Alert 
            severity="success" 
            sx={{ 
              background: 'rgba(46, 213, 115, 0.1)', 
              border: '1px solid #2ed573',
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: '#2ed573'
              }
            }}
            onClose={() => {
              setShowSuccessMessage(false);
              setSuccessMessage('');
            }}
          >
            <Typography variant="body2" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
              🎉 {successMessage}
            </Typography>
            <Typography variant="caption" sx={{ color: '#2ed573', opacity: 0.8 }}>
              You can now access all DecentraMind features!
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Debug Information - Only show when not connected or when there are issues */}
      {(!connected || errorMessage) && (
        <>
          {/* Wallet Status */}
          <Box sx={{ mt: 3, p: 2, border: '1px solid #00ffff', borderRadius: 2, background: 'rgba(0, 212, 255, 0.05)' }}>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>🔗 Wallet Status:</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Connected: {connected ? '✅ Yes' : '❌ No'}<br />
              Public Key: {publicKey ? `✅ ${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-6)}` : '❌ Not available'}<br />
              Sign Message: {!!signMessage ? '✅ Available' : '❌ Not available'}<br />
              Wallet: {wallet?.adapter?.name || '❌ Not available'}
            </Typography>
          </Box>

          {/* Debug Information */}
          <Box sx={{ mt: 3, p: 2, border: '1px dashed #00ffff', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>🔍 Debug Information:</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Connected: {connected ? '✅ Yes' : '❌ No'}<br />
              Public Key: {publicKey ? '✅ Available' : '❌ Not available'}<br />
              Sign Message: {!!signMessage ? '✅ Available' : '❌ Not available'}<br />
              Wallet: {wallet?.adapter?.name || '❌ Not available'}<br />
              Network: Devnet
            </Typography>
          </Box>

          {/* Troubleshooting Steps */}
          <Box sx={{ mt: 3, p: 2, border: '1px dashed #ffcb6e', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: '#ffcb6e', mb: 1 }}>🔧 Troubleshooting Steps:</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              1. Make sure Phantom is unlocked (click the Phantom icon)<br />
              2. Switch Phantom to Devnet (Settings → Change Network → Devnet)<br />
              3. Allow popups for this site (check browser settings)<br />
              4. Try "Force Connect" button below<br />
              5. Refresh the page if needed
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={testWalletConnection}
              size="small"
              sx={{
                borderColor: '#ff6b6b',
                color: '#ff6b6b',
                '&:hover': {
                  borderColor: '#ff6b6b',
                  background: 'rgba(255, 107, 107, 0.1)'
                }
              }}
            >
              🔍 Test Wallet
            </Button>
            
            {!connected && (
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
                size="small"
                sx={{
                  borderColor: '#fdcb6e',
                  color: '#fdcb6e',
                  '&:hover': {
                    borderColor: '#fdcb6e',
                    background: 'rgba(253, 203, 110, 0.1)'
                  }
                }}
              >
                🔄 Refresh Page
              </Button>
            )}
            
            {!connected && (
              <Button
                variant="outlined"
                onClick={handleRefreshAndConnect}
                size="small"
                disabled={isLoading}
                sx={{
                  borderColor: '#00ffff',
                  color: '#00ffff',
                  '&:hover': {
                    borderColor: '#00cccc',
                    background: 'rgba(0, 212, 255, 0.1)'
                  }
                }}
              >
                🔄 Refresh & Connect
              </Button>
            )}
            
            {!connected && (
              <Button
                variant="outlined"
                onClick={() => {
                  console.log('Opening wallet modal manually...');
                  setVisible(true);
                }}
                size="small"
                sx={{
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  '&:hover': {
                    borderColor: '#ff6b6b',
                    background: 'rgba(255, 107, 107, 0.1)'
                  }
                }}
              >
                📱 Open Wallet Modal
              </Button>
            )}
          </Box>
        </>
      )}

      {/* Force Connect Button - Only show when not connected */}
      {!connected && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={handleForceConnect}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <WalletIcon />}
            sx={{
              borderColor: '#2ed573',
              color: '#2ed573',
              fontWeight: 'bold',
              '&:hover': {
                borderColor: '#2ed573',
                background: 'rgba(46, 213, 115, 0.1)'
              }
            }}
          >
            Force Connect
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SolanaLoginButton; 