'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../providers/WalletContext';

interface ConnectWalletButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showStatus?: boolean;
  onWalletModalOpen?: () => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  showStatus = true,
  onWalletModalOpen,
}) => {
  const { isConnected, shortAddress, connectWallet, isLoading } = useWallet();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: isConnected
      ? 'bg-gradient-to-r from-emerald-600/20 to-green-600/20 border border-emerald-500/30 text-emerald-300 cursor-default'
      : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white',
    secondary: isConnected
      ? 'border-2 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 cursor-default'
      : 'border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 text-white',
  };

  const handleClick = () => {
    if (!isConnected && !isLoading) {
      if (onWalletModalOpen) {
        onWalletModalOpen();
      } else {
        connectWallet();
      }
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={isConnected || isLoading}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
        rounded-lg font-bold transition-all duration-300 overflow-hidden shadow-lg
        ${isConnected ? 'shadow-emerald-500/25' : 'shadow-lg'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileHover={!isConnected ? { scale: 1.05, y: -2 } : {}}
      whileTap={!isConnected ? { scale: 0.95 } : {}}
      animate={isConnected ? {
        boxShadow: [
          "0 0 0px rgba(16, 185, 129, 0.3)",
          "0 0 10px rgba(16, 185, 129, 0.5)",
          "0 0 0px rgba(16, 185, 129, 0.3)",
        ],
      } : {}}
      transition={isConnected ? {
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      } : {}}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={!isConnected ? { x: '100%' } : {}}
        transition={{ duration: 0.6 }}
      />
      
      <span className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <>
            <motion.div
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Connecting...
          </>
        ) : isConnected ? (
          <>
            <span className="mr-2">✅</span>
            {showStatus ? `Connected: ${shortAddress}` : 'Wallet Connected'}
          </>
        ) : (
          <>
            <span className="mr-2">👛</span>
            Connect Wallet
          </>
        )}
      </span>

      {isConnected && (
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs">⚡</span>
        </motion.div>
      )}
    </motion.button>
  );
};

export default ConnectWalletButton;
