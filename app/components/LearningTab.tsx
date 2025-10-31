"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  School as SchoolIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  CheckCircle as CheckIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useGlobalState } from '../store/globalState';
import { saveData, getData } from '../lib/firebase';

interface LearningSession {
  id: string;
  topic: string;
  duration: number;
  startTime: string;
  endTime?: string;
  progress: {
    vocabulary: number;
    grammar: number;
    pronunciation: number;
  };
  activities: {
    type: 'vocabulary' | 'quiz' | 'pronunciation' | 'recording';
    timestamp: string;
    score?: number;
    feedback?: string;
  }[];
  completed: boolean;
}

const LearningTab: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [sessionDuration, setSessionDuration] = useState(900); // 15 minutes default
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({ open: false, message: '', type: 'success' });

  const { learningSessions, addLearningSession, updateLearningSession, userProgress, updateUserProgress } = useGlobalState();

  const topics = [
    { name: 'German Basics', duration: 900, difficulty: 'Beginner' },
    { name: 'Spanish Greetings', duration: 600, difficulty: 'Beginner' },
    { name: 'French Numbers', duration: 450, difficulty: 'Beginner' },
    { name: 'Productivity Skills', duration: 1200, difficulty: 'Intermediate' },
    { name: 'Creative Writing', duration: 1800, difficulty: 'Advanced' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && currentSession) {
      interval = setInterval(() => {
        setSessionTime(prev => {
          const newTime = prev + 1;
          if (newTime >= sessionDuration) {
            handleSessionComplete();
            return prev;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentSession, sessionDuration]);

  const handleStartSession = () => {
    if (!selectedTopic) {
      setSnackbar({ open: true, message: 'Please select a topic', type: 'error' });
      return;
    }

    const topic = topics.find(t => t.name === selectedTopic);
    if (!topic) return;

    const newSession: LearningSession = {
      id: `session-${Date.now()}`,
      topic: selectedTopic,
      duration: topic.duration,
      startTime: new Date().toISOString(),
      progress: {
        vocabulary: 0,
        grammar: 0,
        pronunciation: 0,
      },
      activities: [],
      completed: false,
    };

    setCurrentSession(newSession);
    setSessionTime(0);
    setIsActive(true);
    setSessionDuration(topic.duration);
    setShowStartDialog(false);
    setSelectedTopic('');

    // Save to Firebase
    saveData(`learning_sessions/${newSession.id}`, newSession);
    setSnackbar({ open: true, message: 'Learning session started!', type: 'success' });
  };

  const handleSessionComplete = async () => {
    if (!currentSession) return;

    setIsActive(false);
    
    const completedSession: LearningSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      completed: true,
      progress: {
        vocabulary: Math.min(100, Math.floor(Math.random() * 40) + 60),
        grammar: Math.min(100, Math.floor(Math.random() * 30) + 50),
        pronunciation: Math.min(100, Math.floor(Math.random() * 35) + 55),
      },
      activities: [
        {
          type: 'vocabulary',
          timestamp: new Date().toISOString(),
          score: Math.floor(Math.random() * 3) + 7,
          feedback: 'Great progress on vocabulary!',
        },
        {
          type: 'quiz',
          timestamp: new Date().toISOString(),
          score: Math.floor(Math.random() * 3) + 7,
          feedback: 'Well done on the quiz!',
        },
        {
          type: 'pronunciation',
          timestamp: new Date().toISOString(),
          score: Math.floor(Math.random() * 3) + 7,
          feedback: 'Excellent pronunciation!',
        },
      ],
    };

    // Update Firebase
    await saveData(`learning_sessions/${completedSession.id}`, completedSession);
    
    // Update global state
    addLearningSession(completedSession);
    
    // Update user progress
    const newProgress = {
      totalLearningSessions: userProgress.totalLearningSessions + 1,
      totalLearningTime: userProgress.totalLearningTime + sessionDuration,
      averageSessionScore: (userProgress.averageSessionScore + 8.5) / 2, // Mock score
      streakDays: userProgress.streakDays + 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
    
    updateUserProgress(newProgress);
    await saveData('user_progress', newProgress);

    setSnackbar({ 
      open: true, 
      message: `Session completed! You earned ${Math.floor(sessionDuration / 60)} XP!`, 
      type: 'success' 
    });
    
    setCurrentSession(null);
    setSessionTime(0);
  };

  const handlePauseSession = () => {
    setIsActive(false);
    setSnackbar({ open: true, message: 'Session paused', type: 'success' });
  };

  const handleResumeSession = () => {
    setIsActive(true);
    setSnackbar({ open: true, message: 'Session resumed', type: 'success' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return (sessionTime / sessionDuration) * 100;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2, textShadow: '0 0 8px #00ffff' }}>
        📚 Learning Hub
      </Typography>
      <Typography variant="h6" sx={{ color: '#fff', mb: 4, fontWeight: 500 }}>
        Track your learning progress and earn XP
      </Typography>

      {/* Current Session */}
      {currentSession && (
        <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: 3, mb: 4 }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 2 }}>
              🎯 Current Session: {currentSession.topic}
            </Typography>
            
            <Box display="flex" alignItems="center" mb={2}>
              <TimerIcon sx={{ color: '#00ffff', mr: 1 }} />
              <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                {formatTime(sessionTime)}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', ml: 1 }}>
                / {formatTime(sessionDuration)}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={getProgressPercentage()}
              sx={{
                height: 10,
                borderRadius: 5,
                background: '#333',
                '& .MuiLinearProgress-bar': {
                  background: '#00ffff',
                },
              }}
            />

            <Box display="flex" gap={2} mt={2}>
              {isActive ? (
                <Button
                  variant="outlined"
                  startIcon={<PauseIcon />}
                  onClick={handlePauseSession}
                  sx={{ borderColor: '#fdcb6e', color: '#fdcb6e' }}
                >
                  Pause
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<PlayIcon />}
                  onClick={handleResumeSession}
                  sx={{ borderColor: '#2ed573', color: '#2ed573' }}
                >
                  Resume
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<StopIcon />}
                onClick={handleSessionComplete}
                sx={{ borderColor: '#ff3860', color: '#ff3860' }}
              >
                Complete
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #00ffff', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <SchoolIcon sx={{ color: '#00ffff', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
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
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TimerIcon sx={{ color: '#2ed573', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                  {Math.floor(userProgress.totalLearningTime / 60)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <StarIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                <Typography variant="h4" sx={{ color: '#fdcb6e', fontWeight: 'bold' }}>
                  {userProgress.averageSessionScore.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Average Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff3860', borderRadius: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUpIcon sx={{ color: '#ff3860', mr: 1 }} />
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

      {/* Available Topics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
          🎯 Available Topics
        </Typography>
        <Grid container spacing={2}>
          {topics.map((topic) => (
            <Grid item xs={12} sm={6} md={4} key={topic.name}>
              <Card
                sx={{
                  background: 'rgba(25, 25, 25, 0.9)',
                  border: '2px solid #00ffff',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px #00ffff40',
                  },
                }}
                onClick={() => {
                  setSelectedTopic(topic.name);
                  setSessionDuration(topic.duration);
                  setShowStartDialog(true);
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    {topic.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Duration: {Math.floor(topic.duration / 60)} minutes
                  </Typography>
                  <Chip
                    label={topic.difficulty}
                    size="small"
                    sx={{
                      background: topic.difficulty === 'Beginner' ? '#2ed573' : 
                                topic.difficulty === 'Intermediate' ? '#fdcb6e' : '#ff3860',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Recent Sessions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
          📊 Recent Sessions
        </Typography>
        <List>
          {learningSessions.slice(-5).reverse().map((session) => (
            <ListItem
              key={session.id}
              sx={{
                background: 'rgba(25, 25, 25, 0.9)',
                borderRadius: 2,
                mb: 1,
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <ListItemIcon>
                {session.completed ? (
                  <CheckIcon sx={{ color: '#2ed573' }} />
                ) : (
                  <CircularProgress size={20} sx={{ color: '#00ffff' }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={session.topic}
                secondary={`${Math.floor(session.duration / 60)} minutes • ${session.completed ? 'Completed' : 'In Progress'}`}
                primaryTypographyProps={{ color: 'white', fontWeight: 'bold' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
              {session.completed && (
                <Box display="flex" gap={1}>
                  <Chip
                    label={`${session.progress.vocabulary}% Vocab`}
                    size="small"
                    sx={{ background: '#2ed573', color: 'white' }}
                  />
                  <Chip
                    label={`${session.progress.grammar}% Grammar`}
                    size="small"
                    sx={{ background: '#fdcb6e', color: 'white' }}
                  />
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Start Session Dialog */}
      <Dialog open={showStartDialog} onClose={() => setShowStartDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          Start Learning Session
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            Topic: {selectedTopic}
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', mb: 2 }}>
            Duration: {Math.floor(sessionDuration / 60)} minutes
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              • Complete the session to earn XP<br />
              • Progress will be saved automatically<br />
              • You can pause and resume anytime
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStartDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button onClick={handleStartSession} sx={{ color: '#00ffff' }}>
            Start Session
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.type}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LearningTab; 