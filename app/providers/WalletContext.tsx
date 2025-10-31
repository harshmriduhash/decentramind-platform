'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider, useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  shortAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  copyAddress: () => void;
  checkAgentMintEligibility: (address: string) => Promise<boolean>;
  mintAgent: (agentType: string, customData?: any) => Promise<void>;
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Toast notification system
class ToastManager {
  private static instance: ToastManager;
  private toasts: HTMLElement[] = [];
  private container: HTMLElement | null = null;

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  private createContainer(): HTMLElement {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'fixed top-20 left-4 z-50 space-y-2 pointer-events-none';
      this.container.style.maxWidth = '400px';
      document.body.appendChild(this.container);
    }
    return this.container;
  }

  show(type: 'success' | 'error' | 'info', message: string) {
    const container = this.createContainer();
    
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-lg shadow-lg transition-all duration-300 pointer-events-auto ${
      type === 'success' ? 'bg-green-600 text-white border border-green-500' :
      type === 'error' ? 'bg-red-600 text-white border border-red-500' :
      'bg-blue-600 text-white border border-blue-500'
    }`;
    
    toast.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium">${message}</span>
        <button class="ml-2 text-white/70 hover:text-white" onclick="this.parentElement.parentElement.remove()">
          ✕
        </button>
      </div>
    `;
    
    // Add to container
    container.appendChild(toast);
    this.toasts.push(toast);
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
      toast.style.opacity = '1';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      this.removeToast(toast);
    }, 4000);
  }

  private removeToast(toast: HTMLElement) {
    if (toast && toast.parentElement) {
      toast.style.transform = 'translateX(-100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.parentElement.removeChild(toast);
        }
        this.toasts = this.toasts.filter(t => t !== toast);
      }, 300);
    }
  }
}

// Internal component that uses Solana wallet adapter
const WalletContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { publicKey, connected, connect, disconnect, connecting, wallet } = useSolanaWallet();
  const [error, setError] = useState<string | null>(null);

  // Format wallet address for display
  const formatAddress = (address: string): string => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const walletAddress = publicKey?.toString() || null;
  const shortAddress = walletAddress ? formatAddress(walletAddress) : null;
  const isConnected = connected;
  const isLoading = connecting;

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    try {
      setError(null);
      await connect();
      
      if (walletAddress) {
        // Save to localStorage
        localStorage.setItem('decentramind_wallet_address', walletAddress);
        localStorage.setItem('decentramind_wallet_connected', 'true');
        
        // Show success toast
        ToastManager.getInstance().show('success', `✅ Wallet Connected: ${formatAddress(walletAddress)}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      ToastManager.getInstance().show('error', `❌ Failed to connect wallet: ${err.message || 'Unknown error'}`);
    }
  }, [connect, walletAddress]);

  // Disconnect wallet function
  const disconnectWallet = useCallback(async () => {
    try {
      await disconnect();
      
      // Clear localStorage
      localStorage.removeItem('decentramind_wallet_address');
      localStorage.removeItem('decentramind_wallet_connected');
      
      ToastManager.getInstance().show('info', '🔌 Wallet Disconnected');
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect wallet');
      ToastManager.getInstance().show('error', `❌ Failed to disconnect wallet: ${err.message || 'Unknown error'}`);
    }
  }, [disconnect]);

  // Copy address to clipboard
  const copyAddress = useCallback(async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        ToastManager.getInstance().show('success', '📋 Address copied to clipboard');
      } catch (err) {
        ToastManager.getInstance().show('error', '❌ Failed to copy address');
      }
    }
  }, [walletAddress]);

  // Check agent mint eligibility
  const checkAgentMintEligibility = useCallback(async (address: string): Promise<boolean> => {
    try {
      // Simulate API call to check eligibility
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock logic: check if user has minted max agents (3)
      const mintedAgents = localStorage.getItem(`minted_agents_${address}`) || '0';
      const agentCount = parseInt(mintedAgents);
      
      return agentCount < 3; // Max 3 agents per wallet
    } catch (err) {
      console.error('Error checking mint eligibility:', err);
      return false;
    }
  }, []);

  // Mint agent function
  const mintAgent = useCallback(async (agentType: string, customData?: any) => {
    if (!walletAddress) {
      ToastManager.getInstance().show('error', '❌ Please connect your wallet first');
      return;
    }

    try {
      // Check eligibility first
      const isEligible = await checkAgentMintEligibility(walletAddress);
      if (!isEligible) {
        ToastManager.getInstance().show('error', '❌ You have reached your agent mint limit (3 agents)');
        return;
      }

      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update minted agents count
      const currentCount = parseInt(localStorage.getItem(`minted_agents_${walletAddress}`) || '0');
      localStorage.setItem(`minted_agents_${walletAddress}`, (currentCount + 1).toString());
      
      // Store custom agent data if provided
      if (customData) {
        localStorage.setItem(`custom_agent_${walletAddress}_${Date.now()}`, JSON.stringify(customData));
      }
      
      ToastManager.getInstance().show('success', `🎉 Agent Minted Successfully to Wallet: ${shortAddress}`);
      
    } catch (err: any) {
      ToastManager.getInstance().show('error', `❌ Failed to mint agent: ${err.message || 'Unknown error'}`);
    }
  }, [walletAddress, shortAddress, checkAgentMintEligibility]);

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    ToastManager.getInstance().show(type, message);
  }, []);

  const value: WalletContextType = {
    isConnected,
    walletAddress,
    shortAddress,
    connectWallet,
    disconnectWallet,
    copyAddress,
    checkAgentMintEligibility,
    mintAgent,
    showToast,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletContextProvider>
            {children}
          </WalletContextProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};