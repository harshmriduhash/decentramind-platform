import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  HowToVote as VoteIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as RemoveIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from '@mui/icons-material';
import daoService, { Proposal, Vote } from '../services/daoService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastNotifications';

// Local type definitions
type ProposalStatus = 'active' | 'passed' | 'rejected' | 'executed' | 'draft';
type ProposalType = 'treasury' | 'governance' | 'tech' | 'community' | 'feature' | 'agent' | 'upgrade';

interface ProposalListProps {
  onProposalClick?: (proposalId: string) => void;
  showCreateButton?: boolean;
  onCreateProposal?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`proposal-tabpanel-${index}`}
      aria-labelledby={`proposal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export const ProposalList: React.FC<ProposalListProps> = ({
  onProposalClick,
  showCreateButton = true,
  onCreateProposal
}) => {
  const { session } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ProposalType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'votingEnd' | 'totalVotes'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [userVote, setUserVote] = useState<'for' | 'against' | 'abstain' | null>(null);
  const [votingLoading, setVotingLoading] = useState(false);

  useEffect(() => {
    if (session.isAuthenticated && session.walletAddress) {
      loadProposals();
    } else {
      // Show authentication required message instead of mock data
      setError('Please connect your wallet to view governance proposals');
    }
  }, [session.isAuthenticated, session.walletAddress]);

  const loadProposals = async () => {
    setLoading(true);
    setError(null);

    try {
      let status: ProposalStatus | undefined;
      let type: ProposalType | undefined;

      // Map tab value to status
      switch (tabValue) {
        case 0: // All
          break;
        case 1: // Active
          status = 'active';
          break;
        case 2: // Discussion
          status = 'draft';
          break;
        case 3: // Passed
          status = 'passed';
          break;
        case 4: // Failed
          status = 'rejected';
          break;
      }

      // Apply filters
      if (statusFilter !== 'all') {
        status = statusFilter;
      }
      if (typeFilter !== 'all') {
        type = typeFilter;
      }

      const proposalsData = await new Promise<Proposal[]>((resolve) => {
        const unsubscribe = daoService.getProposals((proposals) => {
          resolve(proposals);
          unsubscribe();
        });
      });
      
      // Apply search filter
      let filteredProposals = proposalsData;
      if (searchQuery) {
        filteredProposals = proposalsData.filter(proposal =>
          proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply sorting
      filteredProposals.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortBy) {
          case 'createdAt':
            aValue = a.createdAt.toDate().getTime();
            bValue = b.createdAt.toDate().getTime();
            break;
          case 'votingEnd':
            aValue = a.deadline.toDate().getTime();
            bValue = b.deadline.toDate().getTime();
            break;
          case 'totalVotes':
            aValue = a.votes.total;
            bValue = b.votes.total;
            break;
          default:
            aValue = a.createdAt.toDate().getTime();
            bValue = b.createdAt.toDate().getTime();
        }

        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });

      setProposals(filteredProposals);
      setTotalPages(Math.ceil(filteredProposals.length / 10));
    } catch (error) {
      console.error('Failed to load proposals:', error);
      setError('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: string, vote: 'for' | 'against' | 'abstain') => {
    if (!session.walletAddress) {
      showError('Please connect your wallet to vote');
      return;
    }

    setVotingLoading(true);
    try {
      await daoService.castVote(proposalId, vote as 'for' | 'against' | 'abstain', session.walletAddress, 1000);
      showSuccess('Vote cast successfully!');
      setShowVoteDialog(false);
      setSelectedProposal(null);
      setUserVote(null);
      loadProposals(); // Refresh to show updated vote counts
    } catch (error) {
      console.error('Failed to cast vote:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to cast vote';
      showError(errorMessage);
    } finally {
      setVotingLoading(false);
    }
  };

  const openVoteDialog = async (proposal: Proposal) => {
    if (!session.walletAddress) {
      showError('Please connect your wallet to vote');
      return;
    }

    setSelectedProposal(proposal);
    
    // Check if user already voted (simplified for now)
    setUserVote(null);
    
    setShowVoteDialog(true);
  };

  const getStatusColor = (status: ProposalStatus) => {
    switch (status) {
      case 'draft': return '#9e9e9e';
      case 'active': return '#ff9800';
      case 'passed': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'executed': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: ProposalStatus) => {
    switch (status) {
      case 'draft': return <InfoIcon />;
      case 'active': return <TimerIcon />;
      case 'passed': return <CheckIcon />;
      case 'rejected': return <CancelIcon />;
      case 'executed': return <CheckIcon />;
      default: return <InfoIcon />;
    }
  };

  const getTypeColor = (type: ProposalType) => {
    switch (type) {
      case 'governance': return '#9c27b0';
      case 'treasury': return '#4caf50';
      case 'feature': return '#2196f3';
      case 'agent': return '#ff9800';
      case 'upgrade': return '#ff5722';
      default: return '#9e9e9e';
    }
  };

  const calculateVoteProgress = (proposal: Proposal) => {
    const total = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
    if (total === 0) return 0;
    return (proposal.votes.for / total) * 100;
  };

  const formatTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getVoteButtonColor = (vote: 'for' | 'against' | 'abstain') => {
    switch (vote) {
      case 'for': return '#4caf50';
      case 'against': return '#f44336';
      case 'abstain': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#00ffff' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2 }}>
          🗳️ DAO Governance
        </Typography>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={loadProposals}
          sx={{ background: '#00ffff', color: 'black' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!session.isAuthenticated) {
    return (
      <Box>
        <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2 }}>
          🗳️ DAO Governance
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please connect your wallet to view governance proposals.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          🗳️ Governance Proposals
        </Typography>
        {showCreateButton && onCreateProposal && (
          <Button
            variant="contained"
            onClick={onCreateProposal}
            sx={{ 
              background: 'linear-gradient(45deg, #00ffff, #0080ff)',
              color: 'black',
              fontWeight: 'bold'
            }}
          >
            Create Proposal
          </Button>
        )}
      </Box>
      {/* Filters */}
      <Card sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as ProposalStatus | 'all')}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="discussion">Discussion</MenuItem>
                  <MenuItem value="voting">Voting</MenuItem>
                  <MenuItem value="passed">Passed</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="executed">Executed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as ProposalType | 'all')}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="platformDevelopment">Platform Development</MenuItem>
                  <MenuItem value="economicPolicy">Economic Policy</MenuItem>
                  <MenuItem value="treasuryManagement">Treasury Management</MenuItem>
                  <MenuItem value="governance">Governance</MenuItem>
                  <MenuItem value="emergency">Emergency</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'votingEnd' | 'totalVotes')}
                  label="Sort By"
                >
                  <MenuItem value="createdAt">Created Date</MenuItem>
                  <MenuItem value="votingEnd">Voting End</MenuItem>
                  <MenuItem value="totalVotes">Total Votes</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                sx={{ color: '#00ffff', borderColor: '#00ffff' }}
              >
                {sortOrder === 'asc' ? '↑' : '↓'} Sort
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ color: '#00ffff' }}>
          <Tab label="All Proposals" />
          <Tab label="Active Voting" />
          <Tab label="Discussion" />
          <Tab label="Passed" />
          <Tab label="Failed" />
        </Tabs>
      </Box>
      {/* Proposals List */}
      <Grid container spacing={3}>
        {proposals.map((proposal) => (
          <Grid item xs={12} key={proposal.id}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: `2px solid ${getStatusColor(proposal.status)}`,
              '&:hover': {
                borderColor: '#00ffff',
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>
                      {proposal.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {proposal.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={proposal.category.replace(/([A-Z])/g, ' $1').trim()}
                        size="small"
                        sx={{ 
                          background: getTypeColor(proposal.category),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                      <Chip
                        label={proposal.status}
                        size="small"
                        icon={getStatusIcon(proposal.status)}
                        sx={{ 
                          background: getStatusColor(proposal.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => proposal.id && onProposalClick?.(proposal.id)}
                        sx={{ color: '#00ffff' }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {proposal.status === 'active' && (
                      <Tooltip title="Vote">
                        <IconButton
                          onClick={() => openVoteDialog(proposal)}
                          sx={{ color: '#00ffff' }}
                        >
                          <VoteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>

                {/* Vote Progress */}
                {proposal.status === 'active' && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Vote Progress
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatTimeRemaining(proposal.deadline.toDate().toISOString())}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={calculateVoteProgress(proposal)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(45deg, #4caf50, #2ed573)'
                        }
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        For: {proposal.votes.for.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Against: {proposal.votes.against.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Abstain: {proposal.votes.abstain.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Proposal Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Created by {proposal.createdBy.slice(0, 8)}...{proposal.createdBy.slice(-6)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {proposal.createdAt.toDate().toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Empty State */}
      {!loading && proposals.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📋 No Proposals Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No proposals match your current filters.
          </Typography>
        </Box>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#00ffff',
              },
              '& .Mui-selected': {
                background: '#00ffff',
                color: 'black',
              },
            }}
          />
        </Box>
      )}
      {/* Vote Dialog */}
      <Dialog open={showVoteDialog} onClose={() => setShowVoteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Vote on Proposal: {selectedProposal?.title}
        </DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedProposal.description}
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Current Vote Counts:</strong><br />
                For: {selectedProposal.votes.for.toLocaleString()}<br />
                Against: {selectedProposal.votes.against.toLocaleString()}<br />
                Abstain: {selectedProposal.votes.abstain.toLocaleString()}
              </Typography>

              {userVote && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  You have already voted: <strong>{userVote.toUpperCase()}</strong>
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={() => selectedProposal?.id && handleVote(selectedProposal.id, 'for')}
                  disabled={votingLoading}
                  sx={{ 
                    background: getVoteButtonColor('for'),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  <ThumbUpIcon sx={{ mr: 1 }} />
                  Vote For
                </Button>
                <Button
                  variant="contained"
                  onClick={() => selectedProposal?.id && handleVote(selectedProposal.id, 'against')}
                  disabled={votingLoading}
                  sx={{ 
                    background: getVoteButtonColor('against'),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  <ThumbDownIcon sx={{ mr: 1 }} />
                  Vote Against
                </Button>
                <Button
                  variant="contained"
                  onClick={() => selectedProposal?.id && handleVote(selectedProposal.id, 'abstain')}
                  disabled={votingLoading}
                  sx={{ 
                    background: getVoteButtonColor('abstain'),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  <RemoveIcon sx={{ mr: 1 }} />
                  Abstain
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVoteDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 