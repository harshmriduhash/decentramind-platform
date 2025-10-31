'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { careAgents, getAgentById } from '../../utils/careAgentData';

interface AgentSwitcherProps {
  selectedAgent: string;
  onAgentChange: (agentId: string) => void;
}

const AgentSwitcher: React.FC<AgentSwitcherProps> = ({ selectedAgent, onAgentChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentAgent = getAgentById(selectedAgent);

  if (!currentAgent) return null;

  return (
    <div className="relative">
      {/* Current Agent Display */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 hover:bg-slate-700/50 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl`}>
              {currentAgent.avatar}
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-white">{currentAgent.name}</h3>
              <p className="text-sm text-gray-400">{currentAgent.description}</p>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-emerald-400">Level {currentAgent.level}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-blue-400">{currentAgent.xp.toLocaleString()} XP</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-purple-400">{currentAgent.totalEarnings} DMT</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {currentAgent.status === 'active' ? (
              <span className="px-2 py-1 bg-emerald-400/10 text-emerald-400 rounded-full text-xs font-medium">
                Active
              </span>
            ) : (
              <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs font-medium">
                {currentAgent.status}
              </span>
            )}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              ▼
            </motion.div>
          </div>
        </div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700/30 shadow-xl z-50"
          >
            <div className="p-2">
              {careAgents.map((agent) => (
                <motion.button
                  key={agent.id}
                  onClick={() => {
                    onAgentChange(agent.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                    selectedAgent === agent.id
                      ? `bg-gradient-to-r from-purple-500 to-blue-500 text-white`
                      : 'hover:bg-slate-700/50 text-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{agent.avatar}</div>
                    <div className="flex-1">
                      <div className="font-medium">{agent.name}</div>
                      <div className="text-xs opacity-75">{agent.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-75">Level {agent.level}</div>
                      <div className="text-xs opacity-75">{agent.xp.toLocaleString()} XP</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AgentSwitcher;
