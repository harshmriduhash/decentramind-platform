'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'finance' | 'wellness' | 'alpha' | 'custom';
  steps: number;
  estimatedDuration: string;
  icon: string;
  color: string;
  tags: string[];
}

const WorkflowTemplates: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: WorkflowTemplate[] = [
    {
      id: '1',
      name: 'Portfolio Optimization',
      description: 'Automated portfolio analysis and rebalancing workflow',
      category: 'finance',
      steps: 6,
      estimatedDuration: '2-5 minutes',
      icon: '📊',
      color: 'emerald',
      tags: ['DeFi', 'Portfolio', 'Analysis']
    },
    {
      id: '2',
      name: 'Health Monitoring',
      description: 'Daily health check and wellness tracking workflow',
      category: 'wellness',
      steps: 4,
      estimatedDuration: '1-3 minutes',
      icon: '❤️',
      color: 'rose',
      tags: ['Health', 'Monitoring', 'Daily']
    },
    {
      id: '3',
      name: 'Alpha Signal Generation',
      description: 'Market analysis and alpha signal generation workflow',
      category: 'alpha',
      steps: 8,
      estimatedDuration: '5-10 minutes',
      icon: '📈',
      color: 'purple',
      tags: ['Trading', 'Alpha', 'Signals']
    },
    {
      id: '4',
      name: 'Risk Assessment',
      description: 'Comprehensive risk evaluation and mitigation workflow',
      category: 'finance',
      steps: 5,
      estimatedDuration: '3-7 minutes',
      icon: '⚠️',
      color: 'yellow',
      tags: ['Risk', 'Assessment', 'Security']
    },
    {
      id: '5',
      name: 'Mood Tracking',
      description: 'Daily mood logging and wellness insights workflow',
      category: 'wellness',
      steps: 3,
      estimatedDuration: '30 seconds',
      icon: '😊',
      color: 'blue',
      tags: ['Mood', 'Wellness', 'Tracking']
    },
    {
      id: '6',
      name: 'Custom Analysis',
      description: 'Customizable analysis workflow for specific needs',
      category: 'custom',
      steps: 7,
      estimatedDuration: '5-15 minutes',
      icon: '🔧',
      color: 'cyan',
      tags: ['Custom', 'Analysis', 'Flexible']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: '📋', color: 'gray' },
    { id: 'finance', name: 'Finance', icon: '💰', color: 'emerald' },
    { id: 'wellness', name: 'Wellness', icon: '❤️', color: 'rose' },
    { id: 'alpha', name: 'Alpha', icon: '📈', color: 'purple' },
    { id: 'custom', name: 'Custom', icon: '🔧', color: 'cyan' }
  ];

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Workflow Templates</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
        >
          + Create Custom Template
        </motion.button>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              selectedCategory === category.id
                ? `bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 text-white shadow-lg shadow-${category.color}-500/25`
                : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedTemplate(template.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
              selectedTemplate === template.id
                ? 'border-purple-500/50 bg-purple-500/10'
                : `border-${template.color}-500/30 bg-${template.color}-500/5 hover:border-${template.color}-500/50`
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-lg bg-${template.color}-500/20 flex items-center justify-center`}>
                <span className="text-xl">{template.icon}</span>
              </div>
              <div>
                <h4 className="font-semibold text-white">{template.name}</h4>
                <p className="text-xs text-gray-400">{template.category}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-3">{template.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
              <span>{template.steps} steps</span>
              <span>{template.estimatedDuration}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {template.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-xs bg-${template.color}-500/20 text-${template.color}-400`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Template Details */}
      <AnimatePresence>
        {selectedTemplateData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-slate-700/30 rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white">{selectedTemplateData.name}</h4>
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30"
                >
                  Use Template
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30"
                >
                  Customize
                </motion.button>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-4">{selectedTemplateData.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-white mb-2">Template Info</h5>
                <div className="space-y-1 text-sm text-gray-400">
                  <div>Steps: {selectedTemplateData.steps}</div>
                  <div>Duration: {selectedTemplateData.estimatedDuration}</div>
                  <div>Category: {selectedTemplateData.category}</div>
                </div>
              </div>
              <div>
                <h5 className="font-medium text-white mb-2">Tags</h5>
                <div className="flex flex-wrap gap-1">
                  {selectedTemplateData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs bg-${selectedTemplateData.color}-500/20 text-${selectedTemplateData.color}-400`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkflowTemplates;
