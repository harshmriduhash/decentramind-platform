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
  AccountBalance as TreasuryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Send as SendIcon,
  Receipt as ReceiptIcon,
  Security as SecurityIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
  AttachMoney as AttachMoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Savings as SavingsIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from './ToastNotifications';

// Types for Treasury data
interface TreasuryTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer' | 'staking' | 'burning';
  amount: number;
  token: 'DMT' | 'DMTX' | 'SOL';
  description: string;
  from: string;
  to: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  category: 'governance' | 'development' | 'marketing' | 'operations' | 'rewards';
  proposalId?: string;
  hash?: string;
}

interface TreasuryStats {
  totalValue: number;
  dmtBalance: number;
  dmtxBalance: number;
  solBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  stakingYield: number;
  burnRate: number;
  lastUpdated: string;
}

interface FundRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  token: 'DMT' | 'DMTX' | 'SOL';
  category: string;
  requester: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
}

const TreasuryDashboard: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  
  // State management
  const [treasuryStats, setTreasuryStats] = useState<TreasuryStats>({
    totalValue: 0,
    dmtBalance: 0,
    dmtxBalance: 0,
    solBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    stakingYield: 0,
    burnRate: 0,
    lastUpdated: new Date().toISOString(),
  });
  
  const [transactions, setTransactions] = useState<TreasuryTransaction[]>([]);
  const [fundRequests, setFundRequests] = useState<FundRequest[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TreasuryTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Transfer form
  const [transferForm, setTransferForm] = useState({
    amount: '',
    token: 'DMT' as const,
    to: '',
    description: '',
    category: 'operations' as const,
  });
  
  // Fund request form
  const [requestForm, setRequestForm] = useState({
    title: '',
    description: '',
    amount: '',
    token: 'DMT' as const,
    category: 'development' as const,
  });

  // Mock data for demonstration
  const mockTransactions: TreasuryTransaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 50000,
      token: 'DMT',
      description: 'Token sale proceeds',
      from: 'Token Sale Contract',
      to: 'Treasury',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      category: 'governance',
      hash: '0x1234...5678',
    },
    {
      id: '2',
      type: 'expense',
      amount: 15000,
      token: 'DMT',
      description: 'Development team salaries',
      from: 'Treasury',
      to: 'Development Team',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      category: 'development',
      proposalId: '2',
      hash: '0x2345...6789',
    },
    {
      id: '3',
      type: 'staking',
      amount: 25000,
      token: 'DMT',
      description: 'Staking rewards distribution',
      from: 'Staking Contract',
      to: 'Stakers',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      category: 'rewards',
      hash: '0x3456...7890',
    },
    {
      id: '4',
      type: 'burning',
      amount: 5000,
      token: 'DMT',
      description: 'Token burning for deflation',
      from: 'Treasury',
      to: 'Burn Address',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      category: 'governance',
      hash: '0x4567...8901',
    },
  ];

  const mockFundRequests: FundRequest[] = [
    {
      id: '1',
      title: 'Mobile App Development',
      description: 'Fund development of mobile application for better user experience',
      amount: 100000,
      token: 'DMT',
      category: 'development',
      requester: '0x1234...5678',
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      votesFor: 1250,
      votesAgainst: 320,
      totalVotes: 1570,
    },
    {
      id: '2',
      title: 'Marketing Campaign',
      description: 'Launch marketing campaign to increase platform adoption',
      amount: 75000,
      token: 'DMT',
      category: 'marketing',
      requester: '0x2345...6789',
      status: 'approved',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      votesFor: 2100,
      votesAgainst: 450,
      totalVotes: 2550,
    },
  ];

  useEffect(() => {
    loadTreasuryData();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [transactions, filterType, filterCategory, searchQuery]);

  const loadTreasuryData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock treasury stats
      setTreasuryStats({
        totalValue: 1250000,
        dmtBalance: 800000,
        dmtxBalance: 300000,
        solBalance: 150000,
        monthlyIncome: 75000,
        monthlyExpenses: 45000,
        stakingYield: 12.5,
        burnRate: 2.3,
        lastUpdated: new Date().toISOString(),
      });
      
      setTransactions(mockTransactions);
      setFundRequests(mockFundRequests);
      showSuccess('Treasury data loaded successfully');
    } catch (error) {
      showError('Failed to load treasury data');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(tx => tx.category === filterCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tx => 
        tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return '#2ed573';
      case 'expense': return '#ff6b6b';
      case 'transfer': return '#00ffff';
      case 'staking': return '#0984e3';
      case 'burning': return '#fdcb6e';
      default: return '#b0b0b0';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#2ed573';
      case 'pending': return '#fdcb6e';
      case 'failed': return '#ff6b6b';
      default: return '#b0b0b0';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'governance': return '#00ffff';
      case 'development': return '#2ed573';
      case 'marketing': return '#e84393';
      case 'operations': return '#0984e3';
      case 'rewards': return '#fdcb6e';
      default: return '#b0b0b0';
    }
  };

  const handleTransfer = async () => {
    try {
      if (!connected) {
        showError('Please connect your wallet to initiate transfers');
        return;
      }

      if (!transferForm.amount || !transferForm.to || !transferForm.description) {
        showError('Please fill in all required fields');
        return;
      }

      const amount = parseFloat(transferForm.amount);
      if (isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount');
        return;
      }

      // Simulate transfer
      const newTransaction: TreasuryTransaction = {
        id: Date.now().toString(),
        type: 'transfer',
        amount: amount,
        token: transferForm.token,
        description: transferForm.description,
        from: 'Treasury',
        to: transferForm.to,
        timestamp: new Date().toISOString(),
        status: 'pending',
        category: transferForm.category,
        hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setShowTransferModal(false);
      setTransferForm({
        amount: '',
        token: 'DMT',
        to: '',
        description: '',
        category: 'operations',
      });
      
      showSuccess('Transfer initiated successfully');
    } catch (error) {
      showError('Failed to initiate transfer');
    }
  };

  const handleFundRequest = async () => {
    try {
      if (!connected) {
        showError('Please connect your wallet to create fund requests');
        return;
      }

      if (!requestForm.title || !requestForm.description || !requestForm.amount) {
        showError('Please fill in all required fields');
        return;
      }

      const amount = parseFloat(requestForm.amount);
      if (isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount');
        return;
      }

      // Simulate fund request
      const newRequest: FundRequest = {
        id: Date.now().toString(),
        title: requestForm.title,
        description: requestForm.description,
        amount: amount,
        token: requestForm.token,
        category: requestForm.category,
        requester: publicKey?.toBase58() || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        votesFor: 0,
        votesAgainst: 0,
        totalVotes: 0,
      };

      setFundRequests(prev => [newRequest, ...prev]);
      setShowRequestModal(false);
      setRequestForm({
        title: '',
        description: '',
        amount: '',
        token: 'DMT',
        category: 'development',
      });
      
      showSuccess('Fund request created successfully');
    } catch (error) {
      showError('Failed to create fund request');
    }
  };

  const formatAmount = (amount: number, token: string) => {
    return `${amount.toLocaleString()} ${token}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
          <TreasuryIcon sx={{ fontSize: 40 }} />
          Treasury Management
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Manage community treasury and fund allocation
        </Typography>
        
        {/* Treasury Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #2ed573',
              borderRadius: 2
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TreasuryIcon sx={{ color: '#2ed573', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#2ed573' }}>
                    Total Value
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  ${treasuryStats.totalValue.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Treasury assets
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
                  <SavingsIcon sx={{ color: '#0984e3', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#0984e3' }}>
                    DMT Balance
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {formatAmount(treasuryStats.dmtBalance, 'DMT')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Main token
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
                  <TrendingUpIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fdcb6e' }}>
                    Staking Yield
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {treasuryStats.stakingYield}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Annual return
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #ff6b6b',
              borderRadius: 2
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WarningIcon sx={{ color: '#ff6b6b', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#ff6b6b' }}>
                    Burn Rate
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {treasuryStats.burnRate}%
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Monthly deflation
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
                <InputLabel sx={{ color: '#ffffff' }}>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{ color: '#ffffff' }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                  <MenuItem value="staking">Staking</MenuItem>
                  <MenuItem value="burning">Burning</MenuItem>
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
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                  <MenuItem value="rewards">Rewards</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon sx={{ color: '#b0b0b0' }} />
                <input
                  type="text"
                  placeholder="Search transactions..."
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
                  startIcon={<SendIcon />}
                  onClick={() => setShowTransferModal(true)}
                  sx={{
                    backgroundColor: '#0984e3',
                    color: '#ffffff',
                    '&:hover': { backgroundColor: '#0770c4' }
                  }}
                >
                  Transfer
                </Button>
                <Tooltip title="Refresh">
                  <IconButton onClick={loadTreasuryData} disabled={loading}>
                    <RefreshIcon sx={{ color: '#00ffff' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #2ed573',
        borderRadius: 2,
        mb: 3
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#2ed573', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon />
            Recent Transactions ({filteredTransactions.length})
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
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>From/To</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {transaction.type === 'income' && <TrendingUpIcon sx={{ color: '#2ed573', fontSize: 20 }} />}
                          {transaction.type === 'expense' && <TrendingDownIcon sx={{ color: '#ff6b6b', fontSize: 20 }} />}
                          {transaction.type === 'transfer' && <SendIcon sx={{ color: '#00ffff', fontSize: 20 }} />}
                          {transaction.type === 'staking' && <SavingsIcon sx={{ color: '#0984e3', fontSize: 20 }} />}
                          {transaction.type === 'burning' && <WarningIcon sx={{ color: '#fdcb6e', fontSize: 20 }} />}
                          <Chip
                            label={transaction.type.toUpperCase()}
                            sx={{
                              backgroundColor: getTypeColor(transaction.type),
                              color: '#ffffff',
                              fontWeight: 'bold',
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                            {transaction.description}
                          </Typography>
                          <Chip
                            label={transaction.category.toUpperCase()}
                            size="small"
                            sx={{
                              backgroundColor: getCategoryColor(transaction.category),
                              color: '#ffffff',
                              fontSize: '0.6rem',
                              mt: 0.5
                            }}
                          />
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                          {formatAmount(transaction.amount, transaction.token)}
                        </Typography>
                      </TableCell>
                      
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                            From: {transaction.from.substring(0, 20)}...
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                            To: {transaction.to.substring(0, 20)}...
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={transaction.status.toUpperCase()}
                          sx={{
                            backgroundColor: getStatusColor(transaction.status),
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      
                      <TableCell sx={{ color: '#b0b0b0' }}>
                        {formatDate(transaction.timestamp)}
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              sx={{ color: '#00ffff' }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {transaction.hash && (
                            <Tooltip title="View on Explorer">
                              <IconButton 
                                size="small" 
                                sx={{ color: '#0984e3' }}
                              >
                                <AssessmentIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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

      {/* Fund Requests */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #e84393',
        borderRadius: 2
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#e84393', display: 'flex', alignItems: 'center', gap: 1 }}>
              <ReceiptIcon />
              Fund Requests ({fundRequests.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowRequestModal(true)}
              sx={{
                backgroundColor: '#e84393',
                color: '#ffffff',
                '&:hover': { backgroundColor: '#d63384' }
              }}
            >
              Request Funds
            </Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Request</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Amount</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Votes</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fundRequests.map((request) => (
                  <TableRow key={request.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 0.5 }}>
                          {request.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          {request.description.substring(0, 100)}...
                        </Typography>
                        <Chip
                          label={request.category.toUpperCase()}
                          size="small"
                          sx={{
                            backgroundColor: getCategoryColor(request.category),
                            color: '#ffffff',
                            fontSize: '0.6rem',
                            mt: 0.5
                          }}
                        />
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {formatAmount(request.amount, request.token)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip
                        label={request.status.toUpperCase()}
                        sx={{
                          backgroundColor: getStatusColor(request.status),
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
                            {request.votesFor}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingDownIcon sx={{ color: '#ff6b6b', fontSize: 16 }} />
                          <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
                            {request.votesAgainst}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell sx={{ color: '#b0b0b0' }}>
                      {formatDate(request.createdAt)}
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#00ffff' }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {request.status === 'pending' && (
                          <>
                            <Tooltip title="Vote For">
                              <IconButton 
                                size="small" 
                                sx={{ color: '#2ed573' }}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Vote Against">
                              <IconButton 
                                size="small" 
                                sx={{ color: '#ff6b6b' }}
                              >
                                <CancelIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Transfer Modal */}
      <Dialog 
        open={showTransferModal} 
        onClose={() => setShowTransferModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: 'rgba(25, 25, 25, 0.95)', 
          color: '#00ffff',
          borderBottom: '1px solid #00ffff'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SendIcon />
            Initiate Transfer
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)', color: '#ffffff' }}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                  sx={{ 
                    '& .MuiInputLabel-root': { color: '#b0b0b0' },
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#ffffff' }}>Token</InputLabel>
                  <Select
                    value={transferForm.token}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, token: e.target.value as any }))}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="DMT">DMT</MenuItem>
                    <MenuItem value="DMTX">DMTX</MenuItem>
                    <MenuItem value="SOL">SOL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Recipient Address"
                  value={transferForm.to}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, to: e.target.value }))}
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
                  rows={3}
                  label="Description"
                  value={transferForm.description}
                  onChange={(e) => setTransferForm(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ 
                    '& .MuiInputLabel-root': { color: '#b0b0b0' },
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#ffffff' }}>Category</InputLabel>
                  <Select
                    value={transferForm.category}
                    onChange={(e) => setTransferForm(prev => ({ ...prev, category: e.target.value as any }))}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="governance">Governance</MenuItem>
                    <MenuItem value="development">Development</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                    <MenuItem value="operations">Operations</MenuItem>
                    <MenuItem value="rewards">Rewards</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          <Button 
            onClick={() => setShowTransferModal(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleTransfer}
            sx={{ 
              backgroundColor: '#0984e3',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#0770c4' }
            }}
          >
            Initiate Transfer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fund Request Modal */}
      <Dialog 
        open={showRequestModal} 
        onClose={() => setShowRequestModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: 'rgba(25, 25, 25, 0.95)', 
          color: '#e84393',
          borderBottom: '1px solid #e84393'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon />
            Request Funds
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)', color: '#ffffff' }}>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Request Title"
                  value={requestForm.title}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
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
                  value={requestForm.description}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                  sx={{ 
                    '& .MuiInputLabel-root': { color: '#b0b0b0' },
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Amount"
                  value={requestForm.amount}
                  onChange={(e) => setRequestForm(prev => ({ ...prev, amount: e.target.value }))}
                  sx={{ 
                    '& .MuiInputLabel-root': { color: '#b0b0b0' },
                    '& .MuiInputBase-input': { color: '#ffffff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.2)' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#ffffff' }}>Token</InputLabel>
                  <Select
                    value={requestForm.token}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, token: e.target.value as any }))}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="DMT">DMT</MenuItem>
                    <MenuItem value="DMTX">DMTX</MenuItem>
                    <MenuItem value="SOL">SOL</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#ffffff' }}>Category</InputLabel>
                  <Select
                    value={requestForm.category}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, category: e.target.value as any }))}
                    sx={{ color: '#ffffff' }}
                  >
                    <MenuItem value="governance">Governance</MenuItem>
                    <MenuItem value="development">Development</MenuItem>
                    <MenuItem value="marketing">Marketing</MenuItem>
                    <MenuItem value="operations">Operations</MenuItem>
                    <MenuItem value="rewards">Rewards</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          <Button 
            onClick={() => setShowRequestModal(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleFundRequest}
            sx={{ 
              backgroundColor: '#e84393',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#d63384' }
            }}
          >
            Create Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TreasuryDashboard;

