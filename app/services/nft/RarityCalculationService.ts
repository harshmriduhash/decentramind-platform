// Rarity Calculation Service for DecentraMind
// Handles rarity calculations and preservation for agent NFTs

import { Agent } from '../agentService';
import { EvolutionStage, RarityLevel } from '../agent/AvatarEvolutionService';

export interface RarityCalculationResult {
  rarity: RarityLevel;
  score: number;
  factors: RarityFactor[];
  preservation: RarityPreservation;
}

export interface RarityFactor {
  name: string;
  value: number;
  weight: number;
  contribution: number;
  description: string;
}

export interface RarityPreservation {
  canPreserve: boolean;
  preservationCost: number;
  preservationMethod: 'burn' | 'stake' | 'evolution';
  requirements: string[];
}

export interface RarityDistribution {
  common: number;
  rare: number;
  epic: number;
  legendary: number;
  total: number;
}

export interface RarityThresholds {
  common: { min: number; max: number };
  rare: { min: number; max: number };
  epic: { min: number; max: number };
  legendary: { min: number; max: number };
}

class RarityCalculationService {
  private static instance: RarityCalculationService;
  
  // Rarity thresholds based on total score
  private readonly rarityThresholds: RarityThresholds = {
    common: { min: 0, max: 50 },
    rare: { min: 51, max: 75 },
    epic: { min: 76, max: 90 },
    legendary: { min: 91, max: 100 }
  };

  // Rarity definitions
  private readonly rarityDefinitions: Record<string, RarityLevel> = {
    common: {
      name: 'common',
      multiplier: 1.0,
      color: '#9CA3AF',
      description: 'Basic agent capabilities with standard performance'
    },
    rare: {
      name: 'rare',
      multiplier: 1.5,
      color: '#3B82F6',
      description: 'Enhanced capabilities with improved performance'
    },
    epic: {
      name: 'epic',
      multiplier: 2.0,
      color: '#8B5CF6',
      description: 'Advanced capabilities with superior performance'
    },
    legendary: {
      name: 'legendary',
      multiplier: 3.0,
      color: '#FFD700',
      description: 'Legendary capabilities with exceptional performance'
    }
  };

  // Rarity factors and their weights
  private readonly rarityFactors = {
    level: { weight: 0.25, description: 'Agent level progression' },
    xp: { weight: 0.20, description: 'Total experience points' },
    successRate: { weight: 0.15, description: 'Task success rate' },
    tasksCompleted: { weight: 0.10, description: 'Total tasks completed' },
    evolutionEvents: { weight: 0.10, description: 'Number of evolution events' },
    dmtSpent: { weight: 0.08, description: 'Total DMT spent on upgrades' },
    domainExpertise: { weight: 0.07, description: 'Domain expertise level' },
    uniqueConversations: { weight: 0.05, description: 'Unique conversations count' }
  };

  static getInstance(): RarityCalculationService {
    if (!RarityCalculationService.instance) {
      RarityCalculationService.instance = new RarityCalculationService();
    }
    return RarityCalculationService.instance;
  }

  /**
   * Calculate comprehensive rarity for an agent
   */
  calculateRarity(agent: Agent, evolutionStage: EvolutionStage): RarityCalculationResult {
    try {
      console.log(`Calculating rarity for agent ${agent.name}`);
      
      const factors = this.calculateRarityFactors(agent, evolutionStage);
      const score = this.calculateRarityScore(factors);
      const rarity = this.determineRarity(score);
      const preservation = this.calculateRarityPreservation(agent, rarity);
      
      console.log(`Rarity calculated: ${rarity.name} (Score: ${score})`);
      
      return {
        rarity,
        score,
        factors,
        preservation
      };
    } catch (error) {
      console.error('Failed to calculate rarity:', error);
      return {
        rarity: this.rarityDefinitions.common,
        score: 0,
        factors: [],
        preservation: {
          canPreserve: false,
          preservationCost: 0,
          preservationMethod: 'evolution',
          requirements: []
        }
      };
    }
  }

  /**
   * Calculate individual rarity factors
   */
  private calculateRarityFactors(agent: Agent, evolutionStage: EvolutionStage): RarityFactor[] {
    const factors: RarityFactor[] = [];

    // Level factor (0-100)
    const levelScore = Math.min(100, (agent.level / 20) * 100);
    factors.push({
      name: 'Level',
      value: levelScore,
      weight: this.rarityFactors.level.weight,
      contribution: levelScore * this.rarityFactors.level.weight,
      description: this.rarityFactors.level.description
    });

    // XP factor (0-100)
    const xpScore = Math.min(100, (agent.xp / 50000) * 100);
    factors.push({
      name: 'XP',
      value: xpScore,
      weight: this.rarityFactors.xp.weight,
      contribution: xpScore * this.rarityFactors.xp.weight,
      description: this.rarityFactors.xp.description
    });

    // Success rate factor (0-100)
    const successRateScore = agent.performance.successRate;
    factors.push({
      name: 'Success Rate',
      value: successRateScore,
      weight: this.rarityFactors.successRate.weight,
      contribution: successRateScore * this.rarityFactors.successRate.weight,
      description: this.rarityFactors.successRate.description
    });

    // Tasks completed factor (0-100)
    const tasksScore = Math.min(100, (agent.performance.tasksCompleted / 1000) * 100);
    factors.push({
      name: 'Tasks Completed',
      value: tasksScore,
      weight: this.rarityFactors.tasksCompleted.weight,
      contribution: tasksScore * this.rarityFactors.tasksCompleted.weight,
      description: this.rarityFactors.tasksCompleted.description
    });

    // Evolution events factor (0-100)
    const evolutionScore = Math.min(100, (agent.evolutionHistory?.length || 0) * 10);
    factors.push({
      name: 'Evolution Events',
      value: evolutionScore,
      weight: this.rarityFactors.evolutionEvents.weight,
      contribution: evolutionScore * this.rarityFactors.evolutionEvents.weight,
      description: this.rarityFactors.evolutionEvents.description
    });

    // DMT spent factor (0-100)
    const dmtScore = Math.min(100, (agent.individualStats?.totalDmtSpent || 0) / 1000 * 100);
    factors.push({
      name: 'DMT Spent',
      value: dmtScore,
      weight: this.rarityFactors.dmtSpent.weight,
      contribution: dmtScore * this.rarityFactors.dmtSpent.weight,
      description: this.rarityFactors.dmtSpent.description
    });

    // Domain expertise factor (0-100)
    const expertiseScore = agent.individualStats?.domainExpertise || 0;
    factors.push({
      name: 'Domain Expertise',
      value: expertiseScore,
      weight: this.rarityFactors.domainExpertise.weight,
      contribution: expertiseScore * this.rarityFactors.domainExpertise.weight,
      description: this.rarityFactors.domainExpertise.description
    });

    // Unique conversations factor (0-100)
    const conversationsScore = Math.min(100, (agent.individualStats?.uniqueConversations || 0) / 100 * 100);
    factors.push({
      name: 'Unique Conversations',
      value: conversationsScore,
      weight: this.rarityFactors.uniqueConversations.weight,
      contribution: conversationsScore * this.rarityFactors.uniqueConversations.weight,
      description: this.rarityFactors.uniqueConversations.description
    });

    return factors;
  }

  /**
   * Calculate total rarity score from factors
   */
  private calculateRarityScore(factors: RarityFactor[]): number {
    const totalContribution = factors.reduce((sum, factor) => sum + factor.contribution, 0);
    return Math.min(100, Math.max(0, totalContribution));
  }

  /**
   * Determine rarity level based on score
   */
  private determineRarity(score: number): RarityLevel {
    if (score >= this.rarityThresholds.legendary.min) {
      return this.rarityDefinitions.legendary;
    } else if (score >= this.rarityThresholds.epic.min) {
      return this.rarityDefinitions.epic;
    } else if (score >= this.rarityThresholds.rare.min) {
      return this.rarityDefinitions.rare;
    } else {
      return this.rarityDefinitions.common;
    }
  }

  /**
   * Calculate rarity preservation options
   */
  private calculateRarityPreservation(agent: Agent, rarity: RarityLevel): RarityPreservation {
    const canPreserve = rarity.name !== 'common';
    const preservationCost = this.calculatePreservationCost(rarity);
    const preservationMethod = this.determinePreservationMethod(rarity);
    const requirements = this.getPreservationRequirements(agent, rarity);

    return {
      canPreserve,
      preservationCost,
      preservationMethod,
      requirements
    };
  }

  /**
   * Calculate cost to preserve rarity
   */
  private calculatePreservationCost(rarity: RarityLevel): number {
    const baseCost = 100; // Base DMT cost
    return Math.floor(baseCost * rarity.multiplier);
  }

  /**
   * Determine preservation method based on rarity
   */
  private determinePreservationMethod(rarity: RarityLevel): 'burn' | 'stake' | 'evolution' {
    switch (rarity.name) {
      case 'rare':
        return 'evolution';
      case 'epic':
        return 'stake';
      case 'legendary':
        return 'burn';
      default:
        return 'evolution';
    }
  }

  /**
   * Get requirements for rarity preservation
   */
  private getPreservationRequirements(agent: Agent, rarity: RarityLevel): string[] {
    const requirements: string[] = [];

    switch (rarity.name) {
      case 'rare':
        requirements.push('Minimum 1000 DMT balance');
        requirements.push('Agent level 5+');
        break;
      case 'epic':
        requirements.push('Minimum 2500 DMT balance');
        requirements.push('Agent level 10+');
        requirements.push('95%+ success rate');
        break;
      case 'legendary':
        requirements.push('Minimum 5000 DMT balance');
        requirements.push('Agent level 15+');
        requirements.push('98%+ success rate');
        requirements.push('100+ tasks completed');
        break;
    }

    return requirements;
  }

  /**
   * Check if agent meets rarity preservation requirements
   */
  checkPreservationRequirements(agent: Agent, rarity: RarityLevel): {
    meetsRequirements: boolean;
    missingRequirements: string[];
  } {
    const requirements = this.getPreservationRequirements(agent, rarity);
    const missingRequirements: string[] = [];

    // Check DMT balance (would need to fetch from blockchain)
    const requiredDMT = this.calculatePreservationCost(rarity);
    // TODO: Implement actual DMT balance check
    // if (agent.dmtBalance < requiredDMT) {
    //   missingRequirements.push(`Insufficient DMT balance (need ${requiredDMT})`);
    // }

    // Check level requirement
    const requiredLevel = rarity.name === 'rare' ? 5 : rarity.name === 'epic' ? 10 : 15;
    if (agent.level < requiredLevel) {
      missingRequirements.push(`Agent level too low (need ${requiredLevel})`);
    }

    // Check success rate requirement
    const requiredSuccessRate = rarity.name === 'rare' ? 0 : rarity.name === 'epic' ? 95 : 98;
    if (agent.performance.successRate < requiredSuccessRate) {
      missingRequirements.push(`Success rate too low (need ${requiredSuccessRate}%)`);
    }

    // Check tasks completed requirement
    if (rarity.name === 'legendary' && agent.performance.tasksCompleted < 100) {
      missingRequirements.push('Need 100+ tasks completed');
    }

    return {
      meetsRequirements: missingRequirements.length === 0,
      missingRequirements
    };
  }

  /**
   * Calculate rarity distribution across all agents
   */
  async calculateRarityDistribution(): Promise<RarityDistribution> {
    try {
      // This would fetch all agents and calculate distribution
      // For now, return placeholder data
      console.log('Calculating rarity distribution across all agents');
      
      return {
        common: 60,
        rare: 25,
        epic: 12,
        legendary: 3,
        total: 100
      };
    } catch (error) {
      console.error('Failed to calculate rarity distribution:', error);
      return {
        common: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
        total: 0
      };
    }
  }

  /**
   * Get rarity thresholds
   */
  getRarityThresholds(): RarityThresholds {
    return { ...this.rarityThresholds };
  }

  /**
   * Get rarity definitions
   */
  getRarityDefinitions(): Record<string, RarityLevel> {
    return { ...this.rarityDefinitions };
  }

  /**
   * Calculate rarity boost from evolution
   */
  calculateEvolutionRarityBoost(
    currentRarity: RarityLevel,
    evolutionStage: EvolutionStage
  ): {
    newRarity: RarityLevel;
    boostAmount: number;
    boostFactors: string[];
  } {
    const boostFactors: string[] = [];
    let boostAmount = 0;

    // Level-based boost
    if (evolutionStage.minLevel >= 15) {
      boostAmount += 10;
      boostFactors.push('High level evolution');
    }

    // Visual effects boost
    if (evolutionStage.visualEffects.some(e => e.type === 'legendary')) {
      boostAmount += 15;
      boostFactors.push('Legendary visual effects');
    }

    // Calculate new rarity
    const currentScore = this.getRarityScore(currentRarity);
    const newScore = Math.min(100, currentScore + boostAmount);
    const newRarity = this.determineRarity(newScore);

    return {
      newRarity,
      boostAmount,
      boostFactors
    };
  }

  /**
   * Get rarity score for a given rarity level
   */
  private getRarityScore(rarity: RarityLevel): number {
    switch (rarity.name) {
      case 'common':
        return 25;
      case 'rare':
        return 50;
      case 'epic':
        return 75;
      case 'legendary':
        return 95;
      default:
        return 0;
    }
  }

  /**
   * Validate rarity calculation
   */
  validateRarityCalculation(result: RarityCalculationResult): boolean {
    try {
      // Check if score is within valid range
      if (result.score < 0 || result.score > 100) {
        return false;
      }

      // Check if factors sum to correct contribution
      const totalContribution = result.factors.reduce((sum, factor) => sum + factor.contribution, 0);
      if (Math.abs(totalContribution - result.score) > 0.01) {
        return false;
      }

      // Check if rarity matches score
      const expectedRarity = this.determineRarity(result.score);
      if (expectedRarity.name !== result.rarity.name) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Rarity calculation validation failed:', error);
      return false;
    }
  }

  /**
   * Get rarity comparison between two agents
   */
  compareRarity(agent1: Agent, agent2: Agent): {
    winner: 'agent1' | 'agent2' | 'tie';
    difference: number;
    comparison: {
      agent1: RarityCalculationResult;
      agent2: RarityCalculationResult;
    };
  } {
    const result1 = this.calculateRarity(agent1, { name: 'Unknown', minLevel: 0, visualEffects: [], rarity: this.rarityDefinitions.common, description: '' });
    const result2 = this.calculateRarity(agent2, { name: 'Unknown', minLevel: 0, visualEffects: [], rarity: this.rarityDefinitions.common, description: '' });

    const difference = Math.abs(result1.score - result2.score);
    
    let winner: 'agent1' | 'agent2' | 'tie' = 'tie';
    if (result1.score > result2.score) {
      winner = 'agent1';
    } else if (result2.score > result1.score) {
      winner = 'agent2';
    }

    return {
      winner,
      difference,
      comparison: {
        agent1: result1,
        agent2: result2
      }
    };
  }
}

export default RarityCalculationService.getInstance();
