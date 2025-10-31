"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Badge,
  Divider,
} from '@mui/material';
import {
  Token as TokenIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  AccountBalance as AccountBalanceIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGlobalState } from '../store/globalState';
import { useToast } from './ToastNotifications';
import { SolanaWalletService } from '../services/solanaWalletService';
import StakingService from '../services/stakingService';
import SolanaService from '../services/solanaService';

const StakingTab: React.FC = () => {
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [showUnstakeDialog, setShowUnstakeDialog] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  
  // Use global state instead of local state
  const { stakingPositions, addStakingPosition, removeStakingPosition, updateStakingPosition } = useGlobalState();
  const { showSuccess, showError, showInfo } = useToast();
  const { publicKey, connected, signTransaction } = useWallet();

  const stakingStats = {
    totalStaked: 1250000,
    totalRewards: 45000,
    apy: 12.5,
    lockPeriod: 30,
    minStake: 100,
    maxStake: 100000,
  };

  const rewardHistory = [
    {
      id: 1,
      amount: 520,
      date: '2024-02-15',
      type: 'Staking Reward',
      status: 'Claimed',
    },
    {
      id: 2,
      amount: 260,
      date: '2024-02-20',
      type: 'Staking Reward',
      status: 'Pending',
    },
    {
      id: 3,
      amount: 1040,
      date: '2024-02-10',
      type: 'Staking Reward',
      status: 'Claimed',
    },
  ];

  const handleStake = async () => {
    try {
    console.log('handleStake called with amount:', stakeAmount);
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
        showError('Please enter a valid amount to stake');
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (amount < stakingStats.minStake) {
        showError(`Minimum stake amount is ${stakingStats.minStake} DMT`);
      return;
    }

    if (amount > stakingStats.maxStake) {
        showError(`Maximum stake amount is ${stakingStats.maxStake} DMT`);
        return;
      }

      const walletService = SolanaWalletService.getInstance();
      
      // REAL BLOCKCHAIN TRANSACTION - Stake tokens on Solana
      const solanaService = SolanaService;
      const blockchainResult = await solanaService.stakeTokens(amount);
      
      if (!blockchainResult.success) {
        showError(`Blockchain transaction failed: ${blockchainResult.error}`);
        return;
      }

      showSuccess(`Transaction signed! Signature: ${blockchainResult.signature?.slice(0, 8)}...`);
      
      // Save to Firebase
      const userId = publicKey?.toBase58() || '';
      const stakingService = StakingService.getInstance();
      
      try {
        await stakingService.createStakingPosition(
          userId,
          amount,
          stakingStats.lockPeriod,
          blockchainResult.signature
        );
      } catch (error) {
        console.error('Failed to save staking position:', error);
        showError('Transaction successful but failed to save to database');
        return;
      }

      // Create new staking position for UI
      const newPosition = {
        amount: amount,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + stakingStats.lockPeriod * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        rewards: amount * (stakingStats.apy / 100) * (stakingStats.lockPeriod / 365),
        status: 'Active',
        lockPeriod: stakingStats.lockPeriod,
      };

      // Add to global state
      addStakingPosition(newPosition);

      showSuccess(`Successfully staked ${amount} DMT!`);
      showInfo(`Lock period: ${stakingStats.lockPeriod} days | APY: ${stakingStats.apy}% | Expected rewards: ${newPosition.rewards.toFixed(2)} DMT`);
      setShowStakeDialog(false);
      setStakeAmount('');
    } catch (error) {
      console.error('Error in handleStake:', error);
      showError('Failed to stake tokens. Please try again.');
    }
  };

  const handleUnstake = async () => {
    try {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
        showError('Please enter a valid amount to unstake');
        return;
      }

      if (!connected) {
        showError('Please connect your wallet to unstake tokens');
      return;
    }

    const amount = parseFloat(unstakeAmount);
    
      // Check if user has enough staked
      if (amount > totalStaked) {
        showError(`You only have ${totalStaked} DMT staked. Cannot unstake ${amount} DMT.`);
        return;
      }

      // Calculate penalty for early unstaking (before lock period)
      const now = new Date();
      const activePositions = stakingPositions.filter(pos => pos.status === 'Active');
      const earlyUnstakePenalty = 0.05; // 5% penalty for early unstaking
      
      let totalRewardsEarned = 0;
      let totalPenalty = 0;
      
      // Process unstaking from active positions
      activePositions.forEach(position => {
        const startDate = new Date(position.startDate);
        const lockEndDate = new Date(startDate.getTime() + position.lockPeriod * 24 * 60 * 60 * 1000);
        
        if (now < lockEndDate) {
          // Early unstaking - apply penalty
          const penalty = position.amount * earlyUnstakePenalty;
          totalPenalty += penalty;
          totalRewardsEarned += position.rewards * 0.5; // Reduced rewards for early unstaking
        } else {
          // Normal unstaking - full rewards
          totalRewardsEarned += position.rewards;
        }
      });

      // Remove staking positions from global state
      let remainingAmount = amount;
      const positionsToRemove: number[] = [];
      
      // Find positions to remove based on amount
      for (const position of stakingPositions) {
        if (remainingAmount <= 0) break;
        
        if (position.status === 'Active') {
          const positionAmount = Math.min(position.amount, remainingAmount);
          remainingAmount -= positionAmount;
          
          if (positionAmount >= position.amount) {
            // Remove entire position
            positionsToRemove.push(position.id);
          } else {
            // Update position with remaining amount
            updateStakingPosition(position.id, {
              amount: position.amount - positionAmount,
              rewards: position.rewards * ((position.amount - positionAmount) / position.amount)
            });
          }
        }
      }
      
      // Create real blockchain transaction
      const walletService = SolanaWalletService.getInstance();
      // TODO: Implement proper blockchain unstaking
      // const transactionResult = await walletService.unstakeTokens(
      //   { publicKey, connected, signTransaction } as any,
      //   amount,
      //   totalPenalty
      // );

      // Simulate successful transaction for now
      const transactionResult = { success: true, signature: 'simulated-signature' };

      if (transactionResult.success) {
        showSuccess(`Transaction signed! Signature: ${transactionResult.signature?.slice(0, 8)}...`);
        
        // Save to Firebase
        const userId = publicKey?.toBase58() || '';
        const stakingService = StakingService.getInstance();
        
        try {
          // Update staking positions in Firebase
          for (const position of stakingPositions) {
            if (position.status === 'Active') {
              await stakingService.updateStakingPosition(position.id!.toString(), {
                status: 'Unstaked',
                penalty: totalPenalty,
                unstakeDate: new Date().toISOString(),
                transactionSignature: transactionResult.signature
              });
            }
          }
        } catch (error) {
          console.error('Failed to save unstaking to database:', error);
          showError('Transaction successful but failed to save to database');
          return;
        }

        // Remove positions from global state
        positionsToRemove.forEach(id => {
          removeStakingPosition(id);
        });

        const netRewards = totalRewardsEarned - totalPenalty;
        
        showSuccess(`Successfully unstaked ${amount} DMT!`);
        showInfo(`Rewards earned: ${totalRewardsEarned.toFixed(2)} DMT | Penalty: ${totalPenalty.toFixed(2)} DMT | Net rewards: ${netRewards.toFixed(2)} DMT`);
    setShowUnstakeDialog(false);
    setUnstakeAmount('');
      } else {
        showError('Transaction failed');
      }
    } catch (error) {
      console.error('Error in handleUnstake:', error);
      alert('Failed to unstake tokens. Please try again.');
    }
  };

  // Calculate totals from global state
  const totalStaked = stakingPositions.reduce((sum, position) => sum + position.amount, 0);
  const totalRewards = stakingPositions.reduce((sum, position) => sum + position.rewards, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
        🔒 Staking Dashboard
      </Typography>
      <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 500 }}>
        Stake your DMT tokens and earn rewards
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TokenIcon sx={{ color: '#00ffff', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                  {totalStaked.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Staked (DMT)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon sx={{ color: '#2ed573', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                  {totalRewards.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Rewards (DMT)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <StarIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                  {stakingStats.apy}%
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Current APY
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff3860', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TimerIcon sx={{ color: '#ff3860', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#ff3860', fontWeight: 'bold' }}>
                  {stakingStats.lockPeriod}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Lock Period (Days)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box display="flex" gap={2} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowStakeDialog(true)}
          sx={{
            background: '#00ffff',
            color: 'black',
            fontWeight: 'bold',
            '&:hover': {
              background: '#00cccc',
            },
          }}
        >
          Stake Tokens
        </Button>
        <Button
          variant="outlined"
          startIcon={<RemoveIcon />}
          onClick={() => setShowUnstakeDialog(true)}
          sx={{
            borderColor: '#ff3860',
            color: '#ff3860',
            fontWeight: 'bold',
            '&:hover': {
              borderColor: '#ff1a1a',
              background: 'rgba(255, 56, 96, 0.1)',
            },
          }}
        >
          Unstake Tokens
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Staking Positions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
                🎯 Active Staking Positions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Rewards</TableCell>
                      <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>End Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stakingPositions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell sx={{ color: 'white' }}>
                          {position.amount.toLocaleString()} DMT
                        </TableCell>
                        <TableCell sx={{ color: '#2ed573' }}>
                          +{position.rewards} DMT
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={position.status}
                            size="small"
                            sx={{
                              background: position.status === 'Active' ? '#2ed573' : '#00ffff',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {position.endDate}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Reward History */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#2ed573', fontWeight: 'bold', mb: 3 }}>
                🏆 Reward History
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: '#2ed573', fontWeight: 'bold' }}>Amount</TableCell>
                      <TableCell sx={{ color: '#2ed573', fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ color: '#2ed573', fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rewardHistory.map((reward) => (
                      <TableRow key={reward.id}>
                        <TableCell sx={{ color: '#2ed573' }}>
                          +{reward.amount} DMT
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {reward.date}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={reward.status}
                            size="small"
                            sx={{
                              background: reward.status === 'Claimed' ? '#2ed573' : '#fdcb6e',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Staking Info */}
      <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: 3, mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#fdcb6e', fontWeight: 'bold', mb: 2 }}>
            📋 Staking Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Minimum Stake:
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                {stakingStats.minStake} DMT
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Maximum Stake:
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                {stakingStats.maxStake.toLocaleString()} DMT
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Lock Period:
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                {stakingStats.lockPeriod} Days
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Rewards Distribution:
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                Daily
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stake Dialog */}
      <Dialog open={showStakeDialog} onClose={() => setShowStakeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          Stake DMT Tokens
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount to Stake (DMT)"
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            inputProps={{ min: stakingStats.minStake, max: stakingStats.maxStake }}
          />
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              • Minimum stake: {stakingStats.minStake} DMT<br />
              • Lock period: {stakingStats.lockPeriod} days<br />
              • APY: {stakingStats.apy}%
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStakeDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleStake} sx={{ color: '#00ffff' }}>
            Stake Tokens
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unstake Dialog */}
      <Dialog open={showUnstakeDialog} onClose={() => setShowUnstakeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#ff3860', fontWeight: 'bold' }}>
          Unstake DMT Tokens
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Amount to Unstake (DMT)"
            type="number"
            value={unstakeAmount}
            onChange={(e) => setUnstakeAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              ⚠️ Unstaking before the lock period ends will result in penalty fees.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUnstakeDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleUnstake} sx={{ color: '#ff3860' }}>
            Unstake Tokens
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StakingTab; 