'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const CosmicCTA = () => {
  const router = useRouter();

  const handleJoinAirdrop = () => {
    router.push('/governance');
  };

  const handleBecomeFoundingAgent = () => {
    router.push('/ai-agents/management');
  };

  const handleSocialClick = (platform: string) => {
    const socialLinks = {
      discord: 'https://discord.gg/decentramind',
      twitter: 'https://twitter.com/decentramind',
      github: 'https://github.com/decentramind',
      email: 'mailto:hello@decentramind.com'
    };

    if (socialLinks[platform as keyof typeof socialLinks]) {
      window.open(socialLinks[platform as keyof typeof socialLinks], '_blank');
    }
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Cosmic background elements */}
      <div className="absolute inset-0">
        {/* Large cosmic nebula */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Secondary nebula */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Floating cosmic particles */}
        {[
          { left: 15, top: 25, xOffset: 5, duration: 4.2, delay: 0 },
          { left: 35, top: 60, xOffset: -8, duration: 5.1, delay: 0.5 },
          { left: 55, top: 15, xOffset: 3, duration: 3.8, delay: 1 },
          { left: 75, top: 80, xOffset: -5, duration: 4.7, delay: 1.5 },
          { left: 25, top: 45, xOffset: 7, duration: 4.5, delay: 2 },
          { left: 65, top: 30, xOffset: -3, duration: 3.9, delay: 2.5 },
          { left: 85, top: 70, xOffset: 4, duration: 4.8, delay: 3 },
          { left: 45, top: 85, xOffset: -6, duration: 4.3, delay: 3.5 },
          { left: 5, top: 40, xOffset: 2, duration: 3.6, delay: 4 },
          { left: 95, top: 20, xOffset: -4, duration: 4.9, delay: 4.5 },
          { left: 20, top: 75, xOffset: 6, duration: 4.1, delay: 5 },
          { left: 80, top: 50, xOffset: -2, duration: 3.7, delay: 5.5 },
          { left: 40, top: 10, xOffset: 8, duration: 4.6, delay: 6 },
          { left: 70, top: 90, xOffset: -7, duration: 4.4, delay: 6.5 },
          { left: 10, top: 65, xOffset: 1, duration: 3.5, delay: 7 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-60"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, particle.xOffset, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Join the Collective
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Be part of the future of autonomous AI agents and decentralized intelligence.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.button
            onClick={handleJoinAirdrop}
            className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl font-semibold text-lg transition-all duration-300 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">Join Airdrop</span>
            <motion.div
              className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>

          <motion.button
            onClick={handleBecomeFoundingAgent}
            className="group px-10 py-5 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-2xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="group-hover:text-purple-300 transition-colors">
              Become a Founding Agent
            </span>
          </motion.button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center space-x-6"
        >
          {[
            { name: "Discord", icon: "💬", color: "hover:text-purple-400", platform: "discord" },
            { name: "Twitter", icon: "🐦", color: "hover:text-blue-400", platform: "twitter" },
            { name: "GitHub", icon: "🐙", color: "hover:text-gray-400", platform: "github" },
            { name: "Email", icon: "📧", color: "hover:text-green-400", platform: "email" }
          ].map((social, index) => (
            <motion.button
              key={index}
              onClick={() => handleSocialClick(social.platform)}
              className={`p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 ${social.color} backdrop-blur-sm`}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{social.icon}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Cosmic portal effect */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative">
            <motion.div
              className="w-24 h-24 border-2 border-purple-500/50 rounded-full flex items-center justify-center backdrop-blur-sm"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <span className="text-3xl">🌀</span>
            </motion.div>
            
            {/* Portal rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border border-purple-500/30 rounded-full"
                animate={{
                  scale: [1, 1.5, 2],
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

export default CosmicCTA;
