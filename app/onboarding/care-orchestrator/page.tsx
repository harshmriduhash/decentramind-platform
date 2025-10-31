'use client';

import React from 'react';
import OnboardingWizard from '../../components/onboarding/OnboardingWizard';

export default function CareOrchestratorOnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl">🩺</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Care Orchestrator Setup
            </h1>
            <p className="text-xl text-gray-600">
              Get your hospital ready for AI-powered healthcare management
            </p>
          </div>

          {/* Wizard */}
          <OnboardingWizard />
        </div>
      </div>
    </div>
  );
}

