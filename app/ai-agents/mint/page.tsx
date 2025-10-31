'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MintAgentPage() {
  const router = useRouter();
  const [isMinting, setIsMinting] = useState(false);

  const handleMintAgent = async () => {
    setIsMinting(true);
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      router.push('/ai-agents/management');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">🤖</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Mint Your AI Agent
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create a unique AI agent with custom capabilities and personality
          </p>
        </div>

        {/* Agent Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: "🧠",
              name: "Autonomous CFO",
              description: "Financial analysis, treasury management, and governance integration",
              price: "5 DMT",
              features: ["Treasury Forecasting", "Token Modeling", "Governance Analysis"]
            },
            {
              icon: "❤️",
              name: "Care Orchestrator",
              description: "Healthcare coordination, provider dashboards, and HIPAA compliance",
              price: "8 DMT",
              features: ["Health Monitoring", "Provider Coordination", "HIPAA Compliance"]
            },
            {
              icon: "📈",
              name: "Crypto Alpha Assistant",
              description: "Protocol evaluation, alpha tracking, and DAO proposal submission",
              price: "6 DMT",
              features: ["Alpha Tracking", "Protocol Analysis", "DAO Proposals"]
            }
          ].map((agent, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2"
            >
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {agent.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">
                {agent.name}
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors">
                {agent.description}
              </p>
              <div className="mb-6">
                <div className="text-3xl font-bold text-purple-400 mb-2">{agent.price}</div>
                <ul className="space-y-2">
                  {agent.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-400">
                      <span className="text-green-400 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handleMintAgent}
                disabled={isMinting}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                {isMinting ? "Minting..." : `Mint ${agent.name}`}
              </button>
            </div>
          ))}
        </div>

        {/* Custom Agent Option */}
        <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl border border-slate-700/50 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Custom Agent
            </h2>
            <p className="text-gray-300">
              Create a completely custom AI agent with your own specifications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Agent Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Agent Name</label>
                  <input
                    type="text"
                    placeholder="Enter agent name"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Domain</label>
                  <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none">
                    <option value="">Select domain</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="education">Education</option>
                    <option value="creative">Creative</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Personality</label>
                  <select className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:border-purple-500 focus:outline-none">
                    <option value="">Select personality</option>
                    <option value="analytical">Analytical</option>
                    <option value="creative">Creative</option>
                    <option value="supportive">Supportive</option>
                    <option value="direct">Direct</option>
                    <option value="collaborative">Collaborative</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">Pricing</h3>
              <div className="bg-slate-700/30 rounded-lg p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">10 DMT</div>
                  <div className="text-gray-400 mb-4">Custom Agent Creation</div>
                  <div className="text-sm text-gray-300 space-y-2">
                    <div className="flex justify-between">
                      <span>Base Agent</span>
                      <span>5 DMT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custom Domain</span>
                      <span>3 DMT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Custom Personality</span>
                      <span>2 DMT</span>
                    </div>
                    <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>10 DMT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={handleMintAgent}
              disabled={isMinting}
              className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              {isMinting ? "Creating Custom Agent..." : "Create Custom Agent"}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-xl font-semibold transition-all duration-300"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}