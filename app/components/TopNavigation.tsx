'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Bot, 
  Coins, 
  Settings, 
  BookOpen, 
  Users, 
  Info,
  Zap,
  Store,
  Crown,
  Flame,
  Building2,
  CreditCard,
  BarChart3,
  Sparkles,
  Wallet,
  TrendingUp,
  Shield,
  Globe,
  MessageSquare,
  FileText,
  Target,
  Users2,
  HelpCircle,
  Menu,
  ChevronDown,
  ArrowRight,
  Calendar,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Navigation configuration
const navigationConfig = [
  {
    title: 'AI Agents',
    href: '/ai-agents',
    icon: Bot,
    description: 'AI Agent Tools & Marketplace',
    items: [
      {
        title: 'Agent Management',
        href: '/ai-agents/management',
        description: 'Manage and interact with your AI agents',
        icon: Bot,
      },
      {
        title: 'Agent Workflows',
        href: '/ai-agents/workflows',
        description: 'Create and manage AI automation workflows',
        icon: Zap,
      },
      {
        title: 'Mint New Agent',
        href: '/ai-agents/mint',
        description: 'Create new AI agents with custom capabilities',
        icon: Sparkles,
        badge: 'New',
      },
      {
        title: 'AI Chat Hub',
        href: '/ai-agents/chat',
        description: 'Interact with AI agents through chat interface',
        icon: MessageSquare,
      },
      {
        title: 'Agent Evolution',
        href: '/ai-agents/evolution',
        description: 'Track agent growth and development metrics',
        icon: TrendingUp,
      },
      {
        title: 'Agent Marketplace',
        href: '/ai-agents/marketplace',
        description: 'Buy and sell AI agents securely',
        icon: Store,
      },
      {
        title: 'Crypto Alpha Assistant',
        href: '/crypto-alpha',
        description: 'Discover and evaluate promising crypto tokens',
        icon: TrendingUp,
        badge: 'Alpha',
      },
      {
        title: 'Test Workflows',
        href: '/test-workflows',
        description: 'Simulate AI agent workflows and test capabilities',
        icon: Zap,
        badge: 'Test',
      },
    ],
  },
  {
    title: 'Token & Governance',
    href: '/governance',
    icon: Coins,
    description: 'Token Economics & Governance',
    items: [
      {
        title: 'Tokenomics',
        href: '/governance/tokenomics',
        description: 'Understand token economics and distribution',
        icon: Coins,
      },
      {
        title: 'DAO Governance',
        href: '/governance/dao',
        description: 'Participate in governance decisions',
        icon: Building2,
      },
      {
        title: 'Staking & Rewards',
        href: '/governance/staking',
        description: 'Stake tokens and earn rewards',
        icon: Crown,
      },
      {
        title: 'Token Burning',
        href: '/governance/burning',
        description: 'View token burning metrics and deflationary data',
        icon: Flame,
      },
      {
        title: 'Treasury Overview',
        href: '/governance/treasury',
        description: 'Community treasury and funds management',
        icon: Shield,
      },
      {
        title: 'Voting History',
        href: '/governance/voting',
        description: 'Track governance voting history and results',
        icon: Users2,
      },
    ],
  },
  {
    title: 'Services',
    href: '/services',
    icon: Settings,
    description: 'Professional Tools & Support',
    items: [
      {
        title: 'Smart Contract Tools',
        href: '/services/contracts',
        description: 'Blockchain development and deployment tools',
        icon: FileText,
      },
      {
        title: 'AI Automation',
        href: '/services/automation',
        description: 'Advanced AI automation services',
        icon: Zap,
      },
      {
        title: 'Professional Services',
        href: '/services/professional',
        description: 'Premium AI and blockchain consulting',
        icon: Settings,
      },
      {
        title: 'Subscription Management',
        href: '/services/subscription',
        description: 'Manage your subscription and credits',
        icon: CreditCard,
        badge: 'Active',
      },
      {
        title: 'API Documentation',
        href: '/services/api',
        description: 'Developer tools and API documentation',
        icon: FileText,
      },
      {
        title: 'Support Center',
        href: '/services/support',
        description: 'Get help and technical support',
        icon: HelpCircle,
      },
    ],
  },
  {
    title: 'Learn',
    href: '/learn',
    icon: BookOpen,
    description: 'Documentation & Guides',
    items: [
      {
        title: 'Getting Started',
        href: '/learn/start',
        description: 'Quick start guide for new users',
        icon: Target,
      },
      {
        title: 'Agent Documentation',
        href: '/learn/agents',
        description: 'Technical documentation for AI agents',
        icon: BookOpen,
      },
      {
        title: 'DAO Guide',
        href: '/learn/dao',
        description: 'Understanding DecentraMind governance',
        icon: Building2,
      },
      {
        title: 'Tokenomics Whitepaper',
        href: '/learn/tokenomics',
        description: 'Token economics and distribution model',
        icon: FileText,
      },
      {
        title: 'Developer Resources',
        href: '/learn/developers',
        description: 'Resources for developers and builders',
        icon: Settings,
      },
      {
        title: 'Video Tutorials',
        href: '/learn/tutorials',
        description: 'Step-by-step video guides',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Community',
    href: '/community',
    icon: Users,
    description: 'Connect & Collaborate',
    items: [
      {
        title: 'Community Forum',
        href: '/community/forum',
        description: 'Community discussions and feedback',
        icon: MessageSquare,
      },
      {
        title: 'Governance Voting',
        href: '/community/voting',
        description: 'Participate in DAO governance',
        icon: Users2,
      },
      {
        title: 'Metaverse Portal',
        href: '/community/metaverse',
        description: 'Virtual world and immersive experiences',
        icon: Globe,
        badge: 'Soon',
        disabled: true,
      },
      {
        title: 'Discord & Telegram',
        href: '/community/social',
        description: 'Join our community channels',
        icon: Users,
      },
      {
        title: 'Events & Meetups',
        href: '/community/events',
        description: 'Community events and networking',
        icon: Calendar,
      },
      {
        title: 'Ambassador Program',
        href: '/community/ambassadors',
        description: 'Join our ambassador program',
        icon: Crown,
      },
    ],
  },
  {
    title: 'About',
    href: '/about',
    icon: Info,
    description: 'Company & Information',
    items: [
      {
        title: 'Our Mission',
        href: '/about/mission',
        description: 'DecentraMind Labs mission and vision',
        icon: Target,
      },
      {
        title: 'Roadmap',
        href: '/about/roadmap',
        description: 'Development roadmap and milestones',
        icon: TrendingUp,
      },
      {
        title: 'Team',
        href: '/about/team',
        description: 'Meet our team and advisors',
        icon: Users2,
      },
      {
        title: 'Version Info',
        href: '/about/version',
        description: 'Platform version and updates',
        icon: Info,
        badge: 'v1.0',
      },
      {
        title: 'Careers',
        href: '/about/careers',
        description: 'Join our team and build the future',
        icon: Users,
      },
      {
        title: 'Contact Us',
        href: '/about/contact',
        description: 'Get in touch with our team',
        icon: MessageSquare,
      },
    ],
  },
  {
    title: 'Admin',
    href: '/admin',
    icon: Settings,
    description: 'System Administration',
    items: [],
  },
];

// Status bar items
const statusBarItems = [
  {
    label: 'DMT',
    value: '0.00',
    icon: Wallet,
    color: 'text-cyan-300',
  },
  {
    label: 'XP',
    value: '120',
    icon: TrendingUp,
    color: 'text-green-300',
  },
];

// Individual navigation item component
const NavItem = ({ item, isActive, onItemClick }: { 
  item: any; 
  isActive: boolean; 
  onItemClick?: () => void;
}) => {
  const Icon = item.icon;
  
  return (
    <Link
      href={item.href}
      onClick={onItemClick}
      className={cn(
        "group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
        "hover:bg-cyan-900/20 hover:text-cyan-300",
        isActive ? "bg-cyan-900/30 text-cyan-300" : "text-gray-300"
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="font-medium text-sm">{item.title}</p>
          {item.badge && (
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              item.badge === 'New' ? "bg-green-500/20 text-green-300" :
              item.badge === 'Soon' ? "bg-yellow-500/20 text-yellow-300" :
              item.badge === 'Active' ? "bg-cyan-500/20 text-cyan-300" :
              "bg-gray-500/20 text-gray-300"
            )}>
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 group-hover:text-cyan-400 transition-colors">
          {item.description}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
};

// Mobile menu component
const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden text-gray-300 hover:text-cyan-300 hover:bg-cyan-900/20"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 bg-zinc-900 border-cyan-400/20">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl flex items-center justify-center border border-cyan-400/30">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-cyan-300">DecentraMind Labs</h1>
              <p className="text-xs text-gray-400">AI + Blockchain Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300",
                "hover:bg-cyan-900/20 hover:text-cyan-300",
                pathname === '/dashboard' ? "bg-cyan-900/30 text-cyan-300" : "text-gray-300"
              )}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            {/* Main Navigation Items */}
            {navigationConfig.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-semibold text-cyan-300 flex items-center space-x-2">
                    <section.icon className="w-4 h-4" />
                    <span>{section.title}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">{section.description}</p>
                </div>
                <div className="space-y-1 pl-4">
                  {section.items.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      isActive={pathname === item.href}
                      onItemClick={() => setIsOpen(false)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Status Bar */}
          <div className="pt-4 border-t border-cyan-400/20">
            <div className="flex items-center justify-between space-x-4">
              {statusBarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center space-x-2 bg-zinc-800/50 px-3 py-2 rounded-lg border border-cyan-400/20">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-gray-300 text-sm">{item.label}:</span>
                    <span className={`font-medium text-sm ${item.color}`}>{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Main TopNavigation component
export default function TopNavigation() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 w-full transition-all duration-300 bg-zinc-900/90 backdrop-blur-sm border-b border-cyan-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl flex items-center justify-center border border-cyan-400/30 shadow-lg shadow-cyan-400/25 group-hover:shadow-cyan-400/40 transition-all duration-300">
                <Sparkles className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                  DecentraMind Labs
                </h1>
                <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                  AI + Blockchain Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search agents, features, or help..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-zinc-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Dashboard Link */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/dashboard"
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                        pathname === '/dashboard' 
                          ? "bg-cyan-900/30 text-cyan-300 border border-cyan-400/30 shadow-lg shadow-cyan-400/10" 
                          : "bg-transparent hover:bg-cyan-900/20 hover:text-cyan-300"
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Main Navigation Items */}
                {navigationConfig.map((section) => (
                  <NavigationMenuItem key={section.title}>
                    <NavigationMenuTrigger className="group bg-transparent hover:bg-cyan-900/20 hover:text-cyan-300 data-[state=open]:bg-cyan-900/30 data-[state=open]:text-cyan-300 transition-all duration-200">
                      <div className="flex items-center space-x-2">
                        <section.icon className="w-4 h-4" />
                        <span>{section.title}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[600px] bg-zinc-900/95 backdrop-blur-md border border-cyan-400/20 rounded-xl shadow-xl">
                        <div className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-cyan-900/20 to-zinc-900/50 p-6 no-underline outline-none focus:shadow-md border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300"
                              href={section.href}
                            >
                              <section.icon className="h-6 w-6 text-cyan-400 mb-2" />
                              <div className="mb-2 mt-4 text-lg font-medium text-cyan-300">
                                {section.title}
                              </div>
                              <p className="text-sm leading-tight text-gray-400">
                                {section.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {section.items.map((item) => (
                            <NavigationMenuLink key={item.href} asChild>
                              <Link
                                href={item.href}
                                className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-cyan-900/20 hover:text-cyan-300 border border-transparent hover:border-cyan-400/30"
                              >
                                <div className="flex items-center space-x-2">
                                  <item.icon className="h-4 w-4 text-cyan-400" />
                                  <div className="text-sm font-medium leading-none text-white group-hover:text-cyan-300">
                                    {item.title}
                                  </div>
                                  {item.badge && (
                                    <span className={cn(
                                      "inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium",
                                      item.badge === 'New' ? "bg-green-500/20 text-green-300" :
                                      item.badge === 'Soon' ? "bg-yellow-500/20 text-yellow-300" :
                                      item.badge === 'Active' ? "bg-cyan-500/20 text-cyan-300" :
                                      "bg-gray-500/20 text-gray-300"
                                    )}>
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-gray-400 group-hover:text-cyan-400">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Status Bar & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Status Indicators */}
            <div className="flex items-center space-x-3">
              {statusBarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center space-x-2 bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-200">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-gray-300 text-sm">{item.label}:</span>
                    <span className={`font-medium text-sm ${item.color}`}>{item.value}</span>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-cyan-300 hover:bg-cyan-900/20 transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-200"
              >
                <Users className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </div>
  );
}