'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AIConsoleLayout from '../components/ai-console/AIConsoleLayout';
import AgentXPBar from '../components/ai-console/AgentXPBar';
import AgentTaskLog from '../components/ai-console/AgentTaskLog';
import InsightsPanel from '../components/ai-console/InsightsPanel';
import AgentSwitcher from '../components/ai-console/AgentSwitcher';
import AgentQuickActions from '../components/ai-console/AgentQuickActions';
import MoodTracker from '../components/ai-console/MoodTracker';
import CustomAgentCreator from '../components/ai-console/CustomAgentCreator';
import N8nAgentTrigger from '../components/ai-console/N8nAgentTrigger';
import SubAgentList from '../components/agents/SubAgentList';
import { getAgentById, careAgents } from '../utils/careAgentData';

const AIConsolePage = () => {
  const [activeTab, setActiveTab] = useState('finance');
  const [selectedAgent, setSelectedAgent] = useState('finance-agent');

  const agent = getAgentById(selectedAgent);

  // Dynamic agent mapping based on actual agent data
  const getAgentByTab = (tabId: string) => {
    const agentMap: { [key: string]: string } = {
      'finance': 'finance-agent',
      'wellness': 'wellness-agent', 
      'alpha': 'alpha-agent',
      'custom': 'custom-agent'
    };
    
    const agentId = agentMap[tabId];
    if (!agentId) {
      // Fallback: try to find agent by type
      const fallbackAgent = careAgents.find(agent => agent.type === tabId);
      return fallbackAgent?.id || 'finance-agent';
    }
    
    return agentId;
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const agentId = getAgentByTab(tab);
    setSelectedAgent(agentId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'finance':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgentTaskLog agentId="finance-agent" />
              </div>
              <div>
                <InsightsPanel agentId="finance-agent" />
              </div>
            </div>
            <AgentXPBar agentId="finance-agent" />
            <N8nAgentTrigger agentId={selectedAgent} agentName={agent?.name || 'Autonomous CFO'} />
            
            {/* Sub-Agents */}
            {agent?.subAgents && agent.subAgents.length > 0 && (
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
          </div>
        );
      
      case 'wellness':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgentTaskLog agentId="wellness-agent" />
                <div className="mt-6">
                  <MoodTracker />
                </div>
              </div>
              <div>
                <InsightsPanel agentId="wellness-agent" />
              </div>
            </div>
            <AgentXPBar agentId="wellness-agent" />
            <N8nAgentTrigger agentId={selectedAgent} agentName={agent?.name || 'Care Orchestrator'} />
            
            {/* Sub-Agents */}
            {agent?.subAgents && agent.subAgents.length > 0 && (
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
          </div>
        );
      
      case 'alpha':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AgentTaskLog agentId="alpha-agent" />
              </div>
              <div>
                <InsightsPanel agentId="alpha-agent" />
              </div>
            </div>
            <AgentXPBar agentId="alpha-agent" />
            <N8nAgentTrigger agentId={selectedAgent} agentName={agent?.name || 'Crypto Alpha Assistant'} />
            
            {/* Sub-Agents */}
            {agent?.subAgents && agent.subAgents.length > 0 && (
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
          </div>
        );
      
      case 'custom':
        return (
          <div className="space-y-6">
            <CustomAgentCreator />
            <N8nAgentTrigger agentId={selectedAgent} agentName={agent?.name || 'Custom Agent'} />
            
            {/* Sub-Agents for Custom Agent (if any) */}
            {agent?.subAgents && agent.subAgents.length > 0 && (
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
          </div>
        );
      
      default:
        // Fallback for unknown tabs
        return (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-2">Agent Not Found</h2>
            <p className="text-gray-400 mb-6">The selected agent is not available.</p>
            <motion.button
              onClick={() => handleTabChange('finance')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Autonomous CFO
            </motion.button>
          </div>
        );
    }
  };

  return (
    <AIConsoleLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Agent Switcher */}
        <div className="mb-8">
          <AgentSwitcher 
            selectedAgent={selectedAgent} 
            onAgentChange={setSelectedAgent}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <AgentQuickActions agentId={selectedAgent} />
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </AIConsoleLayout>
  );
};

export default AIConsolePage;
