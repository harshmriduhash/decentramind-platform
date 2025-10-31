"use client";

import React, { useState, useEffect } from 'react';
import LiveTokenExplorer from './LiveTokenExplorer';
import TaskLog from './TaskLog';
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
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Notifications as NotificationsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Analytics as AnalyticsIcon,
  AccountBalance as AccountBalanceIcon,
  Speed as SpeedIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  AutoAwesome as AutoAwesomeIcon,
  Token as TokenIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from './ToastNotifications';

// Types for Crypto Alpha data
interface TokenProject {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  type: 'meme' | 'defi' | 'launch' | 'utility';
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  marketCap: number;
  liquidity: number;
  volume24h: number;
  holders: number;
  socialScore: number;
  auditStatus: 'passed' | 'failed' | 'pending';
  rugRisk: number;
  honeypotRisk: number;
  taxRate: number;
  gasOptimized: boolean;
  communityTrust: number;
  developerTrackRecord: number;
  timestamp: string;
  source: string;
  priceChange24h: number;
  isTracked: boolean;
  isIgnored: boolean;
}

interface AuditDetail {
  contractAddress: string;
  securityScore: number;
  rugRisk: number;
  honeypotRisk: number;
  taxRate: number;
  gasOptimized: boolean;
  functions: string[];
  vulnerabilities: string[];
  recommendations: string[];
  auditDate: string;
}

const CryptoAlphaDashboard: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  
  // State management
  const [alphaFeed, setAlphaFeed] = useState<TokenProject[]>([]);
  const [filteredFeed, setFilteredFeed] = useState<TokenProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenProject | null>(null);
  const [auditDetails, setAuditDetails] = useState<AuditDetail | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoTracking, setAutoTracking] = useState(false);
  const [trackedTokens, setTrackedTokens] = useState<Set<string>>(new Set());
  const [ignoredTokens, setIgnoredTokens] = useState<Set<string>>(new Set());

  // Mock data for demonstration
  const mockTokens: TokenProject[] = [
    {
      id: '1',
      name: 'DogeKiller',
      symbol: 'DOGEK',
      contractAddress: '0x1234...5678',
      type: 'meme',
      score: 85,
      riskLevel: 'low',
      marketCap: 2500000,
      liquidity: 1800000,
      volume24h: 450000,
      holders: 1250,
      socialScore: 78,
      auditStatus: 'passed',
      rugRisk: 15,
      honeypotRisk: 5,
      taxRate: 2,
      gasOptimized: true,
      communityTrust: 82,
      developerTrackRecord: 75,
      timestamp: new Date().toISOString(),
      source: 'PumpFun',
      priceChange24h: 15.5,
      isTracked: false,
      isIgnored: false,
    },
    {
      id: '2',
      name: 'AlphaDeFi',
      symbol: 'ALPHA',
      contractAddress: '0x2345...6789',
      type: 'defi',
      score: 92,
      riskLevel: 'low',
      marketCap: 5000000,
      liquidity: 3200000,
      volume24h: 890000,
      holders: 2100,
      socialScore: 88,
      auditStatus: 'passed',
      rugRisk: 8,
      honeypotRisk: 2,
      taxRate: 1,
      gasOptimized: true,
      communityTrust: 91,
      developerTrackRecord: 89,
      timestamp: new Date().toISOString(),
      source: 'DEXTools',
      priceChange24h: 28.3,
      isTracked: false,
      isIgnored: false,
    },
    {
      id: '3',
      name: 'ScamCoin',
      symbol: 'SCAM',
      contractAddress: '0x3456...7890',
      type: 'meme',
      score: 25,
      riskLevel: 'high',
      marketCap: 50000,
      liquidity: 25000,
      volume24h: 15000,
      holders: 45,
      socialScore: 15,
      auditStatus: 'failed',
      rugRisk: 95,
      honeypotRisk: 88,
      taxRate: 15,
      gasOptimized: false,
      communityTrust: 12,
      developerTrackRecord: 5,
      timestamp: new Date().toISOString(),
      source: 'PumpFun',
      priceChange24h: -45.2,
      isTracked: false,
      isIgnored: false,
    },
  ];

  useEffect(() => {
    loadAlphaFeed();
  }, []);

  useEffect(() => {
    filterFeed();
  }, [alphaFeed, filterType, filterRisk, searchQuery]);

  const loadAlphaFeed = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAlphaFeed(mockTokens);
      showSuccess('Alpha feed updated with latest opportunities');
    } catch (error) {
      showError('Failed to load alpha feed');
    } finally {
      setLoading(false);
    }
  };

  const filterFeed = () => {
    let filtered = alphaFeed;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(token => token.type === filterType);
    }

    // Filter by risk level
    if (filterRisk !== 'all') {
      filtered = filtered.filter(token => token.riskLevel === filterRisk);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(token => 
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFeed(filtered);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#2ed573';
    if (score >= 60) return '#fdcb6e';
    return '#ff6b6b';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#2ed573';
      case 'medium': return '#fdcb6e';
      case 'high': return '#ff6b6b';
      default: return '#b0b0b0';
    }
  };

  const handleTrackToken = async (token: TokenProject) => {
    try {
      if (!connected) {
        showError('Please connect your wallet to track tokens');
        return;
      }

      setTrackedTokens(prev => new Set([...prev, token.id]));
      setAlphaFeed(prev => prev.map(t => 
        t.id === token.id ? { ...t, isTracked: true } : t
      ));
      
      showSuccess(`Now tracking ${token.name} (${token.symbol})`);
      
      if (notificationsEnabled) {
        showInfo(`You'll receive alerts for ${token.symbol} price movements`);
      }
    } catch (error) {
      showError('Failed to track token');
    }
  };

  const handleIgnoreToken = async (token: TokenProject) => {
    try {
      setIgnoredTokens(prev => new Set([...prev, token.id]));
      setAlphaFeed(prev => prev.map(t => 
        t.id === token.id ? { ...t, isIgnored: true } : t
      ));
      
      showInfo(`${token.name} (${token.symbol}) ignored`);
    } catch (error) {
      showError('Failed to ignore token');
    }
  };

  const handleViewAudit = async (token: TokenProject) => {
    setSelectedToken(token);
    
    // Mock audit details
    const audit: AuditDetail = {
      contractAddress: token.contractAddress,
      securityScore: token.score,
      rugRisk: token.rugRisk,
      honeypotRisk: token.honeypotRisk,
      taxRate: token.taxRate,
      gasOptimized: token.gasOptimized,
      functions: ['transfer', 'approve', 'transferFrom', 'mint', 'burn'],
      vulnerabilities: token.rugRisk > 50 ? ['High rug pull risk', 'Suspicious ownership'] : [],
      recommendations: token.gasOptimized ? ['Contract is gas optimized'] : ['Consider gas optimization'],
      auditDate: new Date().toISOString(),
    };
    
    setAuditDetails(audit);
    setShowAuditModal(true);
  };

  const handleRefreshFeed = () => {
    loadAlphaFeed();
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
          <AutoAwesomeIcon sx={{ fontSize: 40 }} />
          Crypto Alpha Assistant
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Discover and evaluate promising crypto tokens and projects
        </Typography>
        
        {/* Live Token Explorer */}
        <LiveTokenExplorer />
        
        {/* Status Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #00ffff',
              borderRadius: 2
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ color: '#2ed573', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#2ed573' }}>
                    High Alpha
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {filteredFeed.filter(t => t.score >= 80).length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Tokens with score ≥80
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
                  <WarningIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fdcb6e' }}>
                    Medium Risk
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {filteredFeed.filter(t => t.riskLevel === 'medium').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Moderate risk tokens
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
                  <SecurityIcon sx={{ color: '#ff6b6b', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#ff6b6b' }}>
                    High Risk
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {filteredFeed.filter(t => t.riskLevel === 'high').length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  High risk tokens
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
                  <StarIcon sx={{ color: '#0984e3', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#0984e3' }}>
                    Tracked
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                  {trackedTokens.size}
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Active tracking
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#ffffff' }}>Token Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{ color: '#ffffff' }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="meme">Meme</MenuItem>
                  <MenuItem value="defi">DeFi</MenuItem>
                  <MenuItem value="launch">Launch</MenuItem>
                  <MenuItem value="utility">Utility</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#ffffff' }}>Risk Level</InputLabel>
                <Select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  sx={{ color: '#ffffff' }}
                >
                  <MenuItem value="all">All Risk Levels</MenuItem>
                  <MenuItem value="low">Low Risk</MenuItem>
                  <MenuItem value="medium">Medium Risk</MenuItem>
                  <MenuItem value="high">High Risk</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon sx={{ color: '#b0b0b0' }} />
                <input
                  type="text"
                  placeholder="Search tokens..."
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
                <Tooltip title="Refresh Feed">
                  <IconButton onClick={handleRefreshFeed} disabled={loading}>
                    <RefreshIcon sx={{ color: '#00ffff' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Notifications">
                  <IconButton onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
                    {notificationsEnabled ? 
                      <NotificationsIcon sx={{ color: '#2ed573' }} /> : 
                      <NotificationsIcon sx={{ color: '#b0b0b0' }} />
                    }
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Alpha Feed */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #2ed573',
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#2ed573', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon />
            Alpha Feed ({filteredFeed.length} tokens)
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
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Token</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Score</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Risk</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Market Cap</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>24h Change</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Source</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFeed.map((token) => (
                    <TableRow key={token.id} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: token.type === 'meme' ? '#e84393' : 
                                    token.type === 'defi' ? '#0984e3' : '#fdcb6e',
                            width: 40,
                            height: 40
                          }}>
                            {token.symbol.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                              {token.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                              {token.symbol}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={`${token.score}/100`}
                          sx={{
                            backgroundColor: getScoreColor(token.score),
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <Chip
                          label={token.riskLevel.toUpperCase()}
                          sx={{
                            backgroundColor: getRiskColor(token.riskLevel),
                            color: '#ffffff',
                            fontWeight: 'bold'
                          }}
                        />
                      </TableCell>
                      
                      <TableCell sx={{ color: '#ffffff' }}>
                        ${(token.marketCap / 1000000).toFixed(2)}M
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {token.priceChange24h > 0 ? (
                            <TrendingUpIcon sx={{ color: '#2ed573', fontSize: 16 }} />
                          ) : (
                            <TrendingDownIcon sx={{ color: '#ff6b6b', fontSize: 16 }} />
                          )}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: token.priceChange24h > 0 ? '#2ed573' : '#ff6b6b',
                              fontWeight: 'bold'
                            }}
                          >
                            {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      <TableCell sx={{ color: '#b0b0b0' }}>
                        {token.source}
                      </TableCell>
                      
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Audit Details">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewAudit(token)}
                              sx={{ color: '#00ffff' }}
                            >
                              <SecurityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {!token.isTracked && !token.isIgnored && (
                            <>
                              <Tooltip title="Track Token">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleTrackToken(token)}
                                  sx={{ color: '#2ed573' }}
                                >
                                  <StarBorderIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              <Tooltip title="Ignore Token">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleIgnoreToken(token)}
                                  sx={{ color: '#ff6b6b' }}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          
                          {token.isTracked && (
                            <Chip label="Tracked" size="small" sx={{ backgroundColor: '#2ed573', color: '#ffffff' }} />
                          )}
                          
                          {token.isIgnored && (
                            <Chip label="Ignored" size="small" sx={{ backgroundColor: '#b0b0b0', color: '#ffffff' }} />
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

      {/* Audit Detail Modal */}
      <Dialog 
        open={showAuditModal} 
        onClose={() => setShowAuditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          backgroundColor: 'rgba(25, 25, 25, 0.95)', 
          color: '#00ffff',
          borderBottom: '1px solid #00ffff'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SecurityIcon />
            Security Audit Report
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)', color: '#ffffff' }}>
          {selectedToken && auditDetails && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                    Token Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Name:</Typography>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>{selectedToken.name}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Symbol:</Typography>
                    <Typography variant="body1" sx={{ color: '#ffffff' }}>{selectedToken.symbol}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Contract:</Typography>
                    <Typography variant="body1" sx={{ color: '#ffffff', fontFamily: 'monospace' }}>
                      {selectedToken.contractAddress}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                    Security Metrics
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Overall Score:</Typography>
                    <Chip 
                      label={`${auditDetails.securityScore}/100`}
                      sx={{ 
                        backgroundColor: getScoreColor(auditDetails.securityScore),
                        color: '#ffffff',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Rug Risk:</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={auditDetails.rugRisk} 
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: auditDetails.rugRisk > 50 ? '#ff6b6b' : '#2ed573'
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#ffffff', mt: 0.5 }}>
                      {auditDetails.rugRisk}%
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Honeypot Risk:</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={auditDetails.honeypotRisk} 
                      sx={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: auditDetails.honeypotRisk > 30 ? '#ff6b6b' : '#2ed573'
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#ffffff', mt: 0.5 }}>
                      {auditDetails.honeypotRisk}%
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                    Contract Functions
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {auditDetails.functions.map((func, index) => (
                      <Chip 
                        key={index}
                        label={func}
                        size="small"
                        sx={{ 
                          backgroundColor: 'rgba(0, 255, 255, 0.1)',
                          color: '#00ffff',
                          border: '1px solid #00ffff'
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
                
                {auditDetails.vulnerabilities.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#ff6b6b', mb: 2 }}>
                      Vulnerabilities
                    </Typography>
                    {auditDetails.vulnerabilities.map((vuln, index) => (
                      <Alert key={index} severity="error" sx={{ mb: 1 }}>
                        {vuln}
                      </Alert>
                    ))}
                  </Grid>
                )}
                
                {auditDetails.recommendations.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#2ed573', mb: 2 }}>
                      Recommendations
                    </Typography>
                    {auditDetails.recommendations.map((rec, index) => (
                      <Alert key={index} severity="success" sx={{ mb: 1 }}>
                        {rec}
                      </Alert>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          <Button 
            onClick={() => setShowAuditModal(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Close
          </Button>
          {selectedToken && !selectedToken.isTracked && !selectedToken.isIgnored && (
            <Button 
              onClick={() => {
                handleTrackToken(selectedToken);
                setShowAuditModal(false);
              }}
              sx={{ 
                backgroundColor: '#2ed573',
                color: '#ffffff',
                '&:hover': { backgroundColor: '#26c965' }
              }}
            >
              Track Token
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Task Log */}
      <Box sx={{ mt: 4 }}>
        <TaskLog 
          agentId="agent-crypto" 
          agentName="Crypto Alpha Assistant"
          maxEntries={8}
        />
      </Box>
    </Container>
  );
};

export default CryptoAlphaDashboard;
