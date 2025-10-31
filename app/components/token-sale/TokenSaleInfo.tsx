"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import { TrendingUp, AccessTime, AttachMoney } from '@mui/icons-material';
import { TokenSale } from '../../types/launchpad';

interface TokenSaleInfoProps {
  sale: TokenSale;
  isWhitelisted: boolean;
  onSelect: () => void;
}

const TokenSaleInfo: React.FC<TokenSaleInfoProps> = ({ sale, isWhitelisted, onSelect }) => {
  const progress = (sale.totalRaised / sale.targetAmount) * 100;
  const daysLeft = Math.ceil((new Date(sale.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'paused':
        return 'error';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'pending':
        return '🟡';
      case 'paused':
        return '🔴';
      case 'completed':
        return '🔵';
      default:
        return '⚪';
    }
  };

  return (
    <Card
      sx={{
        background: 'rgba(25, 25, 25, 0.9)',
        border: '2px solid #00ffff',
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 255, 255, 0.3)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold', flex: 1 }}>
              {sale.projectName}
            </Typography>
            <Chip
              label={`${getStatusIcon(sale.status)} ${sale.status.toUpperCase()}`}
              color={getStatusColor(sale.status) as any}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
            {sale.description}
          </Typography>
          <Chip
            label={`$${sale.tokenSymbol}`}
            sx={{
              background: 'linear-gradient(135deg, #4ecdc4 0%, #00ffff 100%)',
              color: '#000',
              fontWeight: 'bold',
            }}
          />
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Progress
            </Typography>
            <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
              {progress.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #00ffff 0%, #4ecdc4 100%)',
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Metrics Grid */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                ${sale.totalRaised.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                Raised
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                ${sale.targetAmount.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                Target
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                ${sale.salePrice}
              </Typography>
              <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                Price
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#9b59b6', fontWeight: 'bold' }}>
                {daysLeft}
              </Typography>
              <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                Days Left
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Vesting Info */}
        <Box sx={{ mb: 2, p: 2, background: 'rgba(0, 255, 255, 0.05)', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 1 }}>
            📅 Vesting Schedule
          </Typography>
          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
            TGE: {sale.vestingSchedule.tgePercentage}% | 
            Cliff: {sale.vestingSchedule.cliffDuration} days | 
            Duration: {sale.vestingSchedule.vestingDuration} days
          </Typography>
        </Box>

        {/* Action Button */}
        <Box sx={{ mt: 'auto' }}>
          {sale.status === 'active' && isWhitelisted ? (
            <Button
              variant="contained"
              fullWidth
              onClick={onSelect}
              sx={{
                background: 'linear-gradient(135deg, #00ffff 0%, #4ecdc4 100%)',
                color: '#000',
                fontWeight: 'bold',
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #00ffff 100%)',
                },
              }}
            >
              🚀 Invest Now
            </Button>
          ) : sale.status === 'active' && !isWhitelisted ? (
            <Button
              variant="outlined"
              fullWidth
              disabled
              sx={{
                borderColor: '#ff6b6b',
                color: '#ff6b6b',
                py: 1.5,
              }}
            >
              ⏳ Whitelist Required
            </Button>
          ) : (
            <Button
              variant="outlined"
              fullWidth
              disabled
              sx={{
                borderColor: '#9b59b6',
                color: '#9b59b6',
                py: 1.5,
              }}
            >
              {sale.status === 'upcoming' ? '⏳ Coming Soon' :
                sale.status === 'ended' ? '✅ Sale Complete' : '⏸️ Paused'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TokenSaleInfo;
