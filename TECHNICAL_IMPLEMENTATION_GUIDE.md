# DecentraMind Technical Implementation Guide

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Solana CLI tools
- Git

### **Installation**
```bash
# Clone repository
git clone <repository-url>
cd DecentraMind

# Install dependencies
npm install

# Set up environment variables
cp env.template .env.local

# Start development server
npm run dev
```

## 🏗️ Architecture Implementation

### **1. Component Structure**

#### **Component Template**
```typescript
// components/NewComponent.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useGlobalState } from '../store/globalState';

interface NewComponentProps {
  title: string;
  onAction?: (data: any) => void;
}

const NewComponent: React.FC<NewComponentProps> = ({ title, onAction }) => {
  const [localState, setLocalState] = useState<any>(null);
  const { globalState, updateGlobalState } = useGlobalState();

  useEffect(() => {
    // Component initialization logic
  }, []);

  const handleAction = async () => {
    try {
      // Action logic
      if (onAction) onAction(localState);
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">{title}</Typography>
      {/* Component content */}
    </Box>
  );
};

export default NewComponent;
```

#### **Component Categories**
```typescript
// Layout Components
export { default as FuturisticSidebar } from './FuturisticSidebar';
export { default as EconomicStatusBar } from './EconomicStatusBar';

// Feature Components
export { default as TestMinting } from './TestMinting';
export { default as ChatServicesTab } from './ChatServicesTab';
export { default as Marketplace } from './Marketplace';

// Dashboard Components
export { default as MasterAgentDashboard } from './MasterAgentDashboard';
export { default as TokenomicsDashboard } from './TokenomicsDashboard';

// Utility Components
export { default as ToastNotifications } from './ToastNotifications';
export { default as AuthGuard } from './AuthGuard';
```

### **2. State Management Implementation**

#### **Zustand Store Setup**
```typescript
// store/globalState.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GlobalState {
  // State properties
  stakingPositions: StakingPosition[];
  chatMessages: ChatMessage[];
  agents: Agent[];
  
  // Actions
  addStakingPosition: (position: Omit<StakingPosition, 'id'>) => void;
  addChatMessage: (message: ChatMessage) => void;
  addAgent: (agent: Agent) => void;
}

export const useGlobalState = create<GlobalState>()(
  persist(
    (set, get) => ({
      // Initial state
      stakingPositions: [],
      chatMessages: [],
      agents: [],
      
      // Actions
      addStakingPosition: (position) => set((state) => ({
        stakingPositions: [...state.stakingPositions, { ...position, id: Date.now() }]
      })),
      
      addChatMessage: (message) => set((state) => ({
        chatMessages: [...state.chatMessages, message]
      })),
      
      addAgent: (agent) => set((state) => ({
        agents: [...state.agents, agent]
      })),
    }),
    {
      name: 'decentramind-storage',
      partialize: (state) => ({
        stakingPositions: state.stakingPositions,
        chatMessages: state.chatMessages,
        agents: state.agents,
      }),
    }
  )
);
```

#### **Redux Store Setup**
```typescript
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import agentSlice from './agentSlice';

export const store = configureStore({
  reducer: {
    agent: agentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### **Redux Slice Example**
```typescript
// store/agentSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AgentState {
  agents: Agent[];
  loading: boolean;
  error: string | null;
}

const initialState: AgentState = {
  agents: [],
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAgents: (state, action: PayloadAction<Agent[]>) => {
      state.agents = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setAgents, setError } = agentSlice.actions;
export default agentSlice.reducer;
```

### **3. Service Layer Implementation**

#### **Service Base Class**
```typescript
// services/BaseService.ts
export abstract class BaseService {
  protected static instance: any;
  
  static getInstance<T>(): T {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }
  
  protected async handleRequest<T>(
    request: () => Promise<T>,
    errorMessage: string = 'Request failed'
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      console.error(errorMessage, error);
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }
  
  protected validateParams(params: any, required: string[]): void {
    for (const field of required) {
      if (!params[field]) {
        throw new Error(`Missing required parameter: ${field}`);
      }
    }
  }
}
```

#### **Service Implementation Example**
```typescript
// services/agentService.ts
import { BaseService } from './BaseService';
import { Agent, CreateAgentParams } from '../types/agent';

export class AgentService extends BaseService {
  private static instance: AgentService;
  
  static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }
  
  async createAgent(params: CreateAgentParams): Promise<Agent> {
    this.validateParams(params, ['name', 'type', 'description']);
    
    return this.handleRequest(async () => {
      // Implementation logic
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }, 'Failed to create agent');
  }
  
  async getAgents(): Promise<Agent[]> {
    return this.handleRequest(async () => {
      const response = await fetch('/api/agents');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }, 'Failed to fetch agents');
  }
}

export default AgentService;
```

### **4. API Route Implementation**

#### **API Route Structure**
```typescript
// app/api/agents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AgentService } from '../../../services/agentService';

export async function GET() {
  try {
    const agentService = AgentService.getInstance();
    const agents = await agentService.getAgents();
    
    return NextResponse.json({ success: true, data: agents });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agentService = AgentService.getInstance();
    const agent = await agentService.createAgent(body);
    
    return NextResponse.json({ success: true, data: agent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
```

#### **Authentication Middleware**
```typescript
// lib/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifySignature } from '../services/solanaService';

export async function authMiddleware(request: NextRequest) {
  try {
    const signature = request.headers.get('x-signature');
    const publicKey = request.headers.get('x-public-key');
    
    if (!signature || !publicKey) {
      return NextResponse.json(
        { error: 'Missing authentication headers' },
        { status: 401 }
      );
    }
    
    const isValid = await verifySignature(publicKey, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
```

### **5. Custom Hooks Implementation**

#### **Hook Template**
```typescript
// hooks/useAgent.ts
import { useState, useEffect, useCallback } from 'react';
import { useGlobalState } from '../store/globalState';
import AgentService from '../services/agentService';

export const useAgent = (agentId?: string) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { agents, addAgent, updateAgent } = useGlobalState();
  
  const fetchAgent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const agentService = AgentService.getInstance();
      const fetchedAgent = await agentService.getAgent(id);
      setAgent(fetchedAgent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createAgent = useCallback(async (params: CreateAgentParams) => {
    setLoading(true);
    setError(null);
    
    try {
      const agentService = AgentService.getInstance();
      const newAgent = await agentService.createAgent(params);
      addAgent(newAgent);
      setAgent(newAgent);
      return newAgent;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [addAgent]);
  
  useEffect(() => {
    if (agentId) {
      fetchAgent(agentId);
    }
  }, [agentId, fetchAgent]);
  
  return {
    agent,
    loading,
    error,
    createAgent,
    fetchAgent,
  };
};
```

### **6. Type Definitions**

#### **Type Structure**
```typescript
// types/index.ts
export * from './agent';
export * from './staking';
export * from './chat';
export * from './user';
export * from './api';

// types/agent.ts
export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  capabilities: string[];
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  status: AgentStatus;
  metadata: Record<string, any>;
}

export type AgentType = 'productivity' | 'learning' | 'creative' | 'analytical';
export type AgentStatus = 'active' | 'inactive' | 'training' | 'error';

export interface CreateAgentParams {
  name: string;
  type: AgentType;
  description: string;
  capabilities: string[];
  metadata?: Record<string, any>;
}
```

### **7. Styling Implementation**

#### **Theme Configuration**
```typescript
// lib/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff',
      light: '#4dffff',
      dark: '#00cccc',
    },
    secondary: {
      main: '#4ecdc4',
      light: '#7dd8d2',
      dark: '#2ba69e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'rgba(25, 25, 25, 0.9)',
          border: '2px solid #00ffff',
        },
      },
    },
  },
});
```

#### **Styled Components**
```typescript
// components/styled/GlassmorphicCard.tsx
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

export const GlassmorphicCard = styled(Card)(({ theme }) => ({
  background: 'rgba(25, 25, 25, 0.9)',
  backdropFilter: 'blur(10px)',
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: 12,
  boxShadow: `0 0 20px ${theme.palette.primary.main}40`,
  transition: 'all 0.3s ease',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 0 30px ${theme.palette.primary.main}60`,
  },
}));
```

### **8. Error Handling**

#### **Error Boundary**
```typescript
// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {this.state.error?.message}
          </Typography>
          <Button
            variant="contained"
            onClick={() => this.setState({ hasError: false })}
            sx={{ mt: 2 }}
          >
            Try again
          </Button>
        </Box>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
```

### **9. Testing Implementation**

#### **Component Testing**
```typescript
// __tests__/components/NewComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../lib/theme';
import NewComponent from '../../components/NewComponent';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('NewComponent', () => {
  it('renders with title', () => {
    renderWithTheme(<NewComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  
  it('calls onAction when action is triggered', () => {
    const mockOnAction = jest.fn();
    renderWithTheme(
      <NewComponent title="Test" onAction={mockOnAction} />
    );
    
    // Trigger action
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockOnAction).toHaveBeenCalled();
  });
});
```

#### **Service Testing**
```typescript
// __tests__/services/agentService.test.ts
import AgentService from '../../services/agentService';
import { Agent, CreateAgentParams } from '../../types/agent';

// Mock fetch
global.fetch = jest.fn();

describe('AgentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('creates agent successfully', async () => {
    const mockAgent: Agent = {
      id: '1',
      name: 'Test Agent',
      type: 'productivity',
      description: 'Test description',
      capabilities: ['test'],
      owner: 'test-owner',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      metadata: {},
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAgent,
    });
    
    const agentService = AgentService.getInstance();
    const params: CreateAgentParams = {
      name: 'Test Agent',
      type: 'productivity',
      description: 'Test description',
      capabilities: ['test'],
    };
    
    const result = await agentService.createAgent(params);
    
    expect(result).toEqual(mockAgent);
    expect(fetch).toHaveBeenCalledWith('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
  });
});
```

## 🔧 Development Workflow

### **1. Feature Development**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Run tests
npm test

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### **2. Code Quality**
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run all checks
npm run check
```

### **3. Testing Strategy**
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📚 Best Practices

### **1. Component Design**
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow atomic design principles
- Keep components focused and single-purpose

### **2. State Management**
- Use Zustand for simple global state
- Use Redux for complex state logic
- Keep local state minimal
- Implement proper error boundaries

### **3. Performance**
- Implement lazy loading for routes
- Use React.memo for expensive components
- Optimize re-renders with useMemo/useCallback
- Implement proper loading states

### **4. Security**
- Validate all user inputs
- Implement proper authentication
- Use HTTPS in production
- Sanitize data before rendering

### **5. Accessibility**
- Use semantic HTML
- Implement proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

This technical implementation guide provides developers with the necessary tools and patterns to work effectively with the DecentraMind frontend architecture.
