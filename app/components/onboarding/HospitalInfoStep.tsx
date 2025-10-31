'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface HospitalInfoData {
  hospitalName: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  hospitalAddress: string;
  hospitalSize: string;
}

interface HospitalInfoStepProps {
  data: HospitalInfoData;
  onUpdate: (data: HospitalInfoData) => void;
  onNext: () => void;
}

const HospitalInfoStep: React.FC<HospitalInfoStepProps> = ({ data, onUpdate, onNext }) => {
  const [formData, setFormData] = useState<HospitalInfoData>(data);
  const [errors, setErrors] = useState<Partial<HospitalInfoData>>({});

  const hospitalSizes = [
    { value: 'small', label: 'Small (1-50 beds)', description: 'Community hospitals, clinics' },
    { value: 'medium', label: 'Medium (51-200 beds)', description: 'Regional hospitals' },
    { value: 'large', label: 'Large (201-500 beds)', description: 'Major medical centers' },
    { value: 'enterprise', label: 'Enterprise (500+ beds)', description: 'Hospital systems, networks' },
  ];

  const handleInputChange = (field: keyof HospitalInfoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<HospitalInfoData> = {};

    if (!formData.hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    }

    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Administrator name is required';
    }

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Please enter a valid email address';
    }

    if (!formData.adminPhone.trim()) {
      newErrors.adminPhone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.adminPhone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.adminPhone = 'Please enter a valid phone number';
    }

    if (!formData.hospitalAddress.trim()) {
      newErrors.hospitalAddress = 'Hospital address is required';
    }

    if (!formData.hospitalSize) {
      newErrors.hospitalSize = 'Please select hospital size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🏥</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Hospital Information</h2>
        <p className="text-gray-600">
          Tell us about your hospital to get started with Care Orchestrator
        </p>
      </div>

      <div className="space-y-6">
        {/* Hospital Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital Name *
          </label>
          <input
            type="text"
            value={formData.hospitalName}
            onChange={(e) => handleInputChange('hospitalName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
              errors.hospitalName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your hospital name"
          />
          {errors.hospitalName && (
            <p className="mt-1 text-sm text-red-600">{errors.hospitalName}</p>
          )}
        </div>

        {/* Administrator Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Administrator Name *
            </label>
            <input
              type="text"
              value={formData.adminName}
              onChange={(e) => handleInputChange('adminName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                errors.adminName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your full name"
            />
            {errors.adminName && (
              <p className="mt-1 text-sm text-red-600">{errors.adminName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.adminEmail}
              onChange={(e) => handleInputChange('adminEmail', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                errors.adminEmail ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="admin@hospital.com"
            />
            {errors.adminEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.adminEmail}</p>
            )}
          </div>
        </div>

        {/* Phone and Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.adminPhone}
              onChange={(e) => handleInputChange('adminPhone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                errors.adminPhone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.adminPhone && (
              <p className="mt-1 text-sm text-red-600">{errors.adminPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital Size *
            </label>
            <select
              value={formData.hospitalSize}
              onChange={(e) => handleInputChange('hospitalSize', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
                errors.hospitalSize ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select hospital size</option>
              {hospitalSizes.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
            {errors.hospitalSize && (
              <p className="mt-1 text-sm text-red-600">{errors.hospitalSize}</p>
            )}
          </div>
        </div>

        {/* Hospital Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hospital Address *
          </label>
          <textarea
            value={formData.hospitalAddress}
            onChange={(e) => handleInputChange('hospitalAddress', e.target.value)}
            rows={3}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white ${
              errors.hospitalAddress ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter complete hospital address"
          />
          {errors.hospitalAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.hospitalAddress}</p>
          )}
        </div>

        {/* Hospital Size Description */}
        {formData.hospitalSize && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <p className="text-sm text-blue-800">
              <strong>Selected:</strong> {hospitalSizes.find(s => s.value === formData.hospitalSize)?.label}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              {hospitalSizes.find(s => s.value === formData.hospitalSize)?.description}
            </p>
          </motion.div>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Continue to Plan Selection →
        </motion.button>
      </div>
    </div>
  );
};

export default HospitalInfoStep;

