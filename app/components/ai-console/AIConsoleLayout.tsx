'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../../providers/WalletContext';
import { useRouter } from 'next/navigation';
import WalletStatus from '../WalletStatus';
import { getTotalXP, getTotalEarnings, getGlobalLevel } from '../../utils/careAgentData';

interface AIConsoleLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AIConsoleLayout: React.FC<AIConsoleLayoutProps> = ({
  children,
  activeTab,
  onTabChange
}) => {
  const { isConnected, walletAddress, isLoading } = useWallet();
  const router = useRouter();
  const [globalXP, setGlobalXP] = useState(0);
  const [globalLevel, setGlobalLevel] = useState(1);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setGlobalXP(getTotalXP());
      setGlobalLevel(getGlobalLevel());
      setTotalEarnings(getTotalEarnings());
    }
  }, [isConnected]);

  useEffect(() => {
    // Add a small delay to allow wallet to initialize
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if wallet was previously connected in localStorage
    const wasConnected = localStorage.getItem('decentramind_wallet_connected') === 'true';
    const savedAddress = localStorage.getItem('decentramind_wallet_address');
    
    // If we have a saved connection but wallet isn't connected yet, wait a bit longer
    if (wasConnected && savedAddress && !isConnected && !isLoading) {
      const extendedTimer = setTimeout(() => {
        setIsInitialized(true);
      }, 2000);
      
      return () => clearTimeout(extendedTimer);
    }
  }, [isConnected, isLoading]);

  useEffect(() => {
    // Only redirect if we're initialized and definitely not connected
    if (isInitialized && !isLoading && !isConnected) {
      router.push('/');
    }
  }, [isInitialized, isLoading, isConnected, router]);

  const tabs = [
    { id: 'finance', name: '🧠 Autonomous CFO', icon: '🧠', color: 'emerald' },
    { id: 'wellness', name: '❤️ Care Orchestrator', icon: '❤️', color: 'rose' },
    { id: 'alpha', name: '📈 Crypto Alpha Assistant', icon: '📈', color: 'purple' },
    { id: 'custom', name: '🎨 Custom Agents', icon: '🎨', color: 'cyan' }
  ];

  const xpProgress = (globalXP % 1000) / 10; // Progress to next level

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-white mb-2">Loading AI Console</h1>
          <p className="text-gray-400 mb-6">Initializing wallet connection...</p>
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-white mb-2">Wallet Required</h1>
          <p className="text-gray-400 mb-6">Please connect your wallet to access the AI Console</p>
          <motion.button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Landing Page
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Cosmic Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  DecentraMind Labs
                </h1>
                <p className="text-xs text-gray-400">The Swiss Army of AI Agents</p>
              </div>
            </motion.div>

            {/* Global XP Bar */}
            <motion.div
              className="hidden md:flex items-center space-x-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-300">Level {globalLevel}</div>
                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="text-xs text-gray-400">{globalXP} XP</div>
              </div>
              <div className="text-sm text-emerald-400 font-medium">
                ${totalEarnings.toLocaleString()} DMT
              </div>
            </motion.div>

            {/* Wallet Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <WalletStatus />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="relative z-10 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
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
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AIConsoleLayout;
