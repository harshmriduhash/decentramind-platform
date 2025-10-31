"use client";

import React, { useState, useEffect } from 'react';
import TaskLog from './TaskLog';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip,
  CircularProgress, Alert, LinearProgress, Avatar, Divider,
  List, ListItem, ListItemText, ListItemIcon, Paper, IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  AccountBalanceWallet as WalletIcon, AttachMoney as MoneyIcon,
  ShowChart as ChartIcon, Refresh as RefreshIcon, Star as StarIcon,
  Security as SecurityIcon, LocalFireDepartment as FireIcon,
  CheckCircle as CheckCircleIcon, Warning as WarningIcon
} from '@mui/icons-material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  image: string;
  market_cap_rank: number;
}

interface PortfolioToken {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change24h: number;
  image: string;
  stakingAPY?: number;
}

interface TreasuryTransaction {
  id: string;
  type: 'inflow' | 'outflow';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const PortfolioDashboard: React.FC = () => {
  const [portfolioTokens, setPortfolioTokens] = useState<PortfolioToken[]>([]);
  const [treasuryTransactions, setTreasuryTransactions] = useState<TreasuryTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange24h, setTotalChange24h] = useState(0);

  // Mock portfolio data
  const mockPortfolio: PortfolioToken[] = [
    { symbol: 'BTC', name: 'Bitcoin', amount: 0.5, value: 0, change24h: 0, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', stakingAPY: 4.2 },
    { symbol: 'ETH', name: 'Ethereum', amount: 2.0, value: 0, change24h: 0, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', stakingAPY: 5.8 },
    { symbol: 'SOL', name: 'Solana', amount: 10.0, value: 0, change24h: 0, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', stakingAPY: 7.2 },
    { symbol: 'MATIC', name: 'Polygon', amount: 100.0, value: 0, change24h: 0, image: 'https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png', stakingAPY: 6.5 },
    { symbol: 'AVAX', name: 'Avalanche', amount: 5.0, value: 0, change24h: 0, image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', stakingAPY: 8.1 }
  ];

  const mockTreasuryTransactions: TreasuryTransaction[] = [
    { id: '1', type: 'inflow', amount: 50000, description: 'DAO Treasury Deposit', timestamp: '2024-01-15T10:30:00Z', status: 'completed' },
    { id: '2', type: 'outflow', amount: 15000, description: 'Development Grant', timestamp: '2024-01-14T14:20:00Z', status: 'completed' },
    { id: '3', type: 'inflow', amount: 25000, description: 'Staking Rewards', timestamp: '2024-01-13T09:15:00Z', status: 'completed' },
    { id: '4', type: 'outflow', amount: 8000, description: 'Marketing Campaign', timestamp: '2024-01-12T16:45:00Z', status: 'pending' },
    { id: '5', type: 'inflow', amount: 12000, description: 'Token Sale Revenue', timestamp: '2024-01-11T11:30:00Z', status: 'completed' }
  ];

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch price data for portfolio tokens
      const symbols = mockPortfolio.map(token => token.symbol.toLowerCase()).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbols}&order=market_cap_desc&per_page=10&page=1&sparkline=false`
      );
      const marketData = await response.json();

      // Update portfolio with current prices
      const updatedPortfolio = mockPortfolio.map(token => {
        const marketToken = marketData.find((m: TokenData) => m.symbol.toLowerCase() === token.symbol.toLowerCase());
        if (marketToken) {
          const currentValue = token.amount * marketToken.current_price;
          return {
            ...token,
            value: currentValue,
            change24h: marketToken.price_change_percentage_24h
          };
        }
        return token;
      });

      setPortfolioTokens(updatedPortfolio);
      setTreasuryTransactions(mockTreasuryTransactions);

      // Calculate totals
      const total = updatedPortfolio.reduce((sum, token) => sum + token.value, 0);
      const weightedChange = updatedPortfolio.reduce((sum, token) => {
        return sum + (token.change24h * token.value);
      }, 0) / total;

      setTotalValue(total);
      setTotalChange24h(weightedChange);

    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError('Failed to fetch portfolio data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchPortfolioData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1e6) return `$${(price / 1e6).toFixed(1)}M`;
    if (price >= 1e3) return `$${(price / 1e3).toFixed(1)}K`;
    return `$${price.toFixed(2)}`;
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(4);
  };

  const getStakingRewards = () => {
    return portfolioTokens.reduce((total, token) => {
      if (token.stakingAPY) {
        return total + (token.value * token.stakingAPY / 100 / 365);
      }
      return total;
    }, 0);
  };

  const getTreasuryBalance = () => {
    return treasuryTransactions.reduce((balance, tx) => {
      return balance + (tx.type === 'inflow' ? tx.amount : -tx.amount);
    }, 0);
  };

  const getTreasuryInflows = () => {
    return treasuryTransactions
      .filter(tx => tx.type === 'inflow')
      .reduce((total, tx) => total + tx.amount, 0);
  };

  const getTreasuryOutflows = () => {
    return treasuryTransactions
      .filter(tx => tx.type === 'outflow')
      .reduce((total, tx) => total + tx.amount, 0);
  };

  // Chart data
  const portfolioChartData = portfolioTokens.map(token => ({
    name: token.symbol,
    value: token.value,
    change: token.change24h
  }));

  const treasuryChartData = [
    { name: 'Inflows', value: getTreasuryInflows(), color: '#2ed573' },
    { name: 'Outflows', value: getTreasuryOutflows(), color: '#ff6b6b' }
  ];

  const COLORS = ['#00ffff', '#2ed573', '#fdcb6e', '#ff6b6b', '#e84393'];

  if (error) {
    return (
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: '#00ffff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon />
          Portfolio Dashboard
        </Typography>
        <Alert 
          severity="error" 
          action={
            <IconButton color="inherit" size="small" onClick={fetchPortfolioData}>
              <RefreshIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: '#00ffff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon />
          Portfolio Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Autonomous CFO - Financial Management & Treasury Analytics
        </Typography>
        
        {/* Agent Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <StarIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fdcb6e' }}>Agent XP</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>2,500</Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Level 5 Expert</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ mt: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <CheckCircleIcon sx={{ color: '#2ed573', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#2ed573' }}>Tasks Completed</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>150</Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>98% Success Rate</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <SecurityIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fdcb6e' }}>Accuracy</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>98%</Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Financial Analysis</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #e84393', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <MoneyIcon sx={{ color: '#e84393', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#e84393' }}>Total Earnings</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>$2,500</Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>DMT Tokens</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress sx={{ color: '#00ffff' }} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Portfolio Overview */}
          <Grid item xs={12} md={8}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: '12px', mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#00ffff', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WalletIcon />
                  Portfolio Overview
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Box textAlign="center">
                      <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {formatPrice(totalValue)}
                      </Typography>
                      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                        {totalChange24h >= 0 ? (
                          <TrendingUpIcon sx={{ color: '#2ed573' }} />
                        ) : (
                          <TrendingDownIcon sx={{ color: '#ff6b6b' }} />
                        )}
                        <Typography 
                          variant="h6" 
                          sx={{ color: totalChange24h >= 0 ? '#2ed573' : '#ff6b6b' }}
                        >
                          {totalChange24h >= 0 ? '+' : ''}{totalChange24h.toFixed(2)}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>24h Change</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box textAlign="center">
                      <Typography variant="h3" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                        {formatPrice(getStakingRewards())}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#fdcb6e' }}>Daily</Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Staking Rewards</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Portfolio Chart */}
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolioChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {portfolioChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatPrice(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>

            {/* Token Holdings */}
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#2ed573', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon />
                  Token Holdings
                </Typography>
                
                <List>
                  {portfolioTokens.map((token, index) => (
                    <React.Fragment key={token.symbol}>
                      <ListItem>
                        <ListItemIcon>
                          <Avatar src={token.image} sx={{ width: 40, height: 40 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={2}>
                              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                                {token.name} ({token.symbol})
                              </Typography>
                              {token.stakingAPY && (
                                <Chip 
                                  label={`${token.stakingAPY}% APY`} 
                                  size="small" 
                                  sx={{ backgroundColor: '#fdcb6e', color: '#000' }}
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                {formatAmount(token.amount)} {token.symbol} • {formatPrice(token.value)}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                {token.change24h >= 0 ? (
                                  <TrendingUpIcon sx={{ color: '#2ed573', fontSize: 16 }} />
                                ) : (
                                  <TrendingDownIcon sx={{ color: '#ff6b6b', fontSize: 16 }} />
                                )}
                                <Typography 
                                  variant="body2" 
                                  sx={{ color: token.change24h >= 0 ? '#2ed573' : '#ff6b6b' }}
                                >
                                  {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < portfolioTokens.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Treasury Dashboard */}
          <Grid item xs={12} md={4}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: '12px', mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#fdcb6e', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon />
                  DAO Treasury
                </Typography>
                
                <Box textAlign="center" mb={3}>
                  <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                    {formatPrice(getTreasuryBalance())}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Total Balance</Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                        {formatPrice(getTreasuryInflows())}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Inflows</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h5" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                        {formatPrice(getTreasuryOutflows())}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Outflows</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #e84393', borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#e84393', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FireIcon />
                  Recent Transactions
                </Typography>
                
                <List>
                  {treasuryTransactions.slice(0, 5).map((tx, index) => (
                    <React.Fragment key={tx.id}>
                      <ListItem>
                        <ListItemIcon>
                          {tx.type === 'inflow' ? (
                            <TrendingUpIcon sx={{ color: '#2ed573' }} />
                          ) : (
                            <TrendingDownIcon sx={{ color: '#ff6b6b' }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ color: '#ffffff' }}>
                              {tx.description}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: tx.type === 'inflow' ? '#2ed573' : '#ff6b6b' }}>
                                {tx.type === 'inflow' ? '+' : '-'}{formatPrice(tx.amount)}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                        <Chip 
                          label={tx.status} 
                          size="small" 
                          sx={{ 
                            backgroundColor: tx.status === 'completed' ? '#2ed573' : 
                                           tx.status === 'pending' ? '#fdcb6e' : '#ff6b6b',
                            color: '#000'
                          }}
                        />
                      </ListItem>
                      {index < 4 && <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Box mt={3} textAlign="center">
        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
          Data provided by CoinGecko • Updates every 30 seconds
        </Typography>
      </Box>

      {/* Task Log */}
      <Box sx={{ mt: 4 }}>
        <TaskLog 
          agentId="agent-cfo" 
          agentName="Autonomous CFO"
          maxEntries={8}
        />
      </Box>
    </Box>
  );
};

export default PortfolioDashboard;
