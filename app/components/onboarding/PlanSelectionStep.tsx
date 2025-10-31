'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PlanSelectionData {
  planType: 'monthly' | 'yearly';
  planTier: 'basic' | 'professional' | 'enterprise';
  billingCycle: string;
}

interface PlanSelectionStepProps {
  data: PlanSelectionData;
  onUpdate: (data: PlanSelectionData) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PlanSelectionStep: React.FC<PlanSelectionStepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [formData, setFormData] = useState<PlanSelectionData>(data);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for small hospitals',
      monthlyPrice: 299,
      yearlyPrice: 2999,
      features: [
        'Up to 50 doctors',
        'Basic AI insights',
        'Email support',
        'Standard integrations',
        'Basic analytics dashboard',
      ],
      color: 'blue',
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for medium hospitals',
      monthlyPrice: 599,
      yearlyPrice: 5999,
      features: [
        'Up to 200 doctors',
        'Advanced AI insights',
        'Priority support',
        'Advanced integrations',
        'Advanced analytics',
        'Custom workflows',
        'API access',
      ],
      color: 'green',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large hospital systems',
      monthlyPrice: 999,
      yearlyPrice: 9999,
      features: [
        'Unlimited doctors',
        'Premium AI insights',
        '24/7 dedicated support',
        'All integrations',
        'Enterprise analytics',
        'Custom workflows',
        'Full API access',
        'White-label options',
        'SLA guarantee',
      ],
      color: 'purple',
    },
  ];

  const handlePlanTypeChange = (planType: 'monthly' | 'yearly') => {
    setFormData(prev => ({ ...prev, planType, billingCycle: planType }));
  };

  const handlePlanTierChange = (planTier: 'basic' | 'professional' | 'enterprise') => {
    setFormData(prev => ({ ...prev, planTier }));
  };

  const handleNext = () => {
    onUpdate(formData);
    onNext();
  };

  const getPrice = (plan: typeof plans[0]) => {
    return formData.planType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const yearlyPrice = plan.yearlyPrice;
    return monthlyTotal - yearlyPrice;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">💳</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">
          Select the perfect Care Orchestrator plan for your hospital
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handlePlanTypeChange('monthly')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              formData.planType === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => handlePlanTypeChange('yearly')}
            className={`px-6 py-2 rounded-md font-medium transition-all relative ${
              formData.planType === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02 }}
            className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all ${
              formData.planTier === plan.id
                ? `border-${plan.color}-500 bg-${plan.color}-50`
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handlePlanTierChange(plan.id as any)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">${getPrice(plan)}</span>
                <span className="text-gray-600 ml-1">
                  /{formData.planType === 'yearly' ? 'year' : 'month'}
                </span>
              </div>
              {formData.planType === 'yearly' && (
                <p className="text-sm text-green-600 font-medium">
                  Save ${getSavings(plan)} per year
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-gray-700 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <div className={`w-full py-2 rounded-lg text-center font-medium ${
              formData.planTier === plan.id
                ? `bg-${plan.color}-500 text-white`
                : 'bg-gray-100 text-gray-700'
            }`}>
              {formData.planTier === plan.id ? 'Selected' : 'Select Plan'}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Plan Summary */}
      {formData.planTier && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Selected Plan:</p>
              <p className="font-semibold text-gray-900">
                {plans.find(p => p.id === formData.planTier)?.name} - {formData.planType}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Billing:</p>
              <p className="font-semibold text-gray-900">
                ${getPrice(plans.find(p => p.id === formData.planTier)!)} / {formData.planType}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          ← Back to Hospital Info
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          disabled={!formData.planTier}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Doctor Invites →
        </motion.button>
      </div>
    </div>
  );
};

export default PlanSelectionStep;


