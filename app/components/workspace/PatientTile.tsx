'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  status: 'stable' | 'monitoring' | 'critical';
  lastVisit: string;
}

interface PatientTileProps {
  patient: Patient;
  onClick: () => void;
  isSelected: boolean;
}

const PatientTile: React.FC<PatientTileProps> = ({ patient, onClick, isSelected }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'monitoring':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'stable':
        return '✅';
      case 'monitoring':
        return '⚠️';
      case 'critical':
        return '🚨';
      default:
        return '❓';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${
        isSelected
          ? 'border-purple-500/50 bg-purple-500/10'
          : 'border-slate-700/30 hover:border-slate-600/50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{patient.name}</h3>
          <p className="text-gray-400 text-sm">Age: {patient.age}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}>
          <span className="mr-1">{getStatusIcon(patient.status)}</span>
          {patient.status}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Condition:</span>
          <span className="text-white text-sm font-medium">{patient.condition}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Last Visit:</span>
          <span className="text-white text-sm">{patient.lastVisit}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/30">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs">Patient ID</span>
          <span className="text-purple-400 text-xs font-mono">#{patient.id.toString().padStart(4, '0')}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientTile;
