'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentNode {
  id: string;
  name: string;
  type: 'cfo' | 'care' | 'crypto';
  position: { x: number; y: number };
  stats: {
    level: number;
    xp: number;
    tasksCompleted: number;
    mintStatus: 'minted' | 'available' | 'evolving';
    evolutionLevel: number;
  };
  connections: string[];
}

const EcosystemMap = () => {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const agents: AgentNode[] = [
    {
      id: 'cfo',
      name: 'Autonomous CFO',
      type: 'cfo',
      position: { x: 30, y: 40 },
      stats: {
        level: 85,
        xp: 12500,
        tasksCompleted: 47,
        mintStatus: 'minted',
        evolutionLevel: 3,
      },
      connections: ['care', 'crypto'],
    },
    {
      id: 'care',
      name: 'Care Orchestrator',
      type: 'care',
      position: { x: 70, y: 30 },
      stats: {
        level: 92,
        xp: 18900,
        tasksCompleted: 63,
        mintStatus: 'minted',
        evolutionLevel: 4,
      },
      connections: ['cfo', 'crypto'],
    },
    {
      id: 'crypto',
      name: 'Crypto Alpha Assistant',
      type: 'crypto',
      position: { x: 50, y: 70 },
      stats: {
        level: 78,
        xp: 9800,
        tasksCompleted: 34,
        mintStatus: 'evolving',
        evolutionLevel: 2,
      },
      connections: ['cfo', 'care'],
    },
  ];

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'cfo': return '🧠';
      case 'care': return '❤️';
      case 'crypto': return '📈';
      default: return '🤖';
    }
  };

  const getAgentColor = (type: string) => {
    switch (type) {
      case 'cfo': return 'from-purple-500 to-blue-500';
      case 'care': return 'from-red-500 to-pink-500';
      case 'crypto': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'minted': return 'text-green-400';
      case 'available': return 'text-yellow-400';
      case 'evolving': return 'text-purple-400';
      default: return 'text-gray-400';
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
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            Ecosystem Neural Network
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Watch your AI agents evolve and interconnect in real-time
          </motion.p>
        </div>

        {/* Neural Network Visualization */}
        <div className="relative h-96 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-3xl border border-slate-700/50 overflow-hidden">
          {/* Background Neural Grid */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="neuralGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#neuralGrid)" />
            
            {/* Animated Connection Lines */}
            {agents.map((agent) =>
              agent.connections.map((connectionId) => {
                const connectedAgent = agents.find(a => a.id === connectionId);
                if (!connectedAgent) return null;
                
                return (
                  <motion.line
                    key={`${agent.id}-${connectionId}`}
                    x1={agent.position.x}
                    y1={agent.position.y}
                    x2={connectedAgent.position.x}
                    y2={connectedAgent.position.y}
                    stroke="url(#connectionGradient)"
                    strokeWidth="1"
                    opacity="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                );
              })
            )}
            
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Agent Nodes */}
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${agent.position.x}%`,
                top: `${agent.position.y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            >
              {/* Agent Node */}
              <motion.div
                className={`relative w-20 h-20 bg-gradient-to-br ${getAgentColor(agent.type)} rounded-full flex items-center justify-center cursor-pointer shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 40px rgba(59, 130, 246, 0.6)",
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-3xl">{getAgentIcon(agent.type)}</span>
                
                {/* Evolution Ring */}
                <svg className="absolute inset-0 w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="url(#evolutionGradient)"
                    strokeWidth="2"
                    fill="transparent"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 220" }}
                    animate={{ strokeDasharray: `${(agent.stats.evolutionLevel / 5) * 220} 220` }}
                    transition={{ duration: 1.5, delay: index * 0.3 }}
                  />
                </svg>
                
                {/* Level Badge */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">{agent.stats.evolutionLevel}</span>
                </div>
              </motion.div>

              {/* Hover Stats */}
              <AnimatePresence>
                {hoveredAgent === agent.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20"
                  >
                    <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 min-w-48 shadow-xl">
                      <h3 className="text-lg font-bold text-white mb-2">{agent.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Level:</span>
                          <span className="text-white">{agent.stats.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">XP:</span>
                          <span className="text-white">{agent.stats.xp.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tasks:</span>
                          <span className="text-white">{agent.stats.tasksCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={getStatusColor(agent.stats.mintStatus)}>
                            {agent.stats.mintStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {/* Central Hub */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl"
            animate={{
              scale: [1, 1.2, 1],
              rotate: 360,
            }}
            transition={{
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
          >
            <span className="text-2xl">⚡</span>
          </motion.div>
        </div>

        {/* Agent Details Panel */}
        <AnimatePresence>
          {selectedAgent && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              {(() => {
                const agent = agents.find(a => a.id === selectedAgent);
                if (!agent) return null;
                
                return (
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 p-8">
                    <div className="flex items-center mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getAgentColor(agent.type)} rounded-xl flex items-center justify-center mr-6`}>
                        <span className="text-3xl">{getAgentIcon(agent.type)}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{agent.name}</h3>
                        <p className="text-gray-400">Evolution Level {agent.stats.evolutionLevel}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{agent.stats.level}</div>
                        <div className="text-sm text-gray-400">Level</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{agent.stats.xp.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{agent.stats.tasksCompleted}</div>
                        <div className="text-sm text-gray-400">Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getStatusColor(agent.stats.mintStatus)}`}>
                          {agent.stats.mintStatus}
                        </div>
                        <div className="text-sm text-gray-400">Status</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default EcosystemMap;


