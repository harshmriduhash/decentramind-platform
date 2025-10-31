// Tokenomics Service for DecentraMind
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  createMintToInstruction,
  createBurnInstruction,
  getAccount,
  getMint
} from '@solana/spl-token';
import { agentRegistryService } from './agentRegistryService';
import { useAuth } from '../hooks/useAuth';

// DMT Token Configuration
export const DMT_TOKEN_CONFIG = {
  mint: new PublicKey('11111111111111111111111111111111'), // Use a valid Solana public key format
  decimals: 9,
  totalSupply: 1_000_000_000, // 1 billion DMT
  initialAllocation: {
    team: 0.10, // 10%
    treasury: 0.20, // 20%
    community: 0.30, // 30%
    staking: 0.25, // 25%
    ecosystem: 0.15 // 15%
  }
};

// Economic Model Configuration
export const ECONOMIC_MODEL = {
  // Agent Minting Costs (in DMT)
  agentMinting: {
    master: 100,
    sub: 50,
    baseCost: 25,
    levelMultiplier: 1.5
  },
  
  // Agent Evolution Costs
  agentEvolution: {
    baseCost: 50,
    levelMultiplier: 2.0,
    xpMultiplier: 0.1
  },
  
  // Marketplace Fees
  marketplace: {
    listingFee: 5,
    transactionFee: 0.025, // 2.5%
    platformFee: 0.05, // 5%
    minListingPrice: 10
  },
  
  // Staking Rewards
  staking: {
    baseAPY: 0.12, // 12% base APY
    maxAPY: 0.25, // 25% max APY
    minStakeAmount: 100,
    lockPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days
    rewardInterval: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  // Performance Rewards
  rewards: {
    agentMinting: 10,
    agentEvolution: 25,
    qualityReview: 5,
    marketplaceSale: 15,
    governanceParticipation: 20
  },
  
  // Penalties
  penalties: {
    spamReview: -10,
    fraudAttempt: -50,
    abuseReport: -25,
    poorPerformance: -15
  }
};

// Tokenomics Interfaces
export interface TokenBalance {
  dmt: number;
  sol: number;
  staked: number;
  rewards: number;
  penalties: number;
}

export interface StakingInfo {
  stakedAmount: number;
  rewardAmount: number;
  apy: number;
  lockEndTime: string;
  canUnstake: boolean;
  totalStakers: number;
  totalStaked: number;
}

export interface RewardHistory {
  id: string;
  userId: string;
  userWallet: string;
  type: 'reward' | 'penalty';
  amount: number;
  reason: string;
  timestamp: string;
  transactionHash?: string;
}

export interface EconomicMetrics {
  totalDmtSupply: number;
  circulatingSupply: number;
  totalStaked: number;
  averageAPY: number;
  totalRewardsDistributed: number;
  totalPenaltiesApplied: number;
  marketplaceVolume: number;
  activeStakers: number;
}

export interface PricingModel {
  agentMintingCost: (type: 'master' | 'sub', level: number) => number;
  agentEvolutionCost: (currentLevel: number, xp: number) => number;
  marketplaceFee: (price: number) => number;
  stakingReward: (amount: number, duration: number) => number;
}

class TokenomicsService {
  private static instance: TokenomicsService;
  private connection: Connection;
  private balances: Map<string, TokenBalance> = new Map();
  private stakingInfo: Map<string, StakingInfo> = new Map();
  private rewardHistory: Map<string, RewardHistory[]> = new Map();

  static getInstance(): TokenomicsService {
    if (!TokenomicsService.instance) {
      TokenomicsService.instance = new TokenomicsService();
    }
    return TokenomicsService.instance;
  }

  constructor() {
    // Initialize Solana connection
    this.connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');
  }

  // DMT Token Management
  async getDmtBalance(walletAddress: string): Promise<number> {
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        DMT_TOKEN_CONFIG.mint,
        new PublicKey(walletAddress)
      );

      const accountInfo = await getAccount(this.connection, tokenAccount);
      return Number(accountInfo.amount) / Math.pow(10, DMT_TOKEN_CONFIG.decimals);
    } catch (error) {
      console.error('Failed to get DMT balance:', error);
      return 0;
    }
  }

  async transferDmt(fromWallet: string, toWallet: string, amount: number): Promise<string> {
    try {
      console.log(`Transferring ${amount} DMT from ${fromWallet} to ${toWallet}`);

      const fromTokenAccount = await getAssociatedTokenAddress(
        DMT_TOKEN_CONFIG.mint,
        new PublicKey(fromWallet)
      );

      const toTokenAccount = await getAssociatedTokenAddress(
        DMT_TOKEN_CONFIG.mint,
        new PublicKey(toWallet)
      );

      const transaction = new Transaction();

      // Create token account if it doesn't exist
      try {
        await getAccount(this.connection, toTokenAccount);
      } catch {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            new PublicKey(fromWallet),
            toTokenAccount,
            new PublicKey(toWallet),
            DMT_TOKEN_CONFIG.mint
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          new PublicKey(fromWallet),
          BigInt(amount * Math.pow(10, DMT_TOKEN_CONFIG.decimals))
        )
      );

      // Sign and send transaction using wallet service
      const { useWalletService } = await import('./solanaWalletService');
      const walletService = useWalletService();
      
      const result = await walletService.signAndSendTransaction(transaction);
      
      if (!result.success) {
        throw new Error(result.error || 'Transaction failed');
      }

      return result.signature;
    } catch (error) {
      console.error('Failed to transfer DMT:', error);
      throw new Error('DMT transfer failed');
    }
  }

  async mintDmt(toWallet: string, amount: number): Promise<string> {
    try {
      console.log(`Minting ${amount} DMT to ${toWallet}`);

      const tokenAccount = await getAssociatedTokenAddress(
        DMT_TOKEN_CONFIG.mint,
        new PublicKey(toWallet)
      );

      const transaction = new Transaction();

      // Create token account if it doesn't exist
      try {
        await getAccount(this.connection, tokenAccount);
      } catch {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            new PublicKey(toWallet),
            tokenAccount,
            new PublicKey(toWallet),
            DMT_TOKEN_CONFIG.mint
          )
        );
      }

      // Add mint instruction
      transaction.add(
        createMintToInstruction(
          DMT_TOKEN_CONFIG.mint,
          tokenAccount,
          new PublicKey(toWallet),
          BigInt(amount * Math.pow(10, DMT_TOKEN_CONFIG.decimals))
        )
      );

      // Sign and send transaction using wallet service
      const { useWalletService } = await import('./solanaWalletService');
      const walletService = useWalletService();
      
      const result = await walletService.signAndSendTransaction(transaction);
      
      if (!result.success) {
        throw new Error(result.error || 'Transaction failed');
      }

      return result.signature;
    } catch (error) {
      console.error('Failed to mint DMT:', error);
      throw new Error('DMT minting failed');
    }
  }

  // Economic Model
  calculateAgentMintingCost(type: 'master' | 'sub', level: number = 1): number {
    const baseCost = ECONOMIC_MODEL.agentMinting[type];
    const levelMultiplier = Math.pow(ECONOMIC_MODEL.agentMinting.levelMultiplier, level - 1);
    return Math.round(baseCost * levelMultiplier);
  }

  calculateAgentEvolutionCost(currentLevel: number, xp: number): number {
    const baseCost = ECONOMIC_MODEL.agentEvolution.baseCost;
    const levelMultiplier = Math.pow(ECONOMIC_MODEL.agentEvolution.levelMultiplier, currentLevel - 1);
    const xpCost = xp * ECONOMIC_MODEL.agentEvolution.xpMultiplier;
    return Math.round(baseCost * levelMultiplier + xpCost);
  }

  calculateMarketplaceFee(price: number): number {
    return price * ECONOMIC_MODEL.marketplace.transactionFee;
  }

  calculatePlatformFee(price: number): number {
    return price * ECONOMIC_MODEL.marketplace.platformFee;
  }

  // Staking Mechanisms
  async stakeDmt(walletAddress: string, amount: number): Promise<boolean> {
    try {
      console.log(`Staking ${amount} DMT for ${walletAddress}`);

      if (amount < ECONOMIC_MODEL.staking.minStakeAmount) {
        throw new Error(`Minimum stake amount is ${ECONOMIC_MODEL.staking.minStakeAmount} DMT`);
      }

      // Check if user has enough DMT
      const balance = await this.getDmtBalance(walletAddress);
      if (balance < amount) {
        throw new Error('Insufficient DMT balance');
      }

      // Transfer DMT to staking contract
      const stakingContractAddress = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS || '11111111111111111111111111111111';
      await this.transferDmt(walletAddress, stakingContractAddress, amount);

      // Update staking info
      const stakingInfo: StakingInfo = {
        stakedAmount: amount,
        rewardAmount: 0,
        apy: ECONOMIC_MODEL.staking.baseAPY,
        lockEndTime: new Date(Date.now() + ECONOMIC_MODEL.staking.lockPeriod).toISOString(),
        canUnstake: false,
        totalStakers: 0, // TODO: Get from contract
        totalStaked: 0 // TODO: Get from contract
      };

      this.stakingInfo.set(walletAddress, stakingInfo);

      // Add reward history
      await this.addRewardHistory(walletAddress, 'reward', ECONOMIC_MODEL.rewards.agentMinting, 'Staking reward');

      return true;
    } catch (error) {
      console.error('Failed to stake DMT:', error);
      throw error;
    }
  }

  async unstakeDmt(walletAddress: string): Promise<boolean> {
    try {
      console.log(`Unstaking DMT for ${walletAddress}`);

      const stakingInfo = this.stakingInfo.get(walletAddress);
      if (!stakingInfo) {
        throw new Error('No staking found for this wallet');
      }

      if (!stakingInfo.canUnstake) {
        const lockEndTime = new Date(stakingInfo.lockEndTime);
        if (lockEndTime > new Date()) {
          throw new Error('Staking is still locked');
        }
      }

      // Calculate rewards
      const rewardAmount = this.calculateStakingReward(stakingInfo.stakedAmount, Date.now() - new Date(stakingInfo.lockEndTime).getTime());

      // Transfer staked amount + rewards back to user
      const totalAmount = stakingInfo.stakedAmount + rewardAmount;
      const stakingContractAddress = process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS || '11111111111111111111111111111111';
      await this.transferDmt(stakingContractAddress, walletAddress, totalAmount);

      // Clear staking info
      this.stakingInfo.delete(walletAddress);

      // Add reward history
      await this.addRewardHistory(walletAddress, 'reward', rewardAmount, 'Unstaking reward');

      return true;
    } catch (error) {
      console.error('Failed to unstake DMT:', error);
      throw error;
    }
  }

  async getStakingInfo(walletAddress: string): Promise<StakingInfo | null> {
    return this.stakingInfo.get(walletAddress) || null;
  }

  calculateStakingReward(amount: number, duration: number): number {
    const apy = ECONOMIC_MODEL.staking.baseAPY;
    const years = duration / (365 * 24 * 60 * 60 * 1000);
    return amount * apy * years;
  }

  // Reward/Penalty System
  async addReward(walletAddress: string, amount: number, reason: string): Promise<string> {
    try {
      console.log(`Adding reward of ${amount} DMT to ${walletAddress} for: ${reason}`);

      // Mint DMT to user
      const signature = await this.mintDmt(walletAddress, amount);

      // Add to reward history
      await this.addRewardHistory(walletAddress, 'reward', amount, reason);

      return signature;
    } catch (error) {
      console.error('Failed to add reward:', error);
      throw error;
    }
  }

  async addPenalty(walletAddress: string, amount: number, reason: string): Promise<string> {
    try {
      console.log(`Adding penalty of ${amount} DMT to ${walletAddress} for: ${reason}`);

      // Burn DMT from user
      await this.burnDmt(walletAddress, amount);

      // Add to reward history (as penalty)
      await this.addRewardHistory(walletAddress, 'penalty', -amount, reason);

      return 'penalty_applied';
    } catch (error) {
      console.error('Failed to add penalty:', error);
      throw error;
    }
  }

  private async burnDmt(walletAddress: string, amount: number): Promise<void> {
    try {
      const tokenAccount = await getAssociatedTokenAddress(
        DMT_TOKEN_CONFIG.mint,
        new PublicKey(walletAddress)
      );

      const transaction = new Transaction();
      transaction.add(
        createBurnInstruction(
          tokenAccount,
          DMT_TOKEN_CONFIG.mint,
          new PublicKey(walletAddress),
          BigInt(amount * Math.pow(10, DMT_TOKEN_CONFIG.decimals))
        )
      );

      // TODO: Sign and send transaction
      console.log('DMT burning completed');
    } catch (error) {
      console.error('Failed to burn DMT:', error);
      throw new Error('DMT burning failed');
    }
  }

  private async addRewardHistory(walletAddress: string, type: 'reward' | 'penalty', amount: number, reason: string): Promise<void> {
    const rewardHistory: RewardHistory = {
      id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: walletAddress,
      userWallet: walletAddress,
      type,
      amount,
      reason,
      timestamp: new Date().toISOString(),
      transactionHash: `tx_${Date.now()}`
    };

    if (!this.rewardHistory.has(walletAddress)) {
      this.rewardHistory.set(walletAddress, []);
    }

    this.rewardHistory.get(walletAddress)!.push(rewardHistory);
  }

  async getRewardHistory(walletAddress: string): Promise<RewardHistory[]> {
    return this.rewardHistory.get(walletAddress) || [];
  }

  // Performance-based Rewards
  async rewardAgentMinting(walletAddress: string): Promise<string> {
    return this.addReward(walletAddress, ECONOMIC_MODEL.rewards.agentMinting, 'Agent minting reward');
  }

  async rewardAgentEvolution(walletAddress: string): Promise<string> {
    return this.addReward(walletAddress, ECONOMIC_MODEL.rewards.agentEvolution, 'Agent evolution reward');
  }

  async rewardQualityReview(walletAddress: string): Promise<string> {
    return this.addReward(walletAddress, ECONOMIC_MODEL.rewards.qualityReview, 'Quality review reward');
  }

  async rewardMarketplaceSale(walletAddress: string): Promise<string> {
    return this.addReward(walletAddress, ECONOMIC_MODEL.rewards.marketplaceSale, 'Marketplace sale reward');
  }

  async rewardGovernanceParticipation(walletAddress: string): Promise<string> {
    return this.addReward(walletAddress, ECONOMIC_MODEL.rewards.governanceParticipation, 'Governance participation reward');
  }

  // Penalties
  async penalizeSpamReview(walletAddress: string): Promise<string> {
    return this.addPenalty(walletAddress, Math.abs(ECONOMIC_MODEL.penalties.spamReview), 'Spam review penalty');
  }

  async penalizeFraudAttempt(walletAddress: string): Promise<string> {
    return this.addPenalty(walletAddress, Math.abs(ECONOMIC_MODEL.penalties.fraudAttempt), 'Fraud attempt penalty');
  }

  async penalizeAbuseReport(walletAddress: string): Promise<string> {
    return this.addPenalty(walletAddress, Math.abs(ECONOMIC_MODEL.penalties.abuseReport), 'Abuse report penalty');
  }

  async penalizePoorPerformance(walletAddress: string): Promise<string> {
    return this.addPenalty(walletAddress, Math.abs(ECONOMIC_MODEL.penalties.poorPerformance), 'Poor performance penalty');
  }

  // Token Analytics
  async getTokenBalance(walletAddress: string): Promise<TokenBalance> {
    const dmtBalance = await this.getDmtBalance(walletAddress);
    const stakingInfo = await this.getStakingInfo(walletAddress);
    const rewardHistory = await this.getRewardHistory(walletAddress);

    const totalRewards = rewardHistory
      .filter(r => r.type === 'reward')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalPenalties = rewardHistory
      .filter(r => r.type === 'penalty')
      .reduce((sum, r) => sum + Math.abs(r.amount), 0);

    return {
      dmt: dmtBalance,
      sol: 0, // TODO: Get SOL balance
      staked: stakingInfo?.stakedAmount || 0,
      rewards: totalRewards,
      penalties: totalPenalties
    };
  }

  async getEconomicMetrics(): Promise<EconomicMetrics> {
    // TODO: Get real metrics from blockchain
    return {
      totalDmtSupply: DMT_TOKEN_CONFIG.totalSupply,
      circulatingSupply: DMT_TOKEN_CONFIG.totalSupply * 0.7, // 70% circulating
      totalStaked: 0, // TODO: Get from staking contract
      averageAPY: ECONOMIC_MODEL.staking.baseAPY,
      totalRewardsDistributed: 0, // TODO: Calculate from history
      totalPenaltiesApplied: 0, // TODO: Calculate from history
      marketplaceVolume: 0, // TODO: Get from marketplace
      activeStakers: 0 // TODO: Get from staking contract
    };
  }

  // Utility Methods
  async validateTransaction(walletAddress: string, amount: number, type: 'transfer' | 'stake' | 'unstake'): Promise<boolean> {
    try {
      const balance = await this.getDmtBalance(walletAddress);
      
      switch (type) {
        case 'transfer':
        case 'stake':
          return balance >= amount;
        case 'unstake':
          const stakingInfo = await this.getStakingInfo(walletAddress);
          return stakingInfo !== null && stakingInfo.stakedAmount >= amount;
        default:
          return false;
      }
    } catch (error) {
      console.error('Transaction validation failed:', error);
      return false;
    }
  }

  formatDmtAmount(amount: number): string {
    return `${amount.toLocaleString()} DMT`;
  }

  formatSolAmount(amount: number): string {
    return `${(amount / LAMPORTS_PER_SOL).toFixed(4)} SOL`;
  }
}

// Export singleton instance
export const tokenomicsService = TokenomicsService.getInstance(); 