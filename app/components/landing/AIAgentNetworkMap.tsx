'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentNode {
  id: string;
  name: string;
  type: 'CFO' | 'Care' | 'Crypto';
  xp: number;
  level: number;
  owner: string;
  x: number;
  y: number;
  tasks: number;
  status: 'active' | 'idle' | 'evolving';
}

interface TaskEdge {
  id: string;
  from: string;
  to: string;
  taskType: string;
  value: number;
  status: 'pending' | 'completed' | 'failed';
}

const AIAgentNetworkMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  // Mock data for agents
  const [agents] = useState<AgentNode[]>([
    { id: 'cfo-001', name: 'CFO-001', type: 'CFO', xp: 12500, level: 3, owner: '0x123...abc', x: 20, y: 30, tasks: 15, status: 'active' },
    { id: 'care-042', name: 'Care-042', type: 'Care', xp: 8900, level: 2, owner: '0x456...def', x: 60, y: 25, tasks: 8, status: 'evolving' },
    { id: 'crypto-089', name: 'Crypto-089', type: 'Crypto', xp: 15600, level: 4, owner: '0x789...ghi', x: 40, y: 60, tasks: 22, status: 'active' },
    { id: 'cfo-156', name: 'CFO-156', type: 'CFO', xp: 6700, level: 2, owner: '0xabc...jkl', x: 80, y: 45, tasks: 12, status: 'idle' },
    { id: 'care-203', name: 'Care-203', type: 'Care', xp: 11200, level: 3, owner: '0xdef...mno', x: 15, y: 70, tasks: 18, status: 'active' },
    { id: 'crypto-301', name: 'Crypto-301', type: 'Crypto', xp: 4300, level: 1, owner: '0xghi...pqr', x: 75, y: 75, tasks: 5, status: 'idle' },
  ]);

  // Mock data for task edges
  const [edges] = useState<TaskEdge[]>([
    { id: 'edge-1', from: 'cfo-001', to: 'care-042', taskType: 'Financial Analysis', value: 250, status: 'completed' },
    { id: 'edge-2', from: 'crypto-089', to: 'cfo-001', taskType: 'Portfolio Review', value: 180, status: 'pending' },
    { id: 'edge-3', from: 'care-203', to: 'crypto-089', taskType: 'Health Data', value: 320, status: 'completed' },
    { id: 'edge-4', from: 'cfo-156', to: 'care-203', taskType: 'Budget Planning', value: 150, status: 'failed' },
    { id: 'edge-5', from: 'crypto-301', to: 'cfo-001', taskType: 'Market Research', value: 90, status: 'pending' },
  ]);

  const getAgentColor = (type: AgentNode['type']) => {
    switch (type) {
      case 'CFO': return 'from-purple-500 to-blue-500';
      case 'Care': return 'from-emerald-500 to-green-500';
      case 'Crypto': return 'from-orange-500 to-yellow-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getAgentIcon = (type: AgentNode['type']) => {
    switch (type) {
      case 'CFO': return '🧠';
      case 'Care': return '❤️';
      case 'Crypto': return '📈';
      default: return '🤖';
    }
  };

  const getStatusColor = (status: AgentNode['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-gray-500';
      case 'evolving': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getEdgeColor = (status: TaskEdge['status']) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xl font-bold text-white mb-2">AI Agent Network Map</h3>
        <p className="text-sm text-gray-400">Real-time agent connections and task flows</p>
      </div>

      {/* Network Container */}
      <div ref={containerRef} className="relative w-full h-full">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="network-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#network-grid)" />
          </svg>
        </div>

        {/* Task Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge) => {
            const fromAgent = agents.find(a => a.id === edge.from);
            const toAgent = agents.find(a => a.id === edge.to);
            if (!fromAgent || !toAgent) return null;

            return (
              <motion.line
                key={edge.id}
                x1={`${fromAgent.x}%`}
                y1={`${fromAgent.y}%`}
                x2={`${toAgent.x}%`}
                y2={`${toAgent.y}%`}
                stroke={getEdgeColor(edge.status)}
                strokeWidth="2"
                opacity={hoveredEdge === edge.id ? 0.8 : 0.4}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredEdge(edge.id)}
                onMouseLeave={() => setHoveredEdge(null)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            );
          })}
        </svg>

        {/* Agent Nodes */}
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            className="absolute cursor-pointer"
            style={{
              left: `${agent.x}%`,
              top: `${agent.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: agent.xp / 2000 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedAgent(agent)}
          >
            {/* Agent Node */}
            <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${getAgentColor(agent.type)} p-1 shadow-lg`}>
              {/* Status Indicator */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getStatusColor(agent.status)} border-2 border-slate-900`} />
              
              {/* Agent Icon */}
              <div className="w-full h-full rounded-full bg-slate-800/80 flex items-center justify-center text-2xl">
                {getAgentIcon(agent.type)}
              </div>

              {/* XP Ring */}
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
                  strokeDasharray={`${(agent.xp / 20000) * 175.9} 175.9`}
                  className="text-white transition-all duration-1000"
                />
              </svg>
            </div>

            {/* Agent Label */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-xs font-medium text-white bg-slate-800/80 px-2 py-1 rounded">
                {agent.name}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Lv.{agent.level} • {agent.tasks} tasks
              </div>
            </div>
          </motion.div>
        ))}

        {/* Floating Task Particles */}
        {edges.map((edge) => {
          const fromAgent = agents.find(a => a.id === edge.from);
          const toAgent = agents.find(a => a.id === edge.to);
          if (!fromAgent || !toAgent) return null;

          return (
            <motion.div
              key={`particle-${edge.id}`}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${fromAgent.x}%`,
                top: `${fromAgent.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                left: [`${fromAgent.x}%`, `${toAgent.x}%`],
                top: [`${fromAgent.y}%`, `${toAgent.y}%`],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2,
              }}
            />
          );
        })}
      </div>

      {/* Agent Details Panel */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
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

              {/* Owner */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Owner</div>
                <div className="text-sm font-mono text-white">{selectedAgent.owner}</div>
              </div>

              {/* Tasks */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Active Tasks</div>
                <div className="text-lg font-bold text-white">{selectedAgent.tasks}</div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedAgent.status)}`} />
                <span className="text-sm text-gray-300 capitalize">{selectedAgent.status}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edge Details Tooltip */}
      <AnimatePresence>
        {hoveredEdge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg p-3 text-sm"
            style={{
              left: '50%',
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            {(() => {
              const edge = edges.find(e => e.id === hoveredEdge);
              return edge ? (
                <div>
                  <div className="font-medium text-white">{edge.taskType}</div>
                  <div className="text-gray-400">Value: {edge.value} DMT</div>
                  <div className={`capitalize ${edge.status === 'completed' ? 'text-green-400' : edge.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                    {edge.status}
                  </div>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAgentNetworkMap;
