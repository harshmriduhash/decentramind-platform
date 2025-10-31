export interface Agent {
  id: string;
  name: string;
  domain: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  xp: number;
  level: number;
  tasksCompleted: number;
  successRate: number;
  earnings: number;
  isMinted: boolean;
  personality: string;
  pricing: {
    mintCost: number;
    monthlyFee: number;
  };
  capabilities: string[];
  recentTasks: Task[];
  insights: Insight[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'failed' | 'pending';
  xpReward: number;
  timestamp: string;
  agent: string;
  category: string;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'tip' | 'forecast' | 'warning' | 'achievement';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  agent: string;
}

export const agents: Agent[] = [
  {
    id: 'finance',
    name: 'Autonomous CFO',
    domain: 'Finance',
    description: 'AI-powered financial intelligence and treasury management',
    icon: '🧠',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    xp: 2450,
    level: 4,
    tasksCompleted: 127,
    successRate: 94,
    earnings: 1850,
    isMinted: true,
    personality: 'Analytical, Risk-Aware, Growth-Focused',
    pricing: {
      mintCost: 100,
      monthlyFee: 25
    },
    capabilities: [
      'Portfolio Analysis',
      'Risk Assessment',
      'Yield Optimization',
      'Tax Planning',
      'DeFi Strategies'
    ],
    recentTasks: [
      {
        id: 'task-1',
        title: 'Portfolio Optimization',
        description: 'Analyzed trending token performance and optimized allocation',
        status: 'completed',
        xpReward: 50,
        timestamp: '2024-01-15T10:30:00Z',
        agent: 'finance',
        category: 'analysis'
      },
      {
        id: 'task-2',
        title: 'Risk Assessment',
        description: 'Evaluated risk factors for new DeFi protocol',
        status: 'in-progress',
        xpReward: 35,
        timestamp: '2024-01-15T11:00:00Z',
        agent: 'finance',
        category: 'risk'
      }
    ],
    insights: [
      {
        id: 'insight-1',
        title: 'Market Opportunity',
        description: 'ETH staking yields are trending 15% higher than last month',
        type: 'forecast',
        priority: 'high',
        timestamp: '2024-01-15T09:00:00Z',
        agent: 'finance'
      }
    ]
  },
  {
    id: 'wellness',
    name: 'Care Orchestrator',
    domain: 'Wellness',
    description: 'Healthcare coordination and patient management',
    icon: '❤️',
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    xp: 1200,
    level: 3,
    tasksCompleted: 85,
    successRate: 88,
    earnings: 1200,
    isMinted: true,
    personality: 'Compassionate, Proactive, Health-Conscious',
    pricing: {
      mintCost: 75,
      monthlyFee: 20
    },
    capabilities: [
      'Health Monitoring',
      'Medication Tracking',
      'Wellness Coaching',
      'Mood Analysis',
      'Fitness Planning'
    ],
    recentTasks: [
      {
        id: 'task-3',
        title: 'Health Report',
        description: 'Generated comprehensive health insights report',
        status: 'completed',
        xpReward: 40,
        timestamp: '2024-01-15T08:00:00Z',
        agent: 'wellness',
        category: 'report'
      },
      {
        id: 'task-4',
        title: 'Medication Reminder',
        description: 'Scheduled medication reminders for the week',
        status: 'completed',
        xpReward: 25,
        timestamp: '2024-01-15T07:30:00Z',
        agent: 'wellness',
        category: 'reminder'
      }
    ],
    insights: [
      {
        id: 'insight-2',
        title: 'Hydration Tip',
        description: 'Drink at least 8 glasses of water daily for optimal health',
        type: 'tip',
        priority: 'medium',
        timestamp: '2024-01-15T06:00:00Z',
        agent: 'wellness'
      }
    ]
  },
  {
    id: 'alpha',
    name: 'Crypto Alpha Assistant',
    domain: 'Alpha',
    description: 'DeFi strategies and cryptocurrency analysis',
    icon: '📈',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600',
    xp: 3200,
    level: 5,
    tasksCompleted: 156,
    successRate: 91,
    earnings: 2400,
    isMinted: true,
    personality: 'Aggressive, Data-Driven, Opportunity-Focused',
    pricing: {
      mintCost: 150,
      monthlyFee: 35
    },
    capabilities: [
      'Token Analysis',
      'DeFi Opportunities',
      'Alpha Signals',
      'Market Timing',
      'Yield Farming'
    ],
    recentTasks: [
      {
        id: 'task-5',
        title: 'Alpha Signal',
        description: 'Identified high-potential DeFi yield opportunity',
        status: 'completed',
        xpReward: 75,
        timestamp: '2024-01-15T12:00:00Z',
        agent: 'alpha',
        category: 'signal'
      },
      {
        id: 'task-6',
        title: 'Market Analysis',
        description: 'Analyzed trending token performance patterns',
        status: 'completed',
        xpReward: 60,
        timestamp: '2024-01-15T11:30:00Z',
        agent: 'alpha',
        category: 'analysis'
      }
    ],
    insights: [
      {
        id: 'insight-3',
        title: 'Alpha Alert',
        description: 'New DeFi protocol showing 40% APY potential',
        type: 'forecast',
        priority: 'high',
        timestamp: '2024-01-15T10:00:00Z',
        agent: 'alpha'
      }
    ]
  },
  {
    id: 'custom',
    name: 'Custom Agent',
    domain: 'Custom',
    description: 'Create your own specialized AI agent',
    icon: '🎨',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    xp: 0,
    level: 1,
    tasksCompleted: 0,
    successRate: 0,
    earnings: 0,
    isMinted: false,
    personality: 'Customizable',
    pricing: {
      mintCost: 200,
      monthlyFee: 50
    },
    capabilities: [],
    recentTasks: [],
    insights: []
  }
];

export const getAgentById = (id: string): Agent | undefined => {
  return agents.find(agent => agent.id === id);
};

export const getTotalXP = (): number => {
  return agents.reduce((total, agent) => total + agent.xp, 0);
};

export const getTotalEarnings = (): number => {
  return agents.reduce((total, agent) => total + agent.earnings, 0);
};

export const getGlobalLevel = (): number => {
  const totalXP = getTotalXP();
  return Math.floor(totalXP / 1000) + 1;
};
