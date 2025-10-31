"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Button,
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
} from '@mui/material';
import {
  Park as EcoIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  LocalShipping as TransportIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingIcon,
  Flight as TravelIcon,
  AccountBalance as FinanceIcon,
  SportsEsports as LeisureIcon,
  Restaurant as FoodIcon,
  Lightbulb as EnergyIcon,
  DirectionsCar as CarIcon,
  Train as TrainIcon,
  DirectionsBus as BusIcon,
  DirectionsBike as BikeIcon,
  DirectionsWalk as WalkIcon,
} from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CO2TrackingTab: React.FC = () => {
  const [showAddActivityDialog, setShowAddActivityDialog] = useState(false);
  const [newActivity, setNewActivity] = useState({
    category: '',
    amount: '',
    description: '',
  });

  // PCAF-based CO2 data
  const userFootprint = 2365.4;
  const postFinanceAvg = 1944.7;
  const swiss2030Target = 715.1;
  const reductionNeeded = userFootprint - swiss2030Target;

  const categoryBreakdown = [
    { name: 'Shopping', value: 1349.4, percentage: 57, icon: <ShoppingIcon />, color: '#ff6b6b' },
    { name: 'Residing', value: 320.0, percentage: 14, icon: <HomeIcon />, color: '#2ed573' },
    { name: 'Leisure', value: 273.5, percentage: 12, icon: <LeisureIcon />, color: '#9c27b0' },
    { name: 'Mobility', value: 195.9, percentage: 8, icon: <TransportIcon />, color: '#ffc107' },
    { name: 'Living', value: 158.5, percentage: 7, icon: <EnergyIcon />, color: '#00d4ff' },
    { name: 'Finances', value: 68.1, percentage: 3, icon: <FinanceIcon />, color: '#6b7280' },
  ];

  const suggestions = [
    {
      category: 'Shopping',
      suggestions: [
        'Buy local and seasonal products',
        'Choose products with minimal packaging',
        'Support sustainable brands',
        'Reduce online shopping frequency',
      ],
      potentialReduction: 200,
    },
    {
      category: 'Mobility',
      suggestions: [
        'Use public transportation more often',
        'Consider carpooling or ridesharing',
        'Walk or bike for short distances',
        'Plan trips to reduce unnecessary travel',
      ],
      potentialReduction: 150,
    },
    {
      category: 'Energy',
      suggestions: [
        'Switch to renewable energy sources',
        'Improve home insulation',
        'Use energy-efficient appliances',
        'Turn off lights and electronics when not in use',
      ],
      potentialReduction: 100,
    },
  ];

  const recentActivities = [
    { date: '2024-02-15', category: 'Shopping', activity: 'Online purchase', co2: 45.2 },
    { date: '2024-02-14', category: 'Mobility', activity: 'Car trip to work', co2: 12.8 },
    { date: '2024-02-13', category: 'Energy', activity: 'Home heating', co2: 8.5 },
    { date: '2024-02-12', category: 'Leisure', activity: 'Streaming service', co2: 3.2 },
  ];

  const chartData = {
    labels: categoryBreakdown.map(cat => cat.name),
    datasets: [
      {
        label: 'CO2 Footprint (kg)',
        data: categoryBreakdown.map(cat => cat.value),
        backgroundColor: categoryBreakdown.map(cat => cat.color),
        borderColor: categoryBreakdown.map(cat => cat.color),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#ffffff',
        },
      },
      title: {
        display: true,
        text: 'CO2 Footprint by Category',
        color: '#ffffff',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const getProgressColor = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio <= 1) return '#2ed573';
    if (ratio <= 1.5) return '#ffc107';
    return '#ff6b6b';
  };

  const handleAddActivity = () => {
    // Handle adding new activity
    console.log('Adding activity:', newActivity);
    setShowAddActivityDialog(false);
    setNewActivity({ category: '', amount: '', description: '' });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00d4ff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00d4ff' }}>
        🌱 CO2 Tracking & Sustainability
      </Typography>
      <Typography variant="h6" sx={{ color: '#ffffff', mb: 4, fontWeight: 500 }}>
        Monitor your carbon footprint and work towards a sustainable future
      </Typography>

      {/* Main Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(26, 42, 68, 0.9)', border: '2px solid #00d4ff', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <EcoIcon sx={{ color: '#00d4ff', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#00d4ff', fontWeight: 'bold' }}>
                  {userFootprint.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Your CO2 Footprint (kg CO2e)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(userFootprint / 3000) * 100}
                sx={{
                  mt: 1,
                  height: 6,
                  borderRadius: 3,
                  background: '#1a2a44',
                  '& .MuiLinearProgress-bar': {
                    background: getProgressColor(userFootprint, 2000),
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(26, 42, 68, 0.9)', border: '2px solid #2ed573', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingDownIcon sx={{ color: '#2ed573', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                  {reductionNeeded.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Reduction Needed (kg CO2e)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(26, 42, 68, 0.9)', border: '2px solid #ffc107', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <InfoIcon sx={{ color: '#ffc107', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                  {postFinanceAvg.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                PostFinance Average (kg CO2e)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(26, 42, 68, 0.9)', border: '2px solid #9c27b0', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <CheckCircleIcon sx={{ color: '#9c27b0', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#9c27b0', fontWeight: 'bold' }}>
                  {swiss2030Target.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Swiss 2030 Target (kg CO2e)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart and Category Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ background: 'rgba(26, 42, 68, 0.9)', border: '2px solid #00d4ff', borderRadius: 3, p: 2 }}>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
              CO2 Footprint Breakdown
            </Typography>
            <Box sx={{ height: 400 }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ background: 'rgba(26, 42, 68, 0.9)', border: '2px solid #2ed573', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                Category Breakdown
              </Typography>
              <List>
                {categoryBreakdown.map((category, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ color: category.color }}>
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: '#ffffff' }}>
                            {category.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: category.color, fontWeight: 'bold' }}>
                            {category.value} kg
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <LinearProgress
                          variant="determinate"
                          value={category.percentage}
                          sx={{
                            mt: 1,
                            height: 4,
                            borderRadius: 2,
                            background: '#1a2a44',
                            '& .MuiLinearProgress-bar': {
                              background: category.color,
                            },
                          }}
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Suggestions and Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ background: 'rgba(26, 42, 68, 0.9)', border: '2px solid #ffc107', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                💡 Sustainability Suggestions
              </Typography>
              {suggestions.map((suggestion, index) => (
                <Accordion key={index} sx={{ background: 'transparent', color: '#ffffff', mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#ffc107' }} />}>
                    <Typography sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                      {suggestion.category} - Potential: {suggestion.potentialReduction} kg CO2e reduction
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {suggestion.suggestions.map((item, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ color: '#2ed573', minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={item} sx={{ color: '#ffffff' }} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{ background: 'rgba(26, 42, 68, 0.9)', border: '2px solid #9c27b0', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
                🎯 Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={() => setShowAddActivityDialog(true)}
                    sx={{
                      background: '#9c27b0',
                      color: 'white',
                      '&:hover': { background: '#7b1fa2' },
                    }}
                  >
                    Add Activity
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EcoIcon />}
                    sx={{
                      borderColor: '#2ed573',
                      color: '#2ed573',
                      '&:hover': { borderColor: '#2ed573', background: 'rgba(46, 213, 115, 0.1)' },
                    }}
                  >
                    Set Goals
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<TrendingDownIcon />}
                    sx={{
                      borderColor: '#00d4ff',
                      color: '#00d4ff',
                      '&:hover': { borderColor: '#00d4ff', background: 'rgba(0, 212, 255, 0.1)' },
                    }}
                  >
                    Track Progress
                  </Button>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
              
              <Typography variant="body2" sx={{ color: '#ffffff', mb: 1 }}>
                💰 Rewards for Reductions:
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ color: '#2ed573', minWidth: 30 }}>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="0.1-0.5 DMT per kg CO2e reduction" 
                    sx={{ color: '#ffffff' }} 
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ color: '#ffc107', minWidth: 30 }}>
                    <CheckCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Bonus rewards for sustainable choices" 
                    sx={{ color: '#ffffff' }} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities Table */}
      <Card sx={{ background: 'rgba(26, 42, 68, 0.9)', border: '2px solid #6b7280', borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
            📊 Recent Activities
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Activity</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>CO2 (kg)</TableCell>
                  <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentActivities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: '#ffffff' }}>{activity.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={activity.category}
                        size="small"
                        sx={{
                          background: categoryBreakdown.find(cat => cat.name === activity.category)?.color || '#6b7280',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#ffffff' }}>{activity.activity}</TableCell>
                    <TableCell sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                      {activity.co2} kg
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Tracked"
                        size="small"
                        sx={{
                          background: '#2ed573',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Activity Dialog */}
      <Dialog open={showAddActivityDialog} onClose={() => setShowAddActivityDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00d4ff', fontWeight: 'bold' }}>
          Add New Activity
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category"
            value={newActivity.category}
            onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
            select
          >
            {categoryBreakdown.map((category) => (
              <MenuItem key={category.name} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="CO2 Amount (kg)"
            type="number"
            value={newActivity.amount}
            onChange={(e) => setNewActivity({ ...newActivity, amount: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={newActivity.description}
            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddActivityDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleAddActivity} sx={{ color: '#00d4ff' }}>
            Add Activity
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CO2TrackingTab; 