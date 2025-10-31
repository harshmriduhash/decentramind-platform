'use client';

import React from 'react';
import { motion } from 'framer-motion';
import StarfieldBackground from './StarfieldBackground';
import HeroSection from './HeroSection';
import AgentCardsSection from './AgentCardsSection';
import ModularStackSection from './ModularStackSection';
import TokenomicsSection from './TokenomicsSection';
import CosmicCTA from './CosmicCTA';
import LoreSection from './LoreSection';
import Footer from './Footer';

// New modular components
import EcosystemMap from './EcosystemMap';
import EvolutionTracker from './EvolutionTracker';
import LoreChapters from './LoreChapters';
import LiveStats from './LiveStats';
import AgentChatPreview from './AgentChatPreview';
import OnboardingModal from './OnboardingModal';
import TokenDetail from './TokenDetail';
import MobileFloatingMenu from './MobileFloatingMenu';
import MvpTourModal from './MvpTourModal';
import DecentralizedFeaturesShowcase from './DecentralizedFeaturesShowcase';
import WalletStatus from '../WalletStatus';

const LandingWorld = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Starfield Background */}
      <StarfieldBackground />
      
      {/* Navigation Header */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img 
                src="/logo.svg" 
                alt="DecentraMind Labs Logo" 
                className="w-20 h-12 mr-3"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                DecentraMind Labs
              </span>
            </motion.div>
            
            <motion.div
              className="hidden md:flex items-center space-x-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {[
                { name: "Dashboard", href: "/dashboard" },
                { name: "AI Console", href: "/ai-console" },
                { name: "Agent Workflows", href: "/workflows" },
                { name: "Agent Management", href: "/agents" },
                { name: "Governance", href: "/governance" },
              ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
              
              <WalletStatus />
              
              <motion.a
                href="/ai-agents/mint"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.a>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Live Stats Section */}
        <LiveStats />
        
        {/* Ecosystem Map Section */}
        <EcosystemMap />
        
        {/* Decentralized Features Showcase */}
        <section id="decentralized-features">
          <DecentralizedFeaturesShowcase />
        </section>
        
        {/* Agent Cards Section */}
        <section id="agent-cards">
          <AgentCardsSection />
        </section>
        
        {/* Evolution Tracker Section */}
        <section id="evolution-tracker">
          <EvolutionTracker />
        </section>
        
        {/* Agent Chat Preview Section */}
        <section id="agent-chat">
          <AgentChatPreview />
        </section>
        
        {/* Modular Stack Section */}
        <section id="modular-stack">
          <ModularStackSection />
        </section>
        
        {/* Tokenomics Section with Clickable Tokens */}
        <section id="tokenomics-section" className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
              >
                Ecosystem Tokens
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
              >
                Click on the orbiting tokens to explore detailed tokenomics and DAO stats
              </motion.p>
            </div>
            <TokenDetail />
          </div>
        </section>
        
        {/* Lore Chapters Section */}
        <section id="lore-section">
          <LoreChapters />
        </section>
        
        {/* Original Lore Section */}
        <LoreSection />
        
        {/* Cosmic CTA Section */}
        <section id="governance-section">
          <CosmicCTA />
        </section>
      </main>

      {/* Floating Components */}
      <OnboardingModal />
      <MobileFloatingMenu />
      <MvpTourModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingWorld;
