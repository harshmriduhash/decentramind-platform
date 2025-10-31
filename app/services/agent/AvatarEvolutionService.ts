// Avatar Evolution Service for DecentraMind
// Handles dynamic avatar generation based on agent evolution

import { Agent } from '../agentService';

export interface EvolutionStage {
  name: string;
  minLevel: number;
  visualEffects: VisualEffect[];
  rarity: RarityLevel;
  description: string;
}

export interface VisualEffect {
  type: 'glow' | 'particles' | 'aura' | 'legendary';
  intensity: number; // 0-100
  color?: string;
  animation?: string;
}

export interface RarityLevel {
  name: 'common' | 'rare' | 'epic' | 'legendary';
  multiplier: number;
  color: string;
  description: string;
}

export interface AvatarEvolutionResult {
  success: boolean;
  newAvatarPath: string;
  evolutionStage: EvolutionStage;
  visualEffects: VisualEffect[];
  rarity: RarityLevel;
  error?: string;
}

export interface EvolutionTier {
  level: number;
  xpRequired: number;
  visualUpgrades: string[];
  rarityUpgrade?: boolean;
}

class AvatarEvolutionService {
  private static instance: AvatarEvolutionService;
  
  // Evolution stages configuration
  private readonly evolutionStages: EvolutionStage[] = [
    {
      name: 'Novice',
      minLevel: 1,
      visualEffects: [],
      rarity: { name: 'common', multiplier: 1.0, color: '#9CA3AF', description: 'Basic agent capabilities' },
      description: 'A newly minted agent with basic capabilities'
    },
    {
      name: 'Apprentice',
      minLevel: 3,
      visualEffects: [],
      rarity: { name: 'common', multiplier: 1.0, color: '#9CA3AF', description: 'Basic agent capabilities' },
      description: 'An agent gaining experience and skills'
    },
    {
      name: 'Advanced',
      minLevel: 5,
      visualEffects: [
        { type: 'glow', intensity: 30, color: '#00FFFF', animation: 'pulse' }
      ],
      rarity: { name: 'rare', multiplier: 1.5, color: '#3B82F6', description: 'Enhanced capabilities with visual glow' },
      description: 'An advanced agent with glowing aura'
    },
    {
      name: 'Expert',
      minLevel: 10,
      visualEffects: [
        { type: 'glow', intensity: 50, color: '#00FFFF', animation: 'pulse' },
        { type: 'particles', intensity: 40, color: '#8B5CF6', animation: 'float' }
      ],
      rarity: { name: 'rare', multiplier: 1.5, color: '#3B82F6', description: 'Enhanced capabilities with visual effects' },
      description: 'An expert agent with glowing aura and floating particles'
    },
    {
      name: 'Master',
      minLevel: 15,
      visualEffects: [
        { type: 'glow', intensity: 70, color: '#00FFFF', animation: 'pulse' },
        { type: 'particles', intensity: 60, color: '#8B5CF6', animation: 'float' },
        { type: 'aura', intensity: 50, color: '#F59E0B', animation: 'rotate' }
      ],
      rarity: { name: 'epic', multiplier: 2.0, color: '#8B5CF6', description: 'Master-level capabilities with powerful aura' },
      description: 'A master agent with powerful visual effects'
    },
    {
      name: 'Legendary',
      minLevel: 20,
      visualEffects: [
        { type: 'glow', intensity: 100, color: '#FFD700', animation: 'pulse' },
        { type: 'particles', intensity: 80, color: '#FF6B6B', animation: 'float' },
        { type: 'aura', intensity: 70, color: '#FFD700', animation: 'rotate' },
        { type: 'legendary', intensity: 100, color: '#FFD700', animation: 'legendary' }
      ],
      rarity: { name: 'legendary', multiplier: 3.0, color: '#FFD700', description: 'Legendary capabilities with divine aura' },
      description: 'A legendary agent with divine visual effects'
    }
  ];

  // Evolution tiers for XP progression
  private readonly evolutionTiers: EvolutionTier[] = [
    { level: 1, xpRequired: 0, visualUpgrades: [] },
    { level: 3, xpRequired: 1200, visualUpgrades: [] },
    { level: 5, xpRequired: 3000, visualUpgrades: ['glow'] },
    { level: 10, xpRequired: 6000, visualUpgrades: ['glow', 'particles'] },
    { level: 15, xpRequired: 10000, visualUpgrades: ['glow', 'particles', 'aura'] },
    { level: 20, xpRequired: 15000, visualUpgrades: ['glow', 'particles', 'aura', 'legendary'] }
  ];

  static getInstance(): AvatarEvolutionService {
    if (!AvatarEvolutionService.instance) {
      AvatarEvolutionService.instance = new AvatarEvolutionService();
    }
    return AvatarEvolutionService.instance;
  }

  /**
   * Generate evolved avatar based on agent level and XP
   */
  async generateEvolvedAvatar(agent: Agent): Promise<AvatarEvolutionResult> {
    try {
      console.log(`Generating evolved avatar for agent ${agent.name} (Level ${agent.level})`);
      
      // Determine evolution stage based on level
      const evolutionStage = this.getEvolutionStage(agent.level);
      
      // Calculate rarity based on XP and tier
      const rarity = this.calculateRarity(agent);
      
      // Generate visual effects
      const visualEffects = this.generateVisualEffects(agent, evolutionStage);
      
      // Create evolved avatar path
      const newAvatarPath = await this.createEvolvedAvatar(agent, evolutionStage, visualEffects);
      
      console.log(`Generated evolved avatar: ${newAvatarPath}`);
      
      return {
        success: true,
        newAvatarPath,
        evolutionStage,
        visualEffects,
        rarity
      };
    } catch (error) {
      console.error('Failed to generate evolved avatar:', error);
      return {
        success: false,
        newAvatarPath: agent.avatar || '/avatars/default-agent.png',
        evolutionStage: this.evolutionStages[0],
        visualEffects: [],
        rarity: this.evolutionStages[0].rarity,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get evolution stage based on agent level
   */
  getEvolutionStage(level: number): EvolutionStage {
    // Find the highest stage the agent qualifies for
    const qualifyingStages = this.evolutionStages.filter(stage => level >= stage.minLevel);
    return qualifyingStages[qualifyingStages.length - 1] || this.evolutionStages[0];
  }

  /**
   * Calculate rarity based on agent XP and performance
   */
  calculateRarity(agent: Agent): RarityLevel {
    const baseRarity = this.getEvolutionStage(agent.level).rarity;
    
    // Apply performance multipliers
    let multiplier = baseRarity.multiplier;
    
    // High success rate bonus
    if (agent.performance.successRate >= 95) {
      multiplier *= 1.2;
    }
    
    // High task completion bonus
    if (agent.performance.tasksCompleted >= 100) {
      multiplier *= 1.1;
    }
    
    // High XP bonus
    if (agent.xp >= 20000) {
      multiplier *= 1.3;
    }
    
    // Determine final rarity based on multiplier
    if (multiplier >= 3.0) {
      return { name: 'legendary', multiplier, color: '#FFD700', description: 'Legendary capabilities' };
    } else if (multiplier >= 2.0) {
      return { name: 'epic', multiplier, color: '#8B5CF6', description: 'Epic capabilities' };
    } else if (multiplier >= 1.5) {
      return { name: 'rare', multiplier, color: '#3B82F6', description: 'Rare capabilities' };
    } else {
      return { name: 'common', multiplier, color: '#9CA3AF', description: 'Common capabilities' };
    }
  }

  /**
   * Generate visual effects based on agent level and stage
   */
  generateVisualEffects(agent: Agent, stage: EvolutionStage): VisualEffect[] {
    const effects: VisualEffect[] = [];
    
    // Add base stage effects
    effects.push(...stage.visualEffects);
    
    // Add performance-based effects
    if (agent.performance.successRate >= 98) {
      effects.push({
        type: 'glow',
        intensity: Math.min(100, effects.find(e => e.type === 'glow')?.intensity || 0 + 20),
        color: '#00FF00',
        animation: 'success-pulse'
      });
    }
    
    // Add XP-based effects
    if (agent.xp >= 50000) {
      effects.push({
        type: 'particles',
        intensity: 90,
        color: '#FF6B6B',
        animation: 'xp-burst'
      });
    }
    
    return effects;
  }

  /**
   * Create evolved avatar with visual effects
   */
  private async createEvolvedAvatar(
    agent: Agent, 
    stage: EvolutionStage, 
    effects: VisualEffect[]
  ): Promise<string> {
    try {
      // Generate unique filename based on agent ID and level
      const timestamp = Date.now();
      const agentId = agent.id || 'unknown';
      const filename = `agent_${agentId}_level_${agent.level}_${timestamp}.png`;
      const avatarPath = `/avatars/generated/${filename}`;
      
      // For now, return a placeholder path
      // In production, this would generate the actual avatar with effects
      console.log(`Creating evolved avatar: ${avatarPath}`);
      console.log(`Evolution stage: ${stage.name}`);
      console.log(`Visual effects:`, effects);
      
      // TODO: Implement actual avatar generation with visual effects
      // This would involve:
      // 1. Loading base avatar
      // 2. Applying visual effects (glow, particles, aura)
      // 3. Saving to /public/avatars/generated/
      
      return avatarPath;
    } catch (error) {
      console.error('Failed to create evolved avatar:', error);
      throw error;
    }
  }

  /**
   * Get evolution tier information for a given level
   */
  getEvolutionTier(level: number): EvolutionTier | null {
    return this.evolutionTiers.find(tier => tier.level === level) || null;
  }

  /**
   * Get next evolution tier
   */
  getNextEvolutionTier(currentLevel: number): EvolutionTier | null {
    return this.evolutionTiers.find(tier => tier.level > currentLevel) || null;
  }

  /**
   * Calculate XP required for next evolution
   */
  getXPRequiredForNextEvolution(currentXP: number, currentLevel: number): number {
    const nextTier = this.getNextEvolutionTier(currentLevel);
    if (!nextTier) return 0; // Max level reached
    
    return Math.max(0, nextTier.xpRequired - currentXP);
  }

  /**
   * Check if agent can evolve to next tier
   */
  canEvolve(agent: Agent): boolean {
    const nextTier = this.getNextEvolutionTier(agent.level);
    if (!nextTier) return false;
    
    return agent.xp >= nextTier.xpRequired;
  }

  /**
   * Get evolution progress percentage
   */
  getEvolutionProgress(agent: Agent): number {
    const currentTier = this.getEvolutionTier(agent.level);
    const nextTier = this.getNextEvolutionTier(agent.level);
    
    if (!currentTier || !nextTier) return 100; // Max level reached
    
    const currentXP = agent.xp;
    const tierStartXP = currentTier.xpRequired;
    const tierEndXP = nextTier.xpRequired;
    
    const progress = ((currentXP - tierStartXP) / (tierEndXP - tierStartXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  /**
   * Get all available evolution stages
   */
  getAllEvolutionStages(): EvolutionStage[] {
    return [...this.evolutionStages];
  }

  /**
   * Get all evolution tiers
   */
  getAllEvolutionTiers(): EvolutionTier[] {
    return [...this.evolutionTiers];
  }

  /**
   * Validate evolution stage
   */
  validateEvolutionStage(stage: EvolutionStage): boolean {
    return this.evolutionStages.some(s => s.name === stage.name && s.minLevel === stage.minLevel);
  }

  /**
   * Get evolution stage by name
   */
  getEvolutionStageByName(name: string): EvolutionStage | null {
    return this.evolutionStages.find(stage => stage.name === name) || null;
  }

  /**
   * Get visual effects for a specific level
   */
  getVisualEffectsForLevel(level: number): VisualEffect[] {
    const stage = this.getEvolutionStage(level);
    return stage.visualEffects;
  }

  /**
   * Check if agent has specific visual effect
   */
  hasVisualEffect(agent: Agent, effectType: VisualEffect['type']): boolean {
    const stage = this.getEvolutionStage(agent.level);
    return stage.visualEffects.some(effect => effect.type === effectType);
  }

  /**
   * Get evolution summary for agent
   */
  getEvolutionSummary(agent: Agent): {
    currentStage: EvolutionStage;
    rarity: RarityLevel;
    visualEffects: VisualEffect[];
    nextTier?: EvolutionTier;
    progressPercentage: number;
    canEvolve: boolean;
  } {
    const currentStage = this.getEvolutionStage(agent.level);
    const rarity = this.calculateRarity(agent);
    const visualEffects = this.generateVisualEffects(agent, currentStage);
    const nextTier = this.getNextEvolutionTier(agent.level);
    const progressPercentage = this.getEvolutionProgress(agent);
    const canEvolve = this.canEvolve(agent);

    return {
      currentStage,
      rarity,
      visualEffects,
      nextTier: nextTier || undefined,
      progressPercentage,
      canEvolve
    };
  }
}

export default AvatarEvolutionService.getInstance();
