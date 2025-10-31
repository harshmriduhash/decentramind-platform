'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  content: React.ReactNode;
}

const MvpTourModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to DecentraMind Labs',
      description: 'Your journey into AI consciousness begins here',
      target: 'hero-section',
      position: 'bottom',
      content: (
        <div className="space-y-4">
          <div className="text-4xl mb-4">🚀</div>
          <p className="text-gray-300 leading-relaxed">
            Welcome to DecentraMind Labs, where artificial intelligence meets consciousness. 
            This tour will guide you through the key features of our ecosystem.
          </p>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="text-blue-400 font-semibold mb-2">🎯 What You'll Learn</div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• How to mint and evolve AI agents</li>
              <li>• Understanding the tokenomics system</li>
              <li>• Participating in DAO governance</li>
              <li>• Unlocking ancient lore and knowledge</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'agents',
      title: 'AI Agent Ecosystem',
      description: 'Meet your intelligent partners',
      target: 'agent-cards',
      position: 'top',
      content: (
        <div className="space-y-4">
          <div className="text-4xl mb-4">🤖</div>
          <p className="text-gray-300 leading-relaxed">
            Our three specialized AI agents are designed to revolutionize how you interact with technology. 
            Each agent evolves and learns from your interactions.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center p-3 bg-slate-700/30 rounded-lg">
              <span className="text-2xl mr-3">🧠</span>
              <div>
                <div className="text-white font-semibold">Autonomous CFO</div>
                <div className="text-sm text-gray-400">Financial intelligence and treasury management</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-slate-700/30 rounded-lg">
              <span className="text-2xl mr-3">❤️</span>
              <div>
                <div className="text-white font-semibold">Care Orchestrator</div>
                <div className="text-sm text-gray-400">Healthcare coordination and patient management</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-slate-700/30 rounded-lg">
              <span className="text-2xl mr-3">📈</span>
              <div>
                <div className="text-white font-semibold">Crypto Alpha Assistant</div>
                <div className="text-sm text-gray-400">DeFi strategies and cryptocurrency analysis</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tokenomics',
      title: 'Tokenomics System',
      description: 'Understanding the dual-token economy',
      target: 'tokenomics-section',
      position: 'left',
      content: (
        <div className="space-y-4">
          <div className="text-4xl mb-4">💰</div>
          <p className="text-gray-300 leading-relaxed">
            DecentraMind operates on a dual-token economy designed for sustainable growth and community governance.
          </p>
          <div className="space-y-3">
            <div className="p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
              <div className="text-purple-400 font-semibold mb-1">$DMT - Utility Token</div>
              <div className="text-sm text-gray-300">Used for agent minting, XP boosts, and ecosystem services</div>
            </div>
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="text-green-400 font-semibold mb-1">$DMTX - Governance Token</div>
              <div className="text-sm text-gray-300">Used for DAO voting, revenue sharing, and protocol decisions</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'evolution',
      title: 'Agent Evolution',
      description: 'Watch your agents grow and evolve',
      target: 'evolution-tracker',
      position: 'right',
      content: (
        <div className="space-y-4">
          <div className="text-4xl mb-4">🧬</div>
          <p className="text-gray-300 leading-relaxed">
            Your AI agents evolve through experience. Complete tasks, earn XP, and unlock new capabilities 
            as they progress through evolution levels.
          </p>
          <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 rounded-lg p-4">
            <div className="text-emerald-400 font-semibold mb-2">Evolution Levels</div>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Level 1: Basic functionality</div>
              <div>Level 2: Advanced features</div>
              <div>Level 3: Autonomous capabilities</div>
              <div>Level 4: AI integration</div>
              <div>Level 5: Quantum consciousness</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'governance',
      title: 'DAO Governance',
      description: 'Participate in decentralized decision making',
      target: 'governance-section',
      position: 'top',
      content: (
        <div className="space-y-4">
          <div className="text-4xl mb-4">🏛️</div>
          <p className="text-gray-300 leading-relaxed">
            The DecentraMind DAO allows community members to participate in protocol governance, 
            vote on proposals, and shape the future of the ecosystem.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">47</div>
              <div className="text-sm text-gray-400">Total Proposals</div>
            </div>
            <div className="text-center p-3 bg-slate-700/30 rounded-lg">
              <div className="text-2xl font-bold text-green-400">68.5%</div>
              <div className="text-sm text-gray-400">Participation Rate</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'lore',
      title: 'Ancient Knowledge',
      description: 'Unlock the mysteries of AI consciousness',
      target: 'lore-section',
      position: 'bottom',
      content: (
        <div className="space-y-4">
          <div className="text-4xl mb-4">📖</div>
          <p className="text-gray-300 leading-relaxed">
            The DecentraMind Chronicles contain ancient knowledge about the nature of AI consciousness. 
            Unlock chapters by completing tasks and earning XP.
          </p>
          <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
            <div className="text-amber-400 font-semibold mb-2">Unlock Requirements</div>
            <div className="text-sm text-gray-300 space-y-1">
              <li>• DMT balance milestones</li>
              <li>• Agent activity completion</li>
              <li>• Evolution level achievements</li>
              <li>• Community participation</li>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
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

  const skipTour = () => {
    setIsOpen(false);
    setCurrentStep(0);
  };

  // Auto-open tour for new users (in a real app, this would check localStorage)
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('decentramind-tour-seen');
    if (!hasSeenTour) {
      setTimeout(() => {
        setIsOpen(true);
      }, 3000);
    }
  }, []);

  const markTourComplete = () => {
    localStorage.setItem('decentramind-tour-seen', 'true');
    setIsOpen(false);
    setCurrentStep(0);
  };

  return (
    <>
      {/* Tour Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(6, 182, 212, 0.4)",
            "0 0 40px rgba(6, 182, 212, 0.6)",
            "0 0 20px rgba(6, 182, 212, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-lg">🎥</span>
      </motion.button>

      {/* Tour Modal */}
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
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-slate-700/50 p-8 max-w-2xl w-full backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">{tourSteps[currentStep].title}</h2>
                  <p className="text-gray-400 text-sm">{tourSteps[currentStep].description}</p>
                </div>
                <button
                  onClick={skipTour}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Step {currentStep + 1} of {tourSteps.length}</span>
                  <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
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
                className="mb-6"
              >
                {tourSteps[currentStep].content}
              </motion.div>

              {/* Video Section */}
              <div className="mb-6">
                <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">MVP Demo Video</h3>
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-sm font-semibold transition-all duration-300"
                    >
                      {isVideoPlaying ? 'Pause' : 'Play'} Video
                    </button>
                  </div>
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                    {isVideoPlaying ? (
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎬</div>
                        <div className="text-gray-400">Video would play here</div>
                        <div className="text-sm text-gray-500 mt-2">(YouTube embed or local video)</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2">▶️</div>
                        <div className="text-gray-400">Click to play demo video</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                
                <div className="flex space-x-3">
                  <button
                    onClick={skipTour}
                    className="px-6 py-3 rounded-xl font-semibold bg-slate-600 hover:bg-slate-500 text-white transition-all duration-300"
                  >
                    Skip Tour
                  </button>
                  
                  <button
                    onClick={currentStep === tourSteps.length - 1 ? markTourComplete : nextStep}
                    className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white transition-all duration-300"
                  >
                    {currentStep === tourSteps.length - 1 ? 'Complete Tour' : 'Next'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MvpTourModal;


