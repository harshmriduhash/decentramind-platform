// Token Integration Service for DMT/DMTX and Credit System
export interface TokenBalance {
  dmt: number;
  dmtx: number;
  dmtStaked: number;
  dmtxStaked: number;
  credits: number;
  lastUpdated: Date;
}

export interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'reward' | 'refund';
  amount: number;
  description: string;
  timestamp: Date;
  agentId?: string;
  taskId?: string;
}

export interface TokenTransaction {
  id: string;
  type: 'stake' | 'unstake' | 'transfer' | 'reward' | 'upgrade';
  token: 'dmt' | 'dmtx';
  amount: number;
  description: string;
  timestamp: Date;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export class TokenIntegrationService {
  private balances: Map<string, TokenBalance> = new Map();
  private creditTransactions: Map<string, CreditTransaction[]> = new Map();
  private tokenTransactions: Map<string, TokenTransaction[]> = new Map();

  // Credit conversion rates
  private readonly CREDIT_RATES = {
    DMT_TO_CREDITS: 0.5, // 2 DMT = 1 Credit
    DMTX_TO_CREDITS: 2,  // 1 DMTX = 2 Credits
    CREDITS_TO_DMT: 2,   // 1 Credit = 2 DMT
  };

  // Get user's token balance
  async getTokenBalance(userId: string): Promise<TokenBalance> {
    // In a real implementation, this would fetch from blockchain/wallet
    const cached = this.balances.get(userId);
    if (cached && Date.now() - cached.lastUpdated.getTime() < 30000) { // 30 second cache
      return cached;
    }

    // Mock balance - in production, integrate with Solana wallet
    const balance: TokenBalance = {
      dmt: Math.random() * 1000 + 100,
      dmtx: Math.random() * 50 + 10,
      dmtStaked: Math.random() * 500 + 50,
      dmtxStaked: Math.random() * 25 + 5,
      credits: Math.random() * 200 + 50,
      lastUpdated: new Date()
    };

    this.balances.set(userId, balance);
    return balance;
  }

  // Convert DMT to credits
  async convertDmtToCredits(userId: string, dmtAmount: number): Promise<{
    success: boolean;
    creditsReceived: number;
    dmtUsed: number;
    error?: string;
  }> {
    const balance = await this.getTokenBalance(userId);
    
    if (balance.dmt < dmtAmount) {
      return {
        success: false,
        creditsReceived: 0,
        dmtUsed: 0,
        error: 'Insufficient DMT balance'
      };
    }

    const creditsReceived = Math.floor(dmtAmount * this.CREDIT_RATES.DMT_TO_CREDITS);
    const dmtUsed = dmtAmount;

    // Update balance
    const newBalance = {
      ...balance,
      dmt: balance.dmt - dmtUsed,
      credits: balance.credits + creditsReceived,
      lastUpdated: new Date()
    };
    this.balances.set(userId, newBalance);

    // Record transaction
    this.recordCreditTransaction(userId, {
      id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'purchase',
      amount: creditsReceived,
      description: `Converted ${dmtUsed} DMT to ${creditsReceived} credits`,
      timestamp: new Date()
    });

    return {
      success: true,
      creditsReceived,
      dmtUsed
    };
  }

  // Convert DMTX to credits
  async convertDmtxToCredits(userId: string, dmtxAmount: number): Promise<{
    success: boolean;
    creditsReceived: number;
    dmtxUsed: number;
    error?: string;
  }> {
    const balance = await this.getTokenBalance(userId);
    
    if (balance.dmtx < dmtxAmount) {
      return {
        success: false,
        creditsReceived: 0,
        dmtxUsed: 0,
        error: 'Insufficient DMTX balance'
      };
    }

    const creditsReceived = Math.floor(dmtxAmount * this.CREDIT_RATES.DMTX_TO_CREDITS);
    const dmtxUsed = dmtxAmount;

    // Update balance
    const newBalance = {
      ...balance,
      dmtx: balance.dmtx - dmtxUsed,
      credits: balance.credits + creditsReceived,
      lastUpdated: new Date()
    };
    this.balances.set(userId, newBalance);

    // Record transaction
    this.recordCreditTransaction(userId, {
      id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'purchase',
      amount: creditsReceived,
      description: `Converted ${dmtxUsed} DMTX to ${creditsReceived} credits`,
      timestamp: new Date()
    });

    return {
      success: true,
      creditsReceived,
      dmtxUsed
    };
  }

  // Use credits for agent tasks
  async useCredits(userId: string, amount: number, description: string, agentId?: string, taskId?: string): Promise<{
    success: boolean;
    creditsUsed: number;
    remainingCredits: number;
    error?: string;
  }> {
    const balance = await this.getTokenBalance(userId);
    
    if (balance.credits < amount) {
      return {
        success: false,
        creditsUsed: 0,
        remainingCredits: balance.credits,
        error: 'Insufficient credits'
      };
    }

    const newBalance = {
      ...balance,
      credits: balance.credits - amount,
      lastUpdated: new Date()
    };
    this.balances.set(userId, newBalance);

    // Record transaction
    this.recordCreditTransaction(userId, {
      id: `credit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'usage',
      amount: -amount,
      description,
      timestamp: new Date(),
      agentId,
      taskId
    });

    return {
      success: true,
      creditsUsed: amount,
      remainingCredits: newBalance.credits
    };
  }

  // Stake DMT tokens
  async stakeDmt(userId: string, amount: number): Promise<{
    success: boolean;
    amountStaked: number;
    error?: string;
  }> {
    const balance = await this.getTokenBalance(userId);
    
    if (balance.dmt < amount) {
      return {
        success: false,
        amountStaked: 0,
        error: 'Insufficient DMT balance'
      };
    }

    const newBalance = {
      ...balance,
      dmt: balance.dmt - amount,
      dmtStaked: balance.dmtStaked + amount,
      lastUpdated: new Date()
    };
    this.balances.set(userId, newBalance);

    // Record transaction
    this.recordTokenTransaction(userId, {
      id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'stake',
      token: 'dmt',
      amount,
      description: `Staked ${amount} DMT`,
      timestamp: new Date(),
      status: 'confirmed'
    });

    return {
      success: true,
      amountStaked: amount
    };
  }

  // Unstake DMT tokens
  async unstakeDmt(userId: string, amount: number): Promise<{
    success: boolean;
    amountUnstaked: number;
    error?: string;
  }> {
    const balance = await this.getTokenBalance(userId);
    
    if (balance.dmtStaked < amount) {
      return {
        success: false,
        amountUnstaked: 0,
        error: 'Insufficient staked DMT'
      };
    }

    const newBalance = {
      ...balance,
      dmt: balance.dmt + amount,
      dmtStaked: balance.dmtStaked - amount,
      lastUpdated: new Date()
    };
    this.balances.set(userId, newBalance);

    // Record transaction
    this.recordTokenTransaction(userId, {
      id: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'unstake',
      token: 'dmt',
      amount,
      description: `Unstaked ${amount} DMT`,
      timestamp: new Date(),
      status: 'confirmed'
    });

    return {
      success: true,
      amountUnstaked: amount
    };
  }

  // Get credit transaction history
  getCreditTransactions(userId: string): CreditTransaction[] {
    return this.creditTransactions.get(userId) || [];
  }

  // Get token transaction history
  getTokenTransactions(userId: string): TokenTransaction[] {
    return this.tokenTransactions.get(userId) || [];
  }

  // Record credit transaction
  private recordCreditTransaction(userId: string, transaction: CreditTransaction): void {
    const transactions = this.creditTransactions.get(userId) || [];
    transactions.push(transaction);
    this.creditTransactions.set(userId, transactions);
  }

  // Record token transaction
  private recordTokenTransaction(userId: string, transaction: TokenTransaction): void {
    const transactions = this.tokenTransactions.get(userId) || [];
    transactions.push(transaction);
    this.tokenTransactions.set(userId, transactions);
  }

  // Calculate credit cost for agent upgrade
  calculateUpgradeCost(agentTier: string, currentLevel: number, targetLevel: number): {
    credits: number;
    dmt: number;
    dmtx: number;
  } {
    const baseCost = {
      'mini-llm': { credits: 10, dmt: 20, dmtx: 0 },
      'pro-llm': { credits: 50, dmt: 100, dmtx: 5 },
      'custom-llm': { credits: 200, dmt: 400, dmtx: 20 },
      'private-decentralized': { credits: 1000, dmt: 2000, dmtx: 100 }
    };

    const tierCost = baseCost[agentTier as keyof typeof baseCost] || baseCost['mini-llm'];
    const levelMultiplier = Math.pow(1.5, targetLevel - currentLevel);

    return {
      credits: Math.floor(tierCost.credits * levelMultiplier),
      dmt: Math.floor(tierCost.dmt * levelMultiplier),
      dmtx: Math.floor(tierCost.dmtx * levelMultiplier)
    };
  }

  // Check if user can afford upgrade
  async canAffordUpgrade(userId: string, agentTier: string, currentLevel: number, targetLevel: number): Promise<{
    canAfford: boolean;
    missingCredits?: number;
    missingDmt?: number;
    missingDmtx?: number;
  }> {
    const balance = await this.getTokenBalance(userId);
    const cost = this.calculateUpgradeCost(agentTier, currentLevel, targetLevel);

    const missingCredits = Math.max(0, cost.credits - balance.credits);
    const missingDmt = Math.max(0, cost.dmt - balance.dmt);
    const missingDmtx = Math.max(0, cost.dmtx - balance.dmtx);

    return {
      canAfford: missingCredits === 0 && missingDmt === 0 && missingDmtx === 0,
      missingCredits: missingCredits > 0 ? missingCredits : undefined,
      missingDmt: missingDmt > 0 ? missingDmt : undefined,
      missingDmtx: missingDmtx > 0 ? missingDmtx : undefined
    };
  }
}

// Singleton instance
export const tokenIntegrationService = new TokenIntegrationService();

