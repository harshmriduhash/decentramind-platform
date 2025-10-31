# DecentraMind Development Guide

## Architecture Overview

### Core Components

1. **Master Agent (NFT)**
   - Central control unit for user/project
   - Manages sub-agents and task delegation
   - Stores context memory and XP
   - On-chain ownership via Solana

2. **Sub-Agents (NFTs)**
   - Specialized agents for specific tasks
   - Types: Research, Code, Creative, Audit
   - XP-based evolution system
   - Upgradeable via DMT token

3. **A2A Protocol**
   - Agent-to-Agent communication layer
   - WebSocket-based real-time messaging
   - Task delegation and result routing
   - On-chain proof storage

4. **Token System**
   - DMT (Utility Token)
   - DMTX (Governance Token)
   - Staking and XP mechanics
   - Treasury management

### Directory Structure

```
DecentraMind/
├── onchain/
│   ├── programs/
│   │   ├── agent/           # Master Agent program
│   │   ├── token/          # DMT/DMTX token programs
│   │   └── dao/            # DAO governance program
│   └── tests/              # On-chain tests
├── offchain/
│   ├── client/             # Next.js frontend
│   │   ├── src/
│   │   │   ├── components/ # React components
│   │   │   ├── utils/      # Utility functions
│   │   │   └── hooks/      # Custom React hooks
│   │   └── public/         # Static assets
│   └── server/             # Backend services
│       ├── relay/          # A2A Protocol relay
│       └── api/            # REST API endpoints
└── scripts/                # Deployment and utility scripts
```

## Development Setup

1. **Prerequisites**
   ```bash
   # Install Solana CLI
   sh -c "$(curl -sSfL https://release.solana.com/v1.18.26/install)"
   
   # Install Node.js (v20.18.0+)
   nvm install 20.18.0
   nvm use 20.18.0
   
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Environment Setup**
   ```bash
   # Clone repository
   git clone https://github.com/your-org/decentramind.git
   cd decentramind
   
   # Install dependencies
   cd onchain/programs
   cargo build
   
   cd ../../offchain/client
   npm install
   ```

3. **Configuration**
   - Create `.env.local` in `offchain/client/`
   - Add Solana network configuration
   - Set up API keys for AI services

## Component Implementation

### 1. Master Agent Program
- Initialize agent with name and owner
- Manage XP and level progression
- Handle sub-agent delegation
- Store task history and results

### 2. Sub-Agent System
- Specialized agent types
- XP-based capabilities
- Task processing logic
- Result verification

### 3. A2A Protocol
- WebSocket relay server
- Message encryption
- Task routing
- Result verification

### 4. Token Integration
- DMT token minting
- Staking mechanics
- XP boost calculations
- Governance voting

## Testing Strategy

1. **Unit Tests**
   - Program instruction tests
   - Component rendering tests
   - Utility function tests

2. **Integration Tests**
   - Agent interaction tests
   - Token operation tests
   - A2A protocol tests

3. **End-to-End Tests**
   - User flow tests
   - Cross-component tests
   - Performance tests

## Deployment Process

1. **Program Deployment**
   ```bash
   # Deploy agent program
   cd onchain/programs
   cargo build-sbf
   solana program deploy target/deploy/decentramind_agent.so
   ```

2. **Frontend Deployment**
   ```bash
   # Build and deploy client
   cd offchain/client
   npm run build
   npm run start
   ```

3. **Relay Server Deployment**
   ```bash
   # Deploy A2A relay
   cd offchain/server/relay
   npm run deploy
   ```

## Monitoring and Maintenance

1. **Performance Metrics**
   - Transaction latency
   - Agent response time
   - XP accumulation rate
   - Task completion rate

2. **Error Tracking**
   - Program errors
   - A2A protocol errors
   - Frontend errors
   - API errors

3. **Upgrade Process**
   - Program upgrades
   - Frontend updates
   - Protocol improvements

## Security Considerations

1. **Program Security**
   - Input validation
   - Access control
   - Error handling
   - Rate limiting

2. **A2A Protocol Security**
   - Message encryption
   - Authentication
   - Rate limiting
   - DDOS protection

3. **Frontend Security**
   - Wallet integration
   - API security
   - Data validation
   - Error handling

## Contributing Guidelines

1. **Code Style**
   - Follow Rust style guide
   - Use TypeScript best practices
   - Document all functions
   - Write unit tests

2. **Pull Request Process**
   - Create feature branch
   - Write tests
   - Update documentation
   - Submit PR

3. **Review Process**
   - Code review
   - Security review
   - Performance review
   - Documentation review 