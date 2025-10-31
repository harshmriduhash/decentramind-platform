"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Alert,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import {
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  LocalFireDepartment as FireIcon,
  AccountBalanceWallet as WalletIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from './ToastNotifications';

interface TokenomicsData {
  totalSupply: number;
  circulatingSupply: number;
  totalBurned: number;
  totalStaked: number;
  allocation: {
    name: string;
    value: number;
    color: string;
  }[];
}

const TokenomicsDashboard: React.FC = () => {
  const { publicKey } = useWallet();
  const { showToast } = useToast();
  
  const [tokenomicsData, setTokenomicsData] = useState<TokenomicsData>({
    totalSupply: 1000000000, // 1 billion DMT
    circulatingSupply: 0,
    totalBurned: 0,
    totalStaked: 0,
    allocation: []
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadTokenomicsData();
    // Refresh every 60 seconds
    const interval = setInterval(loadTokenomicsData, 60000);
    return () => clearInterval(interval);
  }, [publicKey]);

  const loadTokenomicsData = async () => {
    setLoading(true);
    try {
      // Mock data for now - will be replaced with real blockchain data
      const mockData: TokenomicsData = {
        totalSupply: 1000000000,
        circulatingSupply: 750000000, // 75% of total supply
        totalBurned: 50000000, // 5% burned
        totalStaked: 200000000, // 20% staked
        allocation: [
          { name: 'Circulating', value: 750000000, color: '#4ecdc4' },
          { name: 'Staked', value: 200000000, color: '#45b7d1' },
          { name: 'Burned', value: 50000000, color: '#ff6b6b' },
          { name: 'Reserved', value: 0, color: '#96ceb4' }
        ]
      };

      // Calculate reserved (remaining)
      const used = mockData.circulatingSupply + mockData.totalStaked + mockData.totalBurned;
      mockData.allocation[3].value = mockData.totalSupply - used;

      setTokenomicsData(mockData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load tokenomics data:', error);
      showToast('Failed to load tokenomics data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const formatPercentage = (value: number, total: number): string => {
    return ((value / total) * 100).toFixed(1) + '%';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ 
          background: 'rgba(0, 0, 0, 0.9)', 
          border: '1px solid #00ffff',
          borderRadius: 1,
          p: 1
        }}>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {data.name}: {formatNumber(data.value)} DMT
          </Typography>
          <Typography variant="caption" sx={{ color: '#00ffff' }}>
            {formatPercentage(data.value, tokenomicsData.totalSupply)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
        🪙 Tokenomics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #00ffff',
            borderRadius: 2
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Token Metrics
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
                  <Tooltip title="Refresh tokenomics data">
                    <IconButton
                      onClick={loadTokenomicsData}
                      disabled={loading}
                      size="small"
                      sx={{ color: '#00ffff' }}
                    >
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Grid container spacing={2}>
                {/* Total Supply */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2} sx={{ 
                    background: 'rgba(0, 255, 255, 0.1)', 
                    borderRadius: 1,
                    border: '1px solid rgba(0, 255, 255, 0.3)'
                  }}>
                    <WalletIcon sx={{ color: '#00ffff', fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {formatNumber(tokenomicsData.totalSupply)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Total Supply
                    </Typography>
                  </Box>
                </Grid>

                {/* Circulating Supply */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2} sx={{ 
                    background: 'rgba(78, 205, 196, 0.1)', 
                    borderRadius: 1,
                    border: '1px solid rgba(78, 205, 196, 0.3)'
                  }}>
                    <TrendingUpIcon sx={{ color: '#4ecdc4', fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                      {formatNumber(tokenomicsData.circulatingSupply)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Circulating Supply
                    </Typography>
                    <Chip 
                      label={formatPercentage(tokenomicsData.circulatingSupply, tokenomicsData.totalSupply)}
                      size="small"
                      sx={{ mt: 1, background: '#4ecdc4', color: 'white' }}
                    />
                  </Box>
                </Grid>

                {/* Total Burned */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2} sx={{ 
                    background: 'rgba(255, 107, 107, 0.1)', 
                    borderRadius: 1,
                    border: '1px solid rgba(255, 107, 107, 0.3)'
                  }}>
                    <FireIcon sx={{ color: '#ff6b6b', fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                      {formatNumber(tokenomicsData.totalBurned)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Total Burned
                    </Typography>
                    <Chip 
                      label={formatPercentage(tokenomicsData.totalBurned, tokenomicsData.totalSupply)}
                      size="small"
                      sx={{ mt: 1, background: '#ff6b6b', color: 'white' }}
                    />
                  </Box>
                </Grid>

                {/* Total Staked */}
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2} sx={{ 
                    background: 'rgba(69, 183, 209, 0.1)', 
                    borderRadius: 1,
                    border: '1px solid rgba(69, 183, 209, 0.3)'
                  }}>
                    <WalletIcon sx={{ color: '#45b7d1', fontSize: 40, mb: 1 }} />
                    <Typography variant="h5" sx={{ color: '#45b7d1', fontWeight: 'bold' }}>
                      {formatNumber(tokenomicsData.totalStaked)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Total Staked
                    </Typography>
                    <Chip 
                      label={formatPercentage(tokenomicsData.totalStaked, tokenomicsData.totalSupply)}
                      size="small"
                      sx={{ mt: 1, background: '#45b7d1', color: 'white' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Allocation Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '1px solid #00ffff',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PieChartIcon sx={{ color: '#00ffff', mr: 1 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Token Allocation
                </Typography>
              </Box>

              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tokenomicsData.allocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {tokenomicsData.allocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              {/* Legend */}
              <Box mt={2}>
                {tokenomicsData.allocation.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" mb={1}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        background: item.color, 
                        borderRadius: '50%',
                        mr: 1
                      }} 
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {formatPercentage(item.value, tokenomicsData.totalSupply)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Info Alert */}
        <Grid item xs={12}>
          <Alert 
            severity="info" 
            sx={{ 
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              color: '#00ffff'
            }}
          >
            <Box display="flex" alignItems="center">
              <InfoIcon sx={{ mr: 1 }} />
              <Typography variant="body2">
                Tokenomics data is currently using mock values. Real blockchain data will be displayed once smart contracts are deployed to mainnet.
              </Typography>
            </Box>
          </Alert>
        </Grid>

        {/* Last Updated */}
        <Grid item xs={12}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TokenomicsDashboard; 