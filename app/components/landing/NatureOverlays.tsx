'use client';

import React from 'react';
import { motion } from 'framer-motion';

const NatureOverlays = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Animated Vines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Left side vines */}
        <motion.path
          d="M0,20 Q10,15 20,25 Q30,35 25,50 Q20,65 30,75 Q40,80 35,90"
          stroke="url(#vineGradient)"
          strokeWidth="0.3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        
        {/* Right side vines */}
        <motion.path
          d="M100,30 Q90,25 80,35 Q70,45 75,60 Q80,75 70,85 Q60,90 65,100"
          stroke="url(#vineGradient)"
          strokeWidth="0.3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
        />
        
        {/* Top vines */}
        <motion.path
          d="M20,0 Q30,5 25,15 Q20,25 30,20 Q40,15 35,0"
          stroke="url(#vineGradient)"
          strokeWidth="0.2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, delay: 1, ease: "easeInOut" }}
        />
        
        <defs>
          <linearGradient id="vineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating Blossoms */}
      {[
        { left: 15, top: 20, delay: 0, duration: 4 },
        { left: 85, top: 30, delay: 1, duration: 5 },
        { left: 25, top: 70, delay: 2, duration: 4.5 },
        { left: 75, top: 80, delay: 3, duration: 5.5 },
        { left: 50, top: 10, delay: 1.5, duration: 4.2 },
        { left: 10, top: 60, delay: 2.5, duration: 4.8 },
      ].map((blossom, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-60"
          style={{
            left: `${blossom.left}%`,
            top: `${blossom.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.sin(i) * 10, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: blossom.duration,
            repeat: Infinity,
            delay: blossom.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Glowing Crystal Roots */}
      <div className="absolute inset-0">
        {[
          { left: 10, top: 60, rotation: 15, delay: 0 },
          { left: 80, top: 70, rotation: -20, delay: 1 },
          { left: 20, top: 80, rotation: 30, delay: 2 },
          { left: 70, top: 90, rotation: -15, delay: 3 },
        ].map((root, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-1 bg-gradient-to-r from-emerald-400/40 to-cyan-400/40 rounded-full"
            style={{
              left: `${root.left}%`,
              top: `${root.top}%`,
              transform: `rotate(${root.rotation}deg)`,
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scaleX: [1, 1.3, 1],
              boxShadow: [
                "0 0 10px rgba(16, 185, 129, 0.3)",
                "0 0 20px rgba(16, 185, 129, 0.6)",
                "0 0 10px rgba(16, 185, 129, 0.3)",
              ],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              delay: root.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NatureOverlays;


