import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAccount } from '@solana/spl-token';

// Mock DMT token mint address (replace with actual address)
const DMT_TOKEN_MINT = new PublicKey('So11111111111111111111111111111111111111112'); // Using SOL as placeholder

export interface TokenBalance {
  balance: number;
  decimals: number;
  mint: string;
}

export interface WalletInfo {
  address: string;
  dmtBalance: number;
  stakedAmount: number;
  votingPower: number;
  isConnected: boolean;
}

class DMTTokenService {
  private static instance: DMTTokenService;
  private connection: Connection;
  private currentWallet: WalletInfo | null = null;

  constructor() {
    // Use Solana devnet for development
    this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  }

  static getInstance(): DMTTokenService {
    if (!DMTTokenService.instance) {
      DMTTokenService.instance = new DMTTokenService();
    }
    return DMTTokenService.instance;
  }

  // Mock wallet connection (replace with actual wallet integration)
  async connectWallet(): Promise<WalletInfo> {
    try {
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock wallet data - in production, this would come from actual wallet
      const mockWallet: WalletInfo = {
        address: '3eUD...ZxhQ', // Mock wallet address
        dmtBalance: 150, // Mock balance as specified
        stakedAmount: 50, // Mock staked amount
        votingPower: 200, // Mock voting power
        isConnected: true,
      };

      this.currentWallet = mockWallet;
      return mockWallet;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw new Error('Failed to connect wallet');
    }
  }

  async disconnectWallet(): Promise<void> {
    this.currentWallet = null;
  }

  getCurrentWallet(): WalletInfo | null {
    return this.currentWallet;
  }

  // Get DMT balance for a wallet address
  async getBalance(walletAddress: string): Promise<number> {
    try {
      // Mock balance data - in production, this would query the actual token account
      const mockBalances: Record<string, number> = {
        '3eUD...ZxhQ': 150,
        '0x1234567890123456789012345678901234567890': 250,
        '0x9876543210987654321098765432109876543210': 100,
      };

      return mockBalances[walletAddress] || 0;
    } catch (error) {
      console.error('Error getting DMT balance:', error);
      return 0;
    }
  }

  // Get staked DMT amount for a wallet address
  async getStakedAmount(walletAddress: string): Promise<number> {
    try {
      // Mock staked data - in production, this would query the staking contract
      const mockStaked: Record<string, number> = {
        '3eUD...ZxhQ': 50,
        '0x1234567890123456789012345678901234567890': 100,
        '0x9876543210987654321098765432109876543210': 25,
      };

      return mockStaked[walletAddress] || 0;
    } catch (error) {
      console.error('Error getting staked DMT:', error);
      return 0;
    }
  }

  // Get total voting power (balance + staked + delegated)
  async getVotingPower(walletAddress: string): Promise<number> {
    try {
      const balance = await this.getBalance(walletAddress);
      const staked = await this.getStakedAmount(walletAddress);
      const delegated = await this.getDelegatedPower(walletAddress);
      
      return balance + staked + delegated;
    } catch (error) {
      console.error('Error getting voting power:', error);
      return 0;
    }
  }

  // Get delegated voting power (from delegationService)
  async getDelegatedPower(walletAddress: string): Promise<number> {
    try {
      // This would typically query the delegation service
      // For now, return mock data
      const mockDelegated: Record<string, number> = {
        '3eUD...ZxhQ': 0,
        '0x1234567890123456789012345678901234567890': 25,
        '0x9876543210987654321098765432109876543210': 10,
      };

      return mockDelegated[walletAddress] || 0;
    } catch (error) {
      console.error('Error getting delegated power:', error);
      return 0;
    }
  }

  // Check if wallet has minimum DMT threshold
  async hasMinDMT(walletAddress: string, threshold: number = 100): Promise<boolean> {
    try {
      const balance = await this.getBalance(walletAddress);
      return balance >= threshold;
    } catch (error) {
      console.error('Error checking minimum DMT:', error);
      return false;
    }
  }

  // Check if current wallet has minimum DMT for voting
  hasMinimumBalanceForVoting(minimumBalance: number = 100): boolean {
    if (!this.currentWallet) return false;
    return this.currentWallet.dmtBalance >= minimumBalance;
  }

  // Check if current wallet has minimum DMT for proposal creation
  hasMinimumBalanceForProposal(minimumBalance: number = 100): boolean {
    if (!this.currentWallet) return false;
    return this.currentWallet.dmtBalance >= minimumBalance;
  }

  // Format balance for display
  formatBalance(balance: number): string {
    if (balance >= 1000000) {
      return `${(balance / 1000000).toFixed(2)}M`;
    } else if (balance >= 1000) {
      return `${(balance / 1000).toFixed(2)}K`;
    } else {
      return balance.toFixed(0);
    }
  }

  // Get balance status for UI display
  getBalanceStatus(balance: number, minimum: number): {
    status: 'sufficient' | 'insufficient' | 'warning';
    message: string;
    color: string;
  } {
    if (balance >= minimum) {
      return {
        status: 'sufficient',
        message: `Sufficient balance: ${this.formatBalance(balance)} DMT`,
        color: '#4caf50'
      };
    } else if (balance >= minimum * 0.5) {
      return {
        status: 'warning',
        message: `Low balance: ${this.formatBalance(balance)} DMT (${minimum} required)`,
        color: '#ff9800'
      };
    } else {
      return {
        status: 'insufficient',
        message: `Insufficient balance: ${this.formatBalance(balance)} DMT (${minimum} required)`,
        color: '#f44336'
      };
    }
  }

  // Get token info
  getTokenInfo(): { symbol: string; name: string; decimals: number; mint: string } {
    return {
      symbol: 'DMT',
      name: 'DecentraMind Token',
      decimals: 9,
      mint: DMT_TOKEN_MINT.toString(),
    };
  }
}

export default DMTTokenService.getInstance();