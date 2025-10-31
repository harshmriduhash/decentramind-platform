'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  status: 'stable' | 'monitoring' | 'critical';
  lastVisit: string;
}

interface ChatWithAgentProps {
  selectedPatient: Patient | null;
}

const ChatWithAgent: React.FC<ChatWithAgentProps> = ({ selectedPatient }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I\'m your AI Care Assistant. How can I help you today?',
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = {
        id: messages.length + 2,
        text: 'Thank you for your message. I\'m analyzing your request and will provide assistance shortly.',
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">AI Care Assistant</h2>
        {selectedPatient && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-700/30">
            <p className="text-sm text-gray-400">Chatting for:</p>
            <p className="text-white font-medium">{selectedPatient.name}</p>
          </div>
        )}
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
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-lg text-left hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="text-2xl mb-2">📋</div>
          <h3 className="text-white font-medium mb-1">Schedule Appointment</h3>
          <p className="text-gray-400 text-sm">Book a consultation</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-lg text-left hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="text-2xl mb-2">💊</div>
          <h3 className="text-white font-medium mb-1">Medication Reminder</h3>
          <p className="text-gray-400 text-sm">Set up alerts</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/30 rounded-lg text-left hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="text-2xl mb-2">📊</div>
          <h3 className="text-white font-medium mb-1">Health Report</h3>
          <p className="text-gray-400 text-sm">View analytics</p>
        </motion.button>
      </div>
    </div>
  );
};

export default ChatWithAgent;
