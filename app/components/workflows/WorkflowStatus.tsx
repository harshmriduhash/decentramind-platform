'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkflowExecution {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  startTime: string;
  duration?: string;
  agent: string;
  stepsCompleted: number;
  totalSteps: number;
}

const WorkflowStatus: React.FC = () => {
  const [activeExecution, setActiveExecution] = useState<string | null>(null);

  const executions: WorkflowExecution[] = [
    {
      id: '1',
      name: 'Portfolio Optimization',
      status: 'running',
      progress: 65,
      startTime: '2024-01-15T10:00:00Z',
      duration: '2m 30s',
      agent: 'Finance Agent',
      stepsCompleted: 4,
      totalSteps: 6
    },
    {
      id: '2',
      name: 'Health Monitoring',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15T09:45:00Z',
      duration: '1m 15s',
      agent: 'Wellness Agent',
      stepsCompleted: 4,
      totalSteps: 4
    },
    {
      id: '3',
      name: 'Alpha Signal Generation',
      status: 'paused',
      progress: 25,
      startTime: '2024-01-15T09:30:00Z',
      duration: '45s',
      agent: 'Alpha Agent',
      stepsCompleted: 2,
      totalSteps: 8
    },
    {
      id: '4',
      name: 'Risk Assessment',
      status: 'failed',
      progress: 40,
      startTime: '2024-01-15T09:15:00Z',
      duration: '1m 20s',
      agent: 'Finance Agent',
      stepsCompleted: 2,
      totalSteps: 5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-400 bg-blue-400/10';
      case 'completed': return 'text-emerald-400 bg-emerald-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return '⏳';
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'paused': return '⏸️';
      default: return '⏸️';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'running': return 'from-blue-500 to-blue-600';
      case 'completed': return 'from-emerald-500 to-emerald-600';
      case 'failed': return 'from-red-500 to-red-600';
      case 'paused': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Workflow Status</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {executions.filter(e => e.status === 'running').length} running
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30"
          >
            Refresh
          </motion.button>
        </div>
      </div>

      <div className="space-y-4">
        {executions.map((execution) => (
          <motion.div
            key={execution.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
              activeExecution === execution.id
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-slate-700/30 hover:border-slate-600/50'
            }`}
            onClick={() => setActiveExecution(activeExecution === execution.id ? null : execution.id)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                  <span className="text-lg">⚡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{execution.name}</h4>
                  <p className="text-sm text-gray-400">{execution.agent}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                <span className="mr-1">{getStatusIcon(execution.status)}</span>
                {execution.status}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                <span>Progress</span>
                <span>{execution.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${getProgressColor(execution.status)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${execution.progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Execution Info */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-4">
                <span>{execution.stepsCompleted}/{execution.totalSteps} steps</span>
                <span>{execution.duration}</span>
                <span>{execution.startTime}</span>
              </div>
              <div className="flex space-x-2">
                {execution.status === 'running' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs hover:bg-yellow-500/30"
                  >
                    Pause
                  </motion.button>
                )}
                {execution.status === 'paused' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30"
                  >
                    Resume
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                >
                  Stop
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {activeExecution === execution.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-700/30"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-white mb-2">Execution Details</h5>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div>Agent: {execution.agent}</div>
                        <div>Started: {execution.startTime}</div>
                        <div>Duration: {execution.duration || 'N/A'}</div>
                        <div>Steps: {execution.stepsCompleted}/{execution.totalSteps}</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">Actions</h5>
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors"
                        >
                          View Logs
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors"
                        >
                          Download Results
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowStatus;
