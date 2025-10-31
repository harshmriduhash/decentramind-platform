# DecentraMind Front-End Architecture for Cursor

This document provides a complete blueprint for building the DecentraMind front-end in Cursor, based on the current system (Next.js 14 App Router with React, Redux Toolkit, Tailwind CSS, Material-UI, Chart.js, Firebase, Solana Web3.js). It ensures a clean, user-friendly, futuristic interface for the ADHD-Friendly AI-Powered Productivity & Wellness Ecosystem, aligning with the "Swiss Army of AI Agents" vision. The architecture avoids duplicate files by consolidating components and libraries, verifying existing structure, and enforcing single instances. Build from the existing codebase, checking for duplicates at each step.

## 1. Objectives

- Create a responsive, WCAG 2.1 compliant UI with high-contrast visuals, large fonts (18px+), and minimal distractions for ADHD users.
- Integrate Firebase for authentication (Solana wallet), Realtime Database (agent/task/CO2 data), and Hosting.
- Integrate Solana for Phantom wallet, minting, staking, DAO, marketplace.
- Support VisionSync Agent (Main, Epic, $5) and DomainSync Agents (Sub, Common: $1, Rare: $2, Legendary: $10).
- Include tabs: Decentralized Productivity Hub, Multi-Domain Dashboard, Advanced Analytics, Quick Actions, Proposals, Staking, IDO/ICO, Chat/Services, Rewards, CO2 Tracking.
- Track agent history/evolution, data storage (on-chain: Solana PDAs/IPFS; off-chain: Firebase/Arweave).
- Verify 1B DMT total supply (1B utility, 10M DMTX governance).
- No duplicate files: Scan with `find . -name "*.rs" -o -name "*.tsx"`, consolidate to single instances (e.g., frontend_crm.rs in programs/decentramind/src/, React components in src/components/).

## 2. Architecture Overview

- **Frontend**: Next.js 14 App Router, React v18 (app/page.tsx as entry), Redux Toolkit (app/store/agentSlice.ts) for state management.
- **Styling**: Material-UI (@mui/material@5) for components, Chart.js/react-chartjs-2@5 for charts, custom CSS for futuristic effects.
- **Blockchain**: @solana/web3.js@1 (app/lib/solana.ts) for Phantom wallet, minting (onchain/programs/agent/), staking (onchain/programs/dao/), DAO governance.
- **Backend**: Firebase v10 (app/lib/firebase.ts) for authentication (custom Solana tokens), Realtime Database, Storage, Hosting.
- **State Management**: Redux Toolkit with Firebase integration for real-time data synchronization.
- **AI Integration**: OpenAI for ChatGPT, xAI for Grok, CrewAI, LLaMA/LLaMA 3, Claude Code Hooks for agentic sub-agents.
- **APIs**: PCAF for CO2, DALL-E/Whisper for visual/voice, Arweave for private storage.
- **Privacy**: ZKPs (zk_ml_vault.rs), Chainlink for verification.
- **Claude Code Hooks**: Python backend for deterministic AI behavior and sub-agent control.
- **Duplicate Check**: At start, run `find . -name "*.rs" -o -name "*.tsx"`; remove duplicates, consolidate React to app/components/, Solana to onchain/programs/. Rebuild with `npm run build` and `cargo build-sbf`.

## 3. Visual Design

- **Color Scheme**: Midnight Blue (#1A2A44, background), Neon Cyan (#00D4FF, accents), Pure White (#FFFFFF, text), Steel Gray (#6B7280, secondary), Emerald Green (#2ed573, success), Coral (#ff6b6b, urgent tasks), Purple (#9c27b0, IDO/ICO), Gold (#ffc107, marketplace).
- **Futuristic Aesthetics**: Holographic gradients, sci-fi typography (Orbitron), 3D avatars (Three.js), toggleable animations (Framer Motion).
- **ADHD-Friendly**: High-contrast, minimal animations, large fonts (18px+), collapsible elements to reduce clutter.
- **Implementation**: Update tailwind.config.js with colors, import Orbitron font, add Three.js for avatars in AIAgentsStatus.tsx.

## 4. Layouts

### Home Page (pages/Home.tsx): Entry point with tab navigation.

**Structure**: Collapsible sidebar (Personal: Hub, Quick Actions, Chat/Services, CO2 Tracking; Enterprise: Multi-Domain, Analytics, Proposals, Staking, IDO/ICO, Rewards), main content area.

**Look**: Midnight Blue background, Steel Gray sidebar, Neon Cyan icons with tooltips.

- **Decentralized Productivity Hub**: Personal agent management.
- **Multi-Domain Dashboard**: Enterprise domain tabs (Crypto, Language, Trading, Environmental).
- **Other Tabs**: Analytics (charts), Quick Actions (searchable bar), Proposals (form/list), Staking (slider), IDO/ICO (progress/form), Chat/Services (TikTok-like chat, service list), Rewards (earnings/badges), CO2 Tracking (footprint chart).

## 5. Components

### 5.1 Home (pages/Home.tsx)

**Purpose**: Tab navigation and wallet connection.

**Look**: Header with Phantom icon, Neon Cyan wallet address.

**Functionality**: UseWallet from solana.ts for connection, Redux for activeTab.

**Code**:
```typescript
import React from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '../lib/solana';
import DecentralizedProductivityHub from '../components/DecentralizedProductivityHub';
import MultiDomainDashboard from '../components/MultiDomainDashboard';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import QuickActions from '../components/QuickActions';
import ProposalsTab from '../components/ProposalsTab';
import StakingTab from '../components/StakingTab';
import IDOComponent from '../components/IDOComponent';
import ChatServicesTab from '../components/ChatServicesTab';
import RewardsDashboard from '../components/RewardsDashboard';
import CO2TrackingTab from '../components/CO2TrackingTab';

const Home: React.FC = () => {
  const { walletAddress } = useWallet();
  const { activeTab } = useSelector((state: any) => state.ui);
  const tabs = [
    { label: 'Hub', component: <DecentralizedProductivityHub /> },
    { label: 'Multi-Domain', component: <MultiDomainDashboard /> },
    { label: 'Analytics', component: <AdvancedAnalytics /> },
    { label: 'Quick Actions', component: <QuickActions /> },
    { label: 'Proposals', component: <ProposalsTab /> },
    { label: 'Staking', component: <StakingTab /> },
    { label: 'IDO/ICO', component: <IDOComponent /> },
    { label: 'Chat/Services', component: <ChatServicesTab /> },
    { label: 'Rewards', component: <RewardsDashboard /> },
    { label: 'CO2 Tracking', component: <CO2TrackingTab /> }
  ];

  return (
    <div className="min-h-screen bg-midnight-blue text-white p-4">
      <header className="flex items-center mb-4">
        <img src="/phantom-icon.png" alt="Phantom" className="w-8 h-8 mr-2" />
        <span className="text-neon-cyan text-lg">{walletAddress?.slice(0, 4)}..{walletAddress?.slice(-4)}</span>
      </header>
      <nav className="bg-steel-gray rounded-lg p-2 mb-4 flex space-x-4">
        {tabs.map(tab => (
          <button key={tab.label} className={`text-neon-cyan text-lg ${activeTab === tab.label ? 'underline' : ''}`}>
            {tab.label}
          </button>
        ))}
      </nav>
      {tabs.find(tab => tab.label === activeTab)?.component}
    </div>
  );
};
export default Home;
```

### 5.2 Decentralized Productivity Hub (components/DecentralizedProductivityHub.tsx)

**Purpose**: Displays metrics (Daily Life Score: 85, Focus Time: 120m, Streak: 7 days, Active Agents: 2, Total XP: 2,022), Chart.js bar chart, credit balance, Rewards Dashboard, CO2 Tracking Tab.

**Look**: Steel Gray cards, Neon Cyan headers, Emerald Green metrics, Coral urgent tasks.

**Functionality**: Fetches from Firebase, synced with Solana PDAs (tracking_module.rs).

**Code**:
```typescript
import React from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const DecentralizedProductivityHub: React.FC = () => {
  const { dailyLifeScore, focusTime, streak, activeAgents, totalXP } = useSelector((state: any) => state.agents);
  const chartData = {
    labels: ['Work & Productivity', 'Health & Wellness', 'Learning & Growth', 'Creative & Hobbies'],
    datasets: [{ data: [85, 70, 90, 65], backgroundColor: '#00D4FF', borderColor: '#2ed573', borderWidth: 1 }]
  };

  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">🎯 Dashboard Overview</h2>
      <div className="grid grid-cols-2 gap-4 mt-2 text-lg">
        <div>Daily Life Score: <span className="text-emerald-green">{dailyLifeScore}</span></div>
        <div>Focus Time: <span className="text-emerald-green">{focusTime}m</span></div>
        <div>Current Streak: <span className="text-emerald-green">{streak} days</span></div>
        <div>Active Agents: <span className="text-emerald-green">{activeAgents}</span></div>
        <div>Total XP: <span className="text-emerald-green">{totalXP}</span></div>
      </div>
      <h2 className="text-lg font-semibold text-neon-cyan mt-4">🌟 Daily Life Categories</h2>
      <Bar data={chartData} options={{ scales: { y: { max: 100 } } }} />
    </section>
  );
};
export default DecentralizedProductivityHub;
```

### 5.3 Multi-Domain Dashboard (components/MultiDomainDashboard.tsx)

**Purpose**: Tabbed interface for domains (Crypto, Language, Trading, Blockchain, Research, Creative, Fitness, Environmental, Social, Business, Health, Security, Analytics).

**Look**: Neon Cyan tabs, Steel Gray background, Emerald Green active states.

**Functionality**: Domain-specific metrics, team collaboration.

**Code**:
```typescript
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';

const MultiDomainDashboard: React.FC = () => {
  const [value, setValue] = useState(0);

  const domains = ['Crypto', 'Language', 'Trading', 'Blockchain', 'Research', 'Creative', 'Fitness', 'Environmental', 'Social', 'Business', 'Health', 'Security', 'Analytics'];

  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">Multi-Domain Dashboard</h2>
      <Tabs value={value} onChange={(_, newValue) => setValue(newValue)} centered>
        {domains.map(domain => <Tab label={domain} key={domain} />)}
      </Tabs>
      <div>Team Metrics for {domains[value]}: [Metrics Here]</div>
    </section>
  );
};
export default MultiDomainDashboard;
```

### 5.4 Advanced Analytics (components/AdvancedAnalytics.tsx)

**Purpose**: Performance trends, predictive insights.

**Look**: Neon Cyan charts, White text.

**Functionality**: Chart.js for data visualization, Firebase sync.

**Code**:
```typescript
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const AdvancedAnalytics: React.FC = () => {
  const chartData = {
    labels: ['Trend 1', 'Trend 2', 'Trend 3'],
    datasets: [{ data: [65, 59, 80], backgroundColor: '#00D4FF' }]
  };

  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">Advanced Analytics</h2>
      <Bar data={chartData} />
    </section>
  );
};
export default AdvancedAnalytics;
```

### 5.5 Quick Actions (components/QuickActions.tsx)

**Purpose**: Searchable action bar for task creation, minting, customization, staking, proposals, IDO/ICO, services, CO2 tracking.

**Look**: Neon Cyan input/buttons, White text, Steel Gray hover effects.

**Functionality**: Triggers Solana transactions, Firebase updates, LLM selection.

**Code**:
```typescript
import React, { useState } from 'react';
import { useWallet } from '../lib/solana';
import { saveAgentData } from '../store/agentSlice';
import { useDispatch } from 'react-redux';

const QuickActions: React.FC = () => {
  const { walletAddress } = useWallet();
  const dispatch = useDispatch();
  const [action, setAction] = useState('');

  const performAction = async () => {
    if (!walletAddress) return;
    // Handle actions like minting, task creation, etc.
    await dispatch(saveAgentData(walletAddress, { action }));
  };

  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">⚡ Quick Actions</h2>
      <input className="bg-midnight-blue text-white p-2 text-lg" value={action} onChange={(e) => setAction(e.target.value)} placeholder="Search actions..." />
      <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg" onClick={performAction}>Execute</button>
      <div className="flex space-x-2 mt-2">
        <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg">Mint Agent ($1–$10)</button>
        <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg">Customize LLM</button>
        <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg">Stake DMT</button>
        <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg">Submit Proposal</button>
        <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg">Contribute to IDO</button>
        <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg">Buy Service</button>
        <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg">Track CO2</button>
      </div>
    </section>
  );
};
export default QuickActions;
```

### 5.6 Proposals Tab (components/ProposalsTab.tsx)

**Purpose**: Submit/vote on DMTX DAO proposals (0.1–1 DMT rewards, 25M DMT quorum, 10M DMTX governance).

**Look**: Neon Cyan "Submit Proposal" button, Purple accents.

**Functionality**: Phantom wallet signing, Firebase storage.

**Code**:
```typescript
import React, { useState } from 'react';
import { useWallet } from '../lib/solana';
import { saveAgentData } from '../store/agentSlice';
import { useDispatch } from 'react-redux';

const ProposalsTab: React.FC = () => {
  const { walletAddress } = useWallet();
  const dispatch = useDispatch();
  const [proposal, setProposal] = useState('');

  const submitProposal = async () => {
    if (!walletAddress) return;
    await dispatch(saveAgentData(walletAddress, { proposal }));
    // Trigger Solana transaction (governance_contract.rs)
  };

  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">📜 DMTX DAO Proposals</h2>
      <input className="bg-midnight-blue text-white p-2 text-lg" value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Enter proposal..." />
      <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg" onClick={submitProposal}>Submit</button>
    </section>
  );
};
export default ProposalsTab;
```

### 5.7 Staking Tab (components/StakingTab.tsx)

**Purpose**: Lock 1–100 DMT for 5–10% APY, 1 credit/10 DMT.

**Look**: Steel Gray slider, Neon Cyan "Stake DMT" button, Gold rewards.

**Functionality**: Solana transaction, Firebase updates.

**Code**:
```typescript
import React, { useState } from 'react';
import { useWallet } from '../lib/solana';
import { saveAgentData } from '../store/agentSlice';
import { useDispatch } from 'react-redux';

const StakingTab: React.FC = () => {
  const { walletAddress } = useWallet();
  const dispatch = useDispatch();
  const [dmtAmount, setDmtAmount] = useState(1);

  const stakeDMT = async () => {
    if (!walletAddress) return;
    await dispatch(saveAgentData(walletAddress, { stakedDMT: dmtAmount }));
    // Trigger Solana transaction (staking_contract.rs)
  };

  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">💰 DMT Staking</h2>
      <input type="range" min="1" max="100" value={dmtAmount} onChange={(e) => setDmtAmount(Number(e.target.value))} className="bg-steel-gray" />
      <span className="text-white">{dmtAmount} DMT</span>
      <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg" onClick={stakeDMT}>Stake</button>
    </section>
  );
};
export default StakingTab;
```

### 5.8 IDO/ICO Tab (components/IDOComponent.tsx)

**Purpose**: Facilitate $200K–$400K contributions (500–1,000 DMT rewards).

**Look**: Neon Cyan progress bar, Purple "Contribute" button.

**Functionality**: SOL/USDC contributions via Phantom, Firebase logging.

**Code**:
```typescript
import React from 'react';
import { useWallet } from '../lib/solana';
import { saveAgentData } from '../store/agentSlice';
import { useDispatch } from 'react-redux';

const IDOComponent: React.FC = () => {
  const { walletAddress } = useWallet();
  const dispatch = useDispatch();

  const contribute = async () => {
    if (!walletAddress) return;
    await dispatch(saveAgentData(walletAddress, { contribution: 50 }));
    // Trigger Solana transaction (liquidity_pool.rs)
  };

  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">IDO/ICO</h2>
      <div className="bg-neon-cyan h-4 rounded" style={{ width: '75%' }}></div>
      <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg" onClick={contribute}>Contribute</button>
    </section>
  );
};
export default IDOComponent;
```

### 5.9 Chat/Services Tab (components/ChatServicesTab.tsx)

**Purpose**: TikTok-like chat, AI/blockchain security services ($5K–$50K).

**Look**: Neon Cyan messages, Emerald Green notifications, Gold "Buy Service" button.

**Functionality**: Firebase Realtime Database for messages, ZKP-encrypted (zk_ml_vault.rs).

**Code**:
```typescript
import React from 'react';

const ChatServicesTab: React.FC = () => {
  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">Chat/Services</h2>
      <div className="bg-midnight-blue p-2 mb-2">Chat Message: Hello</div>
      <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg">Buy Service</button>
    </section>
  );
};
export default ChatServicesTab;
```

### 5.10 Rewards Dashboard (components/RewardsDashboard.tsx)

**Purpose**: Shows DMT/DMTX earnings (e.g., "0.5 DMT from Task").

**Look**: Emerald Green text, Gold badges.

**Functionality**: Fetches from Firebase, synced with Solana (reward_contract.rs).

**Code**:
```typescript
import React from 'react';
import { useSelector } from 'react-redux';

const RewardsDashboard: React.FC = () => {
  const { rewards } = useSelector((state: any) => state.agents);

  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">Rewards Dashboard</h2>
      <div className="text-emerald-green text-lg">{rewards} DMT</div>
    </section>
  );
};
export default RewardsDashboard;
```

### 5.11 CO2 Tracking Tab (components/CO2TrackingTab.tsx)

**Purpose**: Displays user footprint (2,365.4 kg CO2e, 57% Shopping), PostFinance avg. (1,944.7 kg), 2030 target (715.1 kg), suggestions, rewards.

**Look**: Neon Cyan charts, Emerald Green rewards, Coral urgent actions.

**Functionality**: Analyzes Solana wallet transactions, calculates CO2e (PCAF), stores in PDAs/Firebase, rewards via reward_contract.rs.

**Code**:
```typescript
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const CO2TrackingTab: React.FC = () => {
  const chartData = {
    labels: ['Shopping', 'Residing', 'Leisure', 'Mobility', 'Living', 'Finances'],
    datasets: [{ data: [57, 14, 12, 8, 7, 3], backgroundColor: '#00D4FF', borderColor: '#2ed573', borderWidth: 1 }]
  };

  return (
    <section className="bg-steel-gray rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold text-neon-cyan">CO2 Footprint</h2>
      <div className="text-white text-lg">My Footprint: 2,365.4 kg CO2e</div>
      <div className="text-white text-lg">Avg.: 1,944.7 kg</div>
      <div className="text-white text-lg">2030 Target: 715.1 kg</div>
      <Bar data={chartData} options={{ scales: { y: { max: 100 } } }} />
      <button className="bg-neon-cyan text-white px-4 py-2 rounded text-lg">Reduce Footprint</button>
    </section>
  );
};
export default CO2TrackingTab;
```

## 6. Data Storage and Security

- **On-Chain**: Solana PDAs ($0.02/record) for stats (Level, XP, Performance, Skills, CO2 footprint), IPFS (Pinata, $0.01/GB) for metadata, ZKPs (zk_ml_vault.rs) for privacy.
- **Off-Chain**: Firebase for task logs, user data (1GB/user), CO2 transaction logs, AES-256 encryption.
- **Private Storage**: Arweave ($0.01/GB, $10K/year for 1TB) for sensitive files.

## 7. Tokenomics Verification

- **Total Supply**: 1B DMT (utility), 10M DMTX (governance).
- **Allocation**: Public Sale (15%), Liquidity (10%), Ecosystem (16%), Treasury (30%), Founders (10%), Team (3%), Advisors (3%), Investors (7%), Marketing/Partners (6%).
- **Burns**: 30–40M DMT/year, ~800M supply by Year 5.
- **Rewards**: 0.05–0.5 DMT/task, 0.1–1 DMT/proposal, 0.1–0.5 DMT/CO2 reduction, within Ecosystem allocation.

## 8. Resolving Duplicate File Issues

**Solution**:

1. Run: `find . -name "*.rs" -o -name "*.tsx"`
2. Consolidate to single frontend_crm.rs in programs/decentramind/src/.
3. Merge React components into src/components/.
4. Update Cargo.toml:
```toml
[package]
name = "decentramind"
version = "0.1.0"
edition = "2021"
[dependencies]
solana-program = "1.18.17"
borsh = "0.9"
```
5. Clean/Rebuild: `cargo clean && npm cache clean --force`, `cargo build-sbf && npm run build`.

## 9. Implementation in Cursor

**Setup**: Install Cursor (cursor.sh), configure GPT-4o, add extensions (Prettier, ESLint, Tailwind CSS IntelliSense).

**Code**: Update Home.tsx with tabs, add components as above.

**Prompt**: Use the architecture above to build the DecentraMind front-end, ensuring no duplicate files are created. Verify each component exists before creating new ones. Check for existing implementations in the current codebase and extend them rather than creating duplicates.

**Verification Steps**:
1. Run `find . -name "*.tsx"` to identify all React components
2. Check for duplicate component names
3. Verify all imports are working
4. Test each tab functionality
5. Ensure Firebase and Solana integrations work
6. Verify tokenomics numbers match specifications
7. Test ADHD-friendly design elements
8. Confirm WCAG 2.1 compliance

**Build Commands**:
```bash
# Clean and rebuild
npm cache clean --force
rm -rf .next
npm install
npm run build

# Solana programs
cargo clean
cargo build-sbf

# Test
npm run dev
```

This architecture ensures a complete, non-duplicate implementation of the DecentraMind front-end with all specified features, proper integrations, and ADHD-friendly design. 