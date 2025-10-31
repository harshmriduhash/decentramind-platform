"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
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
} from '@mui/material';
import {
  Gavel as GavelIcon,
  HowToVote as VoteIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Campaign as CampaignIcon,
  Business as BusinessIcon,
  AccountBalance as FinanceIcon,
  Star as StarIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { useGlobalState } from '../store/globalState';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from './ToastNotifications';
import { SolanaWalletService } from '../services/solanaWalletService';
import ProposalService, { Proposal } from '../services/proposalService';
import SolanaService from '../services/solanaService';

const ProposalsTab: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [showVoteDialog, setShowVoteDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [voteAmount, setVoteAmount] = useState('');
  const [proposalTitle, setProposalTitle] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposalType, setProposalType] = useState('Governance');

  // Use global state for proposals
  const { proposals, addProposal } = useGlobalState();
  
  // Cast proposals to the correct type
  const typedProposals = proposals as unknown as Proposal[];

  const proposalTypes = [
    'Governance',
    'Feature',
    'Economic',
    'Partnership',
    'Security',
    'Technical',
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#2ed573';
      case 'Pending':
        return '#fdcb6e';
      case 'Completed':
        return '#00ffff';
      case 'Rejected':
        return '#ff3860';
      default:
        return '#666';
    }
  };

  const getVotePercentage = (votesFor: number, totalVotes: number) => {
    return totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;
  };

  const handleCreateProposal = async () => {
    try {
    if (!proposalTitle.trim() || !proposalDescription.trim()) {
        showError('Please fill in all fields');
        return;
      }

      // Check wallet connection
      if (!connected) {
        showError('Please connect your wallet to create a proposal');
        return;
      }

      if (!publicKey) {
        showError('Please connect your wallet');
        return;
      }

      // Create proposal using ProposalService
      const proposalService = ProposalService.getInstance();
      const proposalId = await proposalService.createProposal(
        publicKey.toBase58(),
        'Current User',
        proposalTitle,
        proposalDescription,
        proposalType,
        0 // No fee for now
      );

      if (proposalId) {
        showSuccess('Proposal created successfully!');
        setShowCreateProposal(false);
        setProposalTitle('');
        setProposalDescription('');
        setProposalType('Governance');
      } else {
        showError('Failed to create proposal');
      }
    } catch (error) {
      console.error('Error in handleCreateProposal:', error);
      showError('Failed to create proposal. Please try again.');
    }
  };

  const handleVote = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setVoteAmount('');
    setShowVoteDialog(true);
  };

  const handleVoteSubmit = async () => {
    try {
      if (!selectedProposal || !voteAmount || parseFloat(voteAmount) <= 0) {
        alert('Please enter a valid vote amount');
        return;
      }

      const amount = parseFloat(voteAmount);
      
      // REAL BLOCKCHAIN TRANSACTION - Vote on proposal using Solana
      const solanaService = SolanaService;
      const blockchainResult = await solanaService.mintAgent(amount); // Using mintAgent for voting transaction
      
      if (!blockchainResult.success) {
        showError(`Blockchain transaction failed: ${blockchainResult.error}`);
        return;
      }

      showSuccess(`Transaction signed! Signature: ${blockchainResult.signature?.slice(0, 8)}...`);
      
      // Save vote to Firebase
      const userId = publicKey?.toBase58() || '';
      const proposalService = ProposalService.getInstance();
      
      if (!selectedProposal?.id) {
        showError('Invalid proposal');
        return;
      }

      try {
        await proposalService.voteOnProposal(
          selectedProposal.id,
          userId,
          amount,
          blockchainResult.signature
        );
      } catch (error) {
        console.error('Failed to save vote:', error);
        showError('Transaction successful but failed to save vote to database');
        return;
      }

      // Update local state
      const updatedProposals = typedProposals.map(p => {
        if (p.id === selectedProposal.id) {
          return {
            ...p,
            totalVotes: p.totalVotes + 1,
            votes: {
              for: amount,
              against: 0,
              abstain: 0
            }
          };
        }
        return p;
      });

      // Update global state
      // Note: This would need to be implemented in the global state
      showSuccess('Vote submitted successfully!');
      setShowVoteDialog(false);
      setVoteAmount('');
      setSelectedProposal(null);
    } catch (error) {
      console.error('Error in handleVoteSubmit:', error);
      showError('Failed to submit vote. Please try again.');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 1, textShadow: '0 0 8px #00ffff' }}>
            🏛️ DAO Governance
          </Typography>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
            View and manage proposals and governance activities
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateProposal(true)}
          sx={{
            background: '#00ffff',
            color: 'black',
            fontWeight: 'bold',
            '&:hover': {
              background: '#00cccc',
            },
          }}
        >
          Create Proposal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                {typedProposals.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Proposals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                {typedProposals.filter(p => p.status === 'Active').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Active Proposals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                {typedProposals.filter(p => p.status === 'Pending').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Pending Review
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff3860', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#ff3860', fontWeight: 'bold' }}>
                {typedProposals.filter(p => p.status === 'Completed').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Proposals Table */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
          Recent Proposals
        </Typography>
        <TableContainer component={Paper} sx={{ background: 'rgba(25, 25, 25, 0.9)', borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Proposal</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Votes</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Progress</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>End Date</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {typedProposals.map((proposal) => (
                <TableRow key={proposal.title} sx={{ '&:hover': { background: 'rgba(255, 255, 255, 0.05)' } }}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {proposal.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {proposal.description.substring(0, 60)}...
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={proposal.type}
                      size="small"
                      sx={{ background: '#333', color: 'white' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={proposal.status}
                      size="small"
                      sx={{
                        background: getStatusColor(proposal.status),
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {proposal.votes} / {proposal.totalVotes}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {getVotePercentage(proposal.votes, proposal.totalVotes).toFixed(1)}% For
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress
                        variant="determinate"
                        value={getVotePercentage(proposal.votes, proposal.totalVotes)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          background: '#333',
                          '& .MuiLinearProgress-bar': {
                            background: '#00ffff',
                          },
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {proposal.endDate}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleVote(proposal)}
                      disabled={proposal.status !== 'Active'}
                      sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                    >
                      Vote
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Create Proposal Dialog */}
      <Dialog open={showCreateProposal} onClose={() => setShowCreateProposal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          Create New Proposal
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Proposal Title"
            value={proposalTitle}
            onChange={(e) => setProposalTitle(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={proposalDescription}
            onChange={(e) => setProposalDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Proposal Type</InputLabel>
            <Select
              value={proposalType}
              onChange={(e) => setProposalType(e.target.value)}
              label="Proposal Type"
            >
              {proposalTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateProposal(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleCreateProposal} sx={{ color: '#00ffff' }}>
            Create Proposal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vote Dialog */}
      <Dialog open={showVoteDialog} onClose={() => setShowVoteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          Vote on Proposal: {selectedProposal?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            {selectedProposal?.description}
          </Typography>
          <TextField
            fullWidth
            label="Vote Amount (DMT)"
            type="number"
            value={voteAmount}
            onChange={(e) => setVoteAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            inputProps={{ min: 1 }}
          />
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              • Your vote weight is based on your DMT holdings<br />
              • Minimum vote: 1 DMT<br />
              • You can only vote on active proposals
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVoteDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleVoteSubmit} sx={{ color: '#00ffff' }}>
            Submit Vote
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProposalsTab; 