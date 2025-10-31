// Solana Service for DecentraMind
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletContextState } from '@solana/wallet-adapter-react';

// DMT Token Configuration
export const DMT_TOKEN_CONFIG = {
  DECIMALS: 9,
  TOTAL_SUPPLY: 1_000_000_000, // 1 Billion DMT
  SYMBOL: 'DMT',
  NAME: 'DecentraMind Token',
  DESCRIPTION: 'The native utility token of the DecentraMind AI ecosystem'
};

// Mock DMT Token for development
export const MOCK_DMT_TOKEN = {
  mint: new PublicKey('11111111111111111111111111111111'), // Mock mint address
  decimals: DMT_TOKEN_CONFIG.DECIMALS,
  symbol: DMT_TOKEN_CONFIG.SYMBOL,
  name: DMT_TOKEN_CONFIG.NAME
};

export interface TokenBalance {
  mint: string;
  balance: number;
  decimals: number;
  symbol: string;
  name: string;
}

export interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
  amount?: number;
  fee?: number;
}

export interface StakingInfo {
  stakedAmount: number;
  rewardsEarned: number;
  apy: number;
  lockPeriod: number;
  unlockDate?: string;
}

export class SolanaService {
  private static instance: SolanaService;
  private connection: Connection | null = null;
  private wallet: WalletContextState | null = null;
  private network: WalletAdapterNetwork = WalletAdapterNetwork.Devnet;

  static getInstance(): SolanaService {
    if (!SolanaService.instance) {
      SolanaService.instance = new SolanaService();
    }
    return SolanaService.instance;
  }

  initialize(wallet: WalletContextState, network: WalletAdapterNetwork = WalletAdapterNetwork.Devnet): void {
    this.wallet = wallet;
    this.network = network;
    
    // Initialize connection
    const endpoint = this.getRpcEndpoint();
    this.connection = new Connection(endpoint, 'confirmed');
    
    console.log('Solana service initialized with network:', network);
  }

  private getRpcEndpoint(): string {
    switch (this.network) {
      case WalletAdapterNetwork.Mainnet:
        return 'https://api.mainnet-beta.solana.com';
      case WalletAdapterNetwork.Devnet:
        return 'https://api.devnet.solana.com';
      case WalletAdapterNetwork.Testnet:
        return 'https://api.testnet.solana.com';
      default:
        return 'https://api.devnet.solana.com';
    }
  }

  async getBalance(): Promise<number> {
    if (!this.connection || !this.wallet?.publicKey) {
      return 0;
    }

    try {
      const balance = await this.connection.getBalance(this.wallet.publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  async getDMTBalance(): Promise<TokenBalance> {
    if (!this.connection || !this.wallet?.publicKey) {
      return {
        mint: MOCK_DMT_TOKEN.mint.toString(),
        balance: 1000, // Mock balance for development
        decimals: MOCK_DMT_TOKEN.decimals,
        symbol: MOCK_DMT_TOKEN.symbol,
        name: MOCK_DMT_TOKEN.name
      };
    }

    try {
      // In a real implementation, this would query the DMT token account
      // For now, we'll return mock data
      return {
        mint: MOCK_DMT_TOKEN.mint.toString(),
        balance: 1000,
        decimals: MOCK_DMT_TOKEN.decimals,
        symbol: MOCK_DMT_TOKEN.symbol,
        name: MOCK_DMT_TOKEN.name
      };
    } catch (error) {
      console.error('Failed to get DMT balance:', error);
      return {
        mint: MOCK_DMT_TOKEN.mint.toString(),
        balance: 0,
        decimals: MOCK_DMT_TOKEN.decimals,
        symbol: MOCK_DMT_TOKEN.symbol,
        name: MOCK_DMT_TOKEN.name
      };
    }
  }

  async mintAgent(cost: number): Promise<TransactionResult> {
    if (!this.wallet?.publicKey || !this.connection) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    try {
      // Create a mock transaction for development
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: new PublicKey('11111111111111111111111111111111'), // Mock recipient
          lamports: cost * LAMPORTS_PER_SOL * 0.001 // Convert DMT cost to SOL
        })
      );

      const signature = await this.wallet.sendTransaction(transaction, this.connection);
      
      return {
        success: true,
        signature,
        amount: cost,
        fee: 0.000005 // Mock fee
      };
    } catch (error) {
      console.error('Minting transaction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      };
    }
  }

  async stakeTokens(amount: number): Promise<TransactionResult> {
    if (!this.wallet?.publicKey || !this.connection) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    try {
      // Mock staking transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: new PublicKey('22222222222222222222222222222222'), // Staking contract
          lamports: amount * LAMPORTS_PER_SOL * 0.001
        })
      );

      const signature = await this.wallet.sendTransaction(transaction, this.connection);
      
      return {
        success: true,
        signature,
        amount,
        fee: 0.000005
      };
    } catch (error) {
      console.error('Staking transaction failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      };
    }
  }

  async getStakingInfo(): Promise<StakingInfo> {
    // Mock staking information
    return {
      stakedAmount: 500,
      rewardsEarned: 25,
      apy: 12.5,
      lockPeriod: 30,
      unlockDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async participateInIDO(amount: number, projectId: string): Promise<TransactionResult> {
    if (!this.wallet?.publicKey || !this.connection) {
      return {
        success: false,
        error: 'Wallet not connected'
      };
    }

    try {
      // Mock IDO participation transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.wallet.publicKey,
          toPubkey: new PublicKey('33333333333333333333333333333333'), // IDO contract
          lamports: amount * LAMPORTS_PER_SOL * 0.001
        })
      );

      const signature = await this.wallet.sendTransaction(transaction, this.connection);
      
      return {
        success: true,
        signature,
        amount,
        fee: 0.000005
      };
    } catch (error) {
      console.error('IDO participation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      };
    }
  }

  async getTransactionHistory(): Promise<Array<{
    signature: string;
    amount: number;
    type: 'mint' | 'stake' | 'ido' | 'transfer';
    timestamp: string;
    status: 'confirmed' | 'pending' | 'failed';
  }>> {
    // Mock transaction history
    return [
      {
        signature: 'mock-signature-1',
        amount: 100,
        type: 'mint',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed'
      },
      {
        signature: 'mock-signature-2',
        amount: 500,
        type: 'stake',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed'
      },
      {
        signature: 'mock-signature-3',
        amount: 250,
        type: 'ido',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed'
      }
    ];
  }

  // Utility methods
  formatTokenAmount(amount: number, decimals: number = 9): string {
    return (amount / Math.pow(10, decimals)).toFixed(2);
  }

  parseTokenAmount(amount: string, decimals: number = 9): number {
    return parseFloat(amount) * Math.pow(10, decimals);
  }

  getNetworkName(): string {
    switch (this.network) {
      case WalletAdapterNetwork.Mainnet:
        return 'Mainnet';
      case WalletAdapterNetwork.Devnet:
        return 'Devnet';
      case WalletAdapterNetwork.Testnet:
        return 'Testnet';
      default:
        return 'Devnet';
    }
  }

  isConnected(): boolean {
    return this.wallet?.connected || false;
  }

  getWalletAddress(): string | null {
    return this.wallet?.publicKey?.toString() || null;
  }
}

export default SolanaService.getInstance(); 