'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Tabs,
  Tab,
  Paper,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  LocalFireDepartment as BurnIcon,
  Star as StarIcon,
  Diamond as DiamondIcon,
  Psychology as PsychologyIcon,
  Gavel as GavelIcon,
  FlashOn as FlashIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { userTierService, UserTier } from '../services/userTierService';
import { tokenIntegrationService, TokenBalance } from '../services/tokenIntegrationService';
import daoService, { Proposal } from '../services/daoService';
import { rewardsService, UserRewards, Badge as RewardBadge } from '../services/rewardsService';

interface EconomicDashboardProps {
  userId: string;
  userProfile: any;
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
      id={`economic-tabpanel-${index}`}
      aria-labelledby={`economic-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EconomicDashboard: React.FC<EconomicDashboardProps> = ({ userId, userProfile }) => {
  const [tabValue, setTabValue] = useState(0);
  const [userTier, setUserTier] = useState<UserTier | null>(null);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [badges, setBadges] = useState<RewardBadge[]>([]);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    // Load user tier
    const tier = userTierService.determineUserTier(userProfile);
    setUserTier(tier);

    // Load token balance
    const balance = await tokenIntegrationService.getTokenBalance(userId);
    setTokenBalance(balance);

    // Load user rewards
    const rewards = rewardsService.getUserRewards(userId);
    setUserRewards(rewards);

    // Load DAO proposals
    daoService.getProposals((daoProposals) => {
      setProposals(daoProposals);
    });

    // Load badges
    const userBadges = rewardsService.getUserBadges(userId);
    setBadges(userBadges);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getTierColor = (tier: UserTier) => {
    return tier.color;
  };

  const getTierBadge = (tier: UserTier) => {
    return tier.badge;
  };

  if (!userTier || !tokenBalance || !userRewards) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading economic data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#00ffff', mb: 1 }}>
          💎 Economic Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your tokens, subscriptions, and governance participation
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'rgba(0,255,255,0.1)', border: '1px solid #00ffff' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="h6" color="#00ffff">
                  {tokenBalance.dmt.toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                DMT Balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'rgba(156,39,176,0.1)', border: '1px solid #9c27b0' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <DiamondIcon color="secondary" />
                <Typography variant="h6" color="#9c27b0">
                  {tokenBalance.dmtx.toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                DMTX Balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'rgba(76,175,80,0.1)', border: '1px solid #4caf50' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <StarIcon color="success" />
                <Typography variant="h6" color="#4caf50">
                  {userRewards.totalXp.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total XP
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'rgba(255,152,0,0.1)', border: '1px solid #ff9800' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <TrendingUpIcon color="warning" />
                <Typography variant="h6" color="#ff9800">
                  {userRewards.dailyStreak}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Day Streak
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* User Tier Status */}
      <Card sx={{ mb: 3, bgcolor: 'rgba(25,25,25,0.9)', border: `2px solid ${getTierColor(userTier)}` }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" sx={{ color: getTierColor(userTier) }}>
                {getTierBadge(userTier)} {userTier.name} Tier
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userTier.benefits.maxAgents === -1 ? 'Unlimited' : userTier.benefits.maxAgents} agents • {userTier.benefits.dailyCredits} daily credits
              </Typography>
            </Box>
            <Box textAlign="right">
              <Chip 
                label={userTier.type.toUpperCase()} 
                color="primary" 
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" display="block">
                Level {userTier.level}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Token Management" />
          <Tab label="Rewards & Badges" />
          <Tab label="DAO Governance" />
          <Tab label="Access Control" />
        </Tabs>
      </Box>

      {/* Token Management Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Token Balances
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalanceIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="DMT Tokens"
                      secondary={`${tokenBalance.dmt.toFixed(2)} DMT`}
                    />
                    <Chip label="Available" color="success" size="small" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DiamondIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="DMTX Tokens"
                      secondary={`${tokenBalance.dmtx.toFixed(2)} DMTX`}
                    />
                    <Chip label="Governance" color="secondary" size="small" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Staked DMT"
                      secondary={`${tokenBalance.dmtStaked.toFixed(2)} DMT`}
                    />
                    <Chip label="Staked" color="info" size="small" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FlashIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Credits"
                      secondary={`${tokenBalance.credits.toFixed(0)} Credits`}
                    />
                    <Chip label="Spendable" color="warning" size="small" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    startIcon={<TrendingUpIcon />}
                    sx={{ bgcolor: '#4caf50' }}
                  >
                    Stake DMT
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AccountBalanceIcon />}
                    sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                  >
                    Convert to Credits
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DiamondIcon />}
                    sx={{ borderColor: '#9c27b0', color: '#9c27b0' }}
                  >
                    Buy DMTX
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Rewards & Badges Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Badges
                </Typography>
                {badges.length === 0 ? (
                  <Alert severity="info">
                    No badges earned yet. Complete tasks to earn your first badge!
                  </Alert>
                ) : (
                  <List>
                    {badges.map((badge) => (
                      <ListItem key={badge.id}>
                        <ListItemIcon>
                          <Typography variant="h4">{badge.icon}</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={badge.name}
                          secondary={badge.description}
                        />
                        <Chip 
                          label={badge.rarity.toUpperCase()} 
                          size="small"
                          color={badge.rarity === 'legendary' ? 'error' : 'default'}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Achievements Progress
                </Typography>
                <List>
                  {userRewards.achievements.map((achievement) => (
                    <ListItem key={achievement.id}>
                      <ListItemIcon>
                        {achievement.completed ? (
                          <CheckIcon color="success" />
                        ) : (
                          <LockIcon color="disabled" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={achievement.name}
                        secondary={
                          <Box>
                            <LinearProgress
                              variant="determinate"
                              value={(achievement.progress / achievement.maxProgress) * 100}
                              sx={{ mb: 1 }}
                            />
                            <Typography variant="caption">
                              {achievement.progress} / {achievement.maxProgress}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* DAO Governance Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Proposals
                </Typography>
                {proposals.length === 0 ? (
                  <Alert severity="info">
                    No active proposals at the moment.
                  </Alert>
                ) : (
                  <List>
                    {proposals.slice(0, 5).map((proposal) => (
                      <ListItem key={proposal.id} divider>
                        <ListItemIcon>
                          <GavelIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={proposal.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {proposal.description}
                              </Typography>
                              <Box display="flex" gap={1} mt={1}>
                                <Chip 
                                  label={`For: ${proposal.votes.for}`} 
                                  size="small" 
                                  color="success" 
                                />
                                <Chip 
                                  label={`Against: ${proposal.votes.against}`} 
                                  size="small" 
                                  color="error" 
                                />
                                <Chip 
                                  label={`Quorum: ${proposal.quorum}/${proposal.quorum}`} 
                                  size="small" 
                                  color="info" 
                                />
                              </Box>
                            </Box>
                          }
                        />
                        <Button variant="outlined" size="small">
                          Vote
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Governance Stats
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Voting Power"
                      secondary={`${userTier.benefits.daoVotingRights ? 'Active' : 'Inactive'}`}
                    />
                    <Chip 
                      label={userTier.benefits.daoVotingRights ? 'Yes' : 'No'} 
                      color={userTier.benefits.daoVotingRights ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Proposal Rights"
                      secondary={`${userTier.benefits.proposalRights ? 'Can Create' : 'Cannot Create'}`}
                    />
                    <Chip 
                      label={userTier.benefits.proposalRights ? 'Yes' : 'No'} 
                      color={userTier.benefits.proposalRights ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Access Control Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Agent Access Levels
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PsychologyIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mini LLM"
                      secondary="Basic AI agents"
                    />
                    <Chip 
                      label={userTier.benefits.agentAccess.includes('mini-llm') ? 'Access' : 'No Access'} 
                      color={userTier.benefits.agentAccess.includes('mini-llm') ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Pro LLM"
                      secondary="Advanced AI agents"
                    />
                    <Chip 
                      label={userTier.benefits.agentAccess.includes('pro-llm') ? 'Access' : 'No Access'} 
                      color={userTier.benefits.agentAccess.includes('pro-llm') ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DiamondIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Custom LLM"
                      secondary="Custom fine-tuned agents"
                    />
                    <Chip 
                      label={userTier.benefits.agentAccess.includes('custom-llm') ? 'Access' : 'No Access'} 
                      color={userTier.benefits.agentAccess.includes('custom-llm') ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <GavelIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Private Decentralized"
                      secondary="DAO-governed agents"
                    />
                    <Chip 
                      label={userTier.benefits.agentAccess.includes('private-decentralized') ? 'Access' : 'No Access'} 
                      color={userTier.benefits.agentAccess.includes('private-decentralized') ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tier Benefits
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PsychologyIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Max Agents"
                      secondary={userTier.benefits.maxAgents === -1 ? 'Unlimited' : userTier.benefits.maxAgents.toString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FlashIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Daily Credits"
                      secondary={userTier.benefits.dailyCredits.toString()}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <StarIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Priority Support"
                      secondary={userTier.benefits.prioritySupport ? 'Yes' : 'No'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <GavelIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="DAO Rights"
                      secondary={userTier.benefits.daoVotingRights ? 'Full Access' : 'No Access'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
};

export default EconomicDashboard;

