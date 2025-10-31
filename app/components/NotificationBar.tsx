"use client";

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, IconButton, Chip,
  Snackbar, Alert, List, ListItem, ListItemText, ListItemIcon,
  Divider, Avatar, Tooltip, Badge
} from '@mui/material';
import {
  Notifications as NotificationsIcon, Close as CloseIcon,
  TrendingUp as TrendingUpIcon, Security as SecurityIcon,
  Favorite as HeartIcon, AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon, Warning as WarningIcon,
  Info as InfoIcon, Star as StarIcon
} from '@mui/icons-material';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  agentId: string;
  agentName: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface AgentSuggestion {
  id: string;
  agentId: string;
  agentName: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

const NotificationBar: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [suggestions, setSuggestions] = useState<AgentSuggestion[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'New Alpha Token Discovered!',
      message: 'Crypto Alpha Assistant found $NEW token with 95% risk score',
      agentId: 'crypto-alpha',
      agentName: 'Crypto Alpha Assistant',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      actionUrl: '/crypto-alpha'
    },
    {
      id: '2',
      type: 'info',
      title: 'Treasury Metrics Updated',
      message: 'Autonomous CFO updated portfolio analysis and staking rewards',
      agentId: 'autonomous-cfo',
      agentName: 'Autonomous CFO',
      timestamp: '2024-01-15T09:45:00Z',
      read: false,
      actionUrl: '/cfo/portfolio'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Health Insight Available',
      message: 'Care Orchestrator detected unusual sleep pattern trends',
      agentId: 'care-orchestrator',
      agentName: 'Care Orchestrator',
      timestamp: '2024-01-15T08:20:00Z',
      read: true,
      actionUrl: '/care/insights'
    },
    {
      id: '4',
      type: 'success',
      title: 'Agent Level Up!',
      message: 'Crypto Alpha Assistant reached Level 2! New capabilities unlocked.',
      agentId: 'crypto-alpha',
      agentName: 'Crypto Alpha Assistant',
      timestamp: '2024-01-14T16:15:00Z',
      read: true,
      actionUrl: '/ai-agents/management'
    }
  ];

  const mockSuggestions: AgentSuggestion[] = [
    {
      id: '1',
      agentId: 'crypto-alpha',
      agentName: 'Crypto Alpha Assistant',
      suggestion: 'Consider tracking $SOL for potential breakout',
      priority: 'high',
      timestamp: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      agentId: 'autonomous-cfo',
      agentName: 'Autonomous CFO',
      suggestion: 'Portfolio rebalancing recommended due to market volatility',
      priority: 'medium',
      timestamp: '2024-01-15T09:30:00Z'
    },
    {
      id: '3',
      agentId: 'care-orchestrator',
      agentName: 'Care Orchestrator',
      suggestion: 'Log your mood to maintain wellness tracking streak',
      priority: 'low',
      timestamp: '2024-01-15T08:00:00Z'
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    setSuggestions(mockSuggestions);
    
    const unread = mockNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

  const getNotificationIcon = (type: string, agentId: string) => {
    if (agentId === 'crypto-alpha') return <TrendingUpIcon sx={{ color: '#00ffff' }} />;
    if (agentId === 'autonomous-cfo') return <SecurityIcon sx={{ color: '#2ed573' }} />;
    if (agentId === 'care-orchestrator') return <HeartIcon sx={{ color: '#ff6b6b' }} />;
    
    switch (type) {
      case 'success': return <CheckCircleIcon sx={{ color: '#2ed573' }} />;
      case 'warning': return <WarningIcon sx={{ color: '#fdcb6e' }} />;
      case 'error': return <WarningIcon sx={{ color: '#ff6b6b' }} />;
      default: return <InfoIcon sx={{ color: '#00ffff' }} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#fdcb6e';
      case 'low': return '#2ed573';
      default: return '#b0b0b0';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Box>
      {/* Notification Bell */}
      <Tooltip title={`${unreadCount} unread notifications`}>
        <IconButton
          onClick={() => setShowNotifications(!showNotifications)}
          sx={{ color: '#00ffff', position: 'relative' }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card sx={{
          position: 'absolute',
          top: '100%',
          right: 0,
          width: 400,
          maxHeight: 600,
          overflow: 'auto',
          background: 'rgba(25, 25, 25, 0.95)',
          border: '2px solid #00ffff',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          zIndex: 1000
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6" sx={{ color: '#00ffff', display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotificationsIcon />
                Notifications
              </Typography>
              <Box>
                {unreadCount > 0 && (
                  <IconButton size="small" onClick={markAllAsRead} sx={{ color: '#b0b0b0' }}>
                    <Typography variant="body2">Mark all read</Typography>
                  </IconButton>
                )}
                <IconButton size="small" onClick={() => setShowNotifications(false)} sx={{ color: '#b0b0b0' }}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Notifications List */}
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'rgba(0, 255, 255, 0.1)',
                      borderRadius: '8px',
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 255, 0.2)'
                      }
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type, notification.agentId)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                            {notification.message}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={notification.agentName}
                              size="small"
                              sx={{
                                backgroundColor: notification.agentId === 'crypto-alpha' ? '#00ffff' :
                                               notification.agentId === 'autonomous-cfo' ? '#2ed573' : '#ff6b6b',
                                color: '#000',
                                fontSize: '0.7rem'
                              }}
                            />
                            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                              {formatTimeAgo(notification.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
                </React.Fragment>
              ))}
            </List>

            {/* Agent Suggestions */}
            <Box mt={3}>
              <Typography variant="h6" sx={{ color: '#fdcb6e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesomeIcon />
                Agent Suggestions
              </Typography>
              
              <List>
                {suggestions.map((suggestion, index) => (
                  <React.Fragment key={suggestion.id}>
                    <ListItem sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <StarIcon sx={{ color: getPriorityColor(suggestion.priority) }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ color: '#ffffff' }}>
                            {suggestion.suggestion}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                              — {suggestion.agentName}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Chip
                                label={suggestion.priority.toUpperCase()}
                                size="small"
                                sx={{
                                  backgroundColor: getPriorityColor(suggestion.priority),
                                  color: '#000',
                                  fontSize: '0.7rem'
                                }}
                              />
                              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                {formatTimeAgo(suggestion.timestamp)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < suggestions.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default NotificationBar;

