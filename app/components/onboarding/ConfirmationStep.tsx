'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OnboardingData } from './OnboardingWizard';
import { MintButton } from '../MintButton';

interface ConfirmationStepProps {
  data: OnboardingData;
  onSubmit: () => void;
  onPrev: () => void;
  isLoading: boolean;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ data, onSubmit, onPrev, isLoading }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(data.confirmation.agreedToTerms);
  const [marketingOptIn, setMarketingOptIn] = useState(data.confirmation.marketingOptIn);

  const plans = {
    basic: { name: 'Basic', monthlyPrice: 299, yearlyPrice: 2999 },
    professional: { name: 'Professional', monthlyPrice: 599, yearlyPrice: 5999 },
    enterprise: { name: 'Enterprise', monthlyPrice: 999, yearlyPrice: 9999 },
  };

  const selectedPlan = plans[data.planSelection.planTier];
  const planPrice = data.planSelection.planType === 'yearly' 
    ? selectedPlan.yearlyPrice 
    : selectedPlan.monthlyPrice;

  const handleSubmit = () => {
    if (agreedToTerms) {
      onSubmit();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Review & Confirm</h2>
        <p className="text-gray-600">
          Please review your information before completing setup
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-6 mb-8">
        {/* Hospital Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🏥</span>
            Hospital Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Hospital Name:</p>
              <p className="font-semibold text-gray-900">{data.hospitalInfo.hospitalName}</p>
            </div>
            <div>
              <p className="text-gray-600">Administrator:</p>
              <p className="font-semibold text-gray-900">{data.hospitalInfo.adminName}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-semibold text-gray-900">{data.hospitalInfo.adminEmail}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone:</p>
              <p className="font-semibold text-gray-900">{data.hospitalInfo.adminPhone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600">Address:</p>
              <p className="font-semibold text-gray-900">{data.hospitalInfo.hospitalAddress}</p>
            </div>
            <div>
              <p className="text-gray-600">Hospital Size:</p>
              <p className="font-semibold text-gray-900 capitalize">{data.hospitalInfo.hospitalSize}</p>
            </div>
          </div>
        </motion.div>

        {/* Plan Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💳</span>
            Selected Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Plan:</p>
              <p className="font-semibold text-gray-900">{selectedPlan.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Billing:</p>
              <p className="font-semibold text-gray-900 capitalize">{data.planSelection.planType}</p>
            </div>
            <div>
              <p className="text-gray-600">Price:</p>
              <p className="font-semibold text-gray-900">${planPrice}/{data.planSelection.planType === 'yearly' ? 'year' : 'month'}</p>
            </div>
          </div>
        </motion.div>

        {/* Doctor Invites */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">👥</span>
            Doctor Invitations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Individual emails:</p>
              <p className="font-semibold text-gray-900">{data.doctorInvites.emails.length}</p>
            </div>
            <div>
              <p className="text-gray-600">CSV file:</p>
              <p className="font-semibold text-gray-900">
                {data.doctorInvites.csvFile ? data.doctorInvites.csvFile.name : 'None'}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-600">Total doctors to invite:</p>
              <p className="font-semibold text-gray-900">{data.doctorInvites.totalDoctors}</p>
            </div>
          </div>
          
          {data.doctorInvites.emails.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-600 mb-2">Email addresses:</p>
              <div className="max-h-24 overflow-y-auto bg-gray-50 rounded p-2">
                {data.doctorInvites.emails.map((email, index) => (
                  <p key={index} className="text-xs text-gray-700">{email}</p>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Care Orchestrator Agent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🤖</span>
            Your Care Orchestrator Agent
          </h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/* NFT-style gradient border */}
              <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 animate-pulse">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                  <img 
                    src="https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png" 
                    alt="Care Orchestrator Avatar - AI Healthcare Assistant"
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl hidden" style={{display: 'none'}}>
                    🩺
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-400 opacity-30 blur-sm -z-10 animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Care Orchestrator</h4>
              <p className="text-sm text-gray-600 mb-2">AI assistant for hospitals and clinics</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Vitals Tracker</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Appointment Scheduler</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Medical Record Sync</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* NFT Minting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🪙</span>
            Mint Your Care Orchestrator NFT
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Claim ownership of your AI agent as a unique NFT on Solana blockchain. This NFT represents your hospital's Care Orchestrator agent and can be used for verification and future integrations.
          </p>
          <MintButton
            agentName="Care Orchestrator"
            agentImage="https://ipfs.io/ipfs/bafybeidki742oakaxqxdk5u6s7zz4iinaszyyw62mpcmxmkcpo3m3qsm6a/david_859400_AI_Healthcare_Assistant_soft_glowing_humanoid_fo_249dd97f-c4a7-45a3-b0b6-ed8e71e6b9be_0.png"
            agentDescription="AI Healthcare Assistant Agent for DecentraMind Labs - Hospital Management System"
            agentAttributes={[
              { trait_type: 'Agent Type', value: 'Healthcare Assistant' },
              { trait_type: 'Level', value: 'Expert' },
              { trait_type: 'Domain', value: 'Health' },
              { trait_type: 'Hospital', value: data.hospitalInfo.hospitalName },
              { trait_type: 'Plan', value: selectedPlan.name },
              { trait_type: 'Rarity', value: 'Legendary' }
            ]}
            onMintSuccess={(mintAddress, transactionSignature) => {
              console.log('Care Orchestrator NFT minted successfully:', { mintAddress, transactionSignature });
            }}
            onMintError={(error) => {
              console.error('NFT minting failed:', error);
            }}
            enableCollection={true}
            enableSoulbound={false}
          />
        </motion.div>
      </div>

      {/* Terms and Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8"
      >
        <div className="space-y-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 mr-3"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="text-blue-500 hover:text-blue-700 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-500 hover:text-blue-700 underline">
                Privacy Policy
              </a>
              . I understand that Care Orchestrator will process healthcare data according to HIPAA compliance standards.
            </label>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="marketing"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-1 mr-3"
            />
            <label htmlFor="marketing" className="text-sm text-gray-700">
              I would like to receive updates about new features and healthcare AI insights (optional)
            </label>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          disabled={isLoading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          ← Back to Doctor Invites
        </motion.button>

        <motion.button
          whileHover={{ scale: agreedToTerms ? 1.02 : 1 }}
          whileTap={{ scale: agreedToTerms ? 0.98 : 1 }}
          onClick={handleSubmit}
          disabled={!agreedToTerms || isLoading}
          className={`px-8 py-3 rounded-lg font-semibold transition-all ${
            agreedToTerms && !isLoading
              ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Setting up Care Orchestrator...
            </div>
          ) : (
            'Complete Setup →'
          )}
        </motion.button>
      </div>

      {/* Success Message Preview */}
      {agreedToTerms && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center">
            <span className="text-green-500 mr-2">🎉</span>
            <p className="text-green-800 text-sm">
              <strong>Almost done!</strong> After clicking "Complete Setup", you'll be redirected to your Care Orchestrator dashboard where you can start managing your healthcare AI agents.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ConfirmationStep;

