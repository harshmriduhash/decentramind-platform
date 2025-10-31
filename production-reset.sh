#!/bin/bash

echo "🚀 DECENTRAMIND PRODUCTION RESET & VERIFICATION"
echo "================================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Stop all running processes
print_status "Step 1: Stopping running processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
sleep 2

# Step 2: Clean all build artifacts and caches
print_status "Step 2: Cleaning build artifacts and caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -f tsconfig.tsbuildinfo
rm -rf .vercel
rm -rf .swc
rm -rf .eslintcache

# Step 3: Clean environment files (keep template)
print_status "Step 3: Cleaning environment files..."
if [ -f ".env.local" ]; then
    cp .env.local .env.local.backup
    print_warning "Backed up .env.local to .env.local.backup"
fi

# Step 4: Reinstall dependencies
print_status "Step 4: Reinstalling dependencies..."
npm ci --silent
if [ $? -eq 0 ]; then
    print_success "Dependencies reinstalled successfully"
else
    print_error "Failed to reinstall dependencies"
    exit 1
fi

# Step 5: Create fresh environment file from template
print_status "Step 5: Creating fresh environment file..."
if [ -f "env.template" ]; then
    cp env.template .env.local
    print_warning "Created .env.local from template - PLEASE UPDATE WITH REAL VALUES"
else
    print_error "env.template not found - creating basic .env.local"
    cat > .env.local << 'EOF'
# DecentraMind Environment Variables
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_ENABLE_DAO=true
NEXT_PUBLIC_ENABLE_STAKING=true
NEXT_PUBLIC_ENABLE_GOVERNANCE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_DMT_TOKEN_CONTRACT=11111111111111111111111111111111
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=11111111111111111111111111111111
NEXT_PUBLIC_GOVERNANCE_CONTRACT_ADDRESS=11111111111111111111111111111111
EOF
fi

# Step 6: Remove all debug bypasses and logging
print_status "Step 6: Removing debug bypasses and logging..."
sed -i '' 's/const FORCE_DASHBOARD = true;.*/const FORCE_DASHBOARD = false; \/\/ Production: no bypass/' app/page.tsx 2>/dev/null || true
sed -i '' 's/const ENABLE_DAO = true;.*/const ENABLE_DAO = process.env.NEXT_PUBLIC_ENABLE_DAO === '\''true'\'';/' app/page.tsx 2>/dev/null || true
sed -i '' 's/const ENABLE_STAKING = true;.*/const ENABLE_STAKING = process.env.NEXT_PUBLIC_ENABLE_STAKING === '\''true'\'';/' app/page.tsx 2>/dev/null || true
sed -i '' 's/const ENABLE_GOVERNANCE = true;.*/const ENABLE_GOVERNANCE = process.env.NEXT_PUBLIC_ENABLE_GOVERNANCE === '\''true'\'';/' app/page.tsx 2>/dev/null || true
sed -i '' 's/const ENABLE_ANALYTICS = true;.*/const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === '\''true'\'';/' app/page.tsx 2>/dev/null || true

# Remove debug console logs
sed -i '' '/console\.log.*🔍/d' app/page.tsx 2>/dev/null || true
sed -i '' '/console\.log.*📋/d' app/page.tsx 2>/dev/null || true
sed -i '' '/console\.log.*🚩/d' app/page.tsx 2>/dev/null || true
sed -i '' '/console\.log.*🔐/d' app/page.tsx 2>/dev/null || true
sed -i '' '/console\.log.*🎯/d' app/page.tsx 2>/dev/null || true
sed -i '' '/console\.log.*📱/d' app/page.tsx 2>/dev/null || true
sed -i '' '/console\.log.*⏳/d' app/page.tsx 2>/dev/null || true

# Step 7: Build the application
print_status "Step 7: Building the application..."
npm run build --silent
if [ $? -eq 0 ]; then
    print_success "Application built successfully"
else
    print_error "Build failed - check for errors above"
    exit 1
fi

# Step 8: Run linting
print_status "Step 8: Running linting..."
npm run lint --silent
if [ $? -eq 0 ]; then
    print_success "Linting passed"
else
    print_warning "Linting found issues - review and fix"
fi

# Step 9: Run type checking
print_status "Step 9: Running type checking..."
npx tsc --noEmit --silent
if [ $? -eq 0 ]; then
    print_success "Type checking passed"
else
    print_warning "Type checking found issues - review and fix"
fi

# Step 10: Run integration tests
print_status "Step 10: Running integration tests..."
if [ -f "test-integration-production.js" ]; then
    node test-integration-production.js
    if [ $? -eq 0 ]; then
        print_success "Integration tests passed"
    else
        print_warning "Integration tests failed - review issues"
    fi
else
    print_warning "Integration test file not found"
fi

# Step 11: Run existing test suites
print_status "Step 11: Running existing test suites..."
if [ -f "test-runtime-check.js" ]; then
    node test-runtime-check.js
fi

# Step 12: Check for remaining issues
print_status "Step 12: Checking for remaining issues..."

# Check for debug bypasses
if grep -r "FORCE_DASHBOARD = true" app/ 2>/dev/null; then
    print_error "Found remaining FORCE_DASHBOARD bypass"
fi

# Check for mock data
if grep -r "mock_transaction" app/ 2>/dev/null; then
    print_warning "Found mock transaction references"
fi

# Check for debug logging
if grep -r "console\.log.*🔍" app/ 2>/dev/null; then
    print_warning "Found debug console logs"
fi

# Check for TODO comments
TODO_COUNT=$(grep -r "TODO" app/ | wc -l)
if [ $TODO_COUNT -gt 0 ]; then
    print_warning "Found $TODO_COUNT TODO comments"
fi

# Step 13: Start development server
print_status "Step 13: Starting development server..."
echo ""
echo "🎯 PRODUCTION RESET COMPLETE!"
echo "=============================="
echo ""
echo "📋 NEXT STEPS:"
echo "1. Update .env.local with your real API keys and contract addresses"
echo "2. Connect your Solana wallet"
echo "3. Test all features at http://localhost:3000"
echo "4. Check browser console for any remaining issues"
echo "5. Run 'npm run dev' to start the server"
echo ""
echo "🔧 MANUAL VERIFICATION CHECKLIST:"
echo "□ Wallet connection works"
echo "□ Feature flags are properly configured"
echo "□ No debug bypasses remain"
echo "□ All components render without errors"
echo "□ Blockchain transactions work (if contracts deployed)"
echo "□ Error handling works properly"
echo "□ Authentication flow works"
echo ""
echo "🚀 Starting server..."
npm run dev 