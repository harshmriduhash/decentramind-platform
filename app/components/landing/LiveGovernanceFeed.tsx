'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GovernanceEvent {
  id: string;
  type: 'proposal_created' | 'vote_cast' | 'proposal_executed' | 'quorum_reached' | 'proposal_failed';
  title: string;
  description: string;
  proposer: string;
  timestamp: number;
  votesFor?: number;
  votesAgainst?: number;
  totalVotes?: number;
  quorum?: number;
  status?: 'active' | 'passed' | 'failed' | 'executed';
  category: 'treasury' | 'governance' | 'protocol' | 'community';
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  status: 'active' | 'passed' | 'failed' | 'executed';
  category: 'treasury' | 'governance' | 'protocol' | 'community';
  endTime: number;
  userVote?: 'for' | 'against' | null;
}

const LiveGovernanceFeed = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [events, setEvents] = useState<GovernanceEvent[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isVoting, setIsVoting] = useState(false);

  // Mock governance events
  useEffect(() => {
    const mockEvents: GovernanceEvent[] = [
      {
        id: 'event-001',
        type: 'proposal_created',
        title: 'New Proposal: Increase Agent Minting Fee',
        description: 'Proposal to increase minting fee from 5 DMT to 8 DMT',
        proposer: '0x123...abc',
        timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
        category: 'treasury',
      },
      {
        id: 'event-002',
        type: 'vote_cast',
        title: 'Vote Cast: Community Treasury Allocation',
        description: 'User 0x456...def voted FOR the proposal',
        proposer: '0x456...def',
        timestamp: Date.now() - 1000 * 60 * 10, // 10 minutes ago
        votesFor: 1250,
        votesAgainst: 320,
        totalVotes: 1570,
        category: 'treasury',
      },
      {
        id: 'event-003',
        type: 'quorum_reached',
        title: 'Quorum Reached: Protocol Upgrade v2.1',
        description: 'Proposal reached required quorum threshold',
        proposer: '0x789...ghi',
        timestamp: Date.now() - 1000 * 60 * 15, // 15 minutes ago
        votesFor: 1800,
        votesAgainst: 200,
        totalVotes: 2000,
        quorum: 1000,
        status: 'passed',
        category: 'protocol',
      },
      {
        id: 'event-004',
        type: 'proposal_executed',
        title: 'Proposal Executed: Governance Token Distribution',
        description: 'Proposal has been successfully executed on-chain',
        proposer: '0xabc...jkl',
        timestamp: Date.now() - 1000 * 60 * 20, // 20 minutes ago
        status: 'executed',
        category: 'governance',
      },
      {
        id: 'event-005',
        type: 'proposal_failed',
        title: 'Proposal Failed: Legal Assistant Agent',
        description: 'Proposal did not reach quorum threshold',
        proposer: '0xdef...mno',
        timestamp: Date.now() - 1000 * 60 * 25, // 25 minutes ago
        votesFor: 450,
        votesAgainst: 1200,
        totalVotes: 1650,
        quorum: 2000,
        status: 'failed',
        category: 'protocol',
      },
    ];

    setEvents(mockEvents);
  }, []);

  // Mock proposals data
  useEffect(() => {
    const mockProposals: Proposal[] = [
      {
        id: 'prop-001',
        title: 'Increase Agent Minting Fee',
        description: 'Proposal to increase the minting fee from 5 DMT to 8 DMT to fund ecosystem development.',
        proposer: '0x123...abc',
        votesFor: 1250,
        votesAgainst: 320,
        totalVotes: 1570,
        quorum: 1000,
        status: 'active',
        category: 'treasury',
        endTime: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days
        userVote: null,
      },
      {
        id: 'prop-002',
        title: 'New Agent Type: Legal Assistant',
        description: 'Introduce a new AI agent specialized in legal document analysis and compliance.',
        proposer: '0x456...def',
        votesFor: 890,
        votesAgainst: 150,
        totalVotes: 1040,
        quorum: 1000,
        status: 'active',
        category: 'protocol',
        endTime: Date.now() + 5 * 24 * 60 * 60 * 1000, // 5 days
        userVote: 'for',
      },
      {
        id: 'prop-003',
        title: 'Community Treasury Allocation',
        description: 'Allocate 10% of treasury to community grants and bounties.',
        proposer: '0x789...ghi',
        votesFor: 2100,
        votesAgainst: 400,
        totalVotes: 2500,
        quorum: 1000,
        status: 'passed',
        category: 'treasury',
        endTime: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        userVote: 'for',
      },
    ];

    setProposals(mockProposals);
  }, []);

  const getEventIcon = (type: GovernanceEvent['type']) => {
    switch (type) {
      case 'proposal_created': return '📝';
      case 'vote_cast': return '🗳️';
      case 'proposal_executed': return '✅';
      case 'quorum_reached': return '🎯';
      case 'proposal_failed': return '❌';
      default: return '📋';
    }
  };

  const getEventColor = (type: GovernanceEvent['type']) => {
    switch (type) {
      case 'proposal_created': return 'from-blue-500 to-cyan-500';
      case 'vote_cast': return 'from-purple-500 to-violet-500';
      case 'proposal_executed': return 'from-green-500 to-emerald-500';
      case 'quorum_reached': return 'from-yellow-500 to-orange-500';
      case 'proposal_failed': return 'from-red-500 to-pink-500';
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

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'active': return 'text-blue-400';
      case 'passed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      case 'executed': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const formatTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const diff = endTime - now;
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const castVote = async (proposalId: string, vote: 'for' | 'against') => {
    setIsVoting(true);
    // Mock voting logic
    setTimeout(() => {
      setProposals(prev => prev.map(p => 
        p.id === proposalId ? { ...p, userVote: vote } : p
      ));
      setIsVoting(false);
    }, 2000);
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
        <h3 className="text-xl font-bold text-white mb-2">Live Governance Feed</h3>
        <p className="text-sm text-gray-400">Real-time governance activity and voting</p>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 z-10 grid grid-cols-2 gap-2">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400">Active Proposals</div>
          <div className="text-lg font-bold text-blue-400">
            {proposals.filter(p => p.status === 'active').length}
          </div>
        </div>
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 border border-slate-700/50">
          <div className="text-xs text-gray-400">Total Votes</div>
          <div className="text-lg font-bold text-white">
            {proposals.reduce((sum, p) => sum + p.totalVotes, 0)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex">
        {/* Live Events Feed */}
        <div className="w-1/2 p-4 pt-16">
          <div className="h-full overflow-y-auto space-y-3">
            <h4 className="text-lg font-bold text-white mb-4">Live Activity</h4>
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getEventColor(event.type)} flex items-center justify-center text-lg flex-shrink-0`}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{event.title}</div>
                    <div className="text-xs text-gray-400 mt-1">{event.description}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-gray-500">{formatTimeAgo(event.timestamp)}</div>
                      {event.votesFor !== undefined && (
                        <div className="text-xs text-gray-400">
                          {event.votesFor} for, {event.votesAgainst} against
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Proposals Panel */}
        <div className="w-1/2 p-4 pt-16 border-l border-slate-700/50">
          <div className="h-full overflow-y-auto space-y-3">
            <h4 className="text-lg font-bold text-white mb-4">Active Proposals</h4>
            {proposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-colors cursor-pointer"
                onClick={() => setSelectedProposal(proposal)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center text-lg flex-shrink-0">
                    {getCategoryIcon(proposal.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white">{proposal.title}</div>
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">{proposal.description}</div>
                    
                    {/* Vote Progress */}
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Vote Progress</span>
                        <span className="text-white">{Math.round(getVotePercentage(proposal))}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${getVotePercentage(proposal)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Quorum</span>
                        <span className="text-white">{Math.round(getQuorumPercentage(proposal))}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(getQuorumPercentage(proposal), 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          proposal.status === 'active' ? 'bg-blue-500' :
                          proposal.status === 'passed' ? 'bg-green-500' :
                          proposal.status === 'failed' ? 'bg-red-500' : 'bg-purple-500'
                        }`} />
                        <span className={`text-xs ${getStatusColor(proposal.status)}`}>
                          {proposal.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {proposal.status === 'active' ? formatTimeRemaining(proposal.endTime) : 'Ended'}
                      </div>
                    </div>

                    {/* User Vote Indicator */}
                    {proposal.userVote && (
                      <div className="mt-2 flex items-center space-x-1">
                        <span className="text-xs text-gray-400">Your vote:</span>
                        <span className={`text-xs font-medium ${
                          proposal.userVote === 'for' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {proposal.userVote === 'for' ? 'FOR' : 'AGAINST'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Proposal Details Modal */}
      <AnimatePresence>
        {selectedProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedProposal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-2xl bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{selectedProposal.title}</h3>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Description */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Description</div>
                  <div className="text-sm text-white">{selectedProposal.description}</div>
                </div>

                {/* Proposer */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Proposer</div>
                  <div className="text-sm font-mono text-white">{selectedProposal.proposer}</div>
                </div>

                {/* Vote Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Votes For</div>
                    <div className="text-2xl font-bold text-green-400">{selectedProposal.votesFor}</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-2">Votes Against</div>
                    <div className="text-2xl font-bold text-red-400">{selectedProposal.votesAgainst}</div>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Vote Progress</span>
                      <span className="text-white">{Math.round(getVotePercentage(selectedProposal))}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${getVotePercentage(selectedProposal)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Quorum Progress</span>
                      <span className="text-white">{Math.round(getQuorumPercentage(selectedProposal))}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(getQuorumPercentage(selectedProposal), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Voting Section */}
                {selectedProposal.status === 'active' && (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-400">Cast Your Vote</div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => castVote(selectedProposal.id, 'for')}
                        disabled={isVoting || selectedProposal.userVote !== null}
                        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                          selectedProposal.userVote === 'for'
                            ? 'bg-green-600 text-white'
                            : isVoting || selectedProposal.userVote !== null
                            ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        {isVoting ? 'Voting...' : 'Vote For'}
                      </button>
                      <button
                        onClick={() => castVote(selectedProposal.id, 'against')}
                        disabled={isVoting || selectedProposal.userVote !== null}
                        className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                          selectedProposal.userVote === 'against'
                            ? 'bg-red-600 text-white'
                            : isVoting || selectedProposal.userVote !== null
                            ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {isVoting ? 'Voting...' : 'Vote Against'}
                      </button>
                    </div>
                    {selectedProposal.userVote && (
                      <div className="text-sm text-green-400 text-center">
                        ✓ You have already voted {selectedProposal.userVote.toUpperCase()}
                      </div>
                    )}
                  </div>
                )}

                {/* Status and Time */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      selectedProposal.status === 'active' ? 'bg-blue-500' :
                      selectedProposal.status === 'passed' ? 'bg-green-500' :
                      selectedProposal.status === 'failed' ? 'bg-red-500' : 'bg-purple-500'
                    }`} />
                    <span className={`text-sm ${getStatusColor(selectedProposal.status)}`}>
                      {selectedProposal.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedProposal.status === 'active' ? formatTimeRemaining(selectedProposal.endTime) : 'Ended'}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveGovernanceFeed;
