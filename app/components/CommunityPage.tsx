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
  Avatar,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Group as GroupIcon,
  Forum as ForumIcon,
  Event as EventIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Message as MessageIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
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
      id={`community-tabpanel-${index}`}
      aria-labelledby={`community-tab-${index}`}
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

const CommunityPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const forumPosts = [
    {
      id: 1,
      title: 'Best practices for AI agent development',
      author: 'Alice Johnson',
      avatar: 'AJ',
      replies: 15,
      views: 234,
      lastActivity: '2 hours ago',
      category: 'Development',
      pinned: true,
    },
    {
      id: 2,
      title: 'DAO governance proposal: Increase staking rewards',
      author: 'Bob Smith',
      avatar: 'BS',
      replies: 8,
      views: 156,
      lastActivity: '4 hours ago',
      category: 'Governance',
      pinned: false,
    },
    {
      id: 3,
      title: 'New feature request: Mobile app integration',
      author: 'Carol Davis',
      avatar: 'CD',
      replies: 23,
      views: 445,
      lastActivity: '6 hours ago',
      category: 'Feature Request',
      pinned: false,
    },
  ];

  const events = [
    {
      id: 1,
      title: 'DecentraMind Community Meetup',
      date: '2024-02-15',
      time: '18:00 UTC',
      location: 'Virtual Event',
      attendees: 150,
      type: 'Meetup',
    },
    {
      id: 2,
      title: 'AI Agent Development Workshop',
      date: '2024-02-20',
      time: '14:00 UTC',
      location: 'Online',
      attendees: 75,
      type: 'Workshop',
    },
    {
      id: 3,
      title: 'DAO Governance Discussion',
      date: '2024-02-25',
      time: '16:00 UTC',
      location: 'Discord',
      attendees: 200,
      type: 'Discussion',
    },
  ];

  const ambassadors = [
    {
      id: 1,
      name: 'Alex Chen',
      role: 'Technical Ambassador',
      avatar: 'AC',
      contributions: 45,
      rating: 4.9,
      specialties: ['AI Development', 'Blockchain'],
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      role: 'Community Ambassador',
      avatar: 'MR',
      contributions: 38,
      rating: 4.8,
      specialties: ['Community Building', 'Education'],
    },
    {
      id: 3,
      name: 'David Kim',
      role: 'Developer Ambassador',
      avatar: 'DK',
      contributions: 52,
      rating: 4.9,
      specialties: ['Smart Contracts', 'Web3'],
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
          <GroupIcon sx={{ fontSize: 40 }} />
          Community Hub
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Connect, collaborate, and grow with the DecentraMind community
        </Typography>
      </Box>

      {/* Community Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #2ed573',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GroupIcon sx={{ color: '#2ed573', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#2ed573' }}>
                  Active Members
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                2,500+
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Growing community
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #0984e3',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MessageIcon sx={{ color: '#0984e3', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#0984e3' }}>
                  Forum Posts
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                1,200+
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Daily discussions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #e84393',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EventIcon sx={{ color: '#e84393', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#e84393' }}>
                  Events
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                15+
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Monthly events
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #fdcb6e',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <StarIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                <Typography variant="h6" sx={{ color: '#fdcb6e' }}>
                  Ambassadors
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                25+
              </Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                Community leaders
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
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
            <Tab label="Forum" icon={<ForumIcon />} iconPosition="start" />
            <Tab label="Events" icon={<EventIcon />} iconPosition="start" />
            <Tab label="Ambassadors" icon={<StarIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Forum Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
            Community Forum
          </Typography>
          <Grid container spacing={3}>
            {forumPosts.map((post) => (
              <Grid item xs={12} key={post.id}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: '#00ffff', 
                        color: '#000000',
                        mr: 2,
                        width: 40,
                        height: 40
                      }}>
                        {post.avatar}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                            {post.title}
                          </Typography>
                          {post.pinned && (
                            <Chip label="Pinned" size="small" sx={{ backgroundColor: '#fdcb6e', color: '#000000' }} />
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          by {post.author} • {post.lastActivity}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                          {post.replies} replies
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                          {post.views} views
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                        color: '#00ffff',
                        fontSize: '0.7rem'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Events Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
            Upcoming Events
          </Typography>
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ color: '#e84393', mr: 1 }} />
                      <Typography variant="h6" sx={{ color: '#ffffff', flex: 1 }}>
                        {event.title}
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 0.5 }}>
                        <CalendarIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        {event.date} at {event.time}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        {event.location}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                        <PersonIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        {event.attendees} attendees
                      </Typography>
                    </Box>
                    <Chip
                      label={event.type}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(233, 67, 147, 0.1)',
                        color: '#e84393',
                        fontSize: '0.7rem'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Ambassadors Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" sx={{ color: '#00ffff', mb: 3 }}>
            Community Ambassadors
          </Typography>
          <Grid container spacing={3}>
            {ambassadors.map((ambassador) => (
              <Grid item xs={12} md={4} key={ambassador.id}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  height: '100%',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: '#fdcb6e', 
                        color: '#000000',
                        mr: 2,
                        width: 50,
                        height: 50
                      }}>
                        {ambassador.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                          {ambassador.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fdcb6e' }}>
                          {ambassador.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                        Contributions: {ambassador.contributions}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                        Rating: {ambassador.rating}/5.0
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {ambassador.specialties.map((specialty, index) => (
                        <Chip
                          key={index}
                          label={specialty}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(253, 203, 110, 0.1)',
                            color: '#fdcb6e',
                            fontSize: '0.6rem'
                          }}
                        />
                      ))}
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

export default CommunityPage;

