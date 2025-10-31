import { z } from 'zod';

// Agent validation schema
export const AgentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Agent name is required').max(100, 'Agent name too long'),
  domain: z.string().min(1, 'Domain is required'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  personality: z.string().min(1, 'Personality is required'),
  cost: z.number().min(0, 'Cost must be non-negative'),
  xp: z.number().min(0, 'XP must be non-negative'),
  level: z.number().min(1, 'Level must be at least 1'),
  mintDate: z.string().datetime(),
  owner: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid wallet address'),
  status: z.enum(['active', 'inactive', 'training']),
  type: z.enum(['master', 'sub']).optional(),
  skills: z.array(z.string()).min(1, 'At least one skill required'),
  performance: z.object({
    tasksCompleted: z.number().min(0),
    successRate: z.number().min(0).max(100),
    averageResponseTime: z.number().min(0)
  }),
  metadata: z.object({
    model: z.string(),
    version: z.string(),
    lastUpdated: z.string().datetime()
  }),
  capabilities: z.array(z.string()).optional(),
  evolutionStage: z.string().optional(),
  llmConfig: z.object({
    model: z.string(),
    version: z.string(),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().min(1),
    contextWindow: z.number().min(1)
  }),
  ragConfig: z.object({
    dataSource: z.string(),
    vectorDB: z.string(),
    ipfsHash: z.string().optional(),
    knowledgeBase: z.array(z.string()),
    lastUpdated: z.string().datetime()
  }),
  evolutionHistory: z.array(z.object({
    timestamp: z.string().datetime(),
    previousLevel: z.number(),
    newLevel: z.number(),
    dmtSpent: z.number(),
    llmUpgrade: z.string(),
    newSuperpowers: z.array(z.string()),
    reason: z.string()
  })),
  individualStats: z.object({
    totalUpgrades: z.number().min(0),
    totalDmtSpent: z.number().min(0),
    uniqueConversations: z.number().min(0),
    domainExpertise: z.number().min(0),
    lastActive: z.string().datetime()
  })
});

// Minting request validation
export const MintAgentRequestSchema = z.object({
  name: z.string().min(1, 'Agent name is required').max(100, 'Agent name too long'),
  domain: z.string().min(1, 'Domain is required'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  personality: z.string().min(1, 'Personality is required'),
  cost: z.number().min(0, 'Cost must be non-negative'),
  skills: z.array(z.string()).min(1, 'At least one skill required'),
  type: z.enum(['master', 'sub']).optional(),
  owner: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid wallet address')
});

// Evolution request validation
export const EvolutionRequestSchema = z.object({
  agentId: z.string().min(1, 'Agent ID is required'),
  userId: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid wallet address'),
  dmtAmount: z.number().min(1, 'DMT amount must be positive')
});

// Task delegation validation
export const TaskDelegationSchema = z.object({
  task: z.string().min(1, 'Task description is required').max(1000, 'Task too long'),
  userId: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid wallet address'),
  masterAgentId: z.string().optional()
});

// Validation functions
export const validateAgent = (data: any) => {
  try {
    return { success: true, data: AgentSchema.parse(data) };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof z.ZodError ? error.errors[0].message : 'Validation failed' 
    };
  }
};

export const validateMintRequest = (data: any) => {
  try {
    return { success: true, data: MintAgentRequestSchema.parse(data) };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof z.ZodError ? error.errors[0].message : 'Validation failed' 
    };
  }
};

export const validateEvolutionRequest = (data: any) => {
  try {
    return { success: true, data: EvolutionRequestSchema.parse(data) };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof z.ZodError ? error.errors[0].message : 'Validation failed' 
    };
  }
};

export const validateTaskDelegation = (data: any) => {
  try {
    return { success: true, data: TaskDelegationSchema.parse(data) };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof z.ZodError ? error.errors[0].message : 'Validation failed' 
    };
  }
};

// Wallet address validation
export const isValidWalletAddress = (address: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
};

// Domain validation
export const isValidDomain = (domain: string): boolean => {
  const validDomains = [
    'Productivity', 'Learning', 'Health & Wellness', 
    'Creative', 'Technical', 'Business', 'Science'
  ];
  return validDomains.includes(domain);
};

// Agent type validation
export const isValidAgentType = (type: string): boolean => {
  return ['master', 'sub'].includes(type);
};

// Subscription validation schemas
export const SubscriptionRequestSchema = z.object({
  userId: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid wallet address'),
  tierName: z.enum(['freemium', 'basic', 'pro', 'enterprise'])
});

// Burn request validation schema
export const BurnRequestSchema = z.object({
  amount: z.number().min(0, 'Amount must be non-negative'),
  source: z.enum(['minting', 'subscription', 'upgrade', 'marketplace', 'dao']),
  userId: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid wallet address'),
  agentId: z.string().optional(),
  subscriptionTier: z.string().optional(),
  transactionHash: z.string().optional(),
  metadata: z.any().optional()
});

// Subscription validation function
export const validateSubscriptionRequest = (data: any) => {
  try {
    return { success: true, data: SubscriptionRequestSchema.parse(data) };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof z.ZodError ? error.errors[0].message : 'Validation failed' 
    };
  }
};

// Burn request validation function
export const validateBurnRequest = (data: any) => {
  try {
    return { success: true, data: BurnRequestSchema.parse(data) };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof z.ZodError ? error.errors[0].message : 'Validation failed' 
    };
  }
}; 