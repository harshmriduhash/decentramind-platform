'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAgentById } from '../../utils/careAgentData';

interface AgentTaskLogProps {
  agentId: string;
}

const AgentTaskLog: React.FC<AgentTaskLogProps> = ({ agentId }) => {
  const agent = getAgentById(agentId);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress' | 'failed'>('all');
  
  if (!agent) return null;

  const filteredTasks = agent.recentTasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10';
      case 'in-progress': return 'text-blue-400 bg-blue-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      case 'failed': return '❌';
      case 'pending': return '⏸️';
      default: return '📋';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{agent.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-white">{agent.name} Tasks</h3>
              <p className="text-sm text-gray-400">{agent.recentTasks.length} recent tasks</p>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {[
              { id: 'all', label: 'All', count: agent.recentTasks.length },
              { id: 'completed', label: 'Completed', count: agent.recentTasks.filter(t => t.status === 'completed').length },
              { id: 'in-progress', label: 'Active', count: agent.recentTasks.filter(t => t.status === 'in-progress').length },
              { id: 'failed', label: 'Failed', count: agent.recentTasks.filter(t => t.status === 'failed').length }
            ].map((filterOption) => (
              <motion.button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === filterOption.id
                    ? 'bg-slate-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filterOption.label} ({filterOption.count})
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="p-6">
        <AnimatePresence>
          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg">{getStatusIcon(task.status)}</span>
                        <h4 className="font-medium text-white">{task.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Category: {task.category}</span>
                        <span>•</span>
                        <span>{formatTimestamp(task.timestamp)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-semibold">+{task.xpReward} XP</div>
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
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-400 mb-2">No tasks found</h3>
              <p className="text-sm text-gray-500">
                {filter === 'all' ? 'No tasks available' : `No ${filter} tasks available`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AgentTaskLog;
