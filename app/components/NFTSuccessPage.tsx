'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Chip, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import QRCode from 'qrcode';

interface NFTSuccessPageProps {
  mintAddress: string;
  transactionSignature: string;
  collectionAddress?: string;
  agentName: string;
  agentImage: string;
  agentAttributes: Array<{ trait_type: string; value: string }>;
}

export const NFTSuccessPage: React.FC<NFTSuccessPageProps> = ({
  mintAddress,
  transactionSignature,
  collectionAddress,
  agentName,
  agentImage,
  agentAttributes
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showQRDialog, setShowQRDialog] = useState(false);

  // Generate QR code for the NFT
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const solscanUrl = `https://solscan.io/token/${mintAddress}?cluster=devnet`;
        const qrCodeDataURL = await QRCode.toDataURL(solscanUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrCodeDataURL);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [mintAddress]);

  const getSolanaExplorerUrl = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  };

  const getSolscanUrl = (signature: string) => {
    return `https://solscan.io/tx/${signature}?cluster=devnet`;
  };

  const getSolSeaUrl = (mintAddress: string) => {
    return `https://sintra.ai/token/${mintAddress}`;
  };

  const getMagicEdenUrl = (mintAddress: string) => {
    return `https://magiceden.io/item-details/${mintAddress}`;
  };

  const getOpenSeaUrl = (mintAddress: string) => {
    return `https://opensea.io/assets/solana/${mintAddress}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      {/* Success Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ color: 'success.main', mb: 2 }}>
          🎉 NFT Minted Successfully!
        </Typography>
        <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>
          {agentName} NFT
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Your AI agent is now a unique NFT on the Solana blockchain
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* NFT Image and Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                NFT Details
              </Typography>
              
              {/* NFT Image */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: 200,
                    height: 200,
                    mx: 'auto',
                    borderRadius: '50%',
                    p: 1,
                    background: 'linear-gradient(45deg, #2ed573, #00ff80, #2ed573)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient 3s ease infinite',
                    '@keyframes gradient': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' }
                    }
                  }}
                >
                  <img
                    src={agentImage}
                    alt={`${agentName} NFT`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.textContent = '🤖';
                      fallback.style.cssText = 'width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; background: #f0f0f0; border-radius: 50%;';
                      e.currentTarget.parentNode?.appendChild(fallback);
                    }}
                  />
                </Box>
              </Box>

              {/* NFT Attributes */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                Attributes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {agentAttributes.map((attr, index) => (
                  <Chip
                    key={index}
                    label={`${attr.trait_type}: ${attr.value}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>

              {/* QR Code Button */}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setShowQRDialog(true)}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Generating QR Code...
                  </>
                ) : (
                  '📱 Show QR Code'
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Transaction Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Transaction Details
              </Typography>

              {/* Mint Address */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Mint Address
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    wordBreak: 'break-all',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.200' }
                  }}
                  onClick={() => copyToClipboard(mintAddress)}
                >
                  {mintAddress}
                </Box>
              </Box>

              {/* Transaction Signature */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Transaction Signature
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    wordBreak: 'break-all',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'grey.200' }
                  }}
                  onClick={() => copyToClipboard(transactionSignature)}
                >
                  {transactionSignature}
                </Box>
              </Box>

              {/* Collection Address (if available) */}
              {collectionAddress && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Collection Address
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      wordBreak: 'break-all',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'grey.200' }
                    }}
                    onClick={() => copyToClipboard(collectionAddress)}
                  >
                    {collectionAddress}
                  </Box>
                </Box>
              )}

              {/* Action Buttons */}
              <Typography variant="h6" sx={{ mb: 2 }}>
                View on Block Explorers
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => window.open(getSolanaExplorerUrl(transactionSignature), '_blank')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  🔍 Solana Explorer
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.open(getSolscanUrl(transactionSignature), '_blank')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  📊 Solscan
                </Button>
              </Box>

              <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
                View on Marketplaces
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  onClick={() => window.open(getSolSeaUrl(mintAddress), '_blank')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  🌊 SolSea
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.open(getMagicEdenUrl(mintAddress), '_blank')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  🎭 Magic Eden
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => window.open(getOpenSeaUrl(mintAddress), '_blank')}
                  sx={{ justifyContent: 'flex-start' }}
                >
                  🌊 OpenSea
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Success Message */}
      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body1">
          <strong>Congratulations!</strong> Your {agentName} NFT has been successfully minted on Solana Devnet. 
          You can now view it on various block explorers and marketplaces. 
          The NFT represents ownership of your AI agent and can be used for verification and future integrations.
        </Typography>
      </Alert>

      {/* QR Code Dialog */}
      <Dialog
        open={showQRDialog}
        onClose={() => setShowQRDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>QR Code for {agentName} NFT</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          {qrCodeUrl && (
            <Box>
              <img src={qrCodeUrl} alt="NFT QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Scan this QR code to view your NFT on Solscan
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQRDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

