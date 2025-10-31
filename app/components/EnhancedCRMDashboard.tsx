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
  Avatar,
  Badge,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Psychology as BrainIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Assignment as TaskIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  AutoAwesome as AutoAwesomeIcon,
  School as EducationIcon,
  FitnessCenter as HealthIcon,
  Brush as CreativeIcon,
  Code as TechIcon,
  Business as BusinessIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { useGlobalState } from '../store/globalState';
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

const EnhancedCRMDashboard: React.FC = () => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Use global state for tasks and agents
  const { tasks, addTask, agents } = useGlobalState();

  const handleCreateTask = () => {
    if (!newTaskName.trim()) {
      alert('Please enter a task name');
      return;
    }

    const newTask = {
      name: newTaskName,
      status: 'Pending',
      priority: newTaskPriority,
      dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
    };

    addTask(newTask);
    alert(`Task "${newTaskName}" created successfully!`);
    setShowCreateTask(false);
    setNewTaskName('');
    setNewTaskPriority('Medium');
    setNewTaskDueDate('');
  };

  const handleUpgradeAgent = () => {
    alert('Agent upgrade initiated! XP and level will be updated.');
  };

  const handleAccessMetaverse = () => {
    alert('Access Metaverse functionality activated!\n\nThis would open the metaverse interface with:\n- 3D environment navigation\n- Agent interactions\n- Virtual workspace\n- Collaborative features');
  };

  const quickActionHandlers = {
    'Create Task': handleCreateTask,
    'Upgrade Agent': handleUpgradeAgent,
    'Access Metaverse': handleAccessMetaverse,
  };

  // Define missing variables
  const kpis = [
    { label: 'Daily Life Score', value: '88', color: '#00ffff' },
    { label: 'Focus Time (min)', value: '120', color: '#2ed573' },
    { label: 'Current Streak (days)', value: '7', color: '#fdcb6e' },
    { label: 'Active Agents', value: '2', color: '#ff3860' },
    { label: 'Total XP', value: '425', color: '#a855f7' },
  ];

  const quickActions = [
    { label: 'Create Task', icon: <AddIcon />, color: '#2ed573' },
    { label: 'Upgrade Agent', icon: <AutoAwesomeIcon />, color: '#00ffff' },
    { label: 'Access Metaverse', icon: <DashboardIcon />, color: '#fdcb6e' },
  ];

  const dailyLifeData = {
    labels: ['Productivity', 'Learning', 'Health', 'Creative', 'Social'],
    datasets: [
      {
        label: 'Hours Spent',
        data: [6, 4, 2, 3, 2],
        backgroundColor: ['#00ffff', '#2ed573', '#fdcb6e', '#ff3860', '#a855f7'],
        borderColor: ['#00ffff', '#2ed573', '#fdcb6e', '#ff3860', '#a855f7'],
        borderWidth: 2,
      },
    ],
  };

  const dailyLifeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#fff',
        },
      },
    },
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
        🧠 DecentraMind Dashboard
            </Typography>
      <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 500 }}>
        ADHD-friendly AI Productivity & Wellness Ecosystem
          </Typography>
      <Grid container spacing={3}>
        {/* KPIs */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {kpis.map((kpi) => (
              <Grid item xs={6} md={2.4} key={kpi.label}>
                <Card sx={{
                  background: 'rgba(25,25,25,0.95)',
                  border: `2px solid ${kpi.color}`,
                  borderRadius: 3,
                  boxShadow: '0 0 12px 2px ' + kpi.color,
                  minHeight: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h4" sx={{ color: kpi.color, fontWeight: 'bold', mb: 1, fontSize: 32 }}>
                      {kpi.value}
          </Typography>
                    <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500, fontSize: 14 }}>
                      {kpi.label}
                  </Typography>
            </CardContent>
          </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{
            background: 'rgba(25,25,25,0.95)',
            border: '2px solid #2ed573',
            borderRadius: 3,
            boxShadow: '0 0 12px 2px #2ed573',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#2ed573', fontWeight: 'bold', mb: 2 }}>
                🎯 Quick Actions
                  </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outlined"
                    startIcon={action.icon}
                    sx={{ borderColor: action.color, color: action.color, fontWeight: 'bold', fontSize: 16 }}
                    onClick={quickActionHandlers[action.label as keyof typeof quickActionHandlers]}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* Daily Life Categories Bar Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: 'rgba(25,25,25,0.95)',
            border: '2px solid #00ffff',
            borderRadius: 3,
            boxShadow: '0 0 12px 2px #00ffff',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2 }}>
                📊 Daily Life Categories
                  </Typography>
              <Bar data={dailyLifeData} options={dailyLifeOptions} height={220} />
            </CardContent>
          </Card>
        </Grid>
        {/* Current Tasks */}
        <Grid item xs={12} md={6}>
          <Card sx={{
            background: 'rgba(25,25,25,0.95)',
            border: '2px solid #ff3860',
            borderRadius: 3,
            boxShadow: '0 0 12px 2px #ff3860',
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#ff3860', fontWeight: 'bold', mb: 2 }}>
                📝 Current Tasks
                  </Typography>
              <List>
                {tasks.map((task) => (
                  <ListItem key={task.name}>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: task.status === 'Completed' ? '#2ed573' : '#ff3860' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={task.name}
                      secondary={task.status}
                      primaryTypographyProps={{ sx: { color: '#fff', fontWeight: 500 } }}
                      secondaryTypographyProps={{ sx: { color: '#aaa' } }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        {/* AI Agents Status */}
        <Grid item xs={12}>
          <Card sx={{
            background: 'rgba(25,25,25,0.95)',
            border: '2px solid #fdcb6e',
            borderRadius: 3,
            boxShadow: '0 0 12px 2px #fdcb6e',
          }}>
                <CardContent>
              <Typography variant="h6" sx={{ color: '#fdcb6e', fontWeight: 'bold', mb: 2 }}>
                🤖 AI Agents Status
              </Typography>
              <Grid container spacing={2}>
                {agents.map((agent) => (
                  <Grid item xs={12} md={6} key={agent.name}>
                    <Box sx={{
                      background: 'rgba(40,40,40,0.95)',
                      borderRadius: 2,
                      p: 2,
                      mb: 1,
                      border: '1px solid #444',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}>
                      <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold' }}>{agent.name}</Typography>
                      <Typography variant="body2" sx={{ color: agent.status === 'Active' ? '#2ed573' : '#aaa' }}>
                        Status: {agent.status}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#fdcb6e' }}>
                        XP: {agent.xp} | Level: {agent.level}
                      </Typography>
                    </Box>
            </Grid>
          ))}
              </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
          </Box>
  );
};

export default EnhancedCRMDashboard; 