'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../../providers/WalletContext';

interface CustomAgentForm {
  name: string;
  domain: string;
  description: string;
  personality: string;
  capabilities: string[];
  pricing: {
    mintCost: number;
    monthlyFee: number;
  };
}

const CustomAgentCreator: React.FC = () => {
  const { mintAgent, showToast } = useWallet();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CustomAgentForm>({
    name: '',
    domain: '',
    description: '',
    personality: '',
    capabilities: [],
    pricing: {
      mintCost: 200,
      monthlyFee: 50
    }
  });

  const [newCapability, setNewCapability] = useState('');

  const domainOptions = [
    'Finance', 'Healthcare', 'Education', 'Marketing', 'Development', 
    'Design', 'Writing', 'Research', 'Customer Service', 'Sales'
  ];

  const personalityOptions = [
    'Analytical & Data-Driven',
    'Creative & Innovative',
    'Supportive & Empathetic',
    'Aggressive & Results-Focused',
    'Calm & Methodical',
    'Energetic & Dynamic',
    'Professional & Formal',
    'Friendly & Casual'
  ];

  const handleInputChange = (field: keyof CustomAgentForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePricingChange = (field: keyof CustomAgentForm['pricing'], value: number) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const addCapability = () => {
    if (newCapability.trim() && !formData.capabilities.includes(newCapability.trim())) {
      setFormData(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, newCapability.trim()]
      }));
      setNewCapability('');
    }
  };

  const removeCapability = (capability: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter(c => c !== capability)
    }));
  };

  const calculatePricing = () => {
    const baseCost = 100;
    const capabilityCost = formData.capabilities.length * 25;
    const domainMultiplier = formData.domain === 'Finance' ? 1.5 : 
                           formData.domain === 'Healthcare' ? 1.3 : 1.0;
    
    const mintCost = Math.round((baseCost + capabilityCost) * domainMultiplier);
    const monthlyFee = Math.round(mintCost * 0.25);
    
    return { mintCost, monthlyFee };
  };

  const handleCreateAgent = async () => {
    if (!formData.name || !formData.domain || !formData.description || !formData.personality) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsCreating(true);
    try {
      const pricing = calculatePricing();
      const agentData = {
        ...formData,
        pricing,
        id: `custom-${Date.now()}`,
        icon: '🎨',
        color: 'cyan',
        gradient: 'from-cyan-500 to-blue-600',
        xp: 0,
        level: 1,
        tasksCompleted: 0,
        successRate: 0,
        earnings: 0,
        isMinted: false,
        recentTasks: [],
        insights: []
      };

      await mintAgent('custom', agentData);
      showToast(`${formData.name} created successfully!`, 'success');
      
      // Reset form
      setFormData({
        name: '',
        domain: '',
        description: '',
        personality: '',
        capabilities: [],
        pricing: { mintCost: 200, monthlyFee: 50 }
      });
    } catch (error) {
      showToast('Failed to create agent', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const pricing = calculatePricing();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl mb-4"
          >
            🎨
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Custom Agent</h2>
          <p className="text-gray-400">
            Design your own specialized AI agent with custom capabilities and personality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Marketing Master, Code Wizard"
                  className="w-full p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Domain *
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                  className="w-full p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors duration-200"
                >
                  <option value="">Select a domain</option>
                  {domainOptions.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what your agent does and how it helps users"
                  rows={3}
                  className="w-full p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Personality *
                </label>
                <select
                  value={formData.personality}
                  onChange={(e) => handleInputChange('personality', e.target.value)}
                  className="w-full p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors duration-200"
                >
                  <option value="">Select personality</option>
                  {personalityOptions.map(personality => (
                    <option key={personality} value={personality}>{personality}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Capabilities</h3>
              
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newCapability}
                  onChange={(e) => setNewCapability(e.target.value)}
                  placeholder="Add a capability"
                  className="flex-1 p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && addCapability()}
                />
                <motion.button
                  onClick={addCapability}
                  className="px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.capabilities.map((capability, index) => (
                  <motion.span
                    key={capability}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 px-3 py-1 bg-slate-700/50 rounded-full text-sm text-gray-300 border border-slate-600/30"
                  >
                    <span>{capability}</span>
                    <button
                      onClick={() => removeCapability(capability)}
                      className="text-gray-500 hover:text-red-400 transition-colors duration-200"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          {/* Preview & Pricing */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Preview & Pricing</h3>
            
            {/* Agent Preview */}
            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/30">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                  🎨
                </div>
                <h4 className="text-xl font-semibold text-white">
                  {formData.name || 'Your Agent Name'}
                </h4>
                <p className="text-sm text-gray-400">
                  {formData.domain || 'Domain'} • {formData.personality || 'Personality'}
                </p>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                {formData.description || 'Agent description will appear here...'}
              </p>
              
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Capabilities:</div>
                <div className="flex flex-wrap gap-1">
                  {formData.capabilities.length > 0 ? (
                    formData.capabilities.map(capability => (
                      <span key={capability} className="px-2 py-1 bg-slate-600/50 rounded text-xs text-gray-300">
                        {capability}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No capabilities added yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/30">
              <h4 className="text-lg font-semibold text-white mb-4">Pricing</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Mint Cost:</span>
                  <span className="text-emerald-400 font-semibold">{pricing.mintCost} DMT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Monthly Fee:</span>
                  <span className="text-blue-400 font-semibold">{pricing.monthlyFee} DMT</span>
                </div>
                <div className="border-t border-slate-600/30 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Setup:</span>
                    <span className="text-white font-bold">{pricing.mintCost + pricing.monthlyFee} DMT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <motion.button
              onClick={handleCreateAgent}
              disabled={isCreating || !formData.name || !formData.domain || !formData.description || !formData.personality}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                isCreating || !formData.name || !formData.domain || !formData.description || !formData.personality
                  ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
              }`}
              whileHover={
                !isCreating && formData.name && formData.domain && formData.description && formData.personality
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !isCreating && formData.name && formData.domain && formData.description && formData.personality
                  ? { scale: 0.98 }
                  : {}
              }
            >
              {isCreating ? 'Creating Agent...' : 'Create Custom Agent'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomAgentCreator;
