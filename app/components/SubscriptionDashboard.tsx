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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Upgrade as UpgradeIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as TrophyIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Analytics as AnalyticsIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  School as EducationIcon,
  Brush as CreativeIcon,
  Code as TechIcon,
  Science as ScienceIcon,
  FitnessCenter as HealthIcon,
} from '@mui/icons-material';
import SubscriptionService from '../services/subscriptionService';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastNotifications';

interface SubscriptionTier {
  name: string;
  price: number;
  credits: number;
  features: string[];
  color: string;
  icon: React.ReactNode;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Freemium',
    price: 0,
    credits: 5,
    features: [
      'Basic AI Agent Creation',
      'Limited Chat Sessions',
      'Standard Support',
      'Community Access'
    ],
    color: '#6c757d',
    icon: <StarIcon />
  },
  {
    name: 'Basic',
    price: 9,
    credits: 20,
    features: [
      'Enhanced AI Agents',
      'Extended Chat Sessions',
      'Priority Support',
      'Advanced Analytics',
      'Custom Agent Training'
    ],
    color: '#007bff',
    icon: <TrendingUpIcon />
  },
  {
    name: 'Pro',
    price: 29,
    credits: 50,
    features: [
      'Unlimited AI Agents',
      'Unlimited Chat Sessions',
      '24/7 Premium Support',
      'Advanced Analytics',
      'Custom Agent Training',
      'Voice Integration',
      'API Access',
      'Team Collaboration'
    ],
    color: '#28a745',
    icon: <TrophyIcon />
  },
  {
    name: 'Enterprise',
    price: 99,
    credits: 200,
    features: [
      'Everything in Pro',
      'Custom AI Models',
      'Dedicated Support',
      'White-label Solutions',
      'Advanced Security',
      'Custom Integrations',
      'SLA Guarantees',
      'Onboarding Support'
    ],
    color: '#dc3545',
    icon: <BusinessIcon />
  }
];

const SubscriptionDashboard: React.FC = () => {
  const { publicKey } = useWallet();
  const { session } = useAuth();
  const { showToast } = useToast();
  
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState<boolean>(false);
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([]);
  const [creditHistory, setCreditHistory] = useState<any[]>([]);

  const subscriptionService = SubscriptionService;

  useEffect(() => {
    // Temporarily remove authentication requirement for testing
    loadSubscriptionData();
  }, [publicKey, session.isAuthenticated]);

  const loadSubscriptionData = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    try {
      const userId = publicKey.toBase58();
      
      // Load current subscription
      const subscription = await subscriptionService.getUserSubscription(userId);
      setCurrentSubscription(subscription);
      
      // Load credit balance
      if (subscription) {
        setCreditBalance(subscription.creditsRemaining || 0);
      }
      
      // TODO: Implement subscription history
      // const history = await subscriptionService.getSubscriptionHistory(userId);
      // setSubscriptionHistory(history);
      
      // TODO: Implement credit history
      // const creditHistory = await subscriptionService.getCreditHistory(userId);
      // setCreditHistory(creditHistory);
      
    } catch (error) {
      console.error('Failed to load subscription data:', error);
      showToast('Failed to load subscription data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!publicKey) {
      showToast('Please connect your wallet', 'error');
      return;
    }

    setSelectedTier(tier);
    setShowUpgradeDialog(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedTier || !publicKey) return;
    
    setLoading(true);
    try {
      const userId = publicKey.toBase58();
      const result = await subscriptionService.subscribe(userId, selectedTier.name.toLowerCase());
      
      if (result.success) {
        showToast(`Successfully subscribed to ${selectedTier.name} tier!`, 'success');
        await loadSubscriptionData();
        setShowUpgradeDialog(false);
      } else {
        showToast(result.error || 'Subscription failed', 'error');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      showToast('Subscription failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUseCredits = async (amount: number) => {
    if (!publicKey) return;
    
    try {
      const userId = publicKey.toBase58();
      const result = await subscriptionService.useCredits(userId, amount);
      
      if (result) {
        showToast(`Used ${amount} credits`, 'success');
        await loadSubscriptionData();
      } else {
        showToast('Insufficient credits', 'error');
      }
    } catch (error) {
      console.error('Credit usage error:', error);
      showToast('Failed to use credits', 'error');
    }
  };

  const getCurrentTier = () => {
    if (!currentSubscription) return null;
    return subscriptionTiers.find(tier => 
      tier.name.toLowerCase() === currentSubscription.tier
    );
  };

  const getCurrentTierIndex = () => {
    const currentTier = getCurrentTier();
    return currentTier ? subscriptionTiers.indexOf(currentTier) : -1;
  };

  const canAccessFeature = (feature: string) => {
    const currentTier = getCurrentTier();
    if (!currentTier) return false;
    
    const currentIndex = subscriptionTiers.indexOf(currentTier);
    const featureTier = subscriptionTiers.find(tier => 
      tier.features.includes(feature)
    );
    
    if (!featureTier) return true; // Feature available to all
    return subscriptionTiers.indexOf(featureTier) <= currentIndex;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
          Loading subscription data...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
        🎯 Subscription Dashboard
      </Typography>

      {/* Current Subscription Status */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff', 
        borderRadius: 3,
        mb: 3
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
            Current Subscription
          </Typography>
          
          {currentSubscription ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Chip
                    label={currentSubscription.tier.toUpperCase()}
                    color="primary"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    {getCurrentTier()?.name}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Active since {new Date(currentSubscription.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  Credit Balance
                </Typography>
                <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                  {creditBalance}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Credits remaining
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  startIcon={<UpgradeIcon />}
                  onClick={() => setShowUpgradeDialog(true)}
                  sx={{ 
                    background: '#00ffff',
                    color: 'black',
                    '&:hover': { background: '#00cccc' }
                  }}
                >
                  Upgrade Plan
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              No active subscription. Choose a plan to get started!
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Subscription Tiers */}
      <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
        Available Plans
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {subscriptionTiers.map((tier, index) => {
          const isCurrentTier = getCurrentTier()?.name === tier.name;
          const isUpgrade = getCurrentTierIndex() < index;
          const isDowngrade = getCurrentTierIndex() > index;
          
          return (
            <Grid item xs={12} md={6} lg={3} key={tier.name}>
              <Card sx={{ 
                background: 'rgba(25, 25, 25, 0.9)', 
                border: `2px solid ${tier.color}`, 
                borderRadius: 3,
                height: '100%',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${tier.color}40`,
                },
              }}>
                {isCurrentTier && (
                  <Badge
                    badgeContent="CURRENT"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      zIndex: 1
                    }}
                  />
                )}
                
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      background: tier.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                    }}>
                      {tier.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {tier.name}
                      </Typography>
                      <Typography variant="h4" sx={{ color: tier.color, fontWeight: 'bold' }}>
                        ${tier.price}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {tier.credits} credits included
                  </Typography>
                  
                  <List dense>
                    {tier.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircleIcon sx={{ color: tier.color, fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature}
                          sx={{ 
                            '& .MuiListItemText-primary': { 
                              color: 'white',
                              fontSize: '0.875rem'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 2 }}>
                    {isCurrentTier ? (
                      <Button
                        variant="outlined"
                        fullWidth
                        disabled
                        sx={{ borderColor: tier.color, color: tier.color }}
                      >
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleSubscribe(tier)}
                        sx={{ 
                          background: tier.color,
                          '&:hover': { background: tier.color, opacity: 0.8 }
                        }}
                      >
                        {isUpgrade ? 'Upgrade' : isDowngrade ? 'Downgrade' : 'Subscribe'}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Feature Access Matrix */}
      <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
        Feature Access
      </Typography>
      
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff', 
        borderRadius: 3,
        mb: 3
      }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Feature</TableCell>
                  {subscriptionTiers.map(tier => (
                    <TableCell key={tier.name} sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                      {tier.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  'Basic AI Agent Creation',
                  'Enhanced AI Agents',
                  'Unlimited AI Agents',
                  'Custom AI Models',
                  'Advanced Analytics',
                  'Voice Integration',
                  'API Access',
                  'Team Collaboration',
                  'Custom Integrations',
                  'Dedicated Support'
                ].map(feature => (
                  <TableRow key={feature}>
                    <TableCell sx={{ color: 'white' }}>{feature}</TableCell>
                    {subscriptionTiers.map(tier => {
                      const hasAccess = tier.features.includes(feature);
                      return (
                        <TableCell key={tier.name} sx={{ textAlign: 'center' }}>
                          {hasAccess ? (
                            <CheckCircleIcon sx={{ color: '#28a745' }} />
                          ) : (
                            <LockIcon sx={{ color: '#6c757d' }} />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Credit Usage */}
      <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
        Credit Management
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #00ffff', 
            borderRadius: 3
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Quick Credit Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleUseCredits(1)}
                    disabled={creditBalance < 1}
                    sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                  >
                    Use 1 Credit
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleUseCredits(5)}
                    disabled={creditBalance < 5}
                    sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                  >
                    Use 5 Credits
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #00ffff', 
            borderRadius: 3
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Credit Usage History
              </Typography>
              
              {creditHistory.length > 0 ? (
                <List dense>
                  {creditHistory.slice(0, 5).map((item, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CreditCardIcon sx={{ color: '#00ffff' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${item.amount} credits used`}
                        secondary={new Date(item.timestamp).toLocaleDateString()}
                        sx={{ 
                          '& .MuiListItemText-primary': { color: 'white' },
                          '& .MuiListItemText-secondary': { color: 'text.secondary' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No credit usage history yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upgrade Dialog */}
      <Dialog 
        open={showUpgradeDialog} 
        onClose={() => setShowUpgradeDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'white', background: 'rgba(25, 25, 25, 0.95)' }}>
          {selectedTier ? `Subscribe to ${selectedTier.name}` : 'Subscribe'}
        </DialogTitle>
        <DialogContent sx={{ background: 'rgba(25, 25, 25, 0.95)' }}>
          {selectedTier && (
            <Box>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Plan Details
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                Price: ${selectedTier.price}
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                Credits: {selectedTier.credits}
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
                Features: {selectedTier.features.length} included
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                {selectedTier.price > 0 
                  ? `20% of the subscription fee ($${(selectedTier.price * 0.2).toFixed(2)}) will be burned as DMT`
                  : 'No DMT will be burned for free tier'
                }
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ background: 'rgba(25, 25, 25, 0.95)' }}>
          <Button 
            onClick={() => setShowUpgradeDialog(false)}
            sx={{ color: 'white' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmSubscription}
            variant="contained"
            disabled={loading}
            sx={{ 
              background: selectedTier?.color || '#00ffff',
              '&:hover': { background: selectedTier?.color || '#00cccc' }
            }}
          >
            {loading ? 'Processing...' : 'Confirm Subscription'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionDashboard; 