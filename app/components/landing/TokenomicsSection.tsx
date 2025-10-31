'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TokenPlanetProps {
  name: string;
  symbol: string;
  description: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  delay: number;
}

const TokenPlanet = ({ name, symbol, description, color, orbitRadius, orbitSpeed, delay }: TokenPlanetProps) => {
  return (
    <motion.div
      className="absolute"
      style={{
        width: `${orbitRadius * 2}px`,
        height: `${orbitRadius * 2}px`,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: orbitSpeed,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
    >
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        whileHover={{ scale: 1.2 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg border-2 border-white/20 backdrop-blur-sm`}>
          <span className="text-white font-bold text-lg">{symbol}</span>
        </div>
        
        {/* Planet glow */}
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} opacity-30 blur-xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      
      {/* Token info */}
      <motion.div
        className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: delay + 0.5 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <p className="text-sm text-gray-300 max-w-32">{description}</p>
      </motion.div>
    </motion.div>
  );
};

const TokenomicsSection = () => {
  const tokens = [
    {
      name: "DecentraMind Token",
      symbol: "$DMT",
      description: "Utility token for agent usage, XP boosts, and services.",
      color: "from-purple-500 to-blue-500",
      orbitRadius: 120,
      orbitSpeed: 20,
      delay: 0,
    },
    {
      name: "DecentraMind Governance Token",
      symbol: "$DMTX",
      description: "Governance token for DAO proposals, voting, and revenue allocation.",
      color: "from-green-500 to-cyan-500",
      orbitRadius: 180,
      orbitSpeed: 30,
      delay: 10,
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Ecosystem Tokens
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A dual-token economy designed for sustainable growth and community governance
          </p>
        </motion.div>

        {/* Planetary System */}
        <div className="relative h-96 flex items-center justify-center">
        {/* Central sun */}
        <motion.div
          className="relative z-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl"
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="text-3xl">☀️</span>
          {/* Solar flares */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-8 bg-gradient-to-t from-yellow-300 to-transparent rounded-full"
              style={{
                transformOrigin: 'bottom center',
                transform: `rotate(${i * 45}deg) translateY(-20px)`,
              }}
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>

          {/* Orbital rings */}
          {tokens.map((token, index) => (
            <motion.div
              key={index}
              className="absolute border border-gray-600/30 rounded-full"
              style={{
                width: `${token.orbitRadius * 2}px`,
                height: `${token.orbitRadius * 2}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: index * 0.3 }}
              viewport={{ once: true }}
            />
          ))}

          {/* Token planets */}
          {tokens.map((token, index) => (
            <TokenPlanet
              key={index}
              {...token}
            />
          ))}

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {tokens.map((_, index) => (
              <motion.line
                key={index}
                x1="50%"
                y1="50%"
                x2={`${50 + Math.cos(index * Math.PI) * 15}%`}
                y2={`${50 + Math.sin(index * Math.PI) * 15}%`}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                viewport={{ once: true }}
              />
            ))}
          </svg>
        </div>

        {/* Token details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {tokens.map((token, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 backdrop-blur-sm"
            >
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${token.color} rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl font-bold text-white">{token.symbol}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                    {token.name}
                  </h3>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                {token.description}
              </p>
              
              {/* Token stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">100M</div>
                  <div className="text-sm text-gray-400">Total Supply</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">Active</div>
                  <div className="text-sm text-gray-400">Status</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TokenomicsSection;
