'use client';
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import { Brain as BrainIcon, MessageCircle as MessageCircleIcon, Activity as ActivityIcon } from 'lucide-react';

const mockAgents = [
    { id: 'master-001', name: 'VisionSync', avatar: '/master-agent.png', isMaster: true },
    { id: 'sub-001', name: 'DevOps Dynamo', avatar: '/sub-agent-1.png', isMaster: false, masterId: 'master-001' },
    { id: 'sub-002', name: 'Data Weaver', avatar: '/sub-agent-2.png', isMaster: false, masterId: 'master-001' },
];

const mockChatHistory = {
    'sub-001': [
        { sender: 'user', message: 'What\'s the status on the CI/CD pipeline?', timestamp: '10:00 AM' },
        { sender: 'agent', message: 'The pipeline is running smoothly. All tests passed.', timestamp: '10:01 AM' },
    ],
    'sub-002': [
        { sender: 'user', message: 'Can you pull the latest sales data?', timestamp: '10:05 AM' },
        { sender: 'agent', message: 'Sure, I\'ve compiled the Q3 sales report. It\'s ready for review.', timestamp: '10:06 AM' },
    ],
};

const mockActivityLogs = {
    'master-001': [
        { activity: 'Delegated task "Optimize Database" to DevOps Dynamo.', timestamp: '9:30 AM' },
        { activity: 'Synthesized reports from Data Weaver.', timestamp: '11:00 AM' },
    ],
    'sub-001': [
        { activity: 'Completed task: "Deploy staging environment".', timestamp: '9:00 AM' },
        { activity: 'Initiated security scan.', timestamp: '10:30 AM' },
    ],
};


const AgentChatHistory = () => {
    const [selectedAgent, setSelectedAgent] = useState(mockAgents[0]);
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card sx={{ background: 'rgba(25, 25, 25, 0.9)', border: '1px solid #00ffff', borderRadius: 3, p: 3 }}>
                <CardContent>
                    <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3 }}>
                        <BrainIcon style={{ marginRight: '10px' }} />
                        Agent Comms & Activity Hub
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ background: 'rgba(35, 35, 35, 0.8)', p: 2, height: '100%' }}>
                                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Agents</Typography>
                                <List>
                                    {mockAgents.map(agent => (
                                        <ListItem
                                            key={agent.id}
                                            button
                                            onClick={() => setSelectedAgent(agent)}
                                            sx={{ 
                                                mb: 1, 
                                                borderRadius: 2,
                                                border: selectedAgent.id === agent.id ? '2px solid #00ffff' : '2px solid transparent',
                                                backgroundColor: selectedAgent.id === agent.id ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={agent.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText primary={agent.name} secondary={agent.isMaster ? 'Master Agent' : 'Sub-Agent'} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8}>
                             <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="agent data tabs">
                                    <Tab label="Chat History" icon={<MessageCircleIcon />} iconPosition="start" />
                                    <Tab label="Activity Log" icon={<ActivityIcon />} iconPosition="start" />
                                </Tabs>
                            </Box>
                            {selectedAgent && !selectedAgent.isMaster && tabIndex === 0 && (
                                <Box sx={{ mt: 2 }}>
                                    {mockChatHistory[selectedAgent.id as keyof typeof mockChatHistory]?.map((chat, index) => (
                                        <Box key={index} sx={{ my: 1, p: 1, borderRadius: 2, background: chat.sender === 'user' ? 'rgba(0, 100, 100, 0.3)' : 'rgba(50, 50, 50, 0.5)' }}>
                                            <Typography variant="body2" sx={{color: 'white'}}><b>{chat.sender}:</b> {chat.message}</Typography>
                                            <Typography variant="caption" color="text.secondary">{chat.timestamp}</Typography>
                                        </Box>
                                    )) || <Typography sx={{color: 'white'}}>No chat history for this agent.</Typography>}
                                </Box>
                            )}
                             {tabIndex === 1 && (
                                <Box sx={{ mt: 2 }}>
                                    {mockActivityLogs[selectedAgent.id as keyof typeof mockActivityLogs]?.map((log, index) => (
                                        <Box key={index} sx={{ my: 1, p: 1, borderRadius: 2, background: 'rgba(50, 50, 50, 0.5)' }}>
                                             <Typography variant="body2" sx={{color: 'white'}}>{log.activity}</Typography>
                                            <Typography variant="caption" color="text.secondary">{log.timestamp}</Typography>
                                        </Box>
                                    )) || <Typography sx={{color: 'white'}}>No activity logs for this agent.</Typography>}
                                </Box>
                            )}
                            {selectedAgent && selectedAgent.isMaster && tabIndex === 0 && (
                                <Typography sx={{color: 'white', mt: 2}}>Select a Sub-Agent to view chat history.</Typography>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AgentChatHistory; 