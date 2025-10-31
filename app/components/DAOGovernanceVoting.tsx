"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import {
  HowToVote as VoteIcon,
  Add as AddIcon,
  AccountBalance as TreasuryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as AbstainIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Wallet as WalletIcon,
  BarChart as ChartIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Send as SendIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import agentService from '../services/agentService';
import daoService, { Proposal, Vote } from '../services/daoService';
import dmtTokenService, { WalletInfo } from '../services/dmtTokenService';
import delegationService, { Delegation } from '../services/delegationService';

interface VotingPower {
  total: number;
  delegated: number;
  available: number;
}

interface LocalProposal {
  id?: string;
  title: string;
  description: string;
  proposer: string;
  proposerAvatar?: string;
  status: 'active' | 'passed' | 'rejected' | 'executed';
  deadline: any;
  category: 'treasury' | 'governance' | 'technical' | 'community';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  totalVotes: number;
  quorum: number;
  createdAt: any;
}

interface LocalVote {
  id?: string;
  proposalId: string;
  voterAddress: string;
  vote: 'for' | 'against' | 'abstain';
  votingPower: number;
  timestamp: any;
}

interface LocalDelegation {
  id?: string;
  delegatorAddress: string;
  delegateAddress: string;
  amount: number;
  createdAt: any;
  isActive: boolean;
}

interface LocalWalletInfo {
  address: string;
  dmtBalance: number;
  stakedDMT: number;
  totalVotingPower: number;
  availableVotingPower: number;
  isConnected: boolean;
}

// Sample proposals for testing
const sampleProposals: Proposal[] = [
  {
    id: '1',
    title: 'Treasury Allocation for Development',
    description: 'Proposal to allocate 500,000 DMT from treasury for core development team expansion and infrastructure improvements.',
    status: 'active',
    createdBy: '0x1234...5678',
    category: 'treasury',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) as any,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) as any,
    votes: { for: 1250, against: 320, abstain: 45, total: 1615 },
    quorum: 1000,
  },
  {
    id: '2',
    title: 'Community Grant Program',
    description: 'Establish a 1M DMT community grant program to fund innovative projects and community initiatives.',
    status: 'passed',
    createdBy: '0x4567...8901',
    category: 'community',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) as any,
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) as any,
    votes: { for: 2100, against: 400, abstain: 100, total: 2600 },
    quorum: 1000,
  },
  {
    id: '3',
    title: 'Cross-Chain Bridge Protocol',
    description: 'Technical proposal to integrate Solana-Ethereum bridge for seamless token transfers and enhanced interoperability.',
    status: 'rejected',
    createdBy: '0x9876...5432',
    category: 'tech',
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) as any,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) as any,
    votes: { for: 800, against: 1200, abstain: 200, total: 2200 },
    quorum: 1000,
  },
  {
    id: '4',
    title: 'Staking Rewards Adjustment',
    description: 'Proposal to adjust staking rewards from 12% to 15% APY to incentivize long-term token holding.',
    status: 'active',
    createdBy: '0x2345...6789',
    category: 'governance',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) as any,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) as any,
    votes: { for: 890, against: 150, abstain: 25, total: 1065 },
    quorum: 1000,
  },
];

const DAOGovernanceVoting: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [votingPower, setVotingPower] = useState<VotingPower>({ total: 0, delegated: 0, available: 0 });
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, Vote>>({});
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  // Form state for creating proposals
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'governance' as const,
    duration: 7,
  });

  // Form state for delegation
  const [delegationForm, setDelegationForm] = useState({
    delegateAddress: '',
    amount: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // For testing, use sample proposals
        setTimeout(() => {
          setProposals(sampleProposals);
          setLoading(false);
        }, 1000);

        // Load user votes for each proposal
        if (walletInfo?.address) {
          const votes: Record<string, Vote> = {};
          for (const proposal of sampleProposals) {
            if (proposal.id) {
              const userVote = await daoService.getUserVote(proposal.id, walletInfo.address);
              if (userVote) {
                votes[proposal.id] = userVote;
              }
            }
          }
          setUserVotes(votes);
        }

        // Load delegations
        if (walletInfo?.address) {
          const userDelegations = await delegationService.getDelegations(walletInfo.address);
          setDelegations(userDelegations);
        }

        // Update voting power
        if (walletInfo) {
          setVotingPower({
            total: walletInfo.votingPower,
            delegated: await delegationService.getDelegatedByWallet(walletInfo.address),
            available: walletInfo.votingPower - (await delegationService.getDelegatedByWallet(walletInfo.address)),
          });
        }
        
      } catch (error) {
        console.error('Failed to load governance data:', error);
        setSnackbar({ open: true, message: 'Failed to load governance data', severity: 'error' });
        setLoading(false);
      }
    };

    loadData();
  }, [walletInfo?.address]);

  const handleConnectWallet = async () => {
    try {
      const wallet = await dmtTokenService.connectWallet();
      setWalletInfo(wallet);
      setSnackbar({ open: true, message: 'Wallet connected successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to connect wallet', severity: 'error' });
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await dmtTokenService.disconnectWallet();
      setWalletInfo(null);
      setSnackbar({ open: true, message: 'Wallet disconnected', severity: 'info' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to disconnect wallet', severity: 'error' });
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
    if (!walletInfo) {
      setSnackbar({ open: true, message: 'Please connect your wallet first', severity: 'warning' });
      return;
    }

    // Check DMT balance for voting (minimum 100 DMT)
    if (!dmtTokenService.hasMinimumBalanceForVoting(100)) {
      setSnackbar({ 
        open: true, 
        message: 'Insufficient DMT balance. Minimum 100 DMT required for voting.', 
        severity: 'error' 
      });
      return;
    }

    try {
      const votingPower = walletInfo.votingPower;
      
      // Cast vote in Firebase
      await daoService.castVote(proposalId, vote, walletInfo.address, votingPower);
      
      // Update local user votes
      const newVote: Vote = {
        proposalId,
        walletAddress: walletInfo.address,
        type: vote,
        votingPower,
        timestamp: new Date() as any, // Firebase Timestamp
      };
      
      setUserVotes(prev => ({
        ...prev,
        [proposalId]: newVote
      }));

      // Award XP for voting participation
      try {
        await agentService.addXP('agent-cfo', 25, 'governance_vote');
      } catch (error) {
        console.warn('Failed to award XP:', error);
      }

      setSnackbar({ 
        open: true, 
        message: `Vote cast successfully with ${votingPower} voting power! +25 XP earned`, 
        severity: 'success' 
      });
      setShowVoteModal(false);
      
    } catch (error) {
      console.error('Voting error:', error);
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Failed to cast vote', 
        severity: 'error' 
      });
    }
  };

  const handleCreateProposal = async () => {
    if (!walletInfo) {
      setSnackbar({ open: true, message: 'Please connect your wallet first', severity: 'warning' });
      return;
    }

    // Check DMT balance for proposal creation (minimum 100 DMT)
    if (!dmtTokenService.hasMinimumBalanceForProposal(100)) {
      setSnackbar({ 
        open: true, 
        message: 'Insufficient DMT balance. Minimum 100 DMT required for proposal creation.', 
        severity: 'error' 
      });
      return;
    }

    try {
      const deadline = new Date(Date.now() + newProposal.duration * 24 * 60 * 60 * 1000);
      
      // Create proposal in Firebase
      const proposalId = await daoService.submitProposal({
        title: newProposal.title,
        description: newProposal.description,
        status: 'active',
        createdBy: walletInfo.address,
        category: newProposal.category,
        deadline: deadline as any, // Firebase Timestamp
      }, walletInfo.address);
      
      // Award XP for creating proposal
      try {
        await agentService.addXP('agent-cfo', 50, 'proposal_creation');
      } catch (error) {
        console.warn('Failed to award XP:', error);
      }

      setSnackbar({ 
        open: true, 
        message: `Proposal created successfully! +50 XP earned`, 
        severity: 'success' 
      });
      
      setShowCreateModal(false);
      setNewProposal({ title: '', description: '', category: 'governance', duration: 7 });
      
    } catch (error) {
      console.error('Proposal creation error:', error);
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Failed to create proposal', 
        severity: 'error' 
      });
    }
  };

  const handleCreateDelegation = async () => {
    if (!walletInfo) {
      setSnackbar({ open: true, message: 'Please connect your wallet first', severity: 'warning' });
      return;
    }

    if (delegationForm.amount > walletInfo.votingPower) {
      setSnackbar({ 
        open: true, 
        message: 'Insufficient voting power for delegation', 
        severity: 'error' 
      });
      return;
    }

    try {
      await delegationService.delegatePower(
        walletInfo.address,
        delegationForm.delegateAddress,
        delegationForm.amount
      );

      // Award XP for delegation
      try {
        await agentService.addXP('agent-cfo', 30, 'delegation');
      } catch (error) {
        console.warn('Failed to award XP:', error);
      }

      setSnackbar({ 
        open: true, 
        message: `Delegation created successfully! +30 XP earned`, 
        severity: 'success' 
      });
      
      setShowDelegationModal(false);
      setDelegationForm({ delegateAddress: '', amount: 0 });
      
    } catch (error) {
      console.error('Delegation error:', error);
      setSnackbar({ 
        open: true, 
        message: error instanceof Error ? error.message : 'Failed to create delegation', 
        severity: 'error' 
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      active: '#2ed573',
      passed: '#4caf50',
      rejected: '#f44336',
      executed: '#2196f3',
    };
    return colorMap[status] || '#757575';
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType> = {
      treasury: TreasuryIcon,
      governance: VoteIcon,
      technical: ChartIcon,
      community: PersonIcon,
    };
    return iconMap[category] || VoteIcon;
  };

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Expired';
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const getVoteChartData = (proposal: Proposal) => {
    return [
      { name: 'For', value: proposal.votes.for, color: '#4caf50' },
      { name: 'Against', value: proposal.votes.against, color: '#f44336' },
      { name: 'Abstain', value: proposal.votes.abstain, color: '#ff9800' },
    ];
  };

  const getQuorumProgress = (proposal: Proposal) => {
    return Math.min(100, (proposal.votes.total / proposal.quorum) * 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box textAlign="center">
          <Typography variant="h4" sx={{ color: '#00ffff', mb: 2 }}>
            Loading DAO Governance...
          </Typography>
          <LinearProgress sx={{ width: 300, height: 6, borderRadius: 3 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 2 }}>
          <VoteIcon sx={{ fontSize: 40 }} />
          DAO Governance
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          Participate in decentralized decision-making and earn XP for governance activities
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'rgba(25, 25, 25, 0.9)',
            border: '2px solid #00ffff',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <VoteIcon sx={{ color: '#00ffff', fontSize: 24, mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  Active Proposals
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                {proposals.filter(p => p.status === 'active').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Currently voting
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'rgba(25, 25, 25, 0.9)',
            border: '2px solid #2ed573',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CheckCircleIcon sx={{ color: '#2ed573', fontSize: 24, mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  Passed Proposals
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                {proposals.filter(p => p.status === 'passed').length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Successfully executed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'rgba(25, 25, 25, 0.9)',
            border: '2px solid #fdcb6e',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TreasuryIcon sx={{ color: '#fdcb6e', fontSize: 24, mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  Voting Power
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                {votingPower.available.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                DMT tokens
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: 'rgba(25, 25, 25, 0.9)',
            border: '2px solid #e84393',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PersonIcon sx={{ color: '#e84393', fontSize: 24, mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  Total Voters
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#e84393', fontWeight: 'bold' }}>
                {proposals.reduce((sum, p) => sum + p.votes.total, 0)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Community participation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Wallet Connection & DMT Balance */}
      {!walletInfo ? (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3, 
            backgroundColor: 'rgba(0, 255, 255, 0.1)', 
            border: '1px solid #00ffff',
            color: '#00ffff'
          }}
          action={
            <Button 
              color="inherit" 
              onClick={handleConnectWallet}
              startIcon={<WalletIcon />}
              sx={{ color: '#00ffff' }}
            >
              Connect Wallet
            </Button>
          }
        >
          Connect your wallet to participate in governance voting
        </Alert>
      ) : (
        <Card sx={{
          mb: 3,
          background: 'rgba(25, 25, 25, 0.9)',
          border: '2px solid #00ffff',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <WalletIcon sx={{ color: '#00ffff', fontSize: 24 }} />
                <Box>
                  <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                    Wallet Connected
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    {walletInfo.address.slice(0, 6)}...{walletInfo.address.slice(-4)}
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                onClick={handleDisconnectWallet}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  '&:hover': { borderColor: '#d32f2f', backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                }}
              >
                Disconnect
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h5" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                    {dmtTokenService.formatBalance(walletInfo.dmtBalance)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    DMT Balance
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h5" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                    {dmtTokenService.formatBalance(walletInfo.stakedAmount)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Staked DMT
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                    {dmtTokenService.formatBalance(walletInfo.votingPower)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Voting Power
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center">
                  <Typography variant="h5" sx={{ color: '#e84393', fontWeight: 'bold' }}>
                    {delegations.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Delegations
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* DMT Balance Status */}
            <Box mt={2}>
              {dmtTokenService.hasMinimumBalanceForVoting(100) ? (
                <Chip
                  label="✅ Sufficient DMT for voting"
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }}
                />
              ) : (
                <Chip
                  label="❌ Insufficient DMT for voting (100 DMT required)"
                  sx={{
                    backgroundColor: '#f44336',
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }}
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Tooltip 
          title={!walletInfo ? "Connect wallet first" : !dmtTokenService.hasMinimumBalanceForProposal(100) ? "Insufficient DMT balance (100 DMT required)" : "Create a new governance proposal"}
        >
          <span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateModal(true)}
              disabled={!walletInfo || !dmtTokenService.hasMinimumBalanceForProposal(100)}
              sx={{
                backgroundColor: '#00ffff',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: '#00e5e5' },
                '&:disabled': { backgroundColor: '#666', color: '#999' }
              }}
            >
              Create Proposal
            </Button>
          </span>
        </Tooltip>
        
        <Button
          variant="contained"
          startIcon={<PeopleIcon />}
          onClick={() => setShowDelegationModal(true)}
          disabled={!walletInfo}
          sx={{
            backgroundColor: '#e84393',
            color: '#ffffff',
            fontWeight: 'bold',
            '&:hover': { backgroundColor: '#d63384' },
            '&:disabled': { backgroundColor: '#666', color: '#999' }
          }}
        >
          Delegate Votes
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
          sx={{
            borderColor: '#00ffff',
            color: '#00ffff',
            '&:hover': { borderColor: '#00e5e5', backgroundColor: 'rgba(0, 255, 255, 0.1)' }
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Proposals List */}
      <Grid container spacing={3}>
        {proposals.map((proposal) => {
          const CategoryIcon = getCategoryIcon(proposal.category);
          const voteChartData = getVoteChartData(proposal);
          const quorumProgress = getQuorumProgress(proposal);
          
          return (
            <Grid item xs={12} key={proposal.id}>
              <Card sx={{
                background: 'rgba(25, 25, 25, 0.9)',
                border: '2px solid #00ffff',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.2)'
                }
              }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <CategoryIcon />
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                          {proposal.title}
                        </Typography>
                        <Chip
                          label={proposal.status.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getStatusColor(proposal.status),
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }}
                        />
                        {/* Auto-generated badge - removed for compatibility */}
                      </Box>
                      <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                        {proposal.description}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={3} mb={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon sx={{ color: '#b0b0b0', fontSize: 16 }} />
                          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                            {proposal.createdBy}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <ScheduleIcon sx={{ color: '#b0b0b0', fontSize: 16 }} />
                          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                            {formatTimeRemaining(proposal.deadline as any)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Voting Results */}
                  <Grid container spacing={3} mb={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                        Voting Results
                      </Typography>
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie
                            data={voteChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {voteChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                        Vote Breakdown
                      </Typography>
                      <Box mb={1}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" sx={{ color: '#4caf50' }}>
                            For: {proposal.votes.for}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4caf50' }}>
                            {proposal.votes.total > 0 ? ((proposal.votes.for / proposal.votes.total) * 100).toFixed(1) : 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={proposal.votes.total > 0 ? (proposal.votes.for / proposal.votes.total) * 100 : 0}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#4caf50',
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                      <Box mb={1}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" sx={{ color: '#f44336' }}>
                            Against: {proposal.votes.against}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#f44336' }}>
                            {proposal.votes.total > 0 ? ((proposal.votes.against / proposal.votes.total) * 100).toFixed(1) : 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={proposal.votes.total > 0 ? (proposal.votes.against / proposal.votes.total) * 100 : 0}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#f44336',
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                      <Box mb={2}>
                        <Box display="flex" justifyContent="space-between" mb={0.5}>
                          <Typography variant="body2" sx={{ color: '#ff9800' }}>
                            Abstain: {proposal.votes.abstain}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#ff9800' }}>
                            {proposal.votes.total > 0 ? ((proposal.votes.abstain / proposal.votes.total) * 100).toFixed(1) : 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={proposal.votes.total > 0 ? (proposal.votes.abstain / proposal.votes.total) * 100 : 0}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#ff9800',
                              borderRadius: 3
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Quorum Progress */}
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" sx={{ color: '#ffffff' }}>
                        Quorum Progress
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#00ffff' }}>
                        {proposal.votes.total} / {proposal.quorum} ({quorumProgress.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={quorumProgress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#00ffff',
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>

                  {/* Vote Buttons */}
                  {proposal.status === 'active' && (
                    <Box>
                      {/* User's Previous Vote */}
                      {userVotes[proposal.id!] && (
                        <Box mb={2} textAlign="center">
                          <Chip
                            label={`Your Vote: ${userVotes[proposal.id!].type.toUpperCase()} (${userVotes[proposal.id!].votingPower} DMT)`}
                            sx={{
                              backgroundColor: userVotes[proposal.id!].type === 'for' ? '#4caf50' : 
                                             userVotes[proposal.id!].type === 'against' ? '#f44336' : '#ff9800',
                              color: '#ffffff',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                      )}
                      
                      <Box display="flex" gap={2} justifyContent="center">
                        <Tooltip 
                          title={!walletInfo ? "Connect wallet first" : !dmtTokenService.hasMinimumBalanceForVoting(100) ? "Insufficient DMT balance (100 DMT required)" : "Vote in favor of this proposal"}
                        >
                          <span>
                            <Button
                              variant="contained"
                              startIcon={<TrendingUpIcon />}
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setShowVoteModal(true);
                              }}
                              disabled={!walletInfo || !dmtTokenService.hasMinimumBalanceForVoting(100)}
                              sx={{
                                backgroundColor: '#4caf50',
                                color: '#ffffff',
                                '&:hover': { backgroundColor: '#45a049' },
                                '&:disabled': { backgroundColor: '#666', color: '#999' }
                              }}
                            >
                              Vote For
                            </Button>
                          </span>
                        </Tooltip>
                        
                        <Tooltip 
                          title={!walletInfo ? "Connect wallet first" : !dmtTokenService.hasMinimumBalanceForVoting(100) ? "Insufficient DMT balance (100 DMT required)" : "Vote against this proposal"}
                        >
                          <span>
                            <Button
                              variant="contained"
                              startIcon={<TrendingDownIcon />}
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setShowVoteModal(true);
                              }}
                              disabled={!walletInfo || !dmtTokenService.hasMinimumBalanceForVoting(100)}
                              sx={{
                                backgroundColor: '#f44336',
                                color: '#ffffff',
                                '&:hover': { backgroundColor: '#da190b' },
                                '&:disabled': { backgroundColor: '#666', color: '#999' }
                              }}
                            >
                              Vote Against
                            </Button>
                          </span>
                        </Tooltip>
                        
                        <Tooltip 
                          title={!walletInfo ? "Connect wallet first" : !dmtTokenService.hasMinimumBalanceForVoting(100) ? "Insufficient DMT balance (100 DMT required)" : "Abstain from voting"}
                        >
                          <span>
                            <Button
                              variant="outlined"
                              startIcon={<AbstainIcon />}
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setShowVoteModal(true);
                              }}
                              disabled={!walletInfo || !dmtTokenService.hasMinimumBalanceForVoting(100)}
                              sx={{
                                borderColor: '#ff9800',
                                color: '#ff9800',
                                '&:hover': { borderColor: '#f57c00', backgroundColor: 'rgba(255, 152, 0, 0.1)' },
                                '&:disabled': { borderColor: '#666', color: '#999' }
                              }}
                            >
                              Abstain
                            </Button>
                          </span>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Create Proposal Modal */}
      <Dialog
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 25, 25, 0.95)',
            color: 'white',
            border: '2px solid #00ffff',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#00ffff', borderBottom: '1px solid #00ffff' }}>
          Create New Proposal
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Proposal Title"
            value={newProposal.title}
            onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: '#ffffff' }
            }}
            InputLabelProps={{
              sx: { color: '#b0b0b0' }
            }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Proposal Description"
            value={newProposal.description}
            onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: '#ffffff' }
            }}
            InputLabelProps={{
              sx: { color: '#b0b0b0' }
            }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: '#b0b0b0' }}>Category</InputLabel>
            <Select
              value={newProposal.category}
              onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value as any })}
              sx={{ color: '#ffffff' }}
            >
              <MenuItem value="treasury">Treasury</MenuItem>
              <MenuItem value="governance">Governance</MenuItem>
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="community">Community</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel sx={{ color: '#b0b0b0' }}>Voting Duration (Days)</InputLabel>
            <Select
              value={newProposal.duration}
              onChange={(e) => setNewProposal({ ...newProposal, duration: e.target.value as number })}
              sx={{ color: '#ffffff' }}
            >
              <MenuItem value={3}>3 Days</MenuItem>
              <MenuItem value={7}>7 Days</MenuItem>
              <MenuItem value={14}>14 Days</MenuItem>
              <MenuItem value={30}>30 Days</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowCreateModal(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProposal}
            variant="contained"
            sx={{
              backgroundColor: '#00ffff',
              color: '#000',
              '&:hover': { backgroundColor: '#00e5e5' }
            }}
          >
            Create Proposal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vote Confirmation Modal */}
      <Dialog
        open={showVoteModal}
        onClose={() => setShowVoteModal(false)}
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 25, 25, 0.95)',
            color: 'white',
            border: '2px solid #00ffff',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#00ffff', borderBottom: '1px solid #00ffff' }}>
          Confirm Your Vote
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedProposal && (
            <Box>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                {selectedProposal.title}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
                Your vote will be recorded on-chain and cannot be changed once submitted.
              </Typography>
              <Box display="flex" gap={2} justifyContent="center">
                <Button
                  variant="contained"
                  startIcon={<TrendingUpIcon />}
                  onClick={() => selectedProposal.id && handleVote(selectedProposal.id, 'for')}
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#45a049' }
                  }}
                >
                  Vote For
                </Button>
                <Button
                  variant="contained"
                  startIcon={<TrendingDownIcon />}
                  onClick={() => selectedProposal.id && handleVote(selectedProposal.id, 'against')}
                  sx={{
                    backgroundColor: '#f44336',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#da190b' }
                  }}
                >
                  Vote Against
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AbstainIcon />}
                  onClick={() => selectedProposal.id && handleVote(selectedProposal.id, 'abstain')}
                  sx={{
                    borderColor: '#ff9800',
                    color: '#ff9800',
                    '&:hover': { borderColor: '#f57c00', backgroundColor: 'rgba(255, 152, 0, 0.1)' }
                  }}
                >
                  Abstain
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowVoteModal(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delegation Modal */}
      <Dialog
        open={showDelegationModal}
        onClose={() => setShowDelegationModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 25, 25, 0.95)',
            color: 'white',
            border: '2px solid #e84393',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ color: '#e84393', borderBottom: '1px solid #e84393', display: 'flex', alignItems: 'center', gap: 1 }}>
          <PeopleIcon />
          Delegate Voting Power
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
            Delegate your voting power to another address. They will be able to vote on your behalf in governance proposals.
          </Typography>
          
          <TextField
            fullWidth
            label="Delegate Address"
            value={delegationForm.delegateAddress}
            onChange={(e) => setDelegationForm({ ...delegationForm, delegateAddress: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: '#ffffff' }
            }}
            InputLabelProps={{
              sx: { color: '#b0b0b0' }
            }}
            placeholder="0x..."
          />
          
          <TextField
            fullWidth
            label="Amount to Delegate (DMT)"
            type="number"
            value={delegationForm.amount}
            onChange={(e) => setDelegationForm({ ...delegationForm, amount: Number(e.target.value) })}
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: '#ffffff' }
            }}
            InputLabelProps={{
              sx: { color: '#b0b0b0' }
            }}
            helperText={`Available voting power: ${walletInfo?.votingPower || 0} DMT`}
          />
          
          {walletInfo && (
            <Box sx={{ p: 2, backgroundColor: 'rgba(232, 67, 147, 0.1)', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#e84393', fontWeight: 'bold', mb: 1 }}>
                Delegation Summary:
              </Typography>
              <Typography variant="body2" sx={{ color: '#ffffff' }}>
                • Delegating: {delegationForm.amount} DMT
              </Typography>
              <Typography variant="body2" sx={{ color: '#ffffff' }}>
                • Remaining voting power: {walletInfo.votingPower - delegationForm.amount} DMT
              </Typography>
              <Typography variant="body2" sx={{ color: '#ffffff' }}>
                • XP reward: +30 XP
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowDelegationModal(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateDelegation}
            variant="contained"
            disabled={!delegationForm.delegateAddress || delegationForm.amount <= 0 || (walletInfo ? delegationForm.amount > walletInfo.votingPower : false)}
            sx={{
              backgroundColor: '#e84393',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#d63384' },
              '&:disabled': { backgroundColor: '#666', color: '#999' }
            }}
          >
            Create Delegation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DAOGovernanceVoting;
