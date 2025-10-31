'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PatientChatProps {
  hospitalSlug: string;
}

const PatientChat: React.FC<PatientChatProps> = ({ hospitalSlug }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello! I'm your AI Care Assistant for ${hospitalSlug}. How can I help you today?`,
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString(),
      type: 'text'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        'I understand your concern. Let me help you with that.',
        'That\'s a great question. Based on your medical history, I recommend...',
        'I\'ve noted your symptoms. Would you like me to schedule an appointment?',
        'Thank you for sharing that information. Here\'s what I suggest...'
      ];
      
      const agentResponse = {
        id: messages.length + 2,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString(),
        type: 'text'
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: 'Schedule Appointment', icon: '📅', action: () => setMessage('I would like to schedule an appointment') },
    { text: 'Ask About Symptoms', icon: '🤒', action: () => setMessage('I have some symptoms I\'d like to discuss') },
    { text: 'Medication Question', icon: '💊', action: () => setMessage('I have a question about my medication') },
    { text: 'Emergency Help', icon: '🚨', action: () => setMessage('I need emergency assistance') }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Care Assistant</h2>
          <p className="text-gray-400">Hospital: {hospitalSlug}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Online</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 h-96 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : 'bg-slate-700/50 text-gray-100'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className="p-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-lg text-left hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="text-lg mb-1">{action.icon}</div>
            <p className="text-white text-sm font-medium">{action.text}</p>
          </motion.button>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="w-full px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 resize-none"
            rows={3}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-all duration-300"
        >
          Send
        </motion.button>
      </div>

      {/* Emergency Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
      >
        <div className="flex items-center space-x-2">
          <span className="text-red-400 text-lg">🚨</span>
          <div>
            <p className="text-red-400 font-medium">Emergency Notice</p>
            <p className="text-red-300 text-sm">
              If you're experiencing a medical emergency, please call 911 immediately or go to your nearest emergency room.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PatientChat;
