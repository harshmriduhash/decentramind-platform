'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../providers/WalletContext';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { isLoading } = useWallet();
  const { wallets } = useSolanaWallet();

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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <span className="text-gray-400 hover:text-white text-xl">✕</span>
            </button>
          </div>

          <p className="text-gray-300 mb-6 text-center">
            Select a wallet to connect to DecentraMind and start minting AI agents
          </p>

          <div className="space-y-4">
            {/* Use the official Solana wallet adapter button */}
            <div className="flex justify-center">
              <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !rounded-xl !font-bold !transition-all !duration-300" />
            </div>

            {/* Show available wallets */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400 text-center">Available Wallets</h3>
              <div className="grid grid-cols-2 gap-2">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.adapter.name}
                    className="flex items-center space-x-2 p-2 bg-slate-800/50 rounded-lg"
                  >
                    <img
                      src={wallet.adapter.icon}
                      alt={wallet.adapter.name}
                      className="w-6 h-6"
                    />
                    <span className="text-sm text-white">{wallet.adapter.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>🔒</span>
              <span>Your wallet connection is secure and encrypted</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletModal;
