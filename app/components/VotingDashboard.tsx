"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Badge,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Container,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  HowToVote as VoteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  AttachMoney as AttachMoneyIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from './ToastNotifications';

// Types for DAO voting data
interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  category: 'governance' | 'treasury' | 'technical' | 'community';
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  requiredQuorum: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  isVoted: boolean;
  userVote?: 'for' | 'against';
  executionStatus: 'pending' | 'executed' | 'failed';
  executionDate?: string;
  impact: 'low' | 'medium' | 'high';
  estimatedCost?: number;
  tags: string[];
}

interface Vote {
  proposalId: string;
  voter: string;
  vote: 'for' | 'against';
  votingPower: number;
  timestamp: string;
  reason?: string;
}

const VotingDashboard: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  
  // State management
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userVotingPower, setUserVotingPower] = useState(0);
  const [userStakedTokens, setUserStakedTokens] = useState(0);
  
  // New proposal form
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    category: 'governance' as const,
    impact: 'medium' as const,
    estimatedCost: 0,
    tags: [] as string[],
  });

  // Mock data for demonstration
  const mockProposals: Proposal[] = [
    {
      id: '1',
      title: 'Increase Staking Rewards to 15%',
      description: 'Proposal to increase staking rewards from 12% to 15% to attract more participants and increase token utility.',
      proposer: '0x1234...5678',
      category: 'governance',
      status: 'active',
      votesFor: 1250,
      votesAgainst: 320,
      totalVotes: 1570,
      quorum: 45.2,
      requiredQuorum: 30,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isVoted: false,
      executionStatus: 'pending',
      impact: 'high',
      estimatedCost: 50000,
      tags: ['staking', 'rewards', 'governance'],
    },
    {
      id: '2',
      title: 'Fund Development of Mobile App',
      description: 'Allocate treasury funds to develop a mobile application for better user experience and accessibility.',
      proposer: '0x2345...6789',
      category: 'treasury',
      status: 'passed',
      votesFor: 2100,
      votesAgainst: 450,
      totalVotes: 2550,
      quorum: 67.8,
      requiredQuorum: 30,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      isVoted: true,
      userVote: 'for',
      executionStatus: 'executed',
      executionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      impact: 'medium',
      estimatedCost: 100000,
      tags: ['mobile', 'development', 'treasury'],
    },
    {
      id: '3',
      title: 'Upgrade Smart Contract Security',
      description: 'Implement additional security measures and audit the main smart contracts.',
      proposer: '0x3456...7890',
      category: 'technical',
      status: 'pending',
      votesFor: 0,
      votesAgainst: 0,
      totalVotes: 0,
      quorum: 0,
      requiredQuorum: 30,
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isVoted: false,
      executionStatus: 'pending',
      impact: 'high',
      estimatedCost: 75000,
      tags: ['security', 'audit', 'technical'],
    },
  ];

  useEffect(() => {
    loadProposals();
    loadUserVotingPower();
  }, [connected, publicKey]);

  useEffect(() => {
    filterProposals();
  }, [proposals, filterStatus, filterCategory, searchQuery]);

  const loadProposals = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProposals(mockProposals);
      showSuccess('Proposals loaded successfully');
    } catch (error) {
      showError('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const loadUserVotingPower = async () => {
    if (!connected || !publicKey) return;
    
    try {
      // Mock user voting power based on staked tokens
      const mockVotingPower = Math.floor(Math.random() * 1000) + 100;
      const mockStakedTokens = Math.floor(Math.random() * 5000) + 1000;
      
      setUserVotingPower(mockVotingPower);
      setUserStakedTokens(mockStakedTokens);
    } catch (error) {
      console.error('Failed to load voting power:', error);
    }
  };

  const filterProposals = () => {
    let filtered = proposals;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === filterStatus);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(proposal => proposal.category === filterCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(proposal => 
        proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProposals(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#2ed573';
      case 'passed': return '#0984e3';
      case 'rejected': return '#ff6b6b';
      case 'pending': return '#fdcb6e';
      default: return '#b0b0b0';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'governance': return '#00ffff';
      case 'treasury': return '#2ed573';
      case 'technical': return '#0984e3';
      case 'community': return '#e84393';
      default: return '#b0b0b0';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return '#2ed573';
      case 'medium': return '#fdcb6e';
      case 'high': return '#ff6b6b';
      default: return '#b0b0b0';
    }
  };

  const handleVote = async (proposal: Proposal, vote: 'for' | 'against') => {
    try {
      if (!connected) {
        showError('Please connect your wallet to vote');
        return;
      }

      if (proposal.isVoted) {
        showError('You have already voted on this proposal');
        return;
      }

      // Simulate voting
      const updatedProposals = proposals.map(p => {
        if (p.id === proposal.id) {
          const newVotesFor = vote === 'for' ? p.votesFor + userVotingPower : p.votesFor;
          const newVotesAgainst = vote === 'against' ? p.votesAgainst + userVotingPower : p.votesAgainst;
          const newTotalVotes = p.totalVotes + userVotingPower;
          const newQuorum = (newTotalVotes / 10000) * 100; // Mock total token supply
          
          return {
            ...p,
            votesFor: newVotesFor,
            votesAgainst: newVotesAgainst,
            totalVotes: newTotalVotes,
            quorum: newQuorum,
            isVoted: true,
            userVote: vote,
            status: newQuorum >= p.requiredQuorum ? 
              (newVotesFor > newVotesAgainst ? 'passed' : 'rejected') : 
              p.status
          };
        }
        return p;
      });

      setProposals(updatedProposals);
      setShowVoteModal(false);
      
      showSuccess(`Vote ${vote === 'for' ? 'for' : 'against'} "${proposal.title}" recorded successfully`);
    } catch (error) {
      showError('Failed to submit vote');
    }
  };

  const handleCreateProposal = async () => {
    try {
      if (!connected) {
        showError('Please connect your wallet to create a proposal');
        return;
      }

      if (!newProposal.title || !newProposal.description) {
        showError('Please fill in all required fields');
        return;
      }

      const proposal: Proposal = {
        id: Date.now().toString(),
        title: newProposal.title,
        description: newProposal.description,
        proposer: publicKey?.toBase58() || '',
        category: newProposal.category,
        status: 'pending',
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
        quorum: 0,
        requiredQuorum: 30,
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        isVoted: false,
        executionStatus: 'pending',
        impact: newProposal.impact,
        estimatedCost: newProposal.estimatedCost,
        tags: newProposal.tags,
      };

      setProposals(prev => [proposal, ...prev]);
      setShowProposalModal(false);
      setNewProposal({
        title: '',
        description: '',
        category: 'governance',
        impact: 'medium',
        estimatedCost: 0,
        tags: [],
      });
      
      showSuccess('Proposal created successfully');
    } catch (error) {
      showError('Failed to create proposal');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${days}d ${hours}h`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ 
          color: '#00ffff', 
          fontWeight: 'bold',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <VoteIcon sx={{ fontSize: 40 }} />
          DAO Governance
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Participate in decentralized governance decisions
        </Typography>
        
        {/* Status Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #2ed573',
              borderRadius: 2
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <VoteIcon sx={{ color: '#2ed573', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#2ed573' }}>
                    Active Proposals
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {proposals.filter(p => p.status === 'active').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Currently voting
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #0984e3',
              borderRadius: 2
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon sx={{ color: '#0984e3', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#0984e3' }}>
                    Passed Proposals
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {proposals.filter(p => p.status === 'passed').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Successfully passed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #fdcb6e',
              borderRadius: 2
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fdcb6e' }}>
                    Total Voters
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {proposals.reduce((sum, p) => sum + p.totalVotes, 0)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Community participation
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #00ffff',
              borderRadius: 2
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AccountBalanceIcon sx={{ color: '#00ffff', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#00ffff' }}>
                    Your Voting Power
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {userVotingPower}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  {userStakedTokens} tokens staked
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Controls */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff',
        borderRadius: 2,
        mb: 3
      }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#ffffff' }}>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{ color: '#ffffff' }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="passed">Passed</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#ffffff' }}>Category</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  sx={{ color: '#ffffff' }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="governance">Governance</MenuItem>
                  <MenuItem value="treasury">Treasury</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="community">Community</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon sx={{ color: '#b0b0b0' }} />
                <input
                  type="text"
                  placeholder="Search proposals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowProposalModal(true)}
                  sx={{
                    backgroundColor: '#2ed573',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#26c965' }
                  }}
                >
                  New Proposal
                </Button>
                <Tooltip title="Refresh">
                  <IconButton onClick={loadProposals} disabled={loading}>
                    <RefreshIcon sx={{ color: '#00ffff' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Proposals Table */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #2ed573',
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#2ed573', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <VoteIcon />
            Proposals ({filteredProposals.length})
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#00ffff' }} />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Proposal</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Category</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Votes</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Quorum</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Time Left</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProposals.map((proposal) => (
                    <TableRow key={proposal.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 0.5 }}>
                            {proposal.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                            {proposal.description.substring(0, 100)}...
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {proposal.tags.map((tag, index) => (
                              <Chip 
                                key={index}
                                label={tag}
                                size="small"
                                sx={{ 
                                  backgroundColor: 'rgba(0, 255, 255, 0.1)',
                                  color: '#00ffff',
                                  fontSize: '0.7rem'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={proposal.status.toUpperCase()}
                          sx={{
                            backgroundColor: getStatusColor(proposal.status),
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={proposal.category.toUpperCase()}
                          sx={{
                            backgroundColor: getCategoryColor(proposal.category),
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <TrendingUpIcon sx={{ color: '#2ed573', fontSize: 16 }} />
                            <Typography variant="body2" sx={{ color: '#2ed573' }}>
                              {proposal.votesFor}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TrendingDownIcon sx={{ color: '#ff6b6b', fontSize: 16 }} />
                            <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
                              {proposal.votesAgainst}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                            {proposal.quorum.toFixed(1)}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(100, (proposal.quorum / proposal.requiredQuorum) * 100)} 
                            sx={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: proposal.quorum >= proposal.requiredQuorum ? '#2ed573' : '#fdcb6e'
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                            Required: {proposal.requiredQuorum}%
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell sx={{ color: '#b0b0b0' }}>
                        {getTimeRemaining(proposal.endDate)}
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                setSelectedProposal(proposal);
                                setShowVoteModal(true);
                              }}
                              sx={{ color: '#00ffff' }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {proposal.status === 'active' && !proposal.isVoted && (
                            <>
                              <Tooltip title="Vote For">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleVote(proposal, 'for')}
                                  sx={{ color: '#2ed573' }}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Vote Against">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleVote(proposal, 'against')}
                                  sx={{ color: '#ff6b6b' }}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          
                          {proposal.isVoted && (
                            <Chip 
                              label={`Voted ${proposal.userVote}`} 
                              size="small" 
                              sx={{ 
                                backgroundColor: proposal.userVote === 'for' ? '#2ed573' : '#ff6b6b', 
                                color: '#ffffff' 
                              }} 
                            />
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Proposal Modal */}
      <Dialog 
        open={showProposalModal} 
        onClose={() => setShowProposalModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: 'rgba(25, 25, 25, 0.95)', 
          color: '#00ffff',
          borderBottom: '1px solid #00ffff'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon />
            Create New Proposal
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)', color: '#ffffff' }}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Proposal Title"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                  sx={{ 
                    '& .MuiInputLabel-root': { color: '#b0b0b0' },
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ 
                    '& .MuiInputLabel-root': { color: '#b0b0b0' },
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#ffffff' }}>Category</InputLabel>
                  <Select
                    value={newProposal.category}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, category: e.target.value as any }))}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="governance">Governance</MenuItem>
                    <MenuItem value="treasury">Treasury</MenuItem>
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="community">Community</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#ffffff' }}>Impact Level</InputLabel>
                  <Select
                    value={newProposal.impact}
                    onChange={(e) => setNewProposal(prev => ({ ...prev, impact: e.target.value as any }))}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Estimated Cost (DMT)"
                  value={newProposal.estimatedCost}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, estimatedCost: Number(e.target.value) }))}
                  sx={{ 
                    '& .MuiInputLabel-root': { color: '#b0b0b0' },
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          <Button 
            onClick={() => setShowProposalModal(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateProposal}
            sx={{ 
              backgroundColor: '#2ed573',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#26c965' }
            }}
          >
            Create Proposal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vote Modal */}
      <Dialog 
        open={showVoteModal} 
        onClose={() => setShowVoteModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: 'rgba(25, 25, 25, 0.95)', 
          color: '#00ffff',
          borderBottom: '1px solid #00ffff'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <VoteIcon />
            Vote on Proposal
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)', color: '#ffffff' }}>
          {selectedProposal && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                {selectedProposal.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff', mb: 3 }}>
                {selectedProposal.description}
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#2ed573', mb: 2 }}>
                    Current Results
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#2ed573' }}>Votes For</Typography>
                      <Typography variant="body2" sx={{ color: '#ffffff' }}>{selectedProposal.votesFor}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#ff6b6b' }}>Votes Against</Typography>
                      <Typography variant="body2" sx={{ color: '#ffffff' }}>{selectedProposal.votesAgainst}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Total Votes</Typography>
                      <Typography variant="body2" sx={{ color: '#ffffff' }}>{selectedProposal.totalVotes}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#fdcb6e' }}>Quorum</Typography>
                      <Typography variant="body2" sx={{ color: '#ffffff' }}>{selectedProposal.quorum.toFixed(1)}%</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                    Your Vote
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                    Voting Power: {userVotingPower} tokens
                  </Typography>
                  
                  {selectedProposal.isVoted ? (
                    <Alert severity="info">
                      You have already voted {selectedProposal.userVote} on this proposal.
                    </Alert>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleVote(selectedProposal, 'for')}
                        sx={{
                          backgroundColor: '#2ed573',
                          color: '#ffffff',
                          '&:hover': { backgroundColor: '#26c965' }
                        }}
                      >
                        Vote For
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<CancelIcon />}
                        onClick={() => handleVote(selectedProposal, 'against')}
                        sx={{
                          backgroundColor: '#ff6b6b',
                          color: '#ffffff',
                          '&:hover': { backgroundColor: '#e55a5a' }
                        }}
                      >
                        Vote Against
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          <Button 
            onClick={() => setShowVoteModal(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VotingDashboard;

