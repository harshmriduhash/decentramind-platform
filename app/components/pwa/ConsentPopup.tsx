'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ConsentPopupProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentPopup: React.FC<ConsentPopupProps> = ({ onAccept, onDecline }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700/50 max-w-md w-full p-6"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">🛡️</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Privacy & Consent</h2>
          <p className="text-gray-400 text-sm">
            We need your consent to provide personalized healthcare services
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Data Collection</h3>
            <p className="text-gray-300 text-sm">
              We collect health information, appointment data, and communication history to provide better care and improve our services.
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">AI Processing</h3>
            <p className="text-gray-300 text-sm">
              Your data may be processed by AI systems to provide health insights, appointment recommendations, and personalized care plans.
            </p>
          </div>

          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Security & Privacy</h3>
            <p className="text-gray-300 text-sm">
              All data is encrypted and stored securely. We follow HIPAA compliance standards and never share your information without consent.
            </p>
          </div>
        </div>

        {/* Consent Options */}
        <div className="space-y-3 mb-6">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <span className="text-gray-300 text-sm">
              I consent to the collection and processing of my health data for care purposes
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="mt-1 w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <span className="text-gray-300 text-sm">
              I allow AI analysis of my data to provide personalized health insights
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
            />
            <span className="text-gray-300 text-sm">
              I agree to receive appointment reminders and health tips via email/SMS
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDecline}
            className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg font-medium text-gray-300 hover:text-white transition-all duration-300"
          >
            Decline
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAccept}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
          >
            Accept & Continue
          </motion.button>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <p className="text-gray-500 text-xs text-center">
            You can change these preferences anytime in your profile settings.
            <br />
            <a href="#" className="text-purple-400 hover:text-purple-300 underline">
              Read our full Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConsentPopup;
