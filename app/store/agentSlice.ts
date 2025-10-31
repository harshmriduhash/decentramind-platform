import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { saveData, getData, listenToData } from '../lib/firebase';

export interface Agent {
  id: string;
  name: string;
  type: 'VisionSync' | 'DomainSync';
  level: number;
  xp: number;
  performance: number;
  tasks_completed: number;
  created_at: number;
  last_updated: number;
  owner: string;
  domain: string;
  personality: string;
  cost: number;
  skills: string[];
  status: 'active' | 'inactive' | 'training';
}

export interface Task {
  id: string;
  agent_id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  xp_reward: number;
  dmt_reward: number;
  created_at: number;
  completed_at?: number;
  owner: string;
}

export interface UserMetrics {
  daily_life_score: number;
  focus_time_minutes: number;
  streak_days: number;
  active_agents: number;
  total_xp: number;
  total_dmt_earned: number;
  total_co2_reduced: number;
  last_updated: number;
}

interface AgentState {
  agents: Agent[];
  tasks: Task[];
  metrics: UserMetrics;
  loading: boolean;
  error: string | null;
  selectedAgent: Agent | null;
}

const initialState: AgentState = {
  agents: [],
  tasks: [],
  metrics: {
    daily_life_score: 85,
    focus_time_minutes: 120,
    streak_days: 7,
    active_agents: 2,
    total_xp: 2022,
    total_dmt_earned: 150.5,
    total_co2_reduced: 45.2,
    last_updated: Date.now()
  },
  loading: false,
  error: null,
  selectedAgent: null
};

// Async thunks for Firebase operations
export const fetchUserAgents = createAsyncThunk(
  'agent/fetchUserAgents',
  async (userId: string) => {
    const agents = await getData(`agents/${userId}`);
    return agents || [];
  }
);

export const saveAgent = createAsyncThunk(
  'agent/saveAgent',
  async ({ userId, agent }: { userId: string; agent: Agent }) => {
    await saveData(`agents/${userId}/${agent.id}`, agent);
    return agent;
  }
);

export const fetchUserTasks = createAsyncThunk(
  'agent/fetchUserTasks',
  async (userId: string) => {
    const tasks = await getData(`tasks/${userId}`);
    return tasks || [];
  }
);

export const saveTask = createAsyncThunk(
  'agent/saveTask',
  async ({ userId, task }: { userId: string; task: Task }) => {
    await saveData(`tasks/${userId}/${task.id}`, task);
    return task;
  }
);

export const fetchUserMetrics = createAsyncThunk(
  'agent/fetchUserMetrics',
  async (userId: string) => {
    const metrics = await getData(`user_metrics/${userId}`);
    return metrics || initialState.metrics;
  }
);

export const saveUserMetrics = createAsyncThunk(
  'agent/saveUserMetrics',
  async ({ userId, metrics }: { userId: string; metrics: UserMetrics }) => {
    await saveData(`user_metrics/${userId}`, metrics);
    return metrics;
  }
);

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSelectedAgent: (state, action: PayloadAction<Agent | null>) => {
      state.selectedAgent = action.payload;
    },
    updateAgent: (state, action: PayloadAction<Agent>) => {
      const index = state.agents.findIndex(agent => agent.id === action.payload.id);
      if (index !== -1) {
        state.agents[index] = action.payload;
      }
    },
    addAgent: (state, action: PayloadAction<Agent>) => {
      state.agents.push(action.payload);
      state.metrics.active_agents = state.agents.length;
    },
    removeAgent: (state, action: PayloadAction<string>) => {
      state.agents = state.agents.filter(agent => agent.id !== action.payload);
      state.metrics.active_agents = state.agents.length;
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateMetrics: (state, action: PayloadAction<Partial<UserMetrics>>) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    incrementXP: (state, action: PayloadAction<number>) => {
      state.metrics.total_xp += action.payload;
    },
    incrementDMT: (state, action: PayloadAction<number>) => {
      state.metrics.total_dmt_earned += action.payload;
    },
    incrementCO2Reduced: (state, action: PayloadAction<number>) => {
      state.metrics.total_co2_reduced += action.payload;
    },
    startListeningToAgents: (state, action: PayloadAction<string>) => {
      // This will be handled by middleware or component
    },
    stopListeningToAgents: () => {
      // This will be handled by middleware or component
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch agents
      .addCase(fetchUserAgents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload;
        state.metrics.active_agents = action.payload.length;
      })
      .addCase(fetchUserAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch agents';
      })
      // Save agent
      .addCase(saveAgent.fulfilled, (state, action) => {
        const index = state.agents.findIndex(agent => agent.id === action.payload.id);
        if (index !== -1) {
          state.agents[index] = action.payload;
        } else {
          state.agents.push(action.payload);
        }
        state.metrics.active_agents = state.agents.length;
      })
      // Fetch tasks
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      // Save task
      .addCase(saveTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        } else {
          state.tasks.push(action.payload);
        }
      })
      // Fetch metrics
      .addCase(fetchUserMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
      })
      // Save metrics
      .addCase(saveUserMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
      });
  }
});

export const {
  setLoading,
  setError,
  setSelectedAgent,
  updateAgent,
  addAgent,
  removeAgent,
  updateTask,
  addTask,
  removeTask,
  updateMetrics,
  incrementXP,
  incrementDMT,
  incrementCO2Reduced,
  startListeningToAgents,
  stopListeningToAgents
} = agentSlice.actions;

export default agentSlice.reducer; 