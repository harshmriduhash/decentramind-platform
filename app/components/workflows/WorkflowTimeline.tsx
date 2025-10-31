'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  timestamp: string;
  duration?: string;
  agent: string;
  icon: string;
}

const WorkflowTimeline: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const timelineSteps: TimelineStep[] = [
    {
      id: '1',
      title: 'Wallet Connection Detected',
      description: 'User wallet connected to DecentraMind platform',
      status: 'completed',
      timestamp: '2024-01-15T10:00:00Z',
      duration: '2s',
      agent: 'System',
      icon: '🔗'
    },
    {
      id: '2',
      title: 'Agent Status Check',
      description: 'Verifying agent minting status and permissions',
      status: 'completed',
      timestamp: '2024-01-15T10:00:02Z',
      duration: '5s',
      agent: 'Finance Agent',
      icon: '🤖'
    },
    {
      id: '3',
      title: 'Task Queue Processing',
      description: 'Processing pending tasks in agent queue',
      status: 'in-progress',
      timestamp: '2024-01-15T10:00:07Z',
      duration: '15s',
      agent: 'Finance Agent',
      icon: '⚡'
    },
    {
      id: '4',
      title: 'Portfolio Analysis',
      description: 'Analyzing current portfolio performance',
      status: 'pending',
      timestamp: '2024-01-15T10:00:22Z',
      duration: '30s',
      agent: 'Finance Agent',
      icon: '📊'
    },
    {
      id: '5',
      title: 'Risk Assessment',
      description: 'Evaluating portfolio risk factors',
      status: 'pending',
      timestamp: '2024-01-15T10:00:52Z',
      duration: '20s',
      agent: 'Finance Agent',
      icon: '⚠️'
    },
    {
      id: '6',
      title: 'Report Generation',
      description: 'Generating comprehensive analysis report',
      status: 'pending',
      timestamp: '2024-01-15T10:01:12Z',
      duration: '10s',
      agent: 'Finance Agent',
      icon: '📋'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/10';
      case 'in-progress': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-gray-400 bg-gray-400/10';
      case 'failed': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '⏳';
      case 'pending': return '⏸️';
      case 'failed': return '❌';
      default: return '⏸️';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Workflow Timeline</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {timelineSteps.filter(s => s.status === 'completed').length} / {timelineSteps.length} completed
          </div>
          <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(timelineSteps.filter(s => s.status === 'completed').length / timelineSteps.length) * 100}%` 
              }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {timelineSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
              activeStep === step.id
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-slate-700/30 hover:border-slate-600/50'
            }`}
            onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-700/50">
                  <span className="text-lg">{step.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{step.title}</h4>
                  <p className="text-sm text-gray-400">{step.description}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">{step.timestamp}</span>
                    <span className="text-xs text-gray-500">{step.agent}</span>
                    {step.duration && (
                      <span className="text-xs text-gray-500">~{step.duration}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                <span className="mr-1">{getStatusIcon(step.status)}</span>
                {step.status.replace('-', ' ')}
              </div>
            </div>

            <AnimatePresence>
              {activeStep === step.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-700/30"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-white mb-2">Step Details</h5>
                      <div className="space-y-1 text-sm text-gray-400">
                        <div>Agent: {step.agent}</div>
                        <div>Duration: {step.duration || 'N/A'}</div>
                        <div>Timestamp: {step.timestamp}</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-white mb-2">Actions</h5>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30"
                        >
                          View Logs
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-xs hover:bg-purple-500/30"
                        >
                          Retry
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

export default WorkflowTimeline;
