'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ApiStatusCard: React.FC = () => {
  const [apiServices] = useState([
    {
      id: 1,
      name: 'Authentication API',
      endpoint: '/api/auth',
      status: 'online',
      responseTime: '45ms',
      uptime: '99.9%',
      lastCheck: '2 minutes ago'
    },
    {
      id: 2,
      name: 'AI Agent API',
      endpoint: '/api/agents',
      status: 'online',
      responseTime: '120ms',
      uptime: '99.8%',
      lastCheck: '1 minute ago'
    },
    {
      id: 3,
      name: 'Patient Data API',
      endpoint: '/api/patients',
      status: 'online',
      responseTime: '78ms',
      uptime: '99.7%',
      lastCheck: '3 minutes ago'
    },
    {
      id: 4,
      name: 'Notification API',
      endpoint: '/api/notifications',
      status: 'warning',
      responseTime: '250ms',
      uptime: '98.5%',
      lastCheck: '1 minute ago'
    },
    {
      id: 5,
      name: 'Analytics API',
      endpoint: '/api/analytics',
      status: 'offline',
      responseTime: 'N/A',
      uptime: '95.2%',
      lastCheck: '5 minutes ago'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'offline':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return '🟢';
      case 'warning':
        return '🟡';
      case 'offline':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getResponseTimeColor = (responseTime: string) => {
    const time = parseInt(responseTime);
    if (responseTime === 'N/A') return 'text-gray-400';
    if (time < 100) return 'text-green-400';
    if (time < 200) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">API Status Monitor</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live Monitoring</span>
        </div>
      </div>

      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
      >
        <h3 className="text-lg font-semibold text-white mb-4">System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {apiServices.filter(service => service.status === 'online').length}
            </div>
            <p className="text-gray-400 text-sm">Online</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {apiServices.filter(service => service.status === 'warning').length}
            </div>
            <p className="text-gray-400 text-sm">Warning</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">
              {apiServices.filter(service => service.status === 'offline').length}
            </div>
            <p className="text-gray-400 text-sm">Offline</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">
              {apiServices.length}
            </div>
            <p className="text-gray-400 text-sm">Total</p>
          </div>
        </div>
      </motion.div>

      {/* API Services List */}
      <div className="space-y-4">
        {apiServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getStatusIcon(service.status)}</span>
                <div>
                  <h4 className="text-lg font-semibold text-white">{service.name}</h4>
                  <p className="text-gray-400 text-sm">{service.endpoint}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(service.status)}`}>
                {service.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Response Time</p>
                <p className={`text-lg font-semibold ${getResponseTimeColor(service.responseTime)}`}>
                  {service.responseTime}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Uptime</p>
                <p className="text-lg font-semibold text-white">{service.uptime}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Last Check</p>
                <p className="text-lg font-semibold text-white">{service.lastCheck}</p>
              </div>
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg text-white text-sm transition-colors"
                >
                  Test API
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Performance Trends</h3>
        <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-400">Performance charts coming soon</p>
            <p className="text-gray-500 text-sm">Real-time monitoring and analytics</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg font-medium text-white transition-all duration-300"
        >
          Refresh All APIs
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg font-medium text-white transition-all duration-300"
        >
          Generate Report
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg font-medium text-white transition-all duration-300"
        >
          Configure Alerts
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ApiStatusCard;
