'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { careAgents, getAgentById } from '../utils/careAgentData';
import AgentManagementLayout from '../components/agents/AgentManagementLayout';
import AgentXPBar from '../components/ai-console/AgentXPBar';
import AgentTaskLog from '../components/ai-console/AgentTaskLog';
import InsightsPanel from '../components/ai-console/InsightsPanel';
import AgentQuickActions from '../components/ai-console/AgentQuickActions';
import SubAgentList from '../components/agents/SubAgentList';

const AgentsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<string | null>('finance-agent');

  const tabs = [
    { id: 'all', name: 'All Agents', icon: '🤖', color: 'blue' },
    { id: 'active', name: 'Active', icon: '✅', color: 'green' },
    { id: 'beta', name: 'Beta', icon: '🧪', color: 'yellow' },
    { id: 'custom', name: 'Custom', icon: '🎨', color: 'purple' }
  ];

  const filteredAgents = careAgents.filter(agent => {
    switch (activeTab) {
      case 'active':
        return agent.status === 'active';
      case 'beta':
        return agent.status === 'beta';
      case 'custom':
        return agent.type === 'custom';
      default:
        return true;
    }
  });

  const renderAgentCard = (agent: typeof careAgents[0]) => (
    <motion.div
      key={agent.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setSelectedAgent(agent.id)}
      className={`relative cursor-pointer bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
        selectedAgent === agent.id
          ? 'border-purple-500/50 bg-purple-500/10 ring-2 ring-purple-500/20'
          : 'border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-700/30'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{agent.avatar}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
            <p className="text-gray-400 text-sm">{agent.type}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          agent.status === 'active' ? 'bg-green-500/20 text-green-400' :
          agent.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {agent.status}
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4">{agent.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Level</span>
          <span className="text-white font-medium">Level {agent.level}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">XP</span>
          <span className="text-white font-medium">{agent.xp.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Tasks Completed</span>
          <span className="text-white font-medium">{agent.tasksCompleted}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Success Rate</span>
          <span className="text-white font-medium">{agent.successRate}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Earnings</span>
          <span className="text-white font-medium">{agent.totalEarnings} DMT</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/30">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Mint Cost</span>
          <span className="text-purple-400 font-medium">{agent.pricing.mintCost} DMT</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-slate-700/30">
        <AgentQuickActions agentId={agent.id} />
      </div>

      {/* Selection Indicator */}
      {selectedAgent === agent.id && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </motion.div>
  );

  const renderAgentDetails = () => {
    if (!selectedAgent) return null;
    
    const agent = getAgentById(selectedAgent);
    if (!agent) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        {/* Agent Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">{agent.avatar}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
                <p className="text-gray-400">{agent.description}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
            >
              Manage Agent
            </motion.button>
          </div>

          {/* Agent XP Bar */}
          <AgentXPBar agentId={agent.id} />
        </div>

        {/* Agent Task Log */}
        <AgentTaskLog agentId={agent.id} />

        {/* Agent Insights */}
        <InsightsPanel agentId={agent.id} />

        {/* Sub-Agents */}
        {agent.subAgents && agent.subAgents.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <span>🤖</span>
              <span>Sub-Agents</span>
              <span className="text-sm px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">
                {agent.subAgents.length}
              </span>
            </h3>
            <SubAgentList subAgents={agent.subAgents} masterAgentId={agent.id} />
          </div>
        )}

        {/* Performance Metrics */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-emerald-400">{agent.tasksCompleted}</div>
              <div className="text-sm text-gray-400">Tasks Completed</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{agent.successRate}%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{agent.capabilities.length}</div>
              <div className="text-sm text-gray-400">Capabilities</div>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400">{agent.totalEarnings}</div>
              <div className="text-sm text-gray-400">Total Earnings (DMT)</div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AgentManagementLayout agentCount={careAgents.length}>
      {/* Tab Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/30 mb-8">
        <div className="flex space-x-1 py-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/25`
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg mr-2">{tab.icon}</span>
              {tab.name}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="space-y-8">
        {/* Agent List Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Available Agents</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg font-medium text-white transition-all duration-300"
            >
              + Create Custom Agent
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {renderAgentCard(agent)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Agent Details Section */}
        {selectedAgent && (
          <div className="border-t border-slate-700/30 pt-8">
            <h3 className="text-xl font-bold text-white mb-6">Agent Details</h3>
            {renderAgentDetails()}
          </div>
        )}
      </div>
    </AgentManagementLayout>
  );
};

export default AgentsPage;
