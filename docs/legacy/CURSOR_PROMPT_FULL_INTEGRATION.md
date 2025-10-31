# Cursor Prompt: Complete DecentraMind Front-End Integration & Futuristic Design

## 🚨 CRITICAL ISSUES TO FIX
The current DecentraMind front-end has several critical issues that need immediate attention:

### 1. **Missing Functionality**
- ❌ Menu bar tabs not fully functional
- ❌ Buttons not connected to actual functions
- ❌ No real data integration
- ❌ Missing futuristic UI elements
- ❌ No proper state management
- ❌ Incomplete Solana wallet integration

### 2. **Design Issues**
- ❌ Not futuristic enough
- ❌ Missing holographic effects
- ❌ No 3D elements
- ❌ Poor color scheme implementation
- ❌ Missing animations and transitions

## 🎯 COMPREHENSIVE FIX REQUIREMENTS

### **Phase 1: Core Functionality Integration**

**1.1 Menu Bar & Navigation**
```typescript
// Updated sidebar navigation with current structure
const dashboardItems = [
  { name: 'Decentralized Productivity Hub', icon: <HomeIcon />, component: <DecentralizedProductivityHub /> },
  { name: 'Chat & Services Hub', icon: <ChatIcon />, component: <ChatServicesTab /> },
  { name: 'Agent Minting', icon: <AddIcon />, component: <TestMinting /> },
  { name: 'Marketplace', icon: <StoreIcon />, component: <Marketplace /> },
  { name: 'Staking & Rewards', icon: <TrendingUpIcon />, component: <EnhancedStakingTab /> },
  { name: 'DAO Governance', icon: <AccountBalanceIcon />, component: <ProposalsTab /> },
  { name: 'IDO/ICO Launchpad', icon: <RocketLaunchIcon />, component: <IDOComponent /> },
  { name: 'Agent Management', icon: <PsychologyIcon />, component: <AgentManagement /> },
  { name: 'Multi-Domain Dashboard', icon: <DashboardIcon />, component: <MasterAgentDashboard /> },
  { name: 'History & Evolution Tracker', icon: <TimelineIcon />, component: <AgentEvolutionTracker /> },
  { name: 'Subscription Management', icon: <StarIcon />, component: <SubscriptionDashboard /> },
  { name: 'Burning Analytics', icon: <FireIcon />, component: <BurningDashboard /> },
  { name: 'Tokenomics Dashboard', icon: <AccountBalanceIcon />, component: <TokenomicsDashboard /> },
  { name: 'Professional Services', icon: <EngineeringIcon />, component: <ProfessionalServices /> },
  { name: 'Metaverse Hub', icon: <ViewInArIcon />, component: <MetaverseHub /> },
];
```

**1.2 Button Functionality Tracking**
Create a comprehensive button tracking system:
```typescript
// Button tracking system
interface ButtonAction {
  id: string;
  name: string;
  category: 'authentication' | 'agent' | 'staking' | 'governance' | 'ido' | 'chat' | 'co2';
  status: 'working' | 'broken' | 'pending';
  description: string;
  testFunction: () => Promise<boolean>;
}

const buttonTracker: ButtonAction[] = [
  {
    id: 'connect-wallet',
    name: 'Connect Phantom Wallet',
    category: 'authentication',
    status: 'working',
    description: 'Connects Solana wallet with Firebase authentication',
    testFunction: async () => {
      // Test wallet connection
      return true;
    }
  },
  {
    id: 'mint-agent',
    name: 'Mint AI Agent',
    category: 'agent',
    status: 'working',
    description: 'Creates new AI agent with Solana transaction and Firebase storage',
    testFunction: async () => {
      // Test agent minting
      return true;
    }
  },
  // Add more button actions...
];
```

### **Phase 2: Firebase Integration (COMPLETED)**

**2.1 Firebase Configuration**
```typescript
// app/lib/firebase.ts - COMPLETED
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase with error handling
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
```

**2.2 Solana Wallet Integration**
```typescript
// app/lib/solana.ts - COMPLETED
export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: 0,
    network: 'devnet'
  });

  const connectWallet = async () => {
    // Connect Phantom wallet and authenticate with Firebase
    const phantom = (window as any).solana;
    const response = await phantom.connect();
    const publicKey = response.publicKey.toString();
    
    // Sign message for authentication
    const message = `Login to DecentraMind - ${Date.now()}`;
    const signature = await phantom.signMessage(new TextEncoder().encode(message));
    
    // Authenticate with Firebase
    await signInWithSolana(publicKey, signature);
  };
};
```

**2.3 Redux State Management**
```typescript
// app/store/agentSlice.ts - COMPLETED
export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    addAgent: (state, action: PayloadAction<Agent>) => {
      state.agents.push(action.payload);
      state.metrics.active_agents = state.agents.length;
    },
    updateMetrics: (state, action: PayloadAction<Partial<UserMetrics>>) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
    incrementXP: (state, action: PayloadAction<number>) => {
      state.metrics.total_xp += action.payload;
    },
    incrementDMT: (state, action: PayloadAction<number>) => {
      state.metrics.total_dmt_earned += action.payload;
    }
  }
});
```

### **Phase 3: Claude Code Hooks Integration (NEW)**

**3.1 Backend Setup**
```bash
# Clone Claude Code Hooks Mastery
git clone https://github.com/disler/claude-code-hooks-mastery.git decentramind-backend
cd decentramind-backend
pip install uv
uv sync
```

**3.2 API Integration**
```typescript
// app/api/claude-hook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { hookType, data } = await request.json();
    
    // Call Python hook script
    const { stdout, stderr } = await execAsync(
      `python ../decentramind-backend/.claude/hooks/${hookType}.py '${JSON.stringify(data)}'`
    );
    
    if (stderr) {
      console.error('Hook error:', stderr);
      return NextResponse.json({ error: stderr }, { status: 500 });
    }
    
    return NextResponse.json({ result: stdout });
  } catch (error) {
    console.error('Hook execution error:', error);
    return NextResponse.json({ error: 'Hook execution failed' }, { status: 500 });
  }
}
```

**3.3 Hook Integration in Components**
```typescript
// app/components/QuickActions.tsx - UPDATED
const QuickActions: React.FC = () => {
  const dispatch = useDispatch();
  const { publicKey } = useWallet();

  const performAction = async (actionType: string, data: any) => {
    try {
      // Call Claude hook for action validation
      const hookResponse = await fetch('/api/claude-hook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hookType: 'pre_tool_use',
          data: { action: actionType, userData: data }
        })
      });

      const { result, error } = await hookResponse.json();
      
      if (error) {
        console.error('Hook validation failed:', error);
        return;
      }

      // Execute action if validated
      if (result === 'approved') {
        await dispatch(saveAgentData({ userId: publicKey, agentData: data }));
        
        // Post-action hook for logging
        await fetch('/api/claude-hook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hookType: 'post_tool_use',
            data: { action: actionType, result: 'success', userData: data }
          })
        });
      }
    } catch (error) {
      console.error('Action execution failed:', error);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2 }}>
        ⚡ Quick Actions
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #00ffff', 
            borderRadius: 3,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px #00ffff40'
            }
          }} onClick={() => performAction('mint_agent', { cost: 100 })}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <AddIcon sx={{ color: '#00ffff', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                  Mint Agent
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Create new AI agent ($1-$10)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Add more action cards... */}
      </Grid>
    </Box>
  );
};
```

### **Phase 4: Futuristic Design Implementation**

**4.1 Holographic Effects**
```css
/* Add to globals.css */
.holographic-gradient {
  background: linear-gradient(
    45deg,
    rgba(0, 212, 255, 0.1) 0%,
    rgba(46, 213, 115, 0.1) 25%,
    rgba(255, 107, 107, 0.1) 50%,
    rgba(156, 39, 176, 0.1) 75%,
    rgba(0, 212, 255, 0.1) 100%
  );
  animation: holographic-shift 8s ease-in-out infinite;
}

@keyframes holographic-shift {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(180deg); }
}

.neon-glow {
  box-shadow: 
    0 0 5px currentColor,
    0 0 10px currentColor,
    0 0 15px currentColor,
    0 0 20px currentColor;
}

.cyber-border {
  position: relative;
  border: 2px solid transparent;
  background: linear-gradient(45deg, #00ffff, #2ed573, #ff6b6b, #9c27b0);
  background-clip: padding-box;
}

.cyber-border::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #00ffff, #2ed573, #ff6b6b, #9c27b0);
  z-index: -1;
  animation: cyber-scan 3s linear infinite;
}

@keyframes cyber-scan {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

**4.2 3D Elements with Three.js**
```typescript
// app/components/3DAvatar.tsx
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

const AgentAvatar3D = ({ agent }) => {
  return (
    <Canvas style={{ height: '200px', width: '200px' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={agent.type === 'VisionSync' ? '#00ffff' : '#2ed573'}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Canvas>
  );
};
```

**4.3 Advanced Animations**
```typescript
// app/components/AnimatedBackground.tsx
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <motion.div
      className="holographic-gradient"
      animate={{
        background: [
          'linear-gradient(45deg, rgba(0,212,255,0.1) 0%, rgba(46,213,115,0.1) 100%)',
          'linear-gradient(45deg, rgba(46,213,115,0.1) 0%, rgba(255,107,107,0.1) 100%)',
          'linear-gradient(45deg, rgba(255,107,107,0.1) 0%, rgba(156,39,176,0.1) 100%)',
          'linear-gradient(45deg, rgba(156,39,176,0.1) 0%, rgba(0,212,255,0.1) 100%)'
        ]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};
```

### **Phase 5: Real Data Integration**

**5.1 Firebase Real-time Sync**
```typescript
// app/hooks/useFirebaseSync.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { listenToData } from '../lib/firebase';
import { updateAgentData, updateMetrics } from '../store/agentSlice';

export const useFirebaseSync = (userId: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen to agent updates
    const unsubscribeAgents = listenToData(`agents/${userId}`, (agents) => {
      dispatch(updateAgentData(agents));
    });

    // Listen to metrics updates
    const unsubscribeMetrics = listenToData(`user_metrics/${userId}`, (metrics) => {
      dispatch(updateMetrics(metrics));
    });

    return () => {
      unsubscribeAgents();
      unsubscribeMetrics();
    };
  }, [userId, dispatch]);
};
```

**5.2 Solana Integration**
```typescript
// app/services/solanaService.ts - ENHANCED
export class SolanaService {
  async mintAgent(agentData: AgentData): Promise<TransactionResult> {
    try {
      // Create Solana transaction
      const transaction = new Transaction();
      
      // Add mint instruction
      const mintInstruction = await this.createMintInstruction(agentData);
      transaction.add(mintInstruction);
      
      // Sign and send transaction
      const signature = await this.sendTransaction(transaction);
      
      // Save to Firebase
      await saveData(`agents/${agentData.owner}/${agentData.id}`, agentData);
      
      return { success: true, signature, data: agentData };
    } catch (error) {
      console.error('Mint agent failed:', error);
      return { success: false, error: error.message };
    }
  }
}
```

### **Phase 6: Button Functionality Verification**

**6.1 Create Button Test Suite**
```typescript
// app/components/ButtonTestSuite.tsx - ENHANCED
import React from 'react';
import { buttonTracker, runButtonTests, getButtonStatusSummary } from '../utils/buttonTracker';

const ButtonTestSuite = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    const results = await runButtonTests();
    setTestResults(results);
    setIsRunning(false);
  };

  const summary = getButtonStatusSummary();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#00ffff', mb: 3 }}>
        🧪 Button Functionality Test Suite
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#2ed573' }}>
                {summary.working}
              </Typography>
              <Typography variant="body2">Working</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Add more summary cards... */}
      </Grid>
      
      {/* Test Results */}
      <Button 
        variant="contained" 
        onClick={runAllTests}
        disabled={isRunning}
        sx={{ mb: 3 }}
      >
        {isRunning ? 'Running Tests...' : 'Run All Tests'}
      </Button>
      
      {/* Display test results... */}
    </Box>
  );
};
```

### **Phase 7: Implementation Checklist**

**7.1 Immediate Actions Required:**
- ✅ Fix Menu Bar Navigation
- ✅ Implement Button Tracking
- ✅ Add Futuristic Design Elements
- ✅ Real Data Integration
- ✅ State Management
- ✅ Firebase Integration (COMPLETED)
- 🔄 Claude Code Hooks Integration (IN PROGRESS)

**7.2 Verification Steps:**
```bash
npm run build
npm run test
npm run dev
```

### **Phase 8: Cursor Implementation Instructions**

**8.1 For Cursor AI:**
```
Please implement the complete DecentraMind front-end with the following requirements:

1. FIX THE MENU BAR: Make all sidebar navigation items fully functional with proper state management
2. ADD BUTTON FUNCTIONALITY: Implement real functionality for all buttons (create agent, stake DMT, etc.)
3. MAKE IT FUTURISTIC: Add holographic effects, 3D elements, cyber borders, and neon glows
4. INTEGRATE REAL DATA: Connect Firebase and Solana for actual data persistence
5. ADD TRACKING: Implement comprehensive button tracking and state management
6. VERIFY EVERYTHING: Create test suite to ensure all functionality works
7. INTEGRATE CLAUDE HOOKS: Add Python backend for agentic sub-agents
8. ENSURE NO DUPLICATES: Check for duplicate files and consolidate properly

Use the provided code snippets and follow the architecture in DECENTRAMIND_CURSOR_ARCHITECTURE.md
Priority: Fix menu bar first, then add button functionality, then make it futuristic, then integrate Claude hooks.
```

### **Phase 9: Testing Protocol**

**9.1 Manual Testing Checklist:**
- [ ] All sidebar tabs navigate correctly
- [ ] All buttons perform their intended functions
- [ ] Wallet connects and displays balance
- [ ] Agent creation works with real data
- [ ] Staking functionality processes transactions
- [ ] CO2 tracking calculates and stores data
- [ ] Chat system sends and receives messages
- [ ] Rewards system tracks and displays earnings
- [ ] Futuristic design elements are visible
- [ ] Animations and transitions are smooth
- [ ] Claude hooks validate actions properly
- [ ] TTS alerts work for notifications

**9.2 Automated Testing:**
```typescript
// tests/buttonFunctionality.test.ts
describe('Button Functionality Tests', () => {
  test('Wallet connection works', async () => {
    const result = await testWalletConnection();
    expect(result).toBe(true);
  });

  test('Agent minting works', async () => {
    const result = await testAgentMinting();
    expect(result.success).toBe(true);
  });

  test('Claude hooks validate actions', async () => {
    const result = await testClaudeHook('pre_tool_use', { action: 'mint_agent' });
    expect(result).toBe('approved');
  });
});
```

### **Phase 10: Production Deployment**

**10.1 Environment Setup:**
```bash
# Production environment variables
NEXT_PUBLIC_FIREBASE_API_KEY=your-production-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-production-domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-production-database
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-production-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-production-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-production-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-production-app-id

# Claude hooks configuration
CLAUDE_HOOKS_ENABLED=true
ELEVENLABS_API_KEY=your-elevenlabs-key
OPENAI_API_KEY=your-openai-key
```

**10.2 Deployment Commands:**
```bash
# Build and deploy
npm run build
firebase deploy --only hosting

# Test production
npm run test:production
```

This comprehensive prompt will ensure Cursor implements a fully functional, futuristic DecentraMind front-end with proper tracking, verification, Firebase integration, and Claude Code Hooks for advanced agentic capabilities. 