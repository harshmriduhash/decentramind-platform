'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Lock as LockIcon,
  CheckCircle as CheckIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Gavel as GavelIcon,
  FlashOn as FlashIcon,
} from '@mui/icons-material';
import { userTierService, UserTier, UserProfile } from '../services/userTierService';
import { tokenIntegrationService } from '../services/tokenIntegrationService';
import daoService from '../services/daoService';

interface AgentAccessControlProps {
  agentTier: 'mini-llm' | 'pro-llm' | 'custom-llm' | 'private-decentralized';
  userProfile: UserProfile;
  onAccessGranted: () => void;
  onUpgradeRequired: (upgradeInfo: any) => void;
}

interface AccessRequirement {
  type: 'subscription' | 'tokens' | 'dao';
  met: boolean;
  description: string;
  action?: string;
  cost?: {
    dmt?: number;
    dmtx?: number;
    subscription?: string;
  };
}

const AgentAccessControl: React.FC<AgentAccessControlProps> = ({
  agentTier,
  userProfile,
  onAccessGranted,
  onUpgradeRequired
}) => {
  const [accessRequirements, setAccessRequirements] = useState<AccessRequirement[]>([]);
  const [canAccess, setCanAccess] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<any>(null);
  const [userTier, setUserTier] = useState<UserTier | null>(null);

  useEffect(() => {
    checkAccess();
  }, [agentTier, userProfile]);

  const checkAccess = async () => {
    const tier = userTierService.determineUserTier(userProfile);
    setUserTier(tier);
    
    const balance = await tokenIntegrationService.getTokenBalance(userProfile.id);
    setTokenBalance(balance);

    const requirements: AccessRequirement[] = [];
    let hasAccess = false;

    // Check subscription-based access
    if (tier.benefits.agentAccess.includes(agentTier)) {
      hasAccess = true;
      requirements.push({
        type: 'subscription',
        met: true,
        description: `Access granted via ${tier.name} subscription`
      });
    } else {
      // Check token-based access
      const tokenRequirements = getTokenRequirements(agentTier);
      const hasTokenAccess = checkTokenAccess(balance, tokenRequirements);
      
      if (hasTokenAccess) {
        hasAccess = true;
        requirements.push({
          type: 'tokens',
          met: true,
          description: `Access granted via token holdings`
        });
      } else {
        requirements.push({
          type: 'tokens',
          met: false,
          description: `Insufficient tokens for ${agentTier} access`,
          action: 'Stake more tokens',
          cost: tokenRequirements
        });
      }

      // Check DAO requirements for private decentralized agents
      if (agentTier === 'private-decentralized') {
        const daoAccess = await checkDaoAccess(userProfile.id, tier, balance);
        if (daoAccess.canAccess) {
          hasAccess = true;
          requirements.push({
            type: 'dao',
            met: true,
            description: 'Access granted via DAO membership'
          });
        } else {
          requirements.push({
            type: 'dao',
            met: false,
            description: 'DAO vote required for private decentralized agents',
            action: 'Submit DAO proposal'
          });
        }
      }
    }

    setAccessRequirements(requirements);
    setCanAccess(hasAccess);

    if (hasAccess) {
      onAccessGranted();
    }
  };

  const getTokenRequirements = (tier: string) => {
    const requirements: any = {};
    
    switch (tier) {
      case 'pro-llm':
        requirements.dmt = 500;
        break;
      case 'custom-llm':
        requirements.dmt = 2000;
        requirements.dmtx = 50;
        break;
      case 'private-decentralized':
        requirements.dmt = 5000;
        requirements.dmtx = 100;
        break;
    }
    
    return requirements;
  };

  const checkTokenAccess = (balance: any, requirements: any) => {
    if (requirements.dmt && balance.dmt < requirements.dmt) return false;
    if (requirements.dmtx && balance.dmtx < requirements.dmtx) return false;
    return true;
  };

  const checkDaoAccess = async (userId: string, tier: UserTier, balance: any) => {
    // Simple access check based on tier and balance
    const hasMinimumBalance = balance.dmt >= 100; // Minimum 100 DMT for DAO access
    return {
      canAccess: hasMinimumBalance,
      reason: hasMinimumBalance ? 'Access granted' : 'Insufficient DMT balance for DAO access'
    };
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'mini-llm': return <PsychologyIcon />;
      case 'pro-llm': return <TrendingUpIcon />;
      case 'custom-llm': return <DiamondIcon />;
      case 'private-decentralized': return <DiamondIcon />;
      default: return <PsychologyIcon />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'mini-llm': return '#4caf50';
      case 'pro-llm': return '#2196f3';
      case 'custom-llm': return '#ff9800';
      case 'private-decentralized': return '#9c27b0';
      default: return '#6c757d';
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'mini-llm': return 'Mini LLM';
      case 'pro-llm': return 'Pro LLM';
      case 'custom-llm': return 'Custom LLM';
      case 'private-decentralized': return 'Private Decentralized';
      default: return tier;
    }
  };

  const handleUpgrade = () => {
    const upgradeInfo = {
      agentTier,
      requirements: accessRequirements,
      userTier,
      tokenBalance
    };
    onUpgradeRequired(upgradeInfo);
    setShowUpgradeModal(true);
  };

  if (canAccess) {
    return (
      <Card sx={{ 
        border: `2px solid ${getTierColor(agentTier)}`,
        bgcolor: 'rgba(0,255,255,0.05)',
        mb: 2 
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            {getTierIcon(agentTier)}
            <Typography variant="h6" color={getTierColor(agentTier)}>
              {getTierName(agentTier)} Access
            </Typography>
            <Chip 
              label="Granted" 
              color="success" 
              size="small"
              icon={<CheckIcon />}
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            You have access to this agent tier through your current subscription or token holdings.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ 
        border: '2px solid #f44336',
        bgcolor: 'rgba(244,67,54,0.05)',
        mb: 2 
      }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LockIcon color="error" />
            <Typography variant="h6" color="error">
              {getTierName(agentTier)} Access Required
            </Typography>
            <Chip 
              label="Restricted" 
              color="error" 
              size="small"
            />
          </Box>

          <Alert severity="warning" sx={{ mb: 2 }}>
            You need to upgrade your access to use this agent tier.
          </Alert>

          <Typography variant="subtitle2" gutterBottom>
            Access Requirements:
          </Typography>
          
          <List dense>
            {accessRequirements.map((req, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {req.met ? (
                    <CheckIcon color="success" />
                  ) : (
                    <LockIcon color="error" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={req.description}
                  secondary={req.action}
                />
                {req.cost && (
                  <Box>
                    {req.cost.dmt && (
                      <Chip 
                        label={`${req.cost.dmt} DMT`} 
                        size="small" 
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                    )}
                    {req.cost.dmtx && (
                      <Chip 
                        label={`${req.cost.dmtx} DMTX`} 
                        size="small" 
                        color="secondary"
                        sx={{ mr: 1 }}
                      />
                    )}
                    {req.cost.subscription && (
                      <Chip 
                        label={req.cost.subscription} 
                        size="small" 
                        color="info"
                      />
                    )}
                  </Box>
                )}
              </ListItem>
            ))}
          </List>

          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpgrade}
              startIcon={<TrendingUpIcon />}
              fullWidth
            >
              Upgrade Access
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Upgrade to {getTierName(agentTier)}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Choose how you want to upgrade your access to the {getTierName(agentTier)} tier:
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText
                primary="Upgrade Subscription"
                secondary="Get access through a higher subscription tier"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <DiamondIcon />
              </ListItemIcon>
              <ListItemText
                primary="Stake Tokens"
                secondary="Stake DMT or DMTX tokens to unlock access"
              />
            </ListItem>

            {agentTier === 'private-decentralized' && (
              <ListItem>
                <ListItemIcon>
                  <GavelIcon />
                </ListItemIcon>
                <ListItemText
                  primary="DAO Proposal"
                  secondary="Submit a DAO proposal for access"
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpgradeModal(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => setShowUpgradeModal(false)}>
            Proceed with Upgrade
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AgentAccessControl;
