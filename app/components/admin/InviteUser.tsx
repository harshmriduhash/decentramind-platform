'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const InviteUser: React.FC = () => {
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'user',
    department: '',
    message: ''
  });

  const [invitedUsers, setInvitedUsers] = useState([
    { id: 1, email: 'john.doe@hospital.com', role: 'doctor', status: 'pending', invitedAt: '2024-01-15' },
    { id: 2, email: 'jane.smith@hospital.com', role: 'nurse', status: 'accepted', invitedAt: '2024-01-14' },
    { id: 3, email: 'mike.johnson@hospital.com', role: 'admin', status: 'pending', invitedAt: '2024-01-13' }
  ]);

  const handleInputChange = (field: string, value: string) => {
    setInviteForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInvite = () => {
    if (!inviteForm.email) return;

    const newInvite = {
      id: invitedUsers.length + 1,
      email: inviteForm.email,
      role: inviteForm.role,
      status: 'pending',
      invitedAt: new Date().toISOString().split('T')[0]
    };

    setInvitedUsers([...invitedUsers, newInvite]);
    setInviteForm({
      email: '',
      role: 'user',
      department: '',
      message: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'declined':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-400';
      case 'doctor':
        return 'bg-blue-500/20 text-blue-400';
      case 'nurse':
        return 'bg-green-500/20 text-green-400';
      case 'user':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="text-sm text-gray-400">
          {invitedUsers.length} total users
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Invite New User</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="user@hospital.com"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                value={inviteForm.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
              >
                <option value="user">User</option>
                <option value="nurse">Nurse</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Department
              </label>
              <input
                type="text"
                value={inviteForm.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Cardiology, Emergency, etc."
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Welcome Message
              </label>
              <textarea
                value={inviteForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Optional welcome message..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 resize-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInvite}
              disabled={!inviteForm.email}
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-all duration-300"
            >
              Send Invitation
            </motion.button>
          </div>
        </motion.div>

        {/* User List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Invitations</h3>
          <div className="space-y-3">
            {invitedUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      {user.role}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{user.invitedAt}</span>
                </div>
                <p className="text-white text-sm">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 py-1 bg-slate-600/50 hover:bg-slate-600 rounded text-xs text-gray-300 hover:text-white transition-colors"
                  >
                    Resend
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{invitedUsers.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">{invitedUsers.filter(u => u.status === 'pending').length}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Accepted</p>
              <p className="text-2xl font-bold text-white">{invitedUsers.filter(u => u.status === 'accepted').length}</p>
            </div>
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-white">{invitedUsers.filter(u => u.role === 'admin').length}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <span className="text-xl">👑</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InviteUser;
