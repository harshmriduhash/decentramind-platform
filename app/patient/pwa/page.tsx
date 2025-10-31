'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePatientAccess } from '../../hooks/useRoleCheck';
import { 
  MessageCircle, 
  Calendar, 
  Heart, 
  Activity, 
  Thermometer, 
  Weight,
  Droplets,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Stethoscope,
  Pill,
  FileText,
  Bell,
  Settings,
  Download,
  Share,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Send,
  Plus,
  Filter,
  Search,
  Shield
} from 'lucide-react';

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  nextAppointment?: {
    date: Date;
    time: string;
    doctor: string;
    type: string;
  };
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    oxygenSaturation: number;
    lastUpdated: Date;
  };
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    nextRefill: Date;
  }[];
  conditions: string[];
  recentNotes: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type?: 'text' | 'appointment' | 'medication' | 'vital';
}

const PatientPWA: React.FC = () => {
  const { user, isLoading: roleLoading, isAuthorized } = usePatientAccess();
  const [activeTab, setActiveTab] = useState('chat');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      content: 'Hello! I\'m your Care Orchestrator AI assistant. I\'m here to help you with your health questions, appointment scheduling, and medication reminders. How can I assist you today?',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Show loading while checking role
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your health portal...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">You need patient or admin access to view this page.</p>
          <div className="space-x-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mock patient data
  useEffect(() => {
    const mockPatientData: PatientData = {
      id: 'patient-123',
      name: 'John Smith',
      age: 45,
      gender: 'male',
      nextAppointment: {
        date: new Date('2024-01-20'),
        time: '10:00 AM',
        doctor: 'Dr. Sarah Johnson',
        type: 'Follow-up Consultation'
      },
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        weight: 180,
        oxygenSaturation: 98,
        lastUpdated: new Date('2024-01-15')
      },
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          nextRefill: new Date('2024-02-15')
        },
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          nextRefill: new Date('2024-02-20')
        }
      ],
      conditions: ['Hypertension', 'Diabetes Type 2'],
      recentNotes: [
        'Blood pressure is well controlled',
        'Continue current medication regimen',
        'Schedule follow-up in 3 months'
      ],
      emergencyContact: {
        name: 'Jane Smith',
        phone: '(555) 123-4567',
        relationship: 'Spouse'
      }
    };

    setTimeout(() => {
      setPatientData(mockPatientData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        content: newMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Simulate AI response based on message content
      setTimeout(() => {
        let aiResponse = '';
        const lowerMessage = newMessage.toLowerCase();

        if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
          aiResponse = 'I can help you schedule an appointment. Your next appointment is on January 20th at 10:00 AM with Dr. Sarah Johnson. Would you like to reschedule or book a new appointment?';
        } else if (lowerMessage.includes('medication') || lowerMessage.includes('medicine')) {
          aiResponse = 'I can help you with medication information. You\'re currently taking Metformin (500mg twice daily) and Lisinopril (10mg once daily). Your next refills are due on February 15th and February 20th respectively.';
        } else if (lowerMessage.includes('blood pressure') || lowerMessage.includes('vitals')) {
          aiResponse = 'Your latest vitals show: Blood Pressure 120/80, Heart Rate 72 bpm, Temperature 98.6°F, Weight 180 lbs, and Oxygen Saturation 98%. These readings are within normal ranges.';
        } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
          aiResponse = 'For medical emergencies, please call 911 immediately. Your emergency contact is Jane Smith (Spouse) at (555) 123-4567.';
        } else {
          aiResponse = 'I understand your question. Let me help you with that. I can assist with appointment scheduling, medication reminders, health information, and general questions about your care.';
        }

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatTab messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} />;
      case 'appointments':
        return <AppointmentsTab patientData={patientData} />;
      case 'health':
        return <HealthTab patientData={patientData} />;
      case 'medications':
        return <MedicationsTab patientData={patientData} />;
      case 'profile':
        return <ProfileTab patientData={patientData} />;
      default:
        return <ChatTab messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} sendMessage={sendMessage} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your health portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏥</div>
              <div>
                <h1 className="text-xl font-bold text-white">Sunrise Hospital</h1>
                <p className="text-sm text-gray-300">Patient Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white"
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Patient Welcome */}
        {patientData && (
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Welcome back, {patientData.name}!</h2>
                  <p className="text-gray-300">How can I help you with your health today?</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-green-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

// Tab Components
const ChatTab: React.FC<{
  messages: ChatMessage[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
}> = ({ messages, newMessage, setNewMessage, sendMessage }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Health Assistant</h2>
        <p className="text-gray-400">Ask questions about your health, medications, or appointments</p>
      </div>

      {/* Chat Messages */}
      <div className="bg-slate-700/50 rounded-lg border border-slate-600/50 h-96 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-600 text-white'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-600/50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about your health, medications, or appointments..."
              className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setNewMessage('I need to schedule an appointment')}
            className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white text-sm text-center"
          >
            <Calendar className="w-5 h-5 mx-auto mb-2" />
            Schedule Appointment
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setNewMessage('What medications am I taking?')}
            className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white text-sm text-center"
          >
            <Pill className="w-5 h-5 mx-auto mb-2" />
            Check Medications
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setNewMessage('What are my current vitals?')}
            className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white text-sm text-center"
          >
            <Heart className="w-5 h-5 mx-auto mb-2" />
            View Vitals
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setNewMessage('I have an emergency')}
            className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-sm text-center border border-red-500/30"
          >
            <AlertCircle className="w-5 h-5 mx-auto mb-2" />
            Emergency
          </motion.button>
        </div>
      </div>
    </div>
  );
};

const AppointmentsTab: React.FC<{ patientData: PatientData | null }> = ({ patientData }) => {
  if (!patientData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Appointments</h2>
        <p className="text-gray-400">Manage your upcoming appointments and medical visits</p>
      </div>

      {/* Next Appointment */}
      {patientData.nextAppointment && (
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-lg font-semibold text-white mb-4">Next Appointment</h3>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-lg">
                {patientData.nextAppointment.date.toLocaleDateString()} at {patientData.nextAppointment.time}
              </div>
              <div className="text-gray-300">{patientData.nextAppointment.doctor}</div>
              <div className="text-sm text-gray-400">{patientData.nextAppointment.type}</div>
            </div>
            <div className="text-right">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
              >
                Reschedule
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-slate-700/50 rounded-xl border border-slate-600/50 text-left hover:border-slate-500/50 transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Plus className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-white font-semibold">Schedule New Appointment</div>
              <div className="text-sm text-gray-400">Book a consultation or follow-up</div>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-6 bg-slate-700/50 rounded-xl border border-slate-600/50 text-left hover:border-slate-500/50 transition-all duration-300"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-white font-semibold">Appointment History</div>
              <div className="text-sm text-gray-400">View past appointments</div>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

const HealthTab: React.FC<{ patientData: PatientData | null }> = ({ patientData }) => {
  if (!patientData) return null;

  const vitals = [
    {
      label: 'Blood Pressure',
      value: patientData.vitals.bloodPressure,
      unit: 'mmHg',
      icon: Heart,
      color: 'text-red-400',
      status: 'normal'
    },
    {
      label: 'Heart Rate',
      value: patientData.vitals.heartRate,
      unit: 'bpm',
      icon: Activity,
      color: 'text-green-400',
      status: 'normal'
    },
    {
      label: 'Temperature',
      value: patientData.vitals.temperature,
      unit: '°F',
      icon: Thermometer,
      color: 'text-orange-400',
      status: 'normal'
    },
    {
      label: 'Weight',
      value: patientData.vitals.weight,
      unit: 'lbs',
      icon: Weight,
      color: 'text-blue-400',
      status: 'normal'
    },
    {
      label: 'Oxygen Saturation',
      value: patientData.vitals.oxygenSaturation,
      unit: '%',
      icon: Droplets,
      color: 'text-cyan-400',
      status: 'normal'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Health Overview</h2>
        <p className="text-gray-400">Monitor your vital signs and health metrics</p>
      </div>

      {/* Vitals */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Current Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vitals.map((vital, index) => {
            const Icon = vital.icon;
            return (
              <div key={index} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-5 h-5 ${vital.color}`} />
                    <span className="text-sm text-gray-300">{vital.label}</span>
                  </div>
                  <span className="text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full">
                    {vital.status}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {vital.value} <span className="text-sm text-gray-400">{vital.unit}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {patientData.vitals.lastUpdated.toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conditions */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Health Conditions</h3>
        <div className="space-y-3">
          {patientData.conditions.map((condition, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <Stethoscope className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">{condition}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Notes */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Notes</h3>
        <div className="space-y-3">
          {patientData.recentNotes.map((note, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
              <FileText className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-white">{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MedicationsTab: React.FC<{ patientData: PatientData | null }> = ({ patientData }) => {
  if (!patientData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Medications</h2>
        <p className="text-gray-400">Manage your medications and refill reminders</p>
      </div>

      <div className="space-y-4">
        {patientData.medications.map((medication, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Pill className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">{medication.name}</div>
                  <div className="text-gray-300">{medication.dosage}</div>
                  <div className="text-sm text-gray-400">{medication.frequency}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Next Refill</div>
                <div className="text-white font-medium">{medication.nextRefill.toLocaleDateString()}</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                >
                  Request Refill
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Medication Reminders */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Medication Reminders</h3>
        <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-yellow-400" />
            <div>
              <div className="text-white font-semibold">Daily Reminders</div>
              <div className="text-sm text-gray-400">Get notified when it's time to take your medications</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Enable notifications</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileTab: React.FC<{ patientData: PatientData | null }> = ({ patientData }) => {
  if (!patientData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
        <p className="text-gray-400">Manage your personal information and preferences</p>
      </div>

      {/* Personal Information */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <div className="text-white">{patientData.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
            <div className="text-white">{patientData.age} years old</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
            <div className="text-white capitalize">{patientData.gender}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Patient ID</label>
            <div className="text-white">{patientData.id}</div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact</h3>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <Phone className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <div className="text-white font-semibold">{patientData.emergencyContact.name}</div>
            <div className="text-gray-300">{patientData.emergencyContact.phone}</div>
            <div className="text-sm text-gray-400">{patientData.emergencyContact.relationship}</div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Email notifications</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">SMS reminders</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Appointment reminders</span>
            <div className="w-12 h-6 bg-green-500 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPWA;
