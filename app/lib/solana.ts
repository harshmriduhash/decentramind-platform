import { PublicKey } from '@solana/web3.js';
import { useState, useEffect } from 'react';
import { signInWithSolana, getCurrentUser, onAuthStateChange } from './firebase';

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balance: number;
  network: string;
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: 0,
    network: 'devnet'
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Initialize wallet connection
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        // Check if Phantom wallet is available
        if ('solana' in window && (window as any).solana?.isPhantom) {
          const phantom = (window as any).solana;
          
          // Check if already connected
          if (phantom.isConnected) {
            await connectWallet();
          }
        }
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeWallet();
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const connectWallet = async () => {
    try {
      if (!('solana' in window) || !(window as any).solana?.isPhantom) {
        throw new Error('Phantom wallet not found. Please install Phantom wallet.');
      }

      const phantom = (window as any).solana;
      
      // Connect to wallet
      const response = await phantom.connect();
      const publicKey = response.publicKey.toString();
      
      // Sign a message for authentication
      const message = `Login to DecentraMind - ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await phantom.signMessage(encodedMessage, 'utf8');
      
      // Authenticate with Firebase using Solana signature
      await signInWithSolana(publicKey, signature);
      
      // Update wallet state
      setWalletState(prev => ({
        ...prev,
        connected: true,
        publicKey,
        network: phantom.connection?.rpcEndpoint?.includes('mainnet') ? 'mainnet' : 'devnet'
      }));

      console.log('Wallet connected successfully:', publicKey);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      if ('solana' in window && (window as any).solana?.isPhantom) {
        await (window as any).solana.disconnect();
      }
      
      setWalletState({
        connected: false,
        publicKey: null,
        balance: 0,
        network: 'devnet'
      });
      
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const getBalance = async () => {
    try {
      if (!walletState.connected || !walletState.publicKey) {
        return 0;
      }

      // In a real implementation, this would query the Solana network
      // For now, we'll return a mock balance
      const mockBalance = Math.random() * 10; // 0-10 SOL
      setWalletState(prev => ({ ...prev, balance: mockBalance }));
      return mockBalance;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  };

  const signMessage = async (message: string) => {
    try {
      if (!walletState.connected) {
        throw new Error('Wallet not connected');
      }

      const phantom = (window as any).solana;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await phantom.signMessage(encodedMessage, 'utf8');
      
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  };

  const sendTransaction = async (transaction: any) => {
    try {
      if (!walletState.connected) {
        throw new Error('Wallet not connected');
      }

      const phantom = (window as any).solana;
      const signature = await phantom.signAndSendTransaction(transaction);
      
      return signature;
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw error;
    }
  };

  return {
    walletState,
    user,
    loading,
    connectWallet,
    disconnectWallet,
    getBalance,
    signMessage,
    sendTransaction,
    isConnected: walletState.connected,
    publicKey: walletState.publicKey,
    balance: walletState.balance,
    network: walletState.network
  };
};

// Utility functions for Solana operations
export const formatPublicKey = (publicKey: string): string => {
  if (!publicKey) return '';
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};

export const formatBalance = (balance: number): string => {
  return `${balance.toFixed(4)} SOL`;
};

export const validatePublicKey = (publicKey: string): boolean => {
  try {
    new PublicKey(publicKey);
    return true;
  } catch {
    return false;
  }
};

// Mock Solana connection for development
export const createMockConnection = () => {
  return {
    rpcEndpoint: 'https://api.devnet.solana.com',
    commitment: 'confirmed',
    confirmTransaction: async (signature: string) => {
      console.log('Mock transaction confirmed:', signature);
      return { value: { err: null } };
    }
  };
}; 