"use client";

import React, { useState, useEffect } from 'react';
import TaskLog from './TaskLog';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip,
  CircularProgress, Alert, IconButton, Tooltip, Avatar, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem,
  ListItemText, ListItemIcon, Divider, LinearProgress, Paper
} from '@mui/material';
import {
  Favorite as HeartIcon, Psychology as BrainIcon, FitnessCenter as BodyIcon,
  Refresh as RefreshIcon, Add as AddIcon, EmojiEmotions as EmojiIcon,
  LocalHospital as HospitalIcon, Warning as WarningIcon, CheckCircle as CheckCircleIcon,
  Star as StarIcon, TrendingUp as TrendingUpIcon, AutoAwesome as AutoAwesomeIcon,
  Medication as MedicationIcon, HealthAndSafety as HealthIcon
} from '@mui/icons-material';

interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'exercise' | 'mental' | 'sleep';
  source: string;
  timestamp: string;
}

interface MedicationWarning {
  id: string;
  medication: string;
  warning: string;
  severity: 'low' | 'medium' | 'high';
  source: string;
}

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  note: string;
  timestamp: string;
  xpEarned: number;
}

interface HealthLog {
  id: string;
  type: 'feeling' | 'symptom' | 'medication' | 'exercise';
  description: string;
  timestamp: string;
  xpEarned: number;
}

const HealthAgentInsights: React.FC = () => {
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [medicationWarnings, setMedicationWarnings] = useState<MedicationWarning[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalXP, setTotalXP] = useState(1200);
  const [level, setLevel] = useState(3);
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [newMood, setNewMood] = useState('');
  const [newMoodNote, setNewMoodNote] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('😊');

  // Mock data
  const mockHealthTips: HealthTip[] = [
    {
      id: '1',
      title: 'Stay Hydrated',
      description: 'Drink at least 8 glasses of water daily to maintain optimal body function and energy levels.',
      category: 'nutrition',
      source: 'Healthline',
      timestamp: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      title: 'Morning Exercise',
      description: 'Start your day with 15 minutes of light exercise to boost metabolism and improve mood.',
      category: 'exercise',
      source: 'WebMD',
      timestamp: '2024-01-15T09:30:00Z'
    },
    {
      id: '3',
      title: 'Mindfulness Practice',
      description: 'Practice 10 minutes of meditation daily to reduce stress and improve mental clarity.',
      category: 'mental',
      source: 'Mayo Clinic',
      timestamp: '2024-01-15T08:45:00Z'
    }
  ];

  const mockMedicationWarnings: MedicationWarning[] = [
    {
      id: '1',
      medication: 'Aspirin',
      warning: 'May cause stomach irritation. Take with food.',
      severity: 'medium',
      source: 'FDA'
    },
    {
      id: '2',
      medication: 'Ibuprofen',
      warning: 'Do not exceed 2400mg per day. May affect kidney function.',
      severity: 'high',
      source: 'FDA'
    },
    {
      id: '3',
      medication: 'Acetaminophen',
      warning: 'Avoid alcohol consumption while taking this medication.',
      severity: 'high',
      source: 'FDA'
    }
  ];

  const mockMoodEntries: MoodEntry[] = [
    {
      id: '1',
      mood: 'Happy',
      emoji: '😊',
      note: 'Feeling great after morning workout!',
      timestamp: '2024-01-15T07:00:00Z',
      xpEarned: 5
    },
    {
      id: '2',
      mood: 'Energetic',
      emoji: '⚡',
      note: 'Productive day at work',
      timestamp: '2024-01-14T18:00:00Z',
      xpEarned: 5
    },
    {
      id: '3',
      mood: 'Calm',
      emoji: '😌',
      note: 'Relaxing evening with meditation',
      timestamp: '2024-01-14T20:00:00Z',
      xpEarned: 5
    }
  ];

  const mockHealthLogs: HealthLog[] = [
    {
      id: '1',
      type: 'exercise',
      description: '30 minutes of cardio workout',
      timestamp: '2024-01-15T07:00:00Z',
      xpEarned: 10
    },
    {
      id: '2',
      type: 'medication',
      description: 'Took morning vitamins',
      timestamp: '2024-01-15T08:00:00Z',
      xpEarned: 5
    },
    {
      id: '3',
      type: 'feeling',
      description: 'Logged mood: Happy',
      timestamp: '2024-01-15T07:00:00Z',
      xpEarned: 5
    }
  ];

  const emojis = ['😊', '😄', '😌', '😴', '😢', '😠', '😰', '😍', '🤔', '😎', '⚡', '💪', '🧠', '❤️'];

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));

      setHealthTips(mockHealthTips);
      setMedicationWarnings(mockMedicationWarnings);
      setMoodEntries(mockMoodEntries);
      setHealthLogs(mockHealthLogs);

    } catch (err) {
      console.error('Error fetching health data:', err);
      setError('Failed to fetch health insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const handleLogMood = () => {
    if (newMood && selectedEmoji) {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: newMood,
        emoji: selectedEmoji,
        note: newMoodNote,
        timestamp: new Date().toISOString(),
        xpEarned: 5
      };
      
      setMoodEntries(prev => [newEntry, ...prev]);
      setTotalXP(prev => prev + 5);
      setNewMood('');
      setNewMoodNote('');
      setSelectedEmoji('😊');
      setShowMoodDialog(false);
    }
  };

  const handleLogHealth = (type: HealthLog['type'], description: string) => {
    const newLog: HealthLog = {
      id: Date.now().toString(),
      type,
      description,
      timestamp: new Date().toISOString(),
      xpEarned: type === 'exercise' ? 10 : 5
    };
    
    setHealthLogs(prev => [newLog, ...prev]);
    setTotalXP(prev => prev + newLog.xpEarned);
    setShowLogDialog(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return <HeartIcon sx={{ color: '#ff6b6b' }} />;
      case 'exercise': return <BodyIcon sx={{ color: '#2ed573' }} />;
      case 'mental': return <BrainIcon sx={{ color: '#0984e3' }} />;
      case 'sleep': return <EmojiIcon sx={{ color: '#fdcb6e' }} />;
      default: return <HealthIcon sx={{ color: '#00ffff' }} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nutrition': return '#ff6b6b';
      case 'exercise': return '#2ed573';
      case 'mental': return '#0984e3';
      case 'sleep': return '#fdcb6e';
      default: return '#00ffff';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#2ed573';
      case 'medium': return '#fdcb6e';
      case 'high': return '#ff6b6b';
      default: return '#b0b0b0';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise': return <BodyIcon sx={{ color: '#2ed573' }} />;
      case 'medication': return <MedicationIcon sx={{ color: '#fdcb6e' }} />;
      case 'feeling': return <EmojiIcon sx={{ color: '#0984e3' }} />;
      case 'symptom': return <WarningIcon sx={{ color: '#ff6b6b' }} />;
      default: return <HealthIcon sx={{ color: '#00ffff' }} />;
    }
  };

  if (error) {
    return (
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: '#00ffff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HealthIcon />
          Health Insights
        </Typography>
        <Alert 
          severity="error" 
          action={
            <IconButton color="inherit" size="small" onClick={fetchHealthData}>
              <RefreshIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" sx={{ color: '#00ffff', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HealthIcon />
          Health Insights Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 3 }}>
          Care Orchestrator - Comprehensive Health & Wellness Management
        </Typography>
        
        {/* Agent Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff6b6b', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <StarIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fdcb6e' }}>Health XP</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>{totalXP}</Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Level {level} Advanced</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={88} 
                  sx={{ mt: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <CheckCircleIcon sx={{ color: '#2ed573', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#2ed573' }}>Tasks Completed</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>85</Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>94% Success Rate</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #0984e3', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <BrainIcon sx={{ color: '#0984e3', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#0984e3' }}>Wellness Score</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>88%</Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Health Monitoring</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <TrendingUpIcon sx={{ color: '#fdcb6e', mr: 1 }} />
                  <Typography variant="h6" sx={{ color: '#fdcb6e' }}>Total Earnings</Typography>
                </Box>
                <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>$1,200</Typography>
                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>DMT Tokens</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress sx={{ color: '#00ffff' }} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Health Tips */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #2ed573', borderRadius: '12px', mb: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#2ed573', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesomeIcon />
                  Daily Health Tips
                </Typography>
                
                <List>
                  {healthTips.map((tip, index) => (
                    <React.Fragment key={tip.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getCategoryIcon(tip.category)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ color: '#ffffff' }}>
                              {tip.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                                {tip.description}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Chip 
                                  label={tip.category} 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: getCategoryColor(tip.category),
                                    color: '#000',
                                    fontSize: '0.7rem'
                                  }}
                                />
                                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                  {tip.source}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < healthTips.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Medication Warnings */}
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #ff6b6b', borderRadius: '12px' }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#ff6b6b', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon />
                  Medication Warnings
                </Typography>
                
                <List>
                  {medicationWarnings.map((warning, index) => (
                    <React.Fragment key={warning.id}>
                      <ListItem>
                        <ListItemIcon>
                          <MedicationIcon sx={{ color: getSeverityColor(warning.severity) }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ color: '#ffffff' }}>
                              {warning.medication}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                                {warning.warning}
                              </Typography>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Chip 
                                  label={warning.severity.toUpperCase()} 
                                  size="small" 
                                  sx={{ 
                                    backgroundColor: getSeverityColor(warning.severity),
                                    color: '#000',
                                    fontSize: '0.7rem'
                                  }}
                                />
                                <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                                  {warning.source}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < medicationWarnings.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Mood & Health Logs */}
          <Grid item xs={12} md={6}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #0984e3', borderRadius: '12px', mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h5" sx={{ color: '#0984e3', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmojiIcon />
                    Mood Tracker
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowMoodDialog(true)}
                    sx={{
                      backgroundColor: '#0984e3',
                      '&:hover': { backgroundColor: '#0770c7' }
                    }}
                  >
                    Log Feeling
                  </Button>
                </Box>
                
                <List>
                  {moodEntries.map((entry, index) => (
                    <React.Fragment key={entry.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Typography variant="h4">{entry.emoji}</Typography>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ color: '#ffffff' }}>
                              {entry.mood}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                                {entry.note}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fdcb6e' }}>
                                +{entry.xpEarned} XP • {new Date(entry.timestamp).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < moodEntries.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Health Logs */}
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '2px solid #fdcb6e', borderRadius: '12px' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h5" sx={{ color: '#fdcb6e', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HealthIcon />
                    Health Log
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setShowLogDialog(true)}
                    sx={{
                      backgroundColor: '#fdcb6e',
                      color: '#000',
                      '&:hover': { backgroundColor: '#f4c430' }
                    }}
                  >
                    Log Activity
                  </Button>
                </Box>
                
                <List>
                  {healthLogs.map((log, index) => (
                    <React.Fragment key={log.id}>
                      <ListItem>
                        <ListItemIcon>
                          {getTypeIcon(log.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ color: '#ffffff' }}>
                              {log.description}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                                {log.type.charAt(0).toUpperCase() + log.type.slice(1)} Activity
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#fdcb6e' }}>
                                +{log.xpEarned} XP • {new Date(log.timestamp).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < healthLogs.length - 1 && <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Mood Dialog */}
      <Dialog open={showMoodDialog} onClose={() => setShowMoodDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          Log Your Mood
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          <Box mt={2}>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
              How are you feeling?
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant={selectedEmoji === emoji ? 'contained' : 'outlined'}
                  onClick={() => setSelectedEmoji(emoji)}
                  sx={{
                    minWidth: 'auto',
                    fontSize: '1.5rem',
                    backgroundColor: selectedEmoji === emoji ? '#00ffff' : 'transparent',
                    borderColor: '#00ffff',
                    color: '#ffffff'
                  }}
                >
                  {emoji}
                </Button>
              ))}
            </Box>

            <TextField
              fullWidth
              label="Mood Description"
              value={newMood}
              onChange={(e) => setNewMood(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Additional Notes"
              value={newMoodNote}
              onChange={(e) => setNewMoodNote(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          <Button onClick={() => setShowMoodDialog(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleLogMood}
            sx={{ 
              backgroundColor: '#0984e3',
              color: '#ffffff',
              '&:hover': { backgroundColor: '#0770c7' }
            }}
          >
            Log Mood (+5 XP)
          </Button>
        </DialogActions>
      </Dialog>

      {/* Health Log Dialog */}
      <Dialog open={showLogDialog} onClose={() => setShowLogDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#00ffff', backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          Log Health Activity
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          <Box mt={2}>
            <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
              What did you do today?
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BodyIcon />}
                  onClick={() => handleLogHealth('exercise', 'Completed workout session')}
                  sx={{ borderColor: '#2ed573', color: '#2ed573' }}
                >
                  Exercise (+10 XP)
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<MedicationIcon />}
                  onClick={() => handleLogHealth('medication', 'Took prescribed medication')}
                  sx={{ borderColor: '#fdcb6e', color: '#fdcb6e' }}
                >
                  Medication (+5 XP)
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EmojiIcon />}
                  onClick={() => handleLogHealth('feeling', 'Logged daily mood')}
                  sx={{ borderColor: '#0984e3', color: '#0984e3' }}
                >
                  Feeling (+5 XP)
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<WarningIcon />}
                  onClick={() => handleLogHealth('symptom', 'Noted symptom observation')}
                  sx={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
                >
                  Symptom (+5 XP)
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: 'rgba(25, 25, 25, 0.95)' }}>
          <Button onClick={() => setShowLogDialog(false)} sx={{ color: '#b0b0b0' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box mt={3} textAlign="center">
        <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
          Health data sourced from trusted medical resources • Earn XP for logging activities
        </Typography>
      </Box>

      {/* Task Log */}
      <Box sx={{ mt: 4 }}>
        <TaskLog 
          agentId="agent-care" 
          agentName="Care Orchestrator"
          maxEntries={8}
        />
      </Box>
    </Box>
  );
};

export default HealthAgentInsights;
