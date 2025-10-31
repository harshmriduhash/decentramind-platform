import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  AccountBalance as WalletIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const SessionStatus: React.FC = () => {
  const { session, isLoading, error, refreshSession, logout } = useAuth();

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getPermissionColor = (permission: string) => {
    const colors: { [key: string]: 'success' | 'warning' | 'info' | 'default' } = {
      'can_mint_agents': 'success',
      'can_evolve_agents': 'warning',
      'can_create_proposals': 'info',
      'can_vote': 'info',
      'can_view_agents': 'default',
    };
    return colors[permission] || 'default';
  };

  const getPermissionIcon = (permission: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'can_mint_agents': '🤖',
      'can_evolve_agents': '⚡',
      'can_create_proposals': '📋',
      'can_vote': '🗳️',
      'can_view_agents': '👁️',
    };
    return icons[permission] || '🔑';
  };

  if (!session.isAuthenticated) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6">Not Connected</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Connect your Solana wallet to access DecentraMind features.
          </Typography>
          <WalletMultiButton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="h6">Connected</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Refresh session">
              <IconButton 
                size="small" 
                onClick={refreshSession}
                disabled={isLoading}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Disconnect wallet">
              <IconButton size="small" onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Loading state */}
        {isLoading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography variant="caption" color="text.secondary">
              Refreshing session...
            </Typography>
          </Box>
        )}

        {/* Error state */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Wallet Information */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Wallet Address
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WalletIcon fontSize="small" color="action" />
            <Typography variant="body2" fontFamily="monospace">
              {session.walletAddress ? formatWalletAddress(session.walletAddress) : 'Unknown'}
            </Typography>
          </Box>
        </Box>

        {/* Balances */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Balances
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip 
              label={`${session.balance.toFixed(4)} SOL`}
              size="small"
              variant="outlined"
            />
            <Chip 
              label={`${session.dmtBalance.toFixed(0)} DMT`}
              size="small"
              variant="outlined"
              color="primary"
            />
          </Box>
        </Box>

        {/* Permissions */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Permissions
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {session.permissions.length > 0 ? (
              session.permissions.map((permission) => (
                <Chip
                  key={permission}
                  label={permission.replace('can_', '').replace('_', ' ')}
                  size="small"
                  color={getPermissionColor(permission)}
                  icon={<span>{getPermissionIcon(permission)}</span>}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No special permissions
              </Typography>
            )}
          </Box>
        </Box>

        {/* Session Info */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Session Info
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Session ID: {session.sessionId?.slice(0, 8)}...
            </Typography>
          </Box>
          {session.lastActive && (
            <Typography variant="caption" color="text.secondary" display="block">
              Last active: {new Date(session.lastActive).toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 