"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import {
  Code as CodeIcon,
  SmartToy as AIIcon,
  AccountBalanceWallet as BlockchainIcon,
  Security as SecurityIcon,
  Architecture as ArchitectureIcon,
  Speed as SpeedIcon,
  Mail as MailIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  price: string;
  category: string;
}

const ProfessionalServices: React.FC = () => {
  const [openContact, setOpenContact] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  const services: ServiceCardProps[] = [
    {
      title: "AI Integration Consulting",
      description: "Expert guidance on integrating AI into your existing systems and workflows",
      icon: <AIIcon sx={{ fontSize: 40, color: '#00ffff' }} />,
      features: [
        "AI Architecture Design",
        "Model Selection & Training",
        "Integration Strategy",
        "Performance Optimization",
        "Scalability Planning"
      ],
      price: "Custom Quote",
      category: "AI"
    },
    {
      title: "Code Audit & Review",
      description: "Comprehensive code analysis and quality assurance for your projects",
      icon: <CodeIcon sx={{ fontSize: 40, color: '#4ecdc4' }} />,
      features: [
        "Security Assessment",
        "Performance Analysis",
        "Best Practices Review",
        "Architecture Evaluation",
        "Documentation Review"
      ],
      price: "From 2 ETH",
      category: "Development"
    },
    {
      title: "Smart Contract Development",
      description: "Professional Web3 contract development and auditing services",
      icon: <BlockchainIcon sx={{ fontSize: 40, color: '#ffd700' }} />,
      features: [
        "Contract Development",
        "Security Auditing",
        "Gas Optimization",
        "Testing & Deployment",
        "Documentation"
      ],
      price: "From 3 ETH",
      category: "Web3"
    },
    {
      title: "Security Consulting",
      description: "Expert security assessment and hardening for your blockchain projects",
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />,
      features: [
        "Vulnerability Assessment",
        "Penetration Testing",
        "Security Architecture",
        "Incident Response",
        "Compliance Review"
      ],
      price: "Custom Quote",
      category: "Security"
    }
  ];

  const handleContactOpen = (service: string) => {
    setSelectedService(service);
    setOpenContact(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
          Professional Services
        </Typography>
        <Typography variant="h6" sx={{ color: '#fff', mb: 4 }}>
          Expert consulting for AI, blockchain, and development projects
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {services.map((service) => (
          <Grid item xs={12} md={6} key={service.title}>
            <Card sx={{
              height: '100%',
              background: 'rgba(25, 25, 25, 0.9)',
              border: '2px solid #00ffff',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {service.icon}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {service.title}
                    </Typography>
                    <Chip 
                      label={service.category}
                      size="small"
                      sx={{ 
                        mt: 1,
                        bgcolor: 'rgba(0, 255, 255, 0.1)',
                        color: '#00ffff',
                        border: '1px solid #00ffff'
                      }}
                    />
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ color: '#fff', mb: 2 }}>
                  {service.description}
                </Typography>

                <List>
                  {service.features.map((feature) => (
                    <ListItem key={feature} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon sx={{ color: '#00ffff' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        sx={{ '& .MuiListItemText-primary': { color: '#b0b0b0' } }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2, borderColor: 'rgba(0, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ color: '#00ffff' }}>
                    {service.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowIcon />}
                    onClick={() => handleContactOpen(service.title)}
                    sx={{
                      color: '#00ffff',
                      borderColor: '#00ffff',
                      '&:hover': {
                        borderColor: '#00ffff',
                        bgcolor: 'rgba(0, 255, 255, 0.1)'
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

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Alert 
          severity="info"
          sx={{ 
            maxWidth: 600, 
            mx: 'auto',
            bgcolor: 'rgba(0, 255, 255, 0.1)',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#00ffff' }
          }}
        >
          <Typography variant="body1">
            Need a custom solution? Contact us for a personalized consultation.
          </Typography>
        </Alert>
      </Box>

      <Dialog 
        open={openContact} 
        onClose={() => setOpenContact(false)}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            border: '2px solid #00ffff',
            borderRadius: 2,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ color: '#00ffff' }}>
          Request Consultation
          {selectedService && ` - ${selectedService}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: '#b0b0b0' } }}
              InputProps={{ sx: { color: '#fff' } }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              sx={{ mb: 2 }}
              InputLabelProps={{ sx: { color: '#b0b0b0' } }}
              InputProps={{ sx: { color: '#fff' } }}
            />
            <TextField
              fullWidth
              label="Project Description"
              variant="outlined"
              multiline
              rows={4}
              InputLabelProps={{ sx: { color: '#b0b0b0' } }}
              InputProps={{ sx: { color: '#fff' } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setOpenContact(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenContact(false)}
            sx={{
              bgcolor: '#00ffff',
              color: '#000',
              '&:hover': {
                bgcolor: 'rgba(0, 255, 255, 0.8)'
              }
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfessionalServices; 