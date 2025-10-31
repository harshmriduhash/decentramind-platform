import { Connection, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

export interface WalletTransaction {
  signature: string;
  success: boolean;
  error?: string;
}

export interface WalletBalance {
  sol: number;
  dmt: number;
}

export class SolanaWalletService {
  private static instance: SolanaWalletService;
  private connection: Connection;

  static getInstance(): SolanaWalletService {
    if (!SolanaWalletService.instance) {
      SolanaWalletService.instance = new SolanaWalletService();
    }
    return SolanaWalletService.instance;
  }

  constructor() {
    this.connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
    );
  }

  // Get SOL balance
  async getSolBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Failed to get SOL balance:', error);
      throw new Error('Failed to get SOL balance');
    }
  }

  // Sign and send transaction
  async signAndSendTransaction(
    transaction: Transaction,
    wallet: any,
    feePayer: PublicKey
  ): Promise<WalletTransaction> {
    try {
      // Add recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = feePayer;

      // Sign transaction
      const signedTransaction = await wallet.signTransaction(transaction);

      // Send and confirm transaction
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
        }
      );

      // Wait for confirmation
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      return {
        signature,
        success: true
      };
    } catch (error) {
      console.error('Transaction failed:', error);
      return {
        signature: '',
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed'
      };
    }
  }

  // Validate wallet address
  isValidWalletAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }

  // Get transaction status
  async getTransactionStatus(signature: string): Promise<{
    confirmed: boolean;
    success: boolean;
    error?: string;
  }> {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      
      if (!status.value) {
        return { confirmed: false, success: false };
      }

      return {
        confirmed: status.value.confirmationStatus === 'confirmed' || status.value.confirmationStatus === 'finalized',
        success: !status.value.err,
        error: status.value.err ? status.value.err.toString() : undefined
      };
    } catch (error) {
      console.error('Failed to get transaction status:', error);
      return { confirmed: false, success: false, error: 'Failed to get transaction status' };
    }
  }

  // Get network status
  async getNetworkStatus(): Promise<{
    connected: boolean;
    slot: number;
    blockHeight: number;
  }> {
    try {
      const slot = await this.connection.getSlot();
      const blockHeight = await this.connection.getBlockHeight();
      
      return {
        connected: true,
        slot,
        blockHeight
      };
    } catch (error) {
      console.error('Failed to get network status:', error);
      return {
        connected: false,
        slot: 0,
        blockHeight: 0
      };
    }
  }
}

// Hook for using wallet service
export const useWalletService = () => {
  const wallet = useWallet();
  
  const signAndSendTransaction = async (transaction: Transaction): Promise<WalletTransaction> => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected or does not support signing');
    }

    const walletService = SolanaWalletService.getInstance();
    return await walletService.signAndSendTransaction(transaction, wallet, wallet.publicKey);
  };

  const getSolBalance = async (): Promise<number> => {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const walletService = SolanaWalletService.getInstance();
    return await walletService.getSolBalance(wallet.publicKey.toBase58());
  };

  return {
    signAndSendTransaction,
    getSolBalance,
    isConnected: wallet.connected,
    publicKey: wallet.publicKey,
    isValidWalletAddress: SolanaWalletService.getInstance().isValidWalletAddress.bind(SolanaWalletService.getInstance())
  };
}; 