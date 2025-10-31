"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import agentService from '../services/agentService';

interface TaskEntry {
  id: string;
  description: string;
  xpReward: number;
  timestamp: string;
  status: 'completed' | 'in_progress' | 'pending';
  category: 'research' | 'analysis' | 'report' | 'interaction' | 'optimization';
  agentId: string;
}

interface TaskLogProps {
  agentId: string;
  agentName: string;
  maxEntries?: number;
}

const TaskLog: React.FC<TaskLogProps> = ({ agentId, agentName, maxEntries = 10 }) => {
  const [tasks, setTasks] = useState<TaskEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);

  // Mock task data - in production, this would come from Firebase
  const mockTasks: TaskEntry[] = [
    {
      id: '1',
      description: 'Analyzed trending token performance',
      xpReward: 25,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      status: 'completed',
      category: 'analysis',
      agentId: agentId,
    },
    {
      id: '2',
      description: 'Generated portfolio optimization report',
      xpReward: 50,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      status: 'completed',
      category: 'report',
      agentId: agentId,
    },
    {
      id: '3',
      description: 'Researched DeFi yield opportunities',
      xpReward: 30,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      status: 'completed',
      category: 'research',
      agentId: agentId,
    },
    {
      id: '4',
      description: 'User interaction: Portfolio consultation',
      xpReward: 15,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      status: 'completed',
      category: 'interaction',
      agentId: agentId,
    },
    {
      id: '5',
      description: 'Risk assessment for new token',
      xpReward: 40,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      status: 'completed',
      category: 'analysis',
      agentId: agentId,
    },
    {
      id: '6',
      description: 'Generating health insights report',
      xpReward: 35,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      status: 'in_progress',
      category: 'report',
      agentId: agentId,
    },
    {
      id: '7',
      description: 'Analyzing wellness trends',
      xpReward: 20,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      status: 'completed',
      category: 'research',
      agentId: agentId,
    },
  ];

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        
        // Filter tasks for this specific agent
        const agentTasks = mockTasks.filter(task => task.agentId === agentId);
        
        // Sort by timestamp (newest first)
        const sortedTasks = agentTasks.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Limit to maxEntries
        const limitedTasks = sortedTasks.slice(0, maxEntries);
        
        setTasks(limitedTasks);
        
        // Calculate total XP earned
        const totalXPEarned = limitedTasks
          .filter(task => task.status === 'completed')
          .reduce((sum, task) => sum + task.xpReward, 0);
        
        setTotalXP(totalXPEarned);
        
        // Update agent XP in the service
        if (totalXPEarned > 0) {
          try {
            await agentService.addXP(agentId, totalXPEarned, 'task_completion');
          } catch (error) {
            console.warn('Failed to update agent XP:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [agentId, maxEntries]);

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType> = {
      research: TrendingUpIcon,
      analysis: AutoAwesomeIcon,
      report: CheckCircleIcon,
      interaction: StarIcon,
      optimization: TrophyIcon,
    };
    return iconMap[category] || CheckCircleIcon;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      research: '#2196f3',
      analysis: '#9c27b0',
      report: '#4caf50',
      interaction: '#ff9800',
      optimization: '#f44336',
    };
    return colorMap[category] || '#757575';
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      completed: '#4caf50',
      in_progress: '#ff9800',
      pending: '#757575',
    };
    return colorMap[status] || '#757575';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#00ffff' }} />
      </Box>
    );
  }

  return (
    <Card sx={{
      background: 'rgba(25, 25, 25, 0.9)',
      border: '2px solid #00ffff',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
    }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ backgroundColor: 'rgba(0, 255, 255, 0.1)', border: '2px solid #00ffff' }}>
              <ScheduleIcon sx={{ color: '#00ffff' }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                Task Log
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                {agentName} Activity
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <StarIcon sx={{ color: '#fdcb6e', fontSize: 20 }} />
            <Typography variant="h6" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
              {totalXP} XP
            </Typography>
          </Box>
        </Box>

        {/* Task List */}
        {tasks.length === 0 ? (
          <Alert severity="info" sx={{ backgroundColor: 'rgba(0, 255, 255, 0.1)', color: '#00ffff' }}>
            No tasks completed yet. Start using {agentName} to see activity here!
          </Alert>
        ) : (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {tasks.map((task, index) => {
              const CategoryIcon = getCategoryIcon(task.category);
              const categoryColor = getCategoryColor(task.category);
              const statusColor = getStatusColor(task.status);

              return (
                <React.Fragment key={task.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        backgroundColor: `${categoryColor}20`,
                        border: `2px solid ${categoryColor}`
                      }}>
                        <CategoryIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 500 }}>
                            {task.description}
                          </Typography>
                          <Chip
                            label={task.category}
                            size="small"
                            sx={{
                              backgroundColor: `${categoryColor}20`,
                              color: categoryColor,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                              {formatTimestamp(task.timestamp)}
                            </Typography>
                            <Chip
                              label={task.status.replace('_', ' ')}
                              size="small"
                              sx={{
                                backgroundColor: `${statusColor}20`,
                                color: statusColor,
                                fontSize: '0.7rem',
                                height: 18,
                              }}
                            />
                          </Box>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <StarIcon sx={{ color: '#fdcb6e', fontSize: 14 }} />
                            <Typography variant="caption" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                              +{task.xpReward} XP
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < tasks.length - 1 && (
                    <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}

        {/* Summary */}
        {tasks.length > 0 && (
          <Box mt={3} p={2} sx={{ backgroundColor: 'rgba(0, 255, 255, 0.05)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#b0b0b0', textAlign: 'center' }}>
              {tasks.filter(t => t.status === 'completed').length} tasks completed • {totalXP} total XP earned
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskLog;

