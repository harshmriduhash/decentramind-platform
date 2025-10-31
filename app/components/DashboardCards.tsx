'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Flame, 
  Bot, 
  Store, 
  Crown, 
  Building2, 
  Rocket, 
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
  onClick: () => void;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  color,
  badge,
  onClick,
  className
}) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden cursor-pointer",
        "bg-cyan-950/30 hover:shadow-cyan-500/10 transition-all duration-300 ease-in-out",
        "rounded-xl p-6 hover:scale-105 hover:-translate-y-1",
        "border border-gray-700/50 hover:border-cyan-400/50",
        className
      )}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className={cn(
            "p-3 rounded-xl border-2",
            color
          )}>
            {icon}
          </div>
          {badge && (
            <Badge 
              variant="secondary"
              className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 text-xs font-medium px-2 py-1"
            >
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardTitle className="text-white text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-colors duration-200">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400 text-sm leading-relaxed mb-4 group-hover:text-gray-200 transition-colors duration-200">
          {description}
        </CardDescription>
        
        <Button
          size="sm"
          variant="outline"
          className="w-full bg-cyan-950/30 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-cyan-400/20 transition-all duration-200 font-medium"
        >
          Open
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
        </Button>
      </CardContent>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-blue-400/0 to-cyan-400/0 group-hover:from-cyan-400/5 group-hover:via-blue-400/5 group-hover:to-cyan-400/5 transition-all duration-300 pointer-events-none" />
    </Card>
  );
};

interface DashboardCardsProps {
  onCardClick: (cardId: string) => void;
  className?: string;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  onCardClick,
  className
}) => {
  const dashboardCards = [
    {
      id: 'subscription',
      title: 'Subscription Management',
      description: 'Manage your subscription and credits',
      icon: <CreditCard className="w-6 h-6 text-cyan-400" />,
      color: 'border-cyan-400/50 bg-cyan-500/20',
      badge: 'Active'
    },
    {
      id: 'burning',
      title: 'Burning Analytics',
      description: 'View token burning metrics and deflationary data',
      icon: <Flame className="w-6 h-6 text-orange-400" />,
      color: 'border-orange-400/50 bg-orange-500/20'
    },
    {
      id: 'mint-agent',
      title: 'Agent Minting',
      description: 'Create and mint new AI agents',
      icon: <Bot className="w-6 h-6 text-teal-400" />,
      color: 'border-teal-400/50 bg-teal-500/20',
      badge: 'New'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Buy and sell AI agents securely',
      icon: <Store className="w-6 h-6 text-purple-400" />,
      color: 'border-purple-400/50 bg-purple-500/20'
    },
    {
      id: 'staking',
      title: 'Staking & Rewards',
      description: 'Stake tokens and earn rewards',
      icon: <Crown className="w-6 h-6 text-yellow-400" />,
      color: 'border-yellow-400/50 bg-yellow-500/20'
    },
    {
      id: 'dao',
      title: 'DAO Governance',
      description: 'Participate in governance decisions',
      icon: <Building2 className="w-6 h-6 text-pink-400" />,
      color: 'border-pink-400/50 bg-pink-500/20'
    },
    {
      id: 'launchpad',
      title: 'Launchpad',
      description: 'Invest in DAO-backed token projects',
      icon: <Rocket className="w-6 h-6 text-cyan-400" />,
      color: 'border-cyan-400/50 bg-cyan-500/20',
      badge: 'Hot'
    },
    {
      id: 'analytics',
      title: 'Analytics Dashboard',
      description: 'Track performance and insights',
      icon: <TrendingUp className="w-6 h-6 text-green-400" />,
      color: 'border-green-400/50 bg-green-500/20'
    }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-2xl flex items-center justify-center border border-cyan-400/30 shadow-lg shadow-cyan-400/25">
            <Sparkles className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-cyan-300 mb-2">Dashboard</h2>
            <p className="text-gray-400 text-lg">Your AI-powered productivity & wellness ecosystem</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card) => (
          <DashboardCard
            key={card.id}
            title={card.title}
            description={card.description}
            icon={card.icon}
            color={card.color}
            badge={card.badge}
            onClick={() => onCardClick(card.id)}
          />
        ))}
      </div>
    </div>
  );
};
