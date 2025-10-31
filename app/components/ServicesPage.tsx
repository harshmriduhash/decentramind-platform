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
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Code as CodeIcon,
  Support as SupportIcon,
  AutoAwesome as AutoAwesomeIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  Assessment as AssessmentIcon,
  Build as BuildIcon,
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
      id={`services-tabpanel-${index}`}
      aria-labelledby={`services-tab-${index}`}
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

const ServicesPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const services = [
    {
      id: 1,
      title: 'AI Automation Services',
      description: 'Automate your workflows with intelligent AI agents',
      icon: <AutoAwesomeIcon sx={{ color: '#2ed573' }} />,
      features: [
        'Custom AI agent development',
        'Workflow automation',
        'Process optimization',
        'Integration with existing systems',
        '24/7 monitoring and maintenance'
      ],
      pricing: 'Starting at $500/month',
      popular: true,
    },
    {
      id: 2,
      title: 'Smart Contract Development',
      description: 'Secure and efficient blockchain solutions',
      icon: <CodeIcon sx={{ color: '#0984e3' }} />,
      features: [
        'Custom smart contract development',
        'Security auditing',
        'Gas optimization',
        'Deployment and testing',
        'Ongoing maintenance'
      ],
      pricing: 'Starting at $1,000/project',
      popular: false,
    },
    {
      id: 3,
      title: 'Technical Support',
      description: 'Expert assistance for your DecentraMind journey',
      icon: <SupportIcon sx={{ color: '#e84393' }} />,
      features: [
        '24/7 technical support',
        'Platform troubleshooting',
        'Integration assistance',
        'Best practices guidance',
        'Priority response times'
      ],
      pricing: 'Starting at $200/month',
      popular: false,
    },
  ];

  const automationFeatures = [
    {
      title: 'Workflow Design',
      description: 'Visual workflow builder with drag-and-drop interface',
      icon: <BuildIcon sx={{ color: '#2ed573' }} />,
    },
    {
      title: 'AI Integration',
      description: 'Seamless integration with our AI agent ecosystem',
      icon: <AutoAwesomeIcon sx={{ color: '#0984e3' }} />,
    },
    {
      title: 'Performance Monitoring',
      description: 'Real-time monitoring and performance analytics',
      icon: <AssessmentIcon sx={{ color: '#e84393' }} />,
    },
    {
      title: 'Scalability',
      description: 'Auto-scaling infrastructure for growing needs',
      icon: <TrendingUpIcon sx={{ color: '#fdcb6e' }} />,
    },
  ];

  const contractServices = [
    {
      title: 'Token Contracts',
      description: 'ERC-20, SPL, and custom token implementations',
    },
    {
      title: 'DeFi Protocols',
      description: 'DEX, lending, and yield farming contracts',
    },
    {
      title: 'NFT Contracts',
      description: 'ERC-721, ERC-1155, and marketplace contracts',
    },
    {
      title: 'DAO Contracts',
      description: 'Governance and voting mechanism contracts',
    },
  ];

  const supportTiers = [
    {
      name: 'Basic Support',
      price: '$200/month',
      features: [
        'Email support (24-48h response)',
        'Documentation access',
        'Community forum access',
        'Basic troubleshooting',
      ],
    },
    {
      name: 'Professional Support',
      price: '$500/month',
      features: [
        'Priority email support (12-24h response)',
        'Live chat support',
        'Phone support during business hours',
        'Advanced troubleshooting',
        'Integration assistance',
      ],
      popular: true,
    },
    {
      name: 'Enterprise Support',
      price: 'Custom pricing',
      features: [
        '24/7 dedicated support',
        'Dedicated account manager',
        'Custom SLA agreements',
        'On-site support available',
        'Priority feature requests',
      ],
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
          <SettingsIcon sx={{ fontSize: 40 }} />
          Professional Services
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Accelerate your success with our expert services and support
        </Typography>
      </Box>

      {/* Services Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {services.map((service) => (
          <Grid item xs={12} md={4} key={service.id}>
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: service.popular ? '2px solid #2ed573' : '2px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              height: '100%',
              position: 'relative',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease'
              }
            }}>
              {service.popular && (
                <Chip
                  label="Most Popular"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    backgroundColor: '#2ed573',
                    color: '#000000',
                    fontWeight: 'bold'
                  }}
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {service.icon}
                  <Typography variant="h6" sx={{ color: '#ffffff', ml: 1 }}>
                    {service.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
                  {service.description}
                </Typography>
                <List dense>
                  {service.features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon sx={{ color: '#2ed573', fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{ 
                          variant: 'body2', 
                          sx: { color: '#ffffff' } 
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                    {service.pricing}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: service.popular ? '#2ed573' : '#0984e3',
                      color: '#ffffff',
                      '&:hover': { 
                        backgroundColor: service.popular ? '#26c965' : '#0770c4' 
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Services */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff',
        borderRadius: 2
      }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{ 
              '& .MuiTab-root': { color: '#b0b0b0' },
              '& .Mui-selected': { color: '#00ffff' },
              '& .MuiTabs-indicator': { backgroundColor: '#00ffff' }
            }}
          >
            <Tab label="Automation" icon={<AutoAwesomeIcon />} iconPosition="start" />
            <Tab label="Smart Contracts" icon={<CodeIcon />} iconPosition="start" />
            <Tab label="Support Plans" icon={<SupportIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Automation Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
            AI Automation Services
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                What We Offer
              </Typography>
              <List>
                {automationFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {feature.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature.title}
                      secondary={feature.description}
                      primaryTypographyProps={{ sx: { color: '#ffffff' } }}
                      secondaryTypographyProps={{ sx: { color: '#b0b0b0' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Process
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  1. Consultation & Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  We analyze your current workflows and identify automation opportunities.
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  2. Design & Development
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Custom AI agents and workflows are designed and developed for your needs.
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  3. Testing & Deployment
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Thorough testing ensures reliability before deployment to production.
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  4. Monitoring & Optimization
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Continuous monitoring and optimization for peak performance.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Smart Contracts Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
            Smart Contract Development
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Contract Types
              </Typography>
              <List>
                {contractServices.map((service, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#2ed573' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={service.title}
                      secondary={service.description}
                      primaryTypographyProps={{ sx: { color: '#ffffff' } }}
                      secondaryTypographyProps={{ sx: { color: '#b0b0b0' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Security & Quality
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  Security Auditing
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Comprehensive security audits by certified blockchain security experts.
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  Gas Optimization
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Optimized code for minimal gas consumption and maximum efficiency.
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  Testing & Deployment
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Thorough testing on testnets before mainnet deployment.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Support Plans Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
            Support Plans
          </Typography>
          <Grid container spacing={3}>
            {supportTiers.map((tier, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: tier.popular ? '2px solid #2ed573' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  height: '100%',
                  position: 'relative'
                }}>
                  {tier.popular && (
                    <Chip
                      label="Recommended"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: '#2ed573',
                        color: '#000000',
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                      {tier.name}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#00ffff', mb: 3 }}>
                      {tier.price}
                    </Typography>
                    <List dense>
                      {tier.features.map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon sx={{ color: '#2ed573', fontSize: 16 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            primaryTypographyProps={{ 
                              variant: 'body2', 
                              sx: { color: '#ffffff' } 
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: tier.popular ? '#2ed573' : '#0984e3',
                          color: '#ffffff',
                          '&:hover': { 
                            backgroundColor: tier.popular ? '#26c965' : '#0770c4' 
                          }
                        }}
                      >
                        Choose Plan
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Card>
    </Container>
  );
};

export default ServicesPage;

