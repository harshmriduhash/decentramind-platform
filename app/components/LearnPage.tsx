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
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import {
  School as SchoolIcon,
  MenuBook as BookOpenIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

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
      id={`learn-tabpanel-${index}`}
      aria-labelledby={`learn-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const LearnPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tutorials = [
    {
      id: 1,
      title: 'Getting Started with DecentraMind',
      description: 'Learn the basics of our platform and how to create your first AI agent',
      duration: '15 min',
      difficulty: 'Beginner',
      completed: true,
      icon: <PlayIcon sx={{ color: '#2ed573' }} />,
    },
    {
      id: 2,
      title: 'AI Agent Creation & Management',
      description: 'Master the art of creating, customizing, and managing AI agents',
      duration: '25 min',
      difficulty: 'Intermediate',
      completed: true,
      icon: <CodeIcon sx={{ color: '#0984e3' }} />,
    },
    {
      id: 3,
      title: 'Blockchain Integration & Security',
      description: 'Understand how blockchain technology powers our platform',
      duration: '30 min',
      difficulty: 'Advanced',
      completed: false,
      icon: <SecurityIcon sx={{ color: '#ff6b6b' }} />,
    },
    {
      id: 4,
      title: 'DAO Governance Participation',
      description: 'Learn how to participate in decentralized governance',
      duration: '20 min',
      difficulty: 'Intermediate',
      completed: false,
      icon: <GroupIcon sx={{ color: '#e84393' }} />,
    },
  ];

  const resources = [
    {
      title: 'Documentation',
      description: 'Comprehensive technical documentation',
      icon: <BookOpenIcon sx={{ color: '#00ffff' }} />,
      link: '/docs',
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation and examples',
      icon: <CodeIcon sx={{ color: '#2ed573' }} />,
      link: '/api-docs',
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and developers',
      icon: <GroupIcon sx={{ color: '#0984e3' }} />,
      link: '/community/forum',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: <PlayIcon sx={{ color: '#e84393' }} />,
      link: '/tutorials',
    },
  ];

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
          <SchoolIcon sx={{ fontSize: 40 }} />
          Learn & Develop
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Master the DecentraMind platform with our comprehensive learning resources
        </Typography>
      </Box>

      {/* Learning Path */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #2ed573',
        borderRadius: 2,
        mb: 4
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#2ed573', mb: 3 }}>
            Learning Path
          </Typography>
          <Grid container spacing={3}>
            {tutorials.map((tutorial) => (
              <Grid item xs={12} md={6} key={tutorial.id}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  height: '100%'
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {tutorial.icon}
                      <Typography variant="h6" sx={{ color: '#ffffff', ml: 1, flex: 1 }}>
                        {tutorial.title}
                      </Typography>
                      {tutorial.completed && (
                        <CheckCircleIcon sx={{ color: '#2ed573' }} />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                      {tutorial.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={tutorial.difficulty}
                        size="small"
                        sx={{
                          backgroundColor: tutorial.difficulty === 'Beginner' ? '#2ed573' :
                                          tutorial.difficulty === 'Intermediate' ? '#fdcb6e' : '#ff6b6b',
                          color: '#ffffff',
                          fontSize: '0.7rem'
                        }}
                      />
                      <Chip
                        label={tutorial.duration}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(0, 255, 255, 0.1)',
                          color: '#00ffff',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: tutorial.completed ? '#2ed573' : '#0984e3',
                        color: '#ffffff',
                        '&:hover': { 
                          backgroundColor: tutorial.completed ? '#26c965' : '#0770c4' 
                        }
                      }}
                    >
                      {tutorial.completed ? 'Review' : 'Start'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #0984e3',
        borderRadius: 2,
        mb: 4
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#0984e3', mb: 3 }}>
            Learning Resources
          </Typography>
          <Grid container spacing={3}>
            {resources.map((resource, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {resource.icon}
                      <Typography variant="h6" sx={{ color: '#ffffff', ml: 1 }}>
                        {resource.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {resource.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Start Guide */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff',
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
            Quick Start Guide
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(0, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                    1
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                  Connect Wallet
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Connect your Solana wallet to access the platform
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(46, 213, 115, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                    2
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                  Create Agent
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Mint your first AI agent with custom capabilities
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(233, 67, 147, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Typography variant="h4" sx={{ color: '#e84393', fontWeight: 'bold' }}>
                    3
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                  Start Building
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Begin creating workflows and managing your agents
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LearnPage;

