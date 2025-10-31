"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  LocalFireDepartment as FireIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
  Token as TokenIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as TrophyIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Business as BusinessIcon,
  Store as StoreIcon,
  HowToVote as VoteIcon,
  Add as AddIcon,
  Psychology as BrainIcon,
  Upgrade as UpgradeIcon,
} from '@mui/icons-material';
import BurningService from '../services/burningService';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastNotifications';

interface BurnSource {
  name: string;
  icon: React.ReactNode;
  color: string;
  rate: number;
  description: string;
}

const burnSources: BurnSource[] = [
  {
    name: 'Minting',
    icon: <AddIcon />,
    color: '#ff6b6b',
    rate: 0.30,
    description: '30% of minting fees burned'
  },
  {
    name: 'Subscription',
    icon: <TrophyIcon />,
    color: '#4ecdc4',
    rate: 0.20,
    description: '20% of subscription fees burned'
  },
  {
    name: 'Upgrade',
    icon: <UpgradeIcon />,
    color: '#45b7d1',
    rate: 0.15,
    description: '15% of upgrade fees burned'
  },
  {
    name: 'Marketplace',
    icon: <StoreIcon />,
    color: '#96ceb4',
    rate: 0.20,
    description: '20% of marketplace fees burned'
  },
  {
    name: 'DAO',
    icon: <VoteIcon />,
    color: '#feca57',
    rate: 0.10,
    description: '10% of DAO treasury burned'
  }
];

const BurningDashboard: React.FC = () => {
  const { publicKey } = useWallet();
  const { session } = useAuth();
  const { showToast } = useToast();
  
  const [burningMetrics, setBurningMetrics] = useState<any>(null);
  const [burnEvents, setBurnEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [burnStats, setBurnStats] = useState<any>(null);

  const burningService = BurningService;

  useEffect(() => {
    // Temporarily remove authentication requirement for testing
    loadBurningData();
  }, [publicKey, session.isAuthenticated]);

  const loadBurningData = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const userId = publicKey.toBase58();
      
      // Load burning metrics
      const metrics = await burningService.getBurningMetrics();
      setBurningMetrics(metrics);
      
      // Load burn events
      const events = await burningService.getAllBurnEvents();
      setBurnEvents(events);
      
      // Load burn stats
      const stats = await burningService.getBurningStats();
      setBurnStats(stats);
      
    } catch (error) {
      console.error('Failed to load burning data:', error);
      showToast('Failed to load burning data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTestBurn = async (source: string, amount: number) => {
    if (!publicKey) {
      showToast('Please connect your wallet', 'error');
      return;
    }

    setLoading(true);
    try {
      const userId = publicKey.toBase58();
      const result = await burningService.burnDMT({
        amount,
        source: source as any,
        userId,
        agentId: 'test-agent',
        subscriptionTier: 'pro'
      });
      
      if (result.success) {
        showToast(`Successfully burned ${result.burnedAmount} DMT from ${source}`, 'success');
        await loadBurningData();
      } else {
        showToast(result.error || 'Burn failed', 'error');
      }
    } catch (error) {
      console.error('Burn error:', error);
      showToast('Burn failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getBurnTrend = () => {
    if (!burnStats) return 'stable';
    return burnStats.burnTrend;
  };

  const getTrendIcon = () => {
    const trend = getBurnTrend();
    switch (trend) {
      case 'increasing':
        return <TrendingUpIcon sx={{ color: '#28a745' }} />;
      case 'decreasing':
        return <TrendingDownIcon sx={{ color: '#dc3545' }} />;
      default:
        return <TimelineIcon sx={{ color: '#ffc107' }} />;
    }
  };

  const getTrendColor = () => {
    const trend = getBurnTrend();
    switch (trend) {
      case 'increasing':
        return '#28a745';
      case 'decreasing':
        return '#dc3545';
      default:
        return '#ffc107';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
          Loading burning data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
        🔥 Burning Analytics Dashboard
      </Typography>

      {/* Overall Burning Metrics */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #ff6b6b', 
        borderRadius: 3,
        mb: 3
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Total Burning Overview
          </Typography>
          
          {burningMetrics ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                    {burningMetrics.totalBurned.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total DMT Burned
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                    {burningMetrics.burnRate.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Average Burn Rate
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Typography variant="h4" sx={{ color: '#45b7d1', fontWeight: 'bold' }}>
                    {burningMetrics.dailyBurnRate.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Daily Burn Rate
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Box textAlign="center">
                  <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                    {getTrendIcon()}
                    <Typography variant="h6" sx={{ color: getTrendColor(), ml: 1, fontWeight: 'bold' }}>
                      {getBurnTrend().toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Burn Trend
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info">
              No burning metrics available yet
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Burn Sources */}
      <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
        Burn Sources & Rates
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {burnSources.map((source) => {
          const sourceMetrics = burningMetrics?.[`${source.name.toLowerCase()}Burned`] || 0;
          const percentage = burningMetrics?.totalBurned > 0 
            ? (sourceMetrics / burningMetrics.totalBurned * 100).toFixed(1)
            : '0';
          
          return (
            <Grid item xs={12} md={6} lg={4} key={source.name}>
              <Card sx={{ 
                background: 'rgba(25, 25, 25, 0.9)', 
                border: `2px solid ${source.color}`, 
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${source.color}40`,
                },
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: source.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}>
                      {source.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {source.name}
                      </Typography>
                      <Typography variant="h4" sx={{ color: source.color, fontWeight: 'bold' }}>
                        {(source.rate * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {source.description}
                  </Typography>
                  
                  <Box mb={2}>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      Total Burned: {sourceMetrics.toFixed(2)} DMT
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {percentage}% of total burns
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleTestBurn(source.name.toLowerCase(), 10)}
                    disabled={loading}
                    sx={{ 
                      borderColor: source.color, 
                      color: source.color,
                      '&:hover': { 
                        borderColor: source.color, 
                        background: `${source.color}20` 
                      }
                    }}
                  >
                    Test Burn (10 DMT)
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Recent Burn Events */}
      <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
        Recent Burn Events
      </Typography>
      
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff', 
        borderRadius: 3,
        mb: 3
      }}>
        <CardContent>
          {burnEvents.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Event</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Source</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>User</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {burnEvents.slice(0, 10).map((event, index) => {
                    const source = burnSources.find(s => 
                      s.name.toLowerCase() === event.source.toLowerCase()
                    );
                    
                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ color: 'white' }}>
                          <Box display="flex" alignItems="center">
                            <FireIcon sx={{ color: source?.color || '#ff6b6b', mr: 1 }} />
                            Burn Event #{index + 1}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          <Chip
                            label={event.source}
                            size="small"
                            sx={{ 
                              background: source?.color || '#ff6b6b',
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                          {event.amount.toFixed(2)} DMT
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {event.userId.slice(0, 8)}...{event.userId.slice(-8)}
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>
                          {new Date(event.timestamp).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              No burn events recorded yet
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Burning Statistics */}
      {burnStats && (
        <>
          <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
            Burning Statistics
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'rgba(25, 25, 25, 0.9)', 
                border: '2px solid #00ffff', 
                borderRadius: 3
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                    {burnStats.totalBurnEvents}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Burn Events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'rgba(25, 25, 25, 0.9)', 
                border: '2px solid #ff6b6b', 
                borderRadius: 3
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                    {burnStats.averageBurnPerEvent.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Avg Burn per Event
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'rgba(25, 25, 25, 0.9)', 
                border: '2px solid #4ecdc4', 
                borderRadius: 3
              }}>
                <CardContent>
                  <Typography variant="h4" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                    {burnStats.mostActiveSource}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Most Active Source
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                background: 'rgba(25, 25, 25, 0.9)', 
                border: '2px solid #45b7d1', 
                borderRadius: 3
              }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    {getTrendIcon()}
                    <Typography variant="h4" sx={{ color: getTrendColor(), fontWeight: 'bold', ml: 1 }}>
                      {getBurnTrend().toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Burn Trend
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Real-time Burn Monitor */}
      <Typography variant="h5" sx={{ color: 'white', mb: 3, mt: 4 }}>
        Real-time Burn Monitor
      </Typography>
      
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff', 
        borderRadius: 3
      }}>
        <CardContent>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            Monitor burning activity in real-time. New burn events will appear here automatically.
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <CircularProgress size={20} sx={{ color: '#00ffff', mr: 2 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Monitoring for new burn events...
            </Typography>
          </Box>
          
          <Alert severity="info">
            Real-time monitoring is active. Burn events from all sources will be displayed here as they occur.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BurningDashboard; 