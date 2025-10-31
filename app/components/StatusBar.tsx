'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard, 
  Star, 
  Flame, 
  TrendingUp, 
  Wallet, 
  Coins, 
  RefreshCw, 
  AlertTriangle,
  Plus,
  Crown,
  Zap
} from 'lucide-react';

interface StatusBarProps {
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock data - replace with real data from your services
  const [creditBalance] = useState(0);
  const [subscriptionTier] = useState('None');
  const [totalBurned] = useState(0.00);
  const [recentBurnAmount] = useState(0.00);
  const [dmtBalance] = useState(0.00);
  const [solBalance] = useState(0.0000);

  const getCreditStatus = () => {
    if (creditBalance > 50) return 'high';
    if (creditBalance > 20) return 'medium';
    if (creditBalance > 5) return 'low';
    return 'critical';
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'freemium': return 'text-gray-400';
      case 'basic': return 'text-blue-400';
      case 'pro': return 'text-green-400';
      case 'enterprise': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'freemium': return <Star className="w-4 h-4" />;
      case 'basic': return <TrendingUp className="w-4 h-4" />;
      case 'pro': return <Crown className="w-4 h-4" />;
      case 'enterprise': return <Zap className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setLoading(false);
  };

  const handleBuyCredits = () => {
    // Implement buy credits functionality
    console.log('Buy credits clicked');
  };

  const handleUpgradeTier = () => {
    // Implement upgrade tier functionality
    console.log('Upgrade tier clicked');
  };

  const creditStatus = getCreditStatus();
  const isLowBalance = creditStatus === 'critical' || creditStatus === 'low';

  return (
    <Card className={cn(
      "bg-cyan-950/40 backdrop-blur-md shadow-inner rounded-xl",
      "border border-cyan-400/30 shadow-2xl shadow-cyan-400/10",
      "sticky top-20 z-50 mx-4 mt-2",
      className
    )}>
      <CardContent className="px-6 py-4">
        {/* Main Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {/* Credits */}
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-3 rounded-xl",
              isLowBalance 
                ? "bg-red-500/20 border border-red-500/30" 
                : "bg-cyan-500/20 border border-cyan-500/30"
            )}>
              <CreditCard className={cn(
                "w-6 h-6",
                isLowBalance ? "text-red-400" : "text-cyan-400"
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-medium",
                isLowBalance ? "text-red-400" : "text-white"
              )}>
                {creditBalance}
              </p>
              <p className="text-xs text-gray-400">Credits</p>
            </div>
            {isLowBalance && (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
          </div>

          {/* Tier */}
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gray-700/30 border border-gray-600/30">
              {getTierIcon(subscriptionTier)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium", getTierColor(subscriptionTier))}>
                {subscriptionTier}
              </p>
              <p className="text-xs text-gray-400">Tier</p>
            </div>
          </div>

          {/* Total Burned */}
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-orange-400">
                {totalBurned.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">Total Burned</p>
            </div>
          </div>

          {/* 24h Burn */}
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-teal-500/20 border border-teal-500/30">
              <TrendingUp className="w-6 h-6 text-teal-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-teal-400">
                {recentBurnAmount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">24h Burn</p>
            </div>
          </div>

          {/* DMT Balance */}
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
              <Coins className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-400">
                {dmtBalance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">DMT Balance</p>
            </div>
          </div>

          {/* SOL Balance */}
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <Wallet className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-cyan-400">
                {solBalance.toFixed(4)}
              </p>
              <p className="text-xs text-gray-400">SOL Balance</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Info */}
          <div className="flex items-center space-x-4">
            <span className="text-xs text-gray-400">
              Last updated: {formatTimeAgo(lastUpdate)}
            </span>
            {isLowBalance && (
              <Badge variant="destructive" className="text-xs">
                Low Balance
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleBuyCredits}
              size="default"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/25 font-semibold px-6 py-2"
            >
              <Plus className="w-5 h-5 mr-2" />
              Buy Credits
            </Button>
            
            <Button
              onClick={handleUpgradeTier}
              variant="outline"
              size="default"
              className="border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/10 hover:border-cyan-400 hover:shadow-cyan-400/20 font-semibold px-6 py-2"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade Tier
            </Button>

            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="default"
              disabled={loading}
              className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10 px-4 py-2"
            >
              <RefreshCw className={cn(
                "w-5 h-5",
                loading && "animate-spin"
              )} />
            </Button>
          </div>
        </div>

        {/* Low Balance Alert */}
        {isLowBalance && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-sm text-red-300">
                Low credit balance! Consider upgrading your subscription or purchasing more credits to continue using AI agents.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
