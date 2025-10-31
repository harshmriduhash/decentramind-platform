'use client';

import React, { useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Button,
  Stack,
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
  Engineering as ServicesIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  KeyboardArrowDown as ChevronDownIcon,
} from '@mui/icons-material';

interface HorizontalNavbarProps {
  onDashboardChange: (index: number) => void;
  selectedDashboard: number;
}

interface NavItem {
  id: string;
  name: string;
  icon: React.ReactElement;
  dashboardIndex: number;
  path: string;
  description: string;
  status?: 'active' | 'coming-soon' | 'deprecated' | 'hidden';
  badge?: string;
}

interface NavCategory {
  id: string;
  title: string;
  icon: React.ReactElement;
  items: NavItem[];
  color: string;
}

const navCategories: NavCategory[] = [
  {
    id: 'core',
    title: 'Core Hub',
    icon: <HomeIcon />,
    color: '#00ffff',
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
        name: 'AI Chat',
        icon: <ChatIcon />,
        dashboardIndex: 1,
        path: '/chat',
        description: 'AI chat interface',
        status: 'active',
      },
      {
        id: 'subscription',
        name: 'Subscription',
        icon: <StarIcon />,
        dashboardIndex: 11,
        path: '/subscription',
        description: 'Manage subscriptions',
        status: 'active',
      },
    ],
  },
  {
    id: 'token',
    title: 'Token Utilities',
    icon: <TokenomicsIcon />,
    color: '#4ecdc4',
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
    ],
  },
  {
    id: 'ecosystem',
    title: 'Agent Ecosystem',
    icon: <PsychologyIcon />,
    color: '#9b59b6',
    items: [
      {
        id: 'mint-agent',
        name: 'Agent Minting',
        icon: <MintIcon />,
        dashboardIndex: 2,
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
        name: 'Evolution Tracker',
        icon: <EvolutionIcon />,
        dashboardIndex: 13,
        path: '/evolution',
        description: 'Track agent growth',
        status: 'active',
      },
    ],
  },
  {
    id: 'future',
    title: 'Future',
    icon: <MetaverseIcon />,
    color: '#ffa726',
    items: [
      {
        id: 'metaverse',
        name: 'Metaverse Hub',
        icon: <MetaverseIcon />,
        dashboardIndex: 14,
        path: '/metaverse',
        description: 'Virtual world access',
        status: 'coming-soon',
        badge: 'Soon',
      },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    icon: <ServicesIcon />,
    color: '#ff6b6b',
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
  },
];

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({
  selectedDashboard,
  onDashboardChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenus, setCategoryMenus] = useState<{ [key: string]: boolean }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCategoryMenuToggle = (categoryId: string, event?: React.MouseEvent<HTMLElement>) => {
    if (event) {
      setAnchorEl(event.currentTarget);
    } else {
      setAnchorEl(null);
    }
    setCategoryMenus(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleItemClick = (item: NavItem) => {
    if (item.status === 'active') {
      onDashboardChange(item.dashboardIndex);
      setMobileMenuOpen(false);
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

  const renderNavItem = (item: NavItem, isMobile = false) => {
    const isSelected = selectedDashboard === item.dashboardIndex;
    const isDisabled = item.status !== 'active';
    const statusColor = getItemStatusColor(item.status);

    if (item.status === 'hidden') {
      return null;
    }

    const itemContent = (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: isMobile ? 2 : 1.5,
          py: isMobile ? 1.5 : 1,
          borderRadius: 2,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.6 : 1,
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
          transition: 'all 0.2s ease',
        }}
        onClick={() => handleItemClick(item)}
      >
        <Box sx={{ color: isSelected ? '#00ffff' : statusColor }}>
          {item.badge ? (
            <Badge
              badgeContent={
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: '0.6rem',
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
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: isSelected ? '#00ffff' : 'white',
            fontWeight: isSelected ? 600 : 400,
            fontSize: isMobile ? '0.9rem' : '0.8rem',
          }}
        >
          {item.name}
        </Typography>
      </Box>
    );

    if (isMobile) {
      return (
        <ListItem key={item.id} disablePadding>
          <Tooltip title={item.description} placement="right">
            {itemContent}
          </Tooltip>
        </ListItem>
      );
    }

    return (
      <Tooltip key={item.id} title={item.description} placement="bottom">
        {itemContent}
      </Tooltip>
    );
  };

  const renderCategoryMenu = (category: NavCategory) => {
    const isOpen = categoryMenus[category.id];
    const hasActiveItems = category.items.some(item => item.status === 'active');
    const visibleItems = category.items.filter(item => item.status !== 'hidden');

    if (visibleItems.length === 0) {
      return null;
    }

    return (
      <Box key={category.id} sx={{ position: 'relative' }}>
        <Button
          onClick={(event) => handleCategoryMenuToggle(category.id, event)}
          sx={{
            color: hasActiveItems ? category.color : '#9e9e9e',
            textTransform: 'none',
            px: 2,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'rgba(0, 255, 255, 0.1)',
            },
          }}
          endIcon={isOpen ? <ExpandLessIcon /> : <ChevronDownIcon />}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {category.icon}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {category.title}
            </Typography>
          </Box>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          onClose={() => handleCategoryMenuToggle(category.id)}
          PaperProps={{
            sx: {
              bgcolor: 'rgba(25, 25, 25, 0.95)',
              border: '1px solid #00ffff',
              borderRadius: 2,
              mt: 1,
              minWidth: 200,
              backdropFilter: 'blur(10px)',
              '& .MuiMenuItem-root': {
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 255, 255, 0.1)',
                },
                '&.Mui-selected': {
                  bgcolor: 'rgba(0, 255, 255, 0.2)',
                },
              },
            },
          }}
        >
          {visibleItems.map(item => (
            <MenuItem
              key={item.id}
              onClick={() => handleItemClick(item)}
              selected={selectedDashboard === item.dashboardIndex}
            >
              <ListItemIcon sx={{ color: getItemStatusColor(item.status), minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: selectedDashboard === item.dashboardIndex ? 600 : 400,
                }}
              />
              {item.badge && (
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.6rem',
                    bgcolor: '#ffa726',
                    color: 'white',
                  }}
                />
              )}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  };

  const renderMobileMenu = () => (
    <Drawer
      anchor="top"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      PaperProps={{
        sx: {
          bgcolor: 'rgba(15, 15, 15, 0.95)',
          borderBottom: '2px solid #00ffff',
          backdropFilter: 'blur(10px)',
          mt: '64px', // Height of the AppBar
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        {navCategories.map(category => {
          const visibleItems = category.items.filter(item => item.status !== 'hidden');
          if (visibleItems.length === 0) return null;

          return (
            <Box key={category.id} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: category.color,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  mb: 1,
                  px: 1,
                }}
              >
                {category.title}
              </Typography>
              <List component="div" disablePadding>
                {visibleItems.map(item => renderNavItem(item, true))}
              </List>
              {category.id !== 'services' && <Divider sx={{ borderColor: 'rgba(0, 255, 255, 0.2)', my: 1 }} />}
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'rgba(15, 15, 15, 0.95)',
          borderBottom: '2px solid #00ffff',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important', px: { xs: 1, sm: 2 } }}>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{
              color: '#00ffff',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
              mr: 3,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            DecentraMind Labs
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              {navCategories.map(renderCategoryMenu)}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                onClick={handleMobileMenuToggle}
                sx={{
                  color: '#00ffff',
                  '&:hover': {
                    bgcolor: 'rgba(0, 255, 255, 0.1)',
                  },
                }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}

          {/* Version Badge */}
          <Chip
            label="v1.0"
            size="small"
            sx={{
              bgcolor: 'rgba(0, 255, 255, 0.1)',
              color: '#00ffff',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              fontSize: '0.7rem',
              ml: 2,
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      {renderMobileMenu()}

      {/* Spacer for fixed AppBar */}
      <Box sx={{ height: '64px' }} />
    </>
  );
};

export default HorizontalNavbar;
