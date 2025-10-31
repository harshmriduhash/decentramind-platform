#!/bin/bash

# DecentraMind Core Contracts Devnet Deployment
# This script deploys the essential contracts to Solana devnet

set -e

echo "🚀 Starting DecentraMind Core Contracts Deployment..."

# Check prerequisites
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install it first."
    exit 1
fi

if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Please install it first."
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

# Deploy DMT Token Contract
echo "🪙 Deploying DMT Token Contract..."
if [ ! -f "dmt-token.so" ]; then
    echo "Building DMT token contract..."
    cd ../../onchain/programs/dmt-token
    anchor build
    cp target/deploy/dmt_token.so ../../../deployment/devnet/dmt-token.so
    cd ../../../deployment/devnet
fi

DMT_TOKEN_ADDRESS=$(solana program deploy dmt-token.so --program-id 11111111111111111111111111111111)
echo "DMT Token deployed at: $DMT_TOKEN_ADDRESS"

# Deploy Subscription Contract
echo "📦 Deploying Subscription Contract..."
if [ ! -f "subscription.so" ]; then
    echo "Building subscription contract..."
    cd ../../onchain/programs/subscription
    anchor build
    cp target/deploy/subscription.so ../../../deployment/devnet/subscription.so
    cd ../../../deployment/devnet
fi

SUBSCRIPTION_ADDRESS=$(solana program deploy subscription.so)
echo "Subscription Contract deployed at: $SUBSCRIPTION_ADDRESS"

# Create deployment summary
echo "📊 Creating deployment summary..."
cat > DEPLOYMENT_SUMMARY.md << EOF
# DecentraMind Devnet Deployment Summary

**Deployment Date**: $(date)
**Network**: Solana Devnet
**Wallet**: $WALLET_ADDRESS

## Contract Addresses

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
EOF

echo "✅ Deployment summary created: deployment/devnet/DEPLOYMENT_SUMMARY.md"

# Update .env.local with deployed addresses
cd ../..
echo "📝 Updating .env.local with deployed addresses..."

# Create a script to update .env.local
cat > update-env.sh << EOF
#!/bin/bash
# Update .env.local with deployed contract addresses
sed -i '' 's/NEXT_PUBLIC_DMT_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_DMT_CONTRACT_ADDRESS=$DMT_TOKEN_ADDRESS/' .env.local
sed -i '' 's/NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS=.*/NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS=$SUBSCRIPTION_ADDRESS/' .env.local
echo "✅ .env.local updated with deployed contract addresses"
EOF

chmod +x update-env.sh
./update-env.sh

echo "🎉 Core contracts deployed successfully!"
echo "📋 Check deployment/devnet/DEPLOYMENT_SUMMARY.md for details"
echo "🔧 Run './update-env.sh' to update .env.local with contract addresses" 