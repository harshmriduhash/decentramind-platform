'use client';
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, LinearProgress, Paper, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { EmojiEvents as EmojiEventsIcon, Star as StarIcon, MonetizationOn as MonetizationOnIcon, Whatshot as WhatshotIcon } from '@mui/icons-material';

const mockRewards = {
  totalDMT: 1250.75,
  totalDMTX: 50.2,
  dailyGoal: 100,
  currentProgress: 75,
  streak: 12,
  achievements: [
    { name: 'Power User', description: 'Mint 10 agents', unlocked: true, icon: <StarIcon /> },
    { name: 'Security Pro', description: 'Enable all security features', unlocked: true, icon: <StarIcon /> },
    { name: 'DAO Participant', description: 'Vote on a proposal', unlocked: false, icon: <StarIcon /> },
    { name: 'Top Earner', description: 'Earn 1000 DMT in a week', unlocked: true, icon: <StarIcon /> },
  ],
};

const RewardsDashboard = () => {
  const dailyGoalProgress = (mockRewards.currentProgress / mockRewards.dailyGoal) * 100;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ color: '#ff4757', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          <EmojiEventsIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 1 }} />
          Rewards & Achievements
        </Typography>

        <Grid container spacing={4}>
          {/* Earnings */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: 'rgba(25, 25, 25, 0.9)', border: '1px solid #ff4757', borderRadius: 3, color: 'white', textAlign: 'center' }}>
              <MonetizationOnIcon sx={{ fontSize: 60, color: '#ff4757', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Total Earnings</Typography>
              <Typography variant="h3" sx={{ color: '#ff4757', fontWeight: 'bold', my: 1 }}>{mockRewards.totalDMT.toLocaleString()} DMT</Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>{mockRewards.totalDMTX.toLocaleString()} DMTX (Governance)</Typography>
            </Paper>
          </Grid>

          {/* Daily Goal & Streak */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: 'rgba(25, 25, 25, 0.9)', border: '1px solid #ff4757', borderRadius: 3, color: 'white', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WhatshotIcon sx={{ fontSize: 40, color: '#ff4757', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Daily Streak: {mockRewards.streak} Days</Typography>
              </Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Daily DMT Goal: {mockRewards.currentProgress} / {mockRewards.dailyGoal}</Typography>
              <LinearProgress variant="determinate" value={dailyGoalProgress} sx={{ height: 10, borderRadius: 5, '& .MuiLinearProgress-bar': { backgroundColor: '#ff4757' } }} />
            </Paper>
          </Grid>

          {/* Achievements */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>Achievements</Typography>
            <Paper sx={{ p: 2, background: 'rgba(25, 25, 25, 0.9)', border: '1px solid #ff4757', borderRadius: 3 }}>
              <List>
                {mockRewards.achievements.map((ach, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItem sx={{ opacity: ach.unlocked ? 1 : 0.5 }}>
                      <ListItemIcon sx={{ color: ach.unlocked ? '#ff4757' : 'grey' }}>
                        {ach.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={ach.name}
                        secondary={ach.description}
                        primaryTypographyProps={{ fontWeight: 'bold', color: 'white' }}
                        secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.7)' }}
                      />
                    </ListItem>
                    {index < mockRewards.achievements.length - 1 && <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />}
                  </motion.div>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </motion.div>
  );
};

export default RewardsDashboard; 