"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, Tabs, Tab,
  CircularProgress, Alert, IconButton, Tooltip, Avatar, LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon, Star as StarIcon, AttachMoney as MoneyIcon,
  ShowChart as ChartIcon, VolumeUp as VolumeIcon, Warning as WarningIcon,
  CheckCircle as CheckCircleIcon, AutoAwesome as AutoAwesomeIcon
} from '@mui/icons-material';

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
      id={`token-tabpanel-${index}`}
      aria-labelledby={`token-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TokenExplorer: React.FC = () => {
  const [trendingTokens, setTrendingTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [tabValue, setTabValue] = useState(0);

  const fetchTrendingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch trending tokens
      const trendingResponse = await fetch('https://api.coingecko.com/api/v3/search/trending');
      const trendingData = await trendingResponse.json();
      
      if (trendingData.coins) {
        const trendingIds = trendingData.coins.map((coin: any) => coin.item.id).join(',');
        
        // Fetch market data for trending tokens
        const marketResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${trendingIds}&order=market_cap_desc&per_page=7&page=1&sparkline=false`
        );
        const marketData = await marketResponse.json();
        
        setTrendingTokens(marketData);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Failed to fetch trending token data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchTrendingData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`;
    return `$${volume.toFixed(0)}`;
  };

  const getRiskScore = (change24h: number, volume: number, marketCap: number) => {
    let score = 50; // Base score
    
    // Price change factor
    if (change24h > 20) score += 20;
    else if (change24h > 10) score += 10;
    else if (change24h < -20) score -= 30;
    else if (change24h < -10) score -= 15;
    
    // Volume factor
    if (volume > 1e9) score += 15;
    else if (volume > 1e6) score += 5;
    else if (volume < 1e5) score -= 10;
    
    // Market cap factor
    if (marketCap > 1e12) score += 10;
    else if (marketCap < 1e6) score -= 20;
    
    return Math.max(0, Math.min(100, score));
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return '#2ed573'; // High Alpha - Green
    if (score >= 60) return '#fdcb6e'; // Medium Risk - Yellow
    return '#ff6b6b'; // High Risk - Red
  };

  const getRiskLabel = (score: number) => {
    if (score >= 80) return 'High Alpha';
    if (score >= 60) return 'Medium Risk';
    return 'High Risk';
  };

  const categorizeTokens = () => {
    const highAlpha = trendingTokens.filter(token => getRiskScore(token.price_change_percentage_24h, token.total_volume, token.market_cap) >= 80);
    const mediumRisk = trendingTokens.filter(token => {
      const score = getRiskScore(token.price_change_percentage_24h, token.total_volume, token.market_cap);
      return score >= 60 && score < 80;
    });
    const highRisk = trendingTokens.filter(token => getRiskScore(token.price_change_percentage_24h, token.total_volume, token.market_cap) < 60);
    
    return { highAlpha, mediumRisk, highRisk };
  };

  const TokenCard = ({ token }: { token: TokenData }) => {
    const riskScore = getRiskScore(token.price_change_percentage_24h, token.total_volume, token.market_cap);
    const isPositive = token.price_change_percentage_24h >= 0;
    
    return (
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: `2px solid ${getRiskColor(riskScore)}`, 
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: `0 8px 32px ${getRiskColor(riskScore)}40`
        }
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={token.image}
              alt={token.name}
              sx={{
                width: 40,
                height: 40,
                mr: 2,
                border: `2px solid ${getRiskColor(riskScore)}`
              }}
            />
            <Box flex={1}>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {token.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>
                {token.symbol}
              </Typography>
            </Box>
            <Chip
              label={getRiskLabel(riskScore)}
              size="small"
              sx={{
                backgroundColor: getRiskColor(riskScore),
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }}
            />
          </Box>

          <Box mb={2}>
            <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
              {formatPrice(token.current_price)}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {isPositive ? (
                <TrendingUpIcon sx={{ color: '#2ed573', fontSize: 20 }} />
              ) : (
                <TrendingDownIcon sx={{ color: '#ff6b6b', fontSize: 20 }} />
              )}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: isPositive ? '#2ed573' : '#ff6b6b',
                  fontWeight: 'bold'
                }}
              >
                {isPositive ? '+' : ''}{token.price_change_percentage_24h?.toFixed(2)}%
              </Typography>
            </Box>
          </Box>

          <Box mb={2}>
            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
              Risk Score: {riskScore}/100
            </Typography>
            <LinearProgress
              variant="determinate"
              value={riskScore}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getRiskColor(riskScore),
                  borderRadius: 4
                }
              }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <VolumeIcon sx={{ color: '#fdcb6e', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Volume
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              {formatVolume(token.total_volume)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={0.5}>
              <StarIcon sx={{ color: '#e84393', fontSize: 16 }} />
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Rank
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              #{token.market_cap_rank}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const { highAlpha, mediumRisk, highRisk } = categorizeTokens();

  if (error) {
    return (
      <Box mb={4}>
        <Typography variant="h5" sx={{ color: '#00ffff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon />
          Token Explorer
        </Typography>
        <Alert 
          severity="error" 
          action={
            <IconButton color="inherit" size="small" onClick={fetchTrendingData}>
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
    <Box mb={4}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" sx={{ color: '#00ffff', display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon />
          Token Explorer
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </Typography>
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={fetchTrendingData} 
              disabled={loading}
              sx={{ color: '#00ffff' }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: '#b0b0b0',
              '&.Mui-selected': {
                color: '#00ffff'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#00ffff'
            }
          }}
        >
          <Tab 
            label={`High Alpha (${highAlpha.length})`} 
            icon={<AutoAwesomeIcon />}
            iconPosition="start"
          />
          <Tab 
            label={`Medium Risk (${mediumRisk.length})`} 
            icon={<WarningIcon />}
            iconPosition="start"
          />
          <Tab 
            label={`High Risk (${highRisk.length})`} 
            icon={<CheckCircleIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress sx={{ color: '#00ffff' }} />
        </Box>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {highAlpha.map((token) => (
                <Grid item xs={12} sm={6} md={4} key={token.id}>
                  <TokenCard token={token} />
                </Grid>
              ))}
              {highAlpha.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: '#b0b0b0', textAlign: 'center' }}>
                    No high alpha tokens found
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {mediumRisk.map((token) => (
                <Grid item xs={12} sm={6} md={4} key={token.id}>
                  <TokenCard token={token} />
                </Grid>
              ))}
              {mediumRisk.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: '#b0b0b0', textAlign: 'center' }}>
                    No medium risk tokens found
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {highRisk.map((token) => (
                <Grid item xs={12} sm={6} md={4} key={token.id}>
                  <TokenCard token={token} />
                </Grid>
              ))}
              {highRisk.length === 0 && (
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ color: '#b0b0b0', textAlign: 'center' }}>
                    No high risk tokens found
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        </>
      )}

      <Box mt={3} textAlign="center">
        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
          Data provided by CoinGecko • Updates every 60 seconds
        </Typography>
      </Box>
    </Box>
  );
};

export default TokenExplorer;

