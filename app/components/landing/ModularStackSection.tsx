'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TechItemProps {
  icon: string;
  name: string;
  description: string;
  delay: number;
}

const TechItem = ({ icon, name, description, delay }: TechItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="group relative p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-2 backdrop-blur-sm"
      whileHover={{ 
        scale: 1.05,
        rotateY: 10,
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center">
        <motion.div
          className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-blue-400 text-2xl">{icon}</span>
        </motion.div>
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300 mb-2">
          {name}
        </h3>
        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

const NeuralGrid = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Animated connection lines */}
        {[
          { x1: 20, y1: 30, x2: 80, y2: 70, duration: 3.5, delay: 0 },
          { x1: 60, y1: 20, x2: 40, y2: 80, duration: 4.2, delay: 0.5 },
          { x1: 10, y1: 60, x2: 90, y2: 40, duration: 3.8, delay: 1 },
          { x1: 70, y1: 10, x2: 30, y2: 90, duration: 4.5, delay: 1.5 },
          { x1: 50, y1: 50, x2: 15, y2: 25, duration: 3.2, delay: 2 },
          { x1: 85, y1: 75, x2: 25, y2: 15, duration: 4.8, delay: 2.5 },
          { x1: 35, y1: 85, x2: 75, y2: 35, duration: 3.7, delay: 3 },
          { x1: 95, y1: 45, x2: 5, y2: 65, duration: 4.1, delay: 3.5 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="url(#gradient)"
            strokeWidth="0.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: line.delay,
            }}
          />
        ))}
        
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

const ModularStackSection = () => {
  const techItems = [
    { icon: "⚡", name: "Soulbound NFTs", description: "Unique agent identity" },
    { icon: "🎯", name: "XP System", description: "Progressive evolution" },
    { icon: "🏛️", name: "DAO Governance", description: "Decentralized decisions" },
    { icon: "🛒", name: "Agent Marketplace", description: "Trade capabilities" },
    { icon: "⚙️", name: "Task Engine", description: "Automated workflows" },
    { icon: "🔥", name: "Firebase + Solana", description: "Hybrid infrastructure" },
    { icon: "🔐", name: "Token-Gated Tools", description: "Access control" },
    { icon: "👛", name: "Wallet Integration", description: "Seamless connectivity" },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Neural Grid Background */}
      <NeuralGrid />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            One Protocol. Infinite Intelligence.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Powered by wallet signatures, RAG pipelines, and an AI-native architecture.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techItems.map((item, index) => (
            <TechItem
              key={index}
              {...item}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Central pulsing core */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-500/30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-4xl">🧠</span>
            </motion.div>
            
            {/* Ripple effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border-2 border-blue-500/30 rounded-full"
                animate={{
                  scale: [1, 2, 3],
                  opacity: [0.5, 0.2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModularStackSection;
