"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Badge,
  Divider,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Star as StarIcon,
  Timer as TimerIcon,
  AccountBalance as AccountBalanceIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  AutoAwesome as AutoAwesomeIcon,
  Campaign as CampaignIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const IDOComponent: React.FC = () => {
  const [showParticipateDialog, setShowParticipateDialog] = useState(false);
  const [participationAmount, setParticipationAmount] = useState('');
  const [selectedIDO, setSelectedIDO] = useState<any>(null);

  const idoProjects = [
    {
      id: 1,
      name: 'DecentraMind AI',
      symbol: 'DMT',
      description: 'The native token of the DecentraMind AI ecosystem',
      status: 'Active',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      targetAmount: 1000000,
      raisedAmount: 750000,
      tokenPrice: 0.1,
      minInvestment: 100,
      maxInvestment: 10000,
      participants: 1250,
      category: 'AI/ML',
      vestingPeriod: 12,
      apy: 15,
    },
    {
      id: 2,
      name: 'Neural Protocol',
      symbol: 'NEURAL',
      description: 'Decentralized neural network training protocol',
      status: 'Upcoming',
      startDate: '2024-02-20',
      endDate: '2024-03-05',
      targetAmount: 500000,
      raisedAmount: 0,
      tokenPrice: 0.05,
      minInvestment: 50,
      maxInvestment: 5000,
      participants: 0,
      category: 'DeFi',
      vestingPeriod: 6,
      apy: 12,
    },
    {
      id: 3,
      name: 'CryptoMind Analytics',
      symbol: 'CMA',
      description: 'AI-powered crypto analytics platform',
      status: 'Completed',
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      targetAmount: 750000,
      raisedAmount: 750000,
      tokenPrice: 0.08,
      minInvestment: 200,
      maxInvestment: 15000,
      participants: 2000,
      category: 'Analytics',
      vestingPeriod: 18,
      apy: 18,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#2ed573';
      case 'Upcoming':
        return '#fdcb6e';
      case 'Completed':
        return '#00ffff';
      case 'Cancelled':
        return '#ff3860';
      default:
        return '#666';
    }
  };

  const getProgressPercentage = (raised: number, target: number) => {
    return target > 0 ? (raised / target) * 100 : 0;
  };

  const handleParticipate = () => {
    // Handle participation logic
    console.log('Participating in IDO:', { ido: selectedIDO, amount: participationAmount });
    setShowParticipateDialog(false);
    setParticipationAmount('');
    setSelectedIDO(null);
  };

  const openParticipateDialog = (ido: any) => {
    setSelectedIDO(ido);
    setShowParticipateDialog(true);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
        🚀 IDO/ICO Launchpad
      </Typography>
      <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 500 }}>
        Participate in token offerings and fundraising events
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrophyIcon sx={{ color: '#00ffff', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                  {idoProjects.length}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon sx={{ color: '#2ed573', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                  ${idoProjects.reduce((sum, project) => sum + project.raisedAmount, 0).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Raised
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <GroupIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                  {idoProjects.reduce((sum, project) => sum + project.participants, 0).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Participants
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff3860', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <MoneyIcon sx={{ color: '#ff3860', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#ff3860', fontWeight: 'bold' }}>
                  {idoProjects.filter(p => p.status === 'Active').length}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Active IDOs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* IDO Projects */}
      <Grid container spacing={3}>
        {idoProjects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card
              sx={{
                background: 'rgba(25, 25, 25, 0.9)',
                border: `2px solid ${getStatusColor(project.status)}`,
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 25px ${getStatusColor(project.status)}40`,
                },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {project.name}
                  </Typography>
                  <Chip
                    label={project.status}
                    size="small"
                    sx={{
                      background: getStatusColor(project.status),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {project.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                    Progress: ${project.raisedAmount.toLocaleString()} / ${project.targetAmount.toLocaleString()}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={getProgressPercentage(project.raisedAmount, project.targetAmount)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      background: '#333',
                      '& .MuiLinearProgress-bar': {
                        background: getStatusColor(project.status),
                      },
                    }}
                  />
                </Box>

                <Grid container spacing={1} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Token Price:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      ${project.tokenPrice}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Category:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {project.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Min Investment:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      ${project.minInvestment}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Participants:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {project.participants.toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Box display="flex" gap={1}>
                  {project.status === 'Active' && (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => openParticipateDialog(project)}
                      sx={{
                        background: getStatusColor(project.status),
                        color: 'white',
                        fontWeight: 'bold',
                        '&:hover': {
                          background: '#00cccc',
                        },
                      }}
                    >
                      Participate
                    </Button>
                  )}
                  {project.status === 'Upcoming' && (
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled
                      sx={{
                        borderColor: getStatusColor(project.status),
                        color: getStatusColor(project.status),
                      }}
                    >
                      Coming Soon
                    </Button>
                  )}
                  {project.status === 'Completed' && (
                    <Button
                      variant="outlined"
                      fullWidth
                      disabled
                      sx={{
                        borderColor: getStatusColor(project.status),
                        color: getStatusColor(project.status),
                      }}
                    >
                      Completed
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Participation Dialog */}
      <Dialog open={showParticipateDialog} onClose={() => setShowParticipateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          Participate in {selectedIDO?.name} IDO
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Investment Amount (USD)"
            type="number"
            value={participationAmount}
            onChange={(e) => setParticipationAmount(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            inputProps={{ 
              min: selectedIDO?.minInvestment, 
              max: selectedIDO?.maxInvestment 
            }}
          />
          {selectedIDO && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                • Token Price: ${selectedIDO.tokenPrice}<br />
                • Min Investment: ${selectedIDO.minInvestment}<br />
                • Max Investment: ${selectedIDO.maxInvestment}<br />
                • Vesting Period: {selectedIDO.vestingPeriod} months<br />
                • Expected APY: {selectedIDO.apy}%
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowParticipateDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleParticipate} sx={{ color: '#00ffff' }}>
            Participate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IDOComponent; 