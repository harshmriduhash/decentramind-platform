'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface DoctorInvitesData {
  emails: string[];
  csvFile: File | null;
  totalDoctors: number;
}

interface InviteDoctorsStepProps {
  data: DoctorInvitesData;
  onUpdate: (data: DoctorInvitesData) => void;
  onNext: () => void;
  onPrev: () => void;
}

const InviteDoctorsStep: React.FC<InviteDoctorsStepProps> = ({ data, onUpdate, onNext, onPrev }) => {
  const [formData, setFormData] = useState<DoctorInvitesData>(data);
  const [emailInput, setEmailInput] = useState('');
  const [csvFileName, setCsvFileName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmail = () => {
    if (!emailInput.trim()) return;

    const email = emailInput.trim().toLowerCase();
    
    if (!validateEmail(email)) {
      setErrors(['Please enter a valid email address']);
      return;
    }

    if (formData.emails.includes(email)) {
      setErrors(['This email is already in the list']);
      return;
    }

    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, email],
      totalDoctors: prev.emails.length + 1,
    }));
    
    setEmailInput('');
    setErrors([]);
  };

  const removeEmail = (emailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails.filter(email => email !== emailToRemove),
      totalDoctors: prev.emails.length - 1,
    }));
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setFormData(prev => ({
        ...prev,
        csvFile: file,
        totalDoctors: prev.totalDoctors + 1, // Estimate 1 doctor per CSV
      }));
      setCsvFileName(file.name);
    } else {
      setErrors(['Please select a valid CSV file']);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addEmail();
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'Name,Email,Department,Specialization\nDr. John Smith,john.smith@hospital.com,Cardiology,Cardiologist\nDr. Jane Doe,jane.doe@hospital.com,Pediatrics,Pediatrician';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doctor_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleNext = () => {
    if (formData.emails.length === 0 && !formData.csvFile) {
      setErrors(['Please add at least one doctor email or upload a CSV file']);
      return;
    }

    onUpdate(formData);
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👥</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Invite Your Doctors</h2>
        <p className="text-gray-600">
          Add your medical team to get started with Care Orchestrator
        </p>
      </div>

      {/* Invitation Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Manual Email Entry */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Individual Emails</h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="doctor@hospital.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addEmail}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Add
              </motion.button>
            </div>

            {/* Email List */}
            {formData.emails.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Added doctors ({formData.emails.length}):</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {formData.emails.map((email, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                    >
                      <span className="text-sm text-gray-700">{email}</span>
                      <button
                        onClick={() => removeEmail(email)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CSV Upload */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload CSV File</h3>
          
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                {csvFileName ? csvFileName : 'Click to upload CSV file'}
              </p>
              <p className="text-sm text-gray-500">
                CSV format with doctor information
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="hidden"
            />

            <div className="text-center">
              <button
                onClick={downloadTemplate}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              >
                Download CSV template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          {errors.map((error, index) => (
            <p key={index} className="text-red-600 text-sm">{error}</p>
          ))}
        </motion.div>
      )}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Invitation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-blue-700">Individual emails:</p>
            <p className="font-semibold text-blue-900">{formData.emails.length}</p>
          </div>
          <div>
            <p className="text-blue-700">CSV file:</p>
            <p className="font-semibold text-blue-900">{csvFileName ? '1 file' : 'None'}</p>
          </div>
          <div>
            <p className="text-blue-700">Total doctors:</p>
            <p className="font-semibold text-blue-900">{formData.totalDoctors}</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrev}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          ← Back to Plan Selection
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          Continue to Confirmation →
        </motion.button>
      </div>
    </div>
  );
};

export default InviteDoctorsStep;

