"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayIcon,
  School as SchoolIcon,
  Business as BusinessIcon,
  Science as ScienceIcon,
  Favorite as HealthIcon,
  Brush as CreativeIcon,
  Psychology as PsychologyIcon,
  Rocket as RocketIcon,
  Diamond as DiamondIcon,
  LocalFireDepartment as FireIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGlobalState } from '../store/globalState';
import { useToast } from './ToastNotifications';

const QuickActions: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  const { agents, userProgress, addAgent } = useGlobalState();
  
  const [showDailyClaim, setShowDailyClaim] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [claimAmount, setClaimAmount] = useState('50');

  const quickActions = [
    {
      title: 'Claim Daily XP',
      description: 'Get your daily XP bonus',
      icon: <StarIcon sx={{ color: '#fdcb6e' }} />,
      color: '#fdcb6e',
      action: () => handleDailyClaim(),
      available: connected
    },
    {
      title: 'Start Learning Session',
      description: 'Begin a focused learning session',
      icon: <SchoolIcon sx={{ color: '#00ffff' }} />,
      color: '#00ffff',
      action: () => handleStartLearningSession(),
      available: true
    },
    {
      title: 'Upgrade Agent',
      description: 'Level up your AI agent',
      icon: <TrendingUpIcon sx={{ color: '#2ed573' }} />,
      color: '#2ed573',
      action: () => handleUpgradeAgent(),
      available: agents.length > 0 && connected
    },
    {
      title: 'Stake Tokens',
      description: 'Earn rewards by staking',
      icon: <DiamondIcon sx={{ color: '#ff3860' }} />,
      color: '#ff3860',
      action: () => handleStakeTokens(),
      available: connected
    },
    {
      title: 'Create Proposal',
      description: 'Participate in DAO governance',
      icon: <TrophyIcon sx={{ color: '#9b59b6' }} />,
      color: '#9b59b6',
      action: () => handleCreateProposal(),
      available: connected
    },
    {
      title: 'Mint New Agent',
      description: 'Create a new AI agent',
      icon: <AutoAwesomeIcon sx={{ color: '#e74c3c' }} />,
      color: '#e74c3c',
      action: () => handleMintNewAgent(),
      available: connected
    }
  ];

  const leaderboardData = [
    { rank: 1, name: 'Alice', xp: 2500, avatar: 'A', streak: 15 },
    { rank: 2, name: 'Bob', xp: 2200, avatar: 'B', streak: 12 },
    { rank: 3, name: 'Charlie', xp: 1950, avatar: 'C', streak: 10 },
    { rank: 4, name: 'David', xp: 1800, avatar: 'D', streak: 8 },
    { rank: 5, name: 'Eve', xp: 1650, avatar: 'E', streak: 7 },
  ];

  const achievements = [
    { name: 'First Agent', description: 'Minted your first AI agent', earned: true },
    { name: 'Learning Streak', description: '7 days of learning sessions', earned: userProgress?.streakDays >= 7 },
    { name: 'Agent Evolution', description: 'Upgraded an agent to level 5', earned: agents.some(a => a.level >= 5) },
    { name: 'DAO Participant', description: 'Voted on your first proposal', earned: false },
    { name: 'Staking Master', description: 'Staked 1000+ tokens', earned: false },
  ];

  const handleDailyClaim = () => {
    if (!connected) {
      showError('Please connect your wallet to claim XP');
      return;
    }
    
    const amount = parseInt(claimAmount);
    if (isNaN(amount) || amount <= 0) {
      showError('Please enter a valid amount');
      return;
    }
    
    showSuccess(`Claimed ${amount} XP! Your daily bonus has been added.`);
    setShowDailyClaim(false);
    setClaimAmount('50');
  };

  const handleStartLearningSession = () => {
    showInfo('Starting focused learning session...');
    // TODO: Implement real learning session logic
    setTimeout(() => {
      showSuccess('Learning session started! Focus mode activated.');
    }, 1000);
  };

  const handleUpgradeAgent = () => {
    if (agents.length === 0) {
      showError('No agents available to upgrade');
      return;
    }
    
    showInfo('Opening agent upgrade interface...');
    // TODO: Navigate to agent management or open upgrade modal
    setTimeout(() => {
      showSuccess('Agent upgrade interface opened');
    }, 500);
  };

  const handleStakeTokens = () => {
    if (!connected) {
      showError('Please connect your wallet to stake tokens');
      return;
    }
    
    showInfo('Opening staking interface...');
    // TODO: Navigate to staking dashboard or open staking modal
    setTimeout(() => {
      showSuccess('Staking interface opened');
    }, 500);
  };

  const handleCreateProposal = () => {
    if (!connected) {
      showError('Please connect your wallet to create proposals');
      return;
    }
    
    showInfo('Opening proposal creation interface...');
    // TODO: Navigate to DAO governance or open proposal form
    setTimeout(() => {
      showSuccess('Proposal creation interface opened');
    }, 500);
  };

  const handleMintNewAgent = () => {
    if (!connected) {
      showError('Please connect your wallet to mint agents');
      return;
    }
    
    showInfo('Opening agent minting interface...');
    // TODO: Navigate to agent minting or open minting modal
    setTimeout(() => {
      showSuccess('Agent minting interface opened');
    }, 500);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
        ⚡ Quick Actions
      </Typography>

      {/* Quick Actions Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickActions.map((action, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ 
                background: 'rgba(25, 25, 25, 0.9)',
                border: `2px solid ${action.color}`,
                borderRadius: 3,
              height: '100%',
                transition: 'all 0.3s ease',
              opacity: action.available ? 1 : 0.5,
              '&:hover': action.available ? {
                transform: 'translateY(-5px)',
                boxShadow: `0 10px 30px ${action.color}40`
              } : {}
            }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Box sx={{ mb: 2 }}>
                  {action.icon}
                </Box>
                <Typography variant="h6" sx={{ 
                  color: 'white', 
                  fontWeight: 'bold',
                  mb: 1
                }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary', 
                  mb: 2,
                  fontSize: '0.8rem'
                }}>
                  {action.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={action.action}
                  disabled={!action.available}
                  sx={{
                    borderColor: action.color,
                    color: action.color,
                    '&:hover': {
                      borderColor: action.color,
                      backgroundColor: `${action.color}20`
                    }
                  }}
                >
                  {action.available ? 'Activate' : 'Coming Soon'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stats and Leaderboard */}
      <Grid container spacing={3}>
        {/* User Stats */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                📊 Your Stats
          </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Learning Streak
          </Typography>
                  <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                    {userProgress?.streakDays || 0} days
          </Typography>
        </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((userProgress?.streakDays || 0) * 6.67, 100)}
                  sx={{ height: 6, borderRadius: 3 }}
                />
            </Box>
            
              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Learning Time
              </Typography>
                  <Typography variant="body2" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                    {Math.floor((userProgress?.totalLearningTime || 0) / 3600)}h {Math.floor(((userProgress?.totalLearningTime || 0) % 3600) / 60)}m
              </Typography>
            </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min((userProgress?.totalLearningTime || 0) / 100, 100)}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Average Score
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                    {userProgress?.averageSessionScore || 0}/10
                </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(userProgress?.averageSessionScore || 0) * 10}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>

              <Button
                variant="contained"
                onClick={() => setShowLeaderboard(true)}
                sx={{
                  background: 'linear-gradient(45deg, #00ffff, #2ed573)',
                  color: 'black',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                🏆 View Leaderboard
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                🏆 Achievements
              </Typography>
              
              <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                {achievements.map((achievement, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ 
                        bgcolor: achievement.earned ? '#2ed573' : '#666',
                        width: 32,
                        height: 32
                      }}>
                        {achievement.earned ? <CheckCircleIcon /> : <StarIcon />}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="body2" sx={{ 
                          color: achievement.earned ? 'white' : 'text.secondary',
                          fontWeight: achievement.earned ? 'bold' : 'normal'
                        }}>
                          {achievement.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {achievement.description}
              </Typography>
            </Box>
                      {achievement.earned && (
                        <Chip 
                          label="Earned" 
              size="small" 
                          sx={{ bgcolor: '#2ed573', color: 'white' }}
                        />
                      )}
          </Box>
        </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Daily Claim Dialog */}
      <Dialog open={showDailyClaim} onClose={() => setShowDailyClaim(false)}>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          🎁 Claim Daily XP
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            Claim your daily XP bonus! The amount varies based on your streak and activity.
          </Typography>
          <TextField
            fullWidth
            label="XP Amount"
            value={claimAmount}
            onChange={(e) => setClaimAmount(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Alert severity="info" sx={{ mb: 2 }}>
            💡 Tip: Higher streaks and more activity earn you bigger daily bonuses!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDailyClaim(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleDailyClaim}
            sx={{
              background: 'linear-gradient(45deg, #fdcb6e, #f39c12)',
              color: 'black',
              fontWeight: 'bold'
            }}
          >
            Claim XP
          </Button>
        </DialogActions>
      </Dialog>

      {/* Leaderboard Dialog */}
      <Dialog 
        open={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)}
        maxWidth="md"
            fullWidth
      >
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          🏆 Community Leaderboard
        </DialogTitle>
        <DialogContent>
          <List>
            {leaderboardData.map((user, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: index === 0 ? '#fdcb6e' : index === 1 ? '#bdc3c7' : index === 2 ? '#e67e22' : '#666',
                    fontWeight: 'bold'
                  }}>
                    {user.avatar}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" sx={{ color: 'white', fontWeight: 'bold' }}>
                        #{user.rank} {user.name}
                      </Typography>
                      {user.streak >= 7 && (
                        <FireIcon sx={{ color: '#ff3860', fontSize: 16 }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ color: '#00ffff' }}>
                        {user.xp} XP
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {user.streak} day streak
          </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Chip 
                    label={`#${user.rank}`}
                    size="small"
                    sx={{ 
                      bgcolor: index === 0 ? '#fdcb6e' : index === 1 ? '#bdc3c7' : index === 2 ? '#e67e22' : '#666',
                      color: 'black',
                      fontWeight: 'bold'
                    }}
          />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLeaderboard(false)} sx={{ color: 'text.secondary' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuickActions; 