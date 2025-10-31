// Rewards Service for XP, DMT, and Badges
export interface Reward {
  id: string;
  type: 'xp' | 'dmt' | 'dmtx' | 'badge' | 'credit';
  amount: number;
  description: string;
  category: 'daily' | 'task' | 'referral' | 'achievement' | 'weekly' | 'special';
  timestamp: Date;
  agentId?: string;
  taskId?: string;
  metadata?: any;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    xp?: number;
    tasksCompleted?: number;
    dmtEarned?: number;
    referrals?: number;
    consecutiveDays?: number;
    special?: string;
  };
  rewards: {
    xp?: number;
    dmt?: number;
    dmtx?: number;
    credits?: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  progress: number;
  maxProgress: number;
  completed: boolean;
  completedAt?: Date;
  rewards: Reward[];
}

export interface UserRewards {
  userId: string;
  totalXp: number;
  totalDmtEarned: number;
  totalDmtxEarned: number;
  badges: string[];
  achievements: Achievement[];
  dailyStreak: number;
  lastDailyReward: Date;
  referralCode: string;
  referrals: number;
  weeklyRank: number;
  totalCreditsEarned: number;
  recentRewards: any[];
}

export class RewardsService {
  private userRewards: Map<string, UserRewards> = new Map();
  private badges: Map<string, Badge> = new Map();
  private achievements: Map<string, Achievement> = new Map();

  // Initialize badges
  constructor() {
    this.initializeBadges();
    this.initializeAchievements();
  }

  private initializeBadges(): void {
    const badgeList: Badge[] = [
      {
        id: 'first-task',
        name: 'First Steps',
        description: 'Complete your first task',
        icon: '🎯',
        rarity: 'common',
        requirements: { tasksCompleted: 1 },
        rewards: { xp: 50, dmt: 10 }
      },
      {
        id: 'task-master',
        name: 'Task Master',
        description: 'Complete 100 tasks',
        icon: '🏆',
        rarity: 'rare',
        requirements: { tasksCompleted: 100 },
        rewards: { xp: 500, dmt: 100, credits: 50 }
      },
      {
        id: 'xp-collector',
        name: 'XP Collector',
        description: 'Earn 10,000 XP',
        icon: '⭐',
        rarity: 'epic',
        requirements: { xp: 10000 },
        rewards: { xp: 1000, dmt: 200, dmtx: 5 }
      },
      {
        id: 'daily-warrior',
        name: 'Daily Warrior',
        description: 'Login for 30 consecutive days',
        icon: '🔥',
        rarity: 'epic',
        requirements: { consecutiveDays: 30 },
        rewards: { xp: 2000, dmt: 500, credits: 100 }
      },
      {
        id: 'referral-king',
        name: 'Referral King',
        description: 'Refer 10 users',
        icon: '👑',
        rarity: 'legendary',
        requirements: { referrals: 10 },
        rewards: { xp: 5000, dmt: 1000, dmtx: 25, credits: 200 }
      },
      {
        id: 'dmt-whale',
        name: 'DMT Whale',
        description: 'Earn 50,000 DMT',
        icon: '🐋',
        rarity: 'legendary',
        requirements: { dmtEarned: 50000 },
        rewards: { xp: 10000, dmt: 2000, dmtx: 50, credits: 500 }
      }
    ];

    badgeList.forEach(badge => {
      this.badges.set(badge.id, badge);
    });
  }

  private initializeAchievements(): void {
    const achievementList: Achievement[] = [
      {
        id: 'task-milestone-1',
        name: 'Task Novice',
        description: 'Complete 10 tasks',
        progress: 0,
        maxProgress: 10,
        completed: false,
        rewards: []
      },
      {
        id: 'task-milestone-2',
        name: 'Task Expert',
        description: 'Complete 50 tasks',
        progress: 0,
        maxProgress: 50,
        completed: false,
        rewards: []
      },
      {
        id: 'task-milestone-3',
        name: 'Task Master',
        description: 'Complete 100 tasks',
        progress: 0,
        maxProgress: 100,
        completed: false,
        rewards: []
      },
      {
        id: 'xp-milestone-1',
        name: 'XP Rookie',
        description: 'Earn 1,000 XP',
        progress: 0,
        maxProgress: 1000,
        completed: false,
        rewards: []
      },
      {
        id: 'xp-milestone-2',
        name: 'XP Veteran',
        description: 'Earn 5,000 XP',
        progress: 0,
        maxProgress: 5000,
        completed: false,
        rewards: []
      },
      {
        id: 'xp-milestone-3',
        name: 'XP Legend',
        description: 'Earn 25,000 XP',
        progress: 0,
        maxProgress: 25000,
        completed: false,
        rewards: []
      }
    ];

    achievementList.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  // Get or create user rewards profile
  private getUserRewardsInternal(userId: string): UserRewards {
    if (!this.userRewards.has(userId)) {
      this.userRewards.set(userId, {
        userId,
        totalXp: 0,
        totalDmtEarned: 0,
        totalDmtxEarned: 0,
        badges: [],
        achievements: Array.from(this.achievements.values()),
        dailyStreak: 0,
        lastDailyReward: new Date(0),
        referralCode: `REF${userId.slice(-6).toUpperCase()}`,
        referrals: 0,
        weeklyRank: 0,
        totalCreditsEarned: 0,
        recentRewards: []
      });
    }
    return this.userRewards.get(userId)!;
  }

  // Award daily login reward
  async awardDailyLogin(userId: string): Promise<{
    success: boolean;
    rewards: Reward[];
    newStreak: number;
    error?: string;
  }> {
    const userRewards = this.getUserRewardsInternal(userId);
    const now = new Date();
    const lastReward = userRewards.lastDailyReward;
    
    // Check if already claimed today
    if (lastReward.toDateString() === now.toDateString()) {
      return {
        success: false,
        rewards: [],
        newStreak: userRewards.dailyStreak,
        error: 'Daily reward already claimed today'
      };
    }

    // Check if streak should continue
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let newStreak = 1;
    if (lastReward.toDateString() === yesterday.toDateString()) {
      newStreak = userRewards.dailyStreak + 1;
    }

    // Calculate rewards based on streak
    const baseReward = 1; // 1 DMT base
    const streakBonus = Math.min(newStreak * 0.1, 5); // Max 5 DMT bonus
    const dmtReward = baseReward + streakBonus;

    const rewards: Reward[] = [
      {
        id: `daily_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'dmt',
        amount: dmtReward,
        description: `Daily login reward (${newStreak} day streak)`,
        category: 'daily',
        timestamp: now
      }
    ];

    // Update user rewards
    userRewards.totalDmtEarned += dmtReward;
    userRewards.dailyStreak = newStreak;
    userRewards.lastDailyReward = now;

    this.userRewards.set(userId, userRewards);

    // Check for streak achievements
    await this.checkAchievements(userId);

    return {
      success: true,
      rewards,
      newStreak
    };
  }

  // Award task completion reward
  async awardTaskCompletion(
    userId: string,
    agentId: string,
    taskId: string,
    baseXp: number,
    baseDmt: number
  ): Promise<{
    success: boolean;
    rewards: Reward[];
    totalXp: number;
    totalDmt: number;
    error?: string;
  }> {
    const userRewards = this.getUserRewardsInternal(userId);
    
    // Calculate bonuses
    const streakBonus = Math.min(userRewards.dailyStreak * 0.05, 0.5); // Max 50% bonus
    const xpReward = Math.floor(baseXp * (1 + streakBonus));
    const dmtReward = Math.floor(baseDmt * (1 + streakBonus));

    const rewards: Reward[] = [
      {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'xp',
        amount: xpReward,
        description: `Task completion reward`,
        category: 'task',
        timestamp: new Date(),
        agentId,
        taskId
      },
      {
        id: `task_dmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'dmt',
        amount: dmtReward,
        description: `Task completion reward`,
        category: 'task',
        timestamp: new Date(),
        agentId,
        taskId
      }
    ];

    // Update user rewards
    userRewards.totalXp += xpReward;
    userRewards.totalDmtEarned += dmtReward;

    this.userRewards.set(userId, userRewards);

    // Check for achievements and badges
    await this.checkAchievements(userId);
    await this.checkBadges(userId);

    return {
      success: true,
      rewards,
      totalXp: userRewards.totalXp,
      totalDmt: userRewards.totalDmtEarned
    };
  }

  // Award referral reward
  async awardReferral(userId: string, referredUserId: string): Promise<{
    success: boolean;
    rewards: Reward[];
    error?: string;
  }> {
    const userRewards = this.getUserRewardsInternal(userId);
    
    const rewards: Reward[] = [
      {
        id: `referral_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'dmt',
        amount: 50,
        description: `Referral reward for ${referredUserId}`,
        category: 'referral',
        timestamp: new Date()
      }
    ];

    // Update user rewards
    userRewards.totalDmtEarned += 50;
    userRewards.referrals += 1;

    this.userRewards.set(userId, userRewards);

    // Check for referral achievements
    await this.checkAchievements(userId);
    await this.checkBadges(userId);

    return {
      success: true,
      rewards
    };
  }

  // Check and award achievements
  private async checkAchievements(userId: string): Promise<void> {
    const userRewards = this.getUserRewardsInternal(userId);
    
    for (const achievement of userRewards.achievements) {
      if (achievement.completed) continue;

      let progress = 0;
      switch (achievement.id) {
        case 'task-milestone-1':
        case 'task-milestone-2':
        case 'task-milestone-3':
          progress = userRewards.totalXp; // Using XP as proxy for tasks
          break;
        case 'xp-milestone-1':
        case 'xp-milestone-2':
        case 'xp-milestone-3':
          progress = userRewards.totalXp;
          break;
      }

      achievement.progress = Math.min(progress, achievement.maxProgress);
      
      if (achievement.progress >= achievement.maxProgress && !achievement.completed) {
        achievement.completed = true;
        achievement.completedAt = new Date();
        
        // Award completion rewards
        const completionReward: Reward = {
          id: `achievement_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'xp',
          amount: 100,
          description: `Achievement completed: ${achievement.name}`,
          category: 'achievement',
          timestamp: new Date()
        };
        
        userRewards.totalXp += 100;
      }
    }

    this.userRewards.set(userId, userRewards);
  }

  // Check and award badges
  private async checkBadges(userId: string): Promise<void> {
    const userRewards = this.getUserRewardsInternal(userId);
    
    for (const [badgeId, badge] of this.badges) {
      if (userRewards.badges.includes(badgeId)) continue;

      let shouldAward = true;
      const req = badge.requirements;

      if (req.tasksCompleted && userRewards.totalXp < req.tasksCompleted) shouldAward = false;
      if (req.xp && userRewards.totalXp < req.xp) shouldAward = false;
      if (req.dmtEarned && userRewards.totalDmtEarned < req.dmtEarned) shouldAward = false;
      if (req.referrals && userRewards.referrals < req.referrals) shouldAward = false;
      if (req.consecutiveDays && userRewards.dailyStreak < req.consecutiveDays) shouldAward = false;

      if (shouldAward) {
        userRewards.badges.push(badgeId);
        
        // Award badge rewards
        if (badge.rewards.xp) {
          userRewards.totalXp += badge.rewards.xp;
        }
        if (badge.rewards.dmt) {
          userRewards.totalDmtEarned += badge.rewards.dmt;
        }
        if (badge.rewards.dmtx) {
          userRewards.totalDmtxEarned += badge.rewards.dmtx;
        }
        if (badge.rewards.credits) {
          userRewards.totalCreditsEarned += badge.rewards.credits;
        }
      }
    }

    this.userRewards.set(userId, userRewards);
  }

  // Get user rewards profile
  getUserRewards(userId: string): UserRewards {
    if (!this.userRewards.has(userId)) {
      this.userRewards.set(userId, {
        userId,
        totalXp: 0,
        totalDmtEarned: 0,
        totalDmtxEarned: 0,
        dailyStreak: 0,
        lastDailyReward: new Date(0),
        badges: [],
        achievements: [],
        recentRewards: [],
        referralCode: `REF${userId.slice(-6).toUpperCase()}`,
        referrals: 0,
        weeklyRank: 0,
        totalCreditsEarned: 0
      });
    }
    return this.userRewards.get(userId)!;
  }

  // Get all badges
  getAllBadges(): Badge[] {
    return Array.from(this.badges.values());
  }

  // Get user's badges
  getUserBadges(userId: string): Badge[] {
    const userRewards = this.getUserRewardsInternal(userId);
    return userRewards.badges.map(badgeId => this.badges.get(badgeId)!).filter(Boolean);
  }

  // Get weekly leaderboard
  getWeeklyLeaderboard(limit: number = 10): Array<{
    userId: string;
    totalXp: number;
    tasksCompleted: number;
    rank: number;
  }> {
    const allUsers = Array.from(this.userRewards.values());
    
    return allUsers
      .sort((a, b) => b.totalXp - a.totalXp)
      .slice(0, limit)
      .map((user, index) => ({
        userId: user.userId,
        totalXp: user.totalXp,
        tasksCompleted: Math.floor(user.totalXp / 10), // Estimate from XP
        rank: index + 1
      }));
  }

  // Get user's rank
  getUserRank(userId: string): number {
    const allUsers = Array.from(this.userRewards.values());
    const sortedUsers = allUsers.sort((a, b) => b.totalXp - a.totalXp);
    const userIndex = sortedUsers.findIndex(user => user.userId === userId);
    return userIndex + 1;
  }
}

// Singleton instance
export const rewardsService = new RewardsService();

