'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SubAgent, propagateXPToMasterAgent } from '../../utils/careAgentData';
import { useTriggerN8nAgent, AGENT_NAMES } from '../../hooks/useTriggerN8nAgent';

interface SubAgentListProps {
  subAgents: SubAgent[];
  masterAgentId: string;
}

const SubAgentList: React.FC<SubAgentListProps> = ({ subAgents, masterAgentId }) => {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const { trigger, isLoading } = useTriggerN8nAgent();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'beta':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getAgentIcon = (agentId: string) => {
    if (agentId.includes('vitals') || agentId.includes('tracker')) return '📊';
    if (agentId.includes('appointment') || agentId.includes('scheduler')) return '📅';
    if (agentId.includes('billing') || agentId.includes('insurance')) return '💰';
    if (agentId.includes('medication') || agentId.includes('manager')) return '💊';
    if (agentId.includes('portfolio') || agentId.includes('optimizer')) return '📈';
    if (agentId.includes('tax') || agentId.includes('calculator')) return '🧮';
    if (agentId.includes('yield') || agentId.includes('farmer')) return '🌾';
    if (agentId.includes('market') || agentId.includes('scanner')) return '🔍';
    if (agentId.includes('sentiment') || agentId.includes('analyzer')) return '🧠';
    if (agentId.includes('arbitrage') || agentId.includes('bot')) return '🤖';
    if (agentId.includes('whale') || agentId.includes('tracker')) return '🐋';
    return '⚙️';
  };

  const mapWorkflowToAgentName = (workflowId: string): AGENT_NAMES | null => {
    switch (workflowId) {
      case '0vBc9gJYA3iJ5sos':
        return AGENT_NAMES.CALENDAR;
      case 'KLifODuorqjN4a4M':
        return AGENT_NAMES.EMAIL;
      case 'pa2wKv0LsdfvSWxn':
        return AGENT_NAMES.PHONE;
      case 'e0pthxtytY6HYTLO':
        return AGENT_NAMES.PERSONAL_ASSISTANT;
      default:
        return null;
    }
  };

  const getDefaultPayload = (agentName: AGENT_NAMES, subAgent: SubAgent) => {
    const basePayload = {
      subAgentId: subAgent.id,
      subAgentName: subAgent.name,
      masterAgentId: masterAgentId,
      timestamp: new Date().toISOString(),
    };

    switch (agentName) {
      case AGENT_NAMES.CALENDAR:
        return {
          ...basePayload,
          action: 'create_event',
          title: `${subAgent.name} Task`,
          description: `Automated task from ${subAgent.name}`,
          startTime: new Date(Date.now() + 3600000).toISOString(),
          endTime: new Date(Date.now() + 7200000).toISOString(),
        };
      case AGENT_NAMES.EMAIL:
        return {
          ...basePayload,
          to: 'admin@decentramind.com',
          subject: `${subAgent.name} Report`,
          body: `Automated report from ${subAgent.name} sub-agent`,
        };
      case AGENT_NAMES.PHONE:
        return {
          ...basePayload,
          action: 'make_call',
          phoneNumber: '+15551234567',
          message: `Automated call from ${subAgent.name}`,
        };
      case AGENT_NAMES.PERSONAL_ASSISTANT:
        return {
          ...basePayload,
          task: 'analyze_data',
          dataSource: subAgent.capabilities[0] || 'general',
          outputFormat: 'json',
        };
      default:
        return basePayload;
    }
  };

  const handleTriggerWorkflow = async (subAgent: SubAgent) => {
    if (!subAgent.relatedN8nWorkflow) return;

    const agentName = mapWorkflowToAgentName(subAgent.relatedN8nWorkflow);
    if (!agentName) return;

    const payload = getDefaultPayload(agentName, subAgent);

    try {
      await trigger({
        agentName,
        payload,
        onSuccess: (data) => {
          console.log(`Sub-agent ${subAgent.name} workflow triggered successfully:`, data);
          
          // Propagate XP to master agent
          propagateXPToMasterAgent(subAgent.id, masterAgentId, subAgent.xpReward);
          
          // Show success feedback (you could add a toast notification here)
          console.log(`✅ ${subAgent.name} completed task! +${subAgent.xpReward} XP propagated to master agent.`);
        },
        onError: (error) => {
          console.error(`Failed to trigger ${subAgent.name} workflow:`, error);
        },
      });
    } catch (error) {
      console.error('Error triggering sub-agent workflow:', error);
    }
  };

  if (!subAgents || subAgents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-4xl mb-2">🤖</div>
        <p>No sub-agents available for this agent.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subAgents.map((subAgent, index) => (
          <motion.div
            key={subAgent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 group"
          >
            {/* Sub-Agent Header */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {getAgentIcon(subAgent.id)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{subAgent.name}</h4>
                    <p className="text-xs text-gray-400">{subAgent.description}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(subAgent.status)}`}>
                  {subAgent.status}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                  <div className="text-xs font-bold text-emerald-400">{subAgent.tasksCompleted}</div>
                  <div className="text-xs text-gray-400">Tasks</div>
                </div>
                <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                  <div className="text-xs font-bold text-blue-400">{subAgent.successRate}%</div>
                  <div className="text-xs text-gray-400">Success</div>
                </div>
              </div>

              {/* Capabilities Preview */}
              <div className="mb-3">
                <div className="text-xs text-gray-400 mb-1">Capabilities:</div>
                <div className="flex flex-wrap gap-1">
                  {subAgent.capabilities.slice(0, 2).map((capability, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                    >
                      {capability}
                    </span>
                  ))}
                  {subAgent.capabilities.length > 2 && (
                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                      +{subAgent.capabilities.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => setExpandedAgent(expandedAgent === subAgent.id ? null : subAgent.id)}
                  className="flex-1 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-xs font-medium text-white transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {expandedAgent === subAgent.id ? 'Collapse' : 'Details'}
                </motion.button>
                
                {subAgent.relatedN8nWorkflow && (
                  <motion.button
                    onClick={() => handleTriggerWorkflow(subAgent)}
                    disabled={isLoading}
                    className="px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 rounded-lg text-xs font-medium text-white transition-all duration-300"
                    whileHover={isLoading ? {} : { scale: 1.02 }}
                    whileTap={isLoading ? {} : { scale: 0.98 }}
                  >
                    {isLoading ? '⏳' : '🚀'}
                  </motion.button>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {expandedAgent === subAgent.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-slate-700/30 p-4 bg-slate-800/20"
                >
                  <div className="space-y-3">
                    {/* All Capabilities */}
                    <div>
                      <div className="text-xs text-gray-400 mb-2">All Capabilities:</div>
                      <div className="flex flex-wrap gap-1">
                        {subAgent.capabilities.map((capability, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                        <div className="text-sm font-bold text-yellow-400">+{subAgent.xpReward}</div>
                        <div className="text-xs text-gray-400">XP Reward</div>
                      </div>
                      <div className="text-center p-2 bg-slate-700/30 rounded-lg">
                        <div className="text-sm font-bold text-cyan-400">
                          {subAgent.lastActivity ? new Date(subAgent.lastActivity).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Last Activity</div>
                      </div>
                    </div>

                    {/* N8N Workflow Info */}
                    {subAgent.relatedN8nWorkflow && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <span className="text-emerald-400">🔗</span>
                          <span className="text-xs text-emerald-400 font-medium">N8N Workflow Connected</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Workflow ID: {subAgent.relatedN8nWorkflow}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-slate-800/20 rounded-xl border border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg">📊</span>
            <span className="text-sm font-medium text-white">Sub-Agent Summary</span>
          </div>
          <div className="flex space-x-4 text-xs text-gray-400">
            <span>Active: {subAgents.filter(a => a.status === 'active').length}</span>
            <span>Beta: {subAgents.filter(a => a.status === 'beta').length}</span>
            <span>Total: {subAgents.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAgentList;
