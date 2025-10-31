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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Lock as LockIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  LocalFireDepartment as FireIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import SolanaService from '../services/solanaService';
import { useToast } from './ToastNotifications';

interface StakingTier {
  id: string;
  name: string;
  lockPeriod: number; // in months
  apy: number;
  minStake: number;
  rewardComposition: string;
  governanceRights: string[];
  color: string;
}

interface StakingPosition {
  id: string;
  tier: StakingTier;
  amount: number;
  startDate: Date;
  endDate: Date;
  rewards: number;
  status: 'active' | 'unlocking' | 'ready';
}

const STAKING_TIERS: StakingTier[] = [
  {
    id: 'tier_3m',
    name: 'Liquid Tier',
    lockPeriod: 3,
    apy: 9,
    minStake: 100,
    rewardComposition: '100% DMT',
    governanceRights: ['Standard DAO Voting'],
    color: '#4ecdc4'
  },
  {
    id: 'tier_6m',
    name: 'Moderate Tier',
    lockPeriod: 6,
    apy: 14,
    minStake: 500,
    rewardComposition: '100% DMT',
    governanceRights: ['Standard DAO Voting'],
    color: '#45b7d1'
  },
  {
    id: 'tier_12m',
    name: 'Core Tier',
    lockPeriod: 12,
    apy: 20,
    minStake: 1000,
    rewardComposition: '85% DMT + 15% XP/NFTs',
    governanceRights: ['Standard DAO Voting', 'Proposal Creation Rights'],
    color: '#ffd700'
  },
  {
    id: 'tier_24m',
    name: 'Loyalty Tier',
    lockPeriod: 24,
    apy: 28,
    minStake: 2500,
    rewardComposition: '70% DMT + 30% XP/NFTs',
    governanceRights: ['Standard DAO Voting', 'Proposal Creation Rights', 'Council Seats', 'DAO Moderation'],
    color: '#ff6b6b'
  }
];

const EnhancedStakingTab: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [stakingPositions, setStakingPositions] = useState<StakingPosition[]>([]);
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [selectedTier, setSelectedTier] = useState<StakingTier>(STAKING_TIERS[0]);
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalStats, setTotalStats] = useState({
    totalStaked: 0,
    totalRewards: 0,
    averageAPY: 0,
    activePositions: 0
  });

  useEffect(() => {
    if (connected && publicKey) {
      loadStakingData();
    }
  }, [connected, publicKey]);

  useEffect(() => {
    calculateTotalStats();
  }, [stakingPositions]);

  const loadStakingData = async () => {
    // Mock data for demonstration - replace with real blockchain calls
    const mockPositions: StakingPosition[] = [
      {
        id: 'pos_1',
        tier: STAKING_TIERS[1], // 6M tier
        amount: 5000,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-07-15'),
        rewards: 350,
        status: 'active'
      },
      {
        id: 'pos_2',
        tier: STAKING_TIERS[2], // 12M tier
        amount: 10000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2025-02-01'),
        rewards: 1200,
        status: 'active'
      }
    ];
    setStakingPositions(mockPositions);
  };

  const calculateTotalStats = () => {
    const totalStaked = stakingPositions.reduce((sum, pos) => sum + pos.amount, 0);
    const totalRewards = stakingPositions.reduce((sum, pos) => sum + pos.rewards, 0);
    const weightedAPY = stakingPositions.reduce((sum, pos) => sum + (pos.tier.apy * pos.amount), 0) / totalStaked || 0;
    
    setTotalStats({
      totalStaked,
      totalRewards,
      averageAPY: weightedAPY,
      activePositions: stakingPositions.filter(pos => pos.status === 'active').length
    });
  };

  const handleStake = async () => {
    if (!connected || !publicKey) {
      showError('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (amount < selectedTier.minStake) {
      showError(`Minimum stake for ${selectedTier.name} is ${selectedTier.minStake} DMT`);
      return;
    }

    setLoading(true);
    try {
      showInfo(`Initiating staking transaction for ${amount} DMT...`);
      
      // Create new staking position
      const newPosition: StakingPosition = {
        id: `pos_${Date.now()}`,
        tier: selectedTier,
        amount,
        startDate: new Date(),
        endDate: new Date(Date.now() + selectedTier.lockPeriod * 30 * 24 * 60 * 60 * 1000),
        rewards: 0,
        status: 'active'
      };

      // Simulate blockchain transaction with SolanaService
      const solanaService = SolanaService;
      const result = await solanaService.stakeTokens(amount);
      
      if (result.success) {
        setStakingPositions(prev => [...prev, newPosition]);
        showSuccess(`Successfully staked ${amount} DMT in ${selectedTier.name}! Transaction: ${result.signature}`);
        setShowStakeDialog(false);
        setStakeAmount('');
      } else {
        showError('Staking transaction failed');
      }
    } catch (error) {
      console.error('Staking error:', error);
      showError('Failed to stake tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async (position: StakingPosition) => {
    if (!connected || !publicKey) {
      showError('Please connect your wallet first');
      return;
    }

    const now = new Date();
    const canUnstake = now >= position.endDate;
    
    if (!canUnstake) {
      const daysLeft = Math.ceil((position.endDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
      showError(`Position is still locked for ${daysLeft} days`);
      return;
    }

    setLoading(true);
    try {
      showInfo(`Unstaking ${position.amount} DMT...`);
      
      // Simulate unstaking transaction
      const solanaService = SolanaService;
      const result = await solanaService.mintAgent(0.001); // Reusing for demo
      
      if (result.success) {
        setStakingPositions(prev => prev.filter(p => p.id !== position.id));
        showSuccess(`Successfully unstaked ${position.amount} DMT! Rewards: ${position.rewards} DMT`);
      }
    } catch (error) {
      console.error('Unstaking error:', error);
      showError('Failed to unstake tokens');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
        💎 Multi-Tier Staking Dashboard
      </Typography>
      
      <Typography variant="h6" sx={{ color: '#fff', mb: 4 }}>
        Stake DMT tokens across multiple tiers for optimized rewards and governance rights
      </Typography>

      {/* Overall Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #4ecdc4',
            borderRadius: 2
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <LockIcon sx={{ color: '#4ecdc4', mr: 1 }} />
                <Typography variant="h5" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                  {totalStats.totalStaked.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total Staked (DMT)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #ffd700',
            borderRadius: 2
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon sx={{ color: '#ffd700', mr: 1 }} />
                <Typography variant="h5" sx={{ color: '#ffd700', fontWeight: 'bold' }}>
                  {totalStats.totalRewards.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total Rewards (DMT)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #45b7d1',
            borderRadius: 2
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <StarIcon sx={{ color: '#45b7d1', mr: 1 }} />
                <Typography variant="h5" sx={{ color: '#45b7d1', fontWeight: 'bold' }}>
                  {totalStats.averageAPY.toFixed(1)}%
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Average APY
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #ff6b6b',
            borderRadius: 2
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountBalanceIcon sx={{ color: '#ff6b6b', mr: 1 }} />
                <Typography variant="h5" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                  {totalStats.activePositions}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Active Positions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Staking Tiers */}
      <Card sx={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #00ffff',
        borderRadius: 2,
        mb: 4
      }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              Staking Tiers
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setShowStakeDialog(true)}
              sx={{ 
                background: 'linear-gradient(45deg, #00ffff, #0080ff)',
                '&:hover': { background: 'linear-gradient(45deg, #0080ff, #00ffff)' }
              }}
            >
              Stake Tokens
            </Button>
          </Box>

          <Grid container spacing={3}>
            {STAKING_TIERS.map((tier) => (
              <Grid item xs={12} md={6} lg={3} key={tier.id}>
                <Card sx={{ 
                  background: `linear-gradient(135deg, ${tier.color}20 0%, ${tier.color}10 100%)`,
                  border: `1px solid ${tier.color}`,
                  borderRadius: 2,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: tier.color, fontWeight: 'bold', mb: 1 }}>
                      {tier.name}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h4" sx={{ color: tier.color, fontWeight: 'bold' }}>
                        {tier.apy}%
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        APY
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                        🔒 Lock Period: {tier.lockPeriod} months
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                        💰 Min Stake: {tier.minStake.toLocaleString()} DMT
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                        🎁 Rewards: {tier.rewardComposition}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                        Governance Rights:
                      </Typography>
                      {tier.governanceRights.map((right, index) => (
                        <Chip 
                          key={index}
                          label={right}
                          size="small"
                          sx={{ 
                            mr: 0.5, 
                            mb: 0.5,
                            background: `${tier.color}30`,
                            color: tier.color,
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Active Positions */}
      <Card sx={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: '1px solid #00ffff',
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
            Your Staking Positions
          </Typography>

          {stakingPositions.length === 0 ? (
            <Alert severity="info" sx={{ 
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              color: '#00ffff'
            }}>
              No active staking positions. Start staking to earn rewards and governance rights!
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ background: 'rgba(0, 0, 0, 0.5)' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Tier</TableCell>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>APY</TableCell>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Rewards</TableCell>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Days Left</TableCell>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stakingPositions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell>
                        <Chip 
                          label={position.tier.name}
                          sx={{ 
                            background: `${position.tier.color}30`,
                            color: position.tier.color
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {position.amount.toLocaleString()} DMT
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {position.tier.apy}%
                      </TableCell>
                      <TableCell sx={{ color: '#ffd700' }}>
                        {position.rewards.toLocaleString()} DMT
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {getDaysRemaining(position.endDate)} days
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={getDaysRemaining(position.endDate) > 0 || loading}
                          onClick={() => handleUnstake(position)}
                          sx={{ 
                            borderColor: position.tier.color,
                            color: position.tier.color,
                            '&:hover': { background: `${position.tier.color}20` }
                          }}
                        >
                          {getDaysRemaining(position.endDate) > 0 ? 'Locked' : 'Unstake'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Stake Dialog */}
      <Dialog open={showStakeDialog} onClose={() => setShowStakeDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ background: '#1a1a2e', color: '#00ffff' }}>
          Stake DMT Tokens
        </DialogTitle>
        <DialogContent sx={{ background: '#1a1a2e', color: 'white' }}>
          <FormControl component="fieldset" sx={{ mt: 2, mb: 3 }}>
            <FormLabel sx={{ color: '#00ffff', mb: 2 }}>Select Staking Tier</FormLabel>
            <RadioGroup
              value={selectedTier.id}
              onChange={(e) => setSelectedTier(STAKING_TIERS.find(t => t.id === e.target.value) || STAKING_TIERS[0])}
            >
              {STAKING_TIERS.map((tier) => (
                <FormControlLabel
                  key={tier.id}
                  value={tier.id}
                  control={<Radio sx={{ color: tier.color }} />}
                  label={
                    <Box>
                      <Typography sx={{ color: tier.color, fontWeight: 'bold' }}>
                        {tier.name} - {tier.apy}% APY
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {tier.lockPeriod} months lock, min {tier.minStake.toLocaleString()} DMT
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            label="Stake Amount (DMT)"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            type="number"
            sx={{ mb: 2 }}
            helperText={`Minimum: ${selectedTier.minStake.toLocaleString()} DMT`}
          />

          {selectedTier && (
            <Alert severity="info" sx={{ 
              background: `${selectedTier.color}20`,
              border: `1px solid ${selectedTier.color}`,
              color: selectedTier.color
            }}>
              <Typography variant="body2">
                <strong>{selectedTier.name}</strong> - Lock for {selectedTier.lockPeriod} months
                <br />Reward Composition: {selectedTier.rewardComposition}
                <br />Expected APY: {selectedTier.apy}%
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ background: '#1a1a2e' }}>
          <Button onClick={() => setShowStakeDialog(false)} sx={{ color: 'white' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleStake} 
            variant="contained"
            disabled={loading || !stakeAmount || parseFloat(stakeAmount) < selectedTier.minStake}
            sx={{ 
              background: 'linear-gradient(45deg, #00ffff, #0080ff)',
              '&:hover': { background: 'linear-gradient(45deg, #0080ff, #00ffff)' }
            }}
          >
            {loading ? 'Staking...' : 'Stake Tokens'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnhancedStakingTab; 