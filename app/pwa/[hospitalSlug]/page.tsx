'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PatientChat from '../../components/pwa/PatientChat';
import AppointmentBooking from '../../components/pwa/AppointmentBooking';
import ConsentPopup from '../../components/pwa/ConsentPopup';

interface PWAPageProps {
  params: Promise<{
    hospitalSlug: string;
  }>;
}

const PWAPage: React.FC<PWAPageProps> = ({ params }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [showConsent, setShowConsent] = useState(true);
  const [hospitalSlug, setHospitalSlug] = useState<string>('');

  // Handle async params
  React.useEffect(() => {
    params.then(({ hospitalSlug }) => {
      setHospitalSlug(hospitalSlug);
    });
  }, [params]);

  const tabs = [
    { id: 'chat', name: 'Chat', icon: '💬', color: 'blue' },
    { id: 'appointments', name: 'Book', icon: '📅', color: 'green' },
    { id: 'profile', name: 'Profile', icon: '👤', color: 'purple' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'chat':
        return <PatientChat hospitalSlug={params.hospitalSlug} />;
      
      case 'appointments':
        return <AppointmentBooking hospitalSlug={params.hospitalSlug} />;
      
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30">
              <h3 className="text-lg font-semibold text-white mb-4">Patient Profile</h3>
              <p className="text-gray-400">Profile management coming soon...</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* PWA Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                DecentraMind Care
              </span>
            </div>
            <div className="text-sm text-gray-400">
              {params.hospitalSlug}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </main>

      {/* Consent Popup */}
      {showConsent && (
        <ConsentPopup
          onAccept={() => setShowConsent(false)}
          onDecline={() => setShowConsent(false)}
        />
      )}
    </div>
  );
};

export default PWAPage;
