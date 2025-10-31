'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface MenuItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  color: string;
}

const MobileFloatingMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '🏠',
      path: '/dashboard',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'agents',
      name: 'Agents',
      icon: '🤖',
      path: '/ai-agents/management',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'mint',
      name: 'Mint',
      icon: '🎯',
      path: '/ai-agents/mint',
      color: 'from-emerald-500 to-green-500',
    },
    {
      id: 'health',
      name: 'Health',
      icon: '❤️',
      path: '/care/insights',
      color: 'from-red-500 to-pink-500',
    },
    {
      id: 'governance',
      name: 'DAO',
      icon: '🏛️',
      path: '/governance',
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'profile',
      name: 'Profile',
      icon: '👤',
      path: '/profile',
      color: 'from-gray-500 to-slate-500',
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    router.push(item.path);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      {/* Expanded Menu Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 mb-4"
          >
            <div className="flex flex-col space-y-3">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => handleItemClick(item)}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-lg">{item.icon}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isExpanded
            ? 'bg-gradient-to-br from-red-500 to-pink-500'
            : 'bg-gradient-to-br from-purple-600 to-blue-600'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(139, 92, 246, 0.4)",
            "0 0 40px rgba(139, 92, 246, 0.6)",
            "0 0 20px rgba(139, 92, 246, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.span
          className="text-2xl"
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isExpanded ? '✕' : '☰'}
        </motion.span>
      </motion.button>

      {/* Background Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileFloatingMenu;


