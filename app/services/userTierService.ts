// User Tier and Access Control Service
export interface UserTier {
  id: string;
  name: string;
  type: 'subscription' | 'token' | 'hybrid';
  level: number;
  requirements: {
    subscription?: 'freemium' | 'basic' | 'pro' | 'enterprise';
    minDmtStaked?: number;
    minDmtxHeld?: number;
    minXp?: number;
    minTasksCompleted?: number;
  };
  benefits: {
    agentAccess: string[];
    maxAgents: number;
    dailyCredits: number;
    prioritySupport: boolean;
    daoVotingRights: boolean;
    proposalRights: boolean;
  };
  color: string;
  badge: string;
}

export interface UserProfile {
  id: string;
  email: string;
  walletAddress?: string;
  subscriptionTier: 'freemium' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'expired' | 'cancelled';
  subscriptionExpiry?: Date;
  dmtBalance: number;
  dmtxBalance: number;
  dmtStaked: number;
  dmtxStaked: number;
  xp: number;
  tasksCompleted: number;
  currentTier: UserTier;
  badges: string[];
  joinDate: Date;
  lastActive: Date;
}

export class UserTierService {
  private userTiers: UserTier[] = [
    {
      id: 'freemium',
      name: 'Freemium',
      type: 'subscription',
      level: 1,
      requirements: {
        subscription: 'freemium'
      },
      benefits: {
        agentAccess: ['mini-llm'],
        maxAgents: 2,
        dailyCredits: 10,
        prioritySupport: false,
        daoVotingRights: false,
        proposalRights: false
      },
      color: '#6c757d',
      badge: '🆓'
    },
    {
      id: 'basic',
      name: 'Basic',
      type: 'subscription',
      level: 2,
      requirements: {
        subscription: 'basic'
      },
      benefits: {
        agentAccess: ['mini-llm', 'pro-llm'],
        maxAgents: 5,
        dailyCredits: 50,
        prioritySupport: false,
        daoVotingRights: false,
        proposalRights: false
      },
      color: '#4caf50',
      badge: '🥉'
    },
    {
      id: 'pro',
      name: 'Pro',
      type: 'subscription',
      level: 3,
      requirements: {
        subscription: 'pro'
      },
      benefits: {
        agentAccess: ['mini-llm', 'pro-llm', 'custom-llm'],
        maxAgents: 10,
        dailyCredits: 200,
        prioritySupport: true,
        daoVotingRights: true,
        proposalRights: false
      },
      color: '#2196f3',
      badge: '🥈'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      type: 'subscription',
      level: 4,
      requirements: {
        subscription: 'enterprise'
      },
      benefits: {
        agentAccess: ['mini-llm', 'pro-llm', 'custom-llm', 'private-decentralized'],
        maxAgents: -1, // unlimited
        dailyCredits: 1000,
        prioritySupport: true,
        daoVotingRights: true,
        proposalRights: true
      },
      color: '#ff9800',
      badge: '🥇'
    },
    {
      id: 'dmt-staker',
      name: 'DMT Staker',
      type: 'token',
      level: 3,
      requirements: {
        minDmtStaked: 500
      },
      benefits: {
        agentAccess: ['mini-llm', 'pro-llm', 'custom-llm'],
        maxAgents: 8,
        dailyCredits: 150,
        prioritySupport: true,
        daoVotingRights: true,
        proposalRights: false
      },
      color: '#9c27b0',
      badge: '💎'
    },
    {
      id: 'dmtx-holder',
      name: 'DMTX Holder',
      type: 'token',
      level: 4,
      requirements: {
        minDmtxHeld: 50
      },
      benefits: {
        agentAccess: ['mini-llm', 'pro-llm', 'custom-llm', 'private-decentralized'],
        maxAgents: 15,
        dailyCredits: 300,
        prioritySupport: true,
        daoVotingRights: true,
        proposalRights: true
      },
      color: '#e91e63',
      badge: '👑'
    },
    {
      id: 'dao-member',
      name: 'DAO Member',
      type: 'hybrid',
      level: 5,
      requirements: {
        minDmtStaked: 1000,
        minDmtxHeld: 10
      },
      benefits: {
        agentAccess: ['mini-llm', 'pro-llm', 'custom-llm', 'private-decentralized'],
        maxAgents: -1,
        dailyCredits: 500,
        prioritySupport: true,
        daoVotingRights: true,
        proposalRights: true
      },
      color: '#00ffff',
      badge: '🏛️'
    }
  ];

  // Determine user's effective tier based on all factors
  determineUserTier(profile: Partial<UserProfile>): UserTier {
    const tiers = this.userTiers.filter(tier => {
      const req = tier.requirements;
      
      // Check subscription requirements
      if (req.subscription && profile.subscriptionTier !== req.subscription) {
        return false;
      }
      
      // Check token requirements
      if (req.minDmtStaked && (profile.dmtStaked || 0) < req.minDmtStaked) {
        return false;
      }
      
      if (req.minDmtxHeld && (profile.dmtxBalance || 0) < req.minDmtxHeld) {
        return false;
      }
      
      if (req.minXp && (profile.xp || 0) < req.minXp) {
        return false;
      }
      
      if (req.minTasksCompleted && (profile.tasksCompleted || 0) < req.minTasksCompleted) {
        return false;
      }
      
      return true;
    });

    // Return the highest level tier the user qualifies for
    return tiers.sort((a, b) => b.level - a.level)[0] || this.userTiers[0];
  }

  // Check if user can access specific agent tier
  canAccessAgentTier(userTier: UserTier, agentTier: string): boolean {
    return userTier.benefits.agentAccess.includes(agentTier);
  }

  // Get all available tiers
  getAllTiers(): UserTier[] {
    return this.userTiers;
  }

  // Get tier by ID
  getTierById(id: string): UserTier | undefined {
    return this.userTiers.find(tier => tier.id === id);
  }

  // Calculate upgrade cost for next tier
  getUpgradeCost(currentTier: UserTier, targetTier: UserTier): {
    dmtRequired?: number;
    dmtxRequired?: number;
    subscriptionRequired?: string;
    xpRequired?: number;
  } {
    const costs: any = {};
    
    if (targetTier.requirements.minDmtStaked && 
        (currentTier.requirements.minDmtStaked || 0) < targetTier.requirements.minDmtStaked) {
      costs.dmtRequired = targetTier.requirements.minDmtStaked - (currentTier.requirements.minDmtStaked || 0);
    }
    
    if (targetTier.requirements.minDmtxHeld && 
        (currentTier.requirements.minDmtxHeld || 0) < targetTier.requirements.minDmtxHeld) {
      costs.dmtxRequired = targetTier.requirements.minDmtxHeld - (currentTier.requirements.minDmtxHeld || 0);
    }
    
    if (targetTier.requirements.subscription && 
        currentTier.requirements.subscription !== targetTier.requirements.subscription) {
      costs.subscriptionRequired = targetTier.requirements.subscription;
    }
    
    if (targetTier.requirements.minXp && 
        (currentTier.requirements.minXp || 0) < targetTier.requirements.minXp) {
      costs.xpRequired = targetTier.requirements.minXp - (currentTier.requirements.minXp || 0);
    }
    
    return costs;
  }

  // Get user's available agent tiers
  getAvailableAgentTiers(userTier: UserTier): string[] {
    return userTier.benefits.agentAccess;
  }

  // Check if user can create more agents
  canCreateAgent(userTier: UserTier, currentAgentCount: number): boolean {
    return userTier.benefits.maxAgents === -1 || currentAgentCount < userTier.benefits.maxAgents;
  }

  // Get daily credit allowance
  getDailyCredits(userTier: UserTier): number {
    return userTier.benefits.dailyCredits;
  }

  // Check DAO voting rights
  hasDaoVotingRights(userTier: UserTier): boolean {
    return userTier.benefits.daoVotingRights;
  }

  // Check proposal rights
  hasProposalRights(userTier: UserTier): boolean {
    return userTier.benefits.proposalRights;
  }
}

// Singleton instance
export const userTierService = new UserTierService();
