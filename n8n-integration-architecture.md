# DecentraMind n8n Integration Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DECENTRAMIND PLATFORM                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Frontend      │  │   Agent UI      │  │   Master Agent  │  │   Sub-Agents│ │
│  │   (Next.js)     │  │   Components    │  │   Dashboard     │  │   (CFO,     │ │
│  │                 │  │                 │  │                 │  │   Care, etc)│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   FastAPI       │  │   Webhook       │  │   Auth          │  │   Rate      │ │
│  │   Backend       │  │   Endpoints     │  │   Service       │  │   Limiting  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            N8N ORCHESTRATION LAYER                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   N8N Core      │  │   Workflow      │  │   HITL          │  │   Webhook   │ │
│  │   Engine        │  │   Templates     │  │   Approvals     │  │   Triggers  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            INTEGRATION SERVICES                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   Web3/Solana   │  │   LLM Services  │  │   External APIs │  │   Document  │ │
│  │   Integration   │  │   (OpenAI,      │  │   (EHR, Fintech,│  │   Generation│ │
│  │   (Smart        │  │   Claude, etc)  │  │   Chain Indexers│  │   (PDFs,    │ │
│  │   Contracts)    │  │                 │  │                 │  │   Reports)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   MongoDB       │  │   IPFS          │  │   Firebase      │  │   Audit     │ │
│  │   (Workflow     │  │   (Metadata)    │  │   (User Data)   │  │   Logs     │ │
│  │   Logs & State) │  │                 │  │                 │  │   (On-chain)│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Workflow Flow

### 1. Agent Workflow Trigger
```
Frontend Agent UI → FastAPI Webhook → N8N Workflow → External Services → Results
```

### 2. Human-in-the-Loop Flow
```
Agent Request → N8N Workflow → HITL Approval → Continue/Reject → Final Result
```

### 3. Token-Gated Workflow
```
User Request → DMT Balance Check → Workflow Execution → DMT Deduction → Result
```

## 🎯 Key Components

### N8N Workflow Categories
- **Care Orchestrator**: Healthcare workflows, FHIR integration, prior auth
- **Autonomous CFO**: Financial analysis, audit reports, compliance
- **TruthChain Logistics**: Supply chain verification, document attestation
- **Polyglot Security Auditor**: Code analysis, security scanning, compliance

### Integration Points
- **Solana Smart Contracts**: Token transfers, staking, governance
- **External APIs**: EHR systems, financial data, blockchain indexers
- **LLM Services**: OpenAI, Claude, Ollama for AI processing
- **Document Generation**: PDF reports, insurance packets, audit logs
- **Notification Systems**: Telegram, Discord, Email alerts

## 🔐 Security & Access Control

### Token-Gated Access
- DMT staking requirements for premium workflows
- DMTX governance tokens for DAO-approved workflows
- Wallet signature verification for all requests

### Audit Trail
- All workflow executions logged to MongoDB
- On-chain attestations for critical operations
- User wallet address tracking for all actions
