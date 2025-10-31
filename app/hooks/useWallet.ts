'use client';

import { useState, useEffect, useCallback } from 'react';

// Types for wallet connection
export interface WalletAdapter {
  publicKey: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export interface WalletContextType {
  wallet: WalletAdapter | null;
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

// Declare global window interface for Phantom wallet
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      isConnected: boolean;
      publicKey: string | null;
      connect: () => Promise<{ publicKey: string }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: (args: any) => void) => void;
    };
  }
}

export const useWallet = (): WalletContextType => {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Initialize wallet connection
  useEffect(() => {
    const initializeWallet = async () => {
      if (typeof window !== 'undefined' && window.solana && window.solana.isPhantom) {
        const phantomWallet = window.solana;
        
        const walletAdapter: WalletAdapter = {
          publicKey: phantomWallet.publicKey?.toString() || null,
          connected: phantomWallet.isConnected,
          connect: async () => {
            try {
              setConnecting(true);
              const response = await phantomWallet.connect();
              setPublicKey(response.publicKey.toString());
              setConnected(true);
            } catch (error) {
              console.error('Failed to connect wallet:', error);
              throw error;
            } finally {
              setConnecting(false);
            }
          },
          disconnect: async () => {
            try {
              await phantomWallet.disconnect();
              setPublicKey(null);
              setConnected(false);
            } catch (error) {
              console.error('Failed to disconnect wallet:', error);
              throw error;
            }
          }
        };

        setWallet(walletAdapter);
        setPublicKey(walletAdapter.publicKey);
        setConnected(walletAdapter.connected);

        // Listen for account changes
        phantomWallet.on('accountChanged', (publicKey: any) => {
          if (publicKey) {
            setPublicKey(publicKey.toString());
            setConnected(true);
          } else {
            setPublicKey(null);
            setConnected(false);
          }
        });

        // Listen for disconnect events
        phantomWallet.on('disconnect', () => {
          setPublicKey(null);
          setConnected(false);
        });
      }
    };

    initializeWallet();
  }, []);

  const connect = useCallback(async () => {
    if (!wallet) {
      throw new Error('Wallet not initialized');
    }
    await wallet.connect();
  }, [wallet]);

  const disconnect = useCallback(async () => {
    if (!wallet) {
      throw new Error('Wallet not initialized');
    }
    await wallet.disconnect();
  }, [wallet]);

  return {
    wallet,
    publicKey,
    connected,
    connecting,
    connect,
    disconnect
  };
};