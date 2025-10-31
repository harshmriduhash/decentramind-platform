#!/bin/bash

# 🔍 DecentraMind Landing Page Component Verification Script
# This script verifies all landing page components are properly installed and configured

echo "🔍 Verifying DecentraMind Landing Page Components..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the DecentraMind root directory"
    exit 1
fi

# Component verification
echo "📋 Checking Landing Page Components..."

components=(
    "EcosystemMap.tsx:Visual neural graph of interconnected agents"
    "EvolutionTracker.tsx:Spiral XP evolution graphic with levels"
    "LoreChapters.tsx:Unlockable lore system tied to user progress"
    "LiveStats.tsx:Real-time ecosystem metrics with animated counters"
    "ThemeCustomizer.tsx:User preference toggle for themes and audio"
    "AgentChatPreview.tsx:AI preview chat for each agent"
    "OnboardingModal.tsx:Step-by-step user journey overlay"
    "TokenDetail.tsx:Clickable orbiting tokens with expandable modals"
    "MobileFloatingMenu.tsx:Sticky bottom menu for mobile devices"
    "MvpTourModal.tsx:Optional tour video overlay with CTA narration"
)

all_good=true

for component_info in "${components[@]}"; do
    component_file=$(echo $component_info | cut -d: -f1)
    component_desc=$(echo $component_info | cut -d: -f2)
    file_path="app/components/landing/$component_file"
    
    if [ -f "$file_path" ]; then
        echo "✅ $component_file - $component_desc"
    else
        echo "❌ $component_file - MISSING"
        all_good=false
    fi
done

# Check main orchestrator component
echo ""
echo "📋 Checking Main Components..."

main_components=(
    "LandingWorld.tsx:Main orchestrator component"
    "HeroSection.tsx:Enhanced hero section with logo and audio"
    "StarfieldBackground.tsx:Animated cosmic background"
    "NatureOverlays.tsx:Nature visual effects"
)

for component_info in "${main_components[@]}"; do
    component_file=$(echo $component_info | cut -d: -f1)
    component_desc=$(echo $component_info | cut -d: -f2)
    file_path="app/components/landing/$component_file"
    
    if [ -f "$file_path" ]; then
        echo "✅ $component_file - $component_desc"
    else
        echo "❌ $component_file - MISSING"
        all_good=false
    fi
done

# Check assets
echo ""
echo "📋 Checking Assets..."

assets=(
    "public/logo.svg:DecentraMind Labs logo"
    "LANDING_PAGE_CONFIGURATION.md:Complete configuration documentation"
    "start-enhanced-frontend.sh:Quick start script"
)

for asset_info in "${assets[@]}"; do
    asset_file=$(echo $asset_info | cut -d: -f1)
    asset_desc=$(echo $asset_info | cut -d: -f2)
    
    if [ -f "$asset_file" ]; then
        echo "✅ $asset_file - $asset_desc"
    else
        echo "❌ $asset_file - MISSING"
        all_good=false
    fi
done

# Check dependencies
echo ""
echo "📋 Checking Dependencies..."

required_deps=(
    "framer-motion:Animation library"
    "lucide-react:Icon library"
    "next:React framework"
    "react:UI library"
    "tailwindcss:Styling framework"
)

for dep_info in "${required_deps[@]}"; do
    dep_name=$(echo $dep_info | cut -d: -f1)
    dep_desc=$(echo $dep_info | cut -d: -f2)
    
    if grep -q "\"$dep_name\"" package.json; then
        echo "✅ $dep_name - $dep_desc"
    else
        echo "❌ $dep_name - MISSING from package.json"
        all_good=false
    fi
done

# Final status
echo ""
if [ "$all_good" = true ]; then
    echo "🎉 All components verified successfully!"
    echo "🚀 Ready to start the enhanced frontend with:"
    echo "   ./start-enhanced-frontend.sh"
    echo ""
    echo "🎯 Available Features:"
    echo "   • 10 new modular components"
    echo "   • NeoFuturism x Nature theme"
    echo "   • Mobile-first responsive design"
    echo "   • Accessibility-first approach"
    echo "   • Performance optimized animations"
    echo "   • Interactive ecosystem visualization"
    echo "   • Real-time stats and metrics"
    echo "   • Theme customization options"
    echo "   • Guided onboarding flow"
    echo "   • Comprehensive tour system"
else
    echo "❌ Some components are missing or misconfigured"
    echo "Please check the errors above and ensure all files are properly installed"
    exit 1
fi


