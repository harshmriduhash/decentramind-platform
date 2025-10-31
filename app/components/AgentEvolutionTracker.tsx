"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
// Timeline components temporarily disabled - need to install @mui/lab
// import Timeline from '@mui/lab/Timeline';
// import TimelineItem from '@mui/lab/TimelineItem';
// import TimelineSeparator from '@mui/lab/TimelineSeparator';
// import TimelineConnector from '@mui/lab/TimelineConnector';
// import TimelineContent from '@mui/lab/TimelineContent';
// import TimelineDot from '@mui/lab/TimelineDot';
// import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  Mic as MicIcon,
  Quiz as QuizIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import { useGlobalState } from '../store/globalState';

const AgentEvolutionTracker: React.FC = () => {
  const { 
    learningSessions = [], 
    agentEvolutions = [], 
    userProgress = {
      totalLearningSessions: 0,
      totalLearningTime: 0,
      averageSessionScore: 0,
      streakDays: 0,
      lastActiveDate: '',
      achievements: [],
      skillLevels: {}
    },
    agents = [] 
  } = useGlobalState();
  
  const [selectedTab, setSelectedTab] = useState<'learning' | 'evolution' | 'progress'>('learning');

  const getEvolutionIcon = (type: string) => {
    switch (type) {
      case 'level_up':
        return <TrendingUpIcon sx={{ color: '#00ffff' }} />;
      case 'skill_unlock':
        return <AutoAwesomeIcon sx={{ color: '#2ed573' }} />;
      case 'performance_boost':
        return <StarIcon sx={{ color: '#fdcb6e' }} />;
      case 'training_complete':
        return <CheckCircleIcon sx={{ color: '#ff3860' }} />;
      default:
        return <TrendingUpIcon />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vocabulary':
        return <TranslateIcon />;
      case 'quiz':
        return <QuizIcon />;
      case 'pronunciation':
        return <MicIcon />;
      case 'recording':
        return <PlayIcon />;
      default:
        return <SchoolIcon />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
        📊 History & Evolution Tracker
      </Typography>
      
      {/* Tab Navigation */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant={selectedTab === 'learning' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTab('learning')}
              sx={{
                background: selectedTab === 'learning' ? '#00ffff' : 'transparent',
                color: selectedTab === 'learning' ? 'black' : '#00ffff',
                borderColor: '#00ffff',
              }}
            >
              🎓 Learning History
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={selectedTab === 'evolution' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTab('evolution')}
              sx={{
                background: selectedTab === 'evolution' ? '#2ed573' : 'transparent',
                color: selectedTab === 'evolution' ? 'black' : '#2ed573',
                borderColor: '#2ed573',
              }}
            >
              🤖 Agent Evolution
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant={selectedTab === 'progress' ? 'contained' : 'outlined'}
              onClick={() => setSelectedTab('progress')}
              sx={{
                background: selectedTab === 'progress' ? '#fdcb6e' : 'transparent',
                color: selectedTab === 'progress' ? 'black' : '#fdcb6e',
                borderColor: '#fdcb6e',
              }}
            >
              📈 User Progress
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Learning History Tab */}
      {selectedTab === 'learning' && (
        <Box>
          <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
            🎓 Learning Session History
          </Typography>
          
          <Grid container spacing={3}>
            {(learningSessions || []).map((session) => (
              <Grid item xs={12} md={6} key={session.id}>
                <Card sx={{ 
                  background: 'rgba(25, 25, 25, 0.9)', 
                  border: '2px solid #00ffff',
                  borderRadius: 3 
                }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {session.topic}
                      </Typography>
                      <Chip 
                        label={session.completed ? 'Completed' : 'In Progress'} 
                        color={session.completed ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      Duration: {Math.floor(session.duration / 60)} minutes
                    </Typography>
                    
                    {/* Progress Bars */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                        Vocabulary: {session.progress.vocabulary}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={session.progress.vocabulary}
                        sx={{ mb: 1, height: 6, borderRadius: 3 }}
                      />
                      
                      <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                        Grammar: {session.progress.grammar}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={session.progress.grammar}
                        sx={{ mb: 1, height: 6, borderRadius: 3 }}
                      />
                      
                      <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                        Pronunciation: {session.progress.pronunciation}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={session.progress.pronunciation}
                        sx={{ mb: 1, height: 6, borderRadius: 3 }}
                      />
                    </Box>
                    
                    {/* Activities Timeline */}
                    <Accordion sx={{ background: 'rgba(0,0,0,0.3)', color: 'white' }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          Activities ({session.activities.length})
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {/* Timeline temporarily disabled - need to install @mui/lab */}
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          Activities: {session.activities.length} items
                        </Typography>
                        {/* <Timeline>
                          {(session.activities || []).map((activity, index) => (
                            <TimelineItem key={index}>
                              <TimelineSeparator>
                                <TimelineDot sx={{ background: '#00ffff' }}>
                                  {getActivityIcon(activity.type)}
                                </TimelineDot>
                                {index < session.activities.length - 1 && <TimelineConnector />}
                              </TimelineSeparator>
                              <TimelineContent>
                                <Typography variant="body2" sx={{ color: 'white' }}>
                                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                </Typography>
                                {activity.score && (
                                  <Typography variant="caption" sx={{ color: '#00ffff' }}>
                                    Score: {activity.score}/10
                                  </Typography>
                                )}
                                {activity.feedback && (
                                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                    {activity.feedback}
                                  </Typography>
                                )}
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline> */}
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Agent Evolution Tab */}
      {selectedTab === 'evolution' && (
        <Box>
          <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
            🤖 Agent Evolution History
          </Typography>
          
          {/* Timeline temporarily disabled - need to install @mui/lab */}
          <Typography variant="body2" sx={{ color: 'white' }}>
            Evolution History: {agentEvolutions.length} events
          </Typography>
          {/* <Timeline>
            {(agentEvolutions || []).map((evolution) => (
              <TimelineItem key={evolution.id}>
                <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {new Date(evolution.timestamp).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {new Date(evolution.timestamp).toLocaleTimeString()}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot sx={{ background: '#2ed573' }}>
                    {getEvolutionIcon(evolution.evolutionType)}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {evolution.agentName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2ed573', mb: 1 }}>
                        {evolution.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        XP Gained: +{evolution.xpGained}
                      </Typography>
                      <Chip 
                        label={evolution.evolutionType.replace('_', ' ')} 
                        size="small"
                        sx={{ mt: 1, background: '#2ed573', color: 'white' }}
                      />
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline> */}
        </Box>
      )}

      {/* User Progress Tab */}
      {selectedTab === 'progress' && (
        <Box>
          <Typography variant="h5" sx={{ color: 'white', mb: 3 }}>
            📈 User Progress Overview
          </Typography>
          
          <Grid container spacing={3}>
            {/* Statistics Cards */}
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <SchoolIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                    <Typography variant="h4" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                      {userProgress.totalLearningSessions}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Sessions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <ScheduleIcon sx={{ color: '#00ffff', mr: 1 }} />
                    <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {Math.floor(userProgress.totalLearningTime / 3600)}h {Math.floor((userProgress.totalLearningTime % 3600) / 60)}m
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Total Learning Time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <StarIcon sx={{ color: '#2ed573', mr: 1 }} />
                    <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                      {userProgress.averageSessionScore}/10
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Average Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff3860' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TrophyIcon sx={{ color: '#ff3860', mr: 1 }} />
                    <Typography variant="h4" sx={{ color: '#ff3860', fontWeight: 'bold' }}>
                      {userProgress.streakDays}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Day Streak
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Skill Levels */}
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                🎯 Skill Levels
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(userProgress?.skillLevels || {}).map(([skill, level]) => (
                  <Grid item xs={6} md={3} key={skill}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                        {skill}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(level / 5) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Level {level}/5
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          
          {/* Achievements */}
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                🏆 Achievements
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {(userProgress?.achievements || []).map((achievement, index) => (
                  <Chip 
                    key={index}
                    label={achievement} 
                    size="small"
                    sx={{ background: '#fdcb6e', color: 'black' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default AgentEvolutionTracker; 