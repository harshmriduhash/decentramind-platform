"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { tokenomicsService, StakingInfo, TokenBalance, ECONOMIC_MODEL } from '../services/tokenomicsService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastNotifications';

export const StakingDashboard: React.FC = () => {
  const { session } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [showUnstakeDialog, setShowUnstakeDialog] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [economicMetrics, setEconomicMetrics] = useState<any>(null);

  useEffect(() => {
    if (session.isAuthenticated && session.walletAddress) {
      loadStakingData();
    } else {
      // Show authentication required message instead of mock data
      setError('Please connect your wallet to view staking information');
    }
  }, [session.isAuthenticated, session.walletAddress]);

  const loadStakingData = async () => {
    if (!session.walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const [balance, staking, metrics] = await Promise.all([
        tokenomicsService.getTokenBalance(session.walletAddress),
        tokenomicsService.getStakingInfo(session.walletAddress),
        tokenomicsService.getEconomicMetrics()
      ]);

      setTokenBalance(balance);
      setStakingInfo(staking);
      setEconomicMetrics(metrics);
    } catch (error) {
      console.error('Failed to load staking data:', error);
      setError('Failed to load staking data');
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async () => {
    if (!session.walletAddress || !stakeAmount) return;

    const amount = parseFloat(stakeAmount);
    if (isNaN(amount) || amount <= 0) {
      showError('Please enter a valid amount');
      return;
    }

    if (amount < ECONOMIC_MODEL.staking.minStakeAmount) {
      showError(`Minimum stake amount is ${ECONOMIC_MODEL.staking.minStakeAmount} DMT`);
      return;
    }

    if (tokenBalance && amount > tokenBalance.dmt) {
      showError('Insufficient DMT balance');
      return;
    }

    setLoading(true);
    try {
      await tokenomicsService.stakeDmt(session.walletAddress, amount);
      showSuccess('DMT staked successfully!');
      setShowStakeDialog(false);
      setStakeAmount('');
      await loadStakingData();
    } catch (error) {
      console.error('Failed to stake DMT:', error);
      showError(error instanceof Error ? error.message : 'Failed to stake DMT');
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    if (!session.walletAddress || !stakingInfo) return;

    const amount = parseFloat(unstakeAmount);
    if (isNaN(amount) || amount <= 0) {
      showError('Please enter a valid amount');
      return;
    }

    if (amount > stakingInfo.stakedAmount) {
      showError('Cannot unstake more than staked amount');
      return;
    }

    const lockEndTime = new Date(stakingInfo.lockEndTime);
    if (lockEndTime > new Date()) {
      showError('Staking is still locked. Cannot unstake yet.');
      return;
    }

    setLoading(true);
    try {
      await tokenomicsService.unstakeDmt(session.walletAddress);
      showSuccess('DMT unstaked successfully!');
      setShowUnstakeDialog(false);
      setUnstakeAmount('');
      await loadStakingData();
    } catch (error) {
      console.error('Failed to unstake DMT:', error);
      showError(error instanceof Error ? error.message : 'Failed to unstake DMT');
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeRemaining = (lockEndTime: string): string => {
    const endTime = new Date(lockEndTime);
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) return 'Unlocked';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const calculateProgress = (lockEndTime: string): number => {
    const endTime = new Date(lockEndTime);
    const now = new Date();
    const total = ECONOMIC_MODEL.staking.lockPeriod;
    const elapsed = now.getTime() - (endTime.getTime() - total);
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const getApyColor = (apy: number): string => {
    if (apy >= 0.20) return '#4CAF50'; // Green for high APY
    if (apy >= 0.15) return '#8BC34A'; // Light green
    if (apy >= 0.12) return '#FFC107'; // Yellow
    return '#F44336'; // Red for low APY
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#00ffff' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2 }}>
          💰 Staking Dashboard
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={loadStakingData}
          sx={{ background: '#00ffff', color: 'black' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!session.isAuthenticated) {
    return (
      <Box>
        <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2 }}>
          💰 Staking Dashboard
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please connect your wallet to view staking information.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
        🏦 Staking Dashboard
      </Typography>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Token Balance Card */}
      {tokenBalance && (
        <Card sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
              💰 Token Balance
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                    {tokenBalance.dmt.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    DMT Available
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                    {tokenBalance.staked.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    DMT Staked
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    {tokenBalance.rewards.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Rewards
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: '#F44336', fontWeight: 'bold' }}>
                    {tokenBalance.penalties.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Penalties
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Staking Info Card */}
      {stakingInfo ? (
        <Card sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ffc107' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                🔒 Active Staking
              </Typography>
              <Chip
                label={`${stakingInfo.apy * 100}% APY`}
                sx={{ 
                  background: getApyColor(stakingInfo.apy),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Staked Amount
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                    {stakingInfo.stakedAmount.toLocaleString()} DMT
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Reward Amount
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    {stakingInfo.rewardAmount.toLocaleString()} DMT
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Lock Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {stakingInfo.canUnstake ? (
                      <UnlockIcon color="success" />
                    ) : (
                      <LockIcon color="warning" />
                    )}
                    <Typography variant="body1" color={stakingInfo.canUnstake ? 'success.main' : 'warning.main'}>
                      {stakingInfo.canUnstake ? 'Unlocked' : 'Locked'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Time Remaining
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                    {calculateTimeRemaining(stakingInfo.lockEndTime)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Lock Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(stakingInfo.lockEndTime)}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(45deg, #ffc107, #ff9800)'
                      }
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Global Stats
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Stakers: {stakingInfo.totalStakers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Staked: {stakingInfo.totalStaked.toLocaleString()} DMT
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => setShowUnstakeDialog(true)}
                disabled={!stakingInfo.canUnstake}
                sx={{ 
                  background: 'linear-gradient(45deg, #ffc107, #ff9800)',
                  color: 'black',
                  fontWeight: 'bold'
                }}
              >
                Unstake DMT
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ffc107' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <AccountBalanceIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Active Staking
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start staking DMT to earn rewards and participate in governance.
            </Typography>
            <Button
              variant="contained"
              onClick={() => setShowStakeDialog(true)}
              sx={{ 
                background: 'linear-gradient(45deg, #ffc107, #ff9800)',
                color: 'black',
                fontWeight: 'bold'
              }}
            >
              Start Staking
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Economic Metrics */}
      {economicMetrics && (
        <Card sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #4CAF50' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2, fontWeight: 'bold' }}>
              📊 Economic Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#00ffff' }}>
                    {economicMetrics.totalDmtSupply.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total DMT Supply
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#2ed573' }}>
                    {economicMetrics.circulatingSupply.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Circulating Supply
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#ffc107' }}>
                    {economicMetrics.totalStaked.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Staked
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#4CAF50' }}>
                    {(economicMetrics.averageAPY * 100).toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average APY
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Staking Info */}
      <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold' }}>
            ℹ️ Staking Information
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Minimum Stake Amount"
                secondary={`${ECONOMIC_MODEL.staking.minStakeAmount} DMT`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUpIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Base APY"
                secondary={`${(ECONOMIC_MODEL.staking.baseAPY * 100).toFixed(2)}%`}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TimerIcon color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Lock Period"
                secondary="30 days"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Reward Distribution"
                secondary="Every 24 hours"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Stake Dialog */}
      <Dialog open={showStakeDialog} onClose={() => setShowStakeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Stake DMT</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Staking locks your DMT for 30 days. You'll earn {ECONOMIC_MODEL.staking.baseAPY * 100}% APY.
          </Alert>
          
          <TextField
            fullWidth
            label="Amount to Stake (DMT)"
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            sx={{ mb: 2 }}
            helperText={`Minimum: ${ECONOMIC_MODEL.staking.minStakeAmount} DMT`}
          />
          
          {tokenBalance && (
            <Typography variant="body2" color="text.secondary">
              Available: {tokenBalance.dmt.toLocaleString()} DMT
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStakeDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleStake} 
            variant="contained"
            disabled={loading || !stakeAmount}
            sx={{ 
              background: 'linear-gradient(45deg, #ffc107, #ff9800)',
              color: 'black'
            }}
          >
            {loading ? <CircularProgress size={20} /> : 'Stake DMT'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unstake Dialog */}
      <Dialog open={showUnstakeDialog} onClose={() => setShowUnstakeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Unstake DMT</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Unstaking will return your DMT and accumulated rewards.
          </Alert>
          
          {stakingInfo && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Staked Amount: {stakingInfo.stakedAmount.toLocaleString()} DMT
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reward Amount: {stakingInfo.rewardAmount.toLocaleString()} DMT
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Return: {(stakingInfo.stakedAmount + stakingInfo.rewardAmount).toLocaleString()} DMT
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUnstakeDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUnstake} 
            variant="contained"
            disabled={loading}
            color="warning"
          >
            {loading ? <CircularProgress size={20} /> : 'Unstake DMT'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StakingDashboard; 