'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AgentCardProps {
  icon: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  xpLevel: number;
  xpProgress: number;
  delay: number;
}

const AgentCard = ({ icon, name, description, price, features, xpLevel, xpProgress, delay }: AgentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
      className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-4 backdrop-blur-sm"
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
        rotateX: 5,
      }}
      transition={{ duration: 0.3 }}
      animate={{
        boxShadow: [
          "0 0 0px rgba(139, 92, 246, 0)",
          "0 0 20px rgba(139, 92, 246, 0.1)",
          "0 0 0px rgba(139, 92, 246, 0)",
        ],
      }}
    >
      {/* XP Progress Ring */}
      <div className="absolute -top-4 -right-4 w-16 h-16">
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
            fill="none"
          />
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 28}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
            whileInView={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - xpProgress / 100) }}
            transition={{ duration: 2, delay: delay + 0.5 }}
            viewport={{ once: true }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-purple-400">{xpLevel}</span>
        </div>
      </div>

      {/* Agent Icon */}
      <motion.div
        className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-500"
        whileHover={{ 
          rotate: [0, -10, 10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 0.6 }}
        animate={{
          y: [0, -5, 0],
        }}
        style={{
          transition: 'all 0.3s ease',
        }}
      >
        {icon}
      </motion.div>

      {/* Agent Name */}
      <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors duration-300">
        {name}
      </h3>

      {/* Description */}
      <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
        {description}
      </p>

      {/* Price */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-purple-400 mb-2">{price}</div>
        <div className="text-sm text-gray-400">Starting Price</div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay + index * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
          >
            <motion.span
              className="text-green-400 mr-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            >
              ✓
            </motion.span>
            {feature}
          </motion.div>
        ))}
      </div>

      {/* Mint Button */}
      <motion.button
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105 relative overflow-hidden"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
        <span className="relative z-10">Mint {name}</span>
      </motion.button>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

const AgentCardsSection = () => {
  const agents = [
    {
      icon: "🧠",
      name: "Autonomous CFO",
      description: "Treasury, forecasting, governance integration, and token modeling.",
      price: "5 DMT",
      features: ["Treasury Forecasting", "Token Modeling", "Governance Analysis", "Risk Assessment"],
      xpLevel: 85,
      xpProgress: 85,
    },
    {
      icon: "❤️",
      name: "Care Orchestrator",
      description: "Coordinates healthcare flows, provider dashboards, and HIPAA-compliant data access.",
      price: "8 DMT",
      features: ["Health Monitoring", "Provider Coordination", "HIPAA Compliance", "Patient Analytics"],
      xpLevel: 92,
      xpProgress: 92,
    },
    {
      icon: "📈",
      name: "Crypto Alpha Assistant",
      description: "Tracks alpha, evaluates protocols, and submits DAO voting proposals.",
      price: "6 DMT",
      features: ["Alpha Tracking", "Protocol Analysis", "DAO Proposals", "Market Intelligence"],
      xpLevel: 78,
      xpProgress: 78,
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            A Modular, Intelligent Stack
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Three specialized AI agents designed to revolutionize how we interact with technology
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <AgentCard
              key={index}
              {...agent}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentCardsSection;
