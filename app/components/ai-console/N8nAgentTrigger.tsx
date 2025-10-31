'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTriggerN8nAgent, AGENT_NAMES, type AgentName } from '../../hooks/useTriggerN8nAgent';

interface N8nAgentTriggerProps {
  agentId: string;
  agentName: string;
}

const N8nAgentTrigger: React.FC<N8nAgentTriggerProps> = ({ agentId, agentName }) => {
  const { data, error, isLoading, trigger, reset } = useTriggerN8nAgent();
  const [customPayload, setCustomPayload] = useState('{}');
  const [selectedAgent, setSelectedAgent] = useState<AgentName>(AGENT_NAMES.PERSONAL_ASSISTANT);

  // Map agent types to N8N agent names
  const getAgentMapping = (agentType: string): AgentName => {
    switch (agentType) {
      case 'finance':
        return AGENT_NAMES.PERSONAL_ASSISTANT;
      case 'wellness':
        return AGENT_NAMES.PERSONAL_ASSISTANT;
      case 'alpha':
        return AGENT_NAMES.PERSONAL_ASSISTANT;
      default:
        return AGENT_NAMES.PERSONAL_ASSISTANT;
    }
  };

  const handleTrigger = async () => {
    try {
      const payload = JSON.parse(customPayload);
      await trigger({
        agentName: selectedAgent,
        payload,
        onSuccess: (data) => {
          console.log('N8N Agent triggered successfully:', data);
        },
        onError: (error) => {
          console.error('N8N Agent trigger failed:', error);
        },
      });
    } catch (parseError) {
      alert('Invalid JSON payload. Please check your input.');
    }
  };

  const getDefaultPayload = (agentName: AgentName) => {
    switch (agentName) {
      case AGENT_NAMES.CALENDAR:
        return {
          action: 'create_event',
          title: 'Meeting with DecentraMind',
          startTime: new Date().toISOString(),
          duration: 60,
          attendees: ['user@example.com'],
        };
      case AGENT_NAMES.EMAIL:
        return {
          action: 'send_email',
          to: 'user@example.com',
          subject: 'DecentraMind Agent Update',
          body: 'Your agent has completed the requested task.',
          priority: 'normal',
        };
      case AGENT_NAMES.PHONE:
        return {
          action: 'make_call',
          phoneNumber: '+1234567890',
          message: 'Hello from DecentraMind AI Agent',
          voice: 'natural',
        };
      case AGENT_NAMES.PERSONAL_ASSISTANT:
        return {
          action: 'process_request',
          request: 'Analyze my portfolio and provide recommendations',
          context: {
            agentId,
            agentName,
            timestamp: new Date().toISOString(),
          },
        };
      default:
        return {};
    }
  };

  const loadDefaultPayload = () => {
    const defaultPayload = getDefaultPayload(selectedAgent);
    setCustomPayload(JSON.stringify(defaultPayload, null, 2));
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">N8N Agent Trigger</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Agent:</span>
          <span className="text-sm text-purple-400">{agentName}</span>
        </div>
      </div>

      {/* Agent Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select N8N Agent
        </label>
        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value as AgentName)}
          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          <option value={AGENT_NAMES.CALENDAR}>📅 Calendar Agent</option>
          <option value={AGENT_NAMES.EMAIL}>📧 Email Agent</option>
          <option value={AGENT_NAMES.PHONE}>📞 Phone Agent</option>
          <option value={AGENT_NAMES.PERSONAL_ASSISTANT}>🤖 Personal Assistant</option>
        </select>
      </div>

      {/* Payload Editor */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-300">
            Payload (JSON)
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadDefaultPayload}
            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
          >
            Load Default
          </motion.button>
        </div>
        <textarea
          value={customPayload}
          onChange={(e) => setCustomPayload(e.target.value)}
          className="w-full h-32 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white font-mono text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          placeholder="Enter JSON payload..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mb-6">
        <motion.button
          onClick={handleTrigger}
          disabled={isLoading}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
            isLoading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
          }`}
          whileHover={!isLoading ? { scale: 1.02 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Triggering...
            </div>
          ) : (
            '🚀 Trigger Agent'
          )}
        </motion.button>

        <motion.button
          onClick={reset}
          className="px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white font-medium transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset
        </motion.button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {(data || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2">❌ Error</h4>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {data && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <h4 className="font-semibold text-emerald-400 mb-2">✅ Success</h4>
                <pre className="text-emerald-300 text-sm overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default N8nAgentTrigger;
