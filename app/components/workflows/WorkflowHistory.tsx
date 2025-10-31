'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkflowHistoryEntry {
  id: string;
  name: string;
  status: 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime: string;
  duration: string;
  agent: string;
  stepsCompleted: number;
  totalSteps: number;
  result?: string;
  error?: string;
}

const WorkflowHistory: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'cancelled'>('all');

  const historyEntries: WorkflowHistoryEntry[] = [
    {
      id: '1',
      name: 'Portfolio Optimization',
      status: 'completed',
      startTime: '2024-01-15T09:00:00Z',
      endTime: '2024-01-15T09:03:45Z',
      duration: '3m 45s',
      agent: 'Finance Agent',
      stepsCompleted: 6,
      totalSteps: 6,
      result: 'Portfolio optimized successfully. 15% improvement in risk-adjusted returns.'
    },
    {
      id: '2',
      name: 'Health Monitoring',
      status: 'completed',
      startTime: '2024-01-15T08:45:00Z',
      endTime: '2024-01-15T08:47:20Z',
      duration: '2m 20s',
      agent: 'Wellness Agent',
      stepsCompleted: 4,
      totalSteps: 4,
      result: 'Health check completed. All vitals within normal range.'
    },
    {
      id: '3',
      name: 'Alpha Signal Generation',
      status: 'failed',
      startTime: '2024-01-15T08:30:00Z',
      endTime: '2024-01-15T08:32:15Z',
      duration: '2m 15s',
      agent: 'Alpha Agent',
      stepsCompleted: 3,
      totalSteps: 8,
      error: 'Market data API timeout. Unable to fetch real-time prices.'
    },
    {
      id: '4',
      name: 'Risk Assessment',
      status: 'cancelled',
      startTime: '2024-01-15T08:15:00Z',
      endTime: '2024-01-15T08:16:30Z',
      duration: '1m 30s',
      agent: 'Finance Agent',
      stepsCompleted: 2,
      totalSteps: 5,
      error: 'Workflow cancelled by user.'
    },
    {
      id: '5',
      name: 'Mood Tracking',
      status: 'completed',
      startTime: '2024-01-15T08:00:00Z',
      endTime: '2024-01-15T08:00:45Z',
      duration: '45s',
      agent: 'Wellness Agent',
      stepsCompleted: 3,
      totalSteps: 3,
      result: 'Mood logged successfully. Current mood: Happy (+5 XP)'
    }
  ];

  const filteredEntries = historyEntries.filter(entry => 
    filter === 'all' || entry.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      case 'cancelled': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'failed': return '❌';
      case 'cancelled': return '⏹️';
      default: return '⏸️';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Workflow History</h3>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {(['all', 'completed', 'failed', 'cancelled'] as const).map((status) => (
              <motion.button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === status
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
          >
            Export History
          </motion.button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredEntries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
              selectedEntry === entry.id
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-slate-700/30 hover:border-slate-600/50'
            }`}
            onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                  <span className="text-lg">📋</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{entry.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{entry.agent}</span>
                    <span>{entry.startTime}</span>
                    <span>{entry.duration}</span>
                    <span>{entry.stepsCompleted}/{entry.totalSteps} steps</span>
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                <span className="mr-1">{getStatusIcon(entry.status)}</span>
                {entry.status}
              </div>
            </div>

            <AnimatePresence>
              {selectedEntry === entry.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-700/30"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-white mb-2">Execution Details</h5>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div>Agent: {entry.agent}</div>
                        <div>Started: {entry.startTime}</div>
                        <div>Ended: {entry.endTime}</div>
                        <div>Duration: {entry.duration}</div>
                        <div>Steps: {entry.stepsCompleted}/{entry.totalSteps}</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">
                        {entry.status === 'completed' ? 'Result' : 'Error Details'}
                      </h5>
                      <div className="text-sm text-gray-300">
                        {entry.result || entry.error || 'No additional information available.'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
                    >
                      View Logs
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm hover:bg-purple-500/30"
                    >
                      Re-run
                    </motion.button>
                    {entry.status === 'completed' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30"
                      >
                        Download Results
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📋</div>
          <h4 className="text-lg font-semibold text-white mb-2">No History Found</h4>
          <p className="text-gray-400">No workflow executions match the current filter.</p>
        </div>
      )}
    </div>
  );
};

export default WorkflowHistory;
