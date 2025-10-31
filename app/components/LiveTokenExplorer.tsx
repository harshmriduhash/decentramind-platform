"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Chip, CircularProgress,
  Alert, IconButton, Tooltip, Skeleton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon,
  Refresh as RefreshIcon, Star as StarIcon, AttachMoney as MoneyIcon,
  ShowChart as ChartIcon, VolumeUp as VolumeIcon
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
  alphaScore?: number;
  riskLevel?: 'low' | 'medium' | 'high' | 'extreme';
  sentiment?: 'bullish' | 'bearish' | 'neutral';
}

interface TrendingToken {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
}

const LiveTokenExplorer: React.FC = () => {
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([]);
  const [tokenData, setTokenData] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Calculate Alpha Score based on multiple factors
  const calculateAlphaScore = (token: any): number => {
    let score = 0;
    
    // Volume factor (0-30 points)
    const volumeScore = Math.min(30, (token.total_volume / 1000000) * 2);
    score += volumeScore;
    
    // Price change factor (0-25 points)
    const priceChange = token.price_change_percentage_24h || 0;
    const priceScore = Math.min(25, Math.max(0, (priceChange + 20) * 0.5));
    score += priceScore;
    
    // Market cap rank factor (0-20 points)
    const rankScore = token.market_cap_rank ? Math.max(0, 20 - (token.market_cap_rank / 100)) : 10;
    score += rankScore;
    
    // Market cap factor (0-15 points)
    const marketCapScore = Math.min(15, (token.market_cap / 1000000000) * 0.5);
    score += marketCapScore;
    
    // Random factor for volatility (0-10 points)
    const volatilityScore = Math.random() * 10;
    score += volatilityScore;
    
    return Math.round(Math.min(100, Math.max(0, score)));
  };

  // Determine risk level based on various factors
  const calculateRiskLevel = (token: any): 'low' | 'medium' | 'high' | 'extreme' => {
    const priceChange = Math.abs(token.price_change_percentage_24h || 0);
    const marketCap = token.market_cap || 0;
    const volume = token.total_volume || 0;
    
    // High volatility = higher risk
    if (priceChange > 50 || marketCap < 10000000) return 'extreme';
    if (priceChange > 25 || marketCap < 100000000) return 'high';
    if (priceChange > 10 || marketCap < 1000000000) return 'medium';
    return 'low';
  };

  // Determine sentiment based on price movement and volume
  const calculateSentiment = (token: any): 'bullish' | 'bearish' | 'neutral' => {
    const priceChange = token.price_change_percentage_24h || 0;
    const volume = token.total_volume || 0;
    
    if (priceChange > 5 && volume > 1000000) return 'bullish';
    if (priceChange < -5 && volume > 1000000) return 'bearish';
    return 'neutral';
  };

  const fetchTrendingData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch trending tokens
      const trendingResponse = await fetch('https://api.coingecko.com/api/v3/search/trending');
      const trendingData = await trendingResponse.json();
      
      if (trendingData.coins) {
        setTrendingTokens(trendingData.coins.map((coin: any) => ({
          id: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
          thumb: coin.item.thumb,
          market_cap_rank: coin.item.market_cap_rank
        })));
      }

      // Fetch market data for trending tokens
      const trendingIds = trendingData.coins.map((coin: any) => coin.item.id).join(',');
      const marketResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${trendingIds}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
      );
      const marketData = await marketResponse.json();
      
      // Process market data with calculated scores
      const processedData = marketData.map((token: any) => ({
        ...token,
        alphaScore: calculateAlphaScore(token),
        riskLevel: calculateRiskLevel(token),
        sentiment: calculateSentiment(token),
      }));
      
      setTokenData(processedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError('Failed to fetch live token data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchTrendingData, 30000);
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

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toFixed(0)}`;
  };

  const getRiskColor = (riskLevel?: string) => {
    const colorMap: Record<string, string> = {
      low: '#4caf50',
      medium: '#ff9800',
      high: '#f44336',
      extreme: '#9c27b0',
    };
    return colorMap[riskLevel || 'medium'] || '#757575';
  };

  const getSentimentBadge = (change24h: number, volume: number) => {
    if (change24h > 10 && volume > 1e6) return { label: 'Hot', color: '#ff6b6b' };
    if (change24h > 5) return { label: 'Bullish', color: '#2ed573' };
    if (change24h < -10) return { label: 'Bearish', color: '#ff6b6b' };
    if (change24h < -5) return { label: 'Declining', color: '#fdcb6e' };
    return { label: 'Neutral', color: '#b0b0b0' };
  };

  const SkeletonCard = () => (
    <Card sx={{ 
      background: 'rgba(25, 25, 25, 0.9)', 
      border: '2px solid #00ffff', 
      borderRadius: '12px',
      backdropFilter: 'blur(10px)'
    }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
          <Box>
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={80} height={20} />
          </Box>
        </Box>
        <Skeleton variant="text" width={100} height={32} />
        <Skeleton variant="text" width={80} height={20} />
        <Skeleton variant="text" width={120} height={20} />
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Box mb={4}>
        <Typography variant="h5" sx={{ color: '#00ffff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChartIcon />
          Live Token Explorer
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
          Live Token Explorer
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

      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <SkeletonCard />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {tokenData.map((token) => {
            const sentiment = getSentimentBadge(token.price_change_percentage_24h, token.total_volume);
            const isPositive = token.price_change_percentage_24h >= 0;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={token.id}>
                <Card sx={{ 
                  background: 'rgba(25, 25, 25, 0.9)', 
                  border: '2px solid #00ffff', 
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    borderColor: '#00e6e6',
                    boxShadow: '0 8px 32px rgba(0, 255, 255, 0.2)'
                  }
                }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Box
                        component="img"
                        src={token.image}
                        alt={token.name}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          mr: 2,
                          border: '2px solid #00ffff'
                        }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                          {token.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0b0b0', textTransform: 'uppercase' }}>
                          {token.symbol}
                        </Typography>
                      </Box>
                      <Box ml="auto" display="flex" flexDirection="column" gap={0.5}>
                        <Chip
                          label={sentiment.label}
                          size="small"
                          sx={{
                            backgroundColor: sentiment.color,
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }}
                        />
                        <Chip
                          label={`Alpha: ${token.alphaScore || 0}`}
                          size="small"
                          sx={{
                            backgroundColor: '#fdcb6e',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
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

                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <MoneyIcon sx={{ color: '#0984e3', fontSize: 16 }} />
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          Market Cap
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {formatMarketCap(token.market_cap)}
                      </Typography>
                    </Box>

                    <Box display="flex" justifyContent="space-between" mb={1}>
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

                    {/* Risk Level Indicator */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        Risk Level
                      </Typography>
                      <Chip
                        label={token.riskLevel?.toUpperCase() || 'UNKNOWN'}
                        size="small"
                        sx={{
                          backgroundColor: getRiskColor(token.riskLevel),
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Box mt={3} textAlign="center">
        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
          Data provided by CoinGecko • Updates every 30 seconds
        </Typography>
      </Box>
    </Box>
  );
};

export default LiveTokenExplorer;
