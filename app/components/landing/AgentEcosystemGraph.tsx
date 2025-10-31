'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Agent {
  id: string;
  name: string;
  type: 'CFO' | 'Care' | 'Crypto';
  xp: number;
  level: number;
  owner: string;
  tasks: number;
  status: 'active' | 'idle' | 'evolving';
  growthRate: number;
  evolutionStage: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  connections: string[];
  lastActivity: number;
}

interface EcosystemStats {
  totalAgents: number;
  totalXP: number;
  averageLevel: number;
  activeAgents: number;
  evolvingAgents: number;
  totalTasks: number;
}

const AgentEcosystemGraph = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [ecosystemStats, setEcosystemStats] = useState<EcosystemStats>({
    totalAgents: 0,
    totalXP: 0,
    averageLevel: 0,
    activeAgents: 0,
    evolvingAgents: 0,
    totalTasks: 0,
  });

  // Mock agents data
  const [agents] = useState<Agent[]>([
    {
      id: 'cfo-001',
      name: 'CFO-001',
      type: 'CFO',
      xp: 12500,
      level: 3,
      owner: '0x123...abc',
      tasks: 15,
      status: 'active',
      growthRate: 0.15,
      evolutionStage: 3,
      position: { x: 20, y: 30, z: 0 },
      connections: ['care-042', 'crypto-089'],
      lastActivity: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    },
    {
      id: 'care-042',
      name: 'Care-042',
      type: 'Care',
      xp: 8900,
      level: 2,
      owner: '0x456...def',
      tasks: 8,
      status: 'evolving',
      growthRate: 0.25,
      evolutionStage: 2,
      position: { x: 60, y: 25, z: 0 },
      connections: ['cfo-001', 'crypto-301'],
      lastActivity: Date.now() - 1000 * 60 * 10, // 10 minutes ago
    },
    {
      id: 'crypto-089',
      name: 'Crypto-089',
      type: 'Crypto',
      xp: 15600,
      level: 4,
      owner: '0x789...ghi',
      tasks: 22,
      status: 'active',
      growthRate: 0.12,
      evolutionStage: 4,
      position: { x: 40, y: 60, z: 0 },
      connections: ['cfo-001', 'cfo-156'],
      lastActivity: Date.now() - 1000 * 60 * 2, // 2 minutes ago
    },
    {
      id: 'cfo-156',
      name: 'CFO-156',
      type: 'CFO',
      xp: 6700,
      level: 2,
      owner: '0xabc...jkl',
      tasks: 12,
      status: 'idle',
      growthRate: 0.08,
      evolutionStage: 2,
      position: { x: 80, y: 45, z: 0 },
      connections: ['crypto-089', 'care-203'],
      lastActivity: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    },
    {
      id: 'care-203',
      name: 'Care-203',
      type: 'Care',
      xp: 11200,
      level: 3,
      owner: '0xdef...mno',
      tasks: 18,
      status: 'active',
      growthRate: 0.18,
      evolutionStage: 3,
      position: { x: 15, y: 70, z: 0 },
      connections: ['cfo-156', 'crypto-301'],
      lastActivity: Date.now() - 1000 * 60 * 8, // 8 minutes ago
    },
    {
      id: 'crypto-301',
      name: 'Crypto-301',
      type: 'Crypto',
      xp: 4300,
      level: 1,
      owner: '0xghi...pqr',
      tasks: 5,
      status: 'idle',
      growthRate: 0.05,
      evolutionStage: 1,
      position: { x: 75, y: 75, z: 0 },
      connections: ['care-042', 'care-203'],
      lastActivity: Date.now() - 1000 * 60 * 60, // 1 hour ago
    },
  ]);

  // Calculate ecosystem stats
  useEffect(() => {
    const stats: EcosystemStats = {
      totalAgents: agents.length,
      totalXP: agents.reduce((sum, agent) => sum + agent.xp, 0),
      averageLevel: agents.reduce((sum, agent) => sum + agent.level, 0) / agents.length,
      activeAgents: agents.filter(agent => agent.status === 'active').length,
      evolvingAgents: agents.filter(agent => agent.status === 'evolving').length,
      totalTasks: agents.reduce((sum, agent) => sum + agent.tasks, 0),
    };
    setEcosystemStats(stats);
  }, [agents]);

  const getAgentColor = (type: Agent['type']) => {
    switch (type) {
      case 'CFO': return 'from-purple-500 to-blue-500';
      case 'Care': return 'from-emerald-500 to-green-500';
      case 'Crypto': return 'from-orange-500 to-yellow-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getAgentIcon = (type: Agent['type']) => {
    switch (type) {
      case 'CFO': return '🧠';
      case 'Care': return '❤️';
      case 'Crypto': return '📈';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-gray-500';
      case 'evolving': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getEvolutionStageColor = (stage: number) => {
    switch (stage) {
      case 1: return 'from-gray-500 to-gray-600';
      case 2: return 'from-blue-500 to-cyan-500';
      case 3: return 'from-purple-500 to-violet-500';
      case 4: return 'from-yellow-500 to-orange-500';
      case 5: return 'from-pink-500 to-rose-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const getXPToNextLevel = (currentXP: number, level: number) => {
    const levelThresholds = [0, 1000, 5000, 10000, 20000, 50000];
    const nextThreshold = levelThresholds[level] || 50000;
    return nextThreshold - currentXP;
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xl font-bold text-white mb-2">Agent Ecosystem Graph</h3>
        <p className="text-sm text-gray-400">XP levels, growth patterns, and agent connections</p>
      </div>

      {/* Ecosystem Stats */}
      <div className="absolute top-4 right-4 z-10 grid grid-cols-2 gap-2">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400">Total Agents</div>
          <div className="text-lg font-bold text-white">{ecosystemStats.totalAgents}</div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400">Total XP</div>
          <div className="text-lg font-bold text-purple-400">
            {(ecosystemStats.totalXP / 1000).toFixed(1)}K
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400">Avg Level</div>
          <div className="text-lg font-bold text-blue-400">
            {ecosystemStats.averageLevel.toFixed(1)}
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400">Active</div>
          <div className="text-lg font-bold text-green-400">{ecosystemStats.activeAgents}</div>
        </div>
      </div>

      {/* Ecosystem Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="ecosystem-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ecosystem-grid)" />
          </svg>
        </div>

        {/* Agent Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {agents.map(agent => 
            agent.connections.map(connectionId => {
              const connectedAgent = agents.find(a => a.id === connectionId);
              if (!connectedAgent) return null;

              return (
                <motion.line
                  key={`${agent.id}-${connectionId}`}
                  x1={`${agent.position.x}%`}
                  y1={`${agent.position.y}%`}
                  x2={`${connectedAgent.position.x}%`}
                  y2={`${connectedAgent.position.y}%`}
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.3"
                  className="text-slate-600"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              );
            })
          )}
        </svg>

        {/* Agent Nodes */}
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            className="absolute cursor-pointer"
            style={{
              left: `${agent.position.x}%`,
              top: `${agent.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAgent(agent)}
            onMouseEnter={() => setHoveredAgent(agent.id)}
            onMouseLeave={() => setHoveredAgent(null)}
          >
            {/* Agent Node */}
            <div className={`relative w-20 h-20 rounded-full bg-gradient-to-r ${getAgentColor(agent.type)} p-1 shadow-lg`}>
              {/* Evolution Stage Ring */}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getEvolutionStageColor(agent.evolutionStage)} opacity-20`} />
              
              {/* Agent Icon */}
              <div className="w-full h-full rounded-full bg-slate-800/80 flex items-center justify-center text-2xl relative z-10">
                {getAgentIcon(agent.type)}
              </div>

              {/* Status Indicator */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getStatusColor(agent.status)} border-2 border-slate-900 flex items-center justify-center text-xs font-bold`}>
                {agent.level}
              </div>

              {/* XP Progress Ring */}
              <svg className="absolute inset-0 w-20 h-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${(agent.xp / 50000) * 201} 201`}
                  className="text-white transition-all duration-1000"
                />
              </svg>

              {/* Growth Rate Indicator */}
              <div className={`absolute -bottom-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                agent.growthRate > 0.2 ? 'bg-green-500' :
                agent.growthRate > 0.1 ? 'bg-yellow-500' : 'bg-gray-500'
              }`}>
                {agent.growthRate > 0.2 ? '↗' : agent.growthRate > 0.1 ? '→' : '↘'}
              </div>

              {/* Evolution Particles */}
              {agent.status === 'evolving' && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(251, 191, 36, 0.5)',
                      '0 0 20px rgba(251, 191, 36, 0.8)',
                      '0 0 0px rgba(251, 191, 36, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </div>

            {/* Agent Label */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center max-w-32">
              <div className="text-xs font-medium text-white bg-slate-800/80 px-2 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis">
                {agent.name}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Lv.{agent.level} • {agent.tasks} tasks
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {formatTimeAgo(agent.lastActivity)}
              </div>
            </div>

            {/* XP Flow Particles */}
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${agent.position.x}%`,
                top: `${agent.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />
          </motion.div>
        ))}

        {/* Central Ecosystem Core */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-2xl">🌐</span>
        </motion.div>
      </div>

      {/* Agent Details Panel */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-4 right-4 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white">{selectedAgent.name}</h4>
              <button
                onClick={() => setSelectedAgent(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Agent Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Level</div>
                  <div className="text-xl font-bold text-white">{selectedAgent.level}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">XP</div>
                  <div className="text-xl font-bold text-white">{selectedAgent.xp.toLocaleString()}</div>
                </div>
              </div>

              {/* XP Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">XP Progress</span>
                  <span className="text-white">
                    {getXPToNextLevel(selectedAgent.xp, selectedAgent.level).toLocaleString()} to next level
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(selectedAgent.xp / 50000) * 100}%` }}
                  />
                </div>
              </div>

              {/* Growth Rate */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Growth Rate</div>
                <div className="text-lg font-bold text-white">
                  {(selectedAgent.growthRate * 100).toFixed(1)}%
                </div>
              </div>

              {/* Evolution Stage */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Evolution Stage</div>
                <div className="text-lg font-bold text-white">Stage {selectedAgent.evolutionStage}</div>
              </div>

              {/* Owner and Tasks */}
              <div className="space-y-2">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Owner</div>
                  <div className="text-sm font-mono text-white">{selectedAgent.owner}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Active Tasks</div>
                  <div className="text-lg font-bold text-white">{selectedAgent.tasks}</div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedAgent.status)}`} />
                <span className="text-sm text-gray-300 capitalize">{selectedAgent.status}</span>
              </div>

              {/* Last Activity */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Last Activity</div>
                <div className="text-sm text-white">{formatTimeAgo(selectedAgent.lastActivity)}</div>
              </div>

              {/* Connections */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-2">Connections</div>
                <div className="flex flex-wrap gap-1">
                  {selectedAgent.connections.map(connectionId => {
                    const connectedAgent = agents.find(a => a.id === connectionId);
                    return connectedAgent ? (
                      <span key={connectionId} className="text-xs bg-slate-600 px-2 py-1 rounded">
                        {connectedAgent.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredAgent && (
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
              const agent = agents.find(a => a.id === hoveredAgent);
              return agent ? (
                <div>
                  <div className="font-medium text-white">{agent.name}</div>
                  <div className="text-gray-400 mt-1">Level {agent.level} • {agent.xp.toLocaleString()} XP</div>
                  <div className="text-gray-400 mt-1">{agent.tasks} tasks • {agent.status}</div>
                  <div className="text-gray-400 mt-1">Growth: {(agent.growthRate * 100).toFixed(1)}%</div>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentEcosystemGraph;
