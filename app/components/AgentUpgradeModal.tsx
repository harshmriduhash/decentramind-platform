'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Badge,
  Alert,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  Lock as LockIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  CheckCircle as AccuracyIcon,
  Psychology as PsychologyIcon,
  Rocket as RocketIcon,
  Diamond as CrownIcon,
  FlashOn as FlashIcon,
} from '@mui/icons-material';
import {
  AgentUpgradeTier,
  AgentUpgradePath,
  calculateUpgradePath,
  getAgentTier,
  getTierBadgeColor,
  AGENT_UPGRADE_TIERS,
  getUpgradeAnimation,
  getTierBadgeIcon,
  formatUpgradeCost,
} from '../utils/agentUpgradeUtils';

interface AgentUpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: (agentId: string) => void;
  agent: {
    id: string;
    name: string;
    xp: number;
    level: number;
    tasksCompleted: number;
    usageCount: number;
    specialization: string;
  };
  userBalance: {
    dmt: number;
    dmtx: number;
  };
}

export default function AgentUpgradeModal({
  open,
  onClose,
  onUpgrade,
  agent,
  userBalance,
}: AgentUpgradeModalProps) {
  const [upgradePath, setUpgradePath] = useState<AgentUpgradePath | null>(null);
  const [currentTier, setCurrentTier] = useState<AgentUpgradeTier | null>(null);
  const [nextTier, setNextTier] = useState<AgentUpgradeTier | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (open && agent) {
      const path = calculateUpgradePath(
        agent.xp,
        agent.tasksCompleted,
        agent.usageCount,
        agent.level
      );
      setUpgradePath(path);
      setCurrentTier(getAgentTier(agent.level) || null);
      setNextTier(getAgentTier(path.nextLevel) || null);
    }
  }, [open, agent]);

  const handleUpgrade = async () => {
    if (!upgradePath?.canUpgrade) return;

    setUpgrading(true);
    setShowAnimation(true);

    // Simulate upgrade process
    await new Promise(resolve => setTimeout(resolve, 2000));

    onUpgrade(agent.id);
    setShowAnimation(false);
    setUpgrading(false);
    onClose();
  };

  const canAffordUpgrade = upgradePath ? 
    userBalance.dmt >= upgradePath.upgradeCost.dmtCost &&
    userBalance.dmtx >= upgradePath.upgradeCost.dmtxCost : false;

  const getCapabilityIcon = (capability: string) => {
    if (capability.includes('reasoning')) return <PsychologyIcon />;
    if (capability.includes('speed') || capability.includes('time')) return <SpeedIcon />;
    if (capability.includes('accuracy')) return <AccuracyIcon />;
    if (capability.includes('collaboration')) return <StarIcon />;
    if (capability.includes('custom') || capability.includes('fine-tuned')) return <CrownIcon />;
    return <CheckIcon />;
  };

  const getAnimationComponent = () => {
    if (!showAnimation) return null;

    const animation = getUpgradeAnimation(agent.level);
    
    return (
      <Fade in={showAnimation} timeout={1000}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <Zoom in={showAnimation} timeout={500}>
            <Box
              sx={{
                fontSize: '4rem',
                color: '#00ffff',
                textShadow: '0 0 20px #00ffff',
                animation: animation === 'explosion' ? 'pulse 0.5s ease-in-out' : 'none',
              }}
            >
              {animation === 'explosion' ? '🎉' : 
               animation === 'pulse' ? '⚡' :
               animation === 'glow' ? '✨' : '🌟'}
            </Box>
          </Zoom>
          <Typography
            variant="h4"
            sx={{
              color: '#00ffff',
              fontWeight: 'bold',
              textShadow: '0 0 10px #00ffff',
              mt: 2,
            }}
          >
            Level Up!
          </Typography>
        </Box>
      </Fade>
    );
  };

  if (!upgradePath || !currentTier || !nextTier) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(15, 15, 15, 0.95)',
          border: '2px solid #00ffff',
          borderRadius: 3,
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      {getAnimationComponent()}
      
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 255, 255, 0.3)',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
            Upgrade Agent: {agent.name}
          </Typography>
          <Chip
            label={`Level ${agent.level}`}
            sx={{
              bgcolor: getTierBadgeColor(currentTier.llmTier),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#00ffff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Current vs Next Tier Comparison */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'rgba(25, 25, 25, 0.9)', border: '1px solid #333' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Current: {currentTier.name}
                  </Typography>
                  <Chip
                    icon={<span>{getTierBadgeIcon(currentTier.llmTier)}</span>}
                    label={currentTier.llmTier}
                    size="small"
                    sx={{
                      bgcolor: getTierBadgeColor(currentTier.llmTier),
                      color: 'white',
                    }}
                  />
                </Box>
                
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  {currentTier.llmModels.join(', ')}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    Current Capabilities:
                  </Typography>
                  <List dense>
                    {currentTier.capabilities.slice(0, 3).map((cap, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckIcon sx={{ color: '#4caf50', fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={cap}
                          primaryTypographyProps={{ fontSize: '0.85rem', color: 'white' }}
                        />
                      </ListItem>
                    ))}
                    {currentTier.capabilities.length > 3 && (
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={`+${currentTier.capabilities.length - 3} more...`}
                          primaryTypographyProps={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Max Tasks/Day
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {currentTier.maxTasksPerDay === -1 ? '∞' : currentTier.maxTasksPerDay}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Response Time
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {currentTier.responseTime}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      Accuracy
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {currentTier.accuracy}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ 
              bgcolor: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #00ffff',
              position: 'relative',
              overflow: 'visible',
            }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  bgcolor: '#00ffff',
                  color: 'black',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                →
              </Box>
              
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h6" sx={{ color: '#00ffff' }}>
                    Next: {nextTier.name}
                  </Typography>
                  <Chip
                    icon={<span>{getTierBadgeIcon(nextTier.llmTier)}</span>}
                    label={nextTier.llmTier}
                    size="small"
                    sx={{
                      bgcolor: getTierBadgeColor(nextTier.llmTier),
                      color: 'white',
                    }}
                  />
                </Box>
                
                <Typography variant="body2" sx={{ color: 'rgba(0, 255, 255, 0.7)', mb: 2 }}>
                  {nextTier.llmModels.join(', ')}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#00ffff', mb: 1 }}>
                    New Capabilities:
                  </Typography>
                  <List dense>
                    {upgradePath.benefits.slice(0, 3).map((cap, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <RocketIcon sx={{ color: '#00ffff', fontSize: 16 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={cap}
                          primaryTypographyProps={{ fontSize: '0.85rem', color: '#00ffff' }}
                        />
                      </ListItem>
                    ))}
                    {upgradePath.benefits.length > 3 && (
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={`+${upgradePath.benefits.length - 3} more...`}
                          primaryTypographyProps={{ fontSize: '0.85rem', color: 'rgba(0, 255, 255, 0.5)' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(0, 255, 255, 0.5)' }}>
                      Max Tasks/Day
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {nextTier.maxTasksPerDay === -1 ? '∞' : nextTier.maxTasksPerDay}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(0, 255, 255, 0.5)' }}>
                      Response Time
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {nextTier.responseTime}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(0, 255, 255, 0.5)' }}>
                      Accuracy
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {nextTier.accuracy}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Progress and Requirements */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Upgrade Progress
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: 'white' }}>
                Overall Progress
              </Typography>
              <Typography variant="body2" sx={{ color: '#00ffff' }}>
                {upgradePath.progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={upgradePath.progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#00ffff',
                  borderRadius: 4,
                },
              }}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                  {agent.xp}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  XP / {upgradePath.upgradeCost.xp}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Experience Points
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {agent.tasksCompleted}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  / {upgradePath.upgradeCost.tasksCompleted}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Tasks Completed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 2 }}>
                <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                  {agent.usageCount}
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  / {upgradePath.upgradeCost.usageCount}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Total Interactions
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Upgrade Cost and Status */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
            Upgrade Cost
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Chip
              label={formatUpgradeCost(upgradePath.upgradeCost)}
              sx={{
                bgcolor: 'rgba(0, 255, 255, 0.1)',
                color: '#00ffff',
                border: '1px solid #00ffff',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Your Balance: {userBalance.dmt} DMT, {userBalance.dmtx} DMTX
            </Typography>
          </Box>

          {!canAffordUpgrade && (
            <Alert severity="warning" sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', border: '1px solid #ff9800' }}>
              Insufficient tokens. You need {upgradePath.upgradeCost.dmtCost - userBalance.dmt} more DMT and {upgradePath.upgradeCost.dmtxCost - userBalance.dmtx} more DMTX.
            </Alert>
          )}

          {!upgradePath.canUpgrade && (
            <Alert severity="info" sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', border: '1px solid #2196f3' }}>
              Complete more tasks and interactions to unlock this upgrade. Estimated time: {upgradePath.timeToUpgrade}
            </Alert>
          )}
        </Box>

        {/* Locked Features Preview */}
        {nextTier.lockedFeatures.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              Future Capabilities (Level {nextTier.level + 1}+)
            </Typography>
            <List dense>
              {nextTier.lockedFeatures.slice(0, 3).map((feature, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <LockIcon sx={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: 16 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0, 255, 255, 0.3)' }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpgrade}
          disabled={!upgradePath.canUpgrade || !canAffordUpgrade || upgrading}
          variant="contained"
          sx={{
            bgcolor: '#00ffff',
            color: 'black',
            fontWeight: 'bold',
            px: 4,
            '&:hover': { bgcolor: '#00e5e5' },
            '&:disabled': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
          }}
        >
          {upgrading ? 'Upgrading...' : `Upgrade to Level ${nextTier.level}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}