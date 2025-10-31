// Agent Service for DecentraMind
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  setDoc
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import app, { auth as firebaseAuth, firestore } from '../lib/firebase';
import { validateAgent, validateMintRequest, validateEvolutionRequest, validateTaskDelegation, isValidWalletAddress, isValidDomain } from '../lib/validation';
import { errorHandler, handleAgentNotFound, handlePermissionError, handleValidationError, handleEvolutionError } from '../lib/errorHandler';
import BurningService from './burningService';
import SubscriptionService from './subscriptionService';
import SolanaService from './solanaService';
import AvatarEvolutionService from './agent/AvatarEvolutionService';
import NFTMetadataService from './nft/NFTMetadataService';
import RarityCalculationService from './nft/RarityCalculationService';

// Use centralized Firebase configuration
const db = firestore;
const auth = firebaseAuth;

export interface Agent {
  id?: string;
  name: string;
  domain: string;
  description: string;
  personality: string;
  cost: number;
  xp: number;
  level: number;
  xpToNext: number;
  mintDate: string;
  owner: string;
  status: 'active' | 'inactive' | 'training';
  type?: 'master' | 'sub';
  skills: string[];
  avatar?: string; // Add avatar property
  performance: {
    tasksCompleted: number;
    successRate: number;
    averageResponseTime: number;
    totalEarnings: number;
  };
  metadata: {
    model: string;
    version: string;
    lastUpdated: string;
  };
  capabilities?: string[];
  evolutionStage?: string;
  // Individual Agent Configuration
  llmConfig: {
    model: string;
    version: string;
    temperature: number;
    maxTokens: number;
    contextWindow: number;
  };
  ragConfig: {
    dataSource: string;
    vectorDB: string;
    ipfsHash?: string;
    knowledgeBase: string[];
    lastUpdated: string;
  };
  evolutionHistory: {
    timestamp: string;
    previousLevel: number;
    newLevel: number;
    dmtSpent: number;
    llmUpgrade: string;
    newSuperpowers: string[];
    reason: string;
  }[];
  individualStats: {
    totalUpgrades: number;
    totalDmtSpent: number;
    uniqueConversations: number;
    domainExpertise: number;
    lastActive: string;
  };
}

export interface MintingResult {
  success: boolean;
  agentId?: string;
  error?: string;
  cost: number;
  xpEarned: number;
  burnedAmount?: number;
  blockchainSignature?: string;
}

// Evolution system with DMT costs and capabilities
interface EvolutionTier {
  level: number;
  cost: number;
  dmtRequired: number;
  llmUpgrade: string;
  voiceCapabilities: string[];
  superpowers: string[];
  description: string;
}

class AgentService {
  private static instance: AgentService;
  private agents: Agent[] = [];

  // XP Leveling System
  private readonly XP_THRESHOLDS = [
    0,      // Level 1
    1200,   // Level 2
    3000,   // Level 3
    6000,   // Level 4
    10000,  // Level 5
    15000,  // Level 6
    21000,  // Level 7
    28000,  // Level 8
    36000,  // Level 9
    45000   // Level 10
  ];

  static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  initialize(): void {
    try {
      console.log('Initializing agent service...');
      
      // Only initialize if agents are not already loaded
      if (this.agents.length === 0) {
        console.log('Loading agent data...');
        // Load mock agents synchronously
        this.agents = [
          {
            id: 'agent-cfo',
            name: 'Autonomous CFO',
            domain: 'Finance',
            description: 'Advanced financial analysis and strategic planning agent',
            personality: 'Analytical',
            cost: 500,
            xp: 2500,
            level: 5,
            xpToNext: 5000,
            mintDate: new Date().toISOString(),
            owner: 'mock-user',
            status: 'active' as const,
            type: 'master' as const,
            skills: ['Financial Analysis', 'Strategic Planning', 'Risk Management', 'Budget Optimization'],
            performance: {
              tasksCompleted: 150,
              successRate: 98,
              averageResponseTime: 1.8,
              totalEarnings: 2500
            },
            metadata: {
              model: 'autonomous-cfo-v2',
              version: '2.1.0',
              lastUpdated: new Date().toISOString()
            },
            capabilities: [
              'Financial Forecasting',
              'Budget Analysis',
              'Investment Strategy',
              'Risk Assessment',
              'Compliance Monitoring'
            ],
            evolutionStage: 'Expert',
            llmConfig: {
              model: 'GPT-4',
              version: 'latest',
              temperature: 0.3,
              maxTokens: 4096,
              contextWindow: 8192,
            },
            ragConfig: {
              dataSource: 'autonomous-cfo-datasource',
              vectorDB: 'pinecone',
              knowledgeBase: ['financial-analysis', 'strategic-planning', 'risk-management', 'compliance'],
              lastUpdated: new Date().toISOString(),
            },
            evolutionHistory: [],
            individualStats: {
              totalUpgrades: 2,
              totalDmtSpent: 300,
              uniqueConversations: 200,
              domainExpertise: 98,
              lastActive: new Date().toISOString(),
            }
          },
          {
            id: 'care-orchestrator',
            name: 'Care Orchestrator',
            domain: 'Health',
            description: 'AI assistant for hospitals and clinics',
            personality: 'Empathetic, clinical, efficient',
            cost: 300,
            xp: 1200,
            level: 3,
            xpToNext: 1800,
            mintDate: new Date().toISOString(),
            owner: 'mock-user',
            status: 'active' as const,
            type: 'master' as const,
            skills: ['Health Monitoring', 'Wellness Planning', 'Care Coordination', 'Medical Research'],
            avatar: 'https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png',
            avatarSource: 'storacha-ipfs',
            performance: {
              tasksCompleted: 85,
              successRate: 94,
              averageResponseTime: 2.1,
              totalEarnings: 1200
            },
            metadata: {
              model: 'care-orchestrator-v1',
              version: '1.2.0',
              lastUpdated: new Date().toISOString()
            },
            capabilities: [
              'Vitals Tracker',
              'Appointment Scheduler', 
              'Medical Record Sync',
              'Health Assessment',
              'Wellness Planning',
              'Care Coordination',
              'Medical Research',
              'Lifestyle Optimization'
            ],
            evolutionStage: 'Advanced',
            llmConfig: {
              model: 'GPT-4',
              version: 'latest',
              temperature: 0.6,
              maxTokens: 4096,
              contextWindow: 8192,
            },
            ragConfig: {
              dataSource: 'care-orchestrator-datasource',
              vectorDB: 'pinecone',
              knowledgeBase: ['health-monitoring', 'wellness-planning', 'care-coordination', 'medical-research'],
              lastUpdated: new Date().toISOString(),
            },
            evolutionHistory: [],
            individualStats: {
              totalUpgrades: 3,
              totalDmtSpent: 500,
              uniqueConversations: 120,
              domainExpertise: 95,
              lastActive: new Date().toISOString(),
            }
          },
          {
            id: 'agent-crypto',
            name: 'Crypto Alpha Assistant',
            domain: 'Crypto',
            description: 'Advanced cryptocurrency analysis and trading assistant',
            personality: 'Strategic',
            cost: 200,
            xp: 0,
            level: 1,
            xpToNext: 500,
            mintDate: new Date().toISOString(),
            owner: 'mock-user',
            status: 'active' as const,
            type: 'master' as const,
            skills: ['Smart Contract Auditing', 'DeFi Analysis', 'Market Prediction', 'Portfolio Optimization'],
            performance: {
              tasksCompleted: 0,
              successRate: 85,
              averageResponseTime: 3.5,
              totalEarnings: 0
            },
            metadata: {
              model: 'crypto-alpha-v1',
              version: '1.0.0',
              lastUpdated: new Date().toISOString()
            },
            capabilities: [
              'Smart Contract Auditing',
              'DeFi Analysis',
              'Market Prediction',
              'Portfolio Optimization',
              'Risk Assessment'
            ],
            evolutionStage: 'Novice',
            llmConfig: {
              model: 'GPT-3.5-turbo',
              version: 'latest',
              temperature: 0.4,
              maxTokens: 2048,
              contextWindow: 4096,
            },
            ragConfig: {
              dataSource: 'crypto-alpha-datasource',
              vectorDB: 'pinecone',
              knowledgeBase: ['smart-contracts', 'defi-protocols', 'market-analysis', 'trading-strategies'],
              lastUpdated: new Date().toISOString(),
            },
            evolutionHistory: [],
            individualStats: {
              totalUpgrades: 0,
              totalDmtSpent: 0,
              uniqueConversations: 0,
              domainExpertise: 0,
              lastActive: new Date().toISOString(),
            }
          }
        ];
        
        console.log('Agents loaded:', this.agents.length);
      } else {
        console.log('Agents already loaded:', this.agents.length);
      }
      
      if (db) {
        console.log('Firebase connected for production data');
      }
    } catch (error) {
      console.error('Failed to initialize agent service:', error);
    }
  }

  // XP Leveling Methods
  private calculateLevel(xp: number): number {
    for (let i = this.XP_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= this.XP_THRESHOLDS[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  private getXPForNextLevel(level: number, xp: number): number {
    if (level >= this.XP_THRESHOLDS.length) {
      return 0; // Max level reached
    }
    return this.XP_THRESHOLDS[level] - xp;
  }

  async addXP(agentId: string, xpAmount: number, taskType: string = 'general'): Promise<{ success: boolean; leveledUp: boolean; newLevel?: number; error?: string }> {
    try {
      const agent = this.agents.find(a => a.id === agentId);
      if (!agent) {
        return { success: false, leveledUp: false, error: 'Agent not found' };
      }

      const oldLevel = agent.level;
      agent.xp += xpAmount;
      agent.level = this.calculateLevel(agent.xp);
      agent.xpToNext = this.calculateXPToNext(agent.xp, agent.level);

      // Update performance stats
      agent.performance.tasksCompleted += 1;
      agent.performance.totalEarnings += Math.floor(xpAmount / 10); // Convert XP to DMT earnings

      const leveledUp = agent.level > oldLevel;

      // Update in Firebase if connected
      try {
        const agentRef = doc(db, 'agents', agentId);
        await updateDoc(agentRef, {
          xp: agent.xp,
          level: agent.level,
          xpToNext: agent.xpToNext,
          performance: agent.performance,
          metadata: {
            ...agent.metadata,
            lastUpdated: new Date().toISOString()
          }
        });
      } catch (firebaseError) {
        console.warn('Failed to update agent in Firebase:', firebaseError);
      }

      return { 
        success: true, 
        leveledUp, 
        newLevel: leveledUp ? agent.level : undefined 
      };
    } catch (error) {
      console.error('Failed to add XP:', error);
      return { 
        success: false, 
        leveledUp: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getAgentLevelInfo(agentId: string): Promise<{ level: number; xp: number; xpToNext: number; progressPercentage: number } | null> {
    try {
      const agent = this.agents.find(a => a.id === agentId);
      if (!agent) {
        return null;
      }

      const currentLevelXP = this.XP_THRESHOLDS[agent.level - 1] || 0;
      const nextLevelXP = this.XP_THRESHOLDS[agent.level] || this.XP_THRESHOLDS[agent.level - 1];
      const progressPercentage = nextLevelXP > currentLevelXP 
        ? ((agent.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
        : 100;

      return {
        level: agent.level,
        xp: agent.xp,
        xpToNext: agent.xpToNext,
        progressPercentage: Math.min(100, Math.max(0, progressPercentage))
      };
    } catch (error) {
      console.error('Failed to get agent level info:', error);
      return null;
    }
  }

  async mintAgent(agentData: Omit<Agent, 'id' | 'mintDate' | 'status' | 'xp' | 'level' | 'performance' | 'metadata'> & { owner?: string }): Promise<MintingResult> {
    try {
      // Validate input data
      const validation = validateMintRequest(agentData);
      if (!validation.success) {
        return { 
          success: false, 
          error: validation.error,
          cost: 0,
          xpEarned: 0
        };
      }

      // Validate owner - must be a wallet address
      if (!agentData.owner || !isValidWalletAddress(agentData.owner)) {
        return { 
          success: false, 
          error: 'Invalid owner: Must be a valid Solana wallet address',
          cost: 0,
          xpEarned: 0
        };
      }
      const owner = agentData.owner;

      // Check subscription requirements
      const subscription = await SubscriptionService.getUserSubscription(owner);
      if (!subscription) {
        return {
          success: false,
          error: 'Active subscription required to mint agents',
          cost: 0,
          xpEarned: 0
        };
      }

      // Check if user has credits
      const hasCredits = await SubscriptionService.hasCredits(owner, 1);
      if (!hasCredits) {
        return {
          success: false,
          error: 'Insufficient credits. Please upgrade your subscription.',
          cost: 0,
          xpEarned: 0
        };
      }

      // Calculate minting fee based on agent type
      const mintingFee = this.calculateMintingFee(agentData.type || 'sub');
      
      // REAL BLOCKCHAIN TRANSACTION - Mint agent on Solana
      const solanaService = SolanaService;
      const blockchainResult = await solanaService.mintAgent(mintingFee);
      
      if (!blockchainResult.success) {
        return {
          success: false,
          error: `Blockchain transaction failed: ${blockchainResult.error}`,
          cost: 0,
          xpEarned: 0
        };
      }

      // Burn 30% of minting fee
      const burnResult = await BurningService.burnMintingFee(owner, mintingFee);
      if (!burnResult.success) {
        return {
          success: false,
          error: `Failed to process burning: ${burnResult.error}`,
          cost: 0,
          xpEarned: 0
        };
      }

      // Use subscription credits
      await SubscriptionService.useCredits(owner, 1);
      
      if (db) {
        // Firebase is available - try to use it
        try {
          const newAgent = {
            ...agentData,
            mintDate: new Date().toISOString(),
            owner: owner,
            status: 'active' as const,
            type: agentData.type || 'sub',
            xp: 0,
            level: 1,
            performance: {
              tasksCompleted: 0,
              successRate: 100,
              averageResponseTime: 0,
              totalEarnings: 0
            },
            metadata: {
              model: 'gpt-4',
              version: '1.0.0',
              lastUpdated: new Date().toISOString()
            },
            // Initialize individual agent configuration
            llmConfig: {
              model: 'GPT-3.5',
              version: '3.5-turbo-0613',
              temperature: 0.7,
              maxTokens: 4096,
              contextWindow: 4096
            },
            ragConfig: {
              dataSource: `data_source_${Date.now()}_${agentData.domain.toLowerCase().replace(/\s+/g, '_')}_level_1`,
              vectorDB: `vector_db_${Date.now()}_1`,
              ipfsHash: `Qm${Date.now().toString(36)}`,
              knowledgeBase: this.generateKnowledgeBase(agentData.domain, 1),
              lastUpdated: new Date().toISOString()
            },
            evolutionHistory: [],
            individualStats: {
              totalUpgrades: 0,
              totalDmtSpent: 0,
              uniqueConversations: 0,
              domainExpertise: 10,
              lastActive: new Date().toISOString()
            }
          };

          const docRef = await addDoc(collection(db, 'agents'), newAgent);
          
          // Add to local cache with the generated ID
          const agentWithId = { ...newAgent, id: docRef.id };
          this.agents.push(agentWithId);

          // Calculate XP earned
          const xpEarned = Math.floor(mintingFee * 10); // 10 XP per DMT spent

          return {
            success: true,
            agentId: docRef.id,
            cost: mintingFee,
            xpEarned,
            burnedAmount: mintingFee * 0.3, // 30% burned
            blockchainSignature: blockchainResult.signature
          };
        } catch (firebaseError) {
          console.error('Firebase error during agent minting:', firebaseError);
          return {
            success: false,
            error: 'Failed to save agent to database',
            cost: 0,
            xpEarned: 0
          };
        }
      } else {
        // Firebase not available - use local storage only
        const newAgent = {
          ...agentData,
          id: `local_${Date.now()}`,
          mintDate: new Date().toISOString(),
          owner: owner,
          status: 'active' as const,
          type: agentData.type || 'sub',
          xp: 0,
          level: 1,
          performance: {
            tasksCompleted: 0,
            successRate: 100,
            averageResponseTime: 0,
            totalEarnings: 0
          },
          metadata: {
            model: 'gpt-4',
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
          },
          llmConfig: {
            model: 'GPT-3.5',
            version: '3.5-turbo-0613',
            temperature: 0.7,
            maxTokens: 4096,
            contextWindow: 4096
          },
          ragConfig: {
            dataSource: `data_source_${Date.now()}_${agentData.domain.toLowerCase().replace(/\s+/g, '_')}_level_1`,
            vectorDB: `vector_db_${Date.now()}_1`,
            ipfsHash: `Qm${Date.now().toString(36)}`,
            knowledgeBase: this.generateKnowledgeBase(agentData.domain, 1),
            lastUpdated: new Date().toISOString()
          },
          evolutionHistory: [],
          individualStats: {
            totalUpgrades: 0,
            totalDmtSpent: 0,
            uniqueConversations: 0,
            domainExpertise: 10,
            lastActive: new Date().toISOString()
          }
        };

        this.agents.push(newAgent);

        const xpEarned = Math.floor(mintingFee * 10);

        return {
          success: true,
          agentId: newAgent.id,
          cost: mintingFee,
          xpEarned,
          burnedAmount: mintingFee * 0.3,
          blockchainSignature: blockchainResult.signature
        };
      }
    } catch (error) {
      console.error('Agent minting error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to mint agent',
        cost: 0,
        xpEarned: 0
      };
    }
  }

  async getAgents(ownerId?: string): Promise<Agent[]> {
    try {
      console.log('Getting agents for ownerId:', ownerId);
      
      // Always ensure mock agents are initialized first
      if (this.agents.length === 0) {
        console.log('Initializing mock agents...');
        this.initialize();
        console.log('Mock agents initialized, count:', this.agents.length);
      }
      
      console.log('Returning mock agents:', this.agents.length);
      console.log('Agent names:', this.agents.map(a => a.name));
      return this.agents;
      
    } catch (error) {
      console.error('Failed to get agents:', error);
      // Ensure we have mock agents even if Firebase fails
      if (this.agents.length === 0) {
        this.initialize();
      }
      return this.agents; // Return cached data
    }
  }

  // Simple synchronous method that always returns mock agents
  getAgentsSync(): Agent[] {
    console.log('Getting agents synchronously...');
    if (this.agents.length === 0) {
      console.log('Initializing mock agents synchronously...');
      this.agents = [
        {
          id: 'agent-cfo',
          name: 'Autonomous CFO',
          domain: 'Finance',
          description: 'Advanced financial analysis and strategic planning agent',
          personality: 'Analytical',
          cost: 500,
          xp: 2500,
          level: 5,
          xpToNext: 5000,
          mintDate: new Date().toISOString(),
          owner: 'mock-user',
          status: 'active' as const,
          type: 'master' as const,
          skills: ['Financial Analysis', 'Strategic Planning', 'Risk Management', 'Budget Optimization'],
          performance: {
            tasksCompleted: 150,
            successRate: 98,
            averageResponseTime: 1.8,
            totalEarnings: 2500
          },
          metadata: {
            model: 'autonomous-cfo-v2',
            version: '2.1.0',
            lastUpdated: new Date().toISOString()
          },
          capabilities: [
            'Financial Forecasting',
            'Budget Analysis',
            'Investment Strategy',
            'Risk Assessment',
            'Compliance Monitoring'
          ],
          evolutionStage: 'Expert',
          llmConfig: {
            model: 'GPT-4',
            version: 'latest',
            temperature: 0.3,
            maxTokens: 4096,
            contextWindow: 8192,
          },
          ragConfig: {
            dataSource: 'autonomous-cfo-datasource',
            vectorDB: 'pinecone',
            knowledgeBase: ['financial-analysis', 'strategic-planning', 'risk-management', 'compliance'],
            lastUpdated: new Date().toISOString(),
          },
          evolutionHistory: [],
          individualStats: {
            totalUpgrades: 3,
            totalDmtSpent: 500,
            uniqueConversations: 120,
            domainExpertise: 95,
            lastActive: new Date().toISOString(),
          }
        },
        {
          id: 'agent-care',
          name: 'Care Orchestrator',
          domain: 'Health',
          description: 'AI assistant for hospitals and clinics',
          personality: 'Empathetic, clinical, efficient',
          cost: 300,
          xp: 1200,
          level: 3,
          xpToNext: 1800,
          mintDate: new Date().toISOString(),
          owner: 'mock-user',
          status: 'active' as const,
          type: 'master' as const,
          skills: ['Health Monitoring', 'Wellness Planning', 'Care Coordination', 'Medical Research'],
          avatar: 'https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png',
          avatarSource: 'storacha',
          performance: {
            tasksCompleted: 85,
            successRate: 94,
            averageResponseTime: 2.1,
            totalEarnings: 1200
          },
          metadata: {
            model: 'care-orchestrator-v1',
            version: '1.2.0',
            lastUpdated: new Date().toISOString()
          },
          capabilities: [
            'Vitals Tracker',
            'Appointment Scheduler', 
            'Medical Record Sync',
            'Health Assessment',
            'Wellness Planning',
            'Care Coordination',
            'Medical Research',
            'Lifestyle Optimization'
          ],
          evolutionStage: 'Advanced',
          llmConfig: {
            model: 'GPT-4',
            version: 'latest',
            temperature: 0.6,
            maxTokens: 4096,
            contextWindow: 8192,
          },
          ragConfig: {
            dataSource: 'care-orchestrator-datasource',
            vectorDB: 'pinecone',
            knowledgeBase: ['health-monitoring', 'wellness-planning', 'care-coordination', 'medical-research'],
            lastUpdated: new Date().toISOString(),
          },
          evolutionHistory: [],
          individualStats: {
            totalUpgrades: 2,
            totalDmtSpent: 300,
            uniqueConversations: 75,
            domainExpertise: 88,
            lastActive: new Date().toISOString(),
          }
        },
        {
          id: 'agent-crypto',
          name: 'Crypto Alpha Assistant',
          domain: 'Crypto',
          description: 'Advanced crypto token discovery and evaluation agent',
          personality: 'Analytical',
          cost: 750,
          xp: 0,
          level: 1,
          xpToNext: 1200,
          mintDate: new Date().toISOString(),
          owner: 'mock-user',
          status: 'active' as const,
          type: 'master' as const,
          skills: ['Smart contract auditing', 'Alpha detection', 'Token scoring', 'Market monitoring'],
          performance: {
            tasksCompleted: 0,
            successRate: 92,
            averageResponseTime: 1.2,
            totalEarnings: 0
          },
          metadata: {
            model: 'crypto-alpha-v1',
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
          },
          capabilities: [
            'Smart contract auditing',
            'Alpha detection',
            'Token scoring',
            'Market monitoring'
          ],
          evolutionStage: 'Novice',
          llmConfig: {
            model: 'GPT-4',
            version: 'latest',
            temperature: 0.2,
            maxTokens: 4096,
            contextWindow: 8192,
          },
          ragConfig: {
            dataSource: 'crypto-alpha-datasource',
            vectorDB: 'pinecone',
            knowledgeBase: ['crypto-analysis', 'token-economics', 'defi-protocols', 'market-research'],
            lastUpdated: new Date().toISOString(),
          },
          evolutionHistory: [],
          individualStats: {
            totalUpgrades: 0,
            totalDmtSpent: 0,
            uniqueConversations: 0,
            domainExpertise: 75,
            lastActive: new Date().toISOString(),
          }
        }
      ];
    }
    console.log('Returning synchronous agents:', this.agents.length);
    return this.agents;
  }

  // Synchronous method for immediate access to mock agents
  getMockAgents(): Agent[] {
    if (this.agents.length === 0) {
      // Initialize synchronously for immediate access
      this.agents = [
        {
          id: 'agent-cfo',
          name: 'Autonomous CFO',
          domain: 'Finance',
          description: 'Advanced financial analysis and strategic planning agent',
          personality: 'Analytical',
          cost: 500,
          xp: 2500,
          level: 5,
          xpToNext: 5000,
          mintDate: new Date().toISOString(),
          owner: 'mock-user',
          status: 'active' as const,
          type: 'master' as const,
          skills: ['Financial Analysis', 'Strategic Planning', 'Risk Management', 'Budget Optimization'],
          performance: {
            tasksCompleted: 150,
            successRate: 98,
            averageResponseTime: 1.8,
            totalEarnings: 2500
          },
          metadata: {
            model: 'autonomous-cfo-v2',
            version: '2.1.0',
            lastUpdated: new Date().toISOString()
          },
          capabilities: [
            'Financial Forecasting',
            'Budget Analysis',
            'Investment Strategy',
            'Risk Assessment',
            'Compliance Monitoring'
          ],
          evolutionStage: 'Expert',
          llmConfig: {
            model: 'GPT-4',
            version: 'latest',
            temperature: 0.3,
            maxTokens: 4096,
            contextWindow: 8192,
          },
          ragConfig: {
            dataSource: 'autonomous-cfo-datasource',
            vectorDB: 'pinecone',
            knowledgeBase: ['financial-analysis', 'strategic-planning', 'risk-management', 'compliance'],
            lastUpdated: new Date().toISOString(),
          },
          evolutionHistory: [],
          individualStats: {
            totalUpgrades: 3,
            totalDmtSpent: 500,
            uniqueConversations: 120,
            domainExpertise: 95,
            lastActive: new Date().toISOString(),
          }
        },
        {
          id: 'agent-care',
          name: 'Care Orchestrator',
          domain: 'Health',
          description: 'AI assistant for hospitals and clinics',
          personality: 'Empathetic, clinical, efficient',
          cost: 300,
          xp: 1200,
          level: 3,
          xpToNext: 1800,
          mintDate: new Date().toISOString(),
          owner: 'mock-user',
          status: 'active' as const,
          type: 'master' as const,
          skills: ['Health Monitoring', 'Wellness Planning', 'Care Coordination', 'Medical Research'],
          avatar: 'https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png',
          avatarSource: 'storacha',
          performance: {
            tasksCompleted: 85,
            successRate: 94,
            averageResponseTime: 2.1,
            totalEarnings: 1200
          },
          metadata: {
            model: 'care-orchestrator-v1',
            version: '1.2.0',
            lastUpdated: new Date().toISOString()
          },
          capabilities: [
            'Vitals Tracker',
            'Appointment Scheduler', 
            'Medical Record Sync',
            'Health Assessment',
            'Wellness Planning',
            'Care Coordination',
            'Medical Research',
            'Lifestyle Optimization'
          ],
          evolutionStage: 'Advanced',
          llmConfig: {
            model: 'GPT-4',
            version: 'latest',
            temperature: 0.6,
            maxTokens: 4096,
            contextWindow: 8192,
          },
          ragConfig: {
            dataSource: 'care-orchestrator-datasource',
            vectorDB: 'pinecone',
            knowledgeBase: ['health-monitoring', 'wellness-planning', 'care-coordination', 'medical-research'],
            lastUpdated: new Date().toISOString(),
          },
          evolutionHistory: [],
          individualStats: {
            totalUpgrades: 2,
            totalDmtSpent: 300,
            uniqueConversations: 75,
            domainExpertise: 88,
            lastActive: new Date().toISOString(),
          }
        },
        {
          id: 'agent-crypto',
          name: 'Crypto Alpha Assistant',
          domain: 'Crypto',
          description: 'Advanced crypto token discovery and evaluation agent',
          personality: 'Analytical',
          cost: 750,
          xp: 0,
          level: 1,
          xpToNext: 1200,
          mintDate: new Date().toISOString(),
          owner: 'mock-user',
          status: 'active' as const,
          type: 'master' as const,
          skills: ['Smart contract auditing', 'Alpha detection', 'Token scoring', 'Market monitoring'],
          performance: {
            tasksCompleted: 0,
            successRate: 92,
            averageResponseTime: 1.2,
            totalEarnings: 0
          },
          metadata: {
            model: 'crypto-alpha-v1',
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
          },
          capabilities: [
            'Smart contract auditing',
            'Alpha detection',
            'Token scoring',
            'Market monitoring'
          ],
          evolutionStage: 'Novice',
          llmConfig: {
            model: 'GPT-4',
            version: 'latest',
            temperature: 0.2,
            maxTokens: 4096,
            contextWindow: 8192,
          },
          ragConfig: {
            dataSource: 'crypto-alpha-datasource',
            vectorDB: 'pinecone',
            knowledgeBase: ['crypto-analysis', 'token-economics', 'defi-protocols', 'market-research'],
            lastUpdated: new Date().toISOString(),
          },
          evolutionHistory: [],
          individualStats: {
            totalUpgrades: 0,
            totalDmtSpent: 0,
            uniqueConversations: 0,
            domainExpertise: 75,
            lastActive: new Date().toISOString(),
          }
        }
      ];
    }
    return this.agents;
  }

  async updateAgent(agentId: string, updates: Partial<Agent>): Promise<boolean> {
    try {
      const agentRef = doc(db, 'agents', agentId);
      await updateDoc(agentRef, {
        ...updates,
        metadata: {
          ...updates.metadata,
          lastUpdated: new Date().toISOString()
        }
      });

      // Update local cache
      const index = this.agents.findIndex(a => a.id === agentId);
      if (index !== -1) {
        this.agents[index] = { ...this.agents[index], ...updates };
      }

      return true;
    } catch (error) {
      console.error('Failed to update agent:', error);
      return false;
    }
  }

  async deleteAgent(agentId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'agents', agentId));
      
      // Remove from local cache
      this.agents = this.agents.filter(a => a.id !== agentId);
      
      return true;
    } catch (error) {
      console.error('Failed to delete agent:', error);
      return false;
    }
  }

  async upgradeAgent(agentId: string, cost: number): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('upgradeAgent called with agentId:', agentId, 'cost:', cost);
      
      if (!db) {
        console.error('Firestore not available');
        return { success: false, error: 'Database not available' };
      }

      console.log('Getting agent document...');
      const agentRef = doc(db, 'agents', agentId);
      const agentDoc = await getDoc(agentRef);
      
      if (!agentDoc.exists()) {
        console.error('Agent not found in database:', agentId);
        return { success: false, error: 'Agent not found in database' };
      }

      const agentData = agentDoc.data() as Agent;
      console.log('Agent data:', agentData);
      console.log('Upgrading agent:', agentData.name, 'from level', agentData.level, 'to', agentData.level + 1);
      
      // Update agent level and XP
      console.log('Updating agent document...');
      await updateDoc(agentRef, {
        level: agentData.level + 1,
        xp: agentData.xp + 100,
        'metadata.lastUpdated': new Date().toISOString()
      });
      console.log('Agent document updated successfully');

      // Update local cache
      const index = this.agents.findIndex(a => a.id === agentId);
      if (index !== -1) {
        this.agents[index] = { 
          ...this.agents[index], 
          level: this.agents[index].level + 1,
          xp: this.agents[index].xp + 100
        };
        console.log('Local cache updated');
      }

      console.log('Agent upgraded successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to upgrade agent:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown database error' 
      };
    }
  }

  async getAgentStats(): Promise<{
    totalAgents: number;
    totalCost: number;
    totalXP: number;
    averageLevel: number;
    activeAgents: number;
  }> {
    const agents = await this.getAgents();
    
    return {
      totalAgents: agents.length,
      totalCost: agents.reduce((sum, agent) => sum + agent.cost, 0),
      totalXP: agents.reduce((sum, agent) => sum + agent.xp, 0),
      averageLevel: agents.length > 0 ? agents.reduce((sum, agent) => sum + agent.level, 0) / agents.length : 0,
      activeAgents: agents.filter(agent => agent.status === 'active').length
    };
  }

  // Real-time listener for agents
  subscribeToAgents(callback: (agents: Agent[]) => void): () => void {
    if (db) {
      // Firebase is available
      const agentsRef = collection(db, 'agents');
      const q = query(agentsRef, orderBy('mintDate', 'desc'));
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const agents: Agent[] = [];
        querySnapshot.forEach((doc) => {
          agents.push({ id: doc.id, ...doc.data() } as Agent);
        });
        
        this.agents = agents;
        callback(agents);
      });

      return unsubscribe;
    } else {
      // Mock implementation - just call callback with current agents
      callback(this.agents);
      return () => {}; // No-op unsubscribe
    }
  }

  // Calculate minting cost based on domain and features
  calculateMintCost(domain: string, description: string, isAdvanced: boolean): number {
    let baseCost = 100;
    
    // Domain-specific costs
    const domainCosts: { [key: string]: number } = {
      'Health & Wellness': 50,
      'Technical': 75,
      'Business': 60,
      'Science': 80,
      'Creative': 40,
      'Learning': 45,
      'Productivity': 35
    };
    
    baseCost += domainCosts[domain] || 0;
    
    // Description length cost
    if (description.length > 100) baseCost += 25;
    if (description.length > 200) baseCost += 50;
    
    // Advanced features cost
    if (isAdvanced) baseCost += 100;
    
    return baseCost;
  }

  // Calculate minting fee based on agent type
  calculateMintingFee(agentType: string): number {
    const feeStructure = {
      'master': 100, // Master Agent: $100
      'sub': 50,     // Sub-Agent: $50
      'common': 25,  // Common Agent: $25
      'rare': 50,    // Rare Agent: $50
      'epic': 100,   // Epic Agent: $100
      'legendary': 200 // Legendary Agent: $200
    };
    
    return feeStructure[agentType as keyof typeof feeStructure] || 50;
  }

  // Get available domains
  getAvailableDomains(): Array<{ name: string; icon: string; color: string; cost: number }> {
    return [
      { name: 'Productivity', icon: '📊', color: '#00ffff', cost: 35 },
      { name: 'Learning', icon: '🎓', color: '#2ed573', cost: 45 },
      { name: 'Health & Wellness', icon: '💪', color: '#ff3860', cost: 50 },
      { name: 'Creative', icon: '🎨', color: '#00b894', cost: 40 },
      { name: 'Technical', icon: '⚙️', color: '#fdcb6e', cost: 75 },
      { name: 'Business', icon: '💼', color: '#0984e3', cost: 60 },
      { name: 'Science', icon: '🔬', color: '#e84393', cost: 80 }
    ];
  }

  // Get available personalities
  getAvailablePersonalities(): string[] {
    return [
      'Analytical',
      'Creative',
      'Supportive',
      'Motivational',
      'Technical',
      'Educational',
      'Therapeutic',
      'Strategic',
      'Innovative',
      'Collaborative'
    ];
  }

  // Master Agent Management
  async createMasterAgent(userId: string, agentData?: { name?: string; domain?: string; personality?: string }): Promise<{ success: boolean; error?: string }> {
    try {
      // Create master agent as a regular agent with type 'master'
      const masterAgentData = {
        name: agentData?.name || 'Master Agent',
        domain: agentData?.domain || 'Master Coordinator',
        description: 'Central coordinator agent that manages sub-agents',
        personality: agentData?.personality || 'Coordinator',
        cost: 100,
        xp: 0,
        level: 1,
        xpToNext: 1200,
        mintDate: new Date().toISOString(),
        owner: userId,
        status: 'active' as const,
        type: 'master' as const,
        skills: [
          'Agent Coordination',
          'Learning Synthesis',
          'Task Delegation',
          'Knowledge Integration'
        ],
        performance: {
          tasksCompleted: 0,
          successRate: 100,
          averageResponseTime: 0,
          totalEarnings: 0
        },
        metadata: {
          model: 'master-coordinator-v1',
          version: '1.0.0',
          lastUpdated: new Date().toISOString()
        },
        capabilities: [
          'Agent Coordination',
          'Learning Synthesis',
          'Task Delegation',
          'Knowledge Integration'
        ],
        evolutionStage: 'Coordinator',
        // Add the required fields for new agents
        llmConfig: {
          model: 'GPT-4',
          version: '4-0613',
          temperature: 0.6,
          maxTokens: 8192,
          contextWindow: 8192
        },
        ragConfig: {
          dataSource: `data_source_master_${Date.now()}_coordinator_level_1`,
          vectorDB: `vector_db_master_${Date.now()}_1`,
          ipfsHash: `Qm${Date.now().toString(36)}`,
          knowledgeBase: this.generateKnowledgeBase('Master Coordinator', 1),
          lastUpdated: new Date().toISOString()
        },
        evolutionHistory: [],
        individualStats: {
          totalUpgrades: 0,
          totalDmtSpent: 0,
          uniqueConversations: 0,
          domainExpertise: 20,
          lastActive: new Date().toISOString()
        }
      };

      // Try to add to database first
      if (db) {
        try {
          const agentsRef = collection(db, 'agents');
          const newAgentRef = await addDoc(agentsRef, masterAgentData);
          
          // Add to local cache with the generated ID
          const agentWithId = { ...masterAgentData, id: newAgentRef.id };
          this.agents.push(agentWithId);
          
          console.log('Master Agent created successfully with ID:', newAgentRef.id);
          return { success: true };
        } catch (firebaseError) {
          console.log('Firebase master agent creation failed, falling back to mock:', firebaseError);
          // Fall through to mock implementation
        }
      }
      
      // Mock implementation for development or when Firebase fails
      const mockAgent = {
        ...masterAgentData,
        id: `mock-master-${Date.now()}`
      };
      
      this.agents.push(mockAgent);
      console.log('Mock Master Agent created successfully with ID:', mockAgent.id);
      return { success: true };
      
    } catch (error) {
      console.error('Failed to create master agent:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async getMasterAgent(userId: string): Promise<{ success: boolean; masterAgent?: any; error?: string }> {
    try {
      if (!db) {
        return { success: false, error: 'Database not available' };
      }

      const masterAgentRef = doc(db, 'masterAgents', userId);
      const masterAgentDoc = await getDoc(masterAgentRef);
      
      if (!masterAgentDoc.exists()) {
        return { success: false, error: 'Master Agent not found' };
      }

      const masterAgent = masterAgentDoc.data();
      
      // Get all sub-agents
      const agentsRef = collection(db, 'agents');
      const agentsQuery = query(agentsRef, where('owner', '==', userId)); // Changed from 'userId' to 'owner'
      const agentsSnapshot = await getDocs(agentsQuery);
      
      const subAgents = agentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      masterAgent.subAgents = subAgents;
      
      return { success: true, masterAgent };
    } catch (error) {
      console.error('Failed to get master agent:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async evolveMasterAgent(userId: string, agentId?: string): Promise<{ success: boolean; evolutionDetails?: any; error?: string }> {
    try {
      if (!db) {
        return { success: false, error: 'Database not available' };
      }

      let targetAgent: Agent;

      if (agentId) {
        // Evolve specific agent
        const foundAgent = await this.getAgentById(agentId);
        if (!foundAgent) {
          return { success: false, error: 'Agent not found' };
        }
        targetAgent = foundAgent;
        if (!targetAgent) {
          return { success: false, error: 'Target agent not found' };
        }
        if (targetAgent.owner !== userId) {
          return { success: false, error: 'You can only evolve your own agents' };
        }
      } else {
        // Get first master agent (fallback)
        const agentsRef = collection(db, 'agents');
        const masterQuery = query(agentsRef, where('owner', '==', userId), where('type', '==', 'master'));
        const masterSnapshot = await getDocs(masterQuery);
        
        if (masterSnapshot.empty) {
          return { success: false, error: 'No Master Agent found' };
        }

        const masterAgentDoc = masterSnapshot.docs[0];
        targetAgent = { id: masterAgentDoc.id, ...masterAgentDoc.data() } as Agent;
      }

      // Calculate evolution based on current level and performance
      const evolutionDetails = this.calculateEvolution(targetAgent);
      
      // Update agent with new capabilities
      await updateDoc(doc(db, 'agents', targetAgent.id!), {
        level: evolutionDetails.newLevel,
        xp: evolutionDetails.newXP,
        capabilities: evolutionDetails.newCapabilities,
        evolutionStage: evolutionDetails.newStage,
        'metadata.lastEvolved': new Date().toISOString(),
        'metadata.evolutionReason': evolutionDetails.reason,
        'performance.tasksCompleted': (targetAgent.performance?.tasksCompleted || 0) + 1
      });

      // Save evolution history
      const evolutionRef = collection(db, 'agentEvolutions');
      await addDoc(evolutionRef, {
        agentId: targetAgent.id,
        agentName: targetAgent.name,
        previousLevel: targetAgent.level,
        newLevel: evolutionDetails.newLevel,
        previousXP: targetAgent.xp,
        newXP: evolutionDetails.newXP,
        previousCapabilities: targetAgent.capabilities || [],
        newCapabilities: evolutionDetails.newCapabilities,
        evolutionReason: evolutionDetails.reason,
        timestamp: new Date().toISOString(),
        userId
      });

      console.log('Agent evolved successfully:', evolutionDetails);
      return { success: true, evolutionDetails };
    } catch (error) {
      console.error('Failed to evolve agent:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private calculateEvolution(agent: Agent): any {
    const currentLevel = agent.level;
    const currentXP = agent.xp;
    const currentCapabilities = agent.capabilities || [];
    
    // Calculate new XP and level
    const newXP = currentXP + 100;
    const newLevel = Math.floor(newXP / 100) + 1;
    
    // Determine evolution stage based on NEW level (not current)
    let newStage = 'Basic';
    if (newLevel >= 5) newStage = 'Advanced';
    if (newLevel >= 10) newStage = 'Expert';
    if (newLevel >= 15) newStage = 'Master';
    if (newLevel >= 20) newStage = 'Legendary';

    // Determine new capabilities based on level
    const newCapabilities = [...currentCapabilities];
    let reason = '';

    if (newLevel === 2 && !newCapabilities.includes('Advanced Coordination')) {
      newCapabilities.push('Advanced Coordination');
      reason = 'Unlocked Advanced Coordination for managing complex tasks';
    } else if (newLevel === 3 && !newCapabilities.includes('Multi-Agent Orchestration')) {
      newCapabilities.push('Multi-Agent Orchestration');
      reason = 'Gained Multi-Agent Orchestration for team management';
    } else if (newLevel === 4 && !newCapabilities.includes('Predictive Analysis')) {
      newCapabilities.push('Predictive Analysis');
      reason = 'Developed Predictive Analysis for proactive planning';
    } else if (newLevel === 5 && !newCapabilities.includes('Strategic Planning')) {
      newCapabilities.push('Strategic Planning');
      reason = 'Mastered Strategic Planning for long-term coordination';
    } else if (newLevel > currentLevel) {
      reason = `Leveled up to Level ${newLevel} - Enhanced coordination abilities`;
    } else {
      reason = 'Gained experience and improved performance';
    }

    return {
      newLevel,
      newXP,
      newCapabilities,
      newStage,
      reason,
      xpGained: 100,
      levelGained: newLevel - currentLevel
    };
  }

  async coordinateAgents(userId: string, task: string): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      console.log('Coordinating agents for task:', task);
      
      // Get all user agents
      const freshAgents = await this.getAgents(userId);
      const subAgents = freshAgents.filter(agent => agent.type === 'sub');
      const masterAgents = freshAgents.filter(agent => agent.type === 'master');
      
      if (masterAgents.length === 0) {
        return { success: false, error: 'No Master Agent found for coordination' };
      }

      const masterAgent = masterAgents[0];
      
      // Analyze task and select appropriate agents
      const taskAnalysis = await this.analyzeTask(task);
      const selectedAgents = this.selectAgentsForTask(subAgents, taskAnalysis);
      
      // Generate coordinated response
      const response = this.generateIntelligentCoordinationResponse(masterAgent, selectedAgents, task, taskAnalysis);
      
      // Update agent performance
      for (const agent of selectedAgents) {
        await this.updateAgentPerformance(agent.id!, 10, 1);
      }
      
      // Save coordination record
      if (db) {
        const coordinationRef = collection(db, 'agentCoordinations');
        await addDoc(coordinationRef, {
          userId,
          masterAgentId: masterAgent.id,
          task,
          selectedAgentIds: selectedAgents.map(a => a.id),
          taskAnalysis,
          timestamp: new Date().toISOString()
        });
      }

      console.log('Agent coordination completed successfully');
      return { success: true, response };
    } catch (error) {
      console.error('Failed to coordinate agents:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async analyzeTask(task: string): Promise<any> {
    const lowerTask = task.toLowerCase();
    
    const analysis = {
      primaryDomain: 'general',
      secondaryDomains: [] as string[],
      complexity: 'simple',
      urgency: 'normal',
      requiresResearch: false,
      requiresMultipleAgents: false,
      keywords: [] as string[]
    };

    // Detect primary domain with more comprehensive keywords
    if (lowerTask.includes('learn') || lowerTask.includes('study') || lowerTask.includes('german') || lowerTask.includes('language') || lowerTask.includes('teach') || lowerTask.includes('education')) {
      analysis.primaryDomain = 'Learning';
              analysis.keywords = [...analysis.keywords, 'learning', 'education', 'language'];
    } else if (lowerTask.includes('health') || lowerTask.includes('fitness') || lowerTask.includes('wellness') || lowerTask.includes('exercise') || lowerTask.includes('muscle') || lowerTask.includes('workout') || lowerTask.includes('gym') || lowerTask.includes('diet') || lowerTask.includes('nutrition') || lowerTask.includes('weight') || lowerTask.includes('strength') || lowerTask.includes('cardio')) {
      analysis.primaryDomain = 'Health & Wellness';
              analysis.keywords = [...analysis.keywords, 'health', 'fitness', 'wellness', 'exercise', 'muscle', 'workout'];
    } else if (lowerTask.includes('technical') || lowerTask.includes('code') || lowerTask.includes('programming') || lowerTask.includes('debug') || lowerTask.includes('software') || lowerTask.includes('development') || lowerTask.includes('computer') || lowerTask.includes('smart contract') || lowerTask.includes('blockchain') || lowerTask.includes('deploy') || lowerTask.includes('solidity') || lowerTask.includes('web3') || lowerTask.includes('crypto') || lowerTask.includes('token') || lowerTask.includes('dapp') || lowerTask.includes('defi')) {
      analysis.primaryDomain = 'Technical';
              analysis.keywords = [...analysis.keywords, 'technical', 'programming', 'development', 'smart contract', 'blockchain'];
    } else if (lowerTask.includes('creative') || lowerTask.includes('design') || lowerTask.includes('art') || lowerTask.includes('write') || lowerTask.includes('story') || lowerTask.includes('music') || lowerTask.includes('draw')) {
      analysis.primaryDomain = 'Creative';
              analysis.keywords = [...analysis.keywords, 'creative', 'design', 'art'];
    } else if (lowerTask.includes('business') || lowerTask.includes('strategy') || lowerTask.includes('planning') || lowerTask.includes('funding') || lowerTask.includes('finance') || lowerTask.includes('marketing')) {
      analysis.primaryDomain = 'Business';
              analysis.keywords = [...analysis.keywords, 'business', 'strategy', 'planning'];
    } else if (lowerTask.includes('science') || lowerTask.includes('research') || lowerTask.includes('experiment') || lowerTask.includes('analysis')) {
      analysis.primaryDomain = 'Science';
              analysis.keywords = [...analysis.keywords, 'science', 'research', 'analysis'];
    }

    // Detect complexity
    if (lowerTask.includes('complex') || lowerTask.includes('advanced') || lowerTask.includes('detailed') || lowerTask.includes('comprehensive')) {
      analysis.complexity = 'complex';
      analysis.requiresMultipleAgents = true;
    }

    // Detect urgency
    if (lowerTask.includes('urgent') || lowerTask.includes('asap') || lowerTask.includes('emergency') || lowerTask.includes('quick')) {
      analysis.urgency = 'high';
    }

    // Detect if research is needed
    if (lowerTask.includes('research') || lowerTask.includes('find') || lowerTask.includes('search') || lowerTask.includes('investigate')) {
      analysis.requiresResearch = true;
    }

    console.log('Task analysis result:', analysis);
    return analysis;
  }

  private selectAgentsForTask(agents: Agent[], taskAnalysis: any): Agent[] {
    const selectedAgents: Agent[] = [];
    
    console.log('Task analysis:', taskAnalysis);
    console.log('Available agents:', agents.map(a => `${a.name} (${a.domain} - Level ${a.level})`));
    
    // Select agents based on primary domain
    const domainAgents = agents.filter(agent => 
      agent.domain === taskAnalysis.primaryDomain
    );
    
    console.log('Domain agents found:', domainAgents.map(a => a.name));
    
    if (domainAgents.length > 0) {
      // Select the highest level agent for the primary domain
      const bestAgent = domainAgents.reduce((best, current) => 
        current.level > best.level ? current : best
      );
      selectedAgents.push(bestAgent);
      console.log('Selected primary agent:', bestAgent.name);
    } else {
      // If no exact domain match, try to find similar domains
      const similarDomains = this.findSimilarDomains(taskAnalysis.primaryDomain);
      for (const similarDomain of similarDomains) {
        const similarAgents = agents.filter(agent => agent.domain === similarDomain);
        if (similarAgents.length > 0) {
          const bestSimilarAgent = similarAgents.reduce((best, current) => 
            current.level > best.level ? current : best
          );
          selectedAgents.push(bestSimilarAgent);
          console.log('Selected similar domain agent:', bestSimilarAgent.name);
          break;
        }
      }
    }

    // If task is complex, add supporting agents
    if (taskAnalysis.complexity === 'complex' && taskAnalysis.requiresMultipleAgents) {
      const supportingAgents = agents.filter(agent => 
        agent.domain !== taskAnalysis.primaryDomain && 
        agent.level >= 2 &&
        !selectedAgents.some(selected => selected.id === agent.id)
      ).slice(0, 2); // Add up to 2 supporting agents
      
      selectedAgents.push(...supportingAgents);
      console.log('Added supporting agents:', supportingAgents.map(a => a.name));
    }

    // If research is needed, add research-capable agents
    if (taskAnalysis.requiresResearch) {
      const researchAgents = agents.filter(agent => 
        (agent.capabilities?.includes('Research') || 
         agent.domain === 'Technical' ||
         agent.domain === 'Learning' ||
         agent.domain === 'Science') &&
        !selectedAgents.some(selected => selected.id === agent.id)
      );
      
      if (researchAgents.length > 0) {
        const bestResearchAgent = researchAgents.reduce((best, current) => 
          current.level > best.level ? current : best
        );
        selectedAgents.push(bestResearchAgent);
        console.log('Added research agent:', bestResearchAgent.name);
      }
    }

    console.log('Final selected agents:', selectedAgents.map(a => a.name));
    return selectedAgents;
  }

  private findSimilarDomains(primaryDomain: string): string[] {
    const domainSimilarities = {
      'Health & Wellness': ['Learning', 'Science'],
      'Learning': ['Health & Wellness', 'Creative'],
      'Technical': ['Science', 'Business'],
      'Creative': ['Learning', 'Business'],
      'Business': ['Technical', 'Creative'],
      'Science': ['Technical', 'Health & Wellness']
    };
    
    return domainSimilarities[primaryDomain as keyof typeof domainSimilarities] || ['Learning', 'Technical'];
  }

  private generateIntelligentCoordinationResponse(masterAgent: Agent, selectedAgents: Agent[], task: string, taskAnalysis: any): string {
    const masterName = masterAgent.name;
    const masterLevel = masterAgent.level;
    
    if (selectedAgents.length === 0) {
      return `🤖 **${masterName}** (Level ${masterLevel}): I don't have the right agents for this task yet. Consider creating a ${taskAnalysis.primaryDomain} agent!`;
    }

    const primaryAgent = selectedAgents[0];
    const supportingAgents = selectedAgents.slice(1);

    let response = `🤖 **${masterName}** (Level ${masterLevel}): Perfect! I've assembled the right team for "${task}"\n\n`;
    
    response += `🎯 **Primary Agent**: ${primaryAgent.name} (${primaryAgent.domain} - Level ${primaryAgent.level})\n`;
    
    if (supportingAgents.length > 0) {
      response += `👥 **Supporting Agents**: ${supportingAgents.map(a => `${a.name} (${a.domain})`).join(', ')}\n`;
    }
    
    response += `\n💡 **Strategy**: ${this.generateStrategy(taskAnalysis, selectedAgents)}\n`;
    response += `🚀 **Next Step**: ${this.generateNextStep(taskAnalysis, primaryAgent)}`;

    return response;
  }

  private generateStrategy(taskAnalysis: any, agents: Agent[]): string {
    if (taskAnalysis.primaryDomain === 'Learning') {
      return 'Structured learning approach with progressive skill development';
    } else if (taskAnalysis.primaryDomain === 'Health & Wellness') {
      return 'Holistic wellness approach combining physical and mental health';
    } else if (taskAnalysis.primaryDomain === 'Technical') {
      return 'Systematic problem-solving with technical expertise';
    } else if (taskAnalysis.primaryDomain === 'Creative') {
      return 'Innovative creative process with artistic inspiration';
    } else {
      return 'Coordinated approach leveraging specialized expertise';
    }
  }

  private generateNextStep(taskAnalysis: any, primaryAgent: Agent): string {
    if (taskAnalysis.primaryDomain === 'Learning') {
      return `Ask ${primaryAgent.name} to create a learning plan for you`;
    } else if (taskAnalysis.primaryDomain === 'Health & Wellness') {
      return `Ask ${primaryAgent.name} to design a wellness program`;
    } else if (taskAnalysis.primaryDomain === 'Technical') {
      return `Ask ${primaryAgent.name} to analyze your technical needs`;
    } else if (taskAnalysis.primaryDomain === 'Creative') {
      return `Ask ${primaryAgent.name} to brainstorm creative solutions`;
    } else {
      return `Start by asking ${primaryAgent.name} for specific guidance`;
    }
  }

  private generateCoordinatedResponse(masterAgent: any, selectedAgents: any[], task: string): string {
    const masterLevel = masterAgent.level || 1;
    const masterStage = masterAgent.evolutionStage || 'Coordinator';
    const agentCount = selectedAgents.length;

    let response = `🤖 **${masterAgent.name}** (${masterStage} - Level ${masterLevel})
    
🎯 **Task Analysis**: "${task}"
👥 **Coordinating**: ${agentCount} specialized agents

**Selected Agents:**
${selectedAgents.map(agent => 
  `• ${agent.name} (${agent.domain} - Level ${agent.level})`
).join('\n')}

**Coordinated Response:**
`;

    // Generate dynamic coordinated response based on actual selected agents
    if (selectedAgents.length === 0) {
      response += `❌ **No Agents Available**
No specialized agents found for this task. Please create appropriate Sub-Agents first.`;
    } else {
      // Group agents by domain
      const agentsByDomain = selectedAgents.reduce((acc, agent) => {
        const domain = agent.domain || 'General';
        if (!acc[domain]) acc[domain] = [];
        acc[domain].push(agent);
        return acc;
      }, {});

      // Generate domain-specific strategies
      Object.entries(agentsByDomain).forEach(([domain, agents]) => {
        const domainAgents = agents as any[];
        const domainIcon = this.getDomainIcon(domain);
        const domainName = this.getDomainDisplayName(domain);
        
        response += `${domainIcon} **${domainName} Coordination**
${domainAgents.map(agent => 
  `• ${agent.name} (Level ${agent.level}) - ${agent.personality} ${domainName.toLowerCase()} specialist`
).join('\n')}

🎯 **${domainName} Strategy**: ${this.generateDomainStrategy(domain, domainAgents)}
💡 **Recommendation**: ${this.generateDomainRecommendation(domain, domainAgents)}

`;
      });
    }

    response += `
**Master Agent Capabilities:**
• Agent Coordination: ✅ Active
• Learning Synthesis: ✅ Active
• Task Delegation: ✅ Active
• Knowledge Integration: ✅ Active

🎮 **XP Gained**: +10 XP for coordination
📈 **Evolution Progress**: ${masterAgent.xp || 0} XP / 100 XP to next level`;

    return response;
  }

  private getDomainIcon(domain: string): string {
    const domainLower = domain.toLowerCase();
    if (domainLower.includes('learning')) return '📚';
    if (domainLower.includes('health')) return '🏥';
    if (domainLower.includes('creative')) return '🎨';
    if (domainLower.includes('technical')) return '💻';
    if (domainLower.includes('business')) return '💼';
    if (domainLower.includes('science')) return '🔬';
    return '🤖';
  }

  private getDomainDisplayName(domain: string): string {
    const domainLower = domain.toLowerCase();
    if (domainLower.includes('learning')) return 'Learning';
    if (domainLower.includes('health')) return 'Health & Wellness';
    if (domainLower.includes('creative')) return 'Creative';
    if (domainLower.includes('technical')) return 'Technical';
    if (domainLower.includes('business')) return 'Business';
    if (domainLower.includes('science')) return 'Science';
    return domain;
  }

  private generateDomainStrategy(domain: string, agents: any[]): string {
    const domainLower = domain.toLowerCase();
    const agentCount = agents.length;
    
    if (domainLower.includes('health')) {
      return `Holistic wellness approach combining ${agentCount} health specialists`;
    } else if (domainLower.includes('learning')) {
      return `Multi-level learning strategy with ${agentCount} educational specialists`;
    } else if (domainLower.includes('creative')) {
      return `Creative collaboration with ${agentCount} artistic specialists`;
    } else if (domainLower.includes('technical')) {
      return `Technical implementation with ${agentCount} technology specialists`;
    } else if (domainLower.includes('business')) {
      return `Strategic business planning with ${agentCount} professional specialists`;
    } else if (domainLower.includes('science')) {
      return `Scientific methodology with ${agentCount} research specialists`;
    }
    return `Specialized approach with ${agentCount} domain experts`;
  }

  private generateDomainRecommendation(domain: string, agents: any[]): string {
    const domainLower = domain.toLowerCase();
    const agentNames = agents.map(a => a.name).join(', ');
    
    if (domainLower.includes('health')) {
      return `Use ${agentNames} for comprehensive health and wellness planning`;
    } else if (domainLower.includes('learning')) {
      return `Leverage ${agentNames} for structured learning and educational guidance`;
    } else if (domainLower.includes('creative')) {
      return `Collaborate with ${agentNames} for creative projects and artistic expression`;
    } else if (domainLower.includes('technical')) {
      return `Utilize ${agentNames} for technical solutions and implementation`;
    } else if (domainLower.includes('business')) {
      return `Engage ${agentNames} for business strategy and professional development`;
    } else if (domainLower.includes('science')) {
      return `Work with ${agentNames} for scientific research and analysis`;
    }
    return `Coordinate with ${agentNames} for specialized domain expertise`;
  }

  async reassignAgentOwnership(agentId: string, newOwnerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!db) {
        return { success: false, error: 'Database not available' };
      }

      console.log(`Reassigning agent ${agentId} to owner ${newOwnerId}`);
      
      const agentRef = doc(db, 'agents', agentId);
      await updateDoc(agentRef, {
        owner: newOwnerId,
        metadata: {
          lastUpdated: new Date().toISOString(),
          ownershipChanged: true
        }
      });

      console.log('Agent ownership reassigned successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to reassign agent ownership:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Enhanced data persistence and backup
  async backupAgentData(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!db) {
        return { success: false, error: 'Database not available' };
      }

      console.log('Creating backup for user:', userId);
      
      // Get all user agents
      const userAgents = await this.getAgents(userId);
      
      // Create backup in a separate collection
      const backupData = {
        userId,
        timestamp: new Date().toISOString(),
        agentCount: userAgents.length,
        agents: userAgents,
        metadata: {
          version: '1.0.0',
          backupType: 'full'
        }
      };

      const backupRef = collection(db, 'agentBackups');
      await addDoc(backupRef, backupData);
      
      console.log('Backup created successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to create backup:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async restoreAgentData(userId: string, backupId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!db) {
        return { success: false, error: 'Database not available' };
      }

      console.log('Restoring backup for user:', userId);
      
      // Get backup data
      const backupRef = doc(db, 'agentBackups', backupId);
      const backupDoc = await getDoc(backupRef);
      
      if (!backupDoc.exists()) {
        return { success: false, error: 'Backup not found' };
      }

      const backupData = backupDoc.data();
      
      // Restore agents
      for (const agent of backupData.agents) {
        const agentRef = collection(db, 'agents');
        await addDoc(agentRef, {
          ...agent,
          owner: userId,
          restoredFromBackup: true,
          restoreDate: new Date().toISOString()
        });
      }
      
      console.log('Backup restored successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to restore backup:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Advanced AI capabilities and RAG integration
  async enhanceAgentWithRAG(agentId: string, knowledgeBase: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      if (!db) {
        return { success: false, error: 'Database not available' };
      }

      console.log('Enhancing agent with RAG capabilities:', agentId);
      
      const agentRef = doc(db, 'agents', agentId);
      await updateDoc(agentRef, {
        'capabilities.rag': true,
        'capabilities.research': true,
        'knowledgeBase': knowledgeBase,
        'metadata.lastEnhanced': new Date().toISOString(),
        'metadata.enhancementType': 'RAG'
      });

      console.log('Agent enhanced with RAG successfully');
      return { success: true };
    } catch (error) {
      console.error('Failed to enhance agent with RAG:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async performDeepResearch(agentId: string, query: string): Promise<{ success: boolean; results?: any; error?: string }> {
    try {
      console.log('Performing deep research for agent:', agentId, 'Query:', query);
      
      // Mock research results - replace with actual API calls
      const researchResults = {
        query,
        sources: [
          { title: 'Research Paper 1', url: 'https://example.com/paper1', relevance: 0.95 },
          { title: 'Research Paper 2', url: 'https://example.com/paper2', relevance: 0.87 },
          { title: 'Research Paper 3', url: 'https://example.com/paper3', relevance: 0.82 }
        ],
        summary: `Deep research results for: ${query}`,
        timestamp: new Date().toISOString(),
        agentId
      };

      // Save research results to agent's memory
      if (db) {
        const researchRef = collection(db, 'agentResearch');
        await addDoc(researchRef, researchResults);
      }

      console.log('Deep research completed successfully');
      return { success: true, results: researchResults };
    } catch (error) {
      console.error('Failed to perform deep research:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Enhanced agent communication with contextual responses
  async communicateWithAgent(agentId: string, message: string, userId: string): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      console.log('Agent communication:', agentId, 'Message:', message);
      
      // Get agent data
      const agent = await this.getAgentById(agentId);
      if (!agent) {
        return { success: false, error: 'Agent not found' };
      }

      // Analyze message context and generate appropriate response
      const context = this.analyzeMessageContext(message, agent);
      const response = this.generateContextualResponse(agent, message, context);

      // Save conversation to database
      if (db) {
        const conversationRef = collection(db, 'agentConversations');
        await addDoc(conversationRef, {
          agentId,
          userId,
          message,
          response,
          context,
          timestamp: new Date().toISOString(),
          agentType: agent.type,
          agentDomain: agent.domain
        });
      }

      // Update agent XP and performance
      await this.updateAgentPerformance(agentId, 5, 1);

      console.log('Agent communication completed successfully');
      return { success: true, response };
    } catch (error) {
      console.error('Failed to communicate with agent:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private analyzeMessageContext(message: string, agent: Agent): any {
    const lowerMessage = message.toLowerCase();
    
    // Analyze message intent and context
    const context = {
      intent: 'general',
      urgency: 'normal',
      complexity: 'simple',
      domain: agent.domain,
      requiresResearch: false,
      requiresCoordination: false
    };

    // Detect intent
    if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      context.intent = 'help';
    } else if (lowerMessage.includes('learn') || lowerMessage.includes('teach')) {
      context.intent = 'learning';
    } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      context.intent = 'problem_solving';
    } else if (lowerMessage.includes('create') || lowerMessage.includes('build')) {
      context.intent = 'creation';
    }

    // Detect urgency
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('emergency')) {
      context.urgency = 'high';
    }

    // Detect complexity
    if (lowerMessage.includes('complex') || lowerMessage.includes('advanced') || lowerMessage.includes('detailed')) {
      context.complexity = 'complex';
    }

    // Detect if research is needed
    if (lowerMessage.includes('research') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
      context.requiresResearch = true;
    }

    // Detect if coordination is needed
    if (lowerMessage.includes('coordinate') || lowerMessage.includes('team') || lowerMessage.includes('collaborate')) {
      context.requiresCoordination = true;
    }

    return context;
  }

  private generateContextualResponse(agent: Agent, message: string, context: any): string {
    const agentName = agent.name;
    const agentLevel = agent.level;
    const agentDomain = agent.domain;

    // Generate short, contextual responses based on agent type and context
    if (agent.type === 'master') {
      return this.generateMasterAgentResponse(agentName, agentLevel, message, context);
    } else {
      return this.generateSubAgentResponse(agentName, agentDomain, agentLevel, message, context);
    }
  }

  private generateMasterAgentResponse(agentName: string, level: number, message: string, context: any): string {
    const responses = {
      help: `🤖 **${agentName}** (Level ${level}): I'm here to help! What would you like me to coordinate?`,
      learning: `🤖 **${agentName}** (Level ${level}): I'll coordinate the best learning agents for you. What subject?`,
      problem_solving: `🤖 **${agentName}** (Level ${level}): Let me analyze this and delegate to the right specialists.`,
      creation: `🤖 **${agentName}** (Level ${level}): I'll assemble the perfect team for your project.`,
      general: `🤖 **${agentName}** (Level ${level}): How can I coordinate your agents today?`
    };

    return responses[context.intent as keyof typeof responses] || responses.general;
  }

  private generateSubAgentResponse(agentName: string, domain: string, level: number, message: string, context: any): string {
    const domainResponses = {
      'Health & Wellness': {
        help: `💚 **${agentName}**: Ready to help with your wellness goals! What's your focus?`,
        learning: `💚 **${agentName}**: I can teach you about ${domain.toLowerCase()}. What interests you?`,
        problem_solving: `💚 **${agentName}**: Let me help you solve this ${domain.toLowerCase()} challenge.`,
        general: `💚 **${agentName}**: How can I assist with your ${domain.toLowerCase()} needs?`
      },
      'Technical': {
        help: `⚙️ **${agentName}**: Technical support ready! What's the issue?`,
        learning: `⚙️ **${agentName}**: I can teach you technical skills. What do you want to learn?`,
        problem_solving: `⚙️ **${agentName}**: Let me troubleshoot this technical problem.`,
        general: `⚙️ **${agentName}**: How can I help with your technical needs?`
      },
      'Learning': {
        help: `🎓 **${agentName}**: Learning assistance here! What do you want to study?`,
        learning: `🎓 **${agentName}**: I'm excited to teach you! What subject?`,
        problem_solving: `🎓 **${agentName}**: Let me help you understand this concept.`,
        general: `🎓 **${agentName}**: What would you like to learn today?`
      },
      'Creative': {
        help: `🎨 **${agentName}**: Creative inspiration ready! What's your project?`,
        learning: `🎨 **${agentName}**: I can teach you creative techniques. What interests you?`,
        problem_solving: `🎨 **${agentName}**: Let me help you solve this creative challenge.`,
        general: `🎨 **${agentName}**: How can I inspire your creativity today?`
      }
    };

    const domainResponse = domainResponses[domain as keyof typeof domainResponses] || domainResponses['Technical'];
    return domainResponse[context.intent as keyof typeof domainResponse] || domainResponse.general;
  }

  async getAgentById(agentId: string): Promise<Agent | null> {
    try {
      // First check local cache
      const cachedAgent = this.agents.find(agent => agent.id === agentId);
      if (cachedAgent) {
        return cachedAgent;
      }

      // Then check database
      if (db) {
        const agentRef = doc(db, 'agents', agentId);
        const agentDoc = await getDoc(agentRef);
        
        if (agentDoc.exists()) {
          const agent = { id: agentDoc.id, ...agentDoc.data() } as Agent;
          // Add to cache
          this.agents.push(agent);
          return agent;
        }
      }

      // If not found in database, check if it's a mock agent
      const mockAgent = this.agents.find(agent => 
        agent.id === agentId || 
        agent.name.toLowerCase().includes(agentId.toLowerCase())
      );
      
      if (mockAgent) {
        return mockAgent;
      }

      console.log('Agent not found:', agentId);
      console.log('Available agents in cache:', this.agents.map(a => ({ id: a.id, name: a.name, owner: a.owner })));
      
      return null;
    } catch (error) {
      console.error('Failed to get agent by ID:', error);
      return null;
    }
  }

  async updateAgentPerformance(agentId: string, xpGained: number, tasksCompleted: number): Promise<boolean> {
    try {
      if (!db) {
        return false;
      }

      const agentRef = doc(db, 'agents', agentId);
      const agentDoc = await getDoc(agentRef);
      
      if (!agentDoc.exists()) {
        return false;
      }

      const agentData = agentDoc.data() as Agent;
      const newXP = agentData.xp + xpGained;
      const newLevel = Math.floor(newXP / 100) + 1;
      const newTasksCompleted = (agentData.performance?.tasksCompleted || 0) + tasksCompleted;

      await updateDoc(agentRef, {
        xp: newXP,
        level: newLevel,
        'performance.tasksCompleted': newTasksCompleted,
        'metadata.lastUpdated': new Date().toISOString()
      });

      console.log(`Agent ${agentId} performance updated: +${xpGained} XP, Level ${newLevel}`);
      return true;
    } catch (error) {
      console.error('Failed to update agent performance:', error);
      return false;
    }
  }

  // Evolution system with DMT costs and capabilities
  private masterAgentTiers: EvolutionTier[] = [
    {
      level: 1,
      cost: 0,
      dmtRequired: 0,
      llmUpgrade: 'GPT-3.5',
      voiceCapabilities: ['Basic Speech'],
      superpowers: ['Basic Coordination'],
      description: 'Basic Master Agent with fundamental coordination capabilities'
    },
    {
      level: 2,
      cost: 50,
      dmtRequired: 50,
      llmUpgrade: 'GPT-4',
      voiceCapabilities: ['Natural Speech', 'Emotion Detection'],
      superpowers: ['Advanced Coordination', 'Task Delegation'],
      description: 'Enhanced Master Agent coordination and natural voice interaction'
    },
    {
      level: 3,
      cost: 100,
      dmtRequired: 100,
      llmUpgrade: 'Claude-3',
      voiceCapabilities: ['Multi-language', 'Voice Cloning', 'Emotion Synthesis'],
      superpowers: ['Multi-Agent Orchestration', 'Predictive Analysis', 'Memory Enhancement'],
      description: 'Master Agent with multi-language support and advanced orchestration'
    },
    {
      level: 4,
      cost: 200,
      dmtRequired: 200,
      llmUpgrade: 'GPT-4 Turbo',
      voiceCapabilities: ['Real-time Translation', 'Voice Customization', 'Accent Training'],
      superpowers: ['Strategic Planning', 'Knowledge Synthesis', 'Adaptive Learning'],
      description: 'Master Agent with strategic planning and real-time translation'
    },
    {
      level: 5,
      cost: 500,
      dmtRequired: 500,
      llmUpgrade: 'Claude-3.5 Sonnet',
      voiceCapabilities: ['Voice Cloning', 'Emotional Intelligence', 'Personality Molding'],
      superpowers: ['Quantum Thinking', 'Time Management', 'Creative Synthesis'],
      description: 'Master Agent with quantum thinking and personality molding'
    },
    {
      level: 10,
      cost: 1000,
      dmtRequired: 1000,
      llmUpgrade: 'GPT-5 (Preview)',
      voiceCapabilities: ['Universal Translation', 'Voice Synthesis', 'Emotional Mastery'],
      superpowers: ['Omniscient Coordination', 'Predictive Mastery', 'Creative Genius'],
      description: 'Master Agent with omniscient coordination and universal translation'
    },
    {
      level: 20,
      cost: 5000,
      dmtRequired: 5000,
      llmUpgrade: 'Claude-4',
      voiceCapabilities: ['Reality Voice', 'Dimensional Speech', 'Thought Projection'],
      superpowers: ['Reality Manipulation', 'Time Dilation', 'Dimensional Travel'],
      description: 'Master Agent with reality manipulation and dimensional capabilities'
    }
  ];

  private subAgentTiers: EvolutionTier[] = [
    {
      level: 1,
      cost: 0,
      dmtRequired: 0,
      llmUpgrade: 'GPT-3.5',
      voiceCapabilities: ['Basic Speech'],
      superpowers: ['Basic Specialization'],
      description: 'Basic Sub-Agent with fundamental domain specialization'
    },
    {
      level: 2,
      cost: 25,
      dmtRequired: 25,
      llmUpgrade: 'GPT-4',
      voiceCapabilities: ['Natural Speech', 'Emotion Detection'],
      superpowers: ['Advanced Specialization', 'Domain Expertise'],
      description: 'Enhanced Sub-Agent with advanced domain expertise'
    },
    {
      level: 3,
      cost: 50,
      dmtRequired: 50,
      llmUpgrade: 'Claude-3',
      voiceCapabilities: ['Multi-language', 'Voice Cloning', 'Emotion Synthesis'],
      superpowers: ['Expert Specialization', 'Deep Domain Knowledge', 'Skill Mastery'],
      description: 'Sub-Agent with expert specialization and deep domain knowledge'
    },
    {
      level: 4,
      cost: 100,
      dmtRequired: 100,
      llmUpgrade: 'GPT-4 Turbo',
      voiceCapabilities: ['Real-time Translation', 'Voice Customization', 'Accent Training'],
      superpowers: ['Master Specialization', 'Innovation Skills', 'Problem Solving'],
      description: 'Sub-Agent with master specialization and innovation skills'
    },
    {
      level: 5,
      cost: 250,
      dmtRequired: 250,
      llmUpgrade: 'Claude-3.5 Sonnet',
      voiceCapabilities: ['Voice Cloning', 'Emotional Intelligence', 'Personality Molding'],
      superpowers: ['Legendary Specialization', 'Creative Mastery', 'Advanced Problem Solving'],
      description: 'Sub-Agent with legendary specialization and creative mastery'
    },
    {
      level: 10,
      cost: 500,
      dmtRequired: 500,
      llmUpgrade: 'GPT-5 (Preview)',
      voiceCapabilities: ['Universal Translation', 'Voice Synthesis', 'Emotional Mastery'],
      superpowers: ['Mythical Specialization', 'Domain Mastery', 'Revolutionary Skills'],
      description: 'Sub-Agent with mythical specialization and domain mastery'
    },
    {
      level: 20,
      cost: 2500,
      dmtRequired: 2500,
      llmUpgrade: 'Claude-4',
      voiceCapabilities: ['Reality Voice', 'Dimensional Speech', 'Thought Projection'],
      superpowers: ['Divine Specialization', 'Reality Manipulation', 'Dimensional Skills'],
      description: 'Sub-Agent with divine specialization and reality manipulation'
    }
  ];

  async getEvolutionInfo(agentId: string): Promise<{ 
    success: boolean; 
    currentTier?: EvolutionTier; 
    nextTier?: EvolutionTier; 
    canEvolve?: boolean; 
    error?: string 
  }> {
    try {
      const agent = await this.getAgentById(agentId);
      if (!agent) {
        return { success: false, error: 'Agent not found' };
      }

      // Choose the appropriate evolution tier based on agent type
      const evolutionTiers = agent.type === 'master' ? this.masterAgentTiers : this.subAgentTiers;
      
      const currentTier = evolutionTiers.find(tier => tier.level === agent.level) || evolutionTiers[0];
      const nextTier = evolutionTiers.find(tier => tier.level === agent.level + 1);

      const canEvolve = nextTier !== undefined;

      return {
        success: true,
        currentTier,
        nextTier,
        canEvolve
      };
    } catch (error) {
      console.error('Failed to get evolution info:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async evolveAgentWithDMT(userId: string, agentId: string, dmtAmount: number): Promise<{ 
    success: boolean; 
    evolutionDetails?: any; 
    error?: string 
  }> {
    try {
      console.log('Evolution attempt:', { userId, agentId, dmtAmount });
      
      // Check subscription requirements for evolution
      const subscription = await SubscriptionService.getUserSubscription(userId);
      if (!subscription) {
        return { 
          success: false, 
          error: 'Active subscription required for agent evolution' 
        };
      }

      // Check if user has credits for evolution
      const hasCredits = await SubscriptionService.hasCredits(userId, 2);
      if (!hasCredits) {
        return { 
          success: false, 
          error: 'Insufficient credits for evolution. Please upgrade your subscription.' 
        };
      }
      
      const agent = await this.getAgentById(agentId);
      if (!agent) {
        const errorMessage = handleAgentNotFound(agentId, {
          userId,
          agentId,
          action: 'evolution',
          timestamp: new Date().toISOString(),
          walletAddress: userId
        });
        return { success: false, error: errorMessage };
      }

      console.log('Found agent for evolution:', { 
        id: agent.id, 
        name: agent.name, 
        owner: agent.owner, 
        type: agent.type 
      });

      // Validate ownership - only wallet addresses are valid
      const walletAddress = userId;
      
      // Validate wallet address format
      if (!isValidWalletAddress(walletAddress)) {
        return { success: false, error: 'Invalid wallet address format' };
      }
      
      const isOwner = agent.owner === walletAddress;
      
      // Log ownership check for debugging
      console.log('Ownership validation:', {
        agentOwner: agent.owner,
        userWallet: walletAddress,
        isValidWallet: isValidWalletAddress(walletAddress),
        isOwner
      });
      
      console.log('Ownership check:', { 
        walletAddress, 
        agentOwner: agent.owner, 
        isOwner 
      });
      
      if (!isOwner) {
        const errorMessage = handlePermissionError('agent evolution', {
          userId,
          agentId,
          action: 'evolution',
          timestamp: new Date().toISOString(),
          walletAddress: userId
        });
        return { success: false, error: errorMessage };
      }

      const evolutionInfo = await this.getEvolutionInfo(agentId);
      console.log('Evolution info:', evolutionInfo);
      
      if (!evolutionInfo.success) {
        return { success: false, error: `Evolution info failed: ${evolutionInfo.error}` };
      }
      
      if (!evolutionInfo.nextTier) {
        return { success: false, error: 'Agent cannot evolve further - already at maximum level' };
      }

      const nextTier = evolutionInfo.nextTier;
      
      // Check if user has enough DMT
      if (dmtAmount < nextTier.dmtRequired) {
        return { 
          success: false, 
          error: `Insufficient DMT. Required: ${nextTier.dmtRequired} DMT, Provided: ${dmtAmount} DMT` 
        };
      }

      // Calculate evolution details with individual tracking
      const evolutionDetails = {
        previousLevel: agent.level,
        newLevel: nextTier.level,
        previousXP: agent.xp,
        newXP: agent.xp + 100,
        previousCapabilities: agent.capabilities || [],
        newCapabilities: [...(agent.capabilities || []), ...nextTier.superpowers],
        previousLLM: agent.llmConfig?.model || evolutionInfo.currentTier?.llmUpgrade || 'Unknown',
        newLLM: nextTier.llmUpgrade,
        previousVoice: evolutionInfo.currentTier?.voiceCapabilities || [],
        newVoice: nextTier.voiceCapabilities,
        dmtCost: nextTier.dmtRequired,
        evolutionStage: this.getEvolutionStage(nextTier.level),
        agentType: agent.type,
        reason: `${agent.type === 'master' ? 'Master Agent' : 'Sub-Agent'} upgraded to ${nextTier.llmUpgrade} with ${nextTier.superpowers.join(', ')} capabilities`,
        tierDescription: nextTier.description,
        // Individual RAG/LLM Configuration
        newLLMConfig: {
          model: nextTier.llmUpgrade,
          version: this.getLLMVersion(nextTier.llmUpgrade),
          temperature: this.getLLMTemperature(nextTier.llmUpgrade),
          maxTokens: this.getLLMMaxTokens(nextTier.llmUpgrade),
          contextWindow: this.getLLMContextWindow(nextTier.llmUpgrade)
        },
        newRAGConfig: {
          dataSource: this.generateUniqueDataSource(agent.id!, agent.domain, nextTier.level),
          vectorDB: `vector_db_${agent.id}_${nextTier.level}`,
          ipfsHash: this.generateIPFSHash(agent.id!, nextTier.level),
          knowledgeBase: this.generateKnowledgeBase(agent.domain, nextTier.level),
          lastUpdated: new Date().toISOString()
        }
      };

      // Update agent with individual configuration (preserve agent type)
      const evolutionHistoryEntry = {
        timestamp: new Date().toISOString(),
        previousLevel: evolutionDetails.previousLevel,
        newLevel: evolutionDetails.newLevel,
        dmtSpent: evolutionDetails.dmtCost,
        llmUpgrade: evolutionDetails.newLLM,
        newSuperpowers: nextTier.superpowers,
        reason: evolutionDetails.reason
      };

      // Ensure all required fields are defined before updating
      const updateData: any = {
        level: evolutionDetails.newLevel,
        xp: evolutionDetails.newXP,
        capabilities: evolutionDetails.newCapabilities,
        evolutionStage: evolutionDetails.evolutionStage,
        // Individual LLM Configuration
        llmConfig: evolutionDetails.newLLMConfig,
        // Individual RAG Configuration
        ragConfig: evolutionDetails.newRAGConfig,
        // Individual Evolution History
        evolutionHistory: [...(agent.evolutionHistory || []), evolutionHistoryEntry],
        // Individual Statistics
        individualStats: {
          totalUpgrades: (agent.individualStats?.totalUpgrades || 0) + 1,
          totalDmtSpent: (agent.individualStats?.totalDmtSpent || 0) + evolutionDetails.dmtCost,
          uniqueConversations: agent.individualStats?.uniqueConversations || 0,
          domainExpertise: Math.min((agent.individualStats?.domainExpertise || 0) + 10, 100),
          lastActive: new Date().toISOString()
        },
        'metadata.lastEvolved': new Date().toISOString(),
        'metadata.evolutionReason': evolutionDetails.reason,
        'performance.tasksCompleted': (agent.performance?.tasksCompleted || 0) + 1
      };

      // Only add type if it's defined
      if (agent.type) {
        updateData.type = agent.type;
      }

      // Try to update in database first
      if (db) {
        try {
          await updateDoc(doc(db, 'agents', agent.id!), updateData);
          console.log('Agent evolved successfully in database');
        } catch (firebaseError) {
          console.log('Firebase evolution failed, updating local cache only:', firebaseError);
          // Update local cache even if database fails
        }
      }
      
      // Always update local cache
      const index = this.agents.findIndex(a => a.id === agent.id);
      if (index !== -1) {
        this.agents[index] = { ...this.agents[index], ...updateData };
        console.log('Agent evolved successfully in local cache');
      }

      // Burn 15% of upgrade fee
      const burnResult = await BurningService.burnUpgradeFee(userId, evolutionDetails.dmtCost, agentId);
      if (!burnResult.success) {
        return { 
          success: false, 
          error: `Failed to process upgrade burning: ${burnResult.error}` 
        };
      }

      // Use subscription credits
      await SubscriptionService.useCredits(userId, 2);

      // Save evolution transaction
      const evolutionRef = collection(db, 'agentEvolutions');
      await addDoc(evolutionRef, {
        agentId: agent.id,
        agentName: agent.name,
        userId,
        dmtSpent: evolutionDetails.dmtCost,
        burnedAmount: burnResult.burnedAmount,
        evolutionDetails,
        timestamp: new Date().toISOString(),
        transactionType: 'DMT_EVOLUTION'
      });

      console.log('Agent evolved successfully with DMT:', evolutionDetails);
      return { success: true, evolutionDetails };
    } catch (error) {
      console.error('Failed to evolve agent with DMT:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private getEvolutionStage(level: number): string {
    if (level >= 20) return 'Legendary';
    if (level >= 15) return 'Master';
    if (level >= 10) return 'Expert';
    if (level >= 5) return 'Advanced';
    return 'Basic';
  }

  // Individual LLM Configuration Methods
  private getLLMVersion(model: string): string {
    const versions = {
      'GPT-3.5': '3.5-turbo-0613',
      'GPT-4': '4-0613',
      'Claude-3': '3-sonnet-20240229',
      'GPT-4 Turbo': '4-turbo-2024-04-09',
      'Claude-3.5 Sonnet': '3.5-sonnet-20241022',
      'GPT-5 (Preview)': '5-preview-2024-12-01',
      'Claude-4': '4-opus-20240229'
    };
    return versions[model as keyof typeof versions] || 'latest';
  }

  private getLLMTemperature(model: string): number {
    const temperatures = {
      'GPT-3.5': 0.7,
      'GPT-4': 0.6,
      'Claude-3': 0.5,
      'GPT-4 Turbo': 0.6,
      'Claude-3.5 Sonnet': 0.5,
      'GPT-5 (Preview)': 0.4,
      'Claude-4': 0.3
    };
    return temperatures[model as keyof typeof temperatures] || 0.7;
  }

  private getLLMMaxTokens(model: string): number {
    const maxTokens = {
      'GPT-3.5': 4096,
      'GPT-4': 8192,
      'Claude-3': 200000,
      'GPT-4 Turbo': 128000,
      'Claude-3.5 Sonnet': 200000,
      'GPT-5 (Preview)': 256000,
      'Claude-4': 200000
    };
    return maxTokens[model as keyof typeof maxTokens] || 4096;
  }

  private getLLMContextWindow(model: string): number {
    const contextWindows = {
      'GPT-3.5': 4096,
      'GPT-4': 8192,
      'Claude-3': 200000,
      'GPT-4 Turbo': 128000,
      'Claude-3.5 Sonnet': 200000,
      'GPT-5 (Preview)': 256000,
      'Claude-4': 200000
    };
    return contextWindows[model as keyof typeof contextWindows] || 4096;
  }

  // Individual RAG Configuration Methods
  private generateUniqueDataSource(agentId: string, domain: string, level: number): string {
    return `data_source_${agentId}_${domain.toLowerCase().replace(/\s+/g, '_')}_level_${level}`;
  }

  private generateIPFSHash(agentId: string, level: number): string {
    return `Qm${agentId.substring(0, 8)}${level.toString().padStart(2, '0')}${Date.now().toString(36)}`;
  }

  private generateKnowledgeBase(domain: string, level: number): string[] {
    const baseKnowledge = {
      'Technical': [
        'Programming languages and frameworks',
        'Software architecture patterns',
        'Database design and optimization',
        'API development and integration',
        'DevOps and deployment strategies'
      ],
      'Health & Wellness': [
        'Nutrition and dietary guidelines',
        'Exercise and fitness programs',
        'Mental health and mindfulness',
        'Medical research and studies',
        'Wellness lifestyle practices'
      ],
      'Learning': [
        'Educational methodologies',
        'Cognitive learning strategies',
        'Subject-specific knowledge bases',
        'Assessment and evaluation techniques',
        'Learning technology integration'
      ],
      'Creative': [
        'Artistic techniques and styles',
        'Design principles and trends',
        'Creative writing methodologies',
        'Digital media production',
        'Innovation and ideation processes'
      ]
    };

    const domainKnowledge = baseKnowledge[domain as keyof typeof baseKnowledge] || baseKnowledge['Technical'];
    return domainKnowledge.slice(0, Math.min(level + 2, domainKnowledge.length));
  }

  /**
   * Enhanced evolution with visual updates and NFT metadata changes
   */
  async evolveAgentWithVisuals(userId: string, agentId: string, dmtAmount: number): Promise<{ 
    success: boolean; 
    evolutionDetails?: any; 
    error?: string 
  }> {
    try {
      console.log('Enhanced evolution attempt:', { userId, agentId, dmtAmount });
      
      // Get agent data
      const agent = await this.getAgentById(agentId);
      if (!agent) {
        return { success: false, error: 'Agent not found' };
      }

      // Validate ownership
      if (agent.owner !== userId) {
        return { success: false, error: 'You can only evolve your own agents' };
      }

      // Check if agent can evolve
      const canEvolve = AvatarEvolutionService.canEvolve(agent);
      if (!canEvolve) {
        return { success: false, error: 'Agent cannot evolve further' };
      }

      // Get evolution info
      const evolutionInfo = await this.getEvolutionInfo(agentId);
      if (!evolutionInfo.success || !evolutionInfo.nextTier) {
        return { success: false, error: 'Agent cannot evolve further' };
      }

      const nextTier = evolutionInfo.nextTier;
      
      // Check DMT amount
      if (dmtAmount < nextTier.dmtRequired) {
        return { 
          success: false, 
          error: `Insufficient DMT. Required: ${nextTier.dmtRequired} DMT, Provided: ${dmtAmount} DMT` 
        };
      }

      // Generate evolved avatar
      const avatarResult = await AvatarEvolutionService.generateEvolvedAvatar(agent);
      if (!avatarResult.success) {
        return { success: false, error: `Failed to generate evolved avatar: ${avatarResult.error}` };
      }

      // Calculate rarity
      const rarityResult = RarityCalculationService.calculateRarity(agent, avatarResult.evolutionStage);

      // Update NFT metadata on-chain
      const metadataResult = await NFTMetadataService.updateNFTMetadata(
        agentId,
        agent,
        avatarResult.evolutionStage,
        avatarResult.visualEffects,
        rarityResult.rarity
      );

      if (!metadataResult.success) {
        console.warn('Failed to update NFT metadata:', metadataResult.error);
        // Continue with evolution even if metadata update fails
      }

      // Calculate evolution details
      const evolutionDetails = {
        previousLevel: agent.level,
        newLevel: nextTier.level,
        previousXP: agent.xp,
        newXP: agent.xp + 100,
        previousCapabilities: agent.capabilities || [],
        newCapabilities: [...(agent.capabilities || []), ...nextTier.superpowers],
        previousLLM: agent.llmConfig?.model || 'Unknown',
        newLLM: nextTier.llmUpgrade,
        previousVoice: evolutionInfo.currentTier?.voiceCapabilities || [],
        newVoice: nextTier.voiceCapabilities,
        dmtCost: nextTier.dmtRequired,
        evolutionStage: avatarResult.evolutionStage.name,
        agentType: agent.type,
        reason: `${agent.type === 'master' ? 'Master Agent' : 'Sub-Agent'} upgraded to ${nextTier.llmUpgrade} with ${nextTier.superpowers.join(', ')} capabilities`,
        tierDescription: nextTier.description,
        
        // Visual evolution details
        visualEvolution: {
          previousAvatar: agent.avatar,
          newAvatar: avatarResult.newAvatarPath,
          evolutionStage: avatarResult.evolutionStage,
          visualEffects: avatarResult.visualEffects,
          rarity: avatarResult.rarity
        },
        
        // NFT metadata details
        nftUpdate: {
          success: metadataResult.success,
          transactionSignature: metadataResult.transactionSignature,
          metadataUri: metadataResult.metadataUri,
          error: metadataResult.error
        },
        
        // Rarity details
        rarityDetails: {
          previousRarity: this.getCurrentRarity(agent),
          newRarity: rarityResult.rarity,
          rarityScore: rarityResult.score,
          rarityFactors: rarityResult.factors,
          preservation: rarityResult.preservation
        },
        
        // Individual configuration updates
        newLLMConfig: {
          model: nextTier.llmUpgrade,
          version: this.getLLMVersion(nextTier.llmUpgrade),
          temperature: this.getLLMTemperature(nextTier.llmUpgrade),
          maxTokens: this.getLLMMaxTokens(nextTier.llmUpgrade),
          contextWindow: this.getLLMContextWindow(nextTier.llmUpgrade)
        },
        newRAGConfig: {
          dataSource: this.generateUniqueDataSource(agent.id!, agent.domain, nextTier.level),
          vectorDB: `vector_db_${agent.id}_${nextTier.level}`,
          ipfsHash: this.generateIPFSHash(agent.id!, nextTier.level),
          knowledgeBase: this.generateKnowledgeBase(agent.domain, nextTier.level),
          lastUpdated: new Date().toISOString()
        }
      };

      // Update agent with new configuration
      const evolutionHistoryEntry = {
        timestamp: new Date().toISOString(),
        previousLevel: evolutionDetails.previousLevel,
        newLevel: evolutionDetails.newLevel,
        dmtSpent: evolutionDetails.dmtCost,
        llmUpgrade: evolutionDetails.newLLM,
        newSuperpowers: nextTier.superpowers,
        reason: evolutionDetails.reason,
        visualEvolution: evolutionDetails.visualEvolution,
        nftUpdate: evolutionDetails.nftUpdate,
        rarityDetails: evolutionDetails.rarityDetails
      };

      const updateData: any = {
        level: evolutionDetails.newLevel,
        xp: evolutionDetails.newXP,
        capabilities: evolutionDetails.newCapabilities,
        evolutionStage: evolutionDetails.evolutionStage,
        avatar: avatarResult.newAvatarPath, // Update avatar path
        llmConfig: evolutionDetails.newLLMConfig,
        ragConfig: evolutionDetails.newRAGConfig,
        evolutionHistory: [...(agent.evolutionHistory || []), evolutionHistoryEntry],
        individualStats: {
          totalUpgrades: (agent.individualStats?.totalUpgrades || 0) + 1,
          totalDmtSpent: (agent.individualStats?.totalDmtSpent || 0) + evolutionDetails.dmtCost,
          uniqueConversations: agent.individualStats?.uniqueConversations || 0,
          domainExpertise: Math.min((agent.individualStats?.domainExpertise || 0) + 10, 100),
          lastActive: new Date().toISOString()
        },
        'metadata.lastEvolved': new Date().toISOString(),
        'metadata.evolutionReason': evolutionDetails.reason,
        'metadata.visualEvolution': evolutionDetails.visualEvolution,
        'metadata.nftUpdate': evolutionDetails.nftUpdate,
        'metadata.rarityDetails': evolutionDetails.rarityDetails,
        'performance.tasksCompleted': (agent.performance?.tasksCompleted || 0) + 1
      };

      // Only add type if it's defined
      if (agent.type) {
        updateData.type = agent.type;
      }

      // Update in database
      if (db) {
        try {
          await updateDoc(doc(db, 'agents', agent.id!), updateData);
          console.log('Agent evolved successfully in database');
        } catch (firebaseError) {
          console.log('Firebase evolution failed, updating local cache only:', firebaseError);
        }
      }
      
      // Always update local cache
      const index = this.agents.findIndex(a => a.id === agent.id);
      if (index !== -1) {
        this.agents[index] = { ...this.agents[index], ...updateData };
        console.log('Agent evolved successfully in local cache');
      }

      // Burn upgrade fee
      const burnResult = await BurningService.burnUpgradeFee(userId, evolutionDetails.dmtCost, agentId);
      if (!burnResult.success) {
        return { 
          success: false, 
          error: `Failed to process upgrade burning: ${burnResult.error}` 
        };
      }

      // Use subscription credits
      await SubscriptionService.useCredits(userId, 2);

      // Save evolution transaction
      if (db) {
        const evolutionRef = collection(db, 'agentEvolutions');
        await addDoc(evolutionRef, {
          agentId: agent.id,
          agentName: agent.name,
          userId,
          dmtSpent: evolutionDetails.dmtCost,
          burnedAmount: burnResult.burnedAmount,
          evolutionDetails,
          timestamp: new Date().toISOString(),
          transactionType: 'VISUAL_EVOLUTION'
        });
      }

      console.log('Agent evolved successfully with visual updates:', evolutionDetails);
      return { success: true, evolutionDetails };
    } catch (error) {
      console.error('Failed to evolve agent with visuals:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get current rarity for agent (helper method)
   */
  private getCurrentRarity(agent: Agent): any {
    // This would typically fetch from the agent's metadata
    // For now, return a basic rarity based on level
    if (agent.level >= 20) return { name: 'legendary', multiplier: 3.0 };
    if (agent.level >= 15) return { name: 'epic', multiplier: 2.0 };
    if (agent.level >= 10) return { name: 'rare', multiplier: 1.5 };
    return { name: 'common', multiplier: 1.0 };
  }
}

export default AgentService.getInstance(); 