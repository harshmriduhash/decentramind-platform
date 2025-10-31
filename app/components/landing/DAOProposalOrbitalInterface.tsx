'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  status: 'active' | 'passed' | 'failed' | 'executed';
  category: 'treasury' | 'governance' | 'protocol' | 'community';
  endTime: number;
  quorum: number;
  angle: number;
  radius: number;
}

const DAOProposalOrbitalInterface = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [hoveredProposal, setHoveredProposal] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{ [key: string]: string }>({});

  // Mock proposals data
  const [proposals] = useState<Proposal[]>([
    {
      id: 'prop-001',
      title: 'Increase Agent Minting Fee',
      description: 'Proposal to increase the minting fee from 5 DMT to 8 DMT to fund ecosystem development.',
      proposer: '0x123...abc',
      votesFor: 1250,
      votesAgainst: 320,
      totalVotes: 1570,
      status: 'active',
      category: 'treasury',
      endTime: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days
      quorum: 1000,
      angle: 0,
      radius: 120,
    },
    {
      id: 'prop-002',
      title: 'New Agent Type: Legal Assistant',
      description: 'Introduce a new AI agent specialized in legal document analysis and compliance.',
      proposer: '0x456...def',
      votesFor: 890,
      votesAgainst: 150,
      totalVotes: 1040,
      status: 'active',
      category: 'protocol',
      endTime: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days
      quorum: 1000,
      angle: 72,
      radius: 120,
    },
    {
      id: 'prop-003',
      title: 'Community Treasury Allocation',
      description: 'Allocate 10% of treasury to community grants and bounties.',
      proposer: '0x789...ghi',
      votesFor: 2100,
      votesAgainst: 400,
      totalVotes: 2500,
      status: 'passed',
      category: 'treasury',
      endTime: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
      quorum: 1000,
      angle: 144,
      radius: 120,
    },
    {
      id: 'prop-004',
      title: 'Governance Token Distribution',
      description: 'Redistribute governance tokens to active community members.',
      proposer: '0xabc...jkl',
      votesFor: 450,
      votesAgainst: 1200,
      totalVotes: 1650,
      status: 'failed',
      category: 'governance',
      endTime: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
      quorum: 1000,
      angle: 216,
      radius: 120,
    },
    {
      id: 'prop-005',
      title: 'Protocol Upgrade v2.1',
      description: 'Implement new features including cross-chain compatibility.',
      proposer: '0xdef...mno',
      votesFor: 1800,
      votesAgainst: 200,
      totalVotes: 2000,
      status: 'executed',
      category: 'protocol',
      endTime: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
      quorum: 1000,
      angle: 288,
      radius: 120,
    },
  ]);

  // Update time remaining
  useEffect(() => {
    const updateTime = () => {
      const newTimeRemaining: { [key: string]: string } = {};
      proposals.forEach(proposal => {
        if (proposal.status === 'active') {
          const remaining = proposal.endTime - Date.now();
          if (remaining > 0) {
            const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
            const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            newTimeRemaining[proposal.id] = `${days}d ${hours}h`;
          } else {
            newTimeRemaining[proposal.id] = 'Ended';
          }
        }
      });
      setTimeRemaining(newTimeRemaining);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [proposals]);

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'active': return 'from-blue-500 to-cyan-500';
      case 'passed': return 'from-green-500 to-emerald-500';
      case 'failed': return 'from-red-500 to-pink-500';
      case 'executed': return 'from-purple-500 to-violet-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: Proposal['category']) => {
    switch (category) {
      case 'treasury': return '💰';
      case 'governance': return '🏛️';
      case 'protocol': return '⚙️';
      case 'community': return '👥';
      default: return '📋';
    }
  };

  const getVotePercentage = (proposal: Proposal) => {
    return proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0;
  };

  const getQuorumPercentage = (proposal: Proposal) => {
    return (proposal.totalVotes / proposal.quorum) * 100;
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-900/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xl font-bold text-white mb-2">DAO Proposal Orbital Interface</h3>
        <p className="text-sm text-gray-400">Active governance proposals orbiting the DAO core</p>
      </div>

      {/* Central DAO Core */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <span className="text-2xl">🏛️</span>
        </motion.div>
        
        {/* DAO Stats */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-sm text-gray-400">Active Proposals</div>
          <div className="text-lg font-bold text-white">
            {proposals.filter(p => p.status === 'active').length}
          </div>
        </div>
      </div>

      {/* Orbital Proposals */}
      {proposals.map((proposal, index) => {
        const x = 50 + Math.cos((proposal.angle * Math.PI) / 180) * (proposal.radius / 2);
        const y = 50 + Math.sin((proposal.angle * Math.PI) / 180) * (proposal.radius / 2);

        return (
          <motion.div
            key={proposal.id}
            className="absolute cursor-pointer"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedProposal(proposal)}
            onMouseEnter={() => setHoveredProposal(proposal.id)}
            onMouseLeave={() => setHoveredProposal(null)}
          >
            {/* Proposal Node */}
            <div className={`relative w-20 h-20 rounded-full bg-gradient-to-r ${getStatusColor(proposal.status)} p-1 shadow-lg`}>
              {/* Category Icon */}
              <div className="w-full h-full rounded-full bg-slate-800/80 flex items-center justify-center text-xl">
                {getCategoryIcon(proposal.category)}
              </div>

              {/* Vote Progress Ring */}
              <svg className="absolute inset-0 w-20 h-20 -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-slate-700"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${(getVotePercentage(proposal) / 100) * 201} 201`}
                  className="text-white transition-all duration-1000"
                />
              </svg>

              {/* Quorum Indicator */}
              <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                getQuorumPercentage(proposal) >= 100 ? 'bg-green-500' : 'bg-yellow-500'
              }`}>
                {Math.min(Math.round(getQuorumPercentage(proposal)), 100)}%
              </div>
            </div>

            {/* Proposal Label */}
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 text-center max-w-32">
              <div className="text-xs font-medium text-white bg-slate-800/80 px-2 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis">
                {proposal.title}
              </div>
              {proposal.status === 'active' && timeRemaining[proposal.id] && (
                <div className="text-xs text-blue-400 mt-1">
                  {timeRemaining[proposal.id]}
                </div>
              )}
            </div>

            {/* Connection Line to Center */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.line
                x1="50%"
                y1="50%"
                x2={`${x}%`}
                y2={`${y}%`}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.3"
                className="text-slate-600"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              />
            </svg>
          </motion.div>
        );
      })}

      {/* Orbital Motion */}
      {proposals.map((proposal, index) => {
        const x = 50 + Math.cos((proposal.angle * Math.PI) / 180) * (proposal.radius / 2);
        const y = 50 + Math.sin((proposal.angle * Math.PI) / 180) * (proposal.radius / 2);

        return (
          <motion.div
            key={`orbit-${proposal.id}`}
            className="absolute w-2 h-2 bg-white rounded-full opacity-60"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 30 + index * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}

      {/* Proposal Details Panel */}
      <AnimatePresence>
        {selectedProposal && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 w-96 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 max-h-[500px] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white">{selectedProposal.title}</h4>
              <button
                onClick={() => setSelectedProposal(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Description */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400 mb-2">Description</div>
                <div className="text-sm text-white">{selectedProposal.description}</div>
              </div>

              {/* Proposer */}
              <div className="bg-slate-700/50 rounded-lg p-3">
                <div className="text-sm text-gray-400">Proposer</div>
                <div className="text-sm font-mono text-white">{selectedProposal.proposer}</div>
              </div>

              {/* Vote Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Votes For</div>
                  <div className="text-xl font-bold text-green-400">{selectedProposal.votesFor}</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Votes Against</div>
                  <div className="text-xl font-bold text-red-400">{selectedProposal.votesAgainst}</div>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Vote Progress</span>
                  <span className="text-white">{Math.round(getVotePercentage(selectedProposal))}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${getVotePercentage(selectedProposal)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quorum Progress</span>
                  <span className="text-white">{Math.round(getQuorumPercentage(selectedProposal))}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(getQuorumPercentage(selectedProposal), 100)}%` }}
                  />
                </div>
              </div>

              {/* Status and Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedProposal.status === 'active' ? 'bg-blue-500' :
                    selectedProposal.status === 'passed' ? 'bg-green-500' :
                    selectedProposal.status === 'failed' ? 'bg-red-500' : 'bg-purple-500'
                  }`} />
                  <span className="text-sm text-gray-300 capitalize">{selectedProposal.status}</span>
                </div>
                {selectedProposal.status === 'active' && timeRemaining[selectedProposal.id] && (
                  <div className="text-sm text-blue-400">
                    {timeRemaining[selectedProposal.id]}
                  </div>
                )}
              </div>

              {/* Vote Button */}
              {selectedProposal.status === 'active' && (
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Vote For
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                    Vote Against
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredProposal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-lg p-3 text-sm max-w-48"
            style={{
              left: '50%',
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            {(() => {
              const proposal = proposals.find(p => p.id === hoveredProposal);
              return proposal ? (
                <div>
                  <div className="font-medium text-white">{proposal.title}</div>
                  <div className="text-gray-400 mt-1">{proposal.votesFor} for, {proposal.votesAgainst} against</div>
                  <div className={`capitalize mt-1 ${
                    proposal.status === 'active' ? 'text-blue-400' :
                    proposal.status === 'passed' ? 'text-green-400' :
                    proposal.status === 'failed' ? 'text-red-400' : 'text-purple-400'
                  }`}>
                    {proposal.status}
                  </div>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DAOProposalOrbitalInterface;
