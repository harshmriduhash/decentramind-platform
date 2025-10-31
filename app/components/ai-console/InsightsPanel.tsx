'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAgentById } from '../../utils/careAgentData';

interface InsightsPanelProps {
  agentId: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ agentId }) => {
  const agent = getAgentById(agentId);
  const [activeInsight, setActiveInsight] = useState(0);
  
  if (!agent) return null;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip': return '💡';
      case 'forecast': return '🔮';
      case 'warning': return '⚠️';
      case 'achievement': return '🏆';
      default: return '📊';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'tip': return 'from-blue-500 to-cyan-500';
      case 'forecast': return 'from-purple-500 to-indigo-500';
      case 'warning': return 'from-red-500 to-orange-500';
      case 'achievement': return 'from-emerald-500 to-teal-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'low': return 'text-green-400 bg-green-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/30">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{agent.avatar}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.name} Insights</h3>
            <p className="text-sm text-gray-400">{agent.insights.length} active insights</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {agent.insights.length > 0 ? (
            <div className="space-y-4">
              {agent.insights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    activeInsight === index
                      ? 'bg-gradient-to-r from-slate-700/50 to-slate-600/30 border-slate-500/50'
                      : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50'
                  }`}
                  onClick={() => setActiveInsight(index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getInsightIcon(insight.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-white">{insight.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                          {insight.priority}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{formatTimestamp(insight.timestamp)}</span>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getInsightColor(insight.type)}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-4">🔮</div>
              <h3 className="text-lg font-medium text-gray-400 mb-2">No insights available</h3>
              <p className="text-sm text-gray-500">
                Insights will appear as your agent learns and analyzes data
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Stats */}
      <div className="p-6 border-t border-slate-700/30">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Stats</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">{agent.successRate}%</div>
            <div className="text-xs text-gray-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">{agent.tasksCompleted}</div>
            <div className="text-xs text-gray-400">Tasks Done</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightsPanel;
