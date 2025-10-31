'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LiveStat {
  id: string;
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
  format: 'number' | 'currency' | 'percentage';
}

const LiveStats = () => {
  const [stats, setStats] = useState<LiveStat[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Mock data - in a real app, this would come from Firebase or Solana
  const mockStats: LiveStat[] = [
    {
      id: 'total_agents',
      label: 'Active Agents',
      value: 1247,
      change: 23,
      changeType: 'increase',
      icon: '🤖',
      color: 'from-blue-500 to-cyan-500',
      format: 'number',
    },
    {
      id: 'total_tasks',
      label: 'Tasks Completed',
      value: 89432,
      change: 156,
      changeType: 'increase',
      icon: '✅',
      color: 'from-green-500 to-emerald-500',
      format: 'number',
    },
    {
      id: 'total_xp',
      label: 'Total XP Generated',
      value: 2847392,
      change: 8947,
      changeType: 'increase',
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500',
      format: 'number',
    },
    {
      id: 'dao_proposals',
      label: 'DAO Proposals',
      value: 47,
      change: 3,
      changeType: 'increase',
      icon: '🏛️',
      color: 'from-purple-500 to-violet-500',
      format: 'number',
    },
    {
      id: 'dmt_supply',
      label: 'DMT in Circulation',
      value: 45678923,
      change: 234567,
      changeType: 'increase',
      icon: '💰',
      color: 'from-emerald-500 to-teal-500',
      format: 'number',
    },
    {
      id: 'evolution_levels',
      label: 'Avg Evolution Level',
      value: 3.2,
      change: 0.1,
      changeType: 'increase',
      icon: '🧬',
      color: 'from-pink-500 to-rose-500',
      format: 'number',
    },
  ];

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: stat.value + Math.floor(Math.random() * 10),
          change: Math.floor(Math.random() * 20) + 1,
        }))
      );
    }, 5000);

    // Initial load
    setStats(mockStats);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value}%`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return '📈';
      case 'decrease':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
          >
            Live Ecosystem Metrics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Real-time data from the DecentraMind ecosystem
          </motion.p>
        </div>

        {/* Live Status Indicator */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full backdrop-blur-sm"
            animate={{
              boxShadow: [
                "0 0 20px rgba(34, 197, 94, 0.3)",
                "0 0 40px rgba(34, 197, 94, 0.6)",
                "0 0 20px rgba(34, 197, 94, 0.3)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="w-3 h-3 bg-green-400 rounded-full mr-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-green-400 font-medium">Live Data</span>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                
                {/* Change Indicator */}
                <div className={`flex items-center text-sm ${getChangeColor(stat.changeType)}`}>
                  <span className="mr-1">{getChangeIcon(stat.changeType)}</span>
                  <span>+{stat.change}</span>
                </div>
              </div>

              {/* Value */}
              <motion.div
                key={stat.value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-white mb-2"
              >
                {formatValue(stat.value, stat.format)}
              </motion.div>

              {/* Label */}
              <div className="text-gray-400 text-sm font-medium">
                {stat.label}
              </div>

              {/* Animated Progress Bar */}
              <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stat.value / 100000000) * 100, 100)}%` }}
                  transition={{ duration: 2, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Metrics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Agent Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Agent Distribution</h3>
            <div className="space-y-4">
              {[
                { name: 'Autonomous CFO', count: 423, color: 'from-purple-500 to-blue-500', icon: '🧠' },
                { name: 'Care Orchestrator', count: 387, color: 'from-red-500 to-pink-500', icon: '❤️' },
                { name: 'Crypto Alpha Assistant', count: 437, color: 'from-green-500 to-emerald-500', icon: '📈' },
              ].map((agent, index) => (
                <div key={agent.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 bg-gradient-to-br ${agent.color} rounded-lg flex items-center justify-center mr-3`}>
                      <span className="text-sm">{agent.icon}</span>
                    </div>
                    <span className="text-gray-300">{agent.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white font-semibold mr-2">{agent.count}</span>
                    <div className="w-20 bg-slate-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${agent.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(agent.count / 500) * 100}%` }}
                        transition={{ duration: 1.5, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Agent Evolution', agent: 'CFO-001', level: '3 → 4', time: '2m ago', color: 'text-green-400' },
                { action: 'Task Completed', agent: 'Care-042', level: 'Health Analysis', time: '5m ago', color: 'text-blue-400' },
                { action: 'DAO Proposal', agent: 'Crypto-089', level: 'New Protocol', time: '12m ago', color: 'text-purple-400' },
                { action: 'XP Earned', agent: 'CFO-156', level: '+1,250 XP', time: '18m ago', color: 'text-yellow-400' },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-b-0"
                >
                  <div>
                    <div className="text-sm text-gray-300">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.agent} • {activity.level}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${activity.color}`}>{activity.time}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveStats;


