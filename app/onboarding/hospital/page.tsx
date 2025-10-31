'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, Building2, CreditCard, Users, Database, ArrowRight } from 'lucide-react';
import { OnboardingData, OnboardingStep, Hospital, Subscription, User, DataSource } from '../../types/hospital';

const OnboardingWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    hospital: {},
    subscription: {},
    users: [],
    dataSources: [],
    currentStep: 0,
    completedSteps: []
  });

  const steps: OnboardingStep[] = [
    {
      id: 'hospital-info',
      title: 'Hospital Information',
      description: 'Set up your hospital profile and branding',
      completed: false,
      required: true
    },
    {
      id: 'plan-selection',
      title: 'Plan Selection',
      description: 'Choose your subscription plan',
      completed: false,
      required: true
    },
    {
      id: 'invite-doctors',
      title: 'Invite Team',
      description: 'Add doctors and staff members',
      completed: false,
      required: true
    },
    {
      id: 'data-sources',
      title: 'Data Sources',
      description: 'Connect your hospital systems',
      completed: false,
      required: false
    }
  ];

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hospital-onboarding');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOnboardingData(parsed);
        setCurrentStep(parsed.currentStep || 0);
      } catch (error) {
        console.error('Failed to load onboarding progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (data: Partial<OnboardingData>) => {
    const updated = { ...onboardingData, ...data };
    setOnboardingData(updated);
    localStorage.setItem('hospital-onboarding', JSON.stringify(updated));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      saveProgress({ currentStep: newStep });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      saveProgress({ currentStep: newStep });
    }
  };

  const completeStep = (stepId: string) => {
    const updatedSteps = [...onboardingData.completedSteps, stepId];
    saveProgress({ completedSteps: updatedSteps });
  };

  const getStepIcon = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return <Building2 className="w-5 h-5" />;
      case 1: return <CreditCard className="w-5 h-5" />;
      case 2: return <Users className="w-5 h-5" />;
      case 3: return <Database className="w-5 h-5" />;
      default: return <Check className="w-5 h-5" />;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <HospitalInfoStep data={onboardingData} onUpdate={saveProgress} onComplete={() => completeStep('hospital-info')} />;
      case 1:
        return <PlanSelectionStep data={onboardingData} onUpdate={saveProgress} onComplete={() => completeStep('plan-selection')} />;
      case 2:
        return <InviteDoctorsStep data={onboardingData} onUpdate={saveProgress} onComplete={() => completeStep('invite-doctors')} />;
      case 3:
        return <DataSourceStep data={onboardingData} onUpdate={saveProgress} onComplete={() => completeStep('data-sources')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-3 mb-4"
          >
            <div className="text-4xl">🏥</div>
            <div>
              <h1 className="text-3xl font-bold text-white">Hospital Onboarding</h1>
              <p className="text-gray-300">Set up your DecentraMind Care Orchestrator</p>
            </div>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      index <= currentStep
                        ? 'bg-purple-500 border-purple-500 text-white'
                        : 'bg-slate-700 border-slate-600 text-gray-400'
                    }`}
                  >
                    {onboardingData.completedSteps.includes(step.id) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      getStepIcon(index)
                    )}
                  </motion.div>
                  
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      index <= currentStep ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-purple-500' : 'bg-slate-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-slate-700/50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  currentStep === 0
                    ? 'bg-slate-700/50 text-gray-500 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </motion.button>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Step {currentStep + 1} of {steps.length}
                </span>
                
                {currentStep === steps.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <span>Complete Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step Components
const HospitalInfoStep: React.FC<{
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onComplete: () => void;
}> = ({ data, onUpdate, onComplete }) => {
  const [hospital, setHospital] = useState<Partial<Hospital>>(data.hospital || {});

  const handleUpdate = (field: keyof Hospital, value: any) => {
    const updated = { ...hospital, [field]: value };
    setHospital(updated);
    onUpdate({ hospital: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Hospital Information</h2>
        <p className="text-gray-400">Tell us about your hospital and customize your branding</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Hospital Name *</label>
          <input
            type="text"
            value={hospital.name || ''}
            onChange={(e) => handleUpdate('name', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter hospital name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Contact Email *</label>
          <input
            type="email"
            value={hospital.contactEmail || ''}
            onChange={(e) => handleUpdate('contactEmail', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="admin@hospital.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <input
            type="tel"
            value={hospital.phone || ''}
            onChange={(e) => handleUpdate('phone', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
          <input
            type="text"
            value={hospital.address || ''}
            onChange={(e) => handleUpdate('address', e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="123 Medical Center Dr, City, State"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Branding Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={hospital.primaryColor || '#8B5CF6'}
                onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                className="w-12 h-12 rounded-lg border border-slate-600/50 cursor-pointer"
              />
              <input
                type="text"
                value={hospital.primaryColor || '#8B5CF6'}
                onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm"
                placeholder="#8B5CF6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={hospital.secondaryColor || '#06B6D4'}
                onChange={(e) => handleUpdate('secondaryColor', e.target.value)}
                className="w-12 h-12 rounded-lg border border-slate-600/50 cursor-pointer"
              />
              <input
                type="text"
                value={hospital.secondaryColor || '#06B6D4'}
                onChange={(e) => handleUpdate('secondaryColor', e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white text-sm"
                placeholder="#06B6D4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanSelectionStep: React.FC<{
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onComplete: () => void;
}> = ({ data, onUpdate, onComplete }) => {
  const [subscription, setSubscription] = useState<Partial<Subscription>>(data.subscription || {});

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 299,
      period: 'month',
      features: [
        'Up to 50 users',
        'Basic EHR integration',
        'Standard support',
        'Monthly reports'
      ],
      popular: false
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: 2999,
      period: 'year',
      features: [
        'Up to 50 users',
        'Advanced EHR integration',
        'Priority support',
        'Custom reports',
        'API access',
        '2 months free'
      ],
      popular: true
    }
  ];

  const handlePlanSelect = (planType: 'monthly' | 'yearly') => {
    const selectedPlan = plans.find(p => p.id === planType);
    if (selectedPlan) {
      const updated = {
        ...subscription,
        planType,
        price: selectedPlan.price,
        currency: 'USD',
        status: 'pending' as const,
        features: selectedPlan.features
      };
      setSubscription(updated);
      onUpdate({ subscription: updated });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
        <p className="text-gray-400">Select the subscription plan that best fits your hospital's needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePlanSelect(plan.id as 'monthly' | 'yearly')}
            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              subscription.planType === plan.id
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-white mb-1">
                ${plan.price}
                <span className="text-lg text-gray-400">/{plan.period}</span>
              </div>
              {plan.id === 'yearly' && (
                <p className="text-sm text-green-400">Save $589/year</p>
              )}
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-gray-300">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className={`w-full py-2 px-4 rounded-lg text-center font-medium ${
              subscription.planType === plan.id
                ? 'bg-purple-500 text-white'
                : 'bg-slate-600 text-gray-300'
            }`}>
              {subscription.planType === plan.id ? 'Selected' : 'Select Plan'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const InviteDoctorsStep: React.FC<{
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onComplete: () => void;
}> = ({ data, onUpdate, onComplete }) => {
  const [users, setUsers] = useState<Partial<User>[]>(data.users || []);
  const [newUser, setNewUser] = useState<Partial<User>>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'doctor'
  });

  const addUser = () => {
    if (newUser.email && newUser.firstName && newUser.lastName) {
      const user: Partial<User> = {
        ...newUser,
        id: `user-${Date.now()}`,
        hospitalId: 'mock-hospital-id',
        status: 'pending',
        permissions: [],
        invitedAt: new Date()
      };
      const updated = [...users, user];
      setUsers(updated);
      onUpdate({ users: updated });
      setNewUser({ email: '', firstName: '', lastName: '', role: 'doctor' });
    }
  };

  const removeUser = (index: number) => {
    const updated = users.filter((_, i) => i !== index);
    setUsers(updated);
    onUpdate({ users: updated });
  };

  const roles = [
    { value: 'admin', label: 'Administrator', icon: '👑' },
    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
    { value: 'nurse', label: 'Nurse', icon: '👩‍⚕️' },
    { value: 'coordinator', label: 'Coordinator', icon: '📋' },
    { value: 'viewer', label: 'Viewer', icon: '👁️' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Invite Your Team</h2>
        <p className="text-gray-400">Add doctors, nurses, and staff members to your hospital</p>
      </div>

      {/* Add New User Form */}
      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">Add Team Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
            <input
              type="text"
              value={newUser.firstName || ''}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
            <input
              type="text"
              value={newUser.lastName || ''}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={newUser.email || ''}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="john.smith@hospital.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              value={newUser.role || 'doctor'}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User['role'] })}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.icon} {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addUser}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium"
          >
            Add Team Member
          </motion.button>
        </div>
      </div>

      {/* Users List */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Team Members ({users.length})</h3>
        {users.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No team members added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((user, index) => {
              const roleInfo = roles.find(r => r.value === user.role);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{roleInfo?.icon}</div>
                    <div>
                      <div className="font-medium text-white">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                      <div className="text-xs text-gray-500">{roleInfo?.label}</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeUser(index)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    ✕
                  </motion.button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const DataSourceStep: React.FC<{
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onComplete: () => void;
}> = ({ data, onUpdate, onComplete }) => {
  const [dataSources, setDataSources] = useState<Partial<DataSource>[]>(data.dataSources || []);
  const [newDataSource, setNewDataSource] = useState<Partial<DataSource>>({
    name: '',
    type: 'EHR',
    syncFrequency: 'daily'
  });

  const addDataSource = () => {
    if (newDataSource.name) {
      const source: Partial<DataSource> = {
        ...newDataSource,
        id: `source-${Date.now()}`,
        hospitalId: 'mock-hospital-id',
        status: 'pending',
        lastSync: new Date(),
        dataTypes: ['patient', 'appointment', 'vitals']
      };
      const updated = [...dataSources, source];
      setDataSources(updated);
      onUpdate({ dataSources: updated });
      setNewDataSource({ name: '', type: 'EHR', syncFrequency: 'daily' });
    }
  };

  const removeDataSource = (index: number) => {
    const updated = dataSources.filter((_, i) => i !== index);
    setDataSources(updated);
    onUpdate({ dataSources: updated });
  };

  const sourceTypes = [
    { value: 'EHR', label: 'Electronic Health Records', icon: '📋' },
    { value: 'EMR', label: 'Electronic Medical Records', icon: '🏥' },
    { value: 'PACS', label: 'Picture Archiving System', icon: '📸' },
    { value: 'LIS', label: 'Laboratory Information System', icon: '🧪' },
    { value: 'RIS', label: 'Radiology Information System', icon: '🔬' },
    { value: 'Custom', label: 'Custom Integration', icon: '⚙️' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Data Sources</h2>
        <p className="text-gray-400">Link your hospital systems to enable AI-powered insights (Optional)</p>
      </div>

      {/* Add Data Source Form */}
      <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
        <h3 className="text-lg font-semibold text-white mb-4">Add Data Source</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">System Name</label>
            <input
              type="text"
              value={newDataSource.name || ''}
              onChange={(e) => setNewDataSource({ ...newDataSource, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Epic, Cerner, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">System Type</label>
            <select
              value={newDataSource.type || 'EHR'}
              onChange={(e) => setNewDataSource({ ...newDataSource, type: e.target.value as DataSource['type'] })}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {sourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sync Frequency</label>
            <select
              value={newDataSource.syncFrequency || 'daily'}
              onChange={(e) => setNewDataSource({ ...newDataSource, syncFrequency: e.target.value as DataSource['syncFrequency'] })}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="real-time">Real-time</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={addDataSource}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium"
          >
            Add Data Source
          </motion.button>
        </div>
      </div>

      {/* Data Sources List */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Connected Systems ({dataSources.length})</h3>
        {dataSources.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data sources connected yet</p>
            <p className="text-sm mt-2">You can skip this step and add integrations later</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dataSources.map((source, index) => {
              const typeInfo = sourceTypes.find(t => t.value === source.type);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{typeInfo?.icon}</div>
                    <div>
                      <div className="font-medium text-white">{source.name}</div>
                      <div className="text-sm text-gray-400">{typeInfo?.label}</div>
                      <div className="text-xs text-gray-500">Sync: {source.syncFrequency}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                      Pending Setup
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeDataSource(index)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
