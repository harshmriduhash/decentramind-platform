'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';

const HospitalHubPage: React.FC = () => {
  const features = [
    {
      id: 'onboarding',
      title: 'Onboarding Wizard',
      description: 'Streamlined hospital setup and activation process with guided configuration',
      icon: '🛠️',
      href: '/onboarding/hospital',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600'
    },
    {
      id: 'admin',
      title: 'Admin Console',
      description: 'Comprehensive hospital management dashboard for administrators',
      icon: '🧑‍💼',
      href: '/admin/hospital',
      color: 'from-purple-500 to-pink-500',
      hoverColor: 'hover:from-purple-600 hover:to-pink-600'
    },
    {
      id: 'provider',
      title: 'Provider Workspace',
      description: 'Professional interface for doctors and healthcare providers',
      icon: '👨‍⚕️',
      href: '/provider/workspace',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'hover:from-green-600 hover:to-emerald-600'
    },
    {
      id: 'patient',
      title: 'Patient Portal',
      description: 'User-friendly PWA for patients to manage their health',
      icon: '👩‍⚕️',
      href: '/patient/pwa',
      color: 'from-orange-500 to-red-500',
      hoverColor: 'hover:from-orange-600 hover:to-red-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link 
              href="/" 
              className="text-gray-400 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="text-white font-medium">Hospital</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="text-6xl">🏥</div>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Hospital Integration Hub
              </h1>
              <p className="text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
                Comprehensive healthcare management platform powered by DecentraMind AI
              </p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-medium">All Systems Operational</span>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={feature.href} className="block group">
                <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full">
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                  
                  {/* Card Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-5xl">{feature.icon}</div>
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-lg leading-relaxed mb-6 group-hover:text-gray-300 transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Action Button */}
                    <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${feature.color} ${feature.hoverColor} text-white rounded-lg font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-opacity-50`}>
                      <span>Access Platform</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`}></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Platform Statistics</h2>
            <p className="text-gray-400">Real-time metrics from our healthcare integration platform</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Active Hospitals', value: '150+', icon: '🏥' },
              { label: 'Healthcare Providers', value: '2,500+', icon: '👨‍⚕️' },
              { label: 'Patient Records', value: '50K+', icon: '📋' },
              { label: 'AI Interactions', value: '1M+', icon: '🤖' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="text-center p-6 bg-slate-700/30 rounded-xl border border-slate-600/30"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Healthcare?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join hundreds of hospitals already using DecentraMind's AI-powered healthcare platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding/hospital"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25"
              >
                <span>Start Onboarding</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg font-semibold transition-all duration-300 border border-slate-600/50"
              >
                <span>View Documentation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HospitalHubPage;
