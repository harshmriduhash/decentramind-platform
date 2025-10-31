import { create } from 'zustand';

interface StakingPosition {
  id: number;
  amount: number;
  startDate: string;
  endDate: string;
  rewards: number;
  status: string;
  lockPeriod: number;
}

interface Task {
  id: number;
  name: string;
  status: string;
  priority: string;
  dueDate: string;
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  votes: number;
  totalVotes: number;
  endDate: string;
  proposer: string;
}

interface LearningSession {
  id: number;
  topic: string;
  duration: number;
  startTime: string;
  endTime?: string;
  progress: {
    vocabulary: number;
    grammar: number;
    pronunciation: number;
  };
  activities: {
    type: 'vocabulary' | 'quiz' | 'pronunciation' | 'recording';
    timestamp: string;
    score?: number;
    feedback?: string;
  }[];
  completed: boolean;
}

interface AgentEvolution {
  id: number;
  agentId: string;
  agentName: string;
  evolutionType: 'level_up' | 'skill_unlock' | 'performance_boost' | 'training_complete';
  oldValue: any;
  newValue: any;
  timestamp: string;
  xpGained: number;
  description: string;
}

interface UserProgress {
  totalLearningSessions: number;
  totalLearningTime: number;
  averageSessionScore: number;
  streakDays: number;
  lastActiveDate: string;
  achievements: string[];
  skillLevels: {
    [skill: string]: number;
  };
}

interface GlobalState {
  // Staking State
  stakingPositions: StakingPosition[];
  addStakingPosition: (position: Omit<StakingPosition, 'id'>) => void;
  removeStakingPosition: (id: number) => void;
  updateStakingPosition: (id: number, updates: Partial<StakingPosition>) => void;
  
  // Tasks State
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  
  // Proposals State
  proposals: Proposal[];
  addProposal: (proposal: Omit<Proposal, 'id'>) => void;
  
  // Chat State
  chatMessages: any[];
  addChatMessage: (message: any) => void;
  
  // Agent State
  agents: any[];
  addAgent: (agent: any) => void;
  
  // NEW: Learning History
  learningSessions: LearningSession[];
  addLearningSession: (session: Omit<LearningSession, 'id'>) => void;
  updateLearningSession: (id: number, updates: Partial<LearningSession>) => void;
  
  // NEW: Agent Evolution History
  agentEvolutions: AgentEvolution[];
  addAgentEvolution: (evolution: Omit<AgentEvolution, 'id'>) => void;
  
  // NEW: User Progress Tracking
  userProgress: UserProgress;
  updateUserProgress: (updates: Partial<UserProgress>) => void;
}

export const useGlobalState = create<GlobalState>((set) => ({
  // Initial Staking Data
  stakingPositions: [
    {
      id: 1,
      amount: 5000,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      rewards: 520,
      status: 'Active',
      lockPeriod: 30,
    },
    {
      id: 2,
      amount: 2500,
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      rewards: 260,
      status: 'Active',
      lockPeriod: 30,
    },
    {
      id: 3,
      amount: 10000,
      startDate: '2024-01-10',
      endDate: '2024-02-10',
      rewards: 1040,
      status: 'Completed',
      lockPeriod: 30,
    },
  ],
  
  addStakingPosition: (position) => set((state) => ({
    stakingPositions: [...state.stakingPositions, { ...position, id: state.stakingPositions.length + 1 }]
  })),
  
  removeStakingPosition: (id) => set((state) => ({
    stakingPositions: state.stakingPositions.filter(position => position.id !== id)
  })),
  
  updateStakingPosition: (id, updates) => set((state) => ({
    stakingPositions: state.stakingPositions.map(position => 
      position.id === id ? { ...position, ...updates } : position
    )
  })),
  
  // Initial Tasks Data
  tasks: [
    {
      id: 1,
      name: 'Complete onboarding',
      status: 'In Progress',
      priority: 'High',
      dueDate: '2024-02-15',
    },
    {
      id: 2,
      name: 'Daily Focus Session',
      status: 'Pending',
      priority: 'Medium',
      dueDate: '2024-02-16',
    },
    {
      id: 3,
      name: 'Review Analytics',
      status: 'Completed',
      priority: 'Low',
      dueDate: '2024-02-14',
    },
  ],
  
  addTask: (task) => set((state) => ({
    tasks: [...state.tasks, { ...task, id: state.tasks.length + 1 }]
  })),
  
  // Initial Proposals Data
  proposals: [
    {
      id: 1,
      title: 'Increase Staking Rewards to 15% APY',
      description: 'Proposal to increase staking rewards from 12% to 15% APY to attract more participants',
      type: 'Governance',
      status: 'Active',
      votes: 1250,
      totalVotes: 1570,
      endDate: '2024-02-15',
      proposer: 'DAO Member 1',
    },
    {
      id: 2,
      title: 'Add New AI Agent Domain: Gaming',
      description: 'Proposal to add gaming as a new domain for AI agents in the ecosystem',
      type: 'Feature',
      status: 'Pending',
      votes: 890,
      totalVotes: 1040,
      endDate: '2024-02-20',
      proposer: 'DAO Member 2',
    },
    {
      id: 3,
      title: 'Update Tokenomics Model',
      description: 'Proposal to update the tokenomics model with new distribution parameters',
      type: 'Economic',
      status: 'Completed',
      votes: 2100,
      totalVotes: 2550,
      endDate: '2024-02-10',
      proposer: 'DAO Member 3',
    },
    {
      id: 4,
      title: 'Partnership with DeFi Protocol',
      description: 'Proposal to establish a partnership with a major DeFi protocol',
      type: 'Partnership',
      status: 'Active',
      votes: 750,
      totalVotes: 1030,
      endDate: '2024-02-25',
      proposer: 'DAO Member 4',
    },
  ],
  
  addProposal: (proposal) => set((state) => ({
    proposals: [...state.proposals, { ...proposal, id: state.proposals.length + 1 }]
  })),
  
  // Chat Messages
  chatMessages: [
    { id: 1, sender: 'User', text: 'Hey, how do I secure my agent?', avatar: '/user.png' },
    { id: 2, sender: 'AI Assistant', text: '🔒 Security Setup:\n\n• ZKP Encryption: Active\n• On-chain 2FA: Available\n• Smart Contract Auditing: Enabled\n\nYour agents are protected with enterprise-grade security. Would you like to configure additional security measures?', avatar: '/agent.png' },
    { id: 3, sender: 'User', text: 'Great, thanks for the tip!', avatar: '/user.png' },
  ],
  
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, { ...message, id: state.chatMessages.length + 1 }]
  })),
  
  // Agents
  agents: [
    {
      id: 1,
      name: 'Master Agent',
      domain: 'Productivity',
      status: 'Active',
      xp: 300,
      level: 5,
    },
    {
      id: 2,
      name: 'Language Agent',
      domain: 'Learning',
      status: 'Idle',
      xp: 75,
      level: 2,
    },
  ],
  
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, { ...agent, id: state.agents.length + 1 }]
  })),
  
  // NEW: Learning Sessions History
  learningSessions: [
    {
      id: 1,
      topic: 'German Basics',
      duration: 900, // 15 minutes
      startTime: '2024-02-15T10:00:00Z',
      endTime: '2024-02-15T10:15:00Z',
      progress: {
        vocabulary: 40,
        grammar: 20,
        pronunciation: 30,
      },
      activities: [
        {
          type: 'vocabulary',
          timestamp: '2024-02-15T10:02:00Z',
          score: 8,
          feedback: 'Great pronunciation!'
        },
        {
          type: 'quiz',
          timestamp: '2024-02-15T10:08:00Z',
          score: 7,
          feedback: 'Correct answer: "Good Morning"'
        },
        {
          type: 'pronunciation',
          timestamp: '2024-02-15T10:12:00Z',
          score: 9,
          feedback: 'Excellent German accent!'
        }
      ],
      completed: true,
    },
    {
      id: 2,
      topic: 'Spanish Greetings',
      duration: 600, // 10 minutes
      startTime: '2024-02-14T14:30:00Z',
      progress: {
        vocabulary: 60,
        grammar: 30,
        pronunciation: 45,
      },
      activities: [
        {
          type: 'vocabulary',
          timestamp: '2024-02-14T14:32:00Z',
          score: 9,
          feedback: 'Perfect!'
        }
      ],
      completed: false,
    }
  ],
  
  addLearningSession: (session) => set((state) => ({
    learningSessions: [...state.learningSessions, { ...session, id: state.learningSessions.length + 1 }]
  })),
  
  updateLearningSession: (id, updates) => set((state) => ({
    learningSessions: state.learningSessions.map(session => 
      session.id === id ? { ...session, ...updates } : session
    )
  })),
  
  // NEW: Agent Evolution History
  agentEvolutions: [
    {
      id: 1,
      agentId: 'agent-1',
      agentName: 'Master Agent',
      evolutionType: 'level_up',
      oldValue: { level: 4, xp: 280 },
      newValue: { level: 5, xp: 300 },
      timestamp: '2024-02-15T09:30:00Z',
      xpGained: 20,
      description: 'Level up! Master Agent reached level 5'
    },
    {
      id: 2,
      agentId: 'agent-2',
      agentName: 'Language Agent',
      evolutionType: 'skill_unlock',
      oldValue: { skills: ['basic_communication'] },
      newValue: { skills: ['basic_communication', 'advanced_grammar'] },
      timestamp: '2024-02-14T16:45:00Z',
      xpGained: 15,
      description: 'Unlocked Advanced Grammar skill'
    },
    {
      id: 3,
      agentId: 'agent-1',
      agentName: 'Master Agent',
      evolutionType: 'performance_boost',
      oldValue: { performance: 85 },
      newValue: { performance: 92 },
      timestamp: '2024-02-13T11:20:00Z',
      xpGained: 10,
      description: 'Performance improved through training'
    }
  ],
  
  addAgentEvolution: (evolution) => set((state) => ({
    agentEvolutions: [...state.agentEvolutions, { ...evolution, id: state.agentEvolutions.length + 1 }]
  })),
  
  // NEW: User Progress Tracking
  userProgress: {
    totalLearningSessions: 12,
    totalLearningTime: 10800, // 3 hours in seconds
    averageSessionScore: 8.2,
    streakDays: 7,
    lastActiveDate: '2024-02-15',
    achievements: [
      'First Learning Session',
      '7-Day Streak',
      'Vocabulary Master',
      'Perfect Pronunciation'
    ],
    skillLevels: {
      'German': 3,
      'Spanish': 2,
      'French': 1,
      'Productivity': 4,
      'Creative': 3
    }
  },
  
  updateUserProgress: (updates) => set((state) => ({
    userProgress: { ...state.userProgress, ...updates }
  })),
})); 