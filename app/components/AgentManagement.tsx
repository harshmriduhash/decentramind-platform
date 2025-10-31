"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  AutoAwesome as AutoAwesomeIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  AccountBalanceWallet as FinanceIcon,
  Favorite as HealthIcon,
  ShowChart as CryptoIcon,
  Dashboard as DashboardIcon,
  PlayArrow as RunTaskIcon,
  Upgrade as UpgradeIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import AgentCard from './AgentCard';
import AgentUpgradeModal from './AgentUpgradeModal';
import TaskManagement from './TaskManagement';
import { AgentUpgradeTier, getAgentTier } from '../utils/agentUpgradeUtils';
import agentService from '../services/agentService';

interface Agent {
  id: string;
  name: string;
  xp: number;
  level: number;
  xpToNext: number;
  tasksCompleted: number;
  usageCount: number;
  specialization: string;
  status: 'active' | 'idle' | 'training';
  lastActive: string;
  type: 'master' | 'sub';
  domain: string;
  personality: string;
  description: string;
  avatar: string;
  specializations: string[];
  capabilities: string[];
  performance: {
    tasksCompleted: number;
    successRate: number;
    averageResponseTime: number;
    totalEarnings: number;
  };
  parentAgent?: number;
  subAgents?: number[];
}

const AgentManagement: React.FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  const [userBalance, setUserBalance] = useState({ dmt: 1000, dmtx: 50 });
  const [showTaskManagement, setShowTaskManagement] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showXPEvolutionModal, setShowXPEvolutionModal] = useState(false);
  const [selectedAgentForXP, setSelectedAgentForXP] = useState<Agent | null>(null);

  // Task modal fields state
  const [assignedAgent, setAssignedAgent] = useState('');
  const [taskPriority, setTaskPriority] = useState('');
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // Load agents from agentService
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false); // Start with false to show the button immediately

  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);

  // Load agents from agentService
  useEffect(() => {
    const loadAgents = () => {
      try {
        setLoading(true);
        
        // Use synchronous method directly
        const agentData = agentService.getAgentsSync();
        
        // No mock agents - start with clean slate
        if (false) {
          const mockAgents = [
            {
              id: 'agent-cfo',
              name: 'CFO Agent',
              domain: 'Finance',
              description: 'Advanced financial analysis and portfolio management',
              personality: 'Analytical',
              cost: 100,
              xp: 2500,
              level: 3,
              xpToNext: 800,
              mintDate: new Date().toISOString(),
              owner: 'user-wallet-address',
              status: 'active' as const,
              type: 'master' as const,
              skills: ['Financial Analysis', 'Portfolio Management', 'Risk Assessment'],
              avatar: '/avatars/agent-cfo.png',
              performance: {
                tasksCompleted: 45,
                successRate: 92,
                averageResponseTime: 1.2,
                totalEarnings: 1250
              },
              metadata: {
                model: 'GPT-4',
                version: '4.0',
                lastUpdated: new Date().toISOString()
              },
              capabilities: ['Financial Analysis', 'Portfolio Management'],
              evolutionStage: 'Apprentice',
              llmConfig: {
                model: 'GPT-4',
                version: '4.0',
                temperature: 0.7,
                maxTokens: 4096,
                contextWindow: 4096
              },
              ragConfig: {
                dataSource: 'financial-data',
                vectorDB: 'pinecone',
                knowledgeBase: ['Financial markets', 'Investment strategies'],
                lastUpdated: new Date().toISOString()
              },
              evolutionHistory: [],
              individualStats: {
                totalUpgrades: 2,
                totalDmtSpent: 200,
                uniqueConversations: 15,
                domainExpertise: 75,
                lastActive: new Date().toISOString()
              }
            },
            {
              id: 'agent-care',
              name: 'Care Agent',
              domain: 'Health & Wellness',
              description: 'Personalized health and wellness guidance',
              personality: 'Compassionate',
              cost: 80,
              xp: 4800,
              level: 5,
              xpToNext: 200,
              mintDate: new Date().toISOString(),
              owner: 'user-wallet-address',
              status: 'active' as const,
              type: 'sub' as const,
              skills: ['Health Monitoring', 'Wellness Planning', 'Nutrition Guidance'],
              avatar: '/avatars/agent-care.png',
              performance: {
                tasksCompleted: 78,
                successRate: 96,
                averageResponseTime: 0.8,
                totalEarnings: 2100
              },
              metadata: {
                model: 'GPT-3.5',
                version: '3.5-turbo',
                lastUpdated: new Date().toISOString()
              },
              capabilities: ['Health Monitoring', 'Wellness Planning'],
              evolutionStage: 'Advanced',
              llmConfig: {
                model: 'GPT-3.5',
                version: '3.5-turbo',
                temperature: 0.6,
                maxTokens: 2048,
                contextWindow: 2048
              },
              ragConfig: {
                dataSource: 'health-data',
                vectorDB: 'pinecone',
                knowledgeBase: ['Health guidelines', 'Nutrition facts'],
                lastUpdated: new Date().toISOString()
              },
              evolutionHistory: [],
              individualStats: {
                totalUpgrades: 3,
                totalDmtSpent: 350,
                uniqueConversations: 28,
                domainExpertise: 85,
                lastActive: new Date().toISOString()
              }
            },
            {
              id: 'agent-crypto',
              name: 'Crypto Alpha Agent',
              domain: 'Crypto',
              description: 'Advanced cryptocurrency analysis and trading insights',
              personality: 'Strategic',
              cost: 150,
              xp: 12000,
              level: 12,
              xpToNext: 800,
              mintDate: new Date().toISOString(),
              owner: 'user-wallet-address',
              status: 'active' as const,
              type: 'master' as const,
              skills: ['Crypto Analysis', 'Trading Strategies', 'Market Research'],
              avatar: '/avatars/agent-crypto.png',
              performance: {
                tasksCompleted: 156,
                successRate: 94,
                averageResponseTime: 0.5,
                totalEarnings: 4500
              },
              metadata: {
                model: 'GPT-4',
                version: '4.0',
                lastUpdated: new Date().toISOString()
              },
              capabilities: ['Crypto Analysis', 'Trading Strategies'],
              evolutionStage: 'Expert',
              llmConfig: {
                model: 'GPT-4',
                version: '4.0',
                temperature: 0.5,
                maxTokens: 4096,
                contextWindow: 4096
              },
              ragConfig: {
                dataSource: 'crypto-data',
                vectorDB: 'pinecone',
                knowledgeBase: ['Crypto markets', 'Trading strategies'],
                lastUpdated: new Date().toISOString()
              },
              evolutionHistory: [],
              individualStats: {
                totalUpgrades: 5,
                totalDmtSpent: 750,
                uniqueConversations: 42,
                domainExpertise: 95,
                lastActive: new Date().toISOString()
              }
            }
          ];
          
          // Transform mock agents to match our interface
          const transformedMockAgents: Agent[] = mockAgents.map(agent => ({
            id: agent.id,
            name: agent.name,
            xp: agent.xp,
            level: agent.level,
            xpToNext: agent.xpToNext,
            tasksCompleted: agent.performance.tasksCompleted,
            usageCount: agent.performance.totalEarnings * 10,
            status: agent.status,
            lastActive: agent.metadata?.lastUpdated ? 
              new Date(agent.metadata.lastUpdated).toLocaleString() : 'Unknown',
            type: agent.type,
            domain: agent.domain,
            personality: agent.personality,
            description: agent.description,
            avatar: agent.avatar,
            specialization: agent.skills[0] || 'General',
            specializations: agent.skills,
            capabilities: agent.capabilities,
            performance: agent.performance,
          }));
          
          setAgents(transformedMockAgents);
          setFilteredAgents(transformedMockAgents);
        } else {
          // Transform agentService data to match our interface
          const transformedAgents: Agent[] = agentData.map(agent => ({
            id: agent.id || '',
            name: agent.name,
            xp: agent.xp,
            level: agent.level,
            xpToNext: agent.xpToNext || 0,
            tasksCompleted: agent.performance.tasksCompleted,
            usageCount: agent.performance.totalEarnings * 10, // Estimate usage from earnings
            status: agent.status === 'inactive' ? 'idle' : agent.status,
            lastActive: agent.metadata?.lastUpdated ? 
              new Date(agent.metadata.lastUpdated).toLocaleString() : 'Unknown',
            type: agent.type || 'master',
            domain: agent.domain,
            personality: agent.personality,
            description: agent.description,
            avatar: getAgentAvatar(agent.id || ''),
            specialization: agent.skills[0] || 'General',
            specializations: agent.skills,
            capabilities: agent.capabilities || [],
            performance: agent.performance,
          }));
          
          setAgents(transformedAgents);
          setFilteredAgents(transformedAgents);
        }
      } catch (error) {
        console.error('Failed to load agents:', error);
        setSnackbar({ open: true, message: 'Failed to load agents', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  // Helper function to get agent avatar
  const getAgentAvatar = (agentId: string): string => {
    const avatarMap: Record<string, string> = {
      'agent-cfo': '/autonomous-cfo.png',
      'agent-care': '/care-orchestrator.png',
      'agent-crypto': '/crypto-alpha.png',
    };
    return avatarMap[agentId] || '/default-agent.png';
  };

  // Helper function to get agent icon
  const getAgentIcon = (agentId: string) => {
    const iconMap: Record<string, React.ComponentType> = {
      'agent-cfo': FinanceIcon,
      'agent-care': HealthIcon,
      'agent-crypto': CryptoIcon,
    };
    return iconMap[agentId] || PsychologyIcon;
  };

  // Helper function to get domain label with emoji
  const getDomainLabel = (domain: string): string => {
    const domainMap: Record<string, string> = {
      'Finance': '💰 Finance',
      'Health': '❤️ Health',
      'Crypto': '📊 Crypto',
    };
    return domainMap[domain] || domain;
  };

  useEffect(() => {
    setFilteredAgents(agents);
  }, [agents]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    
    // Filter agents based on tab
    switch (newValue) {
      case 0: // All Agents
        setFilteredAgents(agents);
        break;
      case 1: // Finance
        setFilteredAgents(agents.filter(agent => agent.domain === 'Finance'));
        break;
      case 2: // Health
        setFilteredAgents(agents.filter(agent => agent.domain === 'Health'));
        break;
      case 3: // Crypto
        setFilteredAgents(agents.filter(agent => agent.domain === 'Crypto'));
        break;
      default:
        setFilteredAgents(agents);
    }
  };

  const handleUpgrade = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setShowUpgradeModal(true);
    }
  };

  const handleUpgradeConfirm = (agentId: string) => {
    // Simulate upgrade process
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId 
          ? { 
              ...agent, 
              level: agent.level + 1,
              xp: 0, // Reset XP after upgrade
              tasksCompleted: 0, // Reset tasks after upgrade
              usageCount: 0, // Reset usage after upgrade
            }
          : agent
      )
    );

    // Update user balance (mock)
    setUserBalance(prev => ({
      dmt: prev.dmt - 50, // Mock cost
      dmtx: prev.dmtx - 5,
    }));

    setSnackbar({
      open: true,
      message: `${selectedAgent?.name} upgraded to Level ${selectedAgent ? selectedAgent.level + 1 : 1}!`,
      severity: 'success'
    });

    setShowUpgradeModal(false);
    setSelectedAgent(null);
  };

  const handleTaskCompleted = (agentId: string, xpGained: number, dmtSpent: number) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { 
            ...agent, 
            xp: agent.xp + xpGained, 
            tasksCompleted: agent.tasksCompleted + 1,
            usageCount: agent.usageCount + 1
          }
        : agent
    ));
    setUserBalance(prev => ({ 
      ...prev, 
      dmt: Math.max(0, prev.dmt - dmtSpent) 
    }));
    setSnackbar({ 
      open: true, 
      message: `Task completed! +${xpGained} XP, -${dmtSpent} DMT`, 
      severity: 'success' 
    });
  };

  const handleManageTasks = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowTaskManagement(true);
  };

  const handleShowXPEvolution = (agent: Agent) => {
    setSelectedAgentForXP(agent);
    setShowXPEvolutionModal(true);
  };

  const handleVisualEvolution = async (agent: Agent) => {
    try {
      // Import the enhanced AgentService
      const AgentService = (await import('../services/agentService')).default;
      
      // Show loading state
      setSnackbar({ 
        open: true, 
        message: `Starting visual evolution for ${agent.name}...`, 
        severity: 'info' 
      });

      // Call the new visual evolution method
      const result = await AgentService.evolveAgentWithVisuals(
        'user-wallet-address', // TODO: Get actual wallet address
        agent.id!,
        100 // DMT amount for evolution
      );

      if (result.success) {
        setSnackbar({ 
          open: true, 
          message: `🎉 ${agent.name} evolved successfully! New avatar and visual effects applied.`, 
          severity: 'success' 
        });
        
        // Update the agent in the local state
        setAgents(prev => prev.map(a => 
          a.id === agent.id 
            ? { 
                ...a, 
                level: result.evolutionDetails.newLevel,
                xp: result.evolutionDetails.newXP,
                avatar: result.evolutionDetails.visualEvolution.newAvatar,
                evolutionStage: result.evolutionDetails.evolutionStage
              }
            : a
        ));
      } else {
        setSnackbar({ 
          open: true, 
          message: `Evolution failed: ${result.error}`, 
          severity: 'error' 
        });
      }
    } catch (error) {
      console.error('Visual evolution error:', error);
      setSnackbar({ 
        open: true, 
        message: 'Failed to evolve agent. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const handleTaskDelegation = async (agentId: string, taskName: string) => {
    try {
      // Show initial snackbar
      setSnackbar({ 
        open: true, 
        message: `Task sent to agent: Preparing response...`, 
        severity: 'info' 
      });

      // Simulate async task processing
      setTimeout(() => {
        setSnackbar({ 
          open: true, 
          message: `Task completed by agent! +10 XP earned`, 
          severity: 'success' 
        });
        
        // Update agent XP
        setAgents(prevAgents => 
          prevAgents.map(agent => 
            agent.id === agentId 
              ? { 
                  ...agent, 
                  xp: agent.xp + 10,
                  tasksCompleted: agent.tasksCompleted + 1,
                  performance: {
                    ...agent.performance,
                    tasksCompleted: agent.performance.tasksCompleted + 1,
                    totalEarnings: agent.performance.totalEarnings + 1
                  }
                }
              : agent
          )
        );
      }, 2000);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to delegate task', 
        severity: 'error' 
      });
    }
  };

  const getTierStats = () => {
    const tierCounts = agents.reduce((acc, agent) => {
      const tier = getAgentTier(agent.level);
      if (tier) {
        acc[tier.llmTier] = (acc[tier.llmTier] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return tierCounts;
  };

  const tierStats = getTierStats();

  return (
    <Box sx={{ p: 4, bgcolor: '#121212', minHeight: '100vh' }}>
      {/* Task Creation Modal */}
      <Dialog 
        open={showTaskModal} 
        onClose={() => setShowTaskModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 25, 25, 0.95)',
            color: 'white',
            border: '2px solid #00ffff',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#00ffff', 
          borderBottom: '1px solid #00ffff',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🎯 Create New Task
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              label="Task Name"
              variant="outlined"
              fullWidth
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#00ffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ffff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b0b0',
                  '&.Mui-focused': {
                    color: '#00ffff',
                  },
                },
              }}
            />
            <TextField
              label="Task Description"
              variant="outlined"
              fullWidth
              multiline
              minRows={3}
              value={taskDescription}
              onChange={e => setTaskDescription(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: '#00ffff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ffff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ffff',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#b0b0b0',
                  '&.Mui-focused': {
                    color: '#00ffff',
                  },
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Assign to Agent</InputLabel>
              <Select
                value={assignedAgent}
                onChange={e => setAssignedAgent(e.target.value)}
                label="Assign to Agent"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#00ffff',
                  },
                }}
              >
                {agents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PsychologyIcon sx={{ color: '#00ffff' }} />
                      <Typography>{agent.name}</Typography>
                      <Chip 
                        label={agent.type} 
                        size="small" 
                        sx={{ 
                          bgcolor: agent.type === 'master' ? '#ff9800' : '#4caf50',
                          color: 'white',
                          fontSize: '0.7rem'
                        }} 
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Task Priority</InputLabel>
              <Select
                value={taskPriority}
                onChange={e => setTaskPriority(e.target.value)}
                label="Task Priority"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00ffff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#00ffff',
                  },
                }}
              >
                <MenuItem value="low">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Low" size="small" color="success" />
                    <Typography>Low Priority</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="medium">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Medium" size="small" color="warning" />
                    <Typography>Medium Priority</Typography>
                  </Box>
                </MenuItem>
                <MenuItem value="high">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="High" size="small" color="error" />
                    <Typography>High Priority</Typography>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          borderTop: '1px solid #00ffff',
          gap: 2 
        }}>
          <Button 
            onClick={() => setShowTaskModal(false)} 
            variant="outlined"
            sx={{ 
              borderColor: '#666',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                color: '#999',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Create task logic would go here
              console.log('Creating task:', {
                taskName,
                taskDescription,
                assignedAgent,
                taskPriority,
              });
              setShowTaskModal(false);
              setSnackbar({ open: true, message: 'Task created successfully!', severity: 'success' });
              setTaskName('');
              setTaskDescription('');
              setAssignedAgent('');
              setTaskPriority('');
            }}
            variant="contained"
            sx={{
              bgcolor: '#00ffff',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#00cccc',
              }
            }}
            disabled={!taskName || !taskDescription || !assignedAgent || !taskPriority}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold' }}>
          🤖 Your Agents
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
          Manage your AI agents and track their performance
        </Typography>

        {/* Stats Overview */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<PsychologyIcon />}
            label={`${agents.length} Total Agents`}
            sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', border: '1px solid #00ffff' }}
          />
          <Chip
            icon={<StarIcon />}
            label={`${tierStats.Mini || 0} Mini LLM`}
            sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', border: '1px solid #4caf50' }}
          />
          <Chip
            icon={<TrendingUpIcon />}
            label={`${tierStats.Pro || 0} Pro LLM`}
            sx={{ bgcolor: 'rgba(33, 150, 243, 0.1)', color: '#2196f3', border: '1px solid #2196f3' }}
          />
          <Chip
            icon={<AutoAwesomeIcon />}
            label={`${tierStats.Custom || 0} Custom LLM`}
            sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ff9800', border: '1px solid #ff9800' }}
          />
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-selected': { color: '#00ffff' },
              },
              '& .MuiTabs-indicator': { bgcolor: '#00ffff' },
            }}
          >
            <Tab label="All Agents" />
            <Tab label="Finance" />
            <Tab label="Health" />
            <Tab label="Crypto" />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'outlined'}
              startIcon={<GridIcon />}
              onClick={() => setViewMode('grid')}
              sx={{
                bgcolor: viewMode === 'grid' ? '#00ffff' : 'transparent',
                color: viewMode === 'grid' ? 'black' : '#00ffff',
                borderColor: '#00ffff',
                '&:hover': {
                  bgcolor: viewMode === 'grid' ? '#00e5e5' : 'rgba(0, 255, 255, 0.1)',
                },
              }}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'contained' : 'outlined'}
              startIcon={<ListIcon />}
              onClick={() => setViewMode('list')}
              sx={{
                bgcolor: viewMode === 'list' ? '#00ffff' : 'transparent',
                color: viewMode === 'list' ? 'black' : '#00ffff',
                borderColor: '#00ffff',
                '&:hover': {
                  bgcolor: viewMode === 'list' ? '#00e5e5' : 'rgba(0, 255, 255, 0.1)',
                },
              }}
            >
              List
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Moved task creation button outside the fallback */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#00ffff',
            color: 'black',
            '&:hover': { bgcolor: '#00e5e5' },
          }}
          onClick={() => setShowTaskModal(true)}
        >
          Create New Task
        </Button>
      </Box>

      {/* Agents Grid/List */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
            Loading your agents...
          </Typography>
        </Box>
      ) : filteredAgents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          {/* Empty State Icon */}
          <Box sx={{ mb: 4 }}>
            <PsychologyIcon sx={{ fontSize: 80, color: 'rgba(0, 255, 255, 0.3)', mb: 2 }} />
          </Box>
          
          {/* Empty State Title */}
          <Typography variant="h4" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold' }}>
            No Agents Found
          </Typography>
          
          {/* Empty State Description */}
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4, maxWidth: '600px', mx: 'auto' }}>
            You don't have any AI agents yet. Create your first agent to start automating tasks and earning rewards!
          </Typography>
          
          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/ai-agents/mint')}
              sx={{
                bgcolor: '#00ffff',
                color: 'black',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                minHeight: '48px',
                '&:hover': {
                  bgcolor: '#00e5e5',
                },
              }}
            >
              Create Your First Agent
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => router.push('/ai-agents/marketplace')}
              sx={{
                borderColor: '#ff9800',
                color: '#ff9800',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                fontSize: '16px',
                minHeight: '48px',
                '&:hover': {
                  borderColor: '#ffb74d',
                  bgcolor: 'rgba(255, 152, 0, 0.1)',
                },
              }}
            >
              Browse Marketplace
            </Button>
          </Box>
          
          {/* Feature Highlights */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 3, 
            maxWidth: '800px', 
            mx: 'auto',
            mt: 6
          }}>
            <Card sx={{ 
              bgcolor: 'rgba(0, 255, 255, 0.05)', 
              border: '1px solid rgba(0, 255, 255, 0.2)',
              textAlign: 'center',
              p: 2
            }}>
              <StarIcon sx={{ color: '#00ffff', fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>
                AI-Powered
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Advanced AI agents that learn and evolve over time
              </Typography>
            </Card>
            
            <Card sx={{ 
              bgcolor: 'rgba(76, 175, 80, 0.05)', 
              border: '1px solid rgba(76, 175, 80, 0.2)',
              textAlign: 'center',
              p: 2
            }}>
              <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#4caf50', mb: 1 }}>
                Earn Rewards
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Complete tasks and earn DMT tokens as rewards
              </Typography>
            </Card>
            
            <Card sx={{ 
              bgcolor: 'rgba(255, 152, 0, 0.05)', 
              border: '1px solid rgba(255, 152, 0, 0.2)',
              textAlign: 'center',
              p: 2
            }}>
              <TrophyIcon sx={{ color: '#ff9800', fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ color: '#ff9800', mb: 1 }}>
                Level Up
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Agents gain XP and unlock new capabilities
              </Typography>
            </Card>
          </Box>
          
          {/* Help Text */}
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 4 }}>
            Need help getting started? Check out our{' '}
            <Button
              variant="text"
              onClick={() => router.push('/learn/tutorials')}
              sx={{ 
                color: '#00ffff', 
                textDecoration: 'underline',
                p: 0,
                minWidth: 'auto',
                fontSize: 'inherit'
              }}
            >
              tutorials
            </Button>
            {' '}or{' '}
            <Button
              variant="text"
              onClick={() => router.push('/learn/agents')}
              sx={{ 
                color: '#00ffff', 
                textDecoration: 'underline',
                p: 0,
                minWidth: 'auto',
                fontSize: 'inherit'
              }}
            >
              agent guide
            </Button>
            .
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAgents.map((agent, index) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={agent.id}>
                <AgentCard
                  agent={{
                    id: agent.id,
                    name: agent.name,
                    xp: agent.xp,
                    level: agent.level,
                    tasksCompleted: agent.performance.tasksCompleted,
                    usageCount: agent.performance.totalEarnings * 10,
                    specialization: agent.specialization,
                    status: agent.status,
                    lastActive: agent.lastActive,
                    tier: agent.type,
                    xpToNext: agent.xpToNext,
                    performance: agent.performance,
                  }}
                  onUpgrade={handleUpgrade}
                  onManageTasks={handleManageTasks}
                  onTaskCompleted={handleTaskCompleted}
                  userBalance={userBalance}
                  userProfile={undefined}
                  showAccessControl={false}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Upgrade Modal */}
      {selectedAgent && (
        <AgentUpgradeModal
          open={showUpgradeModal}
          onClose={() => {
            setShowUpgradeModal(false);
            setSelectedAgent(null);
          }}
          onUpgrade={handleUpgradeConfirm}
          agent={selectedAgent}
          userBalance={userBalance}
        />
      )}

      {/* Task Management Modal */}
      {showTaskManagement && selectedAgent && (
        <Dialog
          open={showTaskManagement}
          onClose={() => setShowTaskManagement(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#121212',
              color: 'white',
              minHeight: '80vh',
            }
          }}
        >
          <DialogTitle sx={{ color: '#00ffff', borderBottom: '1px solid #00ffff' }}>
            Task Management - {selectedAgent.name}
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <TaskManagement
              selectedAgent={{
                id: selectedAgent.id,
                name: selectedAgent.name,
                level: selectedAgent.level,
                capabilities: selectedAgent.specializations,
                dmtBalance: userBalance.dmt,
              }}
              onTaskCompleted={handleTaskCompleted}
            />
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid #00ffff', p: 2 }}>
            <Button
              onClick={() => setShowTaskManagement(false)}
              sx={{ color: '#00ffff' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* XP Evolution Modal */}
      <Dialog 
        open={showXPEvolutionModal} 
        onClose={() => setShowXPEvolutionModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 25, 25, 0.95)',
            color: 'white',
            border: '2px solid #fdcb6e',
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#fdcb6e', 
          borderBottom: '1px solid #fdcb6e',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <TimelineIcon />
          XP Evolution Log
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedAgentForXP && (
            <Box>
              {/* Agent Info */}
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar sx={{ mr: 2, backgroundColor: 'rgba(253, 203, 110, 0.1)', border: '2px solid #fdcb6e' }}>
                  {React.createElement(getAgentIcon(selectedAgentForXP.id))}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                    {selectedAgentForXP.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                    Level {selectedAgentForXP.level} • {selectedAgentForXP.xp} XP
                  </Typography>
                </Box>
              </Box>

              {/* XP Progress */}
              <Box mb={3}>
                <Typography variant="h6" sx={{ color: '#fdcb6e', mb: 1 }}>
                  Progress to Next Level
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, ((selectedAgentForXP.xp - (selectedAgentForXP.level - 1) * 1200) / 1200) * 100)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#fdcb6e',
                      borderRadius: 4
                    }
                  }}
                />
                <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 1 }}>
                  {selectedAgentForXP.xpToNext > 0 ? `${selectedAgentForXP.xpToNext} XP to next level` : 'Max level reached'}
                </Typography>
              </Box>

              {/* Evolution History */}
              <Typography variant="h6" sx={{ color: '#fdcb6e', mb: 2 }}>
                Evolution History
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <TrophyIcon sx={{ color: '#fdcb6e' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Level 5 Achieved"
                    secondary="Advanced financial analysis capabilities unlocked"
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="150 Tasks Completed"
                    secondary="+10 XP per task • 98% success rate"
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <ListItem>
                  <ListItemIcon>
                    <StarIcon sx={{ color: '#00ffff' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Performance Bonus"
                    secondary="High accuracy reward • +50 XP"
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                <ListItem>
                  <ListItemIcon>
                    <AutoAwesomeIcon sx={{ color: '#e84393' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Specialization Upgrade"
                    secondary="Advanced risk management module • +100 XP"
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setShowXPEvolutionModal(false)}
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgentManagement;