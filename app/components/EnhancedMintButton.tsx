'use client';

import React, { useState } from 'react';
import { Button, Box, Typography, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Switch, FormControlLabel } from '@mui/material';
import { useWallet } from '../hooks/useWallet';
import { nftMintingService } from '../services/nftMintingService';
import { nftCollectionService } from '../services/nftCollectionService';

interface MintButtonProps {
  agentName?: string;
  agentImage?: string;
  agentDescription?: string;
  agentAttributes?: Array<{ trait_type: string; value: string }>;
  onMintSuccess?: (mintAddress: string, transactionSignature: string) => void;
  onMintError?: (error: string) => void;
  enableCollection?: boolean;
  enableSoulbound?: boolean;
}

export const MintButton: React.FC<MintButtonProps> = ({
  agentName = 'Care Orchestrator',
  agentImage = 'https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png',
  agentDescription = 'AI Healthcare Assistant Agent for DecentraMind Labs',
  agentAttributes = [
    { trait_type: 'Agent Type', value: 'Healthcare Assistant' },
    { trait_type: 'Level', value: 'Expert' },
    { trait_type: 'Rarity', value: 'Legendary' }
  ],
  onMintSuccess,
  onMintError,
  enableCollection = true,
  enableSoulbound = false
}) => {
  const { wallet, connected, connect, connecting } = useWallet();
  const [minting, setMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{
    mintAddress: string;
    transactionSignature: string;
    collectionAddress?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [useCollection, setUseCollection] = useState(enableCollection);
  const [isSoulbound, setIsSoulbound] = useState(enableSoulbound);

  // Set wallet in services when wallet changes
  React.useEffect(() => {
    if (wallet) {
      nftMintingService.setWallet(wallet);
      nftCollectionService.setWallet(wallet);
    }
  }, [wallet]);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (err) {
      setError('Failed to connect wallet. Please install Phantom wallet.');
      onMintError?.('Wallet connection failed');
    }
  };

  const handleMintNFT = async () => {
    if (!connected || !wallet) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setMinting(true);
      setError(null);

      console.log('Starting NFT minting process...');
      
      let result;

      if (useCollection) {
        // Check if collection exists, create if not
        if (!nftCollectionService.hasCollection()) {
          console.log('Creating NFT collection...');
          const collectionResult = await nftCollectionService.createCollection();
          console.log('Collection created:', collectionResult);
        }

        // Mint as part of collection
        result = await nftCollectionService.mintCollectionNFT(
          agentName,
          agentImage,
          agentDescription,
          agentAttributes,
          isSoulbound
        );

        // Add collection address to result
        result.collectionAddress = nftCollectionService.getCollectionAddress();
      } else {
        // Mint standalone NFT
        result = await nftMintingService.mintCustomNFT(
          agentName,
          'COAI',
          agentDescription,
          agentImage,
          agentAttributes,
          500
        );
      }

      console.log('NFT minted successfully:', result);

      setMintResult({
        mintAddress: result.mint,
        transactionSignature: result.transaction,
        collectionAddress: result.collectionAddress
      });

      setShowSuccessDialog(true);
      onMintSuccess?.(result.mint, result.transaction);

    } catch (err: any) {
      console.error('NFT minting failed:', err);
      const errorMessage = err.message || 'Failed to mint NFT. Please try again.';
      setError(errorMessage);
      onMintError?.(errorMessage);
    } finally {
      setMinting(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setMintResult(null);
  };

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

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      {!connected ? (
        <Button
          variant="contained"
          size="large"
          onClick={handleConnectWallet}
          disabled={connecting}
          sx={{
            background: 'linear-gradient(45deg, #00ffff, #0080ff)',
            color: 'white',
            fontWeight: 'bold',
            px: 4,
            py: 2,
            borderRadius: 2,
            '&:hover': {
              background: 'linear-gradient(45deg, #0080ff, #00ffff)',
              transform: 'scale(1.05)',
            },
            '&:disabled': {
              background: 'rgba(0, 128, 255, 0.3)',
            }
          }}
        >
          {connecting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
              Connecting...
            </>
          ) : (
            'Connect Phantom Wallet'
          )}
        </Button>
      ) : (
        <Box>
          {/* Mint Options */}
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={useCollection}
                  onChange={(e) => setUseCollection(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">Mint as Collection NFT</Typography>
                  <Chip label="Recommended" size="small" color="primary" />
                </Box>
              }
            />
            
            {useCollection && (
              <FormControlLabel
                control={
                  <Switch
                    checked={isSoulbound}
                    onChange={(e) => setIsSoulbound(e.target.checked)}
                    color="secondary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Soulbound Token (Non-transferable)</Typography>
                    <Chip label="SBT" size="small" color="secondary" />
                  </Box>
                }
              />
            )}
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleMintNFT}
            disabled={minting}
            sx={{
              background: 'linear-gradient(45deg, #2ed573, #00ff80)',
              color: 'white',
              fontWeight: 'bold',
              px: 4,
              py: 2,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(45deg, #00ff80, #2ed573)',
                transform: 'scale(1.05)',
              },
              '&:disabled': {
                background: 'rgba(46, 213, 115, 0.3)',
              }
            }}
          >
            {minting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Minting NFT...
              </>
            ) : (
              `🪙 Mint ${agentName} NFT`
            )}
          </Button>
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2, borderRadius: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {connected && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Connected: {wallet?.publicKey?.slice(0, 8)}...
        </Typography>
      )}

      {/* Success Dialog */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={handleCloseSuccessDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', color: 'success.main' }}>
          🎉 NFT Minted Successfully!
        </DialogTitle>
        <DialogContent>
          {mintResult && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {agentName} NFT
              </Typography>
              
              {mintResult.collectionAddress && (
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label="Collection NFT" 
                    color="primary" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Collection Address:</strong>
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace', 
                      backgroundColor: 'rgba(0,0,0,0.1)', 
                      p: 1, 
                      borderRadius: 1,
                      mb: 2,
                      wordBreak: 'break-all'
                    }}
                  >
                    {mintResult.collectionAddress}
                  </Typography>
                </Box>
              )}

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Mint Address:</strong>
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace', 
                  backgroundColor: 'rgba(0,0,0,0.1)', 
                  p: 1, 
                  borderRadius: 1,
                  mb: 2,
                  wordBreak: 'break-all'
                }}
              >
                {mintResult.mintAddress}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Transaction Signature:</strong>
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontFamily: 'monospace', 
                  backgroundColor: 'rgba(0,0,0,0.1)', 
                  p: 1, 
                  borderRadius: 1,
                  mb: 2,
                  wordBreak: 'break-all'
                }}
              >
                {mintResult.transactionSignature}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(getSolanaExplorerUrl(mintResult.transactionSignature), '_blank')}
                >
                  Solana Explorer
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(getSolscanUrl(mintResult.transactionSignature), '_blank')}
                >
                  Solscan
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(getSolSeaUrl(mintResult.mintAddress), '_blank')}
                >
                  SolSea
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(getMagicEdenUrl(mintResult.mintAddress), '_blank')}
                >
                  Magic Eden
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button 
            onClick={handleCloseSuccessDialog}
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #2ed573, #00ff80)',
              color: 'white',
              px: 3
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

