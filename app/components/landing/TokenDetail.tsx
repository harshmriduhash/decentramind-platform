'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  description: string;
  icon: string;
  color: string;
  stats: {
    totalSupply: string;
    circulatingSupply: string;
    marketCap: string;
    price: string;
    change24h: number;
    volume24h: string;
  };
  daoStats: {
    totalProposals: number;
    activeProposals: number;
    totalVotes: number;
    participationRate: number;
  };
  utility: string[];
  distribution: {
    category: string;
    percentage: number;
    amount: string;
  }[];
}

const TokenDetail = () => {
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tokens: TokenData[] = [
    {
      id: 'dmt',
      name: 'DecentraMind Token',
      symbol: 'DMT',
      description: 'Utility token for agent usage, XP boosts, and ecosystem services',
      icon: '💰',
      color: 'from-purple-500 to-blue-500',
      stats: {
        totalSupply: '100,000,000',
        circulatingSupply: '45,678,923',
        marketCap: '$2,283,946',
        price: '$0.05',
        change24h: 12.5,
        volume24h: '$156,789',
      },
      daoStats: {
        totalProposals: 47,
        activeProposals: 3,
        totalVotes: 1247,
        participationRate: 68.5,
      },
      utility: [
        'Agent minting and evolution',
        'XP boost purchases',
        'Premium feature access',
        'Governance participation',
        'Ecosystem rewards',
      ],
      distribution: [
        { category: 'Community Rewards', percentage: 40, amount: '40,000,000' },
        { category: 'Team & Advisors', percentage: 20, amount: '20,000,000' },
        { category: 'Ecosystem Development', percentage: 25, amount: '25,000,000' },
        { category: 'Liquidity & Reserves', percentage: 15, amount: '15,000,000' },
      ],
    },
    {
      id: 'dmtx',
      name: 'DecentraMind Governance Token',
      symbol: 'DMTX',
      description: 'Governance token for DAO proposals, voting, and revenue allocation',
      icon: '🏛️',
      color: 'from-green-500 to-emerald-500',
      stats: {
        totalSupply: '100,000,000',
        circulatingSupply: '23,456,789',
        marketCap: '$1,172,839',
        price: '$0.05',
        change24h: 8.3,
        volume24h: '$89,234',
      },
      daoStats: {
        totalProposals: 23,
        activeProposals: 2,
        totalVotes: 892,
        participationRate: 72.1,
      },
      utility: [
        'DAO governance voting',
        'Revenue sharing',
        'Protocol upgrades',
        'Treasury management',
        'Ecosystem decisions',
      ],
      distribution: [
        { category: 'Governance Rewards', percentage: 35, amount: '35,000,000' },
        { category: 'Community Treasury', percentage: 30, amount: '30,000,000' },
        { category: 'Development Fund', percentage: 20, amount: '20,000,000' },
        { category: 'Strategic Partners', percentage: 15, amount: '15,000,000' },
      ],
    },
  ];

  const handleTokenClick = (tokenId: string) => {
    setSelectedToken(tokenId);
    setIsModalOpen(true);
  };

  const selectedTokenData = tokens.find(token => token.id === selectedToken);

  return (
    <>
      {/* Token Orbits - Clickable */}
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
        </motion.div>

        {/* Token Orbits */}
        {tokens.map((token, index) => (
          <motion.div
            key={token.id}
            className="absolute border border-dashed border-gray-600 rounded-full cursor-pointer"
            style={{
              width: (120 + index * 60) * 2,
              height: (120 + index * 60) * 2,
              marginLeft: -(120 + index * 60),
              marginTop: -(120 + index * 60),
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 15 + index * 5, repeat: Infinity, ease: "linear" }}
            onClick={() => handleTokenClick(token.id)}
          >
            {/* Token Planet */}
            <motion.div
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-${(20 + index * 5) / 4} h-${(20 + index * 5) / 4} rounded-full bg-gradient-to-r ${token.color} shadow-lg flex items-center justify-center cursor-pointer`}
              style={{ width: 20 + index * 5, height: 20 + index * 5 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-xs font-bold text-white">{token.symbol}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Token Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedTokenData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-slate-700/50 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedTokenData.color} flex items-center justify-center mr-6`}>
                    <span className="text-2xl">{selectedTokenData.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedTokenData.name}</h2>
                    <p className="text-gray-400">{selectedTokenData.symbol}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-300 leading-relaxed">{selectedTokenData.description}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/50">
                  <div className="text-2xl font-bold text-white mb-2">{selectedTokenData.stats.price}</div>
                  <div className="text-sm text-gray-400 mb-1">Current Price</div>
                  <div className={`text-sm ${selectedTokenData.stats.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedTokenData.stats.change24h > 0 ? '+' : ''}{selectedTokenData.stats.change24h}% (24h)
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/50">
                  <div className="text-2xl font-bold text-white mb-2">{selectedTokenData.stats.marketCap}</div>
                  <div className="text-sm text-gray-400">Market Cap</div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/50">
                  <div className="text-2xl font-bold text-white mb-2">{selectedTokenData.stats.volume24h}</div>
                  <div className="text-sm text-gray-400">24h Volume</div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/50">
                  <div className="text-2xl font-bold text-white mb-2">{selectedTokenData.stats.totalSupply}</div>
                  <div className="text-sm text-gray-400">Total Supply</div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/50">
                  <div className="text-2xl font-bold text-white mb-2">{selectedTokenData.stats.circulatingSupply}</div>
                  <div className="text-sm text-gray-400">Circulating Supply</div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-6 border border-slate-600/50">
                  <div className="text-2xl font-bold text-white mb-2">{selectedTokenData.daoStats.participationRate}%</div>
                  <div className="text-sm text-gray-400">DAO Participation</div>
                </div>
              </div>

              {/* DAO Stats */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-6">DAO Governance Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{selectedTokenData.daoStats.totalProposals}</div>
                    <div className="text-sm text-gray-400">Total Proposals</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{selectedTokenData.daoStats.activeProposals}</div>
                    <div className="text-sm text-gray-400">Active Proposals</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{selectedTokenData.daoStats.totalVotes}</div>
                    <div className="text-sm text-gray-400">Total Votes</div>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{selectedTokenData.daoStats.participationRate}%</div>
                    <div className="text-sm text-gray-400">Participation Rate</div>
                  </div>
                </div>
              </div>

              {/* Utility & Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Utility */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Token Utility</h3>
                  <div className="space-y-3">
                    {selectedTokenData.utility.map((use, index) => (
                      <div key={index} className="flex items-center p-3 bg-slate-700/30 rounded-lg">
                        <span className="text-green-400 mr-3">✓</span>
                        <span className="text-gray-300">{use}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribution */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Token Distribution</h3>
                  <div className="space-y-3">
                    {selectedTokenData.distribution.map((dist, index) => (
                      <div key={index} className="p-3 bg-slate-700/30 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-300 font-medium">{dist.category}</span>
                          <span className="text-white font-bold">{dist.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${dist.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                        <div className="text-sm text-gray-400 mt-1">{dist.amount} tokens</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TokenDetail;


