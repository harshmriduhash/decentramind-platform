"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Grid,
  Chip,
} from '@mui/material';
import { AttachMoney, TrendingUp, Warning } from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenSale } from '../../types/launchpad';
import SaleService from '../../services/saleService';
import { useToast } from '../ToastNotifications';

interface ContributionFormProps {
  sale: TokenSale;
  isWhitelisted: boolean;
  onSuccess: () => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ sale, isWhitelisted, onSuccess }) => {
  const { publicKey } = useWallet();
  const { showToast } = useToast();
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<'USDC' | 'SOL'>('USDC');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [estimatedTokens, setEstimatedTokens] = useState<number>(0);
  const [tgeTokens, setTgeTokens] = useState<number>(0);
  const [vestingTokens, setVestingTokens] = useState<number>(0);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      calculateTokenAllocation(parseFloat(amount));
    } else {
      setEstimatedTokens(0);
      setTgeTokens(0);
      setVestingTokens(0);
    }
  }, [amount, sale]);

  const calculateTokenAllocation = (contributionAmount: number) => {
    const tokens = contributionAmount / sale.salePrice;
    const tgeAmount = tokens * (sale.vestingSchedule.tgePercentage / 100);
    const vestingAmount = tokens - tgeAmount;

    setEstimatedTokens(tokens);
    setTgeTokens(tgeAmount);
    setVestingTokens(vestingAmount);
  };

  const validateForm = (): boolean => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }

    const numAmount = parseFloat(amount);
    if (numAmount < sale.minContribution) {
      setError(`Minimum contribution is $${sale.minContribution}`);
      return false;
    }

    if (numAmount > sale.maxContribution) {
      setError(`Maximum contribution is $${sale.maxContribution}`);
      return false;
    }

    if (!isWhitelisted) {
      setError('You must be whitelisted to contribute');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!publicKey) {
      setError('Please connect your wallet');
      return;
    }

    try {
      setLoading(true);
      const saleService = SaleService.getInstance();
      
      await saleService.submitContribution(
        sale.id,
        parseFloat(amount),
        currency
      );

      showToast('Contribution submitted successfully!', 'success');
      setAmount('');
      onSuccess();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit contribution');
      showToast('Contribution failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setAmount('');
    } else {
      setAmount(value);
    }
  };

  if (!isWhitelisted) {
    return (
      <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff6b6b' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Warning sx={{ fontSize: 60, color: '#ff6b6b', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#ff6b6b', mb: 2 }}>
            Whitelist Required
          </Typography>
          <Typography variant="body1" sx={{ color: '#b0b0b0', mb: 3 }}>
            You must be whitelisted to participate in this token sale. 
            Please apply for whitelist access or wait for approval.
          </Typography>
          <Button
            variant="outlined"
            sx={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
          >
            Apply for Whitelist
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
      <CardContent>
        <Typography variant="h5" sx={{ color: '#00ffff', mb: 3, fontWeight: 'bold' }}>
          💰 Make Your Investment
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Currency Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ color: '#b0b0b0' }}>Payment Currency</InputLabel>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'USDC' | 'SOL')}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00ffff',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4ecdc4',
                },
              }}
            >
              <MenuItem value="USDC">USDC</MenuItem>
              <MenuItem value="SOL">SOL</MenuItem>
            </Select>
          </FormControl>

          {/* Amount Input */}
          <TextField
            fullWidth
            label="Contribution Amount"
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder={`Enter amount (min: $${sale.minContribution}, max: $${sale.maxContribution})`}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#00ffff',
                },
                '&:hover fieldset': {
                  borderColor: '#4ecdc4',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00ffff',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#b0b0b0',
              },
            }}
            InputProps={{
              startAdornment: <AttachMoney sx={{ color: '#00ffff', mr: 1 }} />,
            }}
          />

          {/* Token Allocation Preview */}
          {estimatedTokens > 0 && (
            <Box sx={{ mb: 3, p: 3, background: 'rgba(0, 255, 255, 0.05)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold' }}>
                📊 Token Allocation Preview
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {estimatedTokens.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      Total Tokens
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                      {tgeTokens.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      TGE Tokens
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#ffa726', fontWeight: 'bold' }}>
                      {vestingTokens.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      Vesting Tokens
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Error Display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading || !amount || parseFloat(amount) <= 0}
            sx={{
              background: 'linear-gradient(135deg, #00ffff 0%, #4ecdc4 100%)',
              color: '#000',
              fontWeight: 'bold',
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                background: 'linear-gradient(135deg, #4ecdc4 0%, #00ffff 100%)',
              },
              '&:disabled': {
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LinearProgress sx={{ width: 20, mr: 1 }} />
                Processing...
              </Box>
            ) : (
              '🚀 Submit Contribution'
            )}
          </Button>
        </form>

        {/* Important Notes */}
        <Box sx={{ mt: 3, p: 2, background: 'rgba(255, 167, 38, 0.1)', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ color: '#ffa726', fontWeight: 'bold', mb: 1 }}>
            ⚠️ Important Notes:
          </Typography>
          <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
            • Contributions are final and cannot be refunded
          </Typography>
          <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
            • TGE tokens will be available immediately after sale completion
          </Typography>
          <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block' }}>
            • Vesting tokens will be released according to the schedule
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContributionForm;
