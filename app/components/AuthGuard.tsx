import React from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredPermissions?: string[];
  showConnectButton?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback,
  requiredPermissions = [],
  showConnectButton = true 
}) => {
  const { session, isLoading, error, checkPermissions } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 4 
      }}>
        <CircularProgress size={40} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Connecting to wallet...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        {showConnectButton && (
          <Box sx={{ textAlign: 'center' }}>
            <WalletMultiButton />
          </Box>
        )}
      </Box>
    );
  }

  // Check authentication
  if (!session.isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4,
        px: 3,
        maxWidth: 400,
        mx: 'auto'
      }}>
        <Typography variant="h5" gutterBottom>
          🔐 Wallet Connection Required
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Please connect your Solana wallet to access DecentraMind features.
        </Typography>
        
        {showConnectButton && (
          <Box sx={{ mb: 3 }}>
            <WalletMultiButton />
          </Box>
        )}
        
        <Typography variant="body2" color="text.secondary">
          Supported wallets: Phantom, Solflare
        </Typography>
      </Box>
    );
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && !checkPermissions(requiredPermissions)) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 4,
        px: 3,
        maxWidth: 400,
        mx: 'auto'
      }}>
        <Typography variant="h6" gutterBottom color="error">
          ⚠️ Insufficient Permissions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          You don't have the required permissions to access this feature.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Required: {requiredPermissions.join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Your permissions: {session.permissions.join(', ')}
        </Typography>
      </Box>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

// Specialized auth guards for different features
export const AgentMintingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requiredPermissions={['can_mint_agents']}>
    {children}
  </AuthGuard>
);

export const AgentEvolutionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requiredPermissions={['can_evolve_agents']}>
    {children}
  </AuthGuard>
);

export const GovernanceGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requiredPermissions={['can_create_proposals', 'can_vote']}>
    {children}
  </AuthGuard>
);

export const ViewAgentsGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requiredPermissions={['can_view_agents']}>
    {children}
  </AuthGuard>
); 