'use client';

import React, { useState } from 'react';
import { Button, Box, Typography, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useWallet } from '../hooks/useWallet';
import { nftMintingService, MintResult } from '../services/nftMintingService';
import { NFTCacheService } from '../services/nftCacheService';

interface MintButtonProps {
  agentName?: string;
  agentImage?: string;
  agentDescription?: string;
  agentAttributes?: Array<{ trait_type: string; value: string }>;
  onMintSuccess?: (mintAddress: string, transactionSignature: string) => void;
  onMintError?: (error: string) => void;
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
  onMintError
}) => {
  const { wallet, connected, connect, connecting } = useWallet();
  const [minting, setMinting] = useState(false);
  const [mintResult, setMintResult] = useState<{
    mintAddress: string;
    transactionSignature: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Set wallet in NFT service when wallet changes
  React.useEffect(() => {
    if (wallet) {
      nftMintingService.setWallet(wallet);
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
      
      // Mint the NFT
      const result: MintResult = await nftMintingService.mintCustomNFT(
        agentName,
        'COAI', // Symbol for Care Orchestrator AI
        agentDescription,
        agentImage,
        agentAttributes,
        500 // 5% royalty
      );

      console.log('NFT minted successfully:', result);

      setMintResult({
        mintAddress: result.mintAddress,
        transactionSignature: result.txSignature
      });

      setShowSuccessDialog(true);
      
      // Cache the NFT metadata for future use
      if (wallet?.publicKey) {
        try {
          await NFTCacheService.cacheUserNFT(
            wallet.publicKey,
            result.mintAddress,
            {
              name: agentName,
              symbol: 'COAI',
              description: agentDescription,
              image: agentImage,
              attributes: agentAttributes,
              collection: 'DecentraMind AI Agents',
              external_url: 'https://decentramind.com'
            }
          );
          console.log('NFT metadata cached successfully');
        } catch (cacheError) {
          console.error('Failed to cache NFT metadata:', cacheError);
          // Don't fail the minting process if caching fails
        }
      }
      
      onMintSuccess?.(result.mintAddress, result.txSignature);

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
            '🪙 Mint Care Orchestrator NFT'
          )}
        </Button>
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

      {connected && wallet?.publicKey && (
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Connected: {String(wallet.publicKey).slice(0, 8)}...
        </Typography>
      )}

      {/* Success Dialog */}
      <Dialog 
        open={showSuccessDialog} 
        onClose={handleCloseSuccessDialog}
        maxWidth="sm"
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

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(getSolanaExplorerUrl(mintResult.transactionSignature), '_blank')}
                >
                  View on Solana Explorer
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => window.open(getSolscanUrl(mintResult.transactionSignature), '_blank')}
                >
                  View on Solscan
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
