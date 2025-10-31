"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Tooltip,
  IconButton,
  Badge,
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  CreditCard as CreditIcon,
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Psychology as BrainIcon,
  Upgrade as UpgradeIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Business as BusinessIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import SubscriptionService from '../services/subscriptionService';
import BurningService from '../services/burningService';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastNotifications';
import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

const EconomicStatusBar: React.FC = () => {
  const { publicKey } = useWallet();
  const { session } = useAuth();
  const { showToast } = useToast();
  
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [subscriptionTier, setSubscriptionTier] = useState<string>('None');
  const [totalBurned, setTotalBurned] = useState<number>(0);
  const [recentBurnAmount, setRecentBurnAmount] = useState<number>(0);
  const [dmtBalance, setDmtBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const subscriptionService = SubscriptionService;
  const burningService = BurningService;

  useEffect(() => {
    if (publicKey && session) {
      loadEconomicData();
      // Refresh every 30 seconds
      const interval = setInterval(loadEconomicData, 30000);
      return () => clearInterval(interval);
    }
  }, [publicKey, session]);

  const loadEconomicData = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const userId = publicKey.toBase58();
      
      // Load subscription data
      const subscription = await subscriptionService.getUserSubscription(userId);
      if (subscription) {
        setCreditBalance(subscription.creditsRemaining || 0);
        setSubscriptionTier(subscription.tier || 'None');
      }
      
      // Load burning data
      const burningMetrics = await burningService.getBurningMetrics();
      if (burningMetrics) {
        setTotalBurned(burningMetrics.totalBurned || 0);
        // Calculate recent burn (last 24 hours)
        const recentBurns = await burningService.getBurnEventsBySource('all');
        const last24Hours = recentBurns.filter(event => {
          const eventDate = new Date(event.timestamp);
          const now = new Date();
          return (now.getTime() - eventDate.getTime()) < 24 * 60 * 60 * 1000;
        });
        const recentTotal = last24Hours.reduce((sum, event) => sum + event.amount, 0);
        setRecentBurnAmount(recentTotal);
      }
      
      // Load token balances from wallet
      await loadTokenBalances();
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load economic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTokenBalances = async () => {
    if (!publicKey) return;
    
    try {
      // Get SOL balance
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
      const solBalance = await connection.getBalance(publicKey);
      setSolBalance(solBalance / LAMPORTS_PER_SOL);
      
      // Get DMT balance (placeholder - will be updated with real contract)
      // For now, using mock data until real contract is deployed
      const mockDmtBalance = Math.random() * 1000; // Mock DMT balance
      setDmtBalance(mockDmtBalance);
      
    } catch (error) {
      console.error('Failed to load token balances:', error);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'freemium':
        return '#6c757d';
      case 'basic':
        return '#007bff';
      case 'pro':
        return '#28a745';
      case 'enterprise':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'freemium':
        return <StarIcon />;
      case 'basic':
        return <TrendingUpIcon />;
      case 'pro':
        return <TrophyIcon />;
      case 'enterprise':
        return <BusinessIcon />;
      default:
        return <StarIcon />;
    }
  };

  const getCreditStatus = () => {
    if (creditBalance > 50) return 'high';
    if (creditBalance > 20) return 'medium';
    if (creditBalance > 5) return 'low';
    return 'critical';
  };

  const getCreditColor = () => {
    const status = getCreditStatus();
    switch (status) {
      case 'high':
        return '#28a745';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#fd7e14';
      case 'critical':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card sx={{ 
      background: 'rgba(25, 25, 25, 0.95)', 
      border: '2px solid #00ffff', 
      borderRadius: 2,
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      backdropFilter: 'blur(10px)',
    }}>
      <CardContent sx={{ py: 1 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Credit Balance */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <CreditIcon sx={{ color: getCreditColor(), mr: 1 }} />
              <Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {creditBalance}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Credits
                </Typography>
              </Box>
              {getCreditStatus() === 'critical' && (
                <Tooltip title="Low credit balance">
                  <Alert severity="warning" sx={{ ml: 1, py: 0, px: 1 }}>
                    !
                  </Alert>
                </Tooltip>
              )}
            </Box>
          </Grid>

          {/* Subscription Tier */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              {getTierIcon(subscriptionTier)}
              <Box sx={{ ml: 1 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  {subscriptionTier}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Tier
                </Typography>
              </Box>
              <Chip
                label={subscriptionTier.toUpperCase()}
                size="small"
                sx={{ 
                  ml: 1,
                  background: getTierColor(subscriptionTier),
                  color: 'white',
                  fontSize: '0.7rem'
                }}
              />
            </Box>
          </Grid>

          {/* Total Burned */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <FireIcon sx={{ color: '#ff6b6b', mr: 1 }} />
              <Box>
                <Typography variant="h6" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                  {totalBurned.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Total Burned
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Recent Burn (24h) */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <TrendingUpIcon sx={{ color: '#4ecdc4', mr: 1 }} />
              <Box>
                <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                  {recentBurnAmount.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  24h Burn
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* DMT Balance */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <WalletIcon sx={{ color: '#ffd700', mr: 1 }} />
              <Box>
                <Typography variant="h6" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                  {dmtBalance.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  DMT Balance
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* SOL Balance */}
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center">
              <BusinessIcon sx={{ color: '#00ffff', mr: 1 }} />
              <Box>
                <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                  {solBalance.toFixed(4)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  SOL Balance
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Refresh Button */}
          <Grid item xs={12} sm={12} md={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Last updated: {formatTimeAgo(lastUpdate)}
              </Typography>
              
              <Box display="flex" alignItems="center">
                {loading && (
                  <LinearProgress 
                    sx={{ 
                      width: 100, 
                      mr: 2,
                      '& .MuiLinearProgress-bar': { background: '#00ffff' }
                    }} 
                  />
                )}
                
                <Tooltip title="Refresh economic data">
                  <IconButton
                    onClick={loadEconomicData}
                    disabled={loading}
                    size="small"
                    sx={{ color: '#00ffff' }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Economic Alerts */}
        {getCreditStatus() === 'critical' && (
          <Alert 
            severity="warning" 
            sx={{ mt: 1, background: 'rgba(255, 193, 7, 0.1)' }}
          >
            Low credit balance! Consider upgrading your subscription or purchasing more credits.
          </Alert>
        )}

        {recentBurnAmount > 0 && (
          <Alert 
            severity="info" 
            sx={{ mt: 1, background: 'rgba(0, 255, 255, 0.1)' }}
          >
            {recentBurnAmount.toFixed(2)} DMT burned in the last 24 hours. Deflationary pressure active.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default EconomicStatusBar; 