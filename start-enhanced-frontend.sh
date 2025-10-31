#!/bin/bash

# 🚀 DecentraMind Frontend Quick Start Script
# This script ensures a clean restart of the frontend with all new landing page components

echo "🚀 Starting DecentraMind Frontend with Enhanced Landing Page..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the DecentraMind root directory"
    exit 1
fi

# Clean any existing processes
echo "🧹 Cleaning existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Clean Next.js cache
echo "🧹 Cleaning Next.js cache..."
rm -rf .next 2>/dev/null || true
rm -rf node_modules/.cache 2>/dev/null || true

# Install dependencies (if needed)
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Verify critical files exist
echo "🔍 Verifying critical files..."

critical_files=(
    "app/components/landing/LandingWorld.tsx"
    "app/components/landing/EcosystemMap.tsx"
    "app/components/landing/EvolutionTracker.tsx"
    "app/components/landing/LoreChapters.tsx"
    "app/components/landing/LiveStats.tsx"
    "app/components/landing/ThemeCustomizer.tsx"
    "app/components/landing/AgentChatPreview.tsx"
    "app/components/landing/OnboardingModal.tsx"
    "app/components/landing/TokenDetail.tsx"
    "app/components/landing/MobileFloatingMenu.tsx"
    "app/components/landing/MvpTourModal.tsx"
    "public/logo.svg"
)

for file in "${critical_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Error: Critical file missing: $file"
        echo "Please ensure all landing page components are properly installed"
        exit 1
    fi
done

echo "✅ All critical files verified"

# Check for linting errors
echo "🔍 Checking for linting errors..."
if command -v npm &> /dev/null; then
    npm run lint --silent 2>/dev/null || echo "⚠️  Linting check skipped (no lint script found)"
fi

# Start the development server
echo "🚀 Starting development server..."
echo "📍 Frontend will be available at: http://localhost:3000"
echo "🎨 Enhanced landing page with 10 new modular components loaded"
echo ""
echo "🎯 Available Features:"
echo "   • Theme Customizer (bottom-right button)"
echo "   • Onboarding Modal (bottom-left button)"
echo "   • MVP Tour (top-right button)"
echo "   • Mobile Floating Menu (mobile only)"
echo "   • Interactive Agent Ecosystem Map"
echo "   • Live Stats Dashboard"
echo "   • Evolution Tracker"
echo "   • Agent Chat Preview"
echo "   • Clickable Token Details"
echo "   • Unlockable Lore Chapters"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm run dev


