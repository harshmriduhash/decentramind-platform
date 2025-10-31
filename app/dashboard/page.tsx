'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Flame, 
  Bot, 
  Store, 
  Crown, 
  Building2, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Users,
  Settings,
  Coins,
  Wallet,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Heart
} from 'lucide-react';

// Import specific feature components
import AgentManagement from '../components/AgentManagement';
import N8NIntegration from '../components/N8NIntegration';
import EnhancedStakingTab from '../components/EnhancedStakingTab';
import Marketplace from '../components/Marketplace';
import TokenomicsDashboard from '../components/TokenomicsDashboard';
import BurningDashboard from '../components/BurningDashboard';
import SubscriptionDashboard from '../components/SubscriptionDashboard';
import ProposalsTab from '../components/ProposalsTab';
import ProfessionalServices from '../components/ProfessionalServices';
import ChatServicesTab from '../components/ChatServicesTab';

// Top Stats Component
const TopStats = () => {
  const stats = [
    {
      title: 'Credits',
      value: '0',
      icon: <Wallet className="w-6 h-6 text-cyan-400" />,
      color: 'text-cyan-400'
    },
    {
      title: 'Active Agents',
      value: '5',
      icon: <Bot className="w-6 h-6 text-green-400" />,
      color: 'text-green-400'
    },
    {
      title: 'DMT Balance',
      value: '0.00',
      icon: <Coins className="w-6 h-6 text-yellow-400" />,
      color: 'text-yellow-400'
    },
    {
      title: 'Tasks Completed',
      value: '12',
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-zinc-800/50 border border-cyan-400/20 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10 group">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-400/20 group-hover:bg-cyan-900/40 transition-colors">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: string;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  component: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  onClick,
  badge
}) => {
  return (
    <Card 
      className="group cursor-pointer bg-zinc-900/50 border border-gray-700/50 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-400/10 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-400/20 group-hover:border-cyan-400/40 transition-colors">
            {icon}
          </div>
          {badge && (
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-white text-lg font-semibold group-hover:text-cyan-300 transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400 group-hover:text-cyan-400 transition-colors">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 hover:text-cyan-200 transition-all"
        >
          Open
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Section Component
interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => {
  return (
    <div className="space-y-6 mb-12">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-400/20">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-cyan-300">{title}</h2>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features: { core: Feature[]; token: Feature[]; tools: Feature[] } = {
    core: [
      {
        id: 'agents',
        title: 'Agent Management',
        description: 'Manage and interact with your AI agents',
        icon: <Bot className="w-6 h-6 text-cyan-400" />,
        badge: 'Core',
        component: <AgentManagement />
      },
      {
        id: 'workflows',
        title: 'Agent Workflows',
        description: 'Create and manage AI automation workflows',
        icon: <Zap className="w-6 h-6 text-blue-400" />,
        component: <N8NIntegration />
      },
      {
        id: 'marketplace',
        title: 'Marketplace',
        description: 'Buy and sell AI agents securely',
        icon: <Store className="w-6 h-6 text-purple-400" />,
        component: <Marketplace />
      },
      {
        id: 'chat',
        title: 'AI Chat Hub',
        description: 'Interact with AI agents through chat',
        icon: <Users className="w-6 h-6 text-green-400" />,
        component: <ChatServicesTab />
      }
    ],
    token: [
      {
        id: 'tokenomics',
        title: 'Tokenomics',
        description: 'Understand token economics and distribution',
        icon: <Coins className="w-6 h-6 text-yellow-400" />,
        component: <TokenomicsDashboard />
      },
      {
        id: 'governance',
        title: 'DAO Governance',
        description: 'Participate in governance decisions',
        icon: <Building2 className="w-6 h-6 text-pink-400" />,
        component: <ProposalsTab />
      },
      {
        id: 'staking',
        title: 'Staking & Rewards',
        description: 'Stake tokens and earn rewards',
        icon: <Crown className="w-6 h-6 text-yellow-400" />,
        component: <EnhancedStakingTab />
      },
      {
        id: 'burning',
        title: 'Token Burning',
        description: 'View token burning metrics and deflationary data',
        icon: <Flame className="w-6 h-6 text-orange-400" />,
        component: <BurningDashboard />
      }
    ],
    tools: [
      {
        id: 'professional',
        title: 'Professional Services',
        description: 'Premium AI and blockchain services',
        icon: <Settings className="w-6 h-6 text-orange-400" />,
        component: <ProfessionalServices />
      },
      {
        id: 'subscription',
        title: 'Subscription Management',
        description: 'Manage your subscription and credits',
        icon: <CreditCard className="w-6 h-6 text-cyan-400" />,
        badge: 'Active',
        component: <SubscriptionDashboard />
      },
      {
        id: 'analytics',
        title: 'Analytics Dashboard',
        description: 'Track performance and insights',
        icon: <BarChart3 className="w-6 h-6 text-green-400" />,
        component: <div className="p-6 text-center text-gray-400">Analytics Dashboard Coming Soon</div>
      },
      {
        id: 'health-portal',
        title: 'Health Portal',
        description: 'AI-powered health management and wellness tracking',
        icon: <Heart className="w-6 h-6 text-red-400" />,
        badge: 'Medical',
        component: <div className="p-6 text-center">
          <div className="mb-4">
            <Heart className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Health Portal</h3>
            <p className="text-gray-400 mb-4">Access your comprehensive health management system</p>
            <Button 
              onClick={() => window.open('/care/insights', '_blank')}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Open Health Portal →
            </Button>
          </div>
        </div>
      }
    ]
  };

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(activeFeature === featureId ? null : featureId);
  };

  const activeFeatureData = Object.values(features).flat().find(f => f.id === activeFeature);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeFeature ? (
          // Main Dashboard
          (<div>
            {/* Top Stats */}
            <TopStats />
            {/* Core Features Section */}
            <Section title="Core Features" icon={<Bot className="w-6 h-6 text-cyan-400" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.core.map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    badge={feature.badge || undefined}
                    onClick={() => handleFeatureClick(feature.id)}
                  />
                ))}
              </div>
            </Section>
            <Separator className="bg-cyan-400/20" />
            {/* Token & Governance Section */}
            <Section title="Token & Governance" icon={<Coins className="w-6 h-6 text-yellow-400" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.token.map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    badge={feature.badge || undefined}
                    onClick={() => handleFeatureClick(feature.id)}
                  />
                ))}
              </div>
            </Section>
            <Separator className="bg-cyan-400/20" />
            {/* Platform Tools Section */}
            <Section title="Platform Tools" icon={<Settings className="w-6 h-6 text-purple-400" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.tools.map((feature) => (
                  <FeatureCard
                    key={feature.id}
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                    badge={feature.badge || undefined}
                    onClick={() => handleFeatureClick(feature.id)}
                  />
                ))}
              </div>
            </Section>
          </div>)
        ) : (
          // Active Feature View
          (<div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setActiveFeature(null)}
                  className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400"
                >
                  ← Back to Dashboard
                </Button>
                <div>
                  <h2 className="text-3xl font-bold text-cyan-300">
                    {activeFeatureData?.title}
                  </h2>
                  <p className="text-gray-400">
                    {activeFeatureData?.description}
                  </p>
                </div>
              </div>
            </div>
            <Card className="bg-zinc-900/50 border border-cyan-400/20 rounded-xl overflow-hidden">
              <CardContent className="p-0">
                {activeFeatureData?.component}
              </CardContent>
            </Card>
          </div>)
        )}
      </div>
    </div>
  );
}
