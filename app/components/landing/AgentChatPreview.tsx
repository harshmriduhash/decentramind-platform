'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
}

interface AgentPreview {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  sampleQuestions: string[];
  sampleResponses: string[];
}

const AgentChatPreview = () => {
  const [selectedAgent, setSelectedAgent] = useState<string>('cfo');
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const agents: AgentPreview[] = [
    {
      id: 'cfo',
      name: 'Autonomous CFO',
      icon: '🧠',
      color: 'from-purple-500 to-blue-500',
      description: 'Financial analysis and treasury management',
      sampleQuestions: [
        'What\'s our current cash flow projection?',
        'Should we invest in this new protocol?',
        'How can we optimize our tokenomics?',
        'What are the risks in our portfolio?',
      ],
      sampleResponses: [
        'Based on current market conditions and our treasury analysis, I project a 15% increase in cash flow over the next quarter. The key drivers are our staking rewards and the new DeFi partnerships we\'ve established.',
        'After analyzing the protocol\'s tokenomics, team, and market position, I recommend a cautious approach. The APY looks attractive at 12%, but the smart contract risk is moderate. I suggest starting with 5% of our treasury.',
        'Our tokenomics can be optimized by implementing a deflationary mechanism through buybacks, reducing the circulating supply by 2% monthly. This would increase scarcity and potentially boost token value by 20-30%.',
        'The main risks I\'ve identified are: 1) Smart contract vulnerabilities (15% probability), 2) Market volatility (25% probability), 3) Regulatory changes (10% probability). I recommend diversifying across 5 different protocols to mitigate these risks.',
      ],
    },
    {
      id: 'care',
      name: 'Care Orchestrator',
      icon: '❤️',
      color: 'from-red-500 to-pink-500',
      description: 'Healthcare coordination and patient management',
      sampleQuestions: [
        'How is patient John\'s recovery progressing?',
        'What medications need to be reviewed?',
        'Schedule a follow-up appointment',
        'Any alerts for today?',
      ],
      sampleResponses: [
        'John\'s recovery is progressing well. His vital signs are stable, and he\'s showing 85% improvement in mobility. His next physical therapy session is scheduled for tomorrow at 2 PM. I recommend continuing the current treatment plan.',
        'I\'ve identified 3 medications that need review: Metformin (dosage adjustment needed), Lisinopril (refill required), and the new prescription for physical therapy supplements. All are HIPAA-compliant and ready for your review.',
        'I\'ve scheduled a follow-up appointment for John on Friday at 10 AM with Dr. Smith. The appointment has been confirmed, and I\'ve sent reminders to both the patient and the doctor. The appointment will focus on reviewing his progress and adjusting his treatment plan.',
        'Today\'s alerts: 1) Patient Sarah has a medication reminder at 9 AM, 2) John\'s lab results are ready for review, 3) Dr. Johnson has 2 pending consultations, 4) The weekly health report is due by 5 PM. All alerts are prioritized by urgency.',
      ],
    },
    {
      id: 'crypto',
      name: 'Crypto Alpha Assistant',
      icon: '📈',
      color: 'from-green-500 to-emerald-500',
      description: 'Cryptocurrency analysis and DeFi strategies',
      sampleQuestions: [
        'What\'s the alpha on this new protocol?',
        'Should we vote on this DAO proposal?',
        'What are the best DeFi opportunities?',
        'Analyze this token\'s fundamentals',
      ],
      sampleResponses: [
        'This new protocol shows strong fundamentals: 1) Experienced team with previous DeFi success, 2) Innovative yield farming mechanism with 15% APY, 3) Strong community with 50K+ members, 4) Audited smart contracts. Risk level: Medium. Recommendation: Start with 2% of portfolio.',
        'After analyzing the DAO proposal, I recommend voting YES. The proposal aims to increase the treasury allocation for development by 20%, which aligns with our long-term growth strategy. The voting power analysis shows 65% support, and the proposal has strong community backing.',
        'Top DeFi opportunities this week: 1) New lending protocol offering 18% APY on stablecoins, 2) Yield farming pool with 25% returns (high risk), 3) Liquidity provision for new DEX with 12% fees. I recommend diversifying across these opportunities with proper risk management.',
        'Token analysis: Market cap $50M, fully diluted valuation $200M. Strong fundamentals: 1) Active development team, 2) Growing user base (+30% monthly), 3) Strong tokenomics with deflationary mechanism, 4) Multiple exchange listings. Technical analysis shows bullish trend with RSI at 65. Recommendation: BUY with 5% position size.',
      ],
    },
  ];

  const handleQuestionClick = (question: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: question,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const agent = agents.find(a => a.id === selectedAgent);
      const response = agent?.sampleResponses[Math.floor(Math.random() * agent.sampleResponses.length)] || 'I\'m processing your request...';
      
      const agentMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        message: response,
        timestamp: new Date(),
      };

      setChatMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            Agent Chat Preview
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto"
          >
            Experience how each AI agent responds to your questions
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-6">Select an Agent</h3>
            {agents.map((agent) => (
              <motion.button
                key={agent.id}
                onClick={() => {
                  setSelectedAgent(agent.id);
                  setExpandedAgent(expandedAgent === agent.id ? null : agent.id);
                }}
                className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                  selectedAgent === agent.id
                    ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50'
                    : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-slate-600/50 hover:border-slate-500/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center mr-4`}>
                    <span className="text-xl">{agent.icon}</span>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{agent.name}</div>
                    <div className="text-sm text-gray-400">{agent.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50 h-96 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agents.find(a => a.id === selectedAgent)?.color} flex items-center justify-center mr-3`}>
                    <span className="text-sm">{agents.find(a => a.id === selectedAgent)?.icon}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{agents.find(a => a.id === selectedAgent)?.name}</div>
                    <div className="text-xs text-gray-400">Online</div>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Clear Chat
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-8">
                    <div className="text-4xl mb-4">💬</div>
                    <div>Start a conversation by selecting a question below</div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white'
                            : 'bg-gradient-to-br from-slate-700 to-slate-800 text-white'
                        }`}>
                          <div className="text-sm">{message.message}</div>
                          <div className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-purple-200' : 'text-gray-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sample Questions */}
              <div className="p-4 border-t border-slate-700/50">
                <div className="text-sm text-gray-400 mb-3">Sample Questions:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {agents.find(a => a.id === selectedAgent)?.sampleQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleQuestionClick(question)}
                      className="p-2 text-left text-sm bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors text-gray-300 hover:text-white"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentChatPreview;


