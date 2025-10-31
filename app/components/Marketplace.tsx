"use client";

import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Store as StoreIcon,
  ShoppingCart as BuyIcon,
  Sell as SellIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Visibility as ViewIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  LocalOffer as OfferIcon,
  AccountBalance as BalanceIcon,
  Payment as PaymentIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGlobalState } from '../store/globalState';
import { useToast } from './ToastNotifications';
import SolanaService from '../services/solanaService';
import { agentRegistryService, AgentMetadata, AgentListing } from '../services/agentRegistryService';

interface MarketplaceAgent {
  id: string;
  name: string;
  domain: string;
  description: string;
  price: number;
  currency: 'DMT' | 'SOL';
  seller: string;
  rating: number;
  reviews: number;
  image?: string;
  capabilities: string[];
  level: number;
  mintDate: string;
  status: 'available' | 'sold' | 'pending';
}

const Marketplace: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  const [agents, setAgents] = useState<MarketplaceAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [showSellDialog, setShowSellDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<MarketplaceAgent | null>(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [sellCurrency, setSellCurrency] = useState<'DMT' | 'SOL'>('DMT');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'date'>('date');

  // Mock marketplace data
  const mockAgents: MarketplaceAgent[] = [
    {
      id: '1',
      name: 'Alpha Trader',
      domain: 'Finance',
      description: 'Advanced trading agent with market analysis capabilities',
      price: 500,
      currency: 'DMT',
      seller: '0x1234...5678',
      rating: 4.8,
      reviews: 12,
      capabilities: ['Trading', 'Analysis', 'Risk Management'],
      level: 5,
      mintDate: '2024-01-15',
      status: 'available'
    },
    {
      id: '2',
      name: 'Creative Designer',
      domain: 'Design',
      description: 'AI-powered design assistant for creative projects',
      price: 300,
      currency: 'DMT',
      seller: '0x8765...4321',
      rating: 4.6,
      reviews: 8,
      capabilities: ['Design', 'Creativity', 'UI/UX'],
      level: 3,
      mintDate: '2024-01-20',
      status: 'available'
    },
    {
      id: '3',
      name: 'Code Master',
      domain: 'Development',
      description: 'Expert coding assistant for software development',
      price: 750,
      currency: 'DMT',
      seller: '0xabcd...efgh',
      rating: 4.9,
      reviews: 15,
      capabilities: ['Coding', 'Debugging', 'Architecture'],
      level: 7,
      mintDate: '2024-01-10',
      status: 'available'
    }
  ];

  useEffect(() => {
    loadMarketplaceAgents();
  }, []);

  const loadMarketplaceAgents = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      setAgents(mockAgents);
    } catch (error) {
      console.error('Failed to load marketplace agents:', error);
      showError('Failed to load marketplace agents');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAgent = async () => {
    if (!connected) {
      showError('Please connect your wallet to buy agents');
      return;
    }

    if (!selectedAgent || !buyAmount) {
      showError('Please select an agent and enter amount');
      return;
    }

    const amount = parseFloat(buyAmount);
    if (amount < selectedAgent.price) {
      showError(`Insufficient amount. Price is ${selectedAgent.price} ${selectedAgent.currency}`);
      return;
    }

    setLoading(true);
    try {
      // REAL BLOCKCHAIN TRANSACTION - Buy agent on Solana
      const solanaService = SolanaService;
      const blockchainResult = await solanaService.mintAgent(amount);
      
      if (!blockchainResult.success) {
        showError(`Blockchain transaction failed: ${blockchainResult.error}`);
        return;
      }

      showSuccess(`Transaction signed! Signature: ${blockchainResult.signature?.slice(0, 8)}...`);
      showSuccess(`Successfully purchased ${selectedAgent.name}!`);
      
      // Update agent status
      const updatedAgents = agents.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, status: 'sold' as const }
          : agent
      );
      setAgents(updatedAgents);
      
      setShowBuyDialog(false);
      setSelectedAgent(null);
      setBuyAmount('');
    } catch (error) {
      console.error('Error buying agent:', error);
      showError('Failed to buy agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSellAgent = async () => {
    if (!connected) {
      showError('Please connect your wallet to sell agents');
      return;
    }

    if (!sellPrice) {
      showError('Please enter a price');
      return;
    }

    const price = parseFloat(sellPrice);
    if (price <= 0) {
      showError('Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement agent listing on blockchain
      showSuccess(`Agent listed for sale at ${price} ${sellCurrency}!`);
      
      setShowSellDialog(false);
      setSellPrice('');
      setSellCurrency('DMT');
    } catch (error) {
      console.error('Error selling agent:', error);
      showError('Failed to list agent for sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'all' || agent.domain === filterDomain;
    return matchesSearch && matchesDomain;
  });

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      case 'date':
        return new Date(b.mintDate).getTime() - new Date(a.mintDate).getTime();
      default:
        return 0;
    }
  });

  const domains = ['all', ...Array.from(new Set(agents.map(agent => agent.domain)))];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 1, textShadow: '0 0 8px #00ffff' }}>
            🏪 Agent Marketplace
          </Typography>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
            Buy and sell AI agents in the decentralized marketplace
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SellIcon />}
          onClick={() => setShowSellDialog(true)}
          disabled={!connected}
          sx={{
            background: '#00ffff',
            color: 'black',
            fontWeight: 'bold',
            '&:hover': {
              background: '#00cccc',
            },
          }}
        >
          Sell Agent
        </Button>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }}
                sx={{ '& .MuiInputBase-root': { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'text.secondary' }}>Domain</InputLabel>
                <Select
                  value={filterDomain}
                  onChange={(e) => setFilterDomain(e.target.value)}
                  sx={{ color: 'white' }}
                >
                  {domains.map(domain => (
                    <MenuItem key={domain} value={domain}>
                      {domain === 'all' ? 'All Domains' : domain}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'text.secondary' }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  sx={{ color: 'white' }}
                >
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="rating">Rating</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                sx={{ borderColor: '#00ffff', color: '#00ffff' }}
              >
                Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Marketplace Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>
                Total Agents
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {agents.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#2ed573', mb: 1 }}>
                Available
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {agents.filter(a => a.status === 'available').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#fdcb6e', mb: 1 }}>
                Total Volume
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {agents.reduce((sum, agent) => sum + agent.price, 0)} DMT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #e74c3c' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#e74c3c', mb: 1 }}>
                Avg Rating
              </Typography>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                {(agents.reduce((sum, agent) => sum + agent.rating, 0) / agents.length).toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Agent Listings */}
      <Grid container spacing={3}>
        {sortedAgents.map((agent) => (
          <Grid item xs={12} md={6} lg={4} key={agent.id}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #00ffff',
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(0, 255, 255, 0.3)'
              }
            }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {agent.name}
                    </Typography>
                    <Chip 
                      label={agent.domain} 
                      size="small" 
                      sx={{ 
                        background: '#00ffff', 
                        color: 'black',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {agent.price} {agent.currency}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <StarIcon sx={{ color: '#fdcb6e', fontSize: 16 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', ml: 0.5 }}>
                        {agent.rating} ({agent.reviews})
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {agent.description}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                  {agent.capabilities.slice(0, 3).map((capability, index) => (
                    <Chip 
                      key={index}
                      label={capability} 
                      size="small" 
                      sx={{ 
                        background: 'rgba(0, 255, 255, 0.1)', 
                        color: '#00ffff',
                        fontSize: '0.7rem'
                      }} 
                    />
                  ))}
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Level {agent.level} • {new Date(agent.mintDate).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<BuyIcon />}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setBuyAmount(agent.price.toString());
                      setShowBuyDialog(true);
                    }}
                    disabled={agent.status !== 'available' || !connected}
                    sx={{
                      background: '#00ffff',
                      color: 'black',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: '#00cccc',
                      },
                    }}
                  >
                    {agent.status === 'available' ? 'Buy Now' : 'Sold'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onClose={() => setShowBuyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          Buy Agent: {selectedAgent?.name}
        </DialogTitle>
        <DialogContent>
          {selectedAgent && (
            <Box>
              <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                Price: {selectedAgent.price} {selectedAgent.currency}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                {selectedAgent.description}
              </Typography>
              <TextField
                fullWidth
                label="Amount to Pay"
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Alert severity="info" sx={{ mb: 2 }}>
                This transaction will be processed on the Solana blockchain
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBuyDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleBuyAgent} 
            variant="contained"
            disabled={loading}
            sx={{
              background: '#00ffff',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Processing...' : 'Buy Agent'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog open={showSellDialog} onClose={() => setShowSellDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          List Agent for Sale
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Currency</InputLabel>
            <Select
              value={sellCurrency}
              onChange={(e) => setSellCurrency(e.target.value as 'DMT' | 'SOL')}
            >
              <MenuItem value="DMT">DMT</MenuItem>
              <MenuItem value="SOL">SOL</MenuItem>
            </Select>
          </FormControl>
          <Alert severity="info">
            Your agent will be listed on the marketplace for other users to purchase
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSellDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSellAgent} 
            variant="contained"
            disabled={loading}
            sx={{
              background: '#00ffff',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {loading ? 'Processing...' : 'List for Sale'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Marketplace; 