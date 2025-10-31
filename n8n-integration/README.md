# DecentraMind N8N Integration

A comprehensive N8N-based workflow orchestration service for the DecentraMind AI agent platform. This service enables modular AI agents to execute complex workflows, handle human-in-the-loop processes, and integrate with external systems.

## 🚀 Features

### Core Capabilities
- **Workflow Orchestration**: Execute complex workflows using N8N
- **Agent Integration**: Seamless integration with DecentraMind AI agents
- **Human-in-the-Loop**: Built-in HITL approval workflows
- **Multi-Channel Notifications**: Telegram, Discord, Email support
- **Blockchain Integration**: Solana smart contract interactions
- **Document Generation**: Automated PDF and report generation
- **Audit Logging**: Comprehensive audit trails and monitoring

### Agent-Specific Workflows
- **Care Orchestrator**: Healthcare workflows, FHIR integration, prior authorization
- **Autonomous CFO**: Financial analysis, audit reports, compliance checks
- **TruthChain Logistics**: Supply chain verification, document attestation
- **Polyglot Security Auditor**: Code analysis, security scanning, compliance

### Integration Points
- **External APIs**: EHR systems, financial data, blockchain indexers
- **LLM Services**: OpenAI, Claude, Ollama for AI processing
- **Blockchain**: Solana smart contracts, token transfers, attestations
- **Document Services**: PDF generation, report creation
- **Notification Systems**: Multi-channel alerting

## 🏗️ Architecture

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

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for development)
- MongoDB (or use Docker)
- Redis (or use Docker)

### Local Development

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd n8n-integration
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Services**
   ```bash
   # Development
   ./scripts/deploy.sh development
   
   # Or manually
   docker-compose up -d
   ```

4. **Access Services**
   - N8N UI: http://localhost:5678
   - API: http://localhost:3001
   - Health Check: http://localhost:3001/health

### Production Deployment

1. **Configure Environment**
   ```bash
   cp env.example .env
   # Edit .env with production values
   ```

2. **Deploy**
   ```bash
   ./scripts/deploy.sh production
   ```

3. **Monitor**
   - Grafana: http://localhost:3000
   - Prometheus: http://localhost:9090

## 📚 API Documentation

### Authentication
All API requests require wallet-based authentication:
```bash
curl -H "X-Wallet-Address: your-wallet-address" \
     -H "X-Agent-ID: your-agent-id" \
     http://localhost:3001/api/workflows
```

### Core Endpoints

#### Workflows
- `GET /api/workflows` - List workflows
- `POST /api/workflows/:id/execute` - Execute workflow
- `GET /api/workflows/executions/:id` - Get execution status

#### Agents
- `GET /api/agents/:id/workflows` - Get agent workflows
- `POST /api/agents/:id/workflows/:id/execute` - Execute agent workflow
- `GET /api/agents/:id/performance` - Get agent performance

#### Webhooks
- `POST /api/webhooks/agent/:agentId` - Agent webhook
- `POST /api/webhooks/care/orchestrator` - Care Orchestrator webhook
- `POST /api/webhooks/cfo/autonomous` - Autonomous CFO webhook
- `POST /api/webhooks/logistics/truthchain` - TruthChain Logistics webhook
- `POST /api/webhooks/security/auditor` - Security Auditor webhook

### Webhook Examples

#### Care Orchestrator - Prior Authorization
```bash
curl -X POST http://localhost:3001/api/webhooks/care/orchestrator \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: your-signature" \
  -d '{
    "patientId": "patient-123",
    "action": "prior_auth",
    "data": {
      "procedureCode": "99213",
      "diagnosisCode": "Z00.00",
      "walletAddress": "your-wallet-address"
    }
  }'
```

#### Autonomous CFO - Audit
```bash
curl -X POST http://localhost:3001/api/webhooks/cfo/autonomous \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: your-signature" \
  -d '{
    "companyId": "company-123",
    "action": "audit",
    "data": {
      "auditPeriod": "Q4-2024",
      "walletAddress": "your-wallet-address"
    }
  }'
```

## 🔧 Configuration

### Environment Variables

#### Core Settings
```bash
NODE_ENV=development
PORT=3001
LOG_LEVEL=info
```

#### N8N Configuration
```bash
N8N_HOST=localhost
N8N_PORT=5678
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
```

#### Database
```bash
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=decentramind_n8n
REDIS_PASSWORD=redis123
```

#### Blockchain
```bash
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_API_KEY=your-solana-api-key
```

#### AI Services
```bash
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

#### External APIs
```bash
EHR_API_KEY=your-ehr-key
INSURANCE_API_KEY=your-insurance-key
ACCOUNTING_API_KEY=your-accounting-key
BANKING_API_KEY=your-banking-key
```

#### Notifications
```bash
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
DISCORD_BOT_TOKEN=your-discord-bot-token
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🔄 Workflow Development

### Creating Custom Workflows

1. **Access N8N UI**: http://localhost:5678
2. **Create New Workflow**
3. **Add Nodes**: Drag and drop nodes from the palette
4. **Configure Connections**: Connect nodes to create flow
5. **Test Workflow**: Use the test functionality
6. **Deploy**: Save and activate the workflow

### Workflow Templates

The service includes pre-built templates for common use cases:

- **Care Orchestrator**: `workflows/care/`
- **Autonomous CFO**: `workflows/finance/`
- **TruthChain Logistics**: `workflows/logistics/`
- **Security Auditor**: `workflows/security/`

### Custom Node Development

You can create custom N8N nodes for specific integrations:

```javascript
// Example custom node
module.exports = {
  name: 'DecentraMind Solana Node',
  version: 1,
  description: 'Interact with Solana blockchain',
  defaults: {
    name: 'Solana Transaction'
  },
  inputs: ['main'],
  outputs: ['main'],
  properties: [
    {
      displayName: 'Operation',
      name: 'operation',
      type: 'options',
      options: [
        { name: 'Transfer SOL', value: 'transfer' },
        { name: 'Call Contract', value: 'callContract' }
      ],
      default: 'transfer'
    }
  ],
  async execute() {
    // Implementation
  }
};
```

## 🔐 Security

### Authentication
- Wallet-based authentication using Solana signatures
- JWT tokens for session management
- API key authentication for external services

### Access Control
- Token-gated workflows (DMT staking requirements)
- DAO approval for premium workflows
- Wallet address verification for all operations

### Audit Logging
- All operations logged to MongoDB
- On-chain attestations for critical operations
- User wallet address tracking

## 📊 Monitoring

### Health Checks
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed service status
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Metrics
- `GET /health/metrics` - System metrics
- Prometheus integration for monitoring
- Grafana dashboards for visualization

### Logging
- Structured JSON logging
- Log levels: error, warn, info, debug
- File and console output
- Log rotation and retention

## 🚀 Deployment

### Docker Compose

#### Development
```bash
docker-compose up -d
```

#### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: decentramind-n8n-integration
spec:
  replicas: 3
  selector:
    matchLabels:
      app: decentramind-n8n-integration
  template:
    metadata:
      labels:
        app: decentramind-n8n-integration
    spec:
      containers:
      - name: n8n-integration
        image: decentramind/n8n-integration:latest
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: uri
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: [docs.decentramind.com](https://docs.decentramind.com)
- Discord: [discord.gg/decentramind](https://discord.gg/decentramind)
- GitHub Issues: [github.com/decentramind/issues](https://github.com/decentramind/issues)

## 🔗 Related Projects

- [DecentraMind Frontend](https://github.com/decentramind/frontend)
- [DecentraMind Smart Contracts](https://github.com/decentramind/contracts)
- [DecentraMind Agent Registry](https://github.com/decentramind/agent-registry)
