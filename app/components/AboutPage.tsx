"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
} from '@mui/material';
import {
  Info as InfoIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
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
          <InfoIcon sx={{ fontSize: 40 }} />
          About DecentraMind Labs
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Pioneering the future of decentralized AI and blockchain technology
        </Typography>
      </Box>

      {/* Company Overview */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff',
        borderRadius: 2,
        mb: 4
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
            Company Overview
          </Typography>
          <Typography variant="body1" sx={{ color: '#ffffff', mb: 3, lineHeight: 1.8 }}>
            DecentraMind Labs is a cutting-edge technology company at the intersection of artificial intelligence, 
            blockchain technology, and decentralized governance. We are building the next generation of AI-powered 
            tools that operate on decentralized networks, ensuring transparency, security, and user sovereignty.
          </Typography>
          <Typography variant="body1" sx={{ color: '#ffffff', lineHeight: 1.8 }}>
            Our mission is to democratize access to advanced AI capabilities while maintaining the highest standards 
            of privacy, security, and decentralization. Through our innovative platform, users can create, manage, 
            and evolve AI agents that work seamlessly with blockchain technology.
          </Typography>
        </CardContent>
      </Card>

      {/* Key Features */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #2ed573',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CodeIcon sx={{ color: '#2ed573', mr: 1, fontSize: 30 }} />
                <Typography variant="h6" sx={{ color: '#2ed573' }}>
                  AI Innovation
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Advanced AI agents with autonomous capabilities, learning systems, and blockchain integration.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #0984e3',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ color: '#0984e3', mr: 1, fontSize: 30 }} />
                <Typography variant="h6" sx={{ color: '#0984e3' }}>
                  Blockchain Security
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Secure, transparent, and decentralized infrastructure powered by Solana blockchain.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #e84393',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon sx={{ color: '#e84393', mr: 1, fontSize: 30 }} />
                <Typography variant="h6" sx={{ color: '#e84393' }}>
                  Community Driven
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Decentralized governance and community-driven development with DAO participation.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Statistics */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #fdcb6e',
        borderRadius: 2,
        mb: 4
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#fdcb6e', mb: 3 }}>
            Platform Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  1,000+
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Active Users
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  50+
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  AI Agents Created
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  10,000+
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Transactions Processed
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                  99.9%
                </Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                  Uptime
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff',
        borderRadius: 2
      }}>
        <CardContent>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
            Technology Stack
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Frontend & UI
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {['Next.js 14', 'TypeScript', 'Material-UI', 'React'].map((tech) => (
                  <Box
                    key={tech}
                    sx={{
                      backgroundColor: 'rgba(0, 255, 255, 0.1)',
                      color: '#00ffff',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      border: '1px solid #00ffff'
                    }}
                  >
                    {tech}
                  </Box>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Blockchain & Backend
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {['Solana', 'Firebase', 'Web3', 'Smart Contracts'].map((tech) => (
                  <Box
                    key={tech}
                    sx={{
                      backgroundColor: 'rgba(46, 213, 115, 0.1)',
                      color: '#2ed573',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '0.8rem',
                      border: '1px solid #2ed573'
                    }}
                  >
                    {tech}
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AboutPage;

