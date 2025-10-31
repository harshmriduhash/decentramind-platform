'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../providers/WalletContext';

interface AgentGatekeeperProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const AgentGatekeeper: React.FC<AgentGatekeeperProps> = ({ isOpen, onClose, onProceed }) => {
  const { walletAddress, checkAgentMintEligibility } = useWallet();
  const [eligibility, setEligibility] = useState<{
    isEligible: boolean;
    reason?: string;
    agentCount?: number;
    maxAgents?: number;
  } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isOpen && walletAddress) {
      checkEligibility();
    }
  }, [isOpen, walletAddress]);

  const checkEligibility = async () => {
    if (!walletAddress) return;
    
    setIsChecking(true);
    try {
      const isEligible = await checkAgentMintEligibility(walletAddress);
      
      // Get current agent count
      const mintedAgents = localStorage.getItem(`minted_agents_${walletAddress}`) || '0';
      const agentCount = parseInt(mintedAgents);
      
      setEligibility({
        isEligible,
        reason: isEligible ? undefined : 'You have reached your agent mint limit',
        agentCount,
        maxAgents: 3,
      });
    } catch (error) {
      setEligibility({
        isEligible: false,
        reason: 'Unable to verify eligibility',
        agentCount: 0,
        maxAgents: 3,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleProceed = () => {
    if (eligibility?.isEligible) {
      onProceed();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              animate={{
                background: eligibility?.isEligible 
                  ? ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0.2)']
                  : ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.4)', 'rgba(239, 68, 68, 0.2)'],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isChecking ? (
                <motion.div
                  className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : eligibility?.isEligible ? (
                <span className="text-2xl">✅</span>
              ) : (
                <span className="text-2xl">🚫</span>
              )}
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {isChecking ? 'Checking Eligibility...' : 
               eligibility?.isEligible ? 'Agent Mint Approved' : 'Agent Mint Blocked'}
            </h2>

            {eligibility && (
              <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Agents Minted</span>
                    <span className="text-sm font-bold text-white">
                      {eligibility.agentCount} / {eligibility.maxAgents}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(eligibility.agentCount! / eligibility.maxAgents!) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {eligibility.reason && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-300 text-sm">{eligibility.reason}</p>
                  </div>
                )}

                {eligibility.isEligible && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                    <p className="text-green-300 text-sm">
                      You can mint {eligibility.maxAgents! - eligibility.agentCount!} more agent(s)
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-600/50 hover:border-slate-500/70 hover:bg-slate-700/30 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              {eligibility?.isEligible && (
                <button
                  onClick={handleProceed}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-bold transition-all duration-300"
                >
                  Proceed to Mint
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentGatekeeper;
