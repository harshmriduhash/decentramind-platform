'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Divider,
  Paper,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  AutoAwesome as CreativeIcon,
  Search as ResearchIcon,
  Build as AutomationIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { taskService, Task, TaskTemplate } from '../services/taskService';
import { AGENT_UPGRADE_TIERS } from '../utils/agentUpgradeUtils';

interface TaskManagementProps {
  selectedAgent: {
    id: string;
    name: string;
    level: number;
    capabilities: string[];
    dmtBalance: number;
  } | null;
  onTaskCompleted: (agentId: string, xpGained: number, dmtSpent: number) => void;
}

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
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TaskManagement: React.FC<TaskManagementProps> = ({ selectedAgent, onTaskCompleted }) => {
  const [tabValue, setTabValue] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTemplates, setTaskTemplates] = useState<TaskTemplate[]>([]);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [executingTasks, setExecutingTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (selectedAgent) {
      const tasks = taskService.getAgentTasks(selectedAgent.id);
      const templates = taskService.getAvailableTaskTemplates(selectedAgent.level, selectedAgent.capabilities);
      setTasks(tasks);
      setTaskTemplates(templates);
    } else {
      // Clear data when no agent is selected
      setTasks([]);
      setTaskTemplates([]);
    }
  }, [selectedAgent]);

  // Debug log for modal state
  useEffect(() => {
  }, [createTaskOpen]);

  const handleCreateTask = useCallback(() => {
    if (!selectedAgent || !selectedTemplate) return;

    try {
      const newTask = taskService.createTask(selectedAgent.id, selectedTemplate, customDescription);
      setTasks(prev => [...prev, newTask]);
      setCreateTaskOpen(false);
      setSelectedTemplate('');
      setCustomDescription('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  }, [selectedAgent, selectedTemplate, customDescription]);

  const handleExecuteTask = useCallback(async (taskId: string) => {
    if (!selectedAgent || executingTasks.has(taskId)) return;

    setExecutingTasks(prev => new Set(prev).add(taskId));
    
    try {
      const completedTask = await taskService.executeTask(taskId);
      setTasks(prev => prev.map(t => t.id === taskId ? completedTask : t));
      
      if (completedTask.status === 'completed') {
        onTaskCompleted(selectedAgent.id, completedTask.xpReward, completedTask.dmtCost);
      }
    } catch (error) {
      console.error('Task execution failed:', error);
    } finally {
      setExecutingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  }, [selectedAgent, executingTasks, onTaskCompleted]);

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'chat': return <ChatIcon />;
      case 'code': return <CodeIcon />;
      case 'creative': return <CreativeIcon />;
      case 'research': return <ResearchIcon />;
      case 'automation': return <AutomationIcon />;
      case 'analysis': return <PsychologyIcon />;
      default: return <PsychologyIcon />;
    }
  };

  const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return 'default';
      case 'in_progress': return 'primary';
      case 'completed': return 'success';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const stats = useMemo(() => {
    if (!selectedAgent) return null;
    return taskService.getTaskStats(selectedAgent.id);
  }, [selectedAgent, tasks]);

  if (!selectedAgent) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Select an agent to manage tasks
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Agent Info Header */}
      <Card sx={{ mb: 3, bgcolor: 'rgba(0,255,255,0.1)', border: '1px solid #00ffff' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" color="#00ffff">
                {selectedAgent.name} - Task Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Level {selectedAgent.level} • {selectedAgent.capabilities.length} capabilities
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="body2" color="text.secondary">
                DMT Balance: {selectedAgent.dmtBalance}
              </Typography>
              {stats && (
                <Typography variant="body2" color="text.secondary">
                  Total XP Earned: {stats.totalXp}
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(0,255,255,0.05)' }}>
              <Typography variant="h4" color="#00ffff">{stats.total}</Typography>
              <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(76,175,80,0.1)' }}>
              <Typography variant="h4" color="#4caf50">{stats.completed}</Typography>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,193,7,0.1)' }}>
              <Typography variant="h4" color="#ffc107">{stats.inProgress}</Typography>
              <Typography variant="body2" color="text.secondary">In Progress</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(244,67,54,0.1)' }}>
              <Typography variant="h4" color="#f44336">{stats.failed}</Typography>
              <Typography variant="body2" color="text.secondary">Failed</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Active Tasks" />
          <Tab label="Task Templates" />
          <Tab label="Task History" />
        </Tabs>
      </Box>

      {/* Active Tasks Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Active Tasks</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setCreateTaskOpen(true);
            }}
            sx={{ bgcolor: '#00ffff', color: 'black' }}
          >
            Create Task
          </Button>
        </Box>

        {tasks.length === 0 ? (
          <Alert severity="info">
            No tasks found. Create a new task to get started!
          </Alert>
        ) : (
          <List>
            {tasks.map((task) => (
              <ListItem key={task.id} divider>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      {getTaskIcon(task.type)}
                      <Typography variant="h6">{task.title}</Typography>
                      <Chip
                        label={task.status}
                        size="small"
                        color={getTaskStatusColor(task.status) as any}
                      />
                      <Chip
                        label={task.priority}
                        size="small"
                        color={getPriorityColor(task.priority) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Box display="flex" gap={2} mt={1}>
                        <Typography variant="caption">
                          XP Reward: {task.xpReward}
                        </Typography>
                        <Typography variant="caption">
                          DMT Cost: {task.dmtCost}
                        </Typography>
                        <Typography variant="caption">
                          Duration: {task.estimatedDuration}min
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  {task.status === 'pending' && (
                    <Tooltip title="Execute Task">
                      <IconButton
                        onClick={() => handleExecuteTask(task.id)}
                        disabled={executingTasks.has(task.id) || selectedAgent.dmtBalance < task.dmtCost}
                        color="primary"
                      >
                        <PlayIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {task.status === 'in_progress' && (
                    <Chip
                      label="Executing..."
                      color="primary"
                      icon={<RefreshIcon />}
                    />
                  )}
                  {task.status === 'completed' && (
                    <Chip
                      label="Completed"
                      color="success"
                      icon={<CheckIcon />}
                    />
                  )}
                  {task.status === 'failed' && (
                    <Chip
                      label="Failed"
                      color="error"
                      icon={<ErrorIcon />}
                    />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Task Templates Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Available Task Templates
        </Typography>
        <Grid container spacing={2}>
          {taskTemplates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getTaskIcon(template.type)}
                    <Typography variant="h6">{template.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {template.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Chip label={`${template.xpReward} XP`} size="small" color="primary" />
                    <Chip label={`${template.dmtCost} DMT`} size="small" color="secondary" />
                    <Chip label={`${template.estimatedDuration}min`} size="small" />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Min Level: {template.requirements.minLevel}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Task History Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Task History
        </Typography>
        {stats && stats.total === 0 ? (
          <Alert severity="info">No task history available.</Alert>
        ) : (
          <List>
            {tasks.map((task) => (
              <ListItem key={task.id} divider>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      {getTaskIcon(task.type)}
                      <Typography variant="h6">{task.title}</Typography>
                      <Chip
                        label={task.status}
                        size="small"
                        color={getTaskStatusColor(task.status) as any}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {task.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {task.createdAt.toLocaleString()}
                        {task.completedAt && ` • Completed: ${task.completedAt.toLocaleString()}`}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Create Task Dialog */}
      <Dialog 
        open={createTaskOpen} 
        onClose={() => {
          setCreateTaskOpen(false);
        }} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(25, 25, 25, 0.95)',
            color: 'white',
            border: '2px solid #00ffff',
            borderRadius: 2,
            zIndex: 9999,
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#00ffff', 
          borderBottom: '1px solid #00ffff',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          🎯 Create New Task
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel sx={{ color: '#b0b0b0' }}>Task Template</InputLabel>
            <Select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              label="Task Template"
              variant="outlined"
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00ffff',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00ffff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00ffff',
                },
                '& .MuiSvgIcon-root': {
                  color: '#00ffff',
                },
                '& .MuiSelect-select': {
                  color: 'white',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'rgba(25, 25, 25, 0.95)',
                    border: '1px solid #00ffff',
                    '& .MuiMenuItem-root': {
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 255, 0.1)',
                      },
                      '&.Mui-selected': {
                        bgcolor: 'rgba(0, 255, 255, 0.2)',
                      },
                    },
                  },
                },
              }}
            >
              {taskTemplates.length === 0 ? (
                <MenuItem disabled>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    No templates available for this agent level
                  </Typography>
                </MenuItem>
              ) : (
                taskTemplates.map((template) => (
                  <MenuItem key={template.id} value={template.id}>
                    <Box>
                      <Typography variant="body1" sx={{ color: 'white' }}>{template.name}</Typography>
                      <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                        {template.description} • {template.xpReward} XP • {template.dmtCost} DMT
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Custom Description (Optional)"
            multiline
            rows={3}
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="Add specific details for this task..."
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': {
                  borderColor: '#00ffff',
                },
                '&:hover fieldset': {
                  borderColor: '#00ffff',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00ffff',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#b0b0b0',
                '&.Mui-focused': {
                  color: '#00ffff',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          borderTop: '1px solid #00ffff',
          gap: 2 
        }}>
          <Button 
            onClick={() => setCreateTaskOpen(false)} 
            variant="outlined"
            sx={{ 
              borderColor: '#666',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                color: '#999',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTask}
            variant="contained"
            disabled={!selectedTemplate}
            sx={{ 
              bgcolor: '#00ffff', 
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#00cccc',
              },
              '&:disabled': {
                bgcolor: '#666',
                color: '#999',
              }
            }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManagement;

