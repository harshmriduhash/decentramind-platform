'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();

  const handleMintAgent = () => {
    // Navigate to agent minting page
    router.push('/ai-agents/mint');
  };

  const handleLaunchDemo = () => {
    // Navigate to dashboard for MVP demo
    router.push('/dashboard');
  };

  const handleJoinAirdrop = () => {
    // Navigate to governance for airdrop participation
    router.push('/governance');
  };

  const handleBecomeFoundingAgent = () => {
    // Navigate to agent management
    router.push('/ai-agents/management');
  };

  const handleSocialClick = (platform: string) => {
    // Handle social media clicks
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                DecentraMind Labs
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </button>
              <button 
                onClick={() => router.push('/ai-agents/management')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Agents
              </button>
              <button 
                onClick={() => router.push('/care/insights')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Health Portal
              </button>
              <button 
                onClick={() => router.push('/governance')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Governance
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/ai-agents/mint')}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium transition-all duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* SECTION 1: Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-8">
              <span className="text-sm font-medium text-purple-300">🚀 Now Live on Devnet</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            DecentraMind Labs
          </h1>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 text-purple-200">
            The Living Ecosystem of Autonomous AI Agents
          </h2>

          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Empowering users through tokenized intelligence, decentralized governance, and self-evolving agents.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleMintAgent}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              Mint Your Agent
            </button>
            <button 
              onClick={handleLaunchDemo}
              className="px-8 py-4 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Launch MVP Demo
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: The Problem */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            The Problem
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            AI systems are fragmented. Token ecosystems are underutilized. Web3 platforms struggle with onboarding, coordination, and intelligent growth.
          </p>
        </div>
      </section>

      {/* SECTION 3: The Solution */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              A Modular, Intelligent Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "Autonomous CFO",
                description: "Treasury, forecasting, governance integration, and token modeling."
              },
              {
                icon: "❤️",
                title: "Care Orchestrator",
                description: "Coordinates healthcare flows, provider dashboards, and HIPAA-compliant data access."
              },
              {
                icon: "📈",
                title: "Crypto Alpha Assistant",
                description: "Tracks alpha, evaluates protocols, and submits DAO voting proposals."
              }
            ].map((card, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: The Tech Stack */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              One Protocol. Infinite Intelligence.
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Powered by wallet signatures, RAG pipelines, and an AI-native architecture.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Soulbound NFTs",
              "XP System",
              "DAO Governance",
              "Agent Marketplace",
              "Task Engine",
              "Firebase + Solana",
              "Token-Gated Tools",
              "Wallet Integration"
            ].map((item, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-xl border border-slate-700/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-blue-400 text-xl">⚡</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {item}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Tokenomics Overview */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Ecosystem Tokens
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                symbol: "$DMT",
                name: "DecentraMind Token",
                description: "Utility token for agent usage, XP boosts, and services.",
                color: "from-purple-500 to-blue-500"
              },
              {
                symbol: "$DMTX",
                name: "DecentraMind Governance Token",
                description: "Governance token for DAO proposals, voting, and revenue allocation.",
                color: "from-green-500 to-cyan-500"
              }
            ].map((token, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${token.color} rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl font-bold text-white">{token.symbol}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {token.name}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {token.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Join the Collective */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Join the Collective
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-12 leading-relaxed">
            Be part of the future of autonomous AI agents and decentralized intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button 
              onClick={handleJoinAirdrop}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              Join Airdrop
            </button>
            <button 
              onClick={handleBecomeFoundingAgent}
              className="px-8 py-4 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Become a Founding Agent
            </button>
          </div>

          <div className="flex justify-center space-x-6">
            {[
              { name: "Discord", icon: "💬", color: "hover:text-purple-400", platform: "discord" },
              { name: "Twitter", icon: "🐦", color: "hover:text-blue-400", platform: "twitter" },
              { name: "GitHub", icon: "🐙", color: "hover:text-gray-400", platform: "github" },
              { name: "Email", icon: "📧", color: "hover:text-green-400", platform: "email" }
            ].map((social, index) => (
              <button
                key={index}
                onClick={() => handleSocialClick(social.platform)}
                className={`p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 ${social.color}`}
              >
                <span className="text-2xl">{social.icon}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
              <span className="text-white font-bold text-xl">DM</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              DecentraMind Labs
            </span>
          </div>
          <p className="text-gray-400 mb-6">
            Building the future of autonomous AI agents and decentralized intelligence.
          </p>
          <div className="text-sm text-gray-500">
            © 2024 DecentraMind Labs. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;