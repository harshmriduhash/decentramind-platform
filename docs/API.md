# API Documentation
## Endpoints, Contracts & Integration Guides

**Module**: API  
**Status**: 🔄 **IN PROGRESS** - Basic structure created  
**Last Updated**: August 5, 2024

---

## 🎯 **OVERVIEW**

This document provides comprehensive API documentation for the DecentraMind platform, including REST endpoints, Solana smart contract addresses, and integration guides for external services.

### **Key Sections**
- **REST API Endpoints**: Platform API endpoints
- **Solana Contracts**: Smart contract addresses and interfaces
- **External Integrations**: Third-party service integrations
- **Authentication**: API authentication methods
- **Rate Limits**: API usage limits and guidelines

---

## 🔗 **REST API ENDPOINTS**

### **Base URL**
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

### **Authentication Endpoints**

#### **POST /api/auth/solana**
Solana wallet authentication endpoint.

**Request:**
```json
{
  "walletAddress": "string",
  "signature": "string",
  "message": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "firebase_custom_token",
  "user": {
    "id": "string",
    "walletAddress": "string",
    "createdAt": "timestamp"
  }
}
```

### **Agent Management Endpoints**

#### **GET /api/agents**
Retrieve user's agents.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "agents": [
    {
      "id": "string",
      "name": "string",
      "domain": "string",
      "type": "master|epic|specialized|common|rare|legendary",
      "level": "number",
      "xp": "number",
      "status": "active|inactive|evolving"
    }
  ]
}
```

#### **POST /api/agents**
Create a new agent.

**Request:**
```json
{
  "name": "string",
  "domain": "string",
  "type": "master|epic|specialized|common|rare|legendary",
  "personality": "string"
}
```

**Response:**
```json
{
  "success": true,
  "agent": {
    "id": "string",
    "name": "string",
    "domain": "string",
    "type": "string",
    "mintDate": "timestamp",
    "transactionHash": "string"
  }
}
```

### **DAO Governance Endpoints**

#### **GET /api/proposals**
Retrieve governance proposals.

**Query Parameters:**
- `status`: `draft|active|voting|passed|rejected|executed`
- `type`: `treasury|platform|community|emergency|constitutional`
- `limit`: `number` (default: 20)
- `offset`: `number` (default: 0)

**Response:**
```json
{
  "proposals": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "proposer": "string",
      "status": "string",
      "yesVotes": "number",
      "noVotes": "number",
      "createdAt": "timestamp"
    }
  ],
  "total": "number"
}
```

#### **POST /api/proposals**
Create a new governance proposal.

**Request:**
```json
{
  "title": "string",
  "description": "string",
  "proposalType": "treasury|platform|community|emergency|constitutional",
  "budget": {
    "requested": "number",
    "description": "string"
  }
}
```

### **Staking Endpoints**

#### **GET /api/staking/position**
Get user's staking position.

**Response:**
```json
{
  "stakedAmount": "number",
  "rewardAmount": "number",
  "apy": "number",
  "lockPeriod": "number",
  "lastRewardClaim": "timestamp"
}
```

#### **POST /api/staking/stake**
Stake DMT tokens.

**Request:**
```json
{
  "amount": "number",
  "lockPeriod": "number"
}
```

#### **POST /api/staking/unstake**
Unstake DMT tokens.

**Request:**
```json
{
  "amount": "number"
}
```

### **Analytics Endpoints**

#### **GET /api/analytics/performance**
Get user performance analytics.

**Query Parameters:**
- `timeRange`: `7d|30d|90d|1y` (default: 30d)

**Response:**
```json
{
  "taskCompletion": {
    "total": "number",
    "completed": "number",
    "rate": "number"
  },
  "productivity": {
    "score": "number",
    "focusTime": "number",
    "efficiency": "number"
  },
  "goals": {
    "set": "number",
    "achieved": "number",
    "progress": "number"
  }
}
```

#### **GET /api/analytics/co2**
Get CO2 tracking data.

**Response:**
```json
{
  "totalFootprint": "number",
  "dailyAverage": "number",
  "activities": {
    "digital": "number",
    "transportation": "number",
    "energy": "number",
    "consumption": "number",
    "waste": "number"
  },
  "sustainability": {
    "score": "number",
    "greenActions": "number",
    "carbonOffset": "number"
  }
}
```

---

## ⛓️ **SOLANA CONTRACT ADDRESSES**

### **Mainnet Addresses**
```bash
# Token Contracts
NEXT_PUBLIC_DMT_CONTRACT_ADDRESS=your_dmt_mainnet_address
NEXT_PUBLIC_DMTX_CONTRACT_ADDRESS=your_dmtx_mainnet_address

# Staking Contract
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=your_staking_mainnet_address

# Agent Contract
NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS=your_agent_mainnet_address

# DAO Contract
NEXT_PUBLIC_DAO_CONTRACT_ADDRESS=your_dao_mainnet_address

# Treasury Contract
NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS=your_treasury_mainnet_address
```

### **Devnet Addresses**
```bash
# Token Contracts (Devnet)
NEXT_PUBLIC_DMT_CONTRACT_ADDRESS_DEVNET=your_dmt_devnet_address
NEXT_PUBLIC_DMTX_CONTRACT_ADDRESS_DEVNET=your_dmtx_devnet_address

# Staking Contract (Devnet)
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS_DEVNET=your_staking_devnet_address

# Agent Contract (Devnet)
NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS_DEVNET=your_agent_devnet_address

# DAO Contract (Devnet)
NEXT_PUBLIC_DAO_CONTRACT_ADDRESS_DEVNET=your_dao_devnet_address

# Treasury Contract (Devnet)
NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS_DEVNET=your_treasury_devnet_address
```

### **Contract Interfaces**

#### **DMT Token Contract**
```typescript
interface DMTToken {
  // Token information
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  
  // Balance functions
  balanceOf(address: string): Promise<number>;
  transfer(to: string, amount: number): Promise<TransactionSignature>;
  
  // Allowance functions
  allowance(owner: string, spender: string): Promise<number>;
  approve(spender: string, amount: number): Promise<TransactionSignature>;
}
```

#### **Staking Contract**
```typescript
interface StakingContract {
  // Staking functions
  stake(amount: number, lockPeriod: number): Promise<TransactionSignature>;
  unstake(amount: number): Promise<TransactionSignature>;
  
  // Reward functions
  claimRewards(): Promise<TransactionSignature>;
  getRewards(address: string): Promise<number>;
  
  // Position functions
  getStakedAmount(address: string): Promise<number>;
  getAPY(): Promise<number>;
}
```

#### **DAO Contract**
```typescript
interface DAOContract {
  // Proposal functions
  createProposal(title: string, description: string, proposalType: string): Promise<TransactionSignature>;
  vote(proposalId: string, vote: 'yes' | 'no' | 'abstain'): Promise<TransactionSignature>;
  
  // Governance functions
  executeProposal(proposalId: string): Promise<TransactionSignature>;
  getProposal(proposalId: string): Promise<Proposal>;
  
  // Treasury functions
  allocateFunds(proposalId: string, amount: number): Promise<TransactionSignature>;
  getTreasuryBalance(): Promise<number>;
}
```

---

## 🔗 **EXTERNAL INTEGRATIONS**

### **AI Services**

#### **OpenAI API**
```bash
# Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_OPENAI_MODEL=gpt-4
NEXT_PUBLIC_OPENAI_MAX_TOKENS=4000
```

**Endpoints:**
- **Text Generation**: `/api/ai/openai/generate`
- **Code Generation**: `/api/ai/openai/code`
- **Content Summarization**: `/api/ai/openai/summarize`

#### **Anthropic API**
```bash
# Configuration
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
NEXT_PUBLIC_ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

**Endpoints:**
- **Text Analysis**: `/api/ai/anthropic/analyze`
- **Content Generation**: `/api/ai/anthropic/generate`
- **Code Review**: `/api/ai/anthropic/review`

### **Blockchain Services**

#### **Solana RPC**
```bash
# Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

**Endpoints:**
- **Account Info**: `getAccountInfo(publicKey)`
- **Balance**: `getBalance(publicKey)`
- **Transaction**: `sendTransaction(transaction)`
- **Program Query**: `getProgramAccounts(programId)`

#### **Firebase Services**
```bash
# Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

**Services:**
- **Authentication**: Custom token authentication
- **Firestore**: Real-time database
- **Storage**: File storage
- **Hosting**: Web hosting

### **Environmental Services**

#### **CO2 Tracking API**
```bash
# Configuration
NEXT_PUBLIC_CO2_API_KEY=your_co2_api_key
NEXT_PUBLIC_CO2_CALCULATION_METHOD=PCAF
```

**Endpoints:**
- **Activity Calculation**: `/api/co2/calculate`
- **Footprint Tracking**: `/api/co2/track`
- **Offset Purchase**: `/api/co2/offset`

---

## 🔐 **AUTHENTICATION**

### **Authentication Methods**

#### **1. Solana Wallet Authentication**
```typescript
// Wallet signature verification
const signature = await wallet.signMessage(message);
const response = await fetch('/api/auth/solana', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: wallet.publicKey.toString(),
    signature: signature,
    message: message
  })
});
```

#### **2. Firebase Custom Token**
```typescript
// Firebase authentication
const customToken = await getCustomToken(walletAddress);
await signInWithCustomToken(auth, customToken);
```

#### **3. API Token Authentication**
```typescript
// Bearer token authentication
const response = await fetch('/api/agents', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### **Error Handling**
```typescript
// Standard error response
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

**Common Error Codes:**
- `AUTH_REQUIRED`: Authentication required
- `INVALID_SIGNATURE`: Invalid wallet signature
- `INSUFFICIENT_BALANCE`: Insufficient token balance
- `PROPOSAL_NOT_FOUND`: Proposal not found
- `VOTE_ALREADY_CAST`: Vote already cast
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded

---

## 📊 **RATE LIMITS**

### **API Rate Limits**
```bash
# General API limits
RATE_LIMIT_REQUESTS_PER_MINUTE=100
RATE_LIMIT_REQUESTS_PER_HOUR=1000
RATE_LIMIT_REQUESTS_PER_DAY=10000

# Specific endpoint limits
RATE_LIMIT_AUTH_PER_MINUTE=10
RATE_LIMIT_STAKING_PER_MINUTE=5
RATE_LIMIT_PROPOSAL_PER_MINUTE=2
RATE_LIMIT_AI_SERVICE_PER_MINUTE=20
```

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### **Rate Limit Response**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "retryAfter": 60
  }
}
```

---

## 🚀 **INTEGRATION EXAMPLES**

### **JavaScript/TypeScript Integration**

#### **Initialize Client**
```typescript
import { DecentraMindAPI } from '@decentramind/api';

const api = new DecentraMindAPI({
  baseURL: 'https://api.decentramind.com',
  wallet: wallet,
  network: 'mainnet-beta'
});
```

#### **Agent Management**
```typescript
// Get user agents
const agents = await api.getAgents();

// Create new agent
const newAgent = await api.createAgent({
  name: 'My Agent',
  domain: 'productivity',
  type: 'master'
});

// Evolve agent
const evolvedAgent = await api.evolveAgent(agentId, 'skill_upgrade');
```

#### **DAO Governance**
```typescript
// Get proposals
const proposals = await api.getProposals({
  status: 'active',
  limit: 10
});

// Create proposal
const proposal = await api.createProposal({
  title: 'New Feature',
  description: 'Add new feature to platform',
  type: 'platform'
});

// Vote on proposal
await api.vote(proposalId, 'yes');
```

#### **Staking Operations**
```typescript
// Get staking position
const position = await api.getStakingPosition();

// Stake tokens
await api.stake(1000, 30); // 1000 DMT for 30 days

// Claim rewards
await api.claimRewards();

// Unstake tokens
await api.unstake(500);
```

### **Python Integration**

#### **Install SDK**
```bash
pip install decentramind-sdk
```

#### **Basic Usage**
```python
from decentramind import DecentraMindAPI

# Initialize client
api = DecentraMindAPI(
    base_url="https://api.decentramind.com",
    wallet_address="your_wallet_address",
    private_key="your_private_key"
)

# Get agents
agents = api.get_agents()

# Create agent
agent = api.create_agent(
    name="Python Agent",
    domain="automation",
    agent_type="specialized"
)
```

---

## 🔍 **TESTING**

### **API Testing**
```bash
# Test authentication
curl -X POST http://localhost:3000/api/auth/solana \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"test","signature":"test","message":"test"}'

# Test agent creation
curl -X POST http://localhost:3000/api/agents \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Agent","domain":"test","type":"common"}'

# Test proposal creation
curl -X POST http://localhost:3000/api/proposals \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Proposal","description":"Test","type":"community"}'
```

### **Contract Testing**
```bash
# Test Solana connection
solana cluster-version

# Test contract deployment
solana program deploy target/deploy/decentramind_agent.so

# Test contract interaction
solana program call --program-id your_program_id your_instruction
```

---

## 📞 **SUPPORT**

### **API Support**
- **Documentation**: This API documentation
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Community support and discussions
- **Email**: api-support@decentramind.com

### **Integration Support**
- **SDK Documentation**: Complete SDK documentation
- **Code Examples**: GitHub repository examples
- **Tutorial Videos**: YouTube channel tutorials
- **Community Forum**: User discussions and help

---

**🎯 GOAL**: Provide comprehensive, accurate, and user-friendly API documentation that enables seamless integration with the DecentraMind platform. 