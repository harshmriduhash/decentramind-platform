#!/bin/bash

# Simple Devnet Deployment Script
# This script deploys the core contracts to devnet

set -e

echo "🚀 Starting Simple Devnet Deployment..."

# Check prerequisites
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install it first."
    exit 1
fi

# Set network to devnet
echo "📡 Setting network to devnet..."
solana config set --url https://api.devnet.solana.com

# Check wallet and balance
echo "💰 Checking wallet..."
WALLET_ADDRESS=$(solana address)
echo "Using wallet: $WALLET_ADDRESS"

BALANCE=$(solana balance)
echo "Current balance: $BALANCE"

# Request airdrop if needed
if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo "💸 Requesting airdrop..."
    solana airdrop 2
    sleep 5
fi

# Create deployment directory
mkdir -p deployment/devnet
cd deployment/devnet

# For now, let's create placeholder contract addresses
# In a real deployment, these would be actual deployed contract addresses
echo "📝 Creating placeholder contract addresses for testing..."

DMT_TOKEN_ADDRESS="11111111111111111111111111111111"
SUBSCRIPTION_ADDRESS="22222222222222222222222222222222"

echo "DMT Token Address: $DMT_TOKEN_ADDRESS"
echo "Subscription Address: $SUBSCRIPTION_ADDRESS"

# Create deployment summary
echo "📊 Creating deployment summary..."
cat > DEPLOYMENT_SUMMARY.md << EOF
# DecentraMind Devnet Deployment Summary

**Deployment Date**: $(date)
**Network**: Solana Devnet
**Wallet**: $WALLET_ADDRESS

## Contract Addresses (Placeholder for Testing)

| Contract | Address |
|----------|---------|
| DMT Token | \`$DMT_TOKEN_ADDRESS\` |
| Subscription | \`$SUBSCRIPTION_ADDRESS\` |

## Environment Configuration

Update your \`.env.local\` with these addresses:

\`\`\`bash
NEXT_PUBLIC_DMT_CONTRACT_ADDRESS=$DMT_TOKEN_ADDRESS
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS=$SUBSCRIPTION_ADDRESS
\`\`\`

## Next Steps

1. Update .env.local with the contract addresses above
2. Configure Firebase and AI API keys
3. Run integration tests
4. Test economic flows on devnet
5. Document any issues found during testing

## Note

This is a placeholder deployment for testing the core functionality.
In production, you would deploy actual smart contracts and use real addresses.
EOF

echo "✅ Deployment summary created: deployment/devnet/DEPLOYMENT_SUMMARY.md"

# Update .env.local with deployed addresses
cd ../..
echo "📝 Updating .env.local with contract addresses..."

# Create a script to update .env.local
cat > update-env.sh << EOF
#!/bin/bash
# Update .env.local with contract addresses
sed -i '' 's/NEXT_PUBLIC_DMT_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_DMT_CONTRACT_ADDRESS=$DMT_TOKEN_ADDRESS/' .env.local
sed -i '' 's/NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS=$SUBSCRIPTION_ADDRESS/' .env.local
echo "✅ .env.local updated with contract addresses"
EOF

chmod +x update-env.sh
./update-env.sh

echo "🎉 Simple devnet deployment completed!"
echo "📋 Check deployment/devnet/DEPLOYMENT_SUMMARY.md for details"
echo "🔧 Run './update-env.sh' to update .env.local with contract addresses"
echo ""
echo "⚠️  Note: This uses placeholder addresses for testing."
echo "   For production, deploy actual smart contracts." 