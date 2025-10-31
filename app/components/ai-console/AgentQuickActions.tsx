'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getAgentById } from '../../utils/careAgentData';
import { useWallet } from '../../providers/WalletContext';

interface AgentQuickActionsProps {
  agentId: string;
}

const AgentQuickActions: React.FC<AgentQuickActionsProps> = ({ agentId }) => {
  const agent = getAgentById(agentId);
  const { mintAgent, showToast } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  if (!agent) return null;

  const handleMintAgent = async () => {
    if (agent.isMinted) {
      showToast('Agent already minted!', 'info');
      return;
    }

    setIsLoading(true);
    try {
      await mintAgent(agentId);
      showToast(`${agent.name} minted successfully!`, 'success');
    } catch (error) {
      showToast('Failed to mint agent', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogTask = () => {
    showToast('Task logging feature coming soon!', 'info');
  };

  const handleSubmitProposal = () => {
    showToast('Proposal submission feature coming soon!', 'info');
  };

  const handleViewDAO = () => {
    window.open('/governance', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{agent.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
            <p className="text-sm text-gray-400">Manage your {agent.name}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Cost: {agent.pricing.mintCost} DMT</div>
          <div className="text-xs text-gray-500">Monthly: {agent.pricing.monthlyFee} DMT</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Mint Agent */}
        <motion.button
          onClick={handleMintAgent}
          disabled={agent.isMinted || isLoading}
          className={`p-4 rounded-lg border transition-all duration-200 ${
            agent.isMinted
              ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400 cursor-not-allowed'
              : isLoading
              ? 'bg-blue-400/10 border-blue-400/30 text-blue-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700 border-purple-500/30'
          }`}
          whileHover={!agent.isMinted && !isLoading ? { scale: 1.05 } : {}}
          whileTap={!agent.isMinted && !isLoading ? { scale: 0.95 } : {}}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">
              {agent.isMinted ? '✅' : isLoading ? '⏳' : '🎨'}
            </div>
            <div className="text-sm font-medium">
              {agent.isMinted ? 'Minted' : isLoading ? 'Minting...' : 'Mint Agent'}
            </div>
          </div>
        </motion.button>

        {/* Log Task */}
        <motion.button
          onClick={handleLogTask}
          className="p-4 rounded-lg border border-slate-600/30 bg-slate-700/30 text-gray-300 hover:bg-slate-600/50 hover:text-white transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium">Log Task</div>
          </div>
        </motion.button>

        {/* Submit Proposal */}
        <motion.button
          onClick={handleSubmitProposal}
          className="p-4 rounded-lg border border-slate-600/30 bg-slate-700/30 text-gray-300 hover:bg-slate-600/50 hover:text-white transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium">Submit Proposal</div>
          </div>
        </motion.button>

        {/* View DAO */}
        <motion.button
          onClick={handleViewDAO}
          className="p-4 rounded-lg border border-slate-600/30 bg-slate-700/30 text-gray-300 hover:bg-slate-600/50 hover:text-white transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-center">
            <div className="text-2xl mb-2">🏛️</div>
            <div className="text-sm font-medium">View DAO</div>
          </div>
        </motion.button>
      </div>

      {/* Agent Status */}
      <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Status: <span className={agent.isMinted ? 'text-emerald-400' : 'text-yellow-400'}>
              {agent.isMinted ? 'Active' : 'Available to Mint'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Personality: <span className="text-white">{agent.personality}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentQuickActions;
