"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Container,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  ViewInAr as MetaverseIcon,
  Public as WorldIcon,
  Groups as CommunityIcon,
  Architecture as BuildIcon,
  Gamepad as GameIcon,
  Headset as VRIcon,
  Store as MarketIcon,
  Psychology as AgentIcon,
  VideogameAsset as GameAssetIcon,
  AccountBalance as EnvironmentIcon,
  Rocket as LaunchIcon,
  Schedule as ComingSoonIcon,
  NotificationsActive as NotifyIcon,
} from '@mui/icons-material';
import { useToast } from './ToastNotifications';

const MetaverseHub: React.FC = () => {
  const { showSuccess, showInfo } = useToast();
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [email, setEmail] = useState('');

  const upcomingFeatures = [
    {
      icon: <WorldIcon sx={{ color: '#00ffff' }} />,
      title: 'Virtual Worlds',
      description: 'Explore immersive 3D environments where your AI agents can interact',
      timeline: 'Q2 2024',
      status: 'In Development',
      color: '#00ffff'
    },
    {
      icon: <CommunityIcon sx={{ color: '#2ed573' }} />,
      title: 'Social Spaces',
      description: 'Meet other users and collaborate in virtual meeting rooms',
      timeline: 'Q3 2024',
      status: 'Planned',
      color: '#2ed573'
    },
    {
      icon: <BuildIcon sx={{ color: '#fdcb6e' }} />,
      title: 'World Builder',
      description: 'Create and customize your own virtual environments',
      timeline: 'Q3 2024',
      status: 'Planned',
      color: '#fdcb6e'
    },
    {
      icon: <AgentIcon sx={{ color: '#ff3860' }} />,
      title: 'Agent Avatars',
      description: 'See your AI agents as 3D avatars in the metaverse',
      timeline: 'Q2 2024',
      status: 'In Development',
      color: '#ff3860'
    },
    {
      icon: <MarketIcon sx={{ color: '#9b59b6' }} />,
      title: 'Virtual Marketplace',
      description: 'Trade agents and assets in immersive 3D market spaces',
      timeline: 'Q4 2024',
      status: 'Research',
      color: '#9b59b6'
    },
    {
      icon: <VRIcon sx={{ color: '#e67e22' }} />,
      title: 'VR Support',
      description: 'Full virtual reality experience with VR headset support',
      timeline: 'Q4 2024',
      status: 'Research',
      color: '#e67e22'
    }
  ];

  const metaverseStats = [
    { label: 'Planned Worlds', value: '12+', color: '#00ffff' },
    { label: 'Beta Testers', value: '500+', color: '#2ed573' },
    { label: 'Features Planned', value: '25+', color: '#fdcb6e' },
    { label: 'Launch Timeline', value: 'Q2 2024', color: '#ff3860' },
  ];

  const handleNotifyMe = () => {
    if (!email.trim()) {
      showInfo('Please enter your email address');
      return;
    }
    
    showSuccess('You\'ll be notified when the Metaverse launches!');
    setShowNotifyDialog(false);
    setEmail('');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <MetaverseIcon sx={{ fontSize: 60, color: '#00ffff', mr: 2 }} />
            <Typography 
              variant="h3" 
              sx={{ 
                color: '#00ffff', 
                fontWeight: 'bold',
                textShadow: '0 0 10px #00ffff'
              }}
            >
              🌐 Metaverse Hub
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
            The future of AI agent interaction in virtual reality
          </Typography>
          
          <Chip 
            icon={<ComingSoonIcon />}
            label="COMING SOON" 
            sx={{ 
              background: 'linear-gradient(45deg, #ff6b6b, #ffa726)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              px: 3,
              py: 1,
              animation: 'pulse 2s infinite'
            }}
          />
        </Box>

        {/* Coming Soon Alert */}
        <Alert 
          severity="info" 
          sx={{ 
            mb: 4,
            background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.05))',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            color: '#00ffff'
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            🚀 The DecentraMind Metaverse is under development!
          </Typography>
          <Typography>
            We're building an immersive 3D environment where you can interact with your AI agents, 
            collaborate with other users, and explore virtual worlds. Beta testing begins Q2 2024.
          </Typography>
        </Alert>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {metaverseStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)`,
                border: `1px solid ${stat.color}`,
                borderRadius: 2
              }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ color: stat.color, fontWeight: 'bold', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Upcoming Features */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #00ffff',
          borderRadius: 2,
          mb: 4
        }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
              🛠️ Upcoming Features
            </Typography>
            
            <Grid container spacing={3}>
              {upcomingFeatures.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper 
                    sx={{ 
                      p: 3,
                      background: `linear-gradient(135deg, ${feature.color}15 0%, ${feature.color}05 100%)`,
                      border: `1px solid ${feature.color}30`,
                      borderRadius: 2,
                      height: '100%'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ mr: 2 }}>
                        {feature.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ color: feature.color, fontWeight: 'bold', mb: 1 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          {feature.description}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip 
                            label={feature.status}
                            size="small"
                            sx={{ 
                              background: `${feature.color}30`,
                              color: feature.color,
                              fontSize: '0.7rem'
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {feature.timeline}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Metaverse Preview */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          border: '1px solid #9b59b6',
          borderRadius: 2,
          mb: 4
        }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: '#9b59b6', fontWeight: 'bold', mb: 3 }}>
              🎬 What to Expect
            </Typography>
            
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <WorldIcon sx={{ color: '#00ffff' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Immersive 3D Environments"
                      secondary="Navigate beautiful virtual worlds designed for productivity and collaboration"
                      sx={{ '& .MuiListItemText-primary': { color: 'white' } }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <AgentIcon sx={{ color: '#2ed573' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="AI Agent Avatars"
                      secondary="See your AI agents as interactive 3D characters that respond to voice and gestures"
                      sx={{ '& .MuiListItemText-primary': { color: 'white' } }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <CommunityIcon sx={{ color: '#fdcb6e' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Social Collaboration"
                      secondary="Meet other users, share agents, and work together in virtual spaces"
                      sx={{ '& .MuiListItemText-primary': { color: 'white' } }}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <VRIcon sx={{ color: '#ff3860' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="VR & AR Support"
                      secondary="Full compatibility with VR headsets and AR devices for ultimate immersion"
                      sx={{ '& .MuiListItemText-primary': { color: 'white' } }}
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.2), rgba(0, 255, 255, 0.1))',
                    border: '2px dashed rgba(155, 89, 182, 0.5)',
                    borderRadius: 3,
                    p: 4,
                    textAlign: 'center',
                    minHeight: 200,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  <MetaverseIcon sx={{ fontSize: 80, color: '#9b59b6', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#9b59b6', mb: 1 }}>
                    3D Preview
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Interactive metaverse demo coming soon
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<NotifyIcon />}
            onClick={() => setShowNotifyDialog(true)}
            sx={{ 
              background: 'linear-gradient(45deg, #00ffff, #0080ff)',
              mr: 2,
              mb: 2,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { 
                background: 'linear-gradient(45deg, #0080ff, #00ffff)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(0, 255, 255, 0.3)'
              }
            }}
          >
            Notify Me When Ready
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<LaunchIcon />}
            href="https://discord.gg/decentramind"
            target="_blank"
            sx={{ 
              borderColor: '#9b59b6',
              color: '#9b59b6',
              mb: 2,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { 
                borderColor: '#9b59b6',
                background: 'rgba(155, 89, 182, 0.1)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Join Beta Program
          </Button>
        </Box>

        {/* Notification Dialog */}
        <Dialog open={showNotifyDialog} onClose={() => setShowNotifyDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ background: '#1a1a2e', color: '#00ffff' }}>
            🔔 Get Notified About Metaverse Launch
          </DialogTitle>
          <DialogContent sx={{ background: '#1a1a2e', color: 'white' }}>
            <Typography sx={{ mb: 3 }}>
              Be the first to know when the DecentraMind Metaverse goes live! 
              We'll send you exclusive early access invitations and beta testing opportunities.
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              sx={{ mb: 2 }}
            />
            <Alert severity="info" sx={{ 
              background: 'rgba(0, 255, 255, 0.1)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              color: '#00ffff'
            }}>
              We'll only contact you about metaverse updates. No spam, ever.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ background: '#1a1a2e' }}>
            <Button onClick={() => setShowNotifyDialog(false)} sx={{ color: 'white' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleNotifyMe}
              variant="contained"
              sx={{ 
                background: 'linear-gradient(45deg, #00ffff, #0080ff)',
                '&:hover': { background: 'linear-gradient(45deg, #0080ff, #00ffff)' }
              }}
            >
              Notify Me
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* CSS Animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Container>
  );
};

export default MetaverseHub; 