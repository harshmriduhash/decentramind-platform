export interface AgentUpgradeRequirement {
  xp: number;
  dmtCost: number;
  dmtxCost: number;
  tasksCompleted: number;
  usageCount: number;
  achievements: string[];
}

export interface AgentUpgradeTier {
  level: number;
  name: string;
  llmTier: 'Mini' | 'Pro' | 'Custom';
  llmModels: string[];
  capabilities: string[];
  maxTasksPerDay: number;
  responseTime: string;
  accuracy: string;
  requirements: AgentUpgradeRequirement;
  lockedFeatures: string[];
}

export interface AgentUpgradePath {
  currentLevel: number;
  nextLevel: number;
  progress: number; // 0-100
  canUpgrade: boolean;
  upgradeCost: AgentUpgradeRequirement;
  benefits: string[];
  timeToUpgrade: string;
}

export const AGENT_UPGRADE_TIERS: AgentUpgradeTier[] = [
  {
    level: 1,
    name: 'Novice Agent',
    llmTier: 'Mini',
    llmModels: ['GPT-3.5-turbo', 'DeepSeek-Coder-1b', 'Llama-2-7b'],
    capabilities: [
      'Basic text generation',
      'Simple Q&A responses',
      'Basic code completion',
      'Standard language understanding'
    ],
    maxTasksPerDay: 50,
    responseTime: '2-5 seconds',
    accuracy: '85%',
    requirements: {
      xp: 0,
      dmtCost: 0,
      dmtxCost: 0,
      tasksCompleted: 0,
      usageCount: 0,
      achievements: []
    },
    lockedFeatures: [
      'Advanced reasoning',
      'Multi-step problem solving',
      'Custom model fine-tuning',
      'Real-time collaboration'
    ]
  },
  {
    level: 2,
    name: 'Skilled Agent',
    llmTier: 'Mini',
    llmModels: ['GPT-3.5-turbo', 'DeepSeek-Coder-1b', 'Llama-2-7b'],
    capabilities: [
      'Enhanced text generation',
      'Context-aware responses',
      'Code debugging assistance',
      'Basic pattern recognition'
    ],
    maxTasksPerDay: 100,
    responseTime: '1-3 seconds',
    accuracy: '90%',
    requirements: {
      xp: 500,
      dmtCost: 10,
      dmtxCost: 0,
      tasksCompleted: 25,
      usageCount: 100,
      achievements: ['First 25 tasks completed', '100 interactions reached']
    },
    lockedFeatures: [
      'Advanced reasoning',
      'Multi-step problem solving',
      'Custom model fine-tuning',
      'Real-time collaboration'
    ]
  },
  {
    level: 3,
    name: 'Expert Agent',
    llmTier: 'Pro',
    llmModels: ['GPT-4', 'Claude-2.1', 'Llama-3-8b', 'Gemini-Pro'],
    capabilities: [
      'Advanced reasoning',
      'Complex problem solving',
      'Multi-step task execution',
      'Context memory across sessions',
      'Code architecture design'
    ],
    maxTasksPerDay: 200,
    responseTime: '1-2 seconds',
    accuracy: '95%',
    requirements: {
      xp: 1500,
      dmtCost: 50,
      dmtxCost: 5,
      tasksCompleted: 100,
      usageCount: 500,
      achievements: ['100 tasks completed', '500 interactions reached', 'Expert level unlocked']
    },
    lockedFeatures: [
      'Custom model fine-tuning',
      'Real-time collaboration',
      'Advanced analytics',
      'Multi-agent coordination'
    ]
  },
  {
    level: 4,
    name: 'Master Agent',
    llmTier: 'Pro',
    llmModels: ['GPT-4-turbo', 'Claude-3', 'Llama-3-70b', 'Gemini-Pro-Vision'],
    capabilities: [
      'Master-level reasoning',
      'Multi-domain expertise',
      'Advanced pattern recognition',
      'Complex workflow automation',
      'Cross-platform integration',
      'Advanced analytics and insights'
    ],
    maxTasksPerDay: 500,
    responseTime: '0.5-1.5 seconds',
    accuracy: '98%',
    requirements: {
      xp: 3500,
      dmtCost: 100,
      dmtxCost: 15,
      tasksCompleted: 250,
      usageCount: 1000,
      achievements: ['250 tasks completed', '1000 interactions reached', 'Master level unlocked', 'Advanced workflows created']
    },
    lockedFeatures: [
      'Custom model fine-tuning',
      'Real-time collaboration',
      'Multi-agent coordination',
      'Advanced security features'
    ]
  },
  {
    level: 5,
    name: 'Legendary Agent',
    llmTier: 'Custom',
    llmModels: ['Custom Fine-tuned Model', 'Ollama-Run Models', 'Agent-Specific LLM'],
    capabilities: [
      'Custom fine-tuned intelligence',
      'Real-time collaboration',
      'Multi-agent coordination',
      'Advanced security features',
      'Unlimited task processing',
      'Custom model training',
      'Advanced analytics dashboard',
      'API integration mastery'
    ],
    maxTasksPerDay: -1, // Unlimited
    responseTime: '0.2-1 second',
    accuracy: '99%+',
    requirements: {
      xp: 7500,
      dmtCost: 250,
      dmtxCost: 50,
      tasksCompleted: 500,
      usageCount: 2500,
      achievements: ['500 tasks completed', '2500 interactions reached', 'Legendary level unlocked', 'Custom model trained', 'Advanced workflows mastered']
    },
    lockedFeatures: []
  }
];

export const calculateUpgradePath = (
  currentXp: number,
  tasksCompleted: number,
  usageCount: number,
  currentLevel: number
): AgentUpgradePath => {
  const currentTier = AGENT_UPGRADE_TIERS.find(tier => tier.level === currentLevel);
  const nextTier = AGENT_UPGRADE_TIERS.find(tier => tier.level === currentLevel + 1);

  if (!currentTier || !nextTier) {
    return {
      currentLevel,
      nextLevel: currentLevel,
      progress: 100,
      canUpgrade: false,
      upgradeCost: nextTier?.requirements || AGENT_UPGRADE_TIERS[0].requirements,
      benefits: [],
      timeToUpgrade: 'Max level reached'
    };
  }

  const xpProgress = Math.min((currentXp / nextTier.requirements.xp) * 100, 100);
  const tasksProgress = Math.min((tasksCompleted / nextTier.requirements.tasksCompleted) * 100, 100);
  const usageProgress = Math.min((usageCount / nextTier.requirements.usageCount) * 100, 100);
  
  const overallProgress = (xpProgress + tasksProgress + usageProgress) / 3;
  
  const canUpgrade = currentXp >= nextTier.requirements.xp &&
                    tasksCompleted >= nextTier.requirements.tasksCompleted &&
                    usageCount >= nextTier.requirements.usageCount;

  const benefits = nextTier.capabilities.filter(cap => 
    !currentTier.capabilities.includes(cap)
  );

  const timeToUpgrade = canUpgrade ? 'Ready to upgrade!' : 
    `~${Math.ceil((nextTier.requirements.xp - currentXp) / 50)} days`;

  return {
    currentLevel,
    nextLevel: nextTier.level,
    progress: Math.round(overallProgress),
    canUpgrade,
    upgradeCost: nextTier.requirements,
    benefits,
    timeToUpgrade
  };
};

export const getAgentTier = (level: number): AgentUpgradeTier | undefined => {
  return AGENT_UPGRADE_TIERS.find(tier => tier.level === level);
};

export const getTierBadgeColor = (llmTier: string): string => {
  switch (llmTier) {
    case 'Mini':
      return '#4caf50'; // Green
    case 'Pro':
      return '#2196f3'; // Blue
    case 'Custom':
      return '#ff9800'; // Orange
    default:
      return '#9e9e9e'; // Gray
  }
};

export const getTierBadgeIcon = (llmTier: string): string => {
  switch (llmTier) {
    case 'Mini':
      return '⚡';
    case 'Pro':
      return '🚀';
    case 'Custom':
      return '👑';
    default:
      return '❓';
  }
};

export const formatUpgradeCost = (cost: AgentUpgradeRequirement): string => {
  const parts = [];
  if (cost.dmtCost > 0) parts.push(`${cost.dmtCost} DMT`);
  if (cost.dmtxCost > 0) parts.push(`${cost.dmtxCost} DMTX`);
  return parts.join(' + ') || 'Free';
};

export const getUpgradeAnimation = (level: number): string => {
  const animations = [
    'sparkle', // Level 1->2
    'glow',    // Level 2->3
    'pulse',   // Level 3->4
    'explosion' // Level 4->5
  ];
  return animations[Math.min(level - 1, 3)] || 'sparkle';
};

