'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../providers/WalletContext';

const WalletStatus = () => {
  const { isConnected, shortAddress, disconnectWallet, copyAddress } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  if (!isConnected) return null;

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 rounded-lg backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300 whitespace-nowrap"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          boxShadow: [
            "0 0 0px rgba(16, 185, 129, 0.3)",
            "0 0 10px rgba(16, 185, 129, 0.5)",
            "0 0 0px rgba(16, 185, 129, 0.3)",
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-emerald-300">{shortAddress}</span>
        </div>
        <motion.div
          animate={{ rotate: showDropdown ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-emerald-300 text-xs">▼</span>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 right-4 w-56 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-3 shadow-2xl z-50"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white">Wallet Status</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400">Connected</span>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="ml-2 text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-700/50 rounded-lg p-2">
                <div className="text-xs text-gray-400 mb-1">Wallet Address</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white">{shortAddress}</span>
                  <button
                    onClick={copyAddress}
                    className="p-1 hover:bg-slate-600/50 rounded transition-colors"
                    title="Copy address"
                  >
                    <span className="text-gray-400 hover:text-white text-xs">📋</span>
                  </button>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={copyAddress}
                  className="flex-1 px-2 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-xs text-white transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={disconnectWallet}
                  className="flex-1 px-2 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-400/50 rounded-lg text-xs text-red-300 hover:text-red-200 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletStatus;
