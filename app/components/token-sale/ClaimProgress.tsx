"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Button,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import { Download, AccessTime, CheckCircle } from '@mui/icons-material';
import { TokenSale, Claim } from '../../types/launchpad';
import ClaimService from '../../services/claimService';
import { useToast } from '../ToastNotifications';

interface ClaimProgressProps {
  sale: TokenSale;
  walletAddress: string;
}

const ClaimProgress: React.FC<ClaimProgressProps> = ({ sale, walletAddress }) => {
  const { showToast } = useToast();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);

  useEffect(() => {
    if (walletAddress) {
      loadClaims();
    }
  }, [walletAddress, sale.id]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const claimService = ClaimService.getInstance();
      const userClaims = await claimService.getAvailableClaims(walletAddress);
      const saleClaims = userClaims.filter(claim => claim.tokenSaleId === sale.id);
      setClaims(saleClaims);
    } catch (error) {
      console.error('Failed to load claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (claim: Claim) => {
    try {
      setClaimLoading(true);
      const claimService = ClaimService.getInstance();
      
      await claimService.submitClaim(
        claim.tokenSaleId,
        walletAddress,
        claim.amount
      );

      showToast('Tokens claimed successfully!', 'success');
      loadClaims(); // Refresh claims
    } catch (error) {
      showToast('Claim failed. Please try again.', 'error');
    } finally {
      setClaimLoading(false);
    }
  };

  const calculateVestingProgress = () => {
    if (!sale) return 0;
    
    const now = new Date();
    const startDate = new Date(sale.startDate);
    const endDate = new Date(sale.endDate);
    
    if (now < startDate) return 0;
    if (now > endDate) return 100;
    
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    
    return (elapsed / totalDuration) * 100;
  };

  const getNextVestingDate = () => {
    if (!sale) return null;
    
    const now = new Date();
    const tgeDate = new Date(sale.startDate);
    const nextVesting = new Date(tgeDate.getTime() + (sale.vestingSchedule.vestingFrequency * 24 * 60 * 60 * 1000));
    
    return nextVesting > now ? nextVesting : null;
  };

  if (loading) {
    return (
      <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
        <CardContent sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
            Loading Claims...
          </Typography>
          <LinearProgress sx={{ background: 'rgba(255, 255, 255, 0.1)' }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
      <CardContent>
        <Typography variant="h5" sx={{ color: '#00ffff', mb: 3, fontWeight: 'bold' }}>
          📈 Claim Progress
        </Typography>

        {/* Sale Progress */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Sale Progress
            </Typography>
            <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
              {calculateVestingProgress().toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={calculateVestingProgress()}
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

        {/* Vesting Schedule Info */}
        <Box sx={{ mb: 3, p: 2, background: 'rgba(0, 255, 255, 0.05)', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold' }}>
            📅 Vesting Schedule
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                  {sale.vestingSchedule.tgePercentage}%
                </Typography>
                <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                  TGE Release
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                  {sale.vestingSchedule.cliffDuration}
                </Typography>
                <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                  Cliff Days
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Available Claims */}
        {claims.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold' }}>
              🎁 Available Claims
            </Typography>
            {claims.map((claim) => (
              <Box
                key={claim.id}
                sx={{
                  p: 2,
                  mb: 2,
                  background: 'rgba(78, 205, 196, 0.1)',
                  border: '1px solid #4ecdc4',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                    {claim.amount.toFixed(2)} Tokens
                  </Typography>
                  <Chip
                    label={claim.status}
                    color={claim.status === 'pending' ? 'warning' : 'success'}
                    size="small"
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 1 }}>
                  Vesting Period: {claim.vestingPeriod}
                </Typography>
                {claim.status === 'pending' && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleClaim(claim)}
                    disabled={claimLoading}
                    sx={{
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #00ffff 100%)',
                      color: '#000',
                      fontWeight: 'bold',
                      mt: 1,
                    }}
                  >
                    {claimLoading ? 'Processing...' : 'Claim Tokens'}
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ mb: 3, p: 2, background: 'rgba(255, 167, 38, 0.1)', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#ffa726', textAlign: 'center' }}>
              No claims available yet. Tokens will be available according to the vesting schedule.
            </Typography>
          </Box>
        )}

        {/* Next Vesting Info */}
        {getNextVestingDate() && (
          <Box sx={{ mb: 3, p: 2, background: 'rgba(155, 89, 182, 0.1)', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#9b59b6', fontWeight: 'bold', mb: 1 }}>
              ⏰ Next Vesting Date
            </Typography>
            <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
              {getNextVestingDate()?.toLocaleDateString()} - {getNextVestingDate()?.toLocaleTimeString()}
            </Typography>
          </Box>
        )}

        {/* Important Notes */}
        <Box sx={{ p: 2, background: 'rgba(255, 167, 38, 0.1)', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: '#ffa726', fontWeight: 'bold', mb: 1 }}>
            ℹ️ Claim Information:
          </Typography>
          <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
            • TGE tokens are available immediately after sale completion
          </Typography>
          <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
            • Vesting tokens are released according to the schedule
          </Typography>
          <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block' }}>
            • Claims are processed on-chain and may take a few minutes
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ClaimProgress;
