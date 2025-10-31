'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Upgrade as UpgradeIcon,
  Psychology as PsychologyIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  CheckCircle as AccuracyIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  FlashOn as FlashIcon,
  Rocket as RocketIcon,
  Diamond as CrownIcon,
  Assignment as AssignTaskIcon,
  Chat as ChatIcon,
  History as ViewLogsIcon,
  PlayArrow as PlayTaskIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  AgentUpgradePath,
  calculateUpgradePath,
  getAgentTier,
  getTierBadgeColor,
  AGENT_UPGRADE_TIERS,
  formatUpgradeCost,
} from '../utils/agentUpgradeUtils';
import AgentAccessControl from './AgentAccessControl';
import { userTierService, UserProfile } from '../services/userTierService';
import { MintButton } from './MintButton';
import { useUserNFTs } from '../hooks/useUserNFTs';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    xp: number;
    level: number;
    tasksCompleted: number;
    usageCount: number;
    specialization: string;
    status: 'active' | 'idle' | 'training';
    lastActive: string;
    tier?: string;
    xpToNext?: number;
    performance?: {
      tasksCompleted: number;
      successRate: number;
      averageResponseTime: number;
      totalEarnings: number;
    };
  };
  onUpgrade: (agentId: string) => void;
  onManageTasks?: (agent: any) => void;
  onTaskCompleted?: (agentId: string, xpGained: number, dmtSpent: number) => void;
  userBalance: {
    dmt: number;
    dmtx: number;
  };
  userProfile?: UserProfile;
  showAccessControl?: boolean;
}

export default function AgentCard({ agent, onUpgrade, onManageTasks, onTaskCompleted, userBalance, userProfile, showAccessControl = false }: AgentCardProps) {
  const router = useRouter();
  const { getCareOrchestratorNFT, refreshNFTs } = useUserNFTs();
  const [upgradePath, setUpgradePath] = useState<AgentUpgradePath | null>(null);
  const [currentTier, setCurrentTier] = useState<any>(null);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showTaskToast, setShowTaskToast] = useState(false);
  const [taskToastMessage, setTaskToastMessage] = useState('');

  // Get Care Orchestrator NFT for dynamic avatar
  const careOrchestratorNFT = getCareOrchestratorNFT();
  
  // DEBUG: Log NFT information
  React.useEffect(() => {
    console.log('🔍 AgentCard Debug - Agent:', agent.name);
    console.log('🔍 AgentCard Debug - careOrchestratorNFT:', careOrchestratorNFT);
    
    if (agent.name === 'Care Orchestrator') {
      console.log('🔍 Care Orchestrator Debug:');
      console.log('  - NFT Found:', !!careOrchestratorNFT);
      if (careOrchestratorNFT) {
        console.log('  - NFT Mint:', careOrchestratorNFT.mint);
        console.log('  - NFT Symbol:', careOrchestratorNFT.metadata.symbol);
        console.log('  - NFT Image URL:', careOrchestratorNFT.metadata.image);
        console.log('  - NFT Name:', careOrchestratorNFT.metadata.name);
        console.log('  - NFT Collection:', careOrchestratorNFT.metadata.collection);
        
        // Check if mint address is mock
        if (careOrchestratorNFT.mint.startsWith('mint_')) {
          console.warn('⚠️ WARNING: Mock mint address detected:', careOrchestratorNFT.mint);
          console.warn('⚠️ This is NOT a real Solana Base58 address!');
        }
      } else {
        console.log('  - No NFT found for Care Orchestrator');
      }
      console.log('  - Agent Avatar:', agent.avatar);
    }
  }, [agent.name, careOrchestratorNFT]);
  
  // Determine avatar URL - use NFT image if available, otherwise fallback to agent.avatar
  const getAvatarUrl = () => {
    if (agent.name === 'Care Orchestrator' && careOrchestratorNFT) {
      console.log('🎯 Using NFT image for Care Orchestrator:', careOrchestratorNFT.metadata.image);
      return careOrchestratorNFT.metadata.image;
    }
    console.log('🎯 Using fallback avatar for', agent.name, ':', agent.avatar);
    return agent.avatar;
  };

  const avatarUrl = getAvatarUrl();

  React.useEffect(() => {
    const path = calculateUpgradePath(
      agent.xp,
      agent.tasksCompleted,
      agent.usageCount,
      agent.level
    );
    setUpgradePath(path);
    setCurrentTier(getAgentTier(agent.level));
  }, [agent]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4caf50';
      case 'idle': return '#ff9800';
      case 'training': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FlashIcon />;
      case 'idle': return <StarIcon />;
      case 'training': return <TrendingUpIcon />;
      default: return <PsychologyIcon />;
    }
  };

  const getTierIcon = (llmTier: string) => {
    switch (llmTier) {
      case 'Mini': return <FlashIcon />;
      case 'Pro': return <RocketIcon />;
      case 'Custom': return <CrownIcon />;
      default: return <PsychologyIcon />;
    }
  };

  // New handler functions for enhanced interactivity
  const handleAssignTask = () => {
    router.push(`/ai-agents/workflows?agentId=${agent.id}`);
  };

  const handleChatWithAgent = () => {
    router.push(`/ai-agents/chat/${agent.id}`);
  };

  const handleViewLogs = () => {
    setShowLogsModal(true);
  };

  const handleQuickTask = async () => {
    if (onTaskCompleted) {
      // Simulate task completion
      const xpGained = Math.floor(Math.random() * 50) + 10; // 10-60 XP
      const dmtSpent = Math.floor(Math.random() * 20) + 5; // 5-25 DMT
      
      onTaskCompleted(agent.id, xpGained, dmtSpent);
      
      // Show toast notification
      setTaskToastMessage(`🎉 Task completed! XP +${xpGained}`);
      setShowTaskToast(true);
      
      // Auto-hide toast after 3 seconds
      setTimeout(() => setShowTaskToast(false), 3000);
    }
  };

  // Calculate XP progress for tooltip
  const getXPProgressInfo = () => {
    const currentLevelXP = agent.level === 1 ? 0 : (agent.level - 1) * 1200;
    const nextLevelXP = agent.level * 1200;
    const currentXP = agent.xp - currentLevelXP;
    const neededXP = nextLevelXP - currentLevelXP;
    
    return {
      current: currentXP,
      needed: neededXP,
      percentage: Math.min(100, (currentXP / neededXP) * 100)
    };
  };

  // Check if agent needs onboarding
  const needsOnboarding = agent.tasksCompleted === 0 || agent.xp === 0;

  if (!upgradePath || !currentTier) return null;

  // Determine agent tier for access control
  const agentTier = agent.tier || (agent.level <= 2 ? 'mini-llm' : agent.level <= 4 ? 'pro-llm' : 'custom-llm');

  return (
    <Card
      sx={{
        bgcolor: 'rgba(25, 25, 25, 0.9)',
        border: '2px solid rgba(0, 255, 255, 0.3)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: '#00ffff',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      {/* Status Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Chip
          icon={getStatusIcon(agent.status)}
          label={agent.status}
          size="small"
          sx={{
            bgcolor: getStatusColor(agent.status),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>

      {/* Tier Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
        }}
      >
        <Chip
          icon={getTierIcon(currentTier.llmTier)}
          label={`${currentTier.llmTier} LLM`}
          size="small"
          sx={{
            bgcolor: getTierBadgeColor(currentTier.llmTier),
            color: 'white',
            fontWeight: 'bold',
          }}
        />
      </Box>

      <CardContent sx={{ pt: 6, pb: 2 }}>
        {/* Agent Avatar - NFT Style */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          {agent.name === 'Care Orchestrator' ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-gradient-to-tr from-cyan-400 via-blue-500 to-teal-400 animate-spin-slow">
              <img
                src={avatarUrl || "https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png"}
                alt="Care Orchestrator Avatar"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  // fallback emoji rendering logic
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.textContent = '🩺';
                  fallback.className = 'absolute inset-0 flex items-center justify-center text-3xl bg-gray-800 rounded-full';
                  e.currentTarget.parentNode?.appendChild(fallback);
                }}
              />
            </div>
          ) : (
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto 12px',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${agent.name} Avatar - AI Assistant`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: avatarUrl ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: 'white',
                }}
              >
                🤖
              </Box>
            </Box>
          )}
        </Box>

        {/* Agent Name and Level */}
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            {agent.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Level {agent.level} • {currentTier.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            {agent.specialization}
          </Typography>
        </Box>

        {/* XP Progress Bar with Tooltip */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>
              Experience Points
            </Typography>
            <Tooltip title={`Current Level XP: ${getXPProgressInfo().current} / ${getXPProgressInfo().needed} (${getXPProgressInfo().percentage.toFixed(1)}%)`}>
              <Typography variant="body2" sx={{ color: '#00ffff', cursor: 'help' }}>
                {agent.xp} / {upgradePath.upgradeCost.xp}
              </Typography>
            </Tooltip>
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
          {needsOnboarding && (
            <Typography variant="caption" sx={{ color: '#ff9800', mt: 1, display: 'block', fontStyle: 'italic' }}>
              💡 Let's get started! Assign a task to this agent.
            </Typography>
          )}
        </Box>

        {/* Stats Grid with Tooltips */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Tooltip title={`Tasks Completed: ${agent.tasksCompleted} | Success Rate: ${agent.performance?.successRate || 0}%`}>
              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 2, cursor: 'help' }}>
                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {agent.tasksCompleted}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Tasks Completed
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <Tooltip title={`Total Interactions: ${agent.usageCount} | Average Response Time: ${agent.performance?.averageResponseTime || 0}s`}>
              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'rgba(0, 0, 0, 0.3)', borderRadius: 2, cursor: 'help' }}>
                <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                  {agent.usageCount}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Total Interactions
                </Typography>
              </Box>
            </Tooltip>
          </Grid>
        </Grid>

        {/* Capabilities Preview */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
            Current Capabilities:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {currentTier.capabilities.slice(0, 3).map((capability: string, index: number) => (
              <Chip
                key={index}
                label={capability}
                size="small"
                sx={{
                  bgcolor: 'rgba(0, 255, 255, 0.1)',
                  color: '#00ffff',
                  border: '1px solid rgba(0, 255, 255, 0.3)',
                  fontSize: '0.7rem',
                }}
              />
            ))}
            {currentTier.capabilities.length > 3 && (
              <Chip
                label={`+${currentTier.capabilities.length - 3} more`}
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Box>
        </Box>

        {/* Performance Metrics */}
        <Grid container spacing={1} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <SpeedIcon sx={{ color: '#4caf50', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                {currentTier.responseTime}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.6rem' }}>
                Response
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <AccuracyIcon sx={{ color: '#2196f3', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                {currentTier.accuracy}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.6rem' }}>
                Accuracy
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <TrendingUpIcon sx={{ color: '#ff9800', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'white', display: 'block' }}>
                {currentTier.maxTasksPerDay === -1 ? '∞' : currentTier.maxTasksPerDay}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.6rem' }}>
                Daily Limit
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Next Level Preview */}
        {upgradePath.nextLevel > upgradePath.currentLevel && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 255, 255, 0.05)', borderRadius: 2, border: '1px solid rgba(0, 255, 255, 0.2)' }}>
            <Typography variant="body2" sx={{ color: '#00ffff', mb: 1, fontWeight: 'bold' }}>
              Next Level: {upgradePath.nextLevel}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {upgradePath.benefits.slice(0, 2).join(', ')}
              {upgradePath.benefits.length > 2 && ` +${upgradePath.benefits.length - 2} more`}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, gap: 1, flexDirection: 'column' }}>
        {/* Primary Action Buttons - Stack on mobile */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          width: '100%',
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            variant="contained"
            startIcon={<AssignTaskIcon />}
            onClick={handleAssignTask}
            sx={{
              bgcolor: '#4caf50',
              color: 'white',
              fontWeight: 'bold',
              flex: 1,
              minHeight: { xs: '44px', sm: '36px' }, // Better touch targets on mobile
              fontSize: { xs: '14px', sm: '13px' },
              '&:hover': {
                bgcolor: '#66bb6a',
              },
            }}
          >
            Assign Task
          </Button>
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            onClick={handleChatWithAgent}
            sx={{
              bgcolor: '#2196f3',
              color: 'white',
              fontWeight: 'bold',
              flex: 1,
              minHeight: { xs: '44px', sm: '36px' },
              fontSize: { xs: '14px', sm: '13px' },
              '&:hover': {
                bgcolor: '#42a5f5',
              },
            }}
          >
            Chat
          </Button>
        </Box>

        {/* Secondary Action Buttons - Stack on mobile */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          width: '100%',
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <Button
            variant="outlined"
            startIcon={<ViewLogsIcon />}
            onClick={handleViewLogs}
            sx={{
              borderColor: '#ff9800',
              color: '#ff9800',
              fontWeight: 'bold',
              flex: 1,
              minHeight: { xs: '44px', sm: '36px' },
              fontSize: { xs: '14px', sm: '13px' },
              '&:hover': {
                borderColor: '#ffb74d',
                bgcolor: 'rgba(255, 152, 0, 0.1)',
              },
            }}
          >
            View Logs
          </Button>
          <Button
            variant="outlined"
            startIcon={<PlayTaskIcon />}
            onClick={handleQuickTask}
            disabled={!onTaskCompleted}
            sx={{
              borderColor: '#9c27b0',
              color: '#9c27b0',
              fontWeight: 'bold',
              flex: 1,
              minHeight: { xs: '44px', sm: '36px' },
              fontSize: { xs: '14px', sm: '13px' },
              '&:hover': {
                borderColor: '#ba68c8',
                bgcolor: 'rgba(156, 39, 176, 0.1)',
              },
              '&:disabled': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Quick Task
          </Button>
        </Box>

        {/* Legacy Upgrade Button */}
        <Button
          variant="contained"
          startIcon={<UpgradeIcon />}
          onClick={() => onUpgrade(agent.id)}
          disabled={!upgradePath.canUpgrade}
          sx={{
            bgcolor: upgradePath.canUpgrade ? '#00ffff' : 'rgba(255, 255, 255, 0.1)',
            color: upgradePath.canUpgrade ? 'black' : 'rgba(255, 255, 255, 0.5)',
            fontWeight: 'bold',
            width: '100%',
            '&:hover': {
              bgcolor: upgradePath.canUpgrade ? '#00e5e5' : 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {upgradePath.canUpgrade ? 'Upgrade Agent' : 'Requirements Not Met'}
        </Button>

        {/* NFT Mint Button - Only for Care Orchestrator */}
        {agent.name === 'Care Orchestrator' && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <MintButton
              agentName={agent.name}
              agentImage={avatarUrl}
              agentDescription={agent.description}
              agentAttributes={[
                { trait_type: 'Agent Type', value: 'Healthcare Assistant' },
                { trait_type: 'Level', value: agentTier },
                { trait_type: 'Domain', value: agent.domain },
                { trait_type: 'Personality', value: agent.personality },
                { trait_type: 'XP', value: agent.xp.toString() },
                { trait_type: 'Tasks Completed', value: agent.performance?.tasksCompleted?.toString() || '0' },
                { trait_type: 'Success Rate', value: `${agent.performance?.successRate || 0}%` },
                { trait_type: 'Rarity', value: 'Legendary' }
              ]}
              onMintSuccess={(mintAddress, transactionSignature) => {
                console.log('NFT minted successfully:', { mintAddress, transactionSignature });
                // Refresh NFTs to show the new minted NFT avatar
                refreshNFTs();
              }}
              onMintError={(error) => {
                console.error('NFT minting failed:', error);
                // You can add additional error handling here
              }}
            />
          </Box>
        )}

        {/* View NFT Button - Only for Care Orchestrator with minted NFT */}
        {agent.name === 'Care Orchestrator' && careOrchestratorNFT && (
          <Box sx={{ width: '100%', mt: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                const solscanUrl = `https://solscan.io/token/${careOrchestratorNFT.mint}?cluster=devnet`;
                window.open(solscanUrl, '_blank');
              }}
              sx={{
                borderColor: '#00ff80',
                color: '#00ff80',
                '&:hover': {
                  borderColor: '#2ed573',
                  backgroundColor: 'rgba(0, 255, 128, 0.1)',
                }
              }}
            >
              🔗 View Your NFT
            </Button>
          </Box>
        )}
      </CardActions>

      {/* Access Control */}
      {showAccessControl && userProfile && (
        <Box sx={{ p: 2, pt: 0 }}>
          <AgentAccessControl
            agentTier={agentTier as any}
            userProfile={userProfile}
            onAccessGranted={() => {}}
            onUpgradeRequired={(upgradeInfo) => {
            }}
          />
        </Box>
      )}

      {/* Upgrade Cost Tooltip */}
      {upgradePath.canUpgrade && (
        <Tooltip
          title={
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                Upgrade Cost:
              </Typography>
              <Typography variant="body2">
                {formatUpgradeCost(upgradePath.upgradeCost)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Your Balance: {userBalance.dmt} DMT, {userBalance.dmtx} DMTX
              </Typography>
            </Box>
          }
          placement="top"
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: 'rgba(0, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'help',
            }}
          >
            <Typography variant="caption" sx={{ color: '#00ffff', fontSize: '0.7rem' }}>
              ?
            </Typography>
          </Box>
        </Tooltip>
      )}

      {/* View Logs Modal */}
    <Dialog
      open={showLogsModal}
      onClose={() => setShowLogsModal(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: 'rgba(25, 25, 25, 0.95)',
          color: 'white',
          border: '2px solid #ff9800',
          borderRadius: { xs: 0, sm: 2 }, // No border radius on mobile
          maxHeight: { xs: '100vh', sm: '80vh' }, // Full height on mobile
          margin: { xs: 0, sm: 'auto' }, // No margin on mobile
        }
      }}
    >
        <DialogTitle sx={{ 
          color: '#ff9800', 
          borderBottom: '1px solid #ff9800',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <ViewLogsIcon />
          Task Logs - {agent.name}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box>
            {/* Recent Tasks */}
            <Typography variant="h6" sx={{ color: '#ff9800', mb: 2 }}>
              Recent Tasks
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <TrophyIcon sx={{ color: '#4caf50' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Financial Analysis Task"
                  secondary={`Completed • +25 XP • 98% Success Rate • ${new Date().toLocaleString()}`}
                />
              </ListItem>
              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#4caf50' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Portfolio Optimization"
                  secondary={`Completed • +30 XP • 95% Success Rate • ${new Date(Date.now() - 3600000).toLocaleString()}`}
                />
              </ListItem>
              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
              <ListItem>
                <ListItemIcon>
                  <TimelineIcon sx={{ color: '#2196f3' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Risk Assessment"
                  secondary={`In Progress • +20 XP • 92% Success Rate • ${new Date(Date.now() - 7200000).toLocaleString()}`}
                />
              </ListItem>
            </List>

            {/* Performance Summary */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: '#ff9800', mb: 1 }}>
                Performance Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Total Tasks: {agent.tasksCompleted}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Success Rate: {agent.performance?.successRate || 0}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Avg Response: {agent.performance?.averageResponseTime || 0}s
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    Total Earnings: {agent.performance?.totalEarnings || 0} DMT
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowLogsModal(false)}
            sx={{ 
              color: '#b0b0b0',
              borderColor: '#b0b0b0',
              '&:hover': { borderColor: '#ffffff', color: '#ffffff' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Completion Toast */}
      {showTaskToast && (
        <Box
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            bgcolor: '#4caf50',
            color: 'white',
            p: 2,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              '0%': { transform: 'translateX(100%)', opacity: 0 },
              '100%': { transform: 'translateX(0)', opacity: 1 },
            },
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {taskToastMessage}
          </Typography>
        </Box>
      )}
    </Card>
  );
}
