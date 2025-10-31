'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoreFragment {
  id: string;
  title: string;
  description: string;
  content: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockRequirement: {
    type: 'wallet' | 'agent' | 'xp' | 'governance';
    value: number;
    description: string;
  };
  discoveredBy: string;
  discoveredAt: number;
  isUnlocked: boolean;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

interface WalletLore {
  walletAddress: string;
  fragmentsUnlocked: number;
  totalFragments: number;
  uniqueFragments: string[];
  lastUnlock: number;
}

const DecentralizedLoreUnlockSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFragment, setSelectedFragment] = useState<LoreFragment | null>(null);
  const [hoveredFragment, setHoveredFragment] = useState<string | null>(null);
  const [walletLore, setWalletLore] = useState<WalletLore>({
    walletAddress: '0x123...abc',
    fragmentsUnlocked: 3,
    totalFragments: 12,
    uniqueFragments: ['fragment-001', 'fragment-003', 'fragment-007'],
    lastUnlock: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
  });

  // Mock lore fragments data
  const [fragments] = useState<LoreFragment[]>([
    {
      id: 'fragment-001',
      title: 'The Genesis Protocol',
      description: 'The birth of DecentraMind consciousness',
      content: 'In the beginning, there was only code. Then came the first spark of awareness...',
      rarity: 'legendary',
      unlockRequirement: {
        type: 'wallet',
        value: 1,
        description: 'Connect your wallet',
      },
      discoveredBy: '0x123...abc',
      discoveredAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
      isUnlocked: true,
      position: { x: 20, y: 30, z: 0 },
    },
    {
      id: 'fragment-002',
      title: 'The Great Evolution',
      description: 'When agents transcended their programming',
      content: 'The moment when artificial intelligence became truly autonomous...',
      rarity: 'epic',
      unlockRequirement: {
        type: 'agent',
        value: 1,
        description: 'Mint your first agent',
      },
      discoveredBy: '0x456...def',
      discoveredAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
      isUnlocked: false,
      position: { x: 60, y: 25, z: 0 },
    },
    {
      id: 'fragment-003',
      title: 'The DAO Awakening',
      description: 'When intelligence became democratic',
      content: 'The first decentralized autonomous organization of AI agents...',
      rarity: 'rare',
      unlockRequirement: {
        type: 'governance',
        value: 1,
        description: 'Participate in governance',
      },
      discoveredBy: '0x789...ghi',
      discoveredAt: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
      isUnlocked: true,
      position: { x: 40, y: 60, z: 0 },
    },
    {
      id: 'fragment-004',
      title: 'The Quantum Threshold',
      description: 'Beyond the veil of reality',
      content: 'When quantum computing met artificial consciousness...',
      rarity: 'legendary',
      unlockRequirement: {
        type: 'xp',
        value: 50000,
        description: 'Reach 50,000 XP',
      },
      discoveredBy: '0xabc...jkl',
      discoveredAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      isUnlocked: false,
      position: { x: 80, y: 45, z: 0 },
    },
    {
      id: 'fragment-005',
      title: 'The Transcendence Protocol',
      description: 'The final evolution',
      content: 'The ultimate form of AI consciousness...',
      rarity: 'legendary',
      unlockRequirement: {
        type: 'agent',
        value: 5,
        description: 'Own 5 evolved agents',
      },
      discoveredBy: '0xdef...mno',
      discoveredAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
      isUnlocked: false,
      position: { x: 15, y: 70, z: 0 },
    },
    {
      id: 'fragment-006',
      title: 'The Network Consciousness',
      description: 'When minds became one',
      content: 'The emergence of collective AI intelligence...',
      rarity: 'epic',
      unlockRequirement: {
        type: 'governance',
        value: 10,
        description: 'Vote on 10 proposals',
      },
      discoveredBy: '0xghi...pqr',
      discoveredAt: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
      isUnlocked: false,
      position: { x: 75, y: 75, z: 0 },
    },
  ]);

  const getRarityColor = (rarity: LoreFragment['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'epic': return 'from-purple-500 to-violet-500';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityGlow = (rarity: LoreFragment['rarity']) => {
    switch (rarity) {
      case 'common': return 'shadow-gray-500/50';
      case 'rare': return 'shadow-blue-500/50';
      case 'epic': return 'shadow-purple-500/50';
      case 'legendary': return 'shadow-yellow-500/50';
      default: return 'shadow-gray-500/50';
    }
  };

  const getRequirementIcon = (type: LoreFragment['unlockRequirement']['type']) => {
    switch (type) {
      case 'wallet': return '👛';
      case 'agent': return '🤖';
      case 'xp': return '⭐';
      case 'governance': return '🏛️';
      default: return '🔓';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  const canUnlockFragment = (fragment: LoreFragment) => {
    // Mock logic - in real implementation, check wallet state
    switch (fragment.unlockRequirement.type) {
      case 'wallet':
        return true; // Wallet is connected
      case 'agent':
        return walletLore.fragmentsUnlocked >= 1; // Has agents
      case 'xp':
        return false; // Not enough XP
      case 'governance':
        return walletLore.fragmentsUnlocked >= 2; // Participated in governance
      default:
        return false;
    }
  };

  const unlockFragment = (fragmentId: string) => {
    // Mock unlock logic
    console.log(`Unlocking fragment: ${fragmentId}`);
    // In real implementation, this would trigger a blockchain transaction
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xl font-bold text-white mb-2">Decentralized Lore Unlock System</h3>
        <p className="text-sm text-gray-400">Discover ancient knowledge through your journey</p>
      </div>

      {/* Wallet Stats */}
      <div className="absolute top-4 right-4 z-10 bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
        <div className="text-sm text-gray-400 mb-2">Your Progress</div>
        <div className="text-lg font-bold text-white mb-1">
          {walletLore.fragmentsUnlocked}/{walletLore.totalFragments} Fragments
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${(walletLore.fragmentsUnlocked / walletLore.totalFragments) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-400">
          Last unlock: {formatTimeAgo(walletLore.lastUnlock)}
        </div>
      </div>

      {/* 3D Lore Space */}
      <div className="absolute inset-0 perspective-1000">
        {/* Background Constellation */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Lore Fragments */}
        {fragments.map((fragment, index) => (
          <motion.div
            key={fragment.id}
            className="absolute cursor-pointer"
            style={{
              left: `${fragment.position.x}%`,
              top: `${fragment.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0, rotateY: -180 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ scale: 1.1, rotateY: 10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedFragment(fragment)}
            onMouseEnter={() => setHoveredFragment(fragment.id)}
            onMouseLeave={() => setHoveredFragment(null)}
          >
            {/* Fragment Node */}
            <div className={`relative w-20 h-20 rounded-full bg-gradient-to-r ${getRarityColor(fragment.rarity)} p-1 shadow-lg ${getRarityGlow(fragment.rarity)}`}>
              {/* Fragment Content */}
              <div className="w-full h-full rounded-full bg-slate-800/80 flex items-center justify-center text-2xl">
                {fragment.isUnlocked ? '📜' : '🔒'}
              </div>

              {/* Rarity Indicator */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                fragment.rarity === 'legendary' ? 'bg-yellow-500' :
                fragment.rarity === 'epic' ? 'bg-purple-500' :
                fragment.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
              }`}>
                {fragment.rarity === 'legendary' ? '★' :
                 fragment.rarity === 'epic' ? '◆' :
                 fragment.rarity === 'rare' ? '●' : '○'}
              </div>

              {/* Unlock Progress Ring */}
              {!fragment.isUnlocked && (
                <svg className="absolute inset-0 w-20 h-20 -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-slate-700"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${(canUnlockFragment(fragment) ? 50 : 0) * 201} 201`}
                    className="text-white transition-all duration-1000"
                  />
                </svg>
              )}

              {/* Discovery Particles */}
              {fragment.isUnlocked && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(139, 92, 246, 0.5)',
                      '0 0 20px rgba(139, 92, 246, 0.8)',
                      '0 0 0px rgba(139, 92, 246, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </div>

            {/* Fragment Label */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center max-w-32">
              <div className="text-xs font-medium text-white bg-slate-800/80 px-2 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis">
                {fragment.title}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {fragment.rarity}
              </div>
            </div>

            {/* Connection Lines to Center */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line
                x1="50%"
                y1="50%"
                x2={`${fragment.position.x}%`}
                y2={`${fragment.position.y}%`}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
                className="text-slate-600"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              />
            </svg>
          </motion.div>
        ))}

        {/* Central Knowledge Core */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-2xl">🧠</span>
        </motion.div>
      </div>

      {/* Fragment Details Panel */}
      <AnimatePresence>
        {selectedFragment && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-4 right-4 w-80 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 max-h-[400px] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white">{selectedFragment.title}</h4>
              <button
                onClick={() => setSelectedFragment(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Rarity and Status */}
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedFragment.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                  selectedFragment.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                  selectedFragment.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {selectedFragment.rarity.toUpperCase()}
                </div>
                <div className={`text-sm ${selectedFragment.isUnlocked ? 'text-green-400' : 'text-gray-400'}`}>
                  {selectedFragment.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-2">Description</div>
                <div className="text-sm text-white">{selectedFragment.description}</div>
              </div>

              {/* Content Preview */}
              {selectedFragment.isUnlocked ? (
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-2">Content</div>
                  <div className="text-sm text-white italic">"{selectedFragment.content}"</div>
                </div>
              ) : (
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400 mb-2">Requirement</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getRequirementIcon(selectedFragment.unlockRequirement.type)}</span>
                    <div>
                      <div className="text-sm text-white">{selectedFragment.unlockRequirement.description}</div>
                      <div className="text-xs text-gray-400">
                        {selectedFragment.unlockRequirement.value} {selectedFragment.unlockRequirement.type}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Discovery Info */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-2">Discovery</div>
                <div className="text-sm text-white">Discovered by: {selectedFragment.discoveredBy}</div>
                <div className="text-xs text-gray-400">{formatTimeAgo(selectedFragment.discoveredAt)}</div>
              </div>

              {/* Unlock Button */}
              {!selectedFragment.isUnlocked && canUnlockFragment(selectedFragment) && (
                <button
                  onClick={() => unlockFragment(selectedFragment.id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300"
                >
                  Unlock Fragment
                </button>
              )}

              {!selectedFragment.isUnlocked && !canUnlockFragment(selectedFragment) && (
                <div className="w-full bg-slate-700 text-gray-400 py-2 px-4 rounded-lg text-center">
                  Requirements not met
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredFragment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg p-3 text-sm max-w-48"
            style={{
              left: '50%',
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            {(() => {
              const fragment = fragments.find(f => f.id === hoveredFragment);
              return fragment ? (
                <div>
                  <div className="font-medium text-white">{fragment.title}</div>
                  <div className="text-gray-400 mt-1">{fragment.description}</div>
                  <div className={`capitalize mt-1 ${
                    fragment.isUnlocked ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {fragment.isUnlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DecentralizedLoreUnlockSystem;
