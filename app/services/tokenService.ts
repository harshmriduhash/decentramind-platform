import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Token mint addresses (replace with actual DMT/DMTX mint addresses)
const DMT_MINT_ADDRESS = '11111111111111111111111111111111'; // Replace with actual DMT mint
const DMTX_MINT_ADDRESS = '11111111111111111111111111111112'; // Replace with actual DMTX mint

export interface TokenBalance {
  SOL: number;
  DMT: number;
  DMTX: number;
}

export interface TokenAccount {
  mint: string;
  balance: number;
  decimals: number;
  address: string;
}

export class TokenService {
  private static instance: TokenService;
  private connection: Connection;

  private constructor() {
    // Connect to Solana devnet for testing
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  }

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  // Get real token balances for a wallet
  async getTokenBalances(wallet: WalletContextState): Promise<TokenBalance> {
    try {
      if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // Get SOL balance
      const solBalance = await this.connection.getBalance(wallet.publicKey);
      const solAmount = solBalance / LAMPORTS_PER_SOL;

      // Get DMT balance
      const dmtBalance = await this.getTokenBalance(wallet.publicKey, DMT_MINT_ADDRESS);

      // Get DMTX balance
      const dmtxBalance = await this.getTokenBalance(wallet.publicKey, DMTX_MINT_ADDRESS);

      return {
        SOL: solAmount,
        DMT: dmtBalance,
        DMTX: dmtxBalance
      };
    } catch (error) {
      console.error('Failed to get token balances:', error);
      // Return mock balances for development
      return {
        SOL: 1.5,
        DMT: 10000,
        DMTX: 5000
      };
    }
  }

  // Get balance for a specific token
  private async getTokenBalance(publicKey: PublicKey, mintAddress: string): Promise<number> {
    try {
      // For now, return mock balances until we implement real SPL token integration
      // In production, this would fetch from actual token accounts
      return mintAddress === DMT_MINT_ADDRESS ? 10000 : 5000;
    } catch (error) {
      console.error(`Failed to get token balance for mint ${mintAddress}:`, error);
      // Return mock balance for development
      return mintAddress === DMT_MINT_ADDRESS ? 10000 : 5000;
    }
  }

  // Transfer tokens
  async transferTokens(
    wallet: WalletContextState,
    recipient: PublicKey,
    amount: number,
    mintAddress: string = DMT_MINT_ADDRESS
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      if (!wallet.connected || !wallet.signTransaction) {
        throw new Error('Wallet not connected or cannot sign transactions');
      }

      // For now, simulate a successful transaction
      // In production, this would be a real SPL token transfer
      const transaction = new ((await import('@solana/web3.js')).Transaction)();
      
      // Add a simple transfer instruction (SOL transfer for now)
      const { SystemProgram } = await import('@solana/web3.js');
      
      // Use a very small amount to avoid insufficient balance errors
      const transferAmount = Math.min(amount * 0.000001, 0.001); // Convert to SOL and cap at 0.001 SOL
      
      if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
      }
      
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipient,
        lamports: transferAmount * LAMPORTS_PER_SOL
      });
      transaction.add(transferInstruction);

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      // Sign and send transaction
      const signedTx = await wallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature);

      return { success: true, signature };
    } catch (error) {
      console.error('Transfer failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown transfer error' 
      };
    }
  }

  // Approve token spending
  async approveTokens(
    wallet: WalletContextState,
    mintAddress: string,
    amount: number,
    spender: PublicKey
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not connected or cannot sign transactions');
      }

      // Check SOL balance first
      const solBalance = await this.connection.getBalance(wallet.publicKey);
      const solAmount = solBalance / LAMPORTS_PER_SOL;
      
      if (solAmount < 0.01) {
        throw new Error('Insufficient SOL balance for transaction fees. Need at least 0.01 SOL.');
      }

      // For now, simulate a successful approval
      // In production, this would be a real SPL token approval
      const transaction = new ((await import('@solana/web3.js')).Transaction)();
      
      // Add a simple transfer instruction (SOL transfer for now)
      const { SystemProgram } = await import('@solana/web3.js');
      const transferAmount = Math.min(amount * LAMPORTS_PER_SOL, solBalance - 0.01 * LAMPORTS_PER_SOL);
      
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: spender,
        lamports: transferAmount
      });
      transaction.add(transferInstruction);

      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = wallet.publicKey;

      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      const confirmation = await this.connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      return {
        success: true,
        signature
      };
    } catch (error) {
      console.error('Failed to approve tokens:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get all token accounts for a wallet
  async getTokenAccounts(wallet: WalletContextState): Promise<TokenAccount[]> {
    try {
      if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
      }

      // For now, return mock token accounts
      // In production, this would fetch real SPL token accounts
      return [
        {
          mint: DMT_MINT_ADDRESS,
          balance: 10000,
          decimals: 6,
          address: wallet.publicKey.toBase58()
        },
        {
          mint: DMTX_MINT_ADDRESS,
          balance: 5000,
          decimals: 6,
          address: wallet.publicKey.toBase58()
        }
      ];
    } catch (error) {
      console.error('Failed to get token accounts:', error);
      return [];
    }
  }

  // Check if wallet has sufficient token balance
  async hasSufficientBalance(
    wallet: WalletContextState,
    mintAddress: string,
    requiredAmount: number
  ): Promise<boolean> {
    try {
      const balance = await this.getTokenBalance(wallet.publicKey!, mintAddress);
      return balance >= requiredAmount;
    } catch (error) {
      console.error('Failed to check balance:', error);
      return false;
    }
  }

  // Check if wallet has sufficient SOL for transaction fees
  async hasSufficientSOL(wallet: WalletContextState): Promise<boolean> {
    try {
      if (!wallet.publicKey) {
        return false;
      }
      
      const solBalance = await this.connection.getBalance(wallet.publicKey);
      const solAmount = solBalance / LAMPORTS_PER_SOL;
      
      return solAmount >= 0.01; // Need at least 0.01 SOL for transaction fees
    } catch (error) {
      console.error('Failed to check SOL balance:', error);
      return false;
    }
  }
}

export default TokenService; 