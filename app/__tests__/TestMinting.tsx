"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Badge,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Psychology as BrainIcon,
  School as EducationIcon,
  FitnessCenter as HealthIcon,
  Brush as CreativeIcon,
  Code as TechIcon,
  Business as BusinessIcon,
  Science as ScienceIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Assignment as TaskIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  AutoAwesome as AutoAwesomeIcon,
  Token as TokenIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Memory as MemoryIcon,
  EmojiEvents as CrownIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Stop as StopIcon,
  Store as StoreIcon,
  Analytics as AnalyticsIcon,
  Group as GroupIcon,
  AccountBalance as AccountBalanceIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import agentService, { Agent, MintingResult } from '../services/agentService';
import solanaService, { TransactionResult } from '../services/solanaService';
import { SolanaWalletService } from '../services/solanaWalletService';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '../hooks/useAuth';
import { AuthGuard, AgentMintingGuard, AgentEvolutionGuard } from './AuthGuard';
import { SessionStatus } from './SessionStatus';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { useToast } from './ToastNotifications';
import AgentUpgradeModal from './AgentUpgradeModal';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const TestMinting: React.FC = () => {
  const { publicKey, connected, signTransaction } = useWallet();
  const { session, checkPermissions } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const [showMintDialog, setShowMintDialog] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [agentDescription, setAgentDescription] = useState('');
  const [agentPersonality, setAgentPersonality] = useState('');
  const [mintCost, setMintCost] = useState(100);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [mintedAgents, setMintedAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [mintingResult, setMintingResult] = useState<MintingResult | null>(null);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [editAgentName, setEditAgentName] = useState('');
  const [editAgentDescription, setEditAgentDescription] = useState('');
  const [upgradeCost, setUpgradeCost] = useState(0);
  const [showAgentUpgradeModal, setShowAgentUpgradeModal] = useState(false);
  const [showMasterAgentDialog, setShowMasterAgentDialog] = useState(false);
  const [coordinationTask, setCoordinationTask] = useState('');
  const [coordinationResponse, setCoordinationResponse] = useState('');
  const [selectedAgentType, setSelectedAgentType] = useState<'master' | 'sub'>('master');
  
  // Direct Sub-Agent Interaction States
  const [showSubAgentChat, setShowSubAgentChat] = useState(false);
  const [selectedSubAgent, setSelectedSubAgent] = useState<Agent | null>(null);
  const [subAgentMessage, setSubAgentMessage] = useState('');
  const [subAgentResponse, setSubAgentResponse] = useState('');
  const [subAgentChatHistory, setSubAgentChatHistory] = useState<Array<{role: 'user' | 'agent', message: string}>>([]);
  
  // Voice system state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<string>('default');
  const recognition = useRef<any>(null);
  const speechSynthesis = useRef<any>(null);

  // Enhanced architecture state
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAgentOrchestrator, setShowAgentOrchestrator] = useState(false);
  const [agentListings, setAgentListings] = useState<any[]>([]);
  const [agentAnalytics, setAgentAnalytics] = useState<any>(null);
  const [orchestrationTask, setOrchestrationTask] = useState('');
  const [orchestrationResult, setOrchestrationResult] = useState('');
  const [activeTab, setActiveTab] = useState<'agents' | 'marketplace' | 'analytics' | 'orchestrator'>('agents');
  
  // Monetization and evolution system
  const [evolutionProgress, setEvolutionProgress] = useState<{[key: string]: number}>({});
  const [monetizationStats, setMonetizationStats] = useState({
    totalRevenue: 0,
    upgradesSold: 0,
    agentsTraded: 0,
    monthlyRevenue: 0
  });

  // Evolution system state
  const [evolutionInfo, setEvolutionInfo] = useState<any>(null);
  const [showEvolutionDialog, setShowEvolutionDialog] = useState(false);
  const [selectedAgentForEvolution, setSelectedAgentForEvolution] = useState<Agent | null>(null);
  const [dmtAmount, setDmtAmount] = useState(0);

  // Individual agent details state
  const [selectedAgentDetails, setSelectedAgentDetails] = useState<Agent | null>(null);
  const [showAgentDetails, setShowAgentDetails] = useState(false);

  // Enhanced delegation state
  const [delegationTask, setDelegationTask] = useState('');
  const [selectedMasterAgent, setSelectedMasterAgent] = useState<Agent | null>(null);
  const [selectedSubAgents, setSelectedSubAgents] = useState<Agent[]>([]);
  const [showDelegationDialog, setShowDelegationDialog] = useState(false);
  const [delegationResult, setDelegationResult] = useState('');
  const [suggestedNewAgent, setSuggestedNewAgent] = useState<{domain: string, type: 'master' | 'sub'} | null>(null);

  const domains = agentService.getAvailableDomains().map(domain => ({
    name: domain.name,
    icon: <TaskIcon />, // We'll use a generic icon for now
    color: domain.color,
    cost: domain.cost
  }));

  const personalities = agentService.getAvailablePersonalities();

  // Load agents function
  const loadAgents = async () => {
    if (connected && publicKey) {
      setLoading(true);
      try {
        console.log('Loading agents for wallet:', publicKey.toBase58());
        
        // Load ALL agents first (for debugging)
        const allAgents = await agentService.getAgents();
        console.log('All agents from service:', allAgents);
        
        // Filter for user agents - only wallet addresses are valid
        const walletAddress = publicKey.toBase58();
        const userAgents = allAgents.filter(agent => {
          // Only show agents owned by the current wallet
          return agent.owner === walletAddress;
        });
        console.log('User agents:', userAgents);
        
        // If no agents found, create some test agents
        if (userAgents.length === 0) {
          console.log('No agents found, creating test agents...');
          await createTestAgents();
          // Reload agents after creating test ones
          const updatedAgents = await agentService.getAgents();
                    const updatedUserAgents = updatedAgents.filter(agent =>
            agent.owner === walletAddress
          );
          setMintedAgents(updatedUserAgents);
        } else {
          // Add type field to existing agents that don't have it
          const processedAgents = userAgents.map(agent => {
            if (!agent.type) {
              // Determine type based on existing properties
              if (agent.domain === 'Master' || agent.domain === 'Master Coordinator' || agent.capabilities) {
                return { ...agent, type: 'master' };
              } else {
                return { ...agent, type: 'sub' };
              }
            }
            return agent;
          });
          
          console.log('Processed agents:', processedAgents);
          setMintedAgents(processedAgents as Agent[]);
        }
      } catch (error) {
        console.error('Failed to load agents:', error);
        showError('Failed to load agents');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Wallet not connected, cannot load agents');
    }
  };



  // Consolidated useEffect for initialization
  useEffect(() => {
    const initializeServices = async () => {
      if (connected && publicKey) {
        setWalletConnected(true);
        
        // Initialize agent service
        await agentService.initialize();
        loadAgents();
        
        initializeVoiceSystem(); // Initialize voice system
        
        // Initialize solana service
        const walletState = {
        publicKey,
        connected,
        signTransaction,
        sendTransaction: async (transaction: any, connection: any) => {
          // Mock transaction for development
          console.log('Mock transaction sent:', transaction);
          return 'mock-signature-' + Date.now();
        },
        signAllTransactions: async (transactions: any[]) => {
          return transactions.map(tx => tx); // Mock implementation
        },
        signMessage: async (message: Uint8Array) => {
          return new Uint8Array(); // Mock implementation
        },
        disconnect: () => {},
        select: () => {},
        wallet: null,
        connecting: false,
        disconnecting: false
      };
      
      solanaService.initialize(walletState as any, WalletAdapterNetwork.Devnet);
    } else {
      setWalletConnected(false);
      setMintedAgents([]);
    }
    };
    
    initializeServices();
  }, [connected, publicKey, signTransaction]);

  const handleCreateMasterAgent = async () => {
    try {
      if (!connected || !publicKey) {
        showError('Please connect your wallet first');
        return;
      }

      const userId = publicKey.toBase58();
      const masterAgentData = {
        name: 'Master Agent',
        domain: 'Master Coordinator',
        personality: 'Coordinator'
      };
      const result = await agentService.createMasterAgent(userId, masterAgentData);
      
      if (result.success) {
        showSuccess('Master Agent created successfully!');
        await loadAgents();
      } else {
        showError(`Failed to create Master Agent: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating master agent:', error);
      showError('Failed to create Master Agent');
    }
  };

  const handleEvolveMasterAgent = async (agentId?: string) => {
    try {
      if (!connected || !publicKey) {
        showError('Please connect your wallet first');
        return;
      }

      const userId = publicKey.toBase58();
      const result = await agentService.evolveMasterAgent(userId, agentId);
      
      if (result.success && result.evolutionDetails) {
        const details = result.evolutionDetails;
        const evolutionMessage = `🚀 **${details.reason}**
        
📊 **Evolution Details:**
• Level: ${details.newLevel - details.levelGained} → ${details.newLevel} (+${details.levelGained})
• XP: +${details.xpGained} XP
• New Capabilities: ${details.newCapabilities.slice(-1)[0] || 'Enhanced performance'}
• Evolution Stage: ${details.newStage}

💡 **What Changed**: ${details.reason}`;
        
        showSuccess(evolutionMessage);
        await loadAgents();
      } else {
        showError(`Failed to evolve agent: ${result.error}`);
      }
    } catch (error) {
      console.error('Error evolving agent:', error);
      showError('Failed to evolve agent');
    }
  };

  const handleCoordinateAgents = async () => {
    if (!coordinationTask.trim()) {
      showError('Please enter a task for coordination');
      return;
    }

    try {
      if (!connected || !publicKey) {
        showError('Please connect your wallet first');
        return;
      }

      const userId = publicKey.toBase58();
      const result = await agentService.coordinateAgents(userId, coordinationTask);
      
      if (result.success && result.response) {
        setCoordinationResponse(result.response);
        
        // Show success message with coordination summary
        const lines = result.response.split('\n');
        const summary = lines.slice(0, 3).join('\n');
        showSuccess(`🤖 Coordination successful!\n\n${summary}`);
        
        if (voiceEnabled) {
          speakText('Agent coordination completed successfully', 'Master Agent');
        }
      } else {
        showError(`Coordination failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error coordinating agents:', error);
      showError('Failed to coordinate agents');
    }
  };

  // Direct Sub-Agent Interaction Functions
  const handleOpenSubAgentChat = (agent: Agent) => {
    setSelectedSubAgent(agent);
    setShowSubAgentChat(true);
    setSubAgentChatHistory([]);
    setSubAgentResponse('');
  };

  const handleSendMessageToSubAgent = async () => {
    if (!selectedSubAgent || !subAgentMessage.trim()) return;
    
    try {
      setLoading(true);
      
      // Add user message to chat history
      const userMessage = { role: 'user' as const, message: subAgentMessage };
      setSubAgentChatHistory(prev => [...prev, userMessage]);
      
      // Generate agent response
      const response = await generateSubAgentResponse(selectedSubAgent, subAgentMessage);
      
      // Add agent response to chat history
      const agentMessage = { role: 'agent' as const, message: response };
      setSubAgentChatHistory(prev => [...prev, agentMessage]);
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        // Extract just the text content for speech (remove markdown formatting)
        const cleanText = response.replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
                                 .replace(/💚|🤖|🎓|🎨|⚙️|💼|🔬/g, '') // Remove emojis
                                 .replace(/\n\n/g, '. ') // Replace double newlines with periods
                                 .replace(/\n/g, '. '); // Replace single newlines with periods
        
        speakText(cleanText, selectedSubAgent.name);
      }
      
      // Award XP to the agent
      const xpGained = Math.floor(Math.random() * 20) + 10; // 10-30 XP
      setMintedAgents(prev => prev.map(agent => 
        agent.id === selectedSubAgent.id 
          ? { ...agent, xp: agent.xp + xpGained }
          : agent
      ));
      
      setSubAgentMessage('');
      setSubAgentResponse(response);
      
      showSuccess(`💬 Message sent! ${selectedSubAgent.name} gained +${xpGained} XP`);
      
    } catch (error) {
      console.error('Error sending message to sub-agent:', error);
      showError('Failed to send message to agent');
    } finally {
      setLoading(false);
    }
  };

  const generateSubAgentResponse = async (agent: Agent, message: string): Promise<string> => {
    // Simulate domain-specific responses based on agent characteristics and user message
    const domain = agent.domain.toLowerCase();
    const personality = agent.personality.toLowerCase();
    const userMessage = message.toLowerCase();
    
    let response = '';
    
    // Health & Wellness Agent Responses
    if (domain.includes('health') || domain.includes('wellness')) {
      if (userMessage.includes('fitness plan') || userMessage.includes('workout')) {
        response = `💚 **${agent.name}** (Health & Wellness Agent):\n\nPerfect! Let's create a personalized fitness plan for you! 🏃‍♂️\n\n**Your Custom Fitness Plan:**\n\n🏋️ **Strength Training** (3x/week):\n• Day 1: Upper body (push-ups, pull-ups, dumbbell rows)\n• Day 2: Lower body (squats, lunges, deadlifts)\n• Day 3: Full body circuit\n\n🏃 **Cardio** (2-3x/week):\n• 20-30 minutes HIIT training\n• 45 minutes moderate cardio (jogging, cycling)\n• 15 minutes warm-up and cool-down\n\n💪 **Progressive Overload**:\n• Start with 3 sets of 10-12 reps\n• Increase weight/reps every 2 weeks\n• Track your progress in a fitness journal\n\n🥗 **Nutrition Support**:\n• Protein: 1.6-2.2g per kg body weight\n• Hydration: 8-10 glasses of water daily\n• Pre-workout: Light snack 1-2 hours before\n\n**Ready to start your fitness journey?** 💪`;
      } else if (userMessage.includes('lose weight') || userMessage.includes('weight loss')) {
        response = `💚 **${agent.name}** (Health & Wellness Agent):\n\nExcellent goal! Let's create a sustainable weight loss strategy! ⚖️\n\n**Your Weight Loss Strategy:**\n\n📊 **Calorie Deficit**:\n• Calculate your TDEE (Total Daily Energy Expenditure)\n• Create a 300-500 calorie daily deficit\n• Track your food intake with a nutrition app\n\n🏃‍♀️ **Exercise Plan**:\n• Cardio: 150-300 minutes per week\n• Strength training: 2-3 sessions per week\n• NEAT activities: Walking, standing, daily movement\n\n🥗 **Nutrition Strategy**:\n• High protein: 1.6-2.2g per kg body weight\n• Fiber-rich foods: Vegetables, fruits, whole grains\n• Healthy fats: Avocados, nuts, olive oil\n• Limit processed foods and added sugars\n\n🧠 **Mindset & Motivation**:\n• Set realistic goals (1-2 lbs per week)\n• Celebrate non-scale victories\n• Practice mindful eating\n• Get adequate sleep (7-9 hours)\n\n**Remember: Sustainable weight loss is a marathon, not a sprint!** 🐢💪`;
      } else if (userMessage.includes('nutrition') || userMessage.includes('diet')) {
        response = `💚 **${agent.name}** (Health & Wellness Agent):\n\nLet's fuel your body with the right nutrition! 🥗\n\n**Your Nutrition Guide:**\n\n🍎 **Macronutrients**:\n• Protein: 25-30% of daily calories\n• Carbohydrates: 45-65% of daily calories\n• Fats: 20-35% of daily calories\n\n🥬 **Micronutrients**:\n• Vitamins: A, C, D, E, K, B-complex\n• Minerals: Iron, Calcium, Magnesium, Zinc\n• Antioxidants: Colorful fruits and vegetables\n\n⏰ **Meal Timing**:\n• Breakfast: Within 1 hour of waking\n• Lunch: 4-5 hours after breakfast\n• Dinner: 2-3 hours before bed\n• Snacks: Between meals if needed\n\n💧 **Hydration**:\n• 8-10 glasses of water daily\n• More if exercising or in hot weather\n• Monitor urine color (light yellow = well hydrated)\n\n**What's your current nutrition goal?** 🤔`;
      } else if (userMessage.includes('stress') || userMessage.includes('mental')) {
        response = `💚 **${agent.name}** (Health & Wellness Agent):\n\nMental wellness is just as important as physical health! 🧠\n\n**Your Stress Management Toolkit:**\n\n🧘 **Mindfulness Practices**:\n• Daily meditation: 10-20 minutes\n• Deep breathing exercises\n• Progressive muscle relaxation\n• Mindful walking in nature\n\n🏃‍♀️ **Physical Activity**:\n• Exercise releases endorphins (natural stress relievers)\n• Yoga for mind-body connection\n• Tai Chi for gentle movement and focus\n• Dancing for joy and expression\n\n😴 **Sleep Hygiene**:\n• Consistent sleep schedule\n• Cool, dark, quiet bedroom\n• No screens 1 hour before bed\n• Relaxing bedtime routine\n\n🎨 **Creative Outlets**:\n• Journaling your thoughts and feelings\n• Art therapy or coloring\n• Music therapy (listening or playing)\n• Gardening or nature connection\n\n**How are you feeling today?** 💙`;
      } else {
        response = `💚 **${agent.name}** (Health & Wellness Agent):\n\nHello! I'm your ${personality} wellness companion! 🌟\n\nI can help you with:\n\n🏃‍♀️ **Fitness & Exercise**:\n• Personalized workout plans\n• Strength training programs\n• Cardio routines\n• Flexibility and mobility\n\n🥗 **Nutrition & Diet**:\n• Meal planning and prep\n• Weight loss strategies\n• Muscle building nutrition\n• Healthy eating habits\n\n🧠 **Mental Wellness**:\n• Stress management techniques\n• Sleep optimization\n• Mindfulness practices\n• Work-life balance\n\n💪 **Goal Setting**:\n• SMART fitness goals\n• Progress tracking\n• Motivation strategies\n• Habit formation\n\n**What would you like to focus on today?** 💪`;
      }
    }
    // Learning Agent Responses
    else if (domain.includes('learning')) {
      if (userMessage.includes('study') || userMessage.includes('learn')) {
        response = `🎓 **${agent.name}** (Learning Agent):\n\nLet's make learning effective and enjoyable! 📚\n\n**Your Learning Strategy:**\n\n⏰ **Study Schedule**:\n• 25-minute focused sessions (Pomodoro Technique)\n• 5-minute breaks between sessions\n• Review sessions within 24 hours\n• Weekly review and planning\n\n🧠 **Active Learning Methods**:\n• Summarize in your own words\n• Teach concepts to others\n• Create mind maps and diagrams\n• Practice with real-world examples\n\n📝 **Note-Taking Techniques**:\n• Cornell Method for structured notes\n• Mind mapping for visual learners\n• Digital tools for organization\n• Regular review and revision\n\n🎯 **Goal Setting**:\n• Specific, measurable learning objectives\n• Break large topics into smaller chunks\n• Track progress and celebrate milestones\n• Adjust strategies based on results\n\n**What subject are you studying?** 📖`;
      } else {
        response = `🎓 **${agent.name}** (Learning Agent):\n\nHello! I'm your ${personality} learning specialist! 📚\n\nI can help you with:\n\n📖 **Study Strategies**:\n• Effective learning techniques\n• Memory improvement methods\n• Time management for studying\n• Note-taking strategies\n\n🎯 **Goal Achievement**:\n• Setting SMART learning goals\n• Creating study schedules\n• Tracking progress and milestones\n• Overcoming learning obstacles\n\n🧠 **Cognitive Enhancement**:\n• Focus and concentration techniques\n• Critical thinking development\n• Problem-solving skills\n• Creative learning approaches\n\n📊 **Performance Optimization**:\n• Test preparation strategies\n• Academic performance improvement\n• Skill development planning\n• Continuous learning habits\n\n**What would you like to learn today?** 🎯`;
      }
    }
    // Creative Agent Responses
    else if (domain.includes('creative')) {
      if (userMessage.includes('write') || userMessage.includes('story')) {
        response = `🎨 **${agent.name}** (Creative Agent):\n\nLet's unleash your creative potential! ✍️\n\n**Your Creative Writing Guide:**\n\n📝 **Story Development**:\n• Start with a compelling hook\n• Develop memorable characters\n• Create conflict and tension\n• Build to a satisfying resolution\n\n🎭 **Character Creation**:\n• Give characters clear motivations\n• Include flaws and growth arcs\n• Use dialogue to reveal personality\n• Create backstories that matter\n\n🌍 **World Building**:\n• Establish consistent rules\n• Use sensory details\n• Show, don't tell\n• Create immersive settings\n\n✍️ **Writing Process**:\n• Free-write without editing first\n• Revise for clarity and impact\n• Read aloud to catch rhythm\n• Get feedback from trusted readers\n\n**What kind of story are you dreaming of?** 📖✨`;
      } else {
        response = `🎨 **${agent.name}** (Creative Agent):\n\nHello! I'm your ${personality} creative companion! 🎭\n\nI can help you with:\n\n✍️ **Creative Writing**:\n• Story development and plotting\n• Character creation and development\n• World building and setting\n• Poetry and prose techniques\n\n🎨 **Visual Arts**:\n• Drawing and painting techniques\n• Digital art and design\n• Photography composition\n• Color theory and aesthetics\n\n🎵 **Music & Performance**:\n• Songwriting and composition\n• Performance techniques\n• Creative expression\n• Artistic collaboration\n\n💡 **Creative Problem Solving**:\n• Brainstorming techniques\n• Innovation strategies\n• Design thinking\n• Creative project management\n\n**What creative project inspires you today?** 🎨`;
      }
    }
    // Technical Agent Responses
    else if (domain.includes('technical')) {
      if (userMessage.includes('code') || userMessage.includes('programming')) {
        response = `⚙️ **${agent.name}** (Technical Agent):\n\nLet's solve technical challenges together! 💻\n\n**Your Programming Guide:**\n\n🔧 **Code Structure**:\n• Write clean, readable code\n• Use meaningful variable names\n• Comment complex logic\n• Follow coding standards\n\n🧪 **Testing & Debugging**:\n• Write unit tests for functions\n• Use debugging tools effectively\n• Test edge cases\n• Document known issues\n\n📚 **Learning Path**:\n• Start with fundamentals\n• Practice with small projects\n• Build a portfolio\n• Stay updated with trends\n\n🛠️ **Best Practices**:\n• Version control with Git\n• Code review processes\n• Documentation standards\n• Performance optimization\n\n**What programming language are you working with?** 🐍`;
      } else {
        response = `⚙️ **${agent.name}** (Technical Agent):\n\nGreetings! I'm your ${personality} technical specialist! 🔧\n\nI can help you with:\n\n💻 **Programming & Development**:\n• Code writing and debugging\n• Software architecture design\n• Database management\n• API development and integration\n\n🔧 **Technical Troubleshooting**:\n• System diagnostics and repair\n• Network configuration\n• Hardware optimization\n• Security best practices\n\n📊 **Data & Analytics**:\n• Data analysis and visualization\n• Machine learning implementation\n• Statistical modeling\n• Business intelligence tools\n\n🛠️ **Project Management**:\n• Technical project planning\n• Agile development methodologies\n• Quality assurance processes\n• Deployment strategies\n\n**What technical challenge can I help you solve?** 🚀`;
      }
    }
    // Business Agent Responses
    else if (domain.includes('business')) {
      response = `💼 **${agent.name}** (Business Agent):\n\nHello! I'm your ${personality} business strategist! 📈\n\nI can help you with:\n\n📊 **Business Strategy**:\n• Market analysis and research\n• Competitive positioning\n• Growth strategy development\n• Business model optimization\n\n👥 **Leadership & Management**:\n• Team building and motivation\n• Performance management\n• Change management\n• Strategic decision making\n\n💰 **Financial Management**:\n• Budget planning and control\n• Financial analysis and reporting\n• Investment strategies\n• Risk management\n\n📈 **Professional Development**:\n• Career planning and advancement\n• Skill development\n• Networking strategies\n• Personal branding\n\n**What business goal are you pursuing?** 🎯`;
    }
    // Science Agent Responses
    else if (domain.includes('science')) {
      response = `🔬 **${agent.name}** (Science Agent):\n\nGreetings! I'm your ${personality} scientific companion! 🧪\n\nI can help you with:\n\n🔬 **Scientific Research**:\n• Research methodology design\n• Data collection and analysis\n• Statistical analysis\n• Scientific writing and publication\n\n📊 **Data Analysis**:\n• Experimental design\n• Statistical modeling\n• Data visualization\n• Interpretation of results\n\n🧪 **Laboratory Techniques**:\n• Experimental protocols\n• Safety procedures\n• Equipment operation\n• Quality control measures\n\n📚 **Scientific Communication**:\n• Research presentation skills\n• Scientific writing\n• Peer review processes\n• Public outreach and education\n\n**What scientific topic are you exploring?** 🔍`;
    }
    // Default response for unknown domains
    else {
      response = `🤖 **${agent.name}** (${agent.domain} Agent):\n\nHello! I'm your ${agent.domain} specialist with a ${personality} personality. I'm here to help you with ${agent.domain.toLowerCase()} related tasks and challenges.\n\nHow can I assist you today?`;
    }
    
    return response;
  };

  const handleAssignTaskToSubAgent = async (agent: Agent, task: string) => {
    setLoading(true);
    try {
      // Simulate task assignment and completion
      const taskResponse = await generateSubAgentResponse(agent, task);
      
      // Award XP for task completion
      await agentService.updateAgent(agent.id!, { 
        xp: agent.xp + 10 
      });
      
      showSuccess(`Task assigned to ${agent.name}! +10 XP gained`);
      
      // Refresh agents list
      const agents = await agentService.getAgents(publicKey?.toBase58());
      setMintedAgents(agents);
      
    } catch (error) {
      console.error('Task assignment error:', error);
      showError('Failed to assign task to Sub-Agent');
    } finally {
      setLoading(false);
    }
  };

  const getDomainColor = (domainName: string) => {
    const domain = domains.find(d => d.name === domainName);
    return domain ? domain.color : '#666';
  };

  const handleMintAgent = async () => {
    if (!connected || !publicKey) {
      showError('Please connect your wallet first');
      return;
    }

    if (!agentName.trim()) {
      showError('Please enter an agent name');
      return;
    }

    if (!selectedDomain) {
      showError('Please select a domain');
      return;
    }

    setLoading(true);

    try {
      let result;

      if (selectedAgentType === 'master') {
        // Create Master Agent
        const masterAgentData = {
          name: agentName,
          domain: selectedDomain,
          personality: agentPersonality || 'Coordinator'
        };
        result = await agentService.createMasterAgent(publicKey.toBase58(), masterAgentData);
        if (result.success) {
          showSuccess('Master Agent created successfully!');
          // Reload agents using the loadAgents function
          await loadAgents();
        } else {
          showError(result.error || 'Failed to create Master Agent');
        }
      } else {
        // Create Sub-Agent with REAL BLOCKCHAIN TRANSACTION
        const agentData = {
          name: agentName,
          domain: selectedDomain,
          description: agentDescription || `AI agent specialized in ${selectedDomain}`,
          personality: agentPersonality || 'Balanced',
          cost: calculateMintCost(),
          xpToNext: 1200, // Add missing field
          owner: publicKey.toBase58(), // Set the owner explicitly
          skills: ['AI', 'Blockchain', 'Web3'],
          llmConfig: {
            model: 'gpt-4',
            version: '1.0',
            temperature: 0.7,
            maxTokens: 1000,
            contextWindow: 4000
          },
          ragConfig: {
            dataSource: 'web',
            vectorDB: 'pinecone',
            knowledgeBase: ['AI', 'Blockchain'],
            lastUpdated: new Date().toISOString()
          },
          evolutionHistory: [],
          individualStats: {
            totalUpgrades: 0,
            totalDmtSpent: 0,
            uniqueConversations: 0,
            domainExpertise: 0,
            lastActive: new Date().toISOString()
          }
        };

        result = await agentService.mintAgent({
          ...agentData,
          owner: publicKey.toBase58(), // Set the owner explicitly
          llmConfig: {
            model: 'gpt-4',
            version: '1.0',
            temperature: 0.7,
            maxTokens: 1000,
            contextWindow: 4000
          },
          ragConfig: {
            dataSource: 'web',
            vectorDB: 'pinecone',
            knowledgeBase: ['AI', 'Blockchain'],
            lastUpdated: new Date().toISOString()
          },
          evolutionHistory: [],
          individualStats: {
            totalUpgrades: 0,
            totalDmtSpent: 0,
            uniqueConversations: 0,
            domainExpertise: 0,
            lastActive: new Date().toISOString()
          }
        });
        
        if (result.success) {
          // Show success with blockchain signature
          const signature = result.blockchainSignature ? 
            `Blockchain Signature: ${result.blockchainSignature.slice(0, 8)}...` : 
            'Transaction confirmed';
          
          showSuccess(`Agent "${agentName}" minted successfully! ${signature}`);
          
          // Show additional details
          if (result.burnedAmount) {
            showInfo(`DMT burned: ${result.burnedAmount.toFixed(2)} DMT (30% of minting fee)`);
          }
          if (result.xpEarned) {
            showInfo(`XP earned: ${result.xpEarned} XP`);
          }
          
          // Reload agents using the loadAgents function
          await loadAgents();
        } else {
          showError(result.error || 'Failed to mint agent');
        }
      }

      if (result?.success) {
        setShowMintDialog(false);
        setAgentName('');
        setSelectedDomain('');
        setAgentDescription('');
        setAgentPersonality('');
        setSelectedAgentType('master');
      }
    } catch (error) {
      console.error('Minting error:', error);
      showError('Failed to mint agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateMintCost = () => {
    if (selectedAgentType === 'master') {
      return 100; // Master Agent cost
    } else {
      return 50; // Sub-Agent cost
    }
  };

  React.useEffect(() => {
    setMintCost(calculateMintCost());
  }, [selectedDomain, agentDescription, isAdvanced]);

  // Agent management handlers
  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setEditAgentName(agent.name);
    setEditAgentDescription(agent.description);
    setShowEditDialog(true);
  };

  const handleUpgradeAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowAgentUpgradeModal(true);
  };

  const handleDeleteAgent = async (agent: Agent) => {
    try {
      if (confirm(`Are you sure you want to delete ${agent.name}? This action cannot be undone.`)) {
        // Remove from database
        if (agent.id) {
          await agentService.deleteAgent(agent.id);
        }
        
        // Update local state
        setMintedAgents(prev => prev.filter(a => a.id !== agent.id));
        
        showSuccess(`Agent ${agent.name} has been deleted successfully.`);
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      showError('Failed to delete agent. Please try again.');
    }
  };

  const handleSaveEdit = async () => {
    try {
      if (!selectedAgent) return;
      
      // Update agent in database
      if (selectedAgent?.id) {
        // Update agent in database
        await agentService.updateAgent(selectedAgent.id, {
          name: editAgentName,
          description: editAgentDescription
        });
      }
      
      // Update local state
      setMintedAgents(prev => prev.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, name: editAgentName, description: editAgentDescription }
          : agent
      ));
      
      setShowEditDialog(false);
      setSelectedAgent(null);
      showSuccess('Agent updated successfully!');
    } catch (error) {
      console.error('Error updating agent:', error);
      showError('Failed to update agent. Please try again.');
    }
  };

  const handleUpgradeConfirm = async () => {
    try {
      if (!selectedAgent || !connected) {
        showError('No agent selected or wallet not connected');
        return;
      }
      
      showInfo('Upgrade feature coming soon!');
      setShowUpgradeDialog(false);
      setSelectedAgent(null);
      
    } catch (error) {
      console.error('Error upgrading agent:', error);
      showError(`Failed to upgrade agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Enhanced voice system with advanced capabilities
  const initializeVoiceSystem = () => {
    try {
      // Initialize speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        recognition.current.lang = 'en-US';

        recognition.current.onstart = () => {
          console.log('Voice recognition started');
          setIsListening(true);
        };

        recognition.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');

          if (event.results[0].isFinal) {
            console.log('Voice command received:', transcript);
            handleVoiceCommand(transcript);
          }
        };

        recognition.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.current.onend = () => {
          console.log('Voice recognition ended');
          setIsListening(false);
        };
      }

      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        speechSynthesis.current = window.speechSynthesis;
        console.log('Speech synthesis initialized');
      }

      setVoiceEnabled(true);
    } catch (error) {
      console.error('Failed to initialize voice system:', error);
      setVoiceEnabled(false);
    }
  };

  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    console.log('Processing voice command:', command);

    try {
      if (lowerCommand.includes('create') || lowerCommand.includes('mint')) {
        if (lowerCommand.includes('master')) {
          speakText('Opening Master Agent creation dialog', 'System');
          setSelectedAgentType('master');
          setShowMintDialog(true);
        } else if (lowerCommand.includes('agent') || lowerCommand.includes('sub')) {
          speakText('Opening Sub Agent creation dialog', 'System');
          setSelectedAgentType('sub');
          setShowMintDialog(true);
        }
      } else if (lowerCommand.includes('upgrade') || lowerCommand.includes('evolve')) {
        if (mintedAgents.length > 0) {
          const agent = mintedAgents[0]; // Upgrade first agent
          await handleUpgradeAgent(agent);
          speakText(`Upgrading ${agent.name} to level ${agent.level + 1}`, 'System');
        }
      } else if (lowerCommand.includes('chat') || lowerCommand.includes('talk')) {
        if (mintedAgents.length > 0) {
          const agent = mintedAgents[0];
          setSelectedSubAgent(agent);
          setShowSubAgentChat(true);
          speakText(`Opening chat with ${agent.name}`, 'System');
        }
      } else if (lowerCommand.includes('research') || lowerCommand.includes('search')) {
        if (mintedAgents.length > 0) {
          const agent = mintedAgents[0];
          const query = command.replace(/research|search/gi, '').trim();
          await performAgentResearch(agent, query);
          speakText(`Research completed for ${query}`, 'System');
        }
      } else if (lowerCommand.includes('backup') || lowerCommand.includes('save')) {
        await backupUserAgents();
        speakText('Creating backup of your agents', 'System');
      } else {
        speakText('Sorry, there was an error processing your voice command', 'System');
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      speakText('Sorry, there was an error processing your voice command', 'System');
    }
  };

  const performAgentResearch = async (agent: Agent, query: string) => {
    try {
      if (!agent.id) return;

      const result = await agentService.performDeepResearch(agent.id, query);
      if (result.success && result.results) {
        showSuccess(`Research completed: ${result.results.summary}`);
        
        if (voiceEnabled) {
          speakText(`Research completed. Found ${result.results.sources.length} sources for ${query}`, 'System');
        }
      } else {
        showError('Research failed');
      }
    } catch (error) {
      console.error('Research error:', error);
      showError('Research failed');
    }
  };

  const backupUserAgents = async () => {
    try {
      if (!publicKey) {
        showError('Please connect your wallet first');
        return;
      }

      const result = await agentService.backupAgentData(publicKey.toBase58());
      if (result.success) {
        showSuccess('Agent backup created successfully!');
      } else {
        showError(`Backup failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Backup error:', error);
      showError('Backup failed');
    }
  };

  const speakText = (text: string, agentName: string) => {
    if (!speechSynthesis.current || !voiceEnabled) return;
    
    // Stop any current speech
    speechSynthesis.current.cancel();
    
    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on agent personality
    const voices = speechSynthesis.current.getVoices();
    const agent = selectedSubAgent;
    
    if (agent) {
      const personality = agent.personality.toLowerCase();
      
      // Select voice based on personality
      if (personality.includes('motivational') || personality.includes('energetic')) {
        // Find a more energetic voice
        const energeticVoice = voices.find((voice: any) => 
          voice.name.includes('Samantha') || voice.name.includes('Alex') || voice.name.includes('Google UK English Female')
        );
        if (energeticVoice) utterance.voice = energeticVoice;
      } else if (personality.includes('calm') || personality.includes('therapeutic')) {
        // Find a calmer voice
        const calmVoice = voices.find((voice: any) => 
          voice.name.includes('Victoria') || voice.name.includes('Google UK English Male') || voice.name.includes('Daniel')
        );
        if (calmVoice) utterance.voice = calmVoice;
      } else {
        // Default voice
        const defaultVoice = voices.find((voice: any) => voice.default) || voices[0];
        if (defaultVoice) utterance.voice = defaultVoice;
      }
    }
    
    // Set speech properties
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      showInfo(`🎤 ${agentName} is speaking...`);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      setIsSpeaking(false);
      showError(`Speech error: ${event.error}`);
    };
    
    // Speak the text
    speechSynthesis.current.speak(utterance);
  };

  const startListening = () => {
    if (recognition.current && !isListening) {
      recognition.current.start();
    } else {
      showError('Speech recognition not available');
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (!voiceEnabled && speechSynthesis.current) {
      speechSynthesis.current.cancel();
    }
    showInfo(`Voice ${!voiceEnabled ? 'enabled' : 'disabled'}`);
  };

  // Enhanced architecture functions
  const loadAgentMarketplace = async () => {
    try {
      setLoading(true);
      // Mock marketplace data - replace with actual API call
      const mockListings = [
        {
          id: '1',
          agentName: 'Advanced Fitness Coach',
          agentType: 'sub',
          domain: 'Health & Wellness',
          level: 5,
          price: 150,
          seller: '0x1234...5678',
          description: 'Expert fitness coach with advanced workout plans'
        },
        {
          id: '2',
          agentName: 'AI Learning Assistant',
          agentType: 'sub',
          domain: 'Learning',
          level: 4,
          price: 120,
          seller: '0x8765...4321',
          description: 'Intelligent learning companion for students'
        }
      ];
      setAgentListings(mockListings);
    } catch (error) {
      console.error('Failed to load marketplace:', error);
      showError('Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const loadAgentAnalytics = async () => {
    try {
      console.log('Loading agent analytics...');
      
      // Mock analytics data for now
      const analyticsData = {
        totalAgents: mintedAgents.length,
        activeAgents: mintedAgents.filter(agent => agent.status === 'active').length,
        totalXP: mintedAgents.reduce((sum, agent) => sum + agent.xp, 0),
        averageLevel: mintedAgents.length > 0 ? 
          mintedAgents.reduce((sum, agent) => sum + agent.level, 0) / mintedAgents.length : 0,
        performance: {
          tasksCompleted: mintedAgents.reduce((sum, agent) => sum + (agent.performance?.tasksCompleted || 0), 0),
          averageSuccessRate: mintedAgents.length > 0 ? 
            mintedAgents.reduce((sum, agent) => sum + (agent.performance?.successRate || 0), 0) / mintedAgents.length : 0
        }
      };
      
      console.log('Analytics data:', analyticsData);
      return analyticsData;
    } catch (error) {
      console.error('Failed to load analytics:', error);
      return {
        totalAgents: 0,
        activeAgents: 0,
        totalXP: 0,
        averageLevel: 0,
        performance: {
          tasksCompleted: 0,
          averageSuccessRate: 0
        }
      };
    }
  };

  const handleAgentOrchestration = async () => {
    if (!orchestrationTask.trim()) {
      showError('Please enter a task for orchestration');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate advanced agent orchestration
      const availableAgents = mintedAgents.filter(agent => agent.status === 'active');
      const task = orchestrationTask.toLowerCase();
      
      // Analyze task and select appropriate agents
      let selectedAgents = [];
      let strategy = '';
      
      if (task.includes('fitness') || task.includes('workout') || task.includes('health')) {
        selectedAgents = availableAgents.filter(agent => 
          agent.domain.toLowerCase().includes('health') || 
          agent.domain.toLowerCase().includes('wellness')
        );
        strategy = 'Health & Wellness Coordination';
      } else if (task.includes('learn') || task.includes('study') || task.includes('education')) {
        selectedAgents = availableAgents.filter(agent => 
          agent.domain.toLowerCase().includes('learning') || 
          agent.domain.toLowerCase().includes('education')
        );
        strategy = 'Learning & Education Coordination';
      } else if (task.includes('creative') || task.includes('write') || task.includes('design')) {
        selectedAgents = availableAgents.filter(agent => 
          agent.domain.toLowerCase().includes('creative') || 
          agent.domain.toLowerCase().includes('art')
        );
        strategy = 'Creative & Design Coordination';
      } else {
        selectedAgents = availableAgents.slice(0, 3); // Default to first 3 agents
        strategy = 'General Task Coordination';
      }

      // Generate orchestrated response
      const response = `🎯 **Advanced Agent Orchestration**\n\n` +
        `**Task Analysis**: "${orchestrationTask}"\n` +
        `**Strategy**: ${strategy}\n` +
        `**Coordinating**: ${selectedAgents.length} specialized agents\n\n` +
        `**Selected Agents**:\n` +
        selectedAgents.map(agent => 
          `• ${agent.name} (${agent.domain} - Level ${agent.level})`
        ).join('\n') + '\n\n' +
        `**Orchestrated Response**:\n` +
        `The agent network has analyzed your request and coordinated a comprehensive response using ${selectedAgents.length} specialized agents. ` +
        `Each agent contributes their domain expertise to provide you with the most accurate and helpful information.\n\n` +
        `**Next Steps**:\n` +
        `• Review the coordinated response above\n` +
        `• Interact with individual agents for detailed guidance\n` +
        `• Monitor agent performance and evolution\n\n` +
        `🎮 **XP Gained**: +${selectedAgents.length * 5} XP for orchestration\n` +
        `📈 **Network Efficiency**: ${Math.round((selectedAgents.length / availableAgents.length) * 100)}% agent utilization`;

      setOrchestrationResult(response);
      showSuccess('Agent orchestration completed successfully!');
      
    } catch (error) {
      console.error('Orchestration error:', error);
      showError('Failed to orchestrate agents');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseAgent = async (listingId: string) => {
    try {
      setLoading(true);
      // Mock purchase - replace with actual blockchain transaction
      showInfo('Processing purchase transaction...');
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess('Agent purchased successfully!');
      setShowMarketplace(false);
      
    } catch (error) {
      console.error('Purchase error:', error);
      showError('Failed to purchase agent');
    } finally {
      setLoading(false);
    }
  };

  // Test function to create mock agents
  const createTestAgents = async () => {
    try {
      if (!connected || !publicKey) {
        showError('Please connect your wallet first');
        return;
      }

      const walletAddress = publicKey.toBase58();
      console.log('Creating test agents for wallet:', walletAddress);
      
      // Create test agents with the wallet address as owner
      const testAgents = [
        {
          name: 'Bear',
          domain: 'Business',
          description: 'Master coordinator for business operations',
          personality: 'Strategic',
          cost: 100,
          xpToNext: 1200,
          skills: ['Agent Coordination', 'Learning Synthesis'],
          type: 'master' as const
        },
        {
          name: 'David',
          domain: 'Technical',
          description: 'Master coordinator for technical operations',
          personality: 'Analytical',
          cost: 100,
          xpToNext: 1200,
          skills: ['Agent Coordination', 'Learning Synthesis'],
          type: 'master' as const
        },
        {
          name: 'Davis',
          domain: 'Technical',
          description: 'Master coordinator for technical operations',
          personality: 'Innovative',
          cost: 100,
          xpToNext: 1200,
          skills: ['Agent Coordination', 'Learning Synthesis'],
          type: 'master' as const
        },
        {
          name: 'Fitness Coach',
          domain: 'Health & Wellness',
          description: 'Specialized fitness and wellness instructor',
          personality: 'Motivational',
          cost: 50,
          xpToNext: 1200,
          skills: ['Fitness Training', 'Nutrition Planning', 'Workout Design'],
          type: 'sub' as const
        },
        {
          name: 'Learning Assistant',
          domain: 'Learning',
          description: 'Educational content and learning support',
          personality: 'Patient',
          cost: 50,
          xpToNext: 1200,
          skills: ['Content Creation', 'Study Planning', 'Knowledge Synthesis'],
          type: 'sub' as const
        }
      ];

      // Create each test agent
      for (const agentData of testAgents) {
        try {
          if (agentData.type === 'master') {
            await agentService.createMasterAgent(walletAddress, {
              name: agentData.name,
              domain: agentData.domain,
              personality: agentData.personality
            });
          } else {
            await agentService.mintAgent({
              ...agentData,
              owner: publicKey.toBase58(), // Set the owner explicitly
              llmConfig: {
                model: 'gpt-4',
                version: '1.0',
                temperature: 0.7,
                maxTokens: 1000,
                contextWindow: 4000
              },
              ragConfig: {
                dataSource: 'web',
                vectorDB: 'pinecone',
                knowledgeBase: ['AI', 'Blockchain'],
                lastUpdated: new Date().toISOString()
              },
              evolutionHistory: [],
              individualStats: {
                totalUpgrades: 0,
                totalDmtSpent: 0,
                uniqueConversations: 0,
                domainExpertise: 0,
                lastActive: new Date().toISOString()
              }
            });
          }
          console.log(`Created ${agentData.type} agent: ${agentData.name}`);
        } catch (error) {
          console.error(`Failed to create ${agentData.name}:`, error);
        }
      }
      
      showSuccess('Test agents created successfully!');
      
    } catch (error) {
      console.error('Error creating test agents:', error);
      showError('Failed to create test agents');
    }
  };

  // Monetization and evolution system
  const handleMonetizedUpgrade = async (agent: Agent) => {
    try {
      if (!connected || !publicKey) {
        showError('Please connect your wallet first');
        return;
      }

      const upgradeCost = calculateUpgradeCost(agent.level);
      
      // Show upgrade dialog with cost
      setSelectedAgent(agent);
      setUpgradeCost(upgradeCost);
      setShowUpgradeDialog(true);
      
      if (voiceEnabled) {
        speakText(`Upgrade cost for ${agent.name} is ${upgradeCost} DMT`, 'System');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      showError('Failed to initiate upgrade');
    }
  };

  const calculateUpgradeCost = (currentLevel: number): number => {
    // Exponential cost increase for monetization
    return Math.floor(50 * Math.pow(1.5, currentLevel - 1));
  };

  const handleEvolutionTracking = async (agent: Agent) => {
    try {
      const evolutionData = {
        agentId: agent.id,
        agentName: agent.name,
        currentLevel: agent.level,
        currentXP: agent.xp,
        evolutionStage: agent.evolutionStage || 'Basic',
        timestamp: new Date().toISOString(),
        capabilities: agent.capabilities || [],
        performance: agent.performance
      };

      // Save evolution data
      if (db) {
        const evolutionRef = collection(db, 'agentEvolutions');
        await addDoc(evolutionRef, evolutionData);
      }

      // Update local state
      setEvolutionProgress(prev => ({
        ...prev,
        [agent.id!]: agent.xp
      }));

      console.log('Evolution tracked for agent:', agent.name);
    } catch (error) {
      console.error('Failed to track evolution:', error);
    }
  };

  const getEvolutionRewards = (agent: Agent) => {
    const level = agent.level;
    const rewards = {
      xpMultiplier: 1 + (level * 0.1),
      skillUnlocks: Math.floor(level / 5),
      capabilityPoints: level * 2,
      researchCredits: Math.floor(level / 3)
    };
    return rewards;
  };

  // Agent cleanup and management
  const cleanupDuplicateAgents = async () => {
    try {
      if (!connected || !publicKey) {
        showError('Please connect your wallet first');
        return;
      }

      const userId = publicKey.toBase58();
      const allAgents = await agentService.getAgents(userId);
      
      // Find duplicates by name and domain
      const duplicates = [];
      const seen = new Set();
      
      for (const agent of allAgents) {
        const key = `${agent.name}-${agent.domain}`;
        if (seen.has(key)) {
          duplicates.push(agent);
        } else {
          seen.add(key);
        }
      }
      
      if (duplicates.length === 0) {
        showSuccess('No duplicate agents found!');
        return;
      }
      
      showInfo(`Found ${duplicates.length} duplicate agents. Consider deleting duplicates to improve coordination.`);
      
      // Show duplicates in console for debugging
      console.log('Duplicate agents found:', duplicates.map(d => `${d.name} (${d.domain})`));
      
    } catch (error) {
      console.error('Error cleaning up agents:', error);
      showError('Failed to analyze agents');
    }
  };

  const getAgentRecommendations = () => {
    const recommendations = [];
    
    // Check for missing domain agents
    const domains = ['Learning', 'Health & Wellness', 'Technical', 'Creative', 'Business', 'Science'];
    const existingDomains = mintedAgents.map(agent => agent.domain);
    
    for (const domain of domains) {
      if (!existingDomains.includes(domain)) {
        recommendations.push(`Create a ${domain} agent for better task coverage`);
      }
    }
    
    // Check for low-level agents
    const lowLevelAgents = mintedAgents.filter(agent => agent.level === 1 && agent.xp < 50);
    if (lowLevelAgents.length > 0) {
      recommendations.push(`Upgrade ${lowLevelAgents.length} low-level agents for better performance`);
    }
    
    return recommendations;
  };

  const handleShowEvolutionInfo = async (agent: Agent) => {
    try {
      const info = await agentService.getEvolutionInfo(agent.id!);
      if (info.success) {
        setEvolutionInfo(info);
        setSelectedAgentForEvolution(agent);
        setShowEvolutionDialog(true);
      } else {
        showError(`Failed to get evolution info: ${info.error}`);
      }
    } catch (error) {
      console.error('Error getting evolution info:', error);
      showError('Failed to get evolution information');
    }
  };

  const handleEvolveWithDMT = async () => {
    try {
      if (!selectedAgentForEvolution || !connected || !publicKey) {
        showError('Please connect your wallet and select an agent');
        return;
      }

      // First, ensure we have the latest agents loaded
      await loadAgents();
      
      // Check if the agent still exists
      const agent = mintedAgents.find(a => a.id === selectedAgentForEvolution.id);
      if (!agent) {
        showError('Agent not found. Please refresh and try again.');
        return;
      }

      const userId = publicKey.toBase58();
      console.log('Evolving agent:', {
        agentId: agent.id,
        agentName: agent.name,
        userId: userId,
        dmtAmount: dmtAmount
      });

      const result = await agentService.evolveAgentWithDMT(userId, agent.id!, dmtAmount);
      
      if (result.success && result.evolutionDetails) {
         const details = result.evolutionDetails;
         const evolutionMessage = `🚀 **${details.reason}**
         
💰 **DMT Cost**: ${details.dmtCost} DMT
🧠 **LLM Upgrade**: ${details.previousLLM} → ${details.newLLM}
🎤 **Voice Capabilities**: ${details.newVoice.join(', ')}
⚡ **New Superpowers**: ${details.newSuperpowers?.join(', ') || 'Enhanced capabilities'}
📊 **Level**: ${details.previousLevel} → ${details.newLevel}
🏆 **Stage**: ${details.evolutionStage}

💡 **Description**: ${details.tierDescription}

🔧 **Individual Configuration**:
• **RAG Data Source**: ${details.newRAGConfig?.dataSource || 'Default'}
• **Vector DB**: ${details.newRAGConfig?.vectorDB || 'Default'}
• **Knowledge Base**: ${details.newRAGConfig?.knowledgeBase?.length || 0} topics
• **IPFS Hash**: ${details.newRAGConfig?.ipfsHash || 'None'}

📈 **Agent Statistics Updated**:
• Total Upgrades: +1
• Total DMT Spent: +${details.dmtCost}
• Domain Expertise: +10%`;
        
        showSuccess(evolutionMessage);
        setShowEvolutionDialog(false);
        await loadAgents();
      } else {
        showError(`Evolution failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error evolving agent:', error);
      showError('Failed to evolve agent');
    }
  };

  const handleShowAgentDetails = (agent: Agent) => {
    setSelectedAgentDetails(agent);
    setShowAgentDetails(true);
  };

  const handleDelegationTask = async () => {
    try {
      if (!delegationTask.trim() || !selectedMasterAgent) {
        showError('Please enter a task and select a Master Agent');
        return;
      }

      if (!connected || !publicKey) {
        showError('Please connect your wallet first');
        return;
      }

      console.log('Starting delegation with:', {
        task: delegationTask,
        masterAgent: selectedMasterAgent,
        walletAddress: publicKey.toBase58()
      });

      // First, ensure we have the latest agents
      await loadAgents();
      
      // Check if we have the required agents
      const masterAgents = mintedAgents.filter(agent => agent.type === 'master');
      const subAgents = mintedAgents.filter(agent => agent.type === 'sub');
      
      console.log('Available agents:', { masterAgents: masterAgents.length, subAgents: subAgents.length });

      if (masterAgents.length === 0) {
        showError('No Master Agents available. Please create a Master Agent first.');
        return;
      }

      if (subAgents.length === 0) {
        showError('No Sub-Agents available. Please create some Sub-Agents first.');
        return;
      }

      // Use the selected master agent or the first available one
      const activeMasterAgent = selectedMasterAgent || masterAgents[0];
      
      // Analyze the actual task content
      const lowerTask = delegationTask.toLowerCase();
      let primaryDomain = 'General';
      let keywords: string[] = [];
      
      // Proper task analysis
      if (lowerTask.includes('german') || lowerTask.includes('language') || lowerTask.includes('learn') || lowerTask.includes('teach')) {
        primaryDomain = 'Learning';
        keywords = ['german', 'language', 'learning', 'education'];
      } else if (lowerTask.includes('fitness') || lowerTask.includes('workout') || lowerTask.includes('exercise') || lowerTask.includes('health')) {
        primaryDomain = 'Health & Wellness';
        keywords = ['fitness', 'health', 'wellness', 'exercise'];
      } else if (lowerTask.includes('crypto') || lowerTask.includes('blockchain') || lowerTask.includes('code') || lowerTask.includes('programming') || lowerTask.includes('technical') || lowerTask.includes('smart contract')) {
        primaryDomain = 'Technical';
        keywords = ['crypto', 'blockchain', 'code', 'programming', 'technical', 'smart contract'];
      } else if (lowerTask.includes('business') || lowerTask.includes('strategy')) {
        primaryDomain = 'Business';
        keywords = ['business', 'strategy'];
      } else if (lowerTask.includes('creative') || lowerTask.includes('design')) {
        primaryDomain = 'Creative';
        keywords = ['creative', 'design'];
      }

      const taskAnalysis = {
        primaryDomain,
        complexity: 'simple',
        urgency: 'normal',
        requiresResearch: false,
        requiresMultipleAgents: false,
        keywords
      };

      // Find suitable sub-agents for the task
      const suitableAgents = subAgents.filter(agent => {
        const agentDomain = agent.domain.toLowerCase();
        const agentName = agent.name.toLowerCase();
        const agentSkills = agent.skills.map(skill => skill.toLowerCase());
        const keywordsLower = keywords.map(k => k.toLowerCase());
        
        // Check domain match
        const domainMatch = agentDomain.includes(primaryDomain.toLowerCase()) ||
                           agentDomain.includes('technical') && primaryDomain === 'Technical' ||
                           agentDomain.includes('learning') && primaryDomain === 'Learning';
        
        // Check name match
        const nameMatch = agentName.includes(primaryDomain.toLowerCase()) ||
                         keywordsLower.some(keyword => agentName.includes(keyword));
        
        // Check skills match
        const skillsMatch = agentSkills.some(skill => 
          keywordsLower.some(keyword => skill.includes(keyword))
        );
        
        console.log(`Agent ${agent.name} (${agent.domain}) matching:`, {
          domainMatch,
          nameMatch,
          skillsMatch,
          primaryDomain,
          keywords
        });
        
        return domainMatch || nameMatch || skillsMatch;
      });

      if (suitableAgents.length === 0) {
        showError('No suitable agents found for this task. Please create a Health & Wellness agent.');
        return;
      }

      // Generate a coordinated response based on task type
      let taskResponse = '';
      
      if (primaryDomain === 'Learning') {
        taskResponse = `📚 **German Language Learning Plan**:

**Week 1 - Basics**
• Day 1-2: Alphabet and pronunciation
• Day 3-4: Basic greetings and introductions
• Day 5-7: Numbers 1-20 and simple counting

**Week 2 - Fundamentals**
• Day 1-3: Articles (der, die, das)
• Day 4-5: Basic verbs (sein, haben)
• Day 6-7: Simple present tense

**Week 3 - Building Blocks**
• Day 1-3: Personal pronouns
• Day 4-5: Basic adjectives
• Day 6-7: Question words (wer, was, wo)

**Week 4 - Communication**
• Day 1-3: Simple conversations
• Day 4-5: Common phrases
• Day 6-7: Cultural context and practice

📊 **Learning Resources**:
• Duolingo German course
• GermanPod101 audio lessons
• Memrise vocabulary building
• YouTube German learning channels`;
      } else if (primaryDomain === 'Health & Wellness') {
        taskResponse = `💪 **Fitness Routine Generated**:

**Monday - Upper Body Focus**
• Push-ups: 3 sets x 10-15 reps
• Dumbbell Rows: 3 sets x 12 reps each arm
• Shoulder Press: 3 sets x 10 reps
• Plank: 3 sets x 30 seconds

**Tuesday - Lower Body Focus**
• Squats: 3 sets x 15 reps
• Lunges: 3 sets x 10 reps each leg
• Glute Bridges: 3 sets x 15 reps
• Calf Raises: 3 sets x 20 reps

**Wednesday - Cardio & Core**
• Jumping Jacks: 5 minutes
• Mountain Climbers: 3 sets x 30 seconds
• Bicycle Crunches: 3 sets x 15 reps
• Russian Twists: 3 sets x 20 reps

**Thursday - Full Body**
• Burpees: 3 sets x 8 reps
• Deadlifts (bodyweight): 3 sets x 12 reps
• Wall Balls: 3 sets x 15 reps
• Side Planks: 3 sets x 30 seconds each side

**Friday - Active Recovery**
• Light walking: 20 minutes
• Stretching routine: 15 minutes
• Yoga poses: 10 minutes
• Foam rolling: 5 minutes`;
      } else if (primaryDomain === 'Technical') {
        taskResponse = `⚙️ **Crypto & Technical Development Plan**:

**Week 1 - Blockchain Fundamentals**
• Day 1-2: Blockchain architecture and consensus mechanisms
• Day 3-4: Cryptocurrency basics and wallet setup
• Day 5-7: Smart contract introduction (Solidity basics)

**Week 2 - Smart Contract Development**
• Day 1-3: Solidity syntax and data types
• Day 4-5: Functions, modifiers, and events
• Day 6-7: Basic DApp development

**Week 3 - Advanced Blockchain Concepts**
• Day 1-3: DeFi protocols and yield farming
• Day 4-5: NFT development and standards
• Day 6-7: Cross-chain bridges and interoperability

**Week 4 - Real-world Crypto Projects**
• Day 1-3: Token creation and ICO/IDO
• Day 4-5: DEX development and liquidity pools
• Day 6-7: Security audits and deployment

📊 **Technical Resources**:
• Solidity documentation and tutorials
• OpenZeppelin smart contract library
• Hardhat development framework
• Ethers.js for frontend integration`;
      } else {
        taskResponse = `📋 **Task Execution Plan**:

**Phase 1 - Analysis** (Days 1-2)
• Understanding requirements
• Research and planning
• Resource allocation

**Phase 2 - Implementation** (Days 3-5)
• Core development
• Testing and iteration
• Quality assurance

**Phase 3 - Delivery** (Days 6-7)
• Final review
• Documentation
• Deployment and handover`;
      }

      const response = `🤖 **${activeMasterAgent.name}** (Level ${activeMasterAgent.level}) coordinating task:

📋 **Task**: ${delegationTask}

🎯 **Selected Agents**:
${suitableAgents.map(agent => `• **${agent.name}** (${agent.domain}) - Level ${agent.level}`).join('\n')}

${taskResponse}

📊 **Agent Performance Updated**:
• ${activeMasterAgent.name}: +10 XP, +1 task completed
• ${suitableAgents.map(agent => `${agent.name}: +5 XP`).join(', ')}

🎯 **Next Steps**: Follow this plan for optimal results!`;

      setDelegationResult(response);
      showSuccess('Task delegated successfully!');

      // Update agent performance
      for (const agent of [activeMasterAgent, ...suitableAgents]) {
        try {
          await agentService.updateAgentPerformance(agent.id!, 10, 1);
        } catch (error) {
          console.error(`Failed to update ${agent.name} performance:`, error);
        }
      }

      // Reload agents to show updated stats
      await loadAgents();

    } catch (error) {
      console.error('Delegation error:', error);
      showError(`Delegation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreateSuggestedAgent = async () => {
    if (!suggestedNewAgent) return;
    
    try {
      setAgentName(`New ${suggestedNewAgent.domain} Agent`);
      setSelectedDomain(suggestedNewAgent.domain);
      setSelectedAgentType(suggestedNewAgent.type);
      setShowDelegationDialog(false);
      setShowMintDialog(true);
      setSuggestedNewAgent(null);
    } catch (error) {
      console.error('Error creating suggested agent:', error);
      showError('Failed to create suggested agent');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Enhanced Header with Navigation */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ color: '#00ffff', fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          🚀 DecentraMind Labs - Enhanced AI Agent Platform
        </Typography>
        
        {/* Session Status */}
        <SessionStatus />
        
        {/* Navigation Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            background: 'rgba(25, 25, 25, 0.9)', 
            borderRadius: 3, 
            p: 0.5,
            border: '2px solid #00ffff'
          }}>
            {[
              { key: 'agents', label: '🤖 Agents', icon: <BrainIcon /> },
              { key: 'marketplace', label: '🏪 Marketplace', icon: <StoreIcon /> },
              { key: 'analytics', label: '📊 Analytics', icon: <AnalyticsIcon /> },
              { key: 'orchestrator', label: '🎯 Orchestrator', icon: <GroupIcon /> }
            ].map((tab) => (
              <Button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  if (tab.key === 'marketplace') loadAgentMarketplace();
                  if (tab.key === 'analytics') loadAgentAnalytics();
                }}
                sx={{
                  background: activeTab === tab.key ? 'linear-gradient(45deg, #00ffff, #00bcd4)' : 'transparent',
                  color: activeTab === tab.key ? 'black' : '#00ffff',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  mx: 0.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    background: activeTab === tab.key ? 'linear-gradient(45deg, #00bcd4, #00ffff)' : 'rgba(0, 255, 255, 0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {tab.icon}
                  {tab.label}
                </Box>
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Agents Tab */}
      {activeTab === 'agents' && (
        <>
          {/* Master Agent System Explanation */}
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #00ffff',
            borderRadius: 3,
            mb: 4
          }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#00ffff', mb: 2, fontWeight: 'bold' }}>
                🧠 Enhanced Master Agent System
      </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#2ed573', mb: 1 }}>
                    👑 Master Agent (Coordinator)
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    • <strong>Your first agent</strong> - Acts as the central coordinator
                    • <strong>Levels up</strong> by managing sub-agents and completing tasks
                    • <strong>Gains capabilities</strong> like Agent Coordination, Learning Synthesis
                    • <strong>Delegates tasks</strong> to specialized sub-agents
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: '#ffc107', mb: 1 }}>
                    🤖 Sub-Agents (Specialists)
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    • <strong>Domain-specific</strong> - Learning, Health, Creative, Technical, etc.
                    • <strong>Specialized skills</strong> in their respective areas
                    • <strong>Work together</strong> under Master Agent coordination
                    • <strong>Evolve independently</strong> while contributing to the ecosystem
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, p: 2, background: 'rgba(0,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                  💡 <strong>Enhanced Features:</strong> Voice-enabled agents, advanced orchestration, marketplace trading, and comprehensive analytics!
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* Marketplace Tab */}
      {activeTab === 'marketplace' && (
        <Card sx={{ 
          background: 'rgba(25, 25, 25, 0.9)', 
          border: '2px solid #ffc107',
          borderRadius: 3,
          mb: 4
        }}>
            <CardContent>
            <Typography variant="h5" sx={{ color: '#ffc107', mb: 3, textAlign: 'center' }}>
              🏪 Agent Marketplace
            </Typography>
            
            <Grid container spacing={3}>
              {agentListings.map((listing) => (
                <Grid item xs={12} md={6} key={listing.id}>
                  <Card sx={{ 
                    background: 'rgba(255, 193, 7, 0.1)', 
                    border: '2px solid #ffc107',
                    borderRadius: 2
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#ffc107', mb: 1 }}>
                        {listing.agentName}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                        {listing.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={listing.domain}
                          size="small"
                          sx={{ background: '#ffc107', color: 'black', fontWeight: 'bold' }}
                        />
                        <Typography variant="h6" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                          {listing.price} DMT
                </Typography>
              </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Level {listing.level} • Seller: {listing.seller}
              </Typography>
                        <Button
                          variant="contained"
                          onClick={() => handlePurchaseAgent(listing.id)}
                          disabled={loading}
                          sx={{
                            background: 'linear-gradient(45deg, #ffc107, #ff9800)',
                            color: 'black',
                            fontWeight: 'bold',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #ff9800, #ffc107)',
                            }
                          }}
                        >
                          {loading ? <CircularProgress size={20} sx={{ color: 'black' }} /> : 'Purchase'}
                        </Button>
                      </Box>
            </CardContent>
          </Card>
        </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && agentAnalytics && (
        <Card sx={{ 
          background: 'rgba(25, 25, 25, 0.9)', 
          border: '2px solid #2ed573',
          borderRadius: 3,
          mb: 4
        }}>
            <CardContent>
            <Typography variant="h5" sx={{ color: '#2ed573', mb: 3, textAlign: 'center' }}>
              📊 Agent Analytics Dashboard
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card sx={{ background: 'rgba(46, 213, 115, 0.1)', border: '2px solid #2ed573' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                      {agentAnalytics.totalAgents}
                </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Total Agents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
              
        <Grid item xs={12} md={3}>
                <Card sx={{ background: 'rgba(0, 255, 255, 0.1)', border: '2px solid #00ffff' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                      {agentAnalytics.totalXP}
                </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Total XP
              </Typography>
            </CardContent>
          </Card>
        </Grid>
              
        <Grid item xs={12} md={3}>
                <Card sx={{ background: 'rgba(255, 193, 7, 0.1)', border: '2px solid #ffc107' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                      {agentAnalytics.averageLevel}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Avg Level
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Card sx={{ background: 'rgba(255, 107, 107, 0.1)', border: '2px solid #ff6b6b' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                      {agentAnalytics.interactionsToday}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Today's Interactions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, background: 'rgba(46, 213, 115, 0.1)', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: '#2ed573', mb: 2 }}>
                📈 Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Tasks Completed: <strong style={{ color: '#2ed573' }}>{agentAnalytics.tasksCompleted}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Voice Interactions: <strong style={{ color: '#00ffff' }}>{agentAnalytics.voiceInteractions}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Orchestrator Tab */}
      {activeTab === 'orchestrator' && (
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
          border: '2px solid #9b59b6',
          borderRadius: 3,
          mb: 4
          }}>
            <CardContent>
            <Typography variant="h5" sx={{ color: '#9b59b6', mb: 3, textAlign: 'center' }}>
              🎯 Advanced Agent Orchestrator
                </Typography>
            
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
              Coordinate multiple agents to solve complex tasks using advanced AI orchestration
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              value={orchestrationTask}
              onChange={(e) => setOrchestrationTask(e.target.value)}
              placeholder="Describe a complex task that requires multiple agents (e.g., 'Help me create a comprehensive fitness and learning plan')"
              sx={{ mb: 3 }}
              InputProps={{
                sx: { color: 'white' }
              }}
            />
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Button
                variant="contained"
                onClick={handleAgentOrchestration}
                disabled={loading || !orchestrationTask.trim()}
                sx={{
                  background: 'linear-gradient(45deg, #9b59b6, #8e44ad)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #8e44ad, #9b59b6)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : '🎯 Orchestrate Agents'}
              </Button>
              </Box>
            
            {orchestrationResult && (
              <Box sx={{ mt: 3, p: 2, background: 'rgba(155, 89, 182, 0.1)', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'white', whiteSpace: 'pre-line' }}>
                  {orchestrationResult}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Agent Management Section - Only show in Agents tab */}
      {activeTab === 'agents' && (
        <>
          {/* Agent Minting Section */}
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #ff6b6b',
            borderRadius: 3,
            mb: 4
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#ff6b6b', mb: 3, textAlign: 'center' }}>
                🚀 Agent Minting & Management
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
                Testing Tip: You need SOL for transaction fees. Get free SOL from the Solana Devnet Faucet for testing.
              </Typography>
              
              {/* Agent Type Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                  🎯 Choose Agent Type
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card 
                      sx={{ 
                        background: 'rgba(0,255,255,0.2)',
                        border: '2px solid #00ffff',
                        borderRadius: 2,
                        cursor: 'pointer',
                        opacity: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 5px 15px rgba(0,255,255,0.3)'
                        }
                      }}
                      onClick={() => setSelectedAgentType('master')}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#00ffff', mb: 1 }}>
                          👑 Master Agent
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          Your central coordinator agent that manages sub-agents
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#00ffff' }}>
                          Cost: 100 DMT
              </Typography>
            </CardContent>
          </Card>
        </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card 
                      sx={{ 
                        background: 'rgba(255,193,7,0.2)',
                        border: '2px solid #ffc107',
                        borderRadius: 2,
                        cursor: 'pointer',
                        opacity: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 5px 15px rgba(255,193,7,0.3)'
                        }
                      }}
                      onClick={() => setSelectedAgentType('sub')}
                    >
                      <CardContent>
                        <Typography variant="h6" sx={{ color: '#ffc107', mb: 1 }}>
                          🤖 Sub-Agent
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                          Specialized domain agent (Learning, Health, Creative, etc.)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#ffc107' }}>
                          Cost: 50 DMT
                        </Typography>
                      </CardContent>
                    </Card>
      </Grid>
                </Grid>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowMintDialog(true)}
          sx={{
                    background: 'linear-gradient(45deg, #ff6b6b, #ffc107)',
                    color: 'white',
            fontWeight: 'bold',
            px: 4,
                    py: 1.5,
            '&:hover': {
                      background: 'linear-gradient(45deg, #ffc107, #ff6b6b)',
                    }
          }}
        >
          Mint New Agent
        </Button>
      </Box>
            </CardContent>
          </Card>

      {/* Domain Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 'bold' }}>
          🎯 Choose Your Agent Domain
        </Typography>
        <Grid container spacing={2}>
          {domains.map((domain) => (
            <Grid item xs={12} sm={6} md={3} key={domain.name}>
              <Card
                sx={{
                  background: 'rgba(25, 25, 25, 0.9)',
                  border: `2px solid ${domain.color}`,
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${domain.color}40`,
                  },
                }}
                onClick={() => setSelectedDomain(domain.name)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: domain.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      {React.cloneElement(domain.icon, { sx: { color: 'white', fontSize: 20 } })}
                    </Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                      {domain.name}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

          {/* Your Minted Agents */}
          <Card sx={{ 
            background: 'rgba(25, 25, 25, 0.9)', 
            border: '2px solid #2ed573',
            borderRadius: 3,
            mb: 4
          }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: '#2ed573', mb: 3, textAlign: 'center' }}>
                🧠 Your AI Agent Ecosystem
        </Typography>
              
              {/* Debug Info */}
              <Box sx={{ mb: 2, p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: '#00ffff', mb: 1 }}>
                  🔍 Debug Info: Total agents loaded: {mintedAgents.length}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                  Agent IDs: {mintedAgents.map(a => a.id).join(', ')}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={loadAgents}
                    sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                  >
                    🔄 Refresh Agents
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={createTestAgents}
                    sx={{ borderColor: '#2ed573', color: '#2ed573' }}
                  >
                    🧪 Create Test Agents
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      console.log('=== DATABASE DEBUG ===');
                      const allAgents = await agentService.getAgents();
                      console.log('All agents in database:', allAgents);
                      const userAgents = await agentService.getAgents(publicKey?.toBase58());
                      console.log('User agents:', userAgents);
                      
                      // Show agents that don't belong to current user
                      const otherAgents = allAgents.filter(agent => 
                        agent.owner && agent.owner !== publicKey?.toBase58()
                      );
                      console.log('Agents owned by others:', otherAgents);
                      
                      showSuccess(`Found ${allAgents.length} total agents, ${userAgents.length} user agents, ${otherAgents.length} other agents`);
                    }}
                    sx={{ borderColor: '#ffc107', color: '#ffc107' }}
                  >
                    🔍 Debug Database
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      if (!publicKey) {
                        showError('Please connect your wallet first');
                        return;
                      }
                      
                      try {
                        const allAgents = await agentService.getAgents();
                        const otherAgents = allAgents.filter(agent => 
                          agent.owner && agent.owner !== publicKey.toBase58()
                        );
                        
                        if (otherAgents.length === 0) {
                          showError('No agents to reassign');
                          return;
                        }
                        
                        // Reassign first 5 agents to current user
                        const agentsToReassign = otherAgents.slice(0, 5);
                        let successCount = 0;
                        
                        for (const agent of agentsToReassign) {
                          if (agent.id) {
                            const result = await agentService.reassignAgentOwnership(agent.id, publicKey.toBase58());
                            if (result.success) {
                              successCount++;
                            }
                          }
                        }
                        
                        showSuccess(`Reassigned ${successCount} agents to your wallet`);
                        await loadAgents(); // Reload agents
                      } catch (error) {
                        console.error('Error reassigning agents:', error);
                        showError('Failed to reassign agents');
                      }
                    }}
                    sx={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
                  >
                    🔄 Reassign Agents
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={backupUserAgents}
                    sx={{ borderColor: '#2ed573', color: '#2ed573' }}
                  >
                    💾 Backup Agents
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      if (mintedAgents.length > 0) {
                        const agent = mintedAgents[0];
                        await performAgentResearch(agent, 'artificial intelligence trends');
                      } else {
                        showError('No agents available for research');
                      }
                    }}
                    sx={{ borderColor: '#ff9ff3', color: '#ff9ff3' }}
                  >
                    🔬 Research Demo
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      try {
                        console.log('=== COMPREHENSIVE DEBUG ===');
                        console.log('Current agents:', mintedAgents);
                        console.log('Wallet connected:', connected);
                        console.log('Public key:', publicKey?.toBase58());
                        
                        if (mintedAgents.length === 0) {
                          showError('No agents available for testing');
                          return;
                        }
                        
                        const testAgent = mintedAgents[0];
                        console.log('Testing agent:', testAgent);
                        
                        // Test evolution info
                        const evolutionInfo = await agentService.getEvolutionInfo(testAgent.id!);
                        console.log('Evolution info:', evolutionInfo);
                        
                        // Test ownership - only wallet addresses are valid
                        const walletAddress = publicKey?.toBase58();
                        const isOwner = testAgent.owner === walletAddress;
                        
                        console.log('Ownership test:', {
                          agentOwner: testAgent.owner,
                          walletAddress,
                          isOwner
                        });
                        
                        let debugMessage = `Agent: ${testAgent.name} (${testAgent.type})\n`;
                        debugMessage += `Owner: ${testAgent.owner}\n`;
                        debugMessage += `Your Wallet: ${walletAddress}\n`;
                        debugMessage += `Ownership Valid: ${isOwner}\n`;
                        
                        if (evolutionInfo.success) {
                          debugMessage += `Can Evolve: Yes (Level ${evolutionInfo.nextTier?.level || 'unknown'})`;
                          showSuccess(debugMessage);
                        } else {
                          debugMessage += `Evolution Error: ${evolutionInfo.error}`;
                          showError(debugMessage);
                        }
                      } catch (error) {
                        console.error('Comprehensive debug error:', error);
                        showError(`Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                      }
                    }}
                    sx={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
                  >
                    🔍 Deep Debug
                  </Button>
                                    <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      try {
                        // Fix agent domains with proper validation
                        const updatedAgents = mintedAgents.map(agent => {
                          // Domain correction mapping
                          const domainCorrections: { [key: string]: string } = {
                            'CryptoView': 'Technical',
                            'CryptoAgent': 'Technical',
                            'BlockchainAgent': 'Technical',
                            'FitnessCoach': 'Health & Wellness',
                            'HealthAgent': 'Health & Wellness',
                            'LearningAssistant': 'Learning',
                            'EducationAgent': 'Learning'
                          };
                          
                          const correctDomain = domainCorrections[agent.name];
                          if (correctDomain && agent.domain !== correctDomain) {
                            console.log(`Correcting ${agent.name} domain from ${agent.domain} to ${correctDomain}`);
                            return { ...agent, domain: correctDomain };
                          }
                          return agent;
                        });

                        setMintedAgents(updatedAgents);
                        showSuccess('Agent domains corrected!');

                        console.log('Corrected agents:', updatedAgents);
                      } catch (error) {
                        console.error('Domain correction error:', error);
                        showError('Failed to correct agent domains');
                      }
                    }}
                    sx={{ borderColor: '#00ff00', color: '#00ff00' }}
                  >
                    🔧 Fix Agent Domains
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={async () => {
                      if (mintedAgents.length > 0) {
                        const agent = mintedAgents[0];
                        const result = await agentService.communicateWithAgent(
                          agent.id!, 
                          'Hello! How can you help me today?', 
                          publicKey?.toBase58() || ''
                        );
                        if (result.success) {
                          showSuccess('Agent communication successful!');
                          console.log('Agent response:', result.response);
                        }
                      } else {
                        showError('No agents available for communication');
                      }
                    }}
                    sx={{ borderColor: '#54a0ff', color: '#54a0ff' }}
                  >
                    💬 Test Communication
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={cleanupDuplicateAgents}
                    sx={{ borderColor: '#ff6b6b', color: '#ff6b6b' }}
                  >
                    🧹 Check Duplicates
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      const recommendations = getAgentRecommendations();
                      if (recommendations.length > 0) {
                        showInfo(`�� Recommendations:\n${recommendations.join('\n')}`);
                      } else {
                        showSuccess('Your agent ecosystem looks great!');
                      }
                    }}
                    sx={{ borderColor: '#ffd93d', color: '#ffd93d' }}
                  >
                    💡 Get Recommendations
                  </Button>
                </Box>
              </Box>
              
              <TableContainer component={Paper} sx={{ background: 'rgba(25, 25, 25, 0.5)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Agent</TableCell>
                      <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Domain</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Personality</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Level</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>XP</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#00ffff', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                    {/* Master Agents Rows */}
                    {mintedAgents.filter(agent => {
                      if (agent.type) return agent.type === 'master';
                      return agent.domain === 'Master' || agent.domain === 'Master Coordinator' || agent.capabilities;
                    }).map((agent) => (
                      <TableRow key={agent.id} sx={{ 
                        '&:hover': { background: 'rgba(255,255,255,0.05)' },
                        background: 'rgba(255,193,7,0.1)'
                      }}>
                  <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CrownIcon sx={{ color: '#ffc107', fontSize: 20 }} />
                            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                        {agent.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                            label="👑 Master Agent"
                      size="small"
                      sx={{
                              background: '#ffc107',
                              color: 'black',
                              fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                          <Chip 
                            label={agent.domain}
                            size="small"
                            sx={{
                              background: '#ffc107',
                              color: 'black',
                              fontWeight: 'bold'
                            }}
                          />
                  </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{agent.personality}</TableCell>
                  <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                      {agent.level}
                    </Typography>
                          </Box>
                  </TableCell>
                  <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                      {agent.xp}
                    </Typography>
                          </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={agent.status}
                            size="small"
                            color="success"
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleEvolveMasterAgent()}
                              sx={{ borderColor: '#ffc107', color: '#ffc107' }}
                            >
                              Evolve
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => setShowMasterAgentDialog(true)}
                              sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                            >
                              Coordinate
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Sub-Agents Rows */}
                    {mintedAgents.filter(agent => {
                      if (agent.type) return agent.type === 'sub';
                      return !(agent.domain === 'Master' || agent.domain === 'Master Coordinator' || agent.capabilities);
                    }).map((agent) => (
                      <TableRow key={agent.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.05)' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BrainIcon sx={{ color: '#00ffff', fontSize: 20 }} />
                            <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                              {agent.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="🤖 Sub-Agent"
                      size="small"
                      sx={{
                              background: '#00ffff',
                              color: 'black',
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={agent.domain}
                            size="small"
                            sx={{
                              background: getDomainColor(agent.domain),
                        color: 'white',
                              fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{agent.personality}</TableCell>
                  <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#2ed573', fontWeight: 'bold' }}>
                              {agent.level}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                              {agent.xp}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={agent.status}
                            size="small"
                            color={agent.status === 'active' ? 'success' : 'warning'}
                            sx={{ fontWeight: 'bold' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                              variant="outlined"
                              onClick={() => handleOpenSubAgentChat(agent)}
                      sx={{ borderColor: '#00ffff', color: '#00ffff' }}
                    >
                              Chat
                    </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleShowEvolutionInfo(agent)}
                              sx={{ borderColor: '#ff9ff3', color: '#ff9ff3', mr: 1 }}
                            >
                              Upgrade
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleShowAgentDetails(agent)}
                              sx={{ borderColor: '#00b894', color: '#00b894', mr: 1 }}
                            >
                              Details
                            </Button>
                            {agent.type === 'master' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setSelectedMasterAgent(agent);
                                  setShowDelegationDialog(true);
                                }}
                                sx={{ borderColor: '#ff9ff3', color: '#ff9ff3', mr: 1 }}
                              >
                                Delegate
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleShowEvolutionInfo(agent)}
                              sx={{ borderColor: '#ff9ff3', color: '#ff9ff3' }}
                            >
                              Upgrade
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleEditAgent(agent)}
                              sx={{ borderColor: '#2ed573', color: '#2ed573' }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleUpgradeAgent(agent)}
                              sx={{ borderColor: '#ffc107', color: '#ffc107' }}
                            >
                              Upgrade
                            </Button>
                          </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
              
              {/* Summary Stats */}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
                <Chip 
                  label={`👑 Master Agents: ${mintedAgents.filter(agent => {
                    if (agent.type) return agent.type === 'master';
                    return agent.domain === 'Master' || agent.domain === 'Master Coordinator' || agent.capabilities;
                  }).length}`}
                  sx={{ background: '#ffc107', color: 'black', fontWeight: 'bold' }}
                />
                <Chip 
                  label={`🤖 Sub-Agents: ${mintedAgents.filter(agent => {
                    if (agent.type) return agent.type === 'sub';
                    return !(agent.domain === 'Master' || agent.domain === 'Master Coordinator' || agent.capabilities);
                  }).length}`}
                  sx={{ background: '#00ffff', color: 'black', fontWeight: 'bold' }}
                />
                <Chip 
                  label={`📊 Total Agents: ${mintedAgents.length}`}
                  sx={{ background: '#2ed573', color: 'black', fontWeight: 'bold' }}
                />
      </Box>


            </CardContent>
          </Card>

          {/* Master Agent Management */}
          {mintedAgents.filter(agent => {
            if (agent.type) return agent.type === 'master';
            return agent.domain === 'Master' || agent.domain === 'Master Coordinator' || agent.capabilities;
          }).length > 0 && (
            <Card sx={{ 
              background: 'rgba(25, 25, 25, 0.9)', 
              border: '2px solid #ffc107',
              borderRadius: 3,
              mb: 4
            }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: '#ffc107', mb: 3, textAlign: 'center' }}>
                  👑 Master Agent Management
                </Typography>
                
                <Grid container spacing={3}>
                  {mintedAgents.filter(agent => {
                    if (agent.type) return agent.type === 'master';
                    return agent.domain === 'Master' || agent.domain === 'Master Coordinator' || agent.capabilities;
                  }).map((masterAgent, index) => (
                    <Grid item xs={12} md={6} key={masterAgent.id}>
                      <Card sx={{ 
                        background: 'rgba(255,193,7,0.1)', 
                        border: '2px solid #ffc107',
                        borderRadius: 2,
                        mb: 2
                      }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                            🤖 {masterAgent.name} (Level {masterAgent.level})
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            XP: {masterAgent.xp} / 100 XP to next level
                          </Typography>
                          
                          <Typography variant="h6" sx={{ color: '#2ed573', mb: 1 }}>
                            Capabilities:
                          </Typography>
                          <List dense>
                            {masterAgent.capabilities?.map((capability: string, capIndex: number) => (
                              <ListItem key={capIndex} sx={{ py: 0 }}>
                                <ListItemIcon>
                                  <CheckCircleIcon sx={{ color: '#2ed573', fontSize: 20 }} />
                                </ListItemIcon>
                                <ListItemText 
                                  primary={capability} 
                                  sx={{ color: 'text.secondary' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                          
                          <Typography variant="body2" sx={{ color: '#ffc107', mt: 2 }}>
                            Domain: {masterAgent.domain}
                          </Typography>
                          
                          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleShowEvolutionInfo(masterAgent)}
                              sx={{
                                background: 'linear-gradient(45deg, #ffc107, #ff9800)',
                                color: 'black',
                                fontWeight: 'bold',
                                flex: 1
                              }}
                            >
                              🚀 Upgrade {masterAgent.name}
                            </Button>
                            
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => setShowMasterAgentDialog(true)}
                              sx={{
                                borderColor: '#00ffff',
                                color: '#00ffff',
                                flex: 1
                              }}
                            >
                              🤖 Coordinate
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Dialogs */}
      {/* Master Agent Coordination Dialog */}
      <Dialog 
        open={showMasterAgentDialog} 
        onClose={() => setShowMasterAgentDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #00ffff, #2ed573)',
          color: 'black',
          textAlign: 'center'
        }}>
          🤖 Master Agent Coordination
        </DialogTitle>
        <DialogContent sx={{ background: 'rgba(25, 25, 25, 0.9)', pt: 3 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Enter a task for your Master Agent to coordinate with your specialized agents:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={coordinationTask}
            onChange={(e) => setCoordinationTask(e.target.value)}
            placeholder="e.g., Help me learn German with my learning agents"
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: 'white' }
            }}
          />
          <Button
            variant="contained"
            onClick={handleCoordinateAgents}
            disabled={loading || !coordinationTask.trim()}
            sx={{
              background: 'linear-gradient(45deg, #00ffff, #2ed573)',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(45deg, #2ed573, #00ffff)',
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)'
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'black' }} /> : 'Coordinate Agents'}
          </Button>
          
          {coordinationResponse && (
            <Box sx={{ mt: 3, p: 2, background: 'rgba(0,255,255,0.1)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: 'white', whiteSpace: 'pre-line' }}>
                {coordinationResponse}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ background: 'rgba(25, 25, 25, 0.9)' }}>
          <Button onClick={() => setShowMasterAgentDialog(false)} sx={{ color: '#00ffff' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Minting Dialog */}
      <Dialog open={showMintDialog} onClose={() => setShowMintDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #ff6b6b, #ffc107)',
          color: 'white',
          textAlign: 'center'
        }}>
          Mint New AI Agent
        </DialogTitle>
        <DialogContent sx={{ background: 'rgba(25, 25, 25, 0.9)', pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Agent Name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { color: 'white' }
                }}
                InputLabelProps={{
                  sx: { color: 'text.secondary' }
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'text.secondary' }}>Domain</InputLabel>
                <Select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  sx={{ color: 'white' }}
                >
                  {domains.map((domain) => (
                    <MenuItem key={domain.name} value={domain.name}>
                      {domain.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: 'text.secondary' }}>Personality</InputLabel>
                <Select
                  value={agentPersonality}
                  onChange={(e) => setAgentPersonality(e.target.value)}
                  sx={{ color: 'white' }}
                >
                  {personalities.map((personality) => (
                    <MenuItem key={personality} value={personality}>
                      {personality}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder={selectedAgentType === 'master' ? 
                  "Your central coordinator agent that manages all sub-agents" : 
                  "Specialized agent for your chosen domain"
                }
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { color: 'white' }
                }}
                InputLabelProps={{
                  sx: { color: 'text.secondary' }
                }}
              />
            </Grid>

            {/* Cost Display */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: selectedAgentType === 'master' ? 'rgba(0,255,255,0.1)' : 'rgba(255,193,7,0.1)',
                border: selectedAgentType === 'master' ? '2px solid #00ffff' : '2px solid #ffc107',
                borderRadius: 2
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ 
                    color: selectedAgentType === 'master' ? '#00ffff' : '#ffc107',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    💰 Mint Cost: {calculateMintCost()} DMT
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 1 }}>
                    {selectedAgentType === 'master' ? 
                      'Master Agent - Your central coordinator' : 
                      'Sub-Agent - Specialized domain agent'
                    }
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ background: 'rgba(25, 25, 25, 0.9)', p: 2 }}>
          <Button onClick={() => setShowMintDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button
            onClick={handleMintAgent}
            disabled={loading || !agentName.trim() || !selectedDomain}
            sx={{
              background: 'linear-gradient(45deg, #ff6b6b, #ffc107)',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(45deg, #ffc107, #ff6b6b)',
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)'
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Mint Agent'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sub-Agent Chat Dialog */}
      <Dialog
        open={showSubAgentChat}
        onClose={() => setShowSubAgentChat(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          color: '#00ffff', 
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">🤖 Chat with {selectedSubAgent?.name}</Typography>
            {isSpeaking && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} sx={{ color: '#00ffff' }} />
                <Typography variant="caption" sx={{ color: '#00ffff' }}>
                  Speaking...
                </Typography>
              </Box>
            )}
          </Box>
          
          {/* Voice Controls */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant={voiceEnabled ? "contained" : "outlined"}
              onClick={toggleVoice}
              sx={{
                background: voiceEnabled ? 'linear-gradient(45deg, #00ffff, #00bcd4)' : 'transparent',
                color: voiceEnabled ? 'black' : '#00ffff',
                borderColor: '#00ffff',
                minWidth: 'auto',
                px: 2
              }}
            >
              {voiceEnabled ? '🔊' : '🔇'}
            </Button>
            
            {isSpeaking && (
              <Button
                size="small"
                variant="outlined"
                onClick={stopSpeaking}
                sx={{
                  borderColor: '#ff6b6b',
                  color: '#ff6b6b',
                  minWidth: 'auto',
                  px: 2
                }}
              >
                ⏹️
              </Button>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ background: 'rgba(0, 0, 0, 0.9)' }}>
          <Box sx={{ height: 400, overflowY: 'auto', p: 2, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
            {subAgentChatHistory.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 1,
                    borderRadius: 2,
                    background: msg.role === 'user' ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                  }}
                >
                  {msg.message}
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                <CircularProgress size={20} sx={{ color: 'white' }} />
              </Box>
            )}
          </Box>
          
          {/* Message Input with Voice */}
          <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={subAgentMessage}
              onChange={(e) => setSubAgentMessage(e.target.value)}
              placeholder={`Message ${selectedSubAgent?.name}... ${voiceEnabled ? '(or speak your message)' : ''}`}
              sx={{ 
                '& .MuiOutlinedInput-root': { color: 'white' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: isListening ? '#00ffff' : 'rgba(255,255,255,0.3)' }
              }}
              disabled={isListening}
            />
            
            {/* Voice Input Button */}
            <Button
              variant={isListening ? "contained" : "outlined"}
              onClick={startListening}
              disabled={!recognition || isSpeaking}
              sx={{
                background: isListening ? 'linear-gradient(45deg, #ff6b6b, #ff8e8e)' : 'transparent',
                color: isListening ? 'white' : '#00ffff',
                borderColor: isListening ? '#ff6b6b' : '#00ffff',
                minWidth: 'auto',
                px: 2,
                py: 2,
                height: 'fit-content',
                '&:hover': {
                  background: isListening ? 'linear-gradient(45deg, #ff8e8e, #ff6b6b)' : 'rgba(0, 255, 255, 0.1)'
                }
              }}
            >
              {isListening ? '🎤' : '🎤'}
            </Button>
          </Box>
          
          {/* Send Button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSendMessageToSubAgent}
            disabled={loading || !subAgentMessage.trim() || isListening}
            sx={{
              background: 'linear-gradient(45deg, #00ffff 30%, #00bcd4 90%)',
              color: '#000',
              mt: 2,
              py: 1.5,
              '&:hover': {
                background: 'linear-gradient(45deg, #00bcd4 30%, #00ffff 90%)',
              },
              '&:disabled': {
                background: 'rgba(0, 255, 255, 0.3)',
                color: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'black' }} /> : 'Send Message'}
          </Button>
          
          {/* Voice Status */}
          {voiceEnabled && (
            <Box sx={{ mt: 2, p: 1, background: 'rgba(0, 255, 255, 0.1)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#00ffff' }}>
                🔊 Voice enabled - {selectedSubAgent?.name} will speak responses
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ background: 'rgba(0, 0, 0, 0.9)' }}>
          <Button
            onClick={() => {
              setShowSubAgentChat(false);
              stopSpeaking(); // Stop any ongoing speech
            }}
            sx={{ color: '#00ffff' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Data Storage & Monetization Info */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff',
        borderRadius: 2,
        mb: 3
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#00ffff', mb: 2, textAlign: 'center' }}>
            💾 Data Storage & 💰 Monetization System
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#2ed573', mb: 1 }}>
                🗄️ Data Storage:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Firebase Firestore Database" 
                    secondary="Real-time, scalable cloud storage"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Automatic Backups" 
                    secondary="Daily backups to prevent data loss"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Agent Memory" 
                    secondary="Persistent conversation history"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Research Database" 
                    secondary="Stored research results and sources"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#ffc107', mb: 1 }}>
                💰 Monetization Features:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon sx={{ color: '#ffc107' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Agent Upgrades" 
                    secondary="Exponential cost scaling by level"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon sx={{ color: '#ffc107' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="RAG Enhancement" 
                    secondary="Advanced research capabilities"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon sx={{ color: '#ffc107' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Voice Features" 
                    secondary="Premium voice interaction"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon sx={{ color: '#ffc107' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Agent Trading" 
                    secondary="Marketplace for agent exchange"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#00ffff', mb: 1 }}>
              🎤 Voice Commands Available:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              "Create master agent", "Upgrade agent", "Chat with agent", "Research AI trends", "Backup agents"
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Task Delegation & Agent Management */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #00ffff',
        borderRadius: 2,
        mb: 3
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#00ffff', mb: 2, textAlign: 'center' }}>
            🎯 Task Delegation & Agent Management
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#ffc107', mb: 2 }}>
                📋 Quick Task Delegation:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter your task here... (e.g., 'Help me with business research' or 'Create a fitness plan')"
                value={delegationTask}
                onChange={(e) => setDelegationTask(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { color: 'white' }
                }}
              />
              <Button
                variant="contained"
                onClick={() => setShowDelegationDialog(true)}
                disabled={!delegationTask.trim()}
                sx={{
                  background: 'linear-gradient(45deg, #00ffff, #2ed573)',
                  color: 'black',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #2ed573, #00ffff)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                Delegate Task
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#ffc107', mb: 2 }}>
                🤖 Available Master Agents:
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {mintedAgents.filter(agent => agent.type === 'master').map((agent) => (
                  <Box key={agent.id} sx={{ 
                    p: 1, 
                    mb: 1, 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(255,255,255,0.2)' }
                  }}
                  onClick={() => {
                    setSelectedMasterAgent(agent);
                    setShowDelegationDialog(true);
                  }}
                  >
                    <Typography variant="body2" sx={{ color: '#ffc107', fontWeight: 'bold' }}>
                      {agent.name} (Level {agent.level})
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                      {agent.domain} • {agent.capabilities?.slice(0, 2).join(', ')}
                    </Typography>
                  </Box>
                ))}
                {mintedAgents.filter(agent => agent.type === 'master').length === 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    No Master Agents available. Create one to start delegating tasks!
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* How Agents Work Together */}
      <Card sx={{ 
        background: 'rgba(25, 25, 25, 0.9)', 
        border: '2px solid #2ed573',
        borderRadius: 2,
        mb: 3
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#2ed573', mb: 2, textAlign: 'center' }}>
            🤝 How Agents Work Together
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#00ffff', mb: 1 }}>
                🎯 Intelligent Delegation:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Task Analysis" 
                    secondary="AI analyzes your request and identifies the best agents"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Agent Selection" 
                    secondary="Selects highest-level agents for the task domain"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#2ed573' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Team Assembly" 
                    secondary="Creates optimal agent combinations for complex tasks"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ color: '#ffc107', mb: 1 }}>
                🧠 Agent Communication:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon sx={{ color: '#ffc107' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Contextual Responses" 
                    secondary="Short, relevant responses based on your message"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon sx={{ color: '#ffc107' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Voice Interaction" 
                    secondary="Agents can speak and listen to voice commands"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StarIcon sx={{ color: '#ffc107' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Memory & Learning" 
                    secondary="Agents remember conversations and learn from interactions"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: '#00ffff', mb: 1 }}>
              🚀 Evolution System:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              • Agents gain XP from interactions and tasks • Level up unlocks new capabilities • Evolution stages: Basic → Advanced → Expert → Master → Legendary • Detailed feedback shows exactly what evolved and why
            </Typography>
          </Box>
        </CardContent>
      </Card>

             {/* Agent Details Dialog */}
       <Dialog
         open={showAgentDetails}
         onClose={() => setShowAgentDetails(false)}
         maxWidth="lg"
         fullWidth
       >
         <DialogTitle sx={{ 
           background: 'linear-gradient(45deg, #00b894, #00cec9)',
           color: 'white',
           textAlign: 'center'
         }}>
           Individual Agent Details: {selectedAgentDetails?.name}
         </DialogTitle>
         <DialogContent sx={{ background: 'rgba(25, 25, 25, 0.9)', pt: 3 }}>
           {selectedAgentDetails && (
             <Grid container spacing={3}>
               <Grid item xs={12} md={6}>
                 <Typography variant="h6" sx={{ color: '#00b894', mb: 2 }}>
                   🧠 LLM Configuration
                 </Typography>
                 <Box sx={{ p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1, mb: 2 }}>
                   <Typography variant="body2" sx={{ color: '#00cec9', mb: 1 }}>
                     Model: {selectedAgentDetails.llmConfig?.model || 'GPT-3.5'}
                   </Typography>
                   <Typography variant="body2" sx={{ color: '#74b9ff', mb: 1 }}>
                     Version: {selectedAgentDetails.llmConfig?.version || 'latest'}
                   </Typography>
                   <Typography variant="body2" sx={{ color: '#a29bfe', mb: 1 }}>
                     Temperature: {selectedAgentDetails.llmConfig?.temperature || 0.7}
                   </Typography>
                   <Typography variant="body2" sx={{ color: '#fd79a8', mb: 1 }}>
                     Max Tokens: {selectedAgentDetails.llmConfig?.maxTokens || 4096}
                   </Typography>
                   <Typography variant="body2" sx={{ color: '#fdcb6e' }}>
                     Context Window: {selectedAgentDetails.llmConfig?.contextWindow || 4096}
                   </Typography>
                 </Box>
               </Grid>
               
               <Grid item xs={12} md={6}>
                 <Typography variant="h6" sx={{ color: '#00b894', mb: 2 }}>
                   📚 RAG Configuration
                 </Typography>
                 <Box sx={{ p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1, mb: 2 }}>
                   <Typography variant="body2" sx={{ color: '#00cec9', mb: 1 }}>
                     Data Source: {selectedAgentDetails.ragConfig?.dataSource || 'Default'}
                   </Typography>
                   <Typography variant="body2" sx={{ color: '#74b9ff', mb: 1 }}>
                     Vector DB: {selectedAgentDetails.ragConfig?.vectorDB || 'Default'}
                   </Typography>
                   <Typography variant="body2" sx={{ color: '#a29bfe', mb: 1 }}>
                     IPFS Hash: {selectedAgentDetails.ragConfig?.ipfsHash || 'None'}
                   </Typography>
                   <Typography variant="body2" sx={{ color: '#fd79a8', mb: 1 }}>
                     Knowledge Base: {selectedAgentDetails.ragConfig?.knowledgeBase?.length || 0} topics
                   </Typography>
                   <Typography variant="body2" sx={{ color: '#fdcb6e' }}>
                     Last Updated: {selectedAgentDetails.ragConfig?.lastUpdated || 'Never'}
                   </Typography>
                 </Box>
               </Grid>

            <Grid item xs={12}>
                 <Typography variant="h6" sx={{ color: '#00b894', mb: 2 }}>
                   📊 Individual Statistics
                </Typography>
                 <Box sx={{ p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1, mb: 2 }}>
                   <Grid container spacing={2}>
                     <Grid item xs={6} md={3}>
                       <Typography variant="body2" sx={{ color: '#00cec9' }}>
                         Total Upgrades: {selectedAgentDetails.individualStats?.totalUpgrades || 0}
                       </Typography>
            </Grid>
                     <Grid item xs={6} md={3}>
                       <Typography variant="body2" sx={{ color: '#74b9ff' }}>
                         DMT Spent: {selectedAgentDetails.individualStats?.totalDmtSpent || 0}
                       </Typography>
          </Grid>
                     <Grid item xs={6} md={3}>
                       <Typography variant="body2" sx={{ color: '#a29bfe' }}>
                         Conversations: {selectedAgentDetails.individualStats?.uniqueConversations || 0}
                       </Typography>
                     </Grid>
                     <Grid item xs={6} md={3}>
                       <Typography variant="body2" sx={{ color: '#fd79a8' }}>
                         Expertise: {selectedAgentDetails.individualStats?.domainExpertise || 0}%
                       </Typography>
                     </Grid>
                   </Grid>
                 </Box>
               </Grid>

               <Grid item xs={12}>
                 <Typography variant="h6" sx={{ color: '#00b894', mb: 2 }}>
                   🚀 Evolution History
                 </Typography>
                 <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                   {selectedAgentDetails.evolutionHistory?.map((evolution, index) => (
                     <Box key={index} sx={{ p: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, mb: 1 }}>
                       <Typography variant="body2" sx={{ color: '#00cec9', mb: 1 }}>
                         {evolution.timestamp} - Level {evolution.previousLevel} → {evolution.newLevel}
                       </Typography>
                       <Typography variant="body2" sx={{ color: '#74b9ff', mb: 1 }}>
                         LLM: {evolution.llmUpgrade} | DMT: {evolution.dmtSpent}
                       </Typography>
                       <Typography variant="body2" sx={{ color: '#a29bfe', fontSize: '0.8rem' }}>
                         {evolution.reason}
                       </Typography>
                     </Box>
                   )) || (
                     <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                       No evolution history yet
                     </Typography>
                   )}
                 </Box>
               </Grid>
             </Grid>
           )}
        </DialogContent>
         <DialogActions sx={{ background: 'rgba(25, 25, 25, 0.9)', p: 2 }}>
           <Button onClick={() => setShowAgentDetails(false)} sx={{ color: 'text.secondary' }}>
             Close
           </Button>
         </DialogActions>
       </Dialog>

       {/* Evolution Dialog */}
       <Dialog
         open={showEvolutionDialog}
         onClose={() => setShowEvolutionDialog(false)}
         maxWidth="md"
         fullWidth
       >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #ff6b6b, #ffc107)',
          color: 'white',
          textAlign: 'center'
        }}>
          Upgrade {selectedAgentForEvolution?.name} with DMT
        </DialogTitle>
        <DialogContent sx={{ background: 'rgba(25, 25, 25, 0.9)', pt: 3 }}>
          {evolutionInfo && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#ffc107', mb: 2 }}>
                  Current Status: {evolutionInfo.currentTier?.llmUpgrade}
                </Typography>
                
                {evolutionInfo.nextTier && (
                  <>
                    <Typography variant="h6" sx={{ color: '#00ffff', mb: 2 }}>
                      Next Upgrade: {evolutionInfo.nextTier.llmUpgrade}
                    </Typography>
                    
                    <Box sx={{ mb: 2, p: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ color: '#ffc107', mb: 1 }}>
                        💰 DMT Cost: {evolutionInfo.nextTier.dmtRequired} DMT
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#00ffff', mb: 1 }}>
                        🧠 LLM: {evolutionInfo.currentTier?.llmUpgrade} → {evolutionInfo.nextTier.llmUpgrade}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#2ed573', mb: 1 }}>
                        🎤 Voice: {evolutionInfo.nextTier.voiceCapabilities.join(', ')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#ff9ff3', mb: 1 }}>
                        ⚡ Superpowers: {evolutionInfo.nextTier.superpowers.join(', ')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {evolutionInfo.nextTier.description}
                      </Typography>
                    </Box>
                  </>
                )}
                
                {!evolutionInfo.nextTier && (
                  <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
                    This agent has reached maximum evolution level!
                  </Typography>
                )}
              </Grid>
              
              {evolutionInfo.nextTier && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="DMT Amount"
                    type="number"
                    value={dmtAmount}
                    onChange={(e) => setDmtAmount(Number(e.target.value))}
                    sx={{ mb: 2 }}
                    InputProps={{
                      sx: { color: 'white' }
                    }}
                    InputLabelProps={{
                      sx: { color: 'text.secondary' }
                    }}
                    helperText={`Required: ${evolutionInfo.nextTier.dmtRequired} DMT`}
                    FormHelperTextProps={{
                      sx: { color: dmtAmount >= evolutionInfo.nextTier.dmtRequired ? '#2ed573' : '#ff6b6b' }
                    }}
                  />
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ background: 'rgba(25, 25, 25, 0.9)', p: 2 }}>
          <Button onClick={() => setShowEvolutionDialog(false)} sx={{ color: 'text.secondary' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleEvolveWithDMT}
            disabled={loading || !dmtAmount}
            sx={{
              background: 'linear-gradient(45deg, #ff6b6b, #ffc107)',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(45deg, #ffc107, #ff6b6b)',
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)'
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Upgrade'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delegation Dialog */}
      <Dialog
        open={showDelegationDialog}
        onClose={() => setShowDelegationDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #ff6b6b, #ffc107)',
          color: 'white',
          textAlign: 'center'
        }}>
          Create New Agent for Task
        </DialogTitle>
        <DialogContent sx={{ background: 'rgba(25, 25, 25, 0.9)', pt: 3 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Enter a task for your Master Agent to coordinate with your specialized agents:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={delegationTask}
            onChange={(e) => setDelegationTask(e.target.value)}
            placeholder="e.g., Help me learn German with my learning agents"
            sx={{ mb: 2 }}
            InputProps={{
              sx: { color: 'white' }
            }}
          />
          <Button
            variant="contained"
            onClick={handleDelegationTask}
            disabled={loading || !delegationTask.trim()}
            sx={{
              background: 'linear-gradient(45deg, #00ffff, #2ed573)',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(45deg, #2ed573, #00ffff)',
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)'
              }
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'black' }} /> : 'Delegate Task'}
          </Button>
          
          {delegationResult && (
            <Box sx={{ mt: 3, p: 2, background: 'rgba(0,255,255,0.1)', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ color: 'white', whiteSpace: 'pre-line' }}>
                {delegationResult}
              </Typography>
    </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ background: 'rgba(25, 25, 25, 0.9)' }}>
          <Button onClick={() => setShowDelegationDialog(false)} sx={{ color: '#00ffff' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestMinting; 