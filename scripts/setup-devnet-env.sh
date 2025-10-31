#!/bin/bash

# Setup Devnet Environment Configuration
# This script creates .env.local with proper devnet configuration

echo "🔧 Setting up devnet environment configuration..."

# Create .env.local with devnet configuration
cat > .env.local << 'EOF'
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Contract Addresses (Devnet - Will be updated after deployment)
NEXT_PUBLIC_DMT_CONTRACT_ADDRESS=11111111111111111111111111111111
NEXT_PUBLIC_DMTX_CONTRACT_ADDRESS=11111111111111111111111111111111
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=11111111111111111111111111111111
NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS=11111111111111111111111111111111
NEXT_PUBLIC_DAO_CONTRACT_ADDRESS=11111111111111111111111111111111
NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS=11111111111111111111111111111111
NEXT_PUBLIC_BURNING_CONTRACT_ADDRESS=11111111111111111111111111111111
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS=11111111111111111111111111111111
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=11111111111111111111111111111111

# Feature Flags
NEXT_PUBLIC_ENABLE_SUBSCRIPTION=true
NEXT_PUBLIC_ENABLE_BURNING=true
NEXT_PUBLIC_ENABLE_AGENT_MINTING=true
NEXT_PUBLIC_ENABLE_AGENT_EVOLUTION=true
NEXT_PUBLIC_ENABLE_STAKING=true
NEXT_PUBLIC_ENABLE_DAO_GOVERNANCE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Firebase Configuration (Replace with your actual Firebase config)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# AI Configuration (Replace with your actual API keys)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
EOF

echo "✅ .env.local created with devnet configuration"
echo "⚠️  Please update the following in .env.local:"
echo "   - Firebase configuration (replace 'your_firebase_*' values)"
echo "   - AI API keys (replace 'your_*_api_key' values)"
echo "   - Contract addresses (will be updated after deployment)" 