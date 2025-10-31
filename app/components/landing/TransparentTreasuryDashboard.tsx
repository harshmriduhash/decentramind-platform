'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreasuryFlow {
  id: string;
  type: 'inflow' | 'outflow';
  amount: number;
  source: string;
  destination: string;
  timestamp: number;
  category: 'minting' | 'staking' | 'governance' | 'grants' | 'rewards' | 'fees';
  status: 'pending' | 'completed' | 'failed';
}

interface TreasuryStats {
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
  dailyInflow: number;
  dailyOutflow: number;
  monthlyInflow: number;
  monthlyOutflow: number;
}

const TransparentTreasuryDashboard = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFlow, setSelectedFlow] = useState<TreasuryFlow | null>(null);
  const [hoveredFlow, setHoveredFlow] = useState<string | null>(null);
  const [stats, setStats] = useState<TreasuryStats>({
    totalBalance: 2456789.50,
    availableBalance: 1234567.25,
    lockedBalance: 1222222.25,
    dailyInflow: 45678.90,
    dailyOutflow: 23456.78,
    monthlyInflow: 1234567.89,
    monthlyOutflow: 987654.32,
  });

  // Mock treasury flows data
  const [flows] = useState<TreasuryFlow[]>([
    {
      id: 'flow-001',
      type: 'inflow',
      amount: 1250.00,
      source: 'Agent Minting Fees',
      destination: 'Treasury',
      timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
      category: 'minting',
      status: 'completed',
    },
    {
      id: 'flow-002',
      type: 'outflow',
      amount: 5000.00,
      source: 'Treasury',
      destination: 'Community Grant',
      timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
      category: 'grants',
      status: 'completed',
    },
    {
      id: 'flow-003',
      type: 'inflow',
      amount: 890.50,
      source: 'Staking Rewards',
      destination: 'Treasury',
      timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
      category: 'staking',
      status: 'completed',
    },
    {
      id: 'flow-004',
      type: 'outflow',
      amount: 2500.00,
      source: 'Treasury',
      destination: 'DAO Proposal Execution',
      timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
      category: 'governance',
      status: 'completed',
    },
    {
      id: 'flow-005',
      type: 'inflow',
      amount: 3456.78,
      source: 'Agent Task Rewards',
      destination: 'Treasury',
      timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
      category: 'rewards',
      status: 'completed',
    },
    {
      id: 'flow-006',
      type: 'outflow',
      amount: 1500.00,
      source: 'Treasury',
      destination: 'Protocol Development',
      timestamp: Date.now() - 1000 * 60 * 90, // 1.5 hours ago
      category: 'grants',
      status: 'pending',
    },
  ]);

  const getCategoryIcon = (category: TreasuryFlow['category']) => {
    switch (category) {
      case 'minting': return '🪙';
      case 'staking': return '🔒';
      case 'governance': return '🏛️';
      case 'grants': return '💸';
      case 'rewards': return '🎁';
      case 'fees': return '💰';
      default: return '📊';
    }
  };

  const getCategoryColor = (category: TreasuryFlow['category']) => {
    switch (category) {
      case 'minting': return 'from-blue-500 to-cyan-500';
      case 'staking': return 'from-purple-500 to-violet-500';
      case 'governance': return 'from-green-500 to-emerald-500';
      case 'grants': return 'from-orange-500 to-yellow-500';
      case 'rewards': return 'from-pink-500 to-rose-500';
      case 'fees': return 'from-gray-500 to-slate-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: TreasuryFlow['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xl font-bold text-white mb-2">Transparent Treasury Dashboard</h3>
        <p className="text-sm text-gray-400">Real-time token flows and treasury transparency</p>
      </div>

      {/* Treasury Stats Grid */}
      <div className="absolute top-4 right-4 z-10 grid grid-cols-2 gap-4">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <div className="text-xs text-gray-400">Total Balance</div>
          <div className="text-lg font-bold text-white">
            {stats.totalBalance.toLocaleString()} DMT
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <div className="text-xs text-gray-400">Available</div>
          <div className="text-lg font-bold text-green-400">
            {stats.availableBalance.toLocaleString()} DMT
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <div className="text-xs text-gray-400">Daily Inflow</div>
          <div className="text-sm font-bold text-green-400">
            +{stats.dailyInflow.toLocaleString()} DMT
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/50">
          <div className="text-xs text-gray-400">Daily Outflow</div>
          <div className="text-sm font-bold text-red-400">
            -{stats.dailyOutflow.toLocaleString()} DMT
          </div>
        </div>
      </div>

      {/* Treasury Flow Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Central Treasury Node */}
        <motion.div
          className="relative w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-3xl">🏦</span>
          
          {/* Balance Display */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-xs text-gray-400">Treasury</div>
            <div className="text-sm font-bold text-white">
              {(stats.totalBalance / 1000000).toFixed(1)}M DMT
            </div>
          </div>
        </motion.div>

        {/* Flow Streams */}
        {flows.map((flow, index) => {
          const angle = (index * 60) % 360;
          const radius = 150;
          const x = 50 + Math.cos((angle * Math.PI) / 180) * (radius / 2);
          const y = 50 + Math.sin((angle * Math.PI) / 180) * (radius / 2);

          return (
            <motion.div
              key={flow.id}
              className="absolute cursor-pointer"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFlow(flow)}
              onMouseEnter={() => setHoveredFlow(flow.id)}
              onMouseLeave={() => setHoveredFlow(null)}
            >
              {/* Flow Node */}
              <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${getCategoryColor(flow.category)} p-1 shadow-lg`}>
                {/* Category Icon */}
                <div className="w-full h-full rounded-full bg-slate-800/80 flex items-center justify-center text-lg">
                  {getCategoryIcon(flow.category)}
                </div>

                {/* Flow Direction Indicator */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  flow.type === 'inflow' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {flow.type === 'inflow' ? '↗' : '↙'}
                </div>

                {/* Amount Ring */}
                <svg className="absolute inset-0 w-16 h-16 -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${(flow.amount / 5000) * 175.9} 175.9`}
                    className={flow.type === 'inflow' ? 'text-green-400' : 'text-red-400'}
                  />
                </svg>
              </div>

              {/* Flow Label */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center max-w-24">
                <div className="text-xs font-medium text-white bg-slate-800/80 px-2 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis">
                  {flow.amount.toLocaleString()} DMT
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatTimeAgo(flow.timestamp)}
                </div>
              </div>

              {/* Connection Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={`${x}%`}
                  y2={`${y}%`}
                  stroke={flow.type === 'inflow' ? '#10b981' : '#ef4444'}
                  strokeWidth="2"
                  opacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                />
              </svg>

              {/* Animated Flow Particles */}
              <motion.div
                className={`absolute w-2 h-2 rounded-full ${
                  flow.type === 'inflow' ? 'bg-green-400' : 'bg-red-400'
                }`}
                style={{
                  left: flow.type === 'inflow' ? `${x}%` : '50%',
                  top: flow.type === 'inflow' ? `${y}%` : '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  left: flow.type === 'inflow' ? '50%' : `${x}%`,
                  top: flow.type === 'inflow' ? '50%' : `${y}%`,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.3,
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Flow Details Panel */}
      <AnimatePresence>
        {selectedFlow && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-4 right-4 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white">Flow Details</h4>
              <button
                onClick={() => setSelectedFlow(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Flow Info */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{getCategoryIcon(selectedFlow.category)}</span>
                  <span className="text-sm text-gray-400 capitalize">{selectedFlow.category}</span>
                </div>
                <div className="text-lg font-bold text-white">
                  {selectedFlow.amount.toLocaleString()} DMT
                </div>
                <div className={`text-sm ${getStatusColor(selectedFlow.status)}`}>
                  {selectedFlow.status}
                </div>
              </div>

              {/* Source and Destination */}
              <div className="space-y-2">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Source</div>
                  <div className="text-sm text-white">{selectedFlow.source}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Destination</div>
                  <div className="text-sm text-white">{selectedFlow.destination}</div>
                </div>
              </div>

              {/* Timestamp */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Time</div>
                <div className="text-sm text-white">{formatTimeAgo(selectedFlow.timestamp)}</div>
              </div>

              {/* Flow Type */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  selectedFlow.type === 'inflow' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-300 capitalize">{selectedFlow.type}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredFlow && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg p-3 text-sm max-w-48"
            style={{
              left: '50%',
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            {(() => {
              const flow = flows.find(f => f.id === hoveredFlow);
              return flow ? (
                <div>
                  <div className="font-medium text-white">{flow.source}</div>
                  <div className="text-gray-400 mt-1">
                    {flow.type === 'inflow' ? '+' : '-'}{flow.amount.toLocaleString()} DMT
                  </div>
                  <div className={`capitalize mt-1 ${getStatusColor(flow.status)}`}>
                    {flow.status}
                  </div>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Activity Feed */}
      <div className="absolute bottom-4 left-4 w-64 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
        <h4 className="text-sm font-bold text-white mb-3">Live Activity</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {flows.slice(0, 3).map((flow) => (
            <motion.div
              key={flow.id}
              className="flex items-center space-x-2 text-xs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-lg">{getCategoryIcon(flow.category)}</span>
              <div className="flex-1">
                <div className="text-white">{flow.source}</div>
                <div className={`${flow.type === 'inflow' ? 'text-green-400' : 'text-red-400'}`}>
                  {flow.type === 'inflow' ? '+' : '-'}{flow.amount.toLocaleString()} DMT
                </div>
              </div>
              <div className="text-gray-400">{formatTimeAgo(flow.timestamp)}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransparentTreasuryDashboard;
