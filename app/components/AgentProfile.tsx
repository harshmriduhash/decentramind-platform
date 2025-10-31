import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
  MenuItem,
} from '@mui/material';
import {
  Star as StarIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  TrendingUp as TrendingIcon,
  Verified as VerifiedIcon,
  FeaturedPlayList as FeaturedIcon,
  Sell as SellIcon,
  ShoppingCart as BuyIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { agentRegistryService, AgentMetadata, AgentRating, AgentListing } from '../services/agentRegistryService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastNotifications';

interface AgentProfileProps {
  agentId: string;
  onClose?: () => void;
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
      id={`agent-tabpanel-${index}`}
      aria-labelledby={`agent-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export const AgentProfile: React.FC<AgentProfileProps> = ({ agentId, onClose }) => {
  const { session } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [agent, setAgent] = useState<AgentMetadata | null>(null);
  const [ratings, setRatings] = useState<AgentRating[]>([]);
  const [listing, setListing] = useState<AgentListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showListingDialog, setShowListingDialog] = useState(false);
  const [userRating, setUserRating] = useState<AgentRating | null>(null);
  
  // Rating form state
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    review: '',
  });

  // Listing form state
  const [listingForm, setListingForm] = useState({
    price: 0,
    currency: 'DMT' as 'DMT' | 'SOL',
    description: '',
  });

  useEffect(() => {
    loadAgentData();
  }, [agentId]);

  const loadAgentData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load agent metadata
      const agentData = await agentRegistryService.getAgentMetadata(agentId);
      if (!agentData) {
        throw new Error('Agent not found');
      }
      setAgent(agentData);

      // Load ratings
      const ratingsData = await agentRegistryService.getAgentRatings(agentId);
      setRatings(ratingsData);

      // Load active listing
      const listingData = await agentRegistryService.getActiveListing(agentId);
      setListing(listingData);

      // Check if user has rated this agent
      if (session.isAuthenticated && session.walletAddress) {
        const userRatingData = await agentRegistryService.getUserRating(agentId, session.walletAddress);
        setUserRating(userRatingData);
      }

      // Increment views
      await agentRegistryService.incrementViews(agentId);

    } catch (error) {
      console.error('Failed to load agent data:', error);
      setError('Failed to load agent data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRateAgent = async () => {
    if (!session.isAuthenticated || !session.walletAddress) {
      showError('Please connect your wallet to rate this agent');
      return;
    }

    if (ratingForm.review.length < 10) {
      showError('Review must be at least 10 characters long');
      return;
    }

    try {
      await agentRegistryService.rateAgent(
        agentId,
        session.sessionId!,
        session.walletAddress,
        ratingForm.rating,
        ratingForm.review
      );

      showSuccess('Rating submitted successfully!');
      setShowRatingDialog(false);
      setRatingForm({ rating: 5, review: '' });
      
      // Reload ratings
      const ratingsData = await agentRegistryService.getAgentRatings(agentId);
      setRatings(ratingsData);
      
      // Update user rating
      const userRatingData = await agentRegistryService.getUserRating(agentId, session.walletAddress);
      setUserRating(userRatingData);

    } catch (error) {
      console.error('Failed to rate agent:', error);
      showError(error instanceof Error ? error.message : 'Failed to submit rating');
    }
  };

  const handleCreateListing = async () => {
    if (!session.isAuthenticated || !session.walletAddress) {
      showError('Please connect your wallet to list this agent');
      return;
    }

    if (listingForm.price <= 0) {
      showError('Please enter a valid price');
      return;
    }

    try {
      await agentRegistryService.createListing(
        agentId,
        session.walletAddress,
        listingForm.price,
        listingForm.currency,
        listingForm.description
      );

      showSuccess('Agent listed for sale successfully!');
      setShowListingDialog(false);
      setListingForm({ price: 0, currency: 'DMT', description: '' });
      
      // Reload listing
      const listingData = await agentRegistryService.getActiveListing(agentId);
      setListing(listingData);

    } catch (error) {
      console.error('Failed to create listing:', error);
      showError(error instanceof Error ? error.message : 'Failed to create listing');
    }
  };

  const handlePurchaseAgent = async () => {
    if (!session.isAuthenticated || !session.walletAddress) {
      showError('Please connect your wallet to purchase this agent');
      return;
    }

    if (!listing) {
      showError('No active listing found');
      return;
    }

    try {
      await agentRegistryService.purchaseAgent(listing.id, session.walletAddress);
      showSuccess('Agent purchased successfully!');
      
      // Reload listing
      const listingData = await agentRegistryService.getActiveListing(agentId);
      setListing(listingData);

    } catch (error) {
      console.error('Failed to purchase agent:', error);
      showError(error instanceof Error ? error.message : 'Failed to purchase agent');
    }
  };

  const handleDownloadAgent = async () => {
    try {
      await agentRegistryService.incrementDownloads(agentId);
      showSuccess('Agent downloaded successfully!');
    } catch (error) {
      console.error('Failed to download agent:', error);
      showError('Failed to download agent');
    }
  };

  const getDomainColor = (domain: string) => {
    const colors: { [key: string]: string } = {
      'Technical': '#2196F3',
      'Learning': '#4CAF50',
      'Health & Wellness': '#FF9800',
      'Creative': '#9C27B0',
      'Business': '#607D8B',
      'Science': '#795548',
    };
    return colors[domain] || '#757575';
  };

  const getDomainIcon = (domain: string) => {
    const icons: { [key: string]: string } = {
      'Technical': '⚙️',
      'Learning': '📚',
      'Health & Wellness': '💪',
      'Creative': '🎨',
      'Business': '💼',
      'Science': '🔬',
    };
    return icons[domain] || '🤖';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !agent) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error || 'Agent not found'}
      </Alert>
    );
  }

  const isOwner = session.isAuthenticated && session.walletAddress === agent.creator;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  bgcolor: getDomainColor(agent.domain), 
                  mr: 2,
                  width: 56,
                  height: 56,
                  fontSize: '1.5rem'
                }}>
                  {getDomainIcon(agent.domain)}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                    {agent.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Chip
                      label={agent.domain}
                      size="small"
                      sx={{ 
                        background: getDomainColor(agent.domain),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                    {agent.verified && (
                      <Tooltip title="Verified Agent">
                        <VerifiedIcon color="success" />
                      </Tooltip>
                    )}
                    {agent.featured && (
                      <Tooltip title="Featured Agent">
                        <FeaturedIcon color="warning" />
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {agent.description}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Rating value={agent.rating} readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({agent.reviewCount} reviews)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {agent.views} views
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {agent.downloads} downloads
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h3" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                  Level {agent.level}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {agent.xp} XP
                </Typography>

                {/* Progress to next level */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    XP to next level: {Math.max(0, 100 - (agent.xp % 100))}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(agent.xp % 100)} 
                    sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                  />
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadAgent}
                    sx={{ 
                      background: 'linear-gradient(45deg, #2ed573, #00b894)',
                      color: 'white'
                    }}
                  >
                    Download Agent
                  </Button>

                  {!userRating && session.isAuthenticated && (
                    <Button
                      variant="outlined"
                      startIcon={<CommentIcon />}
                      onClick={() => setShowRatingDialog(true)}
                      sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                    >
                      Rate Agent
                    </Button>
                  )}

                  {isOwner && !listing && (
                    <Button
                      variant="outlined"
                      startIcon={<SellIcon />}
                      onClick={() => setShowListingDialog(true)}
                      sx={{ borderColor: '#ffc107', color: '#ffc107' }}
                    >
                      List for Sale
                    </Button>
                  )}

                  {listing && !isOwner && session.isAuthenticated && (
                    <Button
                      variant="contained"
                      startIcon={<BuyIcon />}
                      onClick={handlePurchaseAgent}
                      sx={{ 
                        background: 'linear-gradient(45deg, #ffc107, #ff9800)',
                        color: 'black'
                      }}
                    >
                      Buy for {listing.price} {listing.currency}
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ color: '#00ffff' }}>
          <Tab label="Overview" />
          <Tab label="Skills & Performance" />
          <Tab label="Evolution History" />
          <Tab label="Reviews" />
          <Tab label="Marketplace" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                  Agent Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Creator" 
                      secondary={agent.creator} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <HistoryIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Created" 
                      secondary={new Date(agent.createdAt).toLocaleDateString()} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AssessmentIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Last Updated" 
                      secondary={new Date(agent.lastUpdated).toLocaleDateString()} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                  Performance Stats
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Tasks Completed" 
                      secondary={agent.performance.tasksCompleted} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <StarIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Success Rate" 
                      secondary={`${agent.performance.successRate}%`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <ViewIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Average Response Time" 
                      secondary={`${agent.performance.averageResponseTime}ms`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingIcon color="action" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Total Earnings" 
                      secondary={`${agent.performance.totalEarnings} DMT`} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Skills & Performance Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
              Skills & Capabilities
            </Typography>
            <Box sx={{ mb: 3 }}>
              {agent.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  sx={{ mr: 1, mb: 1, background: '#2ed573', color: 'white' }}
                />
              ))}
            </Box>

            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
              Tags
            </Typography>
            <Box>
              {agent.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1, borderColor: '#00ffff', color: '#00ffff' }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Evolution History Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
              Evolution History
            </Typography>
            {agent.evolutionHistory.length === 0 ? (
              <Typography color="text.secondary">
                No evolution history available
              </Typography>
            ) : (
              <List>
                {agent.evolutionHistory.map((evolution, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrendingIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Level ${evolution.previousLevel} → Level ${evolution.newLevel}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(evolution.timestamp).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            DMT Spent: {evolution.dmtSpent}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Reason: {evolution.reason}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Reviews Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#00ffff' }}>
                Reviews ({ratings.length})
              </Typography>
              {!userRating && session.isAuthenticated && (
                <Button
                  variant="outlined"
                  startIcon={<CommentIcon />}
                  onClick={() => setShowRatingDialog(true)}
                  sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                >
                  Write Review
                </Button>
              )}
            </Box>

            {ratings.length === 0 ? (
              <Typography color="text.secondary">
                No reviews yet. Be the first to review this agent!
              </Typography>
            ) : (
              <List>
                {ratings.map((rating) => (
                  <ListItem key={rating.id} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: '#2ed573' }}>
                        {rating.userWallet.slice(0, 2).toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={rating.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            by {rating.userWallet.slice(0, 4)}...{rating.userWallet.slice(-4)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {rating.review}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(rating.timestamp).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Marketplace Tab */}
      <TabPanel value={tabValue} index={4}>
        <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
              Marketplace Status
            </Typography>

            {listing ? (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  This agent is currently listed for sale
                </Alert>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" sx={{ color: '#ffc107' }}>
                      {listing.price} {listing.currency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Listed by: {listing.seller.slice(0, 4)}...{listing.seller.slice(-4)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Listed: {new Date(listing.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    {listing.description && (
                      <Typography variant="body2" color="text.secondary">
                        {listing.description}
                      </Typography>
                    )}
                    {!isOwner && session.isAuthenticated && (
                      <Button
                        variant="contained"
                        startIcon={<BuyIcon />}
                        onClick={handlePurchaseAgent}
                        sx={{ 
                          background: 'linear-gradient(45deg, #ffc107, #ff9800)',
                          color: 'black',
                          mt: 2
                        }}
                      >
                        Buy Now
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box>
                <Alert severity="success" sx={{ mb: 2 }}>
                  This agent is not currently listed for sale
                </Alert>
                {isOwner && (
                  <Button
                    variant="outlined"
                    startIcon={<SellIcon />}
                    onClick={() => setShowListingDialog(true)}
                    sx={{ borderColor: '#ffc107', color: '#ffc107' }}
                  >
                    List for Sale
                  </Button>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onClose={() => setShowRatingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate {agent.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={ratingForm.rating}
              onChange={(_, value) => setRatingForm(prev => ({ ...prev, rating: value || 5 }))}
              size="large"
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Review"
            value={ratingForm.review}
            onChange={(e) => setRatingForm(prev => ({ ...prev, review: e.target.value }))}
            placeholder="Share your experience with this agent..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRatingDialog(false)}>Cancel</Button>
          <Button onClick={handleRateAgent} variant="contained">
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>

      {/* Listing Dialog */}
      <Dialog open={showListingDialog} onClose={() => setShowListingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>List {agent.name} for Sale</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={listingForm.price}
                onChange={(e) => setListingForm(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Currency"
                value={listingForm.currency}
                onChange={(e) => setListingForm(prev => ({ ...prev, currency: e.target.value as 'DMT' | 'SOL' }))}
              >
                <MenuItem value="DMT">DMT</MenuItem>
                <MenuItem value="SOL">SOL</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description (Optional)"
                value={listingForm.description}
                onChange={(e) => setListingForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe why someone should buy this agent..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowListingDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateListing} variant="contained">
            List for Sale
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 