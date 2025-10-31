'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkflowLayout from '../components/workflows/WorkflowLayout';
import WorkflowBuilder from '../components/workflows/WorkflowBuilder';
import WorkflowTimeline from '../components/workflows/WorkflowTimeline';
import WorkflowTemplates from '../components/workflows/WorkflowTemplates';
import WorkflowCanvas from '../components/workflows/WorkflowCanvas';
import WorkflowStatus from '../components/workflows/WorkflowStatus';
import WorkflowHistory from '../components/workflows/WorkflowHistory';

const WorkflowsPage = () => {
  const [activeTab, setActiveTab] = useState('builder');

  const tabs = [
    { id: 'builder', name: 'Builder', icon: '🔧', color: 'blue' },
    { id: 'timeline', name: 'Timeline', icon: '⏱️', color: 'emerald' },
    { id: 'templates', name: 'Templates', icon: '📋', color: 'purple' },
    { id: 'canvas', name: 'Canvas', icon: '🎨', color: 'cyan' },
    { id: 'status', name: 'Status', icon: '⚡', color: 'yellow' },
    { id: 'history', name: 'History', icon: '📚', color: 'rose' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'builder':
        return <WorkflowBuilder />;
      case 'timeline':
        return <WorkflowTimeline />;
      case 'templates':
        return <WorkflowTemplates />;
      case 'canvas':
        return <WorkflowCanvas />;
      case 'status':
        return <WorkflowStatus />;
      case 'history':
        return <WorkflowHistory />;
      default:
        return <WorkflowBuilder />;
    }
  };

  return (
    <WorkflowLayout>
      {/* Tab Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/30 mb-8">
        <div className="flex space-x-1 py-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg shadow-${tab.color}-500/25`
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-lg mr-2">{tab.icon}</span>
              {tab.name}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </WorkflowLayout>
  );
};

export default WorkflowsPage;
