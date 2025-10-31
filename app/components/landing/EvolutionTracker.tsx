'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface EvolutionStage {
  level: number;
  name: string;
  description: string;
  xpRequired: number;
  unlocks: string[];
  completed: boolean;
  icon: string;
}

interface AgentEvolution {
  id: string;
  name: string;
  icon: string;
  currentLevel: number;
  totalXP: number;
  stages: EvolutionStage[];
}

const EvolutionTracker = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('cfo');

  const agentEvolutions: AgentEvolution[] = [
    {
      id: 'cfo',
      name: 'Autonomous CFO',
      icon: '🧠',
      currentLevel: 3,
      totalXP: 12500,
      stages: [
        {
          level: 1,
          name: 'Financial Analyst',
          description: 'Basic financial data analysis and reporting',
          xpRequired: 1000,
          unlocks: ['Basic Forecasting', 'Simple Reports', 'Data Visualization'],
          completed: true,
          icon: '📊',
        },
        {
          level: 2,
          name: 'Treasury Manager',
          description: 'Advanced treasury operations and risk management',
          xpRequired: 5000,
          unlocks: ['Risk Assessment', 'Portfolio Management', 'Compliance Monitoring'],
          completed: true,
          icon: '💰',
        },
        {
          level: 3,
          name: 'Strategic CFO',
          description: 'Strategic financial planning and governance integration',
          xpRequired: 10000,
          unlocks: ['Strategic Planning', 'Governance Integration', 'Token Modeling'],
          completed: true,
          icon: '🎯',
        },
        {
          level: 4,
          name: 'Autonomous CFO',
          description: 'Fully autonomous financial operations and decision making',
          xpRequired: 20000,
          unlocks: ['Autonomous Decisions', 'AI Integration', 'Predictive Analytics'],
          completed: false,
          icon: '🤖',
        },
        {
          level: 5,
          name: 'Quantum CFO',
          description: 'Next-generation quantum financial intelligence',
          xpRequired: 50000,
          unlocks: ['Quantum Computing', 'Multi-Dimensional Analysis', 'Reality Modeling'],
          completed: false,
          icon: '⚛️',
        },
      ],
    },
    {
      id: 'care',
      name: 'Care Orchestrator',
      icon: '❤️',
      currentLevel: 4,
      totalXP: 18900,
      stages: [
        {
          level: 1,
          name: 'Health Monitor',
          description: 'Basic health data collection and monitoring',
          xpRequired: 1500,
          unlocks: ['Vital Monitoring', 'Basic Alerts', 'Data Collection'],
          completed: true,
          icon: '📱',
        },
        {
          level: 2,
          name: 'Care Coordinator',
          description: 'Healthcare provider coordination and scheduling',
          xpRequired: 6000,
          unlocks: ['Provider Coordination', 'Appointment Scheduling', 'Care Plans'],
          completed: true,
          icon: '🏥',
        },
        {
          level: 3,
          name: 'Medical Assistant',
          description: 'HIPAA-compliant medical data management',
          xpRequired: 12000,
          unlocks: ['HIPAA Compliance', 'Medical Records', 'Patient Analytics'],
          completed: true,
          icon: '🔒',
        },
        {
          level: 4,
          name: 'Care Orchestrator',
          description: 'Advanced healthcare orchestration and AI integration',
          xpRequired: 25000,
          unlocks: ['AI Diagnostics', 'Predictive Care', 'Multi-Provider Sync'],
          completed: true,
          icon: '🎼',
        },
        {
          level: 5,
          name: 'Quantum Healer',
          description: 'Quantum-level health optimization and prevention',
          xpRequired: 60000,
          unlocks: ['Quantum Health', 'Preventive Medicine', 'Bio-Integration'],
          completed: false,
          icon: '🌟',
        },
      ],
    },
    {
      id: 'crypto',
      name: 'Crypto Alpha Assistant',
      icon: '📈',
      currentLevel: 2,
      totalXP: 9800,
      stages: [
        {
          level: 1,
          name: 'Market Tracker',
          description: 'Basic cryptocurrency market monitoring',
          xpRequired: 2000,
          unlocks: ['Price Tracking', 'Market Data', 'Basic Alerts'],
          completed: true,
          icon: '📊',
        },
        {
          level: 2,
          name: 'Alpha Hunter',
          description: 'Advanced alpha discovery and protocol analysis',
          xpRequired: 8000,
          unlocks: ['Alpha Discovery', 'Protocol Analysis', 'Risk Assessment'],
          completed: true,
          icon: '🎯',
        },
        {
          level: 3,
          name: 'DAO Strategist',
          description: 'DAO governance and proposal management',
          xpRequired: 15000,
          unlocks: ['DAO Proposals', 'Governance Analysis', 'Voting Strategies'],
          completed: false,
          icon: '🏛️',
        },
        {
          level: 4,
          name: 'Crypto Alpha Assistant',
          description: 'Advanced crypto intelligence and autonomous trading',
          xpRequired: 30000,
          unlocks: ['Autonomous Trading', 'Advanced Analytics', 'Multi-Chain Support'],
          completed: false,
          icon: '🚀',
        },
        {
          level: 5,
          name: 'Quantum Trader',
          description: 'Quantum-level market prediction and optimization',
          xpRequired: 75000,
          unlocks: ['Quantum Prediction', 'Reality Trading', 'Multi-Dimensional Analysis'],
          completed: false,
          icon: '⚡',
        },
      ],
    },
  ];

  const selectedAgentData = agentEvolutions.find(agent => agent.id === selectedAgent);

  const getProgressPercentage = (currentXP: number, requiredXP: number) => {
    return Math.min((currentXP / requiredXP) * 100, 100);
  };

  const getSpiralPosition = (index: number, total: number) => {
    // Predetermined positions to avoid hydration errors
    const positions = [
      { x: 0, y: -120 },      // Level 1 - top
      { x: 85, y: -85 },      // Level 2 - top-right
      { x: 120, y: 0 },       // Level 3 - right
      { x: 85, y: 85 },       // Level 4 - bottom-right
      { x: 0, y: 120 },       // Level 5 - bottom
    ];
    
    return positions[index] || { x: 0, y: 0 };
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
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
          >
            Evolution Tracker
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Track your AI agents' journey through evolution stages and unlock new capabilities
          </motion.p>
        </div>

        {/* Agent Selection */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4 bg-slate-800/50 rounded-xl p-2 border border-slate-700/50">
            {agentEvolutions.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  selectedAgent === agent.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className="text-2xl mr-2">{agent.icon}</span>
                {agent.name}
              </button>
            ))}
          </div>
        </div>

        {selectedAgentData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Spiral Evolution Visualization */}
            <div className="relative">
              <div className="relative w-full h-96 flex items-center justify-center">
                {/* Spiral Background */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  
                  {/* Spiral Path */}
                  <motion.path
                    d="M 200 200 Q 250 150 300 200 Q 350 250 300 300 Q 250 350 200 300 Q 150 250 200 200"
                    stroke="url(#spiralGradient)"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </svg>

                {/* Evolution Stages */}
                {selectedAgentData.stages.map((stage, index) => {
                  const position = getSpiralPosition(index, selectedAgentData.stages.length);
                  const isActive = stage.level <= selectedAgentData.currentLevel;
                  const isCurrent = stage.level === selectedAgentData.currentLevel;
                  
                  return (
                    <motion.div
                      key={stage.level}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `calc(50% + ${position.x}px)`,
                        top: `calc(50% + ${position.y}px)`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                    >
                      <motion.div
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-br from-emerald-500 to-cyan-500'
                            : 'bg-gradient-to-br from-slate-600 to-slate-700'
                        } ${isCurrent ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{
                          boxShadow: isCurrent
                            ? [
                                "0 0 20px rgba(251, 191, 36, 0.5)",
                                "0 0 40px rgba(251, 191, 36, 0.8)",
                                "0 0 20px rgba(251, 191, 36, 0.5)",
                              ]
                            : "0 0 0px rgba(0, 0, 0, 0)",
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <span className="text-xl">{stage.icon}</span>
                        
                        {/* Level Badge */}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-black">{stage.level}</span>
                        </div>
                        
                        {/* Completion Check */}
                        {stage.completed && (
                          <motion.div
                            className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <span className="text-xs text-white">✓</span>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  );
                })}

                {/* Central Agent Icon */}
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: 360,
                  }}
                  transition={{
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  }}
                >
                  <span className="text-3xl">{selectedAgentData.icon}</span>
                </motion.div>
              </div>
            </div>

            {/* Evolution Details */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-4">{selectedAgentData.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedAgentData.name}</h3>
                    <p className="text-gray-400">Level {selectedAgentData.currentLevel} • {selectedAgentData.totalXP.toLocaleString()} XP</p>
                  </div>
                </div>
                
                {/* XP Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Total XP</span>
                    <span>{selectedAgentData.totalXP.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((selectedAgentData.totalXP / 75000) * 100, 100)}%` }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Evolution Stages List */}
              <div className="space-y-4">
                {selectedAgentData.stages.map((stage, index) => (
                  <motion.div
                    key={stage.level}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      stage.completed
                        ? 'bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-emerald-500/50'
                        : stage.level === selectedAgentData.currentLevel + 1
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50'
                        : 'bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{stage.icon}</span>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{stage.name}</h4>
                          <p className="text-sm text-gray-400">Level {stage.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-400">XP Required</div>
                        <div className="text-lg font-bold text-white">{stage.xpRequired.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">{stage.description}</p>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-400">Unlocks:</div>
                      <div className="flex flex-wrap gap-2">
                        {stage.unlocks.map((unlock, unlockIndex) => (
                          <span
                            key={unlockIndex}
                            className="px-2 py-1 bg-slate-700/50 rounded text-xs text-gray-300"
                          >
                            {unlock}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EvolutionTracker;


