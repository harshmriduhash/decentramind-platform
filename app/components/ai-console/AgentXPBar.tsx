'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getAgentById } from '../../utils/careAgentData';

interface AgentXPBarProps {
  agentId: string;
}

const AgentXPBar: React.FC<AgentXPBarProps> = ({ agentId }) => {
  const agent = getAgentById(agentId);
  
  if (!agent) return null;

  const xpProgress = (agent.xp % 1000) / 10; // Progress to next level
  const nextLevelXP = ((agent.level + 1) * 1000) - agent.xp;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{agent.avatar}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <p className="text-sm text-gray-400">Level {agent.level} • {agent.xp.toLocaleString()} XP</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-emerald-400">
            ${agent.totalEarnings.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Total Earnings</div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress to Level {agent.level + 1}</span>
          <span className="text-gray-400">{nextLevelXP} XP to go</span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full relative`}
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{agent.tasksCompleted}</div>
          <div className="text-sm text-gray-400">Tasks Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">{agent.successRate}%</div>
          <div className="text-sm text-gray-400">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{agent.capabilities.length}</div>
          <div className="text-sm text-gray-400">Capabilities</div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Capabilities</h4>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((capability, index) => (
            <motion.span
              key={capability}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-3 py-1 bg-slate-700/50 rounded-full text-xs text-gray-300 border border-slate-600/30"
            >
              {capability}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AgentXPBar;
