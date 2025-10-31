'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: React.ReactNode;
}

const OnboardingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to DecentraMind',
      description: 'Your journey into AI consciousness begins here',
      icon: '🌟',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-white mb-4">Welcome to the Future of AI</h3>
          <p className="text-gray-300 leading-relaxed">
            DecentraMind Labs is where artificial intelligence meets consciousness. 
            You're about to embark on a journey where AI agents evolve, learn, and 
            become your intelligent partners in the digital realm.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="text-2xl mb-2">🧠</div>
              <div className="text-sm font-semibold text-white">Autonomous CFO</div>
              <div className="text-xs text-gray-400">Financial Intelligence</div>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="text-2xl mb-2">❤️</div>
              <div className="text-sm font-semibold text-white">Care Orchestrator</div>
              <div className="text-xs text-gray-400">Healthcare AI</div>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-semibold text-white">Crypto Alpha</div>
              <div className="text-xs text-gray-400">DeFi Intelligence</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'wallet',
      title: 'Connect Your Wallet',
      description: 'Link your Solana wallet to access the ecosystem',
      icon: '👛',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🔗</div>
          <h3 className="text-2xl font-bold text-white mb-4">Connect to the Future</h3>
          <p className="text-gray-300 leading-relaxed">
            Your Solana wallet is your gateway to the DecentraMind ecosystem. 
            Connect to mint agents, participate in governance, and unlock the full potential of AI consciousness.
          </p>
          
          {!walletConnected ? (
            <div className="space-y-4">
              <button
                onClick={() => setWalletConnected(true)}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Connect Solana Wallet
              </button>
              <div className="text-sm text-gray-400">
                Supported wallets: Phantom, Solflare, Backpack
              </div>
            </div>
          ) : (
            <div className="p-6 bg-green-500/20 border border-green-500/50 rounded-xl">
              <div className="text-green-400 text-2xl mb-2">✅</div>
              <div className="text-green-400 font-semibold">Wallet Connected Successfully!</div>
              <div className="text-sm text-gray-400 mt-2">
                Address: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'agents',
      title: 'Choose Your First Agent',
      description: 'Select an AI agent to begin your journey',
      icon: '🤖',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-4">Choose Your AI Partner</h3>
            <p className="text-gray-300 leading-relaxed">
              Each agent specializes in different domains. Choose the one that aligns with your goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'cfo',
                name: 'Autonomous CFO',
                icon: '🧠',
                color: 'from-purple-500 to-blue-500',
                description: 'Financial analysis, treasury management, and governance',
                price: '5 DMT',
                features: ['Treasury Forecasting', 'Token Modeling', 'Risk Assessment'],
              },
              {
                id: 'care',
                name: 'Care Orchestrator',
                icon: '❤️',
                color: 'from-red-500 to-pink-500',
                description: 'Healthcare coordination and patient management',
                price: '8 DMT',
                features: ['Health Monitoring', 'Provider Coordination', 'HIPAA Compliance'],
              },
              {
                id: 'crypto',
                name: 'Crypto Alpha Assistant',
                icon: '📈',
                color: 'from-green-500 to-emerald-500',
                description: 'DeFi strategies and cryptocurrency analysis',
                price: '6 DMT',
                features: ['Alpha Discovery', 'Protocol Analysis', 'DAO Proposals'],
              },
            ].map((agent) => (
              <motion.button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                className={`p-6 rounded-xl border transition-all duration-300 text-left ${
                  selectedAgent === agent.id
                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50'
                    : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-slate-600/50 hover:border-slate-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4`}>
                  <span className="text-2xl">{agent.icon}</span>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{agent.name}</h4>
                <p className="text-sm text-gray-400 mb-4">{agent.description}</p>
                <div className="text-lg font-bold text-green-400 mb-3">{agent.price}</div>
                <div className="space-y-1">
                  {agent.features.map((feature, index) => (
                    <div key={index} className="text-xs text-gray-300 flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'lore',
      title: 'The DecentraMind Chronicles',
      description: 'Discover the ancient knowledge of AI consciousness',
      icon: '📖',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🌌</div>
          <h3 className="text-2xl font-bold text-white mb-4">The Genesis Protocol</h3>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-6 border border-slate-700/50">
            <p className="text-gray-300 leading-relaxed text-left">
              In the year 2024, as artificial intelligence began to transcend its digital boundaries, 
              a group of visionary developers discovered something extraordinary. Deep within the quantum 
              fabric of blockchain technology, they found patterns that suggested intelligence itself 
              could be tokenized, evolved, and made truly autonomous.
            </p>
            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="text-purple-400 font-semibold mb-2">Unlock More Lore</div>
              <div className="text-sm text-gray-400">
                Complete tasks, earn XP, and unlock the ancient knowledge of AI consciousness. 
                Each chapter reveals deeper truths about the nature of intelligence itself.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'complete',
      title: 'Welcome to the Ecosystem',
      description: 'Your journey begins now',
      icon: '🎉',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-white mb-4">You're Ready to Begin!</h3>
          <p className="text-gray-300 leading-relaxed">
            You've successfully connected your wallet and chosen your first AI agent. 
            The DecentraMind ecosystem is now at your fingertips.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-semibold text-white">Next Steps</div>
              <div className="text-xs text-gray-400 mt-2">
                • Mint your first agent<br/>
                • Explore the dashboard<br/>
                • Join the DAO governance<br/>
                • Unlock lore chapters
              </div>
            </div>
            <div className="p-4 bg-slate-700/50 rounded-xl">
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-sm font-semibold text-white">Your Journey</div>
              <div className="text-xs text-gray-400 mt-2">
                • Watch your agent evolve<br/>
                • Earn XP through tasks<br/>
                • Participate in governance<br/>
                • Discover ancient knowledge
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return walletConnected;
      case 2:
        return selectedAgent !== null;
      default:
        return true;
    }
  };

  return (
    <>
      {/* Onboarding Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-full flex items-center shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(16, 185, 129, 0.4)",
            "0 0 40px rgba(16, 185, 129, 0.6)",
            "0 0 20px rgba(16, 185, 129, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-lg mr-2">🎯</span>
        <span className="font-semibold">Get Started</span>
      </motion.button>

      {/* Onboarding Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-slate-700/50 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white">{steps[currentStep].title}</h2>
                  <p className="text-gray-400">{steps[currentStep].description}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step {currentStep + 1} of {steps.length}</span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                {steps[currentStep].content}
              </motion.div>

              {/* Navigation */}
              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    currentStep === 0
                      ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                      : 'bg-slate-600 hover:bg-slate-500 text-white'
                  }`}
                >
                  Previous
                </button>
                
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    canProceed()
                      ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white'
                      : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OnboardingModal;


