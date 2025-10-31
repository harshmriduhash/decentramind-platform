'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main footer content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-8">
            <motion.div
              className="mr-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="/logo.svg" 
                alt="DecentraMind Labs Logo" 
                className="w-24 h-14"
              />
            </motion.div>
            <motion.span
              className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              DecentraMind Labs
            </motion.span>
          </div>
          
          <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
            Building the future of autonomous AI agents and decentralized intelligence.
          </p>

          {/* Footer links */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { name: "Dashboard", href: "/dashboard" },
              { name: "Agents", href: "/ai-agents/management" },
              { name: "Health Portal", href: "/care/insights" },
              { name: "Governance", href: "/governance" },
              { name: "Mint Agent", href: "/ai-agents/mint" },
            ].map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-slate-800/50 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2024 DecentraMind Labs. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <motion.div
                className="flex items-center text-sm text-gray-500"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="w-2 h-2 bg-green-400 rounded-full mr-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Live on Devnet</span>
              </motion.div>
              
              <motion.div
                className="text-sm text-gray-500"
                whileHover={{ scale: 1.05 }}
              >
                <span>Powered by Solana & Firebase</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Floating footer elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left: 10, bottom: 20, duration: 3.2, delay: 0 },
            { left: 22, bottom: 50, duration: 4.1, delay: 0.5 },
            { left: 34, bottom: 20, duration: 3.8, delay: 1 },
            { left: 46, bottom: 50, duration: 4.5, delay: 1.5 },
            { left: 58, bottom: 20, duration: 3.6, delay: 2 },
            { left: 70, bottom: 50, duration: 4.2, delay: 2.5 },
            { left: 82, bottom: 20, duration: 3.9, delay: 3 },
            { left: 94, bottom: 50, duration: 4.3, delay: 3.5 },
          ].map((element, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-40"
              style={{
                left: `${element.left}%`,
                bottom: `${element.bottom}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: element.duration,
                repeat: Infinity,
                delay: element.delay,
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
