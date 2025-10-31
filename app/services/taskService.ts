// Task Management Service for Agent Tasks
export interface Task {
  id: string;
  agentId: string;
  title: string;
  description: string;
  type: 'chat' | 'code' | 'analysis' | 'creative' | 'research' | 'automation';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  xpReward: number;
  dmtCost: number;
  estimatedDuration: number; // in minutes
  result?: any;
  error?: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  type: Task['type'];
  xpReward: number;
  dmtCost: number;
  estimatedDuration: number;
  requirements: {
    minLevel: number;
    capabilities: string[];
  };
}

export class TaskService {
  private tasks: Task[] = [];
  private taskTemplates: TaskTemplate[] = [
    // General Templates
    {
      id: 'chat-basic',
      name: 'Basic Chat Interaction',
      description: 'Have a conversation with the agent',
      type: 'chat',
      xpReward: 10,
      dmtCost: 1,
      estimatedDuration: 5,
      requirements: { minLevel: 1, capabilities: ['Basic text generation'] }
    },
    {
      id: 'code-review',
      name: 'Code Review',
      description: 'Review and analyze code quality',
      type: 'code',
      xpReward: 25,
      dmtCost: 3,
      estimatedDuration: 15,
      requirements: { minLevel: 2, capabilities: ['Code debugging assistance'] }
    },
    {
      id: 'data-analysis',
      name: 'Data Analysis',
      description: 'Analyze data and provide insights',
      type: 'analysis',
      xpReward: 50,
      dmtCost: 5,
      estimatedDuration: 30,
      requirements: { minLevel: 3, capabilities: ['Advanced reasoning', 'Complex problem solving'] }
    },
    {
      id: 'creative-writing',
      name: 'Creative Writing',
      description: 'Generate creative content',
      type: 'creative',
      xpReward: 30,
      dmtCost: 4,
      estimatedDuration: 20,
      requirements: { minLevel: 2, capabilities: ['Enhanced text generation'] }
    },
    {
      id: 'research-task',
      name: 'Research Task',
      description: 'Research a topic and provide comprehensive analysis',
      type: 'research',
      xpReward: 75,
      dmtCost: 8,
      estimatedDuration: 45,
      requirements: { minLevel: 4, capabilities: ['Master-level reasoning', 'Multi-domain expertise'] }
    },
    {
      id: 'automation-script',
      name: 'Automation Script',
      description: 'Create an automation script for a specific task',
      type: 'automation',
      xpReward: 100,
      dmtCost: 10,
      estimatedDuration: 60,
      requirements: { minLevel: 5, capabilities: ['Custom fine-tuned intelligence', 'Real-time collaboration'] }
    },

    // Finance Domain Templates
    {
      id: 'financial-analysis',
      name: 'Financial Analysis',
      description: 'Analyze financial data and provide investment insights',
      type: 'analysis',
      xpReward: 60,
      dmtCost: 6,
      estimatedDuration: 35,
      requirements: { minLevel: 3, capabilities: ['Financial Analysis', 'Portfolio Management'] }
    },
    {
      id: 'portfolio-optimization',
      name: 'Portfolio Optimization',
      description: 'Optimize investment portfolio based on risk tolerance',
      type: 'analysis',
      xpReward: 80,
      dmtCost: 8,
      estimatedDuration: 40,
      requirements: { minLevel: 4, capabilities: ['Portfolio Management', 'Risk Assessment'] }
    },
    {
      id: 'market-research',
      name: 'Market Research',
      description: 'Research market trends and provide trading recommendations',
      type: 'research',
      xpReward: 70,
      dmtCost: 7,
      estimatedDuration: 45,
      requirements: { minLevel: 3, capabilities: ['Financial Analysis', 'Market Research'] }
    },
    {
      id: 'budget-planning',
      name: 'Budget Planning',
      description: 'Create comprehensive budget plans and financial forecasts',
      type: 'analysis',
      xpReward: 45,
      dmtCost: 5,
      estimatedDuration: 25,
      requirements: { minLevel: 2, capabilities: ['Financial Analysis'] }
    },

    // Health & Wellness Domain Templates
    {
      id: 'health-assessment',
      name: 'Health Assessment',
      description: 'Analyze health data and provide wellness recommendations',
      type: 'analysis',
      xpReward: 55,
      dmtCost: 6,
      estimatedDuration: 30,
      requirements: { minLevel: 3, capabilities: ['Health Monitoring', 'Wellness Planning'] }
    },
    {
      id: 'nutrition-planning',
      name: 'Nutrition Planning',
      description: 'Create personalized nutrition plans and meal recommendations',
      type: 'analysis',
      xpReward: 40,
      dmtCost: 4,
      estimatedDuration: 25,
      requirements: { minLevel: 2, capabilities: ['Nutrition Guidance'] }
    },
    {
      id: 'fitness-routine',
      name: 'Fitness Routine',
      description: 'Design personalized workout routines and fitness plans',
      type: 'analysis',
      xpReward: 35,
      dmtCost: 4,
      estimatedDuration: 20,
      requirements: { minLevel: 2, capabilities: ['Wellness Planning'] }
    },
    {
      id: 'wellness-coaching',
      name: 'Wellness Coaching',
      description: 'Provide personalized wellness coaching and lifestyle advice',
      type: 'chat',
      xpReward: 25,
      dmtCost: 3,
      estimatedDuration: 15,
      requirements: { minLevel: 2, capabilities: ['Health Monitoring', 'Wellness Planning'] }
    },

    // Crypto Domain Templates
    {
      id: 'crypto-analysis',
      name: 'Crypto Market Analysis',
      description: 'Analyze cryptocurrency markets and provide trading insights',
      type: 'analysis',
      xpReward: 70,
      dmtCost: 7,
      estimatedDuration: 35,
      requirements: { minLevel: 4, capabilities: ['Crypto Analysis', 'Trading Strategies'] }
    },
    {
      id: 'defi-research',
      name: 'DeFi Research',
      description: 'Research DeFi protocols and provide yield farming strategies',
      type: 'research',
      xpReward: 85,
      dmtCost: 9,
      estimatedDuration: 50,
      requirements: { minLevel: 5, capabilities: ['Crypto Analysis', 'Market Research'] }
    },
    {
      id: 'nft-analysis',
      name: 'NFT Analysis',
      description: 'Analyze NFT collections and provide investment recommendations',
      type: 'analysis',
      xpReward: 60,
      dmtCost: 6,
      estimatedDuration: 30,
      requirements: { minLevel: 3, capabilities: ['Crypto Analysis'] }
    },
    {
      id: 'trading-strategy',
      name: 'Trading Strategy',
      description: 'Develop automated trading strategies and risk management plans',
      type: 'automation',
      xpReward: 90,
      dmtCost: 10,
      estimatedDuration: 60,
      requirements: { minLevel: 5, capabilities: ['Trading Strategies', 'Market Research'] }
    }
  ];

  // Get all task templates
  getTaskTemplates(): TaskTemplate[] {
    return this.taskTemplates;
  }

  // Get task templates available for an agent
  getAvailableTaskTemplates(agentLevel: number, agentCapabilities: string[]): TaskTemplate[] {
    console.log('Getting templates for level:', agentLevel, 'capabilities:', agentCapabilities);
    
    // Filter templates based on level and capabilities
    const availableTemplates = this.taskTemplates.filter(template => {
      // Check level requirement
      if (template.requirements.minLevel > agentLevel) {
        return false;
      }
      
      // Check capability requirements (at least one capability must match)
      const hasRequiredCapability = template.requirements.capabilities.some(requiredCap => 
        agentCapabilities.some(agentCap => 
          agentCap.toLowerCase().includes(requiredCap.toLowerCase()) ||
          requiredCap.toLowerCase().includes(agentCap.toLowerCase())
        )
      );
      
      return hasRequiredCapability;
    });
    
    console.log('Available templates:', availableTemplates);
    return availableTemplates;
  }

  // Create a new task
  createTask(agentId: string, templateId: string, customDescription?: string): Task {
    const template = this.taskTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error('Task template not found');
    }

    const task: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      agentId,
      title: template.name,
      description: customDescription || template.description,
      type: template.type,
      priority: 'medium',
      status: 'pending',
      createdAt: new Date(),
      xpReward: template.xpReward,
      dmtCost: template.dmtCost,
      estimatedDuration: template.estimatedDuration,
    };

    this.tasks.push(task);
    return task;
  }

  // Get tasks for an agent
  getAgentTasks(agentId: string): Task[] {
    return this.tasks.filter(task => task.agentId === agentId);
  }

  // Get all tasks
  getAllTasks(): Task[] {
    return this.tasks;
  }

  // Start a task
  startTask(taskId: string): Task {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.status !== 'pending') {
      throw new Error('Task cannot be started');
    }

    task.status = 'in_progress';
    return task;
  }

  // Complete a task
  completeTask(taskId: string, result?: any): Task {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    if (task.status !== 'in_progress') {
      throw new Error('Task is not in progress');
    }

    task.status = 'completed';
    task.completedAt = new Date();
    task.result = result;
    return task;
  }

  // Fail a task
  failTask(taskId: string, error: string): Task {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    task.status = 'failed';
    task.error = error;
    return task;
  }

  // Get task statistics
  getTaskStats(agentId: string): {
    total: number;
    completed: number;
    inProgress: number;
    failed: number;
    totalXp: number;
    totalDmtSpent: number;
  } {
    const agentTasks = this.getAgentTasks(agentId);
    return {
      total: agentTasks.length,
      completed: agentTasks.filter(t => t.status === 'completed').length,
      inProgress: agentTasks.filter(t => t.status === 'in_progress').length,
      failed: agentTasks.filter(t => t.status === 'failed').length,
      totalXp: agentTasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.xpReward, 0),
      totalDmtSpent: agentTasks.reduce((sum, t) => sum + t.dmtCost, 0),
    };
  }

  // Simulate task execution (for demo purposes)
  async executeTask(taskId: string): Promise<Task> {
    const task = this.startTask(taskId);
    
    // Simulate task execution time
    await new Promise(resolve => setTimeout(resolve, Math.min(task.estimatedDuration * 100, 5000)));
    
    // Simulate success/failure (90% success rate)
    if (Math.random() > 0.1) {
      return this.completeTask(taskId, { 
        message: 'Task completed successfully!',
        timestamp: new Date().toISOString(),
        performance: Math.random() * 0.3 + 0.7 // 70-100% performance
      });
    } else {
      return this.failTask(taskId, 'Task execution failed due to unexpected error');
    }
  }
}

// Singleton instance
export const taskService = new TaskService();

