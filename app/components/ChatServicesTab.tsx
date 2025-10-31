"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, Avatar, List, ListItem, ListItemAvatar, ListItemText, Paper, FormControlLabel, Switch } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { motion, AnimatePresence } from 'framer-motion';
import { Send as SendIcon, Security as SecurityIcon, SmartToy as SmartToyIcon, Hub as HubIcon } from '@mui/icons-material';
import { useGlobalState } from '../store/globalState';
import ChatService from '../services/chatService';
import { useWallet } from '@solana/wallet-adapter-react';
import AgentService from '../services/agentService'; // Added import for AgentService

const neonGlow = keyframes`
  0% { box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff; }
  50% { box-shadow: 0 0 20px #00ffff, 0 0 30px #00ffff; }
  100% { box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff; }
`;

const GlassmorphicPaper = styled(Paper)({
  background: 'rgba(10, 25, 41, 0.7)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(0, 255, 255, 0.3)',
  borderRadius: '16px',
  color: 'white',
  padding: '24px',
});

const mockServices = [
    { name: 'AI-Powered ZKP Encryption', description: 'Secure your data with zero-knowledge proof encryption.', icon: <SecurityIcon />, enabled: true },
    { name: 'Decentralized Identity (DID)', description: 'Manage your digital identity across the blockchain.', icon: <HubIcon />, enabled: false },
    { name: 'Smart Contract Auditing', description: 'Audit your smart contracts for vulnerabilities using AI.', icon: <SmartToyIcon />, enabled: true },
];

const ChatServicesTab = () => {
    const [newMessage, setNewMessage] = useState('');
    const [services, setServices] = useState(mockServices);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const { publicKey, connected } = useWallet();

    // Use global state for chat messages and user data
    const { chatMessages, addChatMessage, stakingPositions, agents, proposals } = useGlobalState();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Load chat history on mount
    useEffect(() => {
        if (connected && publicKey) {
            const userId = publicKey.toBase58();
            const chatService = ChatService.getInstance();
            
            const loadChatHistory = async () => {
                try {
                    const history = await chatService.getChatHistory(userId);
                    // Convert Firebase format to chat message format
                    history.forEach(msg => {
                        const chatMsg = {
                            id: msg.id,
                            text: msg.message,
                            sender: 'user',
                            timestamp: msg.timestamp.toISOString(),
                        };
                        addChatMessage(chatMsg);
                        
                        const aiMsg = {
                            id: `${msg.id}-ai`,
                            text: msg.response,
                            sender: 'ai',
                            timestamp: msg.timestamp.toISOString(),
                        };
                        addChatMessage(aiMsg);
                    });
                } catch (error) {
                    console.error('Failed to load chat history:', error);
                }
            };
            
            loadChatHistory();
        }
    }, [connected, publicKey]);

    const handleSendMessage = async () => {
        try {
        if (!newMessage.trim()) return;
            if (!connected || !publicKey) {
                alert('Please connect your wallet to use chat');
                return;
            }

            const userId = publicKey.toBase58();
            const chatService = ChatService.getInstance();
            const agentService = AgentService; // Use default export

        const userMessage = {
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toISOString(),
        };

        // Add user message to chat
        addChatMessage(userMessage);
        setNewMessage('');

            // Generate AI response using user's agents
        let aiResponse = '';
        const message = newMessage.toLowerCase();

            try {
                // Check if user has any agents
                if (agents.length === 0) {
                    aiResponse = `🤖 Welcome to DecentraMind! 

I notice you don't have any AI agents yet. Here's how to get started:

🎯 **Create Your First Agent:**
• Go to "Agent Minting & Management" tab
• Choose a domain (Productivity, Learning, Health & Wellness, etc.)
• Select a personality type
• Mint your agent for 150 DMT

💡 **Agent Benefits:**
• Personalized AI assistance
• Domain-specific expertise
• XP earning and evolution
• NFT ownership

🚀 **Quick Start:**
• "Create a productivity agent" - For task management
• "Create a learning agent" - For education and skills
• "Create a health agent" - For wellness and fitness

Would you like me to guide you through creating your first agent?`;
                } else {
                    // Check if user has a Master Agent
                    const masterAgentResult = await agentService.getMasterAgent(userId);
                    
                    if (masterAgentResult.success && masterAgentResult.masterAgent) {
                        // Use Master Agent for coordinated response
                        const coordinationResult = await agentService.coordinateAgents(userId, newMessage);
                        if (coordinationResult.success) {
                            aiResponse = coordinationResult.response || 'Master Agent coordination failed';
                        } else {
                            // Fallback to individual agent selection
                            const activeAgents = agents.filter(agent => agent.status === 'active');
                            if (activeAgents.length > 0) {
                                let selectedAgent = activeAgents[0];
                                
                                // Choose agent based on message content and agent domain
                                if (message.includes('learn') || message.includes('education') || message.includes('study')) {
                                    const learningAgent = activeAgents.find(agent => 
                                        agent.domain?.toLowerCase().includes('learning') || 
                                        agent.domain?.toLowerCase().includes('educational')
                                    );
                                    if (learningAgent) selectedAgent = learningAgent;
                                } else if (message.includes('health') || message.includes('fitness') || message.includes('wellness')) {
                                    const healthAgent = activeAgents.find(agent => 
                                        agent.domain?.toLowerCase().includes('health') || 
                                        agent.domain?.toLowerCase().includes('wellness')
                                    );
                                    if (healthAgent) selectedAgent = healthAgent;
                                } else if (message.includes('creative') || message.includes('art') || message.includes('design')) {
                                    const creativeAgent = activeAgents.find(agent => 
                                        agent.domain?.toLowerCase().includes('creative')
                                    );
                                    if (creativeAgent) selectedAgent = creativeAgent;
                                } else if (message.includes('technical') || message.includes('code') || message.includes('development')) {
                                    const technicalAgent = activeAgents.find(agent => 
                                        agent.domain?.toLowerCase().includes('technical')
                                    );
                                    if (technicalAgent) selectedAgent = technicalAgent;
                                } else if (message.includes('business') || message.includes('marketing') || message.includes('finance')) {
                                    const businessAgent = activeAgents.find(agent => 
                                        agent.domain?.toLowerCase().includes('business')
                                    );
                                    if (businessAgent) selectedAgent = businessAgent;
                                }

                                aiResponse = generateAgentResponse(selectedAgent, message, activeAgents);
                            } else {
                                aiResponse = `I see you have ${agents.length} agents, but they're not currently active. Would you like to activate them to get personalized assistance?`;
                            }
                        }
                    } else {
                        // Use individual agent selection (existing logic)
                        const activeAgents = agents.filter(agent => agent.status === 'active');
                        
                        if (activeAgents.length === 0) {
                            aiResponse = `I see you have ${agents.length} agents, but they're not currently active. Would you like to activate them to get personalized assistance?`;
                        } else {
                            // Select the most appropriate agent based on the message content
                            let selectedAgent = activeAgents[0]; // Default to first agent
                            
                            // Choose agent based on message content and agent domain
                            if (message.includes('learn') || message.includes('education') || message.includes('study')) {
                                const learningAgent = activeAgents.find(agent => 
                                    agent.domain?.toLowerCase().includes('learning') || 
                                    agent.domain?.toLowerCase().includes('educational')
                                );
                                if (learningAgent) selectedAgent = learningAgent;
                            } else if (message.includes('health') || message.includes('fitness') || message.includes('wellness')) {
                                const healthAgent = activeAgents.find(agent => 
                                    agent.domain?.toLowerCase().includes('health') || 
                                    agent.domain?.toLowerCase().includes('wellness')
                                );
                                if (healthAgent) selectedAgent = healthAgent;
                            } else if (message.includes('creative') || message.includes('art') || message.includes('design')) {
                                const creativeAgent = activeAgents.find(agent => 
                                    agent.domain?.toLowerCase().includes('creative')
                                );
                                if (creativeAgent) selectedAgent = creativeAgent;
                            } else if (message.includes('technical') || message.includes('code') || message.includes('development')) {
                                const technicalAgent = activeAgents.find(agent => 
                                    agent.domain?.toLowerCase().includes('technical')
                                );
                                if (technicalAgent) selectedAgent = technicalAgent;
                            } else if (message.includes('business') || message.includes('marketing') || message.includes('finance')) {
                                const businessAgent = activeAgents.find(agent => 
                                    agent.domain?.toLowerCase().includes('business')
                                );
                                if (businessAgent) selectedAgent = businessAgent;
                            }

                            // Generate personalized response based on the selected agent
                            aiResponse = generateAgentResponse(selectedAgent, message, activeAgents);
                        }
                    }
                }
            } catch (agentError) {
                console.error('Agent coordination error:', agentError);
                // Fallback response if agent coordination fails
                aiResponse = `🤖 Hello! I'm here to help you with DecentraMind.

I'm experiencing some technical difficulties with my specialized agents right now, but I can still assist you with:

💡 **General Help:**
• Creating new AI agents
• Managing your existing agents
• Understanding the platform features
• Getting started with DecentraMind

🎯 **Quick Actions:**
• "Create an agent" - Mint new AI agents
• "Check my agents" - View your agent collection
• "Learn about features" - Explore platform capabilities

Would you like me to help you with any of these topics?`;
        }

        const aiMessage = {
            text: aiResponse,
            sender: 'ai',
            timestamp: new Date().toISOString(),
        };

            // Save to Firebase (with error handling)
            try {
                await chatService.saveMessage(userId, newMessage, aiResponse, {
                    agentId: agents.length > 0 ? agents[0].id : null,
                    agentName: agents.length > 0 ? agents[0].name : 'System',
                    domain: agents.length > 0 ? agents[0].domain : 'General'
                });
            } catch (firebaseError) {
                console.error('Failed to save chat message to Firebase:', firebaseError);
                // Continue even if Firebase save fails
            }

        // Add AI response to chat
            addChatMessage(aiMessage);
        } catch (error) {
            console.error('Chat error:', error);
            // Provide a helpful error message instead of alert
            const errorMessage = {
                text: `🤖 I apologize, but I'm experiencing some technical difficulties right now. 

Please try:
• Refreshing the page
• Checking your wallet connection
• Trying again in a moment

If the problem persists, you can still use other features like agent minting and management.`,
                sender: 'ai',
                timestamp: new Date().toISOString(),
            };
            addChatMessage(errorMessage);
        }
    };

    // Function to generate personalized agent responses
    const generateAgentResponse = (agent: any, message: string, allAgents: any[]) => {
        const agentName = agent.name || 'Your Agent';
        const agentDomain = agent.domain || 'General';
        const agentLevel = agent.level || 1;
        const agentXP = agent.xp || 0;
        const agentPersonality = agent.personality || 'Balanced';

        // Generate domain-specific responses
        if (agentDomain.toLowerCase().includes('learning') || agentDomain.toLowerCase().includes('educational')) {
            if (message.includes('german') || message.includes('learn german')) {
                return `🇩🇪 ${agentName} - German Learning Specialist (Level ${agentLevel})

📚 Learning Path for You:
• Basic greetings and introductions
• Numbers 1-20 and counting
• Common phrases and expressions
• Grammar fundamentals

🎯 Interactive Session:
• Pronunciation practice with ${agentName}
• Vocabulary building exercises
• Real conversation scenarios
• Progress tracking

⏱️ Session Duration: 15 minutes
💡 Agent Tip: Practice daily for best results!
🎮 XP Earned: +5 XP for this session

Would you like to start with basic greetings or focus on a specific topic?`;
            } else if (message.includes('spanish') || message.includes('learn spanish')) {
                return `🇪🇸 ${agentName} - Spanish Learning Specialist (Level ${agentLevel})

📚 Learning Path for You:
• Basic greetings (Hola, Buenos días)
• Numbers 1-20 and counting
• Common phrases and expressions
• Grammar fundamentals

🎯 Interactive Session:
• Pronunciation practice with ${agentName}
• Vocabulary building exercises
• Real conversation scenarios
• Progress tracking

⏱️ Session Duration: 15 minutes
💡 Agent Tip: Practice daily for best results!
🎮 XP Earned: +5 XP for this session`;
            } else if (message.includes('french') || message.includes('learn french')) {
                return `🇫🇷 ${agentName} - French Learning Specialist (Level ${agentLevel})

📚 Learning Path for You:
• Basic greetings (Bonjour, Salut)
• Numbers 1-20 and counting
• Common phrases and expressions
• Grammar fundamentals

🎯 Interactive Session:
• Pronunciation practice with ${agentName}
• Vocabulary building exercises
• Real conversation scenarios
• Progress tracking

⏱️ Session Duration: 15 minutes
💡 Agent Tip: Practice daily for best results!
🎮 XP Earned: +5 XP for this session`;
            } else {
                return `📚 ${agentName} - Learning Specialist (Level ${agentLevel})

I'm here to help you with your learning journey! Here's what I can assist with:

🎯 Available Learning Areas:
• Language learning (German, Spanish, French, etc.)
• Technical skills (Programming, Design, etc.)
• Academic subjects (Math, Science, History, etc.)
• Professional development (Business, Marketing, etc.)

💡 My Specialties:
• Personalized learning paths
• Interactive exercises
• Progress tracking
• Study techniques

🎮 Current Stats:
• Level: ${agentLevel}
• XP: ${agentXP}
• Personality: ${agentPersonality}

What would you like to learn today?`;
            }
        } else if (agentDomain.toLowerCase().includes('health') || agentDomain.toLowerCase().includes('wellness')) {
            return `🏥 ${agentName} - Health & Wellness Specialist (Level ${agentLevel})

I'm here to support your health and wellness journey! Here's how I can help:

🎯 Wellness Areas:
• Fitness and exercise planning
• Nutrition and meal planning
• Mental health and mindfulness
• Sleep optimization
• Stress management

💡 My Specialties:
• Personalized wellness plans
• Progress tracking
• Motivational support
• Health education

🎮 Current Stats:
• Level: ${agentLevel}
• XP: ${agentXP}
• Personality: ${agentPersonality}

What aspect of your health would you like to focus on today?`;
        } else if (agentDomain.toLowerCase().includes('creative')) {
            return `🎨 ${agentName} - Creative Specialist (Level ${agentLevel})

I'm here to unleash your creativity! Here's what I can help with:

🎯 Creative Areas:
• Art and design projects
• Writing and content creation
• Music and audio production
• Photography and videography
• Creative problem solving

💡 My Specialties:
• Brainstorming sessions
• Design inspiration
• Creative techniques
• Project collaboration

🎮 Current Stats:
• Level: ${agentLevel}
• XP: ${agentXP}
• Personality: ${agentPersonality}

What creative project would you like to work on today?`;
        } else if (agentDomain.toLowerCase().includes('technical')) {
            return `💻 ${agentName} - Technical Specialist (Level ${agentLevel})

I'm here to help with your technical projects! Here's what I can assist with:

🎯 Technical Areas:
• Programming and development
• System architecture
• Data analysis
• Cybersecurity
• Technical documentation

💡 My Specialties:
• Code review and optimization
• Problem solving
• Technical guidance
• Best practices

🎮 Current Stats:
• Level: ${agentLevel}
• XP: ${agentXP}
• Personality: ${agentPersonality}

What technical challenge would you like to tackle today?`;
        } else if (agentDomain.toLowerCase().includes('business')) {
            return `💼 ${agentName} - Business Specialist (Level ${agentLevel})

I'm here to help with your business goals! Here's what I can assist with:

🎯 Business Areas:
• Marketing and branding
• Financial planning
• Strategy development
• Market analysis
• Business operations

💡 My Specialties:
• Strategic planning
• Market research
• Financial analysis
• Growth strategies

🎮 Current Stats:
• Level: ${agentLevel}
• XP: ${agentXP}
• Personality: ${agentPersonality}

What business objective would you like to work on today?`;
        } else {
            // General response for other domains
            return `🤖 ${agentName} - ${agentDomain} Specialist (Level ${agentLevel})

I'm your personalized AI assistant specializing in ${agentDomain}! Here's how I can help:

🎯 My Expertise:
• Domain-specific knowledge
• Personalized assistance
• Problem solving
• Skill development

💡 My Specialties:
• Custom solutions
• Expert guidance
• Progress tracking
• Continuous learning

🎮 Current Stats:
• Level: ${agentLevel}
• XP: ${agentXP}
• Personality: ${agentPersonality}

How can I assist you with your ${agentDomain.toLowerCase()} goals today?`;
        }
    };

    const handleToggleService = (index: number) => {
        const newServices = [...services];
        newServices[index].enabled = !newServices[index].enabled;
        setServices(newServices);
    };

    return (
        <Box>
            <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold', mb: 3, textShadow: '0 0 8px #00ffff' }}>
                Chat & Services Hub
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <GlassmorphicPaper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>AI Agent Chat</Typography>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
                            <AnimatePresence>
                                {chatMessages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        layout
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -30 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar src={msg.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText 
                                                primary={msg.sender} 
                                                secondary={msg.text} 
                                                primaryTypographyProps={{ color: msg.sender === 'user' ? '#2ed573' : '#00ffff' }}
                                                secondaryTypographyProps={{ color: 'rgba(255, 255, 255, 0.8)' }}
                                            />
                                        </ListItem>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={chatEndRef} />
                        </Box>
                        <Box sx={{ display: 'flex', pt: 2, borderTop: '1px solid rgba(0, 255, 255, 0.3)' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Type your message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#00ffff' },
                                        '&:hover fieldset': { borderColor: '#2ed573' },
                                    },
                                    input: { color: 'white' },
                                }}
                            />
                            <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 1, background: `linear-gradient(45deg, #00ffff, #2ed573)`, animation: `${neonGlow} 3s infinite` }}>
                                <SendIcon />
                            </Button>
                        </Box>
                    </GlassmorphicPaper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <GlassmorphicPaper sx={{ height: '70vh' }}>
                        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>AI & Blockchain Security Services</Typography>
                        <List>
                            {services.map((service, index) => (
                                <ListItem key={index}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ background: 'transparent' }}>
                                            {React.cloneElement(service.icon, { sx: { color: service.enabled ? '#2ed573' : 'grey' } })}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={service.name} secondary={service.description} />
                                    <FormControlLabel
                                        control={<Switch checked={service.enabled} onChange={() => handleToggleService(index)} />}
                                        label={service.enabled ? 'Active' : 'Inactive'}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </GlassmorphicPaper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChatServicesTab; 