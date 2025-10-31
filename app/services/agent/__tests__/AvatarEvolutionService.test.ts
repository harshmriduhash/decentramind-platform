// Unit Tests for Avatar Evolution Service
// Tests evolution tier calculation and visual effects

import AvatarEvolutionService from '../services/agent/AvatarEvolutionService';
import { Agent } from '../services/agentService';

// Mock agent data for testing
const createMockAgent = (overrides: Partial<Agent> = {}): Agent => ({
  id: 'test-agent-1',
  name: 'Test Agent',
  domain: 'Technical',
  description: 'Test agent for unit testing',
  personality: 'Analytical',
  cost: 100,
  xp: 0,
  level: 1,
  xpToNext: 1200,
  mintDate: new Date().toISOString(),
  owner: 'test-wallet-address',
  status: 'active',
  type: 'sub',
  skills: ['Testing', 'Development'],
  performance: {
    tasksCompleted: 0,
    successRate: 100,
    averageResponseTime: 0,
    totalEarnings: 0
  },
  metadata: {
    model: 'gpt-3.5',
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  },
  capabilities: ['Basic Testing'],
  evolutionStage: 'Novice',
  llmConfig: {
    model: 'GPT-3.5',
    version: '3.5-turbo-0613',
    temperature: 0.7,
    maxTokens: 4096,
    contextWindow: 4096
  },
  ragConfig: {
    dataSource: 'test-datasource',
    vectorDB: 'test-vectordb',
    knowledgeBase: ['testing', 'development'],
    lastUpdated: new Date().toISOString()
  },
  evolutionHistory: [],
  individualStats: {
    totalUpgrades: 0,
    totalDmtSpent: 0,
    uniqueConversations: 0,
    domainExpertise: 10,
    lastActive: new Date().toISOString()
  },
  ...overrides
});

describe('AvatarEvolutionService', () => {
  let avatarEvolutionService: AvatarEvolutionService;

  beforeEach(() => {
    avatarEvolutionService = AvatarEvolutionService.getInstance();
  });

  describe('Evolution Stage Calculation', () => {
    test('should return Novice stage for level 1', () => {
      const agent = createMockAgent({ level: 1 });
      const stage = avatarEvolutionService.getEvolutionStage(agent.level);
      
      expect(stage.name).toBe('Novice');
      expect(stage.minLevel).toBe(1);
      expect(stage.visualEffects).toHaveLength(0);
      expect(stage.rarity.name).toBe('common');
    });

    test('should return Advanced stage for level 5', () => {
      const agent = createMockAgent({ level: 5 });
      const stage = avatarEvolutionService.getEvolutionStage(agent.level);
      
      expect(stage.name).toBe('Advanced');
      expect(stage.minLevel).toBe(5);
      expect(stage.visualEffects).toHaveLength(1);
      expect(stage.visualEffects[0].type).toBe('glow');
      expect(stage.rarity.name).toBe('rare');
    });

    test('should return Expert stage for level 10', () => {
      const agent = createMockAgent({ level: 10 });
      const stage = avatarEvolutionService.getEvolutionStage(agent.level);
      
      expect(stage.name).toBe('Expert');
      expect(stage.minLevel).toBe(10);
      expect(stage.visualEffects).toHaveLength(2);
      expect(stage.visualEffects.some(e => e.type === 'glow')).toBe(true);
      expect(stage.visualEffects.some(e => e.type === 'particles')).toBe(true);
      expect(stage.rarity.name).toBe('rare');
    });

    test('should return Master stage for level 15', () => {
      const agent = createMockAgent({ level: 15 });
      const stage = avatarEvolutionService.getEvolutionStage(agent.level);
      
      expect(stage.name).toBe('Master');
      expect(stage.minLevel).toBe(15);
      expect(stage.visualEffects).toHaveLength(3);
      expect(stage.visualEffects.some(e => e.type === 'glow')).toBe(true);
      expect(stage.visualEffects.some(e => e.type === 'particles')).toBe(true);
      expect(stage.visualEffects.some(e => e.type === 'aura')).toBe(true);
      expect(stage.rarity.name).toBe('epic');
    });

    test('should return Legendary stage for level 20', () => {
      const agent = createMockAgent({ level: 20 });
      const stage = avatarEvolutionService.getEvolutionStage(agent.level);
      
      expect(stage.name).toBe('Legendary');
      expect(stage.minLevel).toBe(20);
      expect(stage.visualEffects).toHaveLength(4);
      expect(stage.visualEffects.some(e => e.type === 'glow')).toBe(true);
      expect(stage.visualEffects.some(e => e.type === 'particles')).toBe(true);
      expect(stage.visualEffects.some(e => e.type === 'aura')).toBe(true);
      expect(stage.visualEffects.some(e => e.type === 'legendary')).toBe(true);
      expect(stage.rarity.name).toBe('legendary');
    });
  });

  describe('Evolution Tier Calculation', () => {
    test('should get correct evolution tier for level 1', () => {
      const tier = avatarEvolutionService.getEvolutionTier(1);
      
      expect(tier).not.toBeNull();
      expect(tier!.level).toBe(1);
      expect(tier!.xpRequired).toBe(0);
      expect(tier!.visualUpgrades).toHaveLength(0);
    });

    test('should get correct evolution tier for level 5', () => {
      const tier = avatarEvolutionService.getEvolutionTier(5);
      
      expect(tier).not.toBeNull();
      expect(tier!.level).toBe(5);
      expect(tier!.xpRequired).toBe(3000);
      expect(tier!.visualUpgrades).toContain('glow');
    });

    test('should get correct evolution tier for level 10', () => {
      const tier = avatarEvolutionService.getEvolutionTier(10);
      
      expect(tier).not.toBeNull();
      expect(tier!.level).toBe(10);
      expect(tier!.xpRequired).toBe(6000);
      expect(tier!.visualUpgrades).toContain('glow');
      expect(tier!.visualUpgrades).toContain('particles');
    });

    test('should get correct evolution tier for level 15', () => {
      const tier = avatarEvolutionService.getEvolutionTier(15);
      
      expect(tier).not.toBeNull();
      expect(tier!.level).toBe(15);
      expect(tier!.xpRequired).toBe(10000);
      expect(tier!.visualUpgrades).toContain('glow');
      expect(tier!.visualUpgrades).toContain('particles');
      expect(tier!.visualUpgrades).toContain('aura');
    });

    test('should get correct evolution tier for level 20', () => {
      const tier = avatarEvolutionService.getEvolutionTier(20);
      
      expect(tier).not.toBeNull();
      expect(tier!.level).toBe(20);
      expect(tier!.xpRequired).toBe(15000);
      expect(tier!.visualUpgrades).toContain('glow');
      expect(tier!.visualUpgrades).toContain('particles');
      expect(tier!.visualUpgrades).toContain('aura');
      expect(tier!.visualUpgrades).toContain('legendary');
    });

    test('should return null for invalid level', () => {
      const tier = avatarEvolutionService.getEvolutionTier(999);
      expect(tier).toBeNull();
    });
  });

  describe('Next Evolution Tier', () => {
    test('should get next tier for level 1', () => {
      const nextTier = avatarEvolutionService.getNextEvolutionTier(1);
      
      expect(nextTier).not.toBeNull();
      expect(nextTier!.level).toBe(3);
      expect(nextTier!.xpRequired).toBe(1200);
    });

    test('should get next tier for level 3', () => {
      const nextTier = avatarEvolutionService.getNextEvolutionTier(3);
      
      expect(nextTier).not.toBeNull();
      expect(nextTier!.level).toBe(5);
      expect(nextTier!.xpRequired).toBe(3000);
    });

    test('should get next tier for level 5', () => {
      const nextTier = avatarEvolutionService.getNextEvolutionTier(5);
      
      expect(nextTier).not.toBeNull();
      expect(nextTier!.level).toBe(10);
      expect(nextTier!.xpRequired).toBe(6000);
    });

    test('should return null for max level', () => {
      const nextTier = avatarEvolutionService.getNextEvolutionTier(20);
      expect(nextTier).toBeNull();
    });
  });

  describe('XP Required for Next Evolution', () => {
    test('should calculate XP required for level 1 agent', () => {
      const agent = createMockAgent({ level: 1, xp: 500 });
      const xpRequired = avatarEvolutionService.getXPRequiredForNextEvolution(agent.xp, agent.level);
      
      expect(xpRequired).toBe(700); // 1200 - 500
    });

    test('should calculate XP required for level 5 agent', () => {
      const agent = createMockAgent({ level: 5, xp: 3500 });
      const xpRequired = avatarEvolutionService.getXPRequiredForNextEvolution(agent.xp, agent.level);
      
      expect(xpRequired).toBe(2500); // 6000 - 3500
    });

    test('should return 0 for max level agent', () => {
      const agent = createMockAgent({ level: 20, xp: 20000 });
      const xpRequired = avatarEvolutionService.getXPRequiredForNextEvolution(agent.xp, agent.level);
      
      expect(xpRequired).toBe(0);
    });
  });

  describe('Evolution Capability', () => {
    test('should allow evolution for level 1 agent with sufficient XP', () => {
      const agent = createMockAgent({ level: 1, xp: 1200 });
      const canEvolve = avatarEvolutionService.canEvolve(agent);
      
      expect(canEvolve).toBe(true);
    });

    test('should not allow evolution for level 1 agent with insufficient XP', () => {
      const agent = createMockAgent({ level: 1, xp: 500 });
      const canEvolve = avatarEvolutionService.canEvolve(agent);
      
      expect(canEvolve).toBe(false);
    });

    test('should not allow evolution for max level agent', () => {
      const agent = createMockAgent({ level: 20, xp: 50000 });
      const canEvolve = avatarEvolutionService.canEvolve(agent);
      
      expect(canEvolve).toBe(false);
    });
  });

  describe('Evolution Progress', () => {
    test('should calculate progress for level 1 agent', () => {
      const agent = createMockAgent({ level: 1, xp: 600 });
      const progress = avatarEvolutionService.getEvolutionProgress(agent);
      
      expect(progress).toBe(50); // 600 / 1200 * 100
    });

    test('should calculate progress for level 5 agent', () => {
      const agent = createMockAgent({ level: 5, xp: 4500 });
      const progress = avatarEvolutionService.getEvolutionProgress(agent);
      
      expect(progress).toBe(50); // (4500 - 3000) / (6000 - 3000) * 100
    });

    test('should return 100 for max level agent', () => {
      const agent = createMockAgent({ level: 20, xp: 50000 });
      const progress = avatarEvolutionService.getEvolutionProgress(agent);
      
      expect(progress).toBe(100);
    });
  });

  describe('Visual Effects', () => {
    test('should return empty effects for level 1', () => {
      const effects = avatarEvolutionService.getVisualEffectsForLevel(1);
      expect(effects).toHaveLength(0);
    });

    test('should return glow effect for level 5', () => {
      const effects = avatarEvolutionService.getVisualEffectsForLevel(5);
      expect(effects).toHaveLength(1);
      expect(effects[0].type).toBe('glow');
    });

    test('should return glow and particles for level 10', () => {
      const effects = avatarEvolutionService.getVisualEffectsForLevel(10);
      expect(effects).toHaveLength(2);
      expect(effects.some(e => e.type === 'glow')).toBe(true);
      expect(effects.some(e => e.type === 'particles')).toBe(true);
    });

    test('should return all effects for level 20', () => {
      const effects = avatarEvolutionService.getVisualEffectsForLevel(20);
      expect(effects).toHaveLength(4);
      expect(effects.some(e => e.type === 'glow')).toBe(true);
      expect(effects.some(e => e.type === 'particles')).toBe(true);
      expect(effects.some(e => e.type === 'aura')).toBe(true);
      expect(effects.some(e => e.type === 'legendary')).toBe(true);
    });
  });

  describe('Visual Effect Detection', () => {
    test('should detect glow effect for level 5 agent', () => {
      const agent = createMockAgent({ level: 5 });
      const hasGlow = avatarEvolutionService.hasVisualEffect(agent, 'glow');
      
      expect(hasGlow).toBe(true);
    });

    test('should not detect glow effect for level 1 agent', () => {
      const agent = createMockAgent({ level: 1 });
      const hasGlow = avatarEvolutionService.hasVisualEffect(agent, 'glow');
      
      expect(hasGlow).toBe(false);
    });

    test('should detect legendary effect for level 20 agent', () => {
      const agent = createMockAgent({ level: 20 });
      const hasLegendary = avatarEvolutionService.hasVisualEffect(agent, 'legendary');
      
      expect(hasLegendary).toBe(true);
    });
  });

  describe('Evolution Summary', () => {
    test('should generate complete evolution summary', () => {
      const agent = createMockAgent({ level: 10, xp: 7000 });
      const summary = avatarEvolutionService.getEvolutionSummary(agent);
      
      expect(summary.currentStage.name).toBe('Expert');
      expect(summary.rarity.name).toBe('rare');
      expect(summary.visualEffects).toHaveLength(2);
      expect(summary.nextTier).not.toBeNull();
      expect(summary.nextTier!.level).toBe(15);
      expect(summary.progressPercentage).toBeGreaterThan(0);
      expect(summary.canEvolve).toBe(true);
    });

    test('should handle max level agent summary', () => {
      const agent = createMockAgent({ level: 20, xp: 50000 });
      const summary = avatarEvolutionService.getEvolutionSummary(agent);
      
      expect(summary.currentStage.name).toBe('Legendary');
      expect(summary.rarity.name).toBe('legendary');
      expect(summary.visualEffects).toHaveLength(4);
      expect(summary.nextTier).toBeUndefined();
      expect(summary.progressPercentage).toBe(100);
      expect(summary.canEvolve).toBe(false);
    });
  });

  describe('Evolution Stage Validation', () => {
    test('should validate correct evolution stage', () => {
      const stage = avatarEvolutionService.getEvolutionStage(5);
      const isValid = avatarEvolutionService.validateEvolutionStage(stage);
      
      expect(isValid).toBe(true);
    });

    test('should invalidate incorrect evolution stage', () => {
      const invalidStage = {
        name: 'Invalid',
        minLevel: 999,
        visualEffects: [],
        rarity: { name: 'common', multiplier: 1.0, color: '#9CA3AF', description: 'Invalid' },
        description: 'Invalid stage'
      };
      const isValid = avatarEvolutionService.validateEvolutionStage(invalidStage);
      
      expect(isValid).toBe(false);
    });
  });

  describe('Evolution Stage by Name', () => {
    test('should get evolution stage by name', () => {
      const stage = avatarEvolutionService.getEvolutionStageByName('Advanced');
      
      expect(stage).not.toBeNull();
      expect(stage!.name).toBe('Advanced');
      expect(stage!.minLevel).toBe(5);
    });

    test('should return null for invalid name', () => {
      const stage = avatarEvolutionService.getEvolutionStageByName('Invalid');
      expect(stage).toBeNull();
    });
  });

  describe('All Evolution Data', () => {
    test('should return all evolution stages', () => {
      const stages = avatarEvolutionService.getAllEvolutionStages();
      
      expect(stages).toHaveLength(6);
      expect(stages[0].name).toBe('Novice');
      expect(stages[5].name).toBe('Legendary');
    });

    test('should return all evolution tiers', () => {
      const tiers = avatarEvolutionService.getAllEvolutionTiers();
      
      expect(tiers).toHaveLength(6);
      expect(tiers[0].level).toBe(1);
      expect(tiers[5].level).toBe(20);
    });
  });
});

// Export for Jest configuration
export { createMockAgent };

