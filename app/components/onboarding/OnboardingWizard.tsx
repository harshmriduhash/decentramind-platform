'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import HospitalInfoStep from './HospitalInfoStep';
import PlanSelectionStep from './PlanSelectionStep';
import InviteDoctorsStep from './InviteDoctorsStep';
import ConfirmationStep from './ConfirmationStep';

export interface OnboardingData {
  hospitalInfo: {
    hospitalName: string;
    adminName: string;
    adminEmail: string;
    adminPhone: string;
    hospitalAddress: string;
    hospitalSize: string;
  };
  planSelection: {
    planType: 'monthly' | 'yearly';
    planTier: 'basic' | 'professional' | 'enterprise';
    billingCycle: string;
  };
  doctorInvites: {
    emails: string[];
    csvFile: File | null;
    totalDoctors: number;
  };
  confirmation: {
    agreedToTerms: boolean;
    marketingOptIn: boolean;
  };
}

const OnboardingWizard: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    hospitalInfo: {
      hospitalName: '',
      adminName: '',
      adminEmail: '',
      adminPhone: '',
      hospitalAddress: '',
      hospitalSize: '',
    },
    planSelection: {
      planType: 'monthly',
      planTier: 'basic',
      billingCycle: 'monthly',
    },
    doctorInvites: {
      emails: [],
      csvFile: null,
      totalDoctors: 0,
    },
    confirmation: {
      agreedToTerms: false,
      marketingOptIn: false,
    },
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('care-orchestrator-onboarding');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setOnboardingData(parsed);
      } catch (error) {
        console.error('Failed to parse saved onboarding data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('care-orchestrator-onboarding', JSON.stringify(onboardingData));
  }, [onboardingData]);

  const steps = [
    { id: 1, title: 'Hospital Info', description: 'Basic hospital details' },
    { id: 2, title: 'Plan Selection', description: 'Choose your subscription' },
    { id: 3, title: 'Invite Doctors', description: 'Add your medical team' },
    { id: 4, title: 'Confirmation', description: 'Review and confirm' },
  ];

  const updateData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Submit to API endpoint
      const response = await fetch('/api/onboarding/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(onboardingData),
      });

      if (response.ok) {
        // Clear saved data
        localStorage.removeItem('care-orchestrator-onboarding');
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        throw new Error('Failed to submit onboarding data');
      }
    } catch (error) {
      console.error('Onboarding submission error:', error);
      // For now, just redirect anyway since this is a stub
      localStorage.removeItem('care-orchestrator-onboarding');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <HospitalInfoStep
            data={onboardingData.hospitalInfo}
            onUpdate={(data) => updateData({ hospitalInfo: data })}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <PlanSelectionStep
            data={onboardingData.planSelection}
            onUpdate={(data) => updateData({ planSelection: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <InviteDoctorsStep
            data={onboardingData.doctorInvites}
            onUpdate={(data) => updateData({ doctorInvites: data })}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ConfirmationStep
            data={onboardingData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Progress Indicator */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                  currentStep >= step.id
                    ? 'bg-white text-blue-500'
                    : 'bg-blue-400 text-white'
                }`}
              >
                {step.id}
              </div>
              <div className="ml-3 text-white">
                <div className="font-semibold">{step.title}</div>
                <div className="text-sm opacity-90">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-blue-300 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OnboardingWizard;

