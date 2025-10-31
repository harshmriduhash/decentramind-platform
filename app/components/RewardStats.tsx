import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  AccountBalance as AccountBalanceIcon,
  ShoppingCart as ShoppingCartIcon,
  Comment as CommentIcon,
  Gavel as GavelIcon,
} from '@mui/icons-material';
import { tokenomicsService, RewardHistory, ECONOMIC_MODEL } from '../services/tokenomicsService';
import { useAuth } from '../hooks/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reward-tabpanel-${index}`}
      aria-labelledby={`reward-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export const RewardStats: React.FC = () => {
  const { session } = useAuth();
  
  const [rewardHistory, setRewardHistory] = useState<RewardHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalRewards: 0,
    totalPenalties: 0,
    netRewards: 0,
    rewardCount: 0,
    penaltyCount: 0,
    averageReward: 0,
    averagePenalty: 0,
  });

  useEffect(() => {
    if (session.isAuthenticated && session.walletAddress) {
      loadRewardHistory();
    }
  }, [session.isAuthenticated, session.walletAddress]);

  const loadRewardHistory = async () => {
    if (!session.walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const history = await tokenomicsService.getRewardHistory(session.walletAddress);
      setRewardHistory(history);
      calculateStats(history);
    } catch (error) {
      console.error('Failed to load reward history:', error);
      setError('Failed to load reward history');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (history: RewardHistory[]) => {
    const rewards = history.filter(r => r.type === 'reward');
    const penalties = history.filter(r => r.type === 'penalty');

    const totalRewards = rewards.reduce((sum, r) => sum + r.amount, 0);
    const totalPenalties = penalties.reduce((sum, r) => sum + Math.abs(r.amount), 0);
    const netRewards = totalRewards - totalPenalties;

    const averageReward = rewards.length > 0 ? totalRewards / rewards.length : 0;
    const averagePenalty = penalties.length > 0 ? totalPenalties / penalties.length : 0;

    setStats({
      totalRewards,
      totalPenalties,
      netRewards,
      rewardCount: rewards.length,
      penaltyCount: penalties.length,
      averageReward,
      averagePenalty,
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getRewardIcon = (reason: string) => {
    const reasonLower = reason.toLowerCase();
    
    if (reasonLower.includes('minting')) return <AccountBalanceIcon color="success" />;
    if (reasonLower.includes('evolution')) return <TrendingUpIcon color="success" />;
    if (reasonLower.includes('review')) return <CommentIcon color="info" />;
    if (reasonLower.includes('sale')) return <ShoppingCartIcon color="success" />;
    if (reasonLower.includes('governance')) return <GavelIcon color="primary" />;
    if (reasonLower.includes('spam')) return <ErrorIcon color="error" />;
    if (reasonLower.includes('fraud')) return <ErrorIcon color="error" />;
    if (reasonLower.includes('abuse')) return <ErrorIcon color="error" />;
    if (reasonLower.includes('performance')) return <TrendingDownIcon color="warning" />;
    
    return <InfoIcon color="action" />;
  };

  const getRewardColor = (type: 'reward' | 'penalty') => {
    return type === 'reward' ? '#4CAF50' : '#F44336';
  };

  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString()} DMT`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString();
  };

  const getReasonCategory = (reason: string) => {
    const reasonLower = reason.toLowerCase();
    
    if (reasonLower.includes('minting') || reasonLower.includes('evolution')) return 'Agent Activities';
    if (reasonLower.includes('review') || reasonLower.includes('sale')) return 'Community Participation';
    if (reasonLower.includes('governance')) return 'Governance';
    if (reasonLower.includes('spam') || reasonLower.includes('fraud') || reasonLower.includes('abuse')) return 'Penalties';
    if (reasonLower.includes('performance')) return 'Performance';
    
    return 'Other';
  };

  const groupedHistory = rewardHistory.reduce((groups, item) => {
    const category = getReasonCategory(item.reason);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as { [key: string]: RewardHistory[] });

  if (!session.isAuthenticated) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          🔐 Wallet Connection Required
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please connect your wallet to view reward statistics.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
        📊 Reward Statistics
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

      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #4CAF50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                {formatAmount(stats.totalRewards)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Rewards
              </Typography>
              <Chip 
                label={`${stats.rewardCount} transactions`}
                size="small"
                sx={{ mt: 1, background: '#4CAF50', color: 'white' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #F44336' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#F44336', fontWeight: 'bold' }}>
                {formatAmount(stats.totalPenalties)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Penalties
              </Typography>
              <Chip 
                label={`${stats.penaltyCount} transactions`}
                size="small"
                sx={{ mt: 1, background: '#F44336', color: 'white' }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: `2px solid ${stats.netRewards >= 0 ? '#2ed573' : '#F44336'}` 
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ 
                color: stats.netRewards >= 0 ? '#2ed573' : '#F44336', 
                fontWeight: 'bold' 
              }}>
                {formatAmount(Math.abs(stats.netRewards))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Net Rewards
              </Typography>
              <Chip 
                label={stats.netRewards >= 0 ? 'Positive' : 'Negative'}
                size="small"
                sx={{ 
                  mt: 1, 
                  background: stats.netRewards >= 0 ? '#2ed573' : '#F44336', 
                  color: 'white' 
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                {rewardHistory.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Transactions
              </Typography>
              <Chip 
                label="All Time"
                size="small"
                sx={{ mt: 1, background: '#00ffff', color: 'black' }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Average Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #4CAF50' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2 }}>
                📈 Average Rewards
              </Typography>
              <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                {formatAmount(stats.averageReward)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per reward transaction
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #F44336' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#F44336', mb: 2 }}>
                📉 Average Penalties
              </Typography>
              <Typography variant="h4" sx={{ color: '#F44336', fontWeight: 'bold' }}>
                {formatAmount(stats.averagePenalty)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Per penalty transaction
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ color: '#00ffff' }}>
          <Tab label="All Transactions" />
          <Tab label="By Category" />
          <Tab label="Recent Activity" />
        </Tabs>
      </Box>

      {/* All Transactions Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
          <CardContent>
            <TableContainer component={Paper} sx={{ background: 'transparent' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Reason</TableCell>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Transaction</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rewardHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Chip
                          label={item.type === 'reward' ? 'Reward' : 'Penalty'}
                          size="small"
                          sx={{ 
                            background: getRewardColor(item.type),
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: getRewardColor(item.type), fontWeight: 'bold' }}>
                        {item.type === 'reward' ? '+' : '-'}{formatAmount(Math.abs(item.amount))}
                      </TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{formatDate(item.timestamp)}</TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {item.transactionHash?.slice(0, 8)}...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* By Category Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {Object.entries(groupedHistory).map(([category, items]) => (
            <Grid item xs={12} md={6} key={category}>
              <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                    {category}
                  </Typography>
                  <List>
                    {items.slice(0, 5).map((item) => (
                      <ListItem key={item.id} dense>
                        <ListItemIcon>
                          {getRewardIcon(item.reason)}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.reason}
                          secondary={formatDate(item.timestamp)}
                        />
                        <ListItemSecondaryAction>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: getRewardColor(item.type),
                              fontWeight: 'bold'
                            }}
                          >
                            {item.type === 'reward' ? '+' : '-'}{formatAmount(Math.abs(item.amount))}
                          </Typography>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                    {items.length > 5 && (
                      <ListItem>
                        <ListItemText
                          secondary={`+${items.length - 5} more transactions`}
                          sx={{ color: 'text.secondary' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Recent Activity Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
              Recent Activity
            </Typography>
            <List>
              {rewardHistory.slice(0, 10).map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem>
                    <ListItemIcon>
                      {getRewardIcon(item.reason)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">
                            {item.reason}
                          </Typography>
                          <Chip
                            label={item.type === 'reward' ? 'Reward' : 'Penalty'}
                            size="small"
                            sx={{ 
                              background: getRewardColor(item.type),
                              color: 'white',
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                      }
                      secondary={formatDate(item.timestamp)}
                    />
                    <ListItemSecondaryAction>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: getRewardColor(item.type),
                          fontWeight: 'bold'
                        }}
                      >
                        {item.type === 'reward' ? '+' : '-'}{formatAmount(Math.abs(item.amount))}
                      </Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Reward Information */}
      <Card sx={{ mt: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #4CAF50' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2, fontWeight: 'bold' }}>
            💡 Reward Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#4CAF50', mb: 1 }}>
                Reward Types:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Agent Minting"
                    secondary={`${ECONOMIC_MODEL.rewards.agentMinting} DMT`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Agent Evolution"
                    secondary={`${ECONOMIC_MODEL.rewards.agentEvolution} DMT`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CommentIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Quality Review"
                    secondary={`${ECONOMIC_MODEL.rewards.qualityReview} DMT`}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#F44336', mb: 1 }}>
                Penalty Types:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <ErrorIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Spam Review"
                    secondary={`${Math.abs(ECONOMIC_MODEL.penalties.spamReview)} DMT`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ErrorIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Fraud Attempt"
                    secondary={`${Math.abs(ECONOMIC_MODEL.penalties.fraudAttempt)} DMT`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TrendingDownIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Poor Performance"
                    secondary={`${Math.abs(ECONOMIC_MODEL.penalties.poorPerformance)} DMT`}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}; 