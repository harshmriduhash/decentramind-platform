'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectWalletButton from '../ConnectWalletButton';
import WalletModal from '../WalletModal';
import AgentGatekeeper from '../AgentGatekeeper';
import { useWallet } from '../../providers/WalletContext';
import AIAgentNetworkMap from './AIAgentNetworkMap';
import DAOProposalOrbitalInterface from './DAOProposalOrbitalInterface';
import TransparentTreasuryDashboard from './TransparentTreasuryDashboard';
import DecentralizedLoreUnlockSystem from './DecentralizedLoreUnlockSystem';
import LiveGovernanceFeed from './LiveGovernanceFeed';
import AgentEcosystemGraph from './AgentEcosystemGraph';

const DecentralizedFeaturesShowcase = () => {
  const [activeTab, setActiveTab] = useState('network');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAgentGatekeeper, setShowAgentGatekeeper] = useState(false);
  const { isConnected, mintAgent } = useWallet();

  const tabs = [
    { id: 'network', name: 'Agent Network', icon: '🧠', component: AIAgentNetworkMap },
    { id: 'dao', name: 'DAO Proposals', icon: '🏛️', component: DAOProposalOrbitalInterface },
    { id: 'treasury', name: 'Treasury', icon: '💰', component: TransparentTreasuryDashboard },
    { id: 'lore', name: 'Lore System', icon: '📜', component: DecentralizedLoreUnlockSystem },
    { id: 'governance', name: 'Governance', icon: '🗳️', component: LiveGovernanceFeed },
    { id: 'ecosystem', name: 'Ecosystem', icon: '🌐', component: AgentEcosystemGraph },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Decentralized Intelligence Ecosystem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto"
          >
            Experience the future of decentralized AI through interactive visualizations, 
            real-time governance, and transparent ecosystem dynamics.
          </motion.p>
        </div>

        {/* Quick Connect Wallet CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <ConnectWalletButton
            variant="primary"
            size="md"
            showStatus={true}
            onWalletModalOpen={() => setShowWalletModal(true)}
          />
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="text-sm">{tab.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Component Display */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {ActiveComponent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ActiveComponent />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[
            {
              icon: '🔗',
              title: 'Network Visualization',
              description: 'Real-time agent connections and task flows with interactive network mapping.',
            },
            {
              icon: '🌌',
              title: 'Orbital Governance',
              description: 'DAO proposals orbiting the governance core with live voting interfaces.',
            },
            {
              icon: '💎',
              title: 'Transparent Treasury',
              description: 'Complete visibility into token flows, allocations, and financial movements.',
            },
            {
              icon: '📚',
              title: 'Lore Unlock System',
              description: 'Discover ancient knowledge through wallet-based fragment collection.',
            },
            {
              icon: '⚡',
              title: 'Live Governance',
              description: 'Real-time proposal updates, voting feeds, and governance activity.',
            },
            {
              icon: '📊',
              title: 'Ecosystem Analytics',
              description: 'XP tracking, growth patterns, and agent evolution visualization.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-colors"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-3">
              Ready to Experience Decentralized AI?
            </h3>
            <p className="text-gray-300 mb-4 max-w-2xl mx-auto text-sm">
              Join the DecentraMind ecosystem and become part of the future of autonomous AI agents, 
              decentralized governance, and transparent intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <ConnectWalletButton
                variant="primary"
                size="md"
                showStatus={false}
                onWalletModalOpen={() => setShowWalletModal(true)}
              />
              <motion.button
                onClick={() => {
                  console.log('Exploring dashboard...');
                  window.open('/dashboard', '_blank');
                }}
                className="px-6 py-3 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-lg font-bold text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">📊</span>
                  Explore Dashboard
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />

      {/* Agent Gatekeeper Modal */}
      <AgentGatekeeper
        isOpen={showAgentGatekeeper}
        onClose={() => setShowAgentGatekeeper(false)}
        onProceed={() => {
          // Handle agent minting
          console.log('Proceeding to mint agent...');
        }}
      />
    </section>
  );
};

export default DecentralizedFeaturesShowcase;
