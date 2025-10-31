"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useToast } from './ToastNotifications';

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'core' | 'feature' | 'experimental';
  impact: 'low' | 'medium' | 'high';
}

const AdminPanel: React.FC = () => {
  const { showSuccess, showError, showInfo } = useToast();
  
  const [modules, setModules] = useState<ModuleConfig[]>([
    {
      id: 'ai-agents',
      name: 'AI Agents',
      description: 'Core AI agent creation and management functionality',
      enabled: true,
      category: 'core',
      impact: 'high',
    },
    {
      id: 'crypto-alpha',
      name: 'Crypto Alpha Assistant',
      description: 'Advanced crypto token discovery and analysis',
      enabled: true,
      category: 'feature',
      impact: 'medium',
    },
    {
      id: 'governance',
      name: 'DAO Governance',
      description: 'Decentralized governance and voting system',
      enabled: true,
      category: 'core',
      impact: 'high',
    },
    {
      id: 'staking',
      name: 'Token Staking',
      description: 'Token staking and rewards system',
      enabled: true,
      category: 'core',
      impact: 'medium',
    },
    {
      id: 'marketplace',
      name: 'Agent Marketplace',
      description: 'Buy and sell AI agents marketplace',
      enabled: false,
      category: 'feature',
      impact: 'medium',
    },
    {
      id: 'metaverse',
      name: 'Metaverse Hub',
      description: 'Virtual world and metaverse integration',
      enabled: false,
      category: 'experimental',
      impact: 'low',
    },
    {
      id: 'mobile-app',
      name: 'Mobile App',
      description: 'Mobile application features',
      enabled: false,
      category: 'feature',
      impact: 'medium',
    },
    {
      id: 'advanced-analytics',
      name: 'Advanced Analytics',
      description: 'Detailed platform analytics and insights',
      enabled: false,
      category: 'experimental',
      impact: 'low',
    },
  ]);

  const [systemStats, setSystemStats] = useState({
    totalUsers: 1250,
    activeAgents: 89,
    totalTransactions: 15420,
    systemUptime: 99.8,
    lastBackup: '2024-01-15 14:30:00',
    securityAlerts: 0,
  });

  const handleModuleToggle = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, enabled: !module.enabled }
        : module
    ));
    showInfo(`Module ${modules.find(m => m.id === moduleId)?.name} toggled`);
  };

  const handleSaveConfig = () => {
    // Simulate saving configuration
    showSuccess('Configuration saved successfully');
  };

  const handleRefreshStats = () => {
    // Simulate refreshing stats
    showInfo('System statistics refreshed');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return '#2ed573';
      case 'feature': return '#0984e3';
      case 'experimental': return '#fdcb6e';
      default: return '#b0b0b0';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return '#2ed573';
      case 'medium': return '#fdcb6e';
      case 'high': return '#ff6b6b';
      default: return '#b0b0b0';
    }
  };

  const coreModules = modules.filter(m => m.category === 'core');
  const featureModules = modules.filter(m => m.category === 'feature');
  const experimentalModules = modules.filter(m => m.category === 'experimental');

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
          <AdminIcon sx={{ fontSize: 40 }} />
          Admin Panel
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          System administration and module management
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Admin Access Required:</strong> This panel is only accessible to authorized administrators. 
            Changes made here will affect all users on the platform.
          </Typography>
        </Alert>
      </Box>

      {/* System Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={2}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #2ed573',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GroupIcon sx={{ color: '#2ed573', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#2ed573' }}>
                  Users
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {systemStats.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Total registered
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #0984e3',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SettingsIcon sx={{ color: '#0984e3', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#0984e3' }}>
                  Agents
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {systemStats.activeAgents}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Active agents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #e84393',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: '#e84393', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#e84393' }}>
                  Transactions
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {systemStats.totalTransactions.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Total processed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #fdcb6e',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircleIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#fdcb6e' }}>
                  Uptime
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {systemStats.systemUptime}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                System uptime
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #ff6b6b',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ color: '#ff6b6b', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#ff6b6b' }}>
                  Alerts
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                {systemStats.securityAlerts}
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Security alerts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefreshStats}
              sx={{
                backgroundColor: '#00ffff',
                color: '#000000',
                '&:hover': { backgroundColor: '#00e6e6' }
              }}
            >
              Refresh Stats
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Module Management */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff',
        borderRadius: 2,
        mb: 4
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ color: '#00ffff' }}>
              Module Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveConfig}
              sx={{
                backgroundColor: '#2ed573',
                color: '#ffffff',
                '&:hover': { backgroundColor: '#26c965' }
              }}
            >
              Save Configuration
            </Button>
          </Box>

          {/* Core Modules */}
          <Typography variant="h6" sx={{ color: '#2ed573', mb: 2 }}>
            Core Modules
          </Typography>
          <List>
            {coreModules.map((module) => (
              <ListItem key={module.id} sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                mb: 1,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <ListItemIcon>
                  {module.enabled ? 
                    <VisibilityIcon sx={{ color: '#2ed573' }} /> : 
                    <VisibilityOffIcon sx={{ color: '#b0b0b0' }} />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {module.name}
                      </Typography>
                      <Chip
                        label={module.impact.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getImpactColor(module.impact),
                          color: '#ffffff',
                          fontSize: '0.6rem'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {module.description}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={module.enabled}
                        onChange={() => handleModuleToggle(module.id)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#2ed573',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#2ed573',
                          },
                        }}
                      />
                    }
                    label=""
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Feature Modules */}
          <Typography variant="h6" sx={{ color: '#0984e3', mb: 2 }}>
            Feature Modules
          </Typography>
          <List>
            {featureModules.map((module) => (
              <ListItem key={module.id} sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                mb: 1,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <ListItemIcon>
                  {module.enabled ? 
                    <VisibilityIcon sx={{ color: '#0984e3' }} /> : 
                    <VisibilityOffIcon sx={{ color: '#b0b0b0' }} />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {module.name}
                      </Typography>
                      <Chip
                        label={module.impact.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getImpactColor(module.impact),
                          color: '#ffffff',
                          fontSize: '0.6rem'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {module.description}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={module.enabled}
                        onChange={() => handleModuleToggle(module.id)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#0984e3',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#0984e3',
                          },
                        }}
                      />
                    }
                    label=""
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Experimental Modules */}
          <Typography variant="h6" sx={{ color: '#fdcb6e', mb: 2 }}>
            Experimental Modules
          </Typography>
          <List>
            {experimentalModules.map((module) => (
              <ListItem key={module.id} sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1,
                mb: 1,
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <ListItemIcon>
                  {module.enabled ? 
                    <VisibilityIcon sx={{ color: '#fdcb6e' }} /> : 
                    <VisibilityOffIcon sx={{ color: '#b0b0b0' }} />
                  }
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                        {module.name}
                      </Typography>
                      <Chip
                        label={module.impact.toUpperCase()}
                        size="small"
                        sx={{
                          backgroundColor: getImpactColor(module.impact),
                          color: '#ffffff',
                          fontSize: '0.6rem'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {module.description}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={module.enabled}
                        onChange={() => handleModuleToggle(module.id)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#fdcb6e',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: '#fdcb6e',
                          },
                        }}
                      />
                    }
                    label=""
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #fdcb6e',
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#fdcb6e', mb: 3 }}>
            System Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Platform Details
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Platform Version"
                    secondary="v2.1.0"
                    primaryTypographyProps={{ sx: { color: '#ffffff' } }}
                    secondaryTypographyProps={{ sx: { color: '#b0b0b0' } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Last Backup"
                    secondary={systemStats.lastBackup}
                    primaryTypographyProps={{ sx: { color: '#ffffff' } }}
                    secondaryTypographyProps={{ sx: { color: '#b0b0b0' } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Environment"
                    secondary="Production"
                    primaryTypographyProps={{ sx: { color: '#ffffff' } }}
                    secondaryTypographyProps={{ sx: { color: '#b0b0b0' } }}
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Module Status Summary
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label={`${modules.filter(m => m.enabled).length} Enabled`}
                  sx={{ backgroundColor: '#2ed573', color: '#ffffff' }}
                />
                <Chip
                  label={`${modules.filter(m => !m.enabled).length} Disabled`}
                  sx={{ backgroundColor: '#b0b0b0', color: '#ffffff' }}
                />
                <Chip
                  label={`${coreModules.filter(m => m.enabled).length}/${coreModules.length} Core`}
                  sx={{ backgroundColor: '#2ed573', color: '#ffffff' }}
                />
                <Chip
                  label={`${featureModules.filter(m => m.enabled).length}/${featureModules.length} Features`}
                  sx={{ backgroundColor: '#0984e3', color: '#ffffff' }}
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AdminPanel;

