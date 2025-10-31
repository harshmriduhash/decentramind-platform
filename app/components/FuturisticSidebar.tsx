'use client';

import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
  Chip,
  Badge,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Home as HomeIcon,
  AccountTree as WorkflowIcon,
  Psychology as PsychologyIcon,
  Chat as ChatIcon,
  Star as StarIcon,
  AccountBalance as TokenomicsIcon,
  TrendingUp as StakingIcon,
  LocalFireDepartment as BurnIcon,
  Gavel as GovernanceIcon,
  Add as MintIcon,
  Store as MarketplaceIcon,
  Timeline as EvolutionIcon,
  ViewInAr as MetaverseIcon,
  RocketLaunch as LaunchpadIcon,
  Engineering as ServicesIcon,
  LocalHospital as HealthIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { isFeatureEnabled } from '../config/featureFlags';

interface FuturisticSidebarProps {
  onDashboardChange: (index: number) => void;
  selectedDashboard: number;
}

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactElement;
  dashboardIndex: number;
  path: string;
  description: string;
  status?: 'active' | 'coming-soon' | 'deprecated' | 'hidden';
  badge?: string;
}

interface SidebarCategory {
  id: string;
  title: string;
  icon: React.ReactElement;
  items: SidebarItem[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

const sidebarCategories: SidebarCategory[] = [
  {
    id: 'core',
    title: '🔐 Core Hub',
    icon: <HomeIcon />,
    items: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        icon: <HomeIcon />,
        dashboardIndex: 0,
        path: '/dashboard',
        description: 'Main platform overview',
        status: 'active',
      },
      {
        id: 'workflows',
        name: 'Agent Workflows',
        icon: <WorkflowIcon />,
        dashboardIndex: 3,
        path: '/workflows',
        description: 'Automated AI workflows',
        status: 'active',
      },
      {
        id: 'agents',
        name: 'Agent Management',
        icon: <PsychologyIcon />,
        dashboardIndex: 2,
        path: '/agents',
        description: 'Manage your AI agents',
        status: 'active',
      },
      {
        id: 'chat',
        name: 'Chat & Services Hub',
        icon: <ChatIcon />,
        dashboardIndex: 1,
        path: '/chat',
        description: 'AI chat interface',
        status: 'active',
      },
      {
        id: 'subscription',
        name: 'Subscription & Credits',
        icon: <StarIcon />,
        dashboardIndex: 11,
        path: '/subscription',
        description: 'Manage subscriptions',
        status: 'active',
      },
      {
        id: 'ai-console',
        name: 'AI Console',
        icon: <PsychologyIcon />,
        dashboardIndex: 12,
        path: '/ai-console',
        description: 'Unified AI agent management',
        status: 'active',
        badge: 'New',
      },
    ],
    defaultExpanded: true,
  },
  {
    id: 'token',
    title: '💎 Token Utilities',
    icon: <TokenomicsIcon />,
    items: [
      {
        id: 'tokenomics',
        name: 'Tokenomics',
        icon: <TokenomicsIcon />,
        dashboardIndex: 6,
        path: '/tokenomics',
        description: 'Token economics dashboard',
        status: 'active',
      },
      {
        id: 'staking',
        name: 'Staking & Rewards',
        icon: <StakingIcon />,
        dashboardIndex: 4,
        path: '/staking',
        description: 'Stake tokens and earn rewards',
        status: 'active',
      },
      {
        id: 'burn',
        name: 'Burning Analytics',
        icon: <BurnIcon />,
        dashboardIndex: 7,
        path: '/burn',
        description: 'Token burning metrics',
        status: 'active',
      },
      {
        id: 'governance',
        name: 'DAO Governance',
        icon: <GovernanceIcon />,
        dashboardIndex: 8,
        path: '/governance',
        description: 'Vote on proposals',
        status: 'hidden', // Hidden for now - not fully functional
      },
    ],
    defaultExpanded: true,
  },
  {
    id: 'ecosystem',
    title: '🧠 Agent Ecosystem',
    icon: <PsychologyIcon />,
    items: [
      {
        id: 'mint-agent',
        name: 'Agent Minting',
        icon: <MintIcon />,
        dashboardIndex: 2, // Using Agent Management for now
        path: '/mint-agent',
        description: 'Create new AI agents',
        status: 'active',
      },
      {
        id: 'marketplace',
        name: 'Marketplace',
        icon: <MarketplaceIcon />,
        dashboardIndex: 5,
        path: '/marketplace',
        description: 'Buy and sell AI agents',
        status: 'active',
      },
      {
        id: 'evolution',
        name: 'History & Evolution Tracker',
        icon: <EvolutionIcon />,
        dashboardIndex: 13,
        path: '/evolution',
        description: 'Track agent growth',
        status: 'active',
      },
    ],
    defaultExpanded: true,
  },
  {
    id: 'future',
    title: '🌍 Future Expansion',
    icon: <MetaverseIcon />,
    items: [
      {
        id: 'metaverse',
        name: 'Metaverse Hub',
        icon: <MetaverseIcon />,
        dashboardIndex: 14,
        path: '/metaverse',
        description: 'Virtual world access',
        status: 'coming-soon',
        badge: 'Coming Soon',
      },
      // Launchpad removed as deprecated
    ],
    defaultExpanded: false,
  },
  {
    id: 'services',
    title: '🛠️ Services',
    icon: <ServicesIcon />,
    items: [
      {
        id: 'professional-services',
        name: 'Professional Services',
        icon: <ServicesIcon />,
        dashboardIndex: 12,
        path: '/services',
        description: 'Professional tools and services',
        status: 'active',
      },
    ],
    defaultExpanded: false,
  },
];

const FuturisticSidebar: React.FC<FuturisticSidebarProps> = ({
  selectedDashboard,
  onDashboardChange,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(sidebarCategories.filter(cat => cat.defaultExpanded).map(cat => cat.id))
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.status === 'active') {
      onDashboardChange(item.dashboardIndex);
    }
  };

  const getItemStatusColor = (status?: string) => {
    switch (status) {
      case 'coming-soon':
        return '#ffa726';
      case 'deprecated':
        return '#f44336';
      case 'hidden':
        return '#9e9e9e';
      default:
        return '#00ffff';
    }
  };

  const getItemOpacity = (status?: string) => {
    switch (status) {
      case 'hidden':
        return 0.3;
      case 'deprecated':
        return 0.5;
      default:
        return 1;
    }
  };

  const renderSidebarItem = (item: SidebarItem) => {
    const isSelected = selectedDashboard === item.dashboardIndex;
    const isDisabled = item.status !== 'active';
    const statusColor = getItemStatusColor(item.status);
    const opacity = getItemOpacity(item.status);

    if (item.status === 'hidden') {
      return null;
    }

    return (
      <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
        <Tooltip 
          title={item.description} 
          placement="right"
          disableHoverListener={!sidebarCollapsed}
        >
          <ListItemButton
            onClick={() => handleItemClick(item)}
            disabled={isDisabled}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              minHeight: 48,
              opacity,
              bgcolor: isSelected 
                ? 'rgba(0, 255, 255, 0.15)' 
                : 'transparent',
              border: isSelected 
                ? '1px solid #00ffff' 
                : '1px solid transparent',
              '&:hover': {
                bgcolor: isDisabled 
                  ? 'rgba(158, 158, 158, 0.1)' 
                  : 'rgba(0, 255, 255, 0.1)',
                border: isDisabled 
                  ? '1px solid #9e9e9e' 
                  : '1px solid rgba(0, 255, 255, 0.3)',
              },
              '&.Mui-disabled': {
                opacity: 0.5,
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: isSelected ? '#00ffff' : statusColor,
                '& .MuiSvgIcon-root': {
                  fontSize: 20,
                },
              }}
            >
              {item.badge ? (
                <Badge
                  badgeContent={
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 16,
                        fontSize: '0.65rem',
                        bgcolor: '#ffa726',
                        color: 'white',
                        '& .MuiChip-label': {
                          px: 0.5,
                        },
                      }}
                    />
                  }
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {item.icon}
                </Badge>
              ) : (
                item.icon
              )}
            </ListItemIcon>
            {!sidebarCollapsed && (
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? '#00ffff' : 'white',
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </ListItem>
    );
  };

  const renderCategory = (category: SidebarCategory) => {
    const isExpanded = expandedCategories.has(category.id);
    const hasActiveItems = category.items.some(item => item.status === 'active');
    const visibleItems = category.items.filter(item => item.status !== 'hidden');

    if (visibleItems.length === 0) {
      return null;
    }

    return (
      <Box key={category.id} sx={{ mb: 2 }}>
        {category.collapsible !== false ? (
          <ListItemButton
            onClick={() => toggleCategory(category.id)}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 1,
              minHeight: 40,
              bgcolor: 'rgba(0, 255, 255, 0.05)',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              '&:hover': {
                bgcolor: 'rgba(0, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: hasActiveItems ? '#00ffff' : '#9e9e9e',
              }}
            >
              {category.icon}
            </ListItemIcon>
            {!sidebarCollapsed && (
              <>
                <ListItemText
                  primary={category.title}
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: hasActiveItems ? '#00ffff' : '#9e9e9e',
                  }}
                />
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </>
            )}
          </ListItemButton>
        ) : (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#9e9e9e',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {category.title}
            </Typography>
          </Box>
        )}

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {visibleItems.map(renderSidebarItem)}
          </List>
        </Collapse>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: sidebarCollapsed ? 80 : 280,
        height: '100vh',
        bgcolor: 'rgba(15, 15, 15, 0.95)',
        borderRight: '2px solid rgba(0, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        transition: 'width 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64,
        }}
      >
        {!sidebarCollapsed && (
          <Typography
            variant="h6"
            sx={{
              color: '#00ffff',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
            }}
          >
            DecentraMind Labs
          </Typography>
        )}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            color: '#00ffff',
            '&:hover': {
              bgcolor: 'rgba(0, 255, 255, 0.1)',
            },
          }}
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          py: 1,
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'rgba(0, 0, 0, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(0, 255, 255, 0.3)',
            borderRadius: 3,
          },
        }}
      >
        {sidebarCategories.map(renderCategory)}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(0, 255, 255, 0.2)',
          textAlign: 'center',
        }}
      >
        {!sidebarCollapsed && (
          <Chip
            label="v1.0"
            size="small"
            sx={{
              bgcolor: 'rgba(0, 255, 255, 0.1)',
              color: '#00ffff',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              fontSize: '0.7rem',
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default FuturisticSidebar;