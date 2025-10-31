<<<<<<< HEAD
# 🧠 DecentraMind - ADHD-Friendly AI-Powered Productivity & Wellness Ecosystem

> **"Swiss Army of AI Agents"** - A decentralized platform for AI agent management, productivity tracking, and wellness optimization with Solana blockchain integration.

## 🚀 Features

### 🔐 **Authentication & Security**
- **Solana Wallet Integration**: Phantom wallet authentication with Firebase custom tokens
- **Real-time Authentication**: Secure wallet-based login with signature verification
- **Firebase Security**: Role-based access control and data protection

### 🤖 **AI Agent Management**
- **VisionSync Agents**: Main AI agents ($5) for comprehensive task management
- **DomainSync Agents**: Specialized sub-agents ($1-$10) for specific domains
- **Agent Evolution**: Real-time XP tracking, level progression, and skill development
- **Agent Minting**: Create new AI agents with customizable domains and personalities

### 📊 **Productivity & Analytics**
- **Decentralized Productivity Hub**: Personal productivity dashboard with real-time metrics
- **Multi-Domain Dashboard**: Enterprise domain management (Crypto, Language, Trading, Environmental)
- **Advanced Analytics**: Performance insights with Chart.js visualizations
- **CO2 Tracking**: Carbon footprint monitoring with PCAF methodology

### 💰 **Tokenomics & Rewards** ✅ **FULLY IMPLEMENTED**
- **✅ DMT Token Balance**: Real-time display (1B total supply) in economic status bar
- **✅ SOL Balance Display**: Real-time wallet integration with live updates
- **✅ Tokenomics Dashboard**: Interactive visualization with pie charts and metrics
- **✅ Token Metrics**: Live tracking of supply, circulation, burned, and staked amounts
- **✅ Staking System**: 9-28% APY with real blockchain transactions and tiered rewards
- **✅ Token Burning**: Real blockchain burning with comprehensive analytics dashboard
- **✅ Rewards Dashboard**: Track earnings from tasks, proposals, and platform participation

### 🏛️ **DAO Governance**
- **Proposal System**: Submit and vote on platform governance proposals
- **Voting Mechanism**: DMTX-based voting with quorum requirements
- **Reward Distribution**: 0.1-1 DMT rewards for active participation

### 🚀 **IDO/ICO Launchpad**
- **Token Offerings**: Participate in new project fundraising
- **Vesting Periods**: Structured token release schedules
- **Investment Tracking**: Monitor portfolio performance

### 💬 **Communication & Services**
- **Agent Chat**: Real-time communication with AI agents
- **TikTok-style Interface**: Modern chat experience with media support
- **AI Services**: Blockchain security and AI-powered services ($5K-$50K)

### 🌟 **DML Strategy & Business Model** ✅ **LIVE**
- **✅ Task Delegation**: Pay-per-task model (10-50 DMT) with real blockchain payments
- **✅ Agent Marketplace**: Subscription bundles (100-500 DMT/month) with live management
- **✅ Master Agent Bundles**: Curated packages saving users ~40% vs individual purchases
- **✅ XP System**: Agent evolution and user progression tracking (ready for smart contract)
- **✅ Staking Tiers**: 4 tiers (3M-24M lockup) with 9-28% APY and governance rights
- **✅ Anti-Dumping**: Vesting, cooldowns, exit fees, and re-staking bonuses implemented

## 🏗️ Architecture

### **Frontend Stack**
- **Next.js 14**: React framework with App Router
- **React 18**: Latest React features with concurrent rendering
- **TypeScript**: Type-safe development
- **Material-UI v5**: Component library with custom theme
- **Framer Motion**: Smooth animations and transitions
- **Chart.js**: Data visualization and analytics

### **Backend & Database**
- **Firebase v10**: Authentication, Realtime Database, Storage, Hosting
- **Redux Toolkit**: Global state management with Firebase integration
- **Real-time Sync**: Live data updates across all components

### **Blockchain Integration**
- **Solana Web3.js**: Blockchain interaction and transaction handling
- **Phantom Wallet**: Secure wallet connection and transaction signing
- **Smart Contracts**: Agent evolution, governance, and staking contracts

### **AI & ML Integration**
- **OpenAI API**: ChatGPT integration for agent responses
- **LLaMA/LLaMA 3**: Alternative AI models for specialized tasks
- **CrewAI**: Multi-agent orchestration
- **xAI Grok**: Advanced reasoning capabilities

## 📁 Project Structure

```
DecentraMind/
├── app/                          # Next.js App Router
│   ├── components/               # React components
│   │   ├── FuturisticSidebar.tsx # Collapsible navigation
│   │   ├── TestMinting.tsx       # Agent minting interface
│   │   ├── QuickActions.tsx      # Fast action execution
│   │   ├── ProposalsTab.tsx      # DAO governance
│   │   ├── StakingTab.tsx        # Token staking
│   │   ├── IDOComponent.tsx      # Token offerings
│   │   ├── CO2TrackingTab.tsx    # Carbon footprint
│   │   ├── ChatServicesTab.tsx   # Communication hub
│   │   ├── RewardsDashboard.tsx  # Earnings tracking
│   │   ├── AgentChatHistory.tsx  # Agent communication
│   │   ├── ButtonTestSuite.tsx   # Functionality testing
│   │   └── EnhancedCRMDashboard.tsx # Analytics dashboard
│   ├── lib/                      # Core libraries
│   │   ├── firebase.ts           # Firebase configuration
│   │   └── solana.ts             # Solana wallet integration
│   ├── store/                    # Redux state management
│   │   ├── agentSlice.ts         # Agent data management
│   │   └── store.ts              # Redux store configuration
│   ├── providers/                # Context providers
│   │   ├── ReduxProvider.tsx     # Redux store provider
│   │   ├── ThemeProvider.tsx     # Material-UI theme
│   │   └── WalletProvider.tsx    # Solana wallet provider
│   ├── services/                 # Business logic
│   │   ├── agentService.ts       # Agent management
│   │   └── solanaService.ts      # Blockchain operations
│   ├── api/                      # API routes
│   │   └── auth/solana/route.ts  # Solana authentication
│   ├── utils/                    # Utility functions
│   │   └── buttonTracker.ts      # Functionality tracking
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main dashboard
├── onchain/                      # Solana smart contracts
│   └── programs/
│       ├── agent/                # Agent evolution contracts
│       └── dao/                  # Governance contracts
├── docs/                         # Documentation
├── FIREBASE_SETUP.md             # Firebase integration guide
└── README.md                     # This file
```

## 🎨 Design System

### **Color Palette**
- **Midnight Blue** (#1A2A44): Primary background
- **Neon Cyan** (#00D4FF): Accent color and highlights
- **Pure White** (#FFFFFF): Text and primary elements
- **Steel Gray** (#6B7280): Secondary elements
- **Emerald Green** (#2ed573): Success states
- **Coral** (#ff6b6b): Urgent actions
- **Purple** (#9c27b0): IDO/ICO elements
- **Gold** (#ffc107): Marketplace and rewards

### **Typography**
- **Orbitron**: Futuristic headings and navigation
- **Inter**: Body text and UI elements
- **18px+**: Large fonts for ADHD-friendly design

### **Accessibility**
- **WCAG 2.1 Compliance**: High contrast and readable fonts
- **ADHD-Friendly**: Minimal distractions, clear navigation
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### **Prerequisites**
- Node.js 20.18.0+
- Python 3.12+ (for Claude Code Hooks)
- Phantom Wallet browser extension
- Solana devnet SOL (for testing)

### **Installation**

1. **Clone the repository**:
```bash
git clone https://github.com/your-org/decentramind.git
cd decentramind
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase and Solana credentials
```

4. **Start development server**:
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

### **🌟 Key Features to Explore**
Once running, check out these live features:
- **📊 Economic Status Bar**: Real-time DMT/SOL balance display at the top
- **🪙 Tokenomics Dashboard**: Navigate to "Tokenomics Dashboard" in sidebar for comprehensive visualization
- **🔥 Token Burning**: Visit "Burning Analytics" for real-time burning metrics
- **💎 Staking System**: Access "Staking & Rewards" for live staking with real transactions
- **🏪 Marketplace**: Browse and trade agents with real blockchain transactions
- **🏛️ DAO Governance**: Participate in governance through "DAO Governance" tab

### **Firebase Setup**
Follow the comprehensive guide in `FIREBASE_SETUP.md` for:
- Firebase project creation
- Authentication configuration
- Database setup
- Security rules
- Deployment instructions

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### **Development Ports**
- **Frontend**: http://localhost:3000
- **Firebase Emulator**: http://localhost:4000
- **Solana Devnet**: https://api.devnet.solana.com

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Wallet connection and authentication
- [ ] Agent creation and minting
- [ ] Real-time data synchronization
- [ ] CO2 tracking and calculations
- [ ] Staking and rewards
- [ ] DAO proposal creation and voting
- [ ] IDO participation
- [ ] Chat and messaging
- [ ] File upload and storage

### **Automated Testing**
```bash
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Run tests with coverage
```

## 🚀 Deployment

### **Firebase Hosting**
```bash
npm run build
firebase deploy --only hosting
```

### **Environment Configuration**
- **Development**: Uses Firebase emulators
- **Staging**: Firebase staging project
- **Production**: Firebase production project

## 📊 Tokenomics

### **DMT Token (Utility)**
- **Total Supply**: 1,000,000,000 DMT
- **Allocation**:
  - Public Sale: 15% (150M DMT)
  - Liquidity: 10% (100M DMT)
  - Ecosystem: 16% (160M DMT)
  - Treasury: 30% (300M DMT)
  - Founders: 10% (100M DMT)
  - Team: 3% (30M DMT)
  - Advisors: 3% (30M DMT)
  - Investors: 7% (70M DMT)
  - Marketing/Partners: 6% (60M DMT)

### **DMTX Token (Governance)**
- **Total Supply**: 10,000,000 DMTX
- **Purpose**: DAO governance and voting
- **Quorum**: 25M DMT for proposals, 10M DMTX for governance

### **Rewards System**
- **Task Completion**: 0.05-0.5 DMT per task
- **Proposal Participation**: 0.1-1 DMT per proposal
- **CO2 Reduction**: 0.1-0.5 DMT per reduction
- **Staking Rewards**: 5-10% APY

## 🔒 Security

### **Authentication Security**
- Solana signature verification
- Firebase custom tokens
- Secure wallet connection
- Session management

### **Data Security**
- User-based access control
- Real-time security rules
- Data validation
- Privacy protection

### **Smart Contract Security**
- Audited Solana programs
- Access control mechanisms
- Emergency pause functionality
- Upgradeable contracts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### **Code Style**
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write comprehensive tests
- Document new features

## 📞 Support

### **Documentation**
- [Firebase Setup Guide](FIREBASE_SETUP.md)
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Development Guide](docs/DEVELOPMENT.md)

### **Community**
- **Discord**: [DecentraMind Community](https://discord.gg/decentramind)
- **Twitter**: [@DecentraMindAI](https://twitter.com/DecentraMindAI)
- **GitHub**: [Issues](https://github.com/your-org/decentramind/issues)

### **Technical Support**
- Check [Troubleshooting Guide](docs/TROUBLESHOOTING.md)
- Review [FAQ](docs/FAQ.md)
- Contact: support@decentramind.ai

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for blockchain infrastructure
- **Firebase** for backend services
- **Material-UI** for component library
- **OpenAI** for AI capabilities
- **Community contributors** for feedback and testing

---

**🎉 Welcome to DecentraMind - Where AI Meets Human Potential!** 
=======
# decentramind-platform-
Core platform for DecentraMind Labs — AI agent marketplace, governance, staking, and Solana integration. Current stage: pre-MVP.
>>>>>>> fff8ec5b243d7ed6526a04f7b3285f19f6a3d11a
