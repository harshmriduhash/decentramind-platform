const API_BASE_URL = process.env.NEXT_PUBLIC_N8N_API || 'http://localhost:3001';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  executions: number;
  lastExecuted?: string;
  requiredTokens?: {
    DMT: number;
    DMTX: number;
  };
  nodes?: any[];
  steps?: number;
}

export interface Execution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  result?: any;
  error?: string;
}

export interface ExecutionParams {
  parameters: any;
  agentId: string;
  walletAddress: string;
}

class N8NService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  async getWorkflows(): Promise<Workflow[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/workflows`);
      if (!response.ok) {
        throw new Error(`Failed to fetch workflows: ${response.status}`);
      }
      const data = await response.json();
      return data.workflows || [];
    } catch (error) {
      console.error('Get workflows error:', error);
      throw error;
    }
  }

  async getWorkflow(id: string): Promise<Workflow> {
    try {
      const response = await fetch(`${this.baseURL}/api/workflows/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch workflow: ${response.status}`);
      }
      const data = await response.json();
      return data.workflow;
    } catch (error) {
      console.error('Get workflow error:', error);
      throw error;
    }
  }

  async executeWorkflow(id: string, params: ExecutionParams): Promise<Execution> {
    try {
      const response = await fetch(`${this.baseURL}/api/workflows/${id}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to execute workflow: ${response.status}`);
      }

      const data = await response.json();
      return data.execution;
    } catch (error) {
      console.error('Execute workflow error:', error);
      throw error;
    }
  }

  async getExecutions(workflowId?: string): Promise<Execution[]> {
    try {
      const url = workflowId 
        ? `${this.baseURL}/api/workflows/${workflowId}/executions`
        : `${this.baseURL}/api/executions`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch executions: ${response.status}`);
      }
      const data = await response.json();
      return data.executions || [];
    } catch (error) {
      console.error('Get executions error:', error);
      throw error;
    }
  }

  async getExecution(id: string): Promise<Execution> {
    try {
      const response = await fetch(`${this.baseURL}/api/executions/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch execution: ${response.status}`);
      }
      const data = await response.json();
      return data.execution;
    } catch (error) {
      console.error('Get execution error:', error);
      throw error;
    }
  }

  // WebSocket connection for real-time updates
  connectWebSocket(onMessage: (data: any) => void): WebSocket | null {
    try {
      const wsUrl = this.baseURL.replace('http', 'ws');
      const ws = new WebSocket(`${wsUrl}/ws`);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      ws.onclose = () => {
        console.log('WebSocket disconnected');
      };
      
      return ws;
    } catch (error) {
      console.error('WebSocket connection error:', error);
      return null;
    }
  }

  // Utility methods
  formatWorkflowCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'healthcare': '🏥 Healthcare',
      'finance': '💰 Finance',
      'care': '🏥 Healthcare',
      'default': '⚡ Automation'
    };
    return categoryMap[category] || categoryMap['default'];
  }

  getWorkflowIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'healthcare': '🏥',
      'finance': '💰',
      'care': '🏥',
      'default': '⚡'
    };
    return iconMap[category] || iconMap['default'];
  }

  calculateTokenCost(workflow: Workflow): { DMT: number; DMTX: number } {
    // Default token costs based on category
    const defaultCosts = {
      'healthcare': { DMT: 5, DMTX: 0 },
      'finance': { DMT: 3, DMTX: 1 },
      'care': { DMT: 5, DMTX: 0 },
      'default': { DMT: 2, DMTX: 0 }
    };

    return workflow.requiredTokens || defaultCosts[workflow.category as keyof typeof defaultCosts] || defaultCosts['default'];
  }

  validateExecutionParams(params: any): { valid: boolean; error?: string } {
    try {
      if (typeof params !== 'object' || params === null) {
        return { valid: false, error: 'Parameters must be a valid object' };
      }
      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid parameters format' };
    }
  }
}

// Export singleton instance
export const n8nService = new N8NService();
export default n8nService;