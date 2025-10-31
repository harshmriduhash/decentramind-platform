"use client";

import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Assignment as TaskIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { useGlobalState } from '../store/globalState';
import { useToast } from './ToastNotifications';

interface SubAgent {
  id: string;
  name: string;
  domain: string;
  level: number;
  xp: number;
  status: 'active' | 'inactive' | 'training';
  currentTask?: string;
  progress?: number;
  skills: string[];
  performance: {
    tasksCompleted: number;
    successRate: number;
    averageResponseTime: number;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
  xpReward: number;
}

const MasterAgentDashboard: React.FC = () => {
  const { agents, addAgent } = useGlobalState();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [subAgents, setSubAgents] = useState<SubAgent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAgentDetails, setShowAgentDetails] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<SubAgent | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as const,
    dueDate: '',
  });

  // Initialize with mock data based on actual agents
  useEffect(() => {
    const mockSubAgents: SubAgent[] = agents.map(agent => ({
      id: agent.id || `agent-${Date.now()}`,
      name: agent.name,
      domain: agent.domain,
      level: agent.level || 1,
      xp: agent.xp || 0,
      status: 'active' as const,
      currentTask: `Optimize ${agent.domain} performance`,
      progress: Math.floor(Math.random() * 100),
      skills: agent.skills || [],
      performance: {
        tasksCompleted: Math.floor(Math.random() * 50) + 10,
        successRate: Math.floor(Math.random() * 20) + 80,
        averageResponseTime: Math.floor(Math.random() * 5) + 1,
      },
    }));

    setSubAgents(mockSubAgents);

    // Mock tasks
    const mockTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Optimize Learning Algorithm',
        description: 'Improve the learning agent\'s performance by 25%',
        assignedTo: 'Learning Agent',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2024-02-20',
        progress: 65,
        xpReward: 150,
      },
      {
        id: 'task-2',
        title: 'Health Data Analysis',
        description: 'Analyze user health patterns and provide recommendations',
        assignedTo: 'Health Agent',
        status: 'pending',
        priority: 'medium',
        dueDate: '2024-02-25',
        progress: 0,
        xpReward: 100,
      },
      {
        id: 'task-3',
        title: 'Productivity Optimization',
        description: 'Streamline task management and scheduling',
        assignedTo: 'Productivity Agent',
        status: 'completed',
        priority: 'high',
        dueDate: '2024-02-15',
        progress: 100,
        xpReward: 200,
      },
    ];

    setTasks(mockTasks);
  }, [agents]);

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description || !newTask.assignedTo) {
      showError('Please fill in all required fields');
      return;
    }

    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      status: 'pending',
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      progress: 0,
      xpReward: Math.floor(Math.random() * 100) + 50,
    };

    setTasks(prev => [...prev, task]);
    showSuccess(`Task "${newTask.title}" created and assigned to ${newTask.assignedTo}`);
    setShowCreateTask(false);
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
    });
  };

  const handleViewAgent = (agent: SubAgent) => {
    setSelectedAgent(agent);
    setShowAgentDetails(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#2ed573';
      case 'inactive': return '#666';
      case 'training': return '#fdcb6e';
      default: return '#666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff3860';
      case 'medium': return '#fdcb6e';
      case 'low': return '#2ed573';
      default: return '#666';
    }
  };

  const totalXP = subAgents.reduce((sum, agent) => sum + agent.xp, 0);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const averageLevel = subAgents.length > 0 ? subAgents.reduce((sum, agent) => sum + agent.level, 0) / subAgents.length : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1400, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
        🧠 Master Agent Dashboard
      </Typography>
      <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 500 }}>
        Coordinate and manage your AI agent network
      </Typography>

      {/* Master Agent Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <PsychologyIcon sx={{ color: '#00ffff', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                  {subAgents.length}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Sub-Agents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <StarIcon sx={{ color: '#2ed573', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                  {totalXP}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total XP
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TaskIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                  {totalTasks}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Active Tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff3860', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrophyIcon sx={{ color: '#ff3860', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#ff3860', fontWeight: 'bold' }}>
                  {averageLevel.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Avg Level
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Sub-Agents Section */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                  🤖 Sub-Agents
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateTask(true)}
                  sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                >
                  Create Task
                </Button>
              </Box>

              <Grid container spacing={2}>
                {subAgents.map((agent) => (
                  <Grid item xs={12} md={6} key={agent.id}>
                    <Card sx={{ 
                      background: 'rgba(40, 40, 40, 0.9)', 
                      border: '1px solid #333',
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#00ffff',
                        transform: 'translateY(-2px)',
                      },
                    }}
                    onClick={() => handleViewAgent(agent)}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar sx={{ bgcolor: getStatusColor(agent.status), mr: 2 }}>
                            <PsychologyIcon />
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                              {agent.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {agent.domain}
                            </Typography>
                          </Box>
                          <Chip
                            label={`Level ${agent.level}`}
                            size="small"
                            sx={{ background: '#00ffff', color: 'black', fontWeight: 'bold' }}
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            Current Task: {agent.currentTask}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={agent.progress || 0}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              background: '#333',
                              '& .MuiLinearProgress-bar': {
                                background: '#2ed573',
                              },
                            }}
                          />
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ color: '#00ffff' }}>
                            {agent.xp} XP
                          </Typography>
                          <Chip
                            label={agent.status}
                            size="small"
                            sx={{
                              background: getStatusColor(agent.status),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Management */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3 }}>
                📋 Task Management
              </Typography>

              <List>
                {tasks.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      background: 'rgba(40, 40, 40, 0.9)',
                      borderRadius: 2,
                      mb: 1,
                      border: '1px solid #333',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getPriorityColor(task.priority) }}>
                        <TaskIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={task.title}
                      secondary={`${task.assignedTo} • ${task.progress}% complete`}
                      primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                      secondaryTypographyProps={{ color: 'text.secondary' }}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={task.status}
                        size="small"
                        sx={{
                          background: task.status === 'completed' ? '#2ed573' : 
                                    task.status === 'in_progress' ? '#fdcb6e' : '#666',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Task Completion Rate
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(completedTasks / totalTasks) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: '#333',
                    '& .MuiLinearProgress-bar': {
                      background: '#2ed573',
                    },
                  }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  {completedTasks} of {totalTasks} tasks completed
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Task Dialog */}
      <Dialog open={showCreateTask} onClose={() => setShowCreateTask(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          Create New Task
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Assign To"
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Due Date"
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              • Tasks will be assigned to the selected sub-agent<br />
              • XP rewards will be distributed upon completion<br />
              • Progress will be tracked in real-time
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateTask(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleCreateTask} sx={{ color: '#00ffff' }}>
            Create Task
          </Button>
        </DialogActions>
      </Dialog>

      {/* Agent Details Dialog */}
      <Dialog open={showAgentDetails} onClose={() => setShowAgentDetails(false)} maxWidth="md" fullWidth>
        {selectedAgent && (
          <>
            <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
              Agent Details: {selectedAgent.name}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Performance Stats
                  </Typography>
                  <Card sx={{ background: 'rgba(40, 40, 40, 0.9)', mb: 2 }}>
                    <CardContent>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Tasks Completed
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#2ed573' }}>
                        {selectedAgent.performance.tasksCompleted}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ background: 'rgba(40, 40, 40, 0.9)', mb: 2 }}>
                    <CardContent>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Success Rate
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#fdcb6e' }}>
                        {selectedAgent.performance.successRate}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    Skills & Capabilities
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    {selectedAgent.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        sx={{ mr: 1, mb: 1, background: '#00ffff', color: 'black' }}
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Current Task: {selectedAgent.currentTask}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={selectedAgent.progress || 0}
                    sx={{ mt: 1, mb: 2 }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowAgentDetails(false)} sx={{ color: 'text.secondary' }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default MasterAgentDashboard; 