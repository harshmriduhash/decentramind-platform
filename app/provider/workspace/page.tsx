'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProviderAccess } from '../../hooks/useRoleCheck';
import { 
  Search, 
  Users, 
  Calendar, 
  Activity, 
  Heart, 
  Thermometer, 
  Droplets, 
  Weight,
  MessageCircle,
  Bell,
  Settings,
  LogOut,
  Plus,
  Filter,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Stethoscope,
  Pill,
  FileText,
  Shield
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  lastVisit: Date;
  nextAppointment?: Date;
  status: 'active' | 'inactive' | 'critical';
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    oxygenSaturation: number;
  };
  conditions: string[];
  medications: string[];
  notes: string[];
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine';
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  notes?: string;
}

interface VitalReading {
  id: string;
  patientId: string;
  timestamp: Date;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'weight' | 'oxygen_saturation';
  value: string | number;
  unit: string;
  notes?: string;
}

const ProviderWorkspace: React.FC = () => {
  const { user, isLoading: roleLoading, isAuthorized } = useProviderAccess();
  const [activeTab, setActiveTab] = useState('patients');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Show loading while checking role
  if (roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">You need provider or admin access to view this page.</p>
          <div className="space-x-4">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mock data
  const [patients] = useState<Patient[]>([
    {
      id: 'patient-1',
      name: 'John Smith',
      age: 45,
      gender: 'male',
      lastVisit: new Date('2024-01-10'),
      nextAppointment: new Date('2024-01-20'),
      status: 'active',
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
        weight: 180,
        oxygenSaturation: 98
      },
      conditions: ['Hypertension', 'Diabetes Type 2'],
      medications: ['Metformin', 'Lisinopril'],
      notes: ['Patient responding well to treatment', 'Needs follow-up in 3 months']
    },
    {
      id: 'patient-2',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'female',
      lastVisit: new Date('2024-01-12'),
      status: 'active',
      vitals: {
        bloodPressure: '110/70',
        heartRate: 68,
        temperature: 98.4,
        weight: 140,
        oxygenSaturation: 99
      },
      conditions: ['Anxiety'],
      medications: ['Sertraline'],
      notes: ['Patient reports improvement in symptoms']
    },
    {
      id: 'patient-3',
      name: 'Michael Brown',
      age: 67,
      gender: 'male',
      lastVisit: new Date('2024-01-08'),
      status: 'critical',
      vitals: {
        bloodPressure: '160/95',
        heartRate: 95,
        temperature: 99.2,
        weight: 200,
        oxygenSaturation: 92
      },
      conditions: ['Heart Disease', 'Diabetes Type 2', 'High Cholesterol'],
      medications: ['Metformin', 'Atorvastatin', 'Metoprolol'],
      notes: ['Requires immediate attention', 'Blood pressure elevated']
    }
  ]);

  const [appointments] = useState<Appointment[]>([
    {
      id: 'apt-1',
      patientId: 'patient-1',
      patientName: 'John Smith',
      doctorId: 'doctor-1',
      doctorName: 'Dr. Smith',
      date: new Date('2024-01-20'),
      time: '10:00 AM',
      type: 'follow-up',
      status: 'scheduled',
      notes: 'Follow-up for hypertension management'
    },
    {
      id: 'apt-2',
      patientId: 'patient-2',
      patientName: 'Sarah Johnson',
      doctorId: 'doctor-1',
      doctorName: 'Dr. Smith',
      date: new Date('2024-01-18'),
      time: '2:30 PM',
      type: 'consultation',
      status: 'scheduled'
    },
    {
      id: 'apt-3',
      patientId: 'patient-3',
      patientName: 'Michael Brown',
      doctorId: 'doctor-1',
      doctorName: 'Dr. Smith',
      date: new Date('2024-01-15'),
      time: '9:00 AM',
      type: 'emergency',
      status: 'in-progress',
      notes: 'Urgent blood pressure check'
    }
  ]);

  const [vitalReadings] = useState<VitalReading[]>([
    {
      id: 'vital-1',
      patientId: 'patient-1',
      timestamp: new Date('2024-01-15T10:30:00'),
      type: 'blood_pressure',
      value: '120/80',
      unit: 'mmHg',
      notes: 'Within normal range'
    },
    {
      id: 'vital-2',
      patientId: 'patient-1',
      timestamp: new Date('2024-01-15T10:31:00'),
      type: 'heart_rate',
      value: 72,
      unit: 'bpm',
      notes: 'Regular rhythm'
    },
    {
      id: 'vital-3',
      patientId: 'patient-3',
      timestamp: new Date('2024-01-15T09:00:00'),
      type: 'blood_pressure',
      value: '160/95',
      unit: 'mmHg',
      notes: 'Elevated - requires attention'
    }
  ]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const tabs = [
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'vitals', label: 'Vitals', icon: Activity },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'critical': return 'text-red-400 bg-red-400/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 bg-blue-400/20';
      case 'in-progress': return 'text-yellow-400 bg-yellow-400/20';
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'patients':
        return <PatientsTab patients={filteredPatients} onSelectPatient={setSelectedPatient} selectedPatient={selectedPatient} />;
      case 'appointments':
        return <AppointmentsTab appointments={appointments} />;
      case 'vitals':
        return <VitalsTab vitalReadings={vitalReadings} />;
      case 'chat':
        return <ChatTab selectedPatient={selectedPatient} />;
      default:
        return <PatientsTab patients={filteredPatients} onSelectPatient={setSelectedPatient} selectedPatient={selectedPatient} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Provider Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">👨‍⚕️</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Provider Workspace</h1>
                <p className="text-gray-300">Dr. Smith - Internal Medicine</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white"
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-white"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients, appointments, or vitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

// Tab Components
const PatientsTab: React.FC<{
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  selectedPatient: Patient | null;
}> = ({ patients, onSelectPatient, selectedPatient }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Patient Management</h2>
          <p className="text-gray-400">Manage your patients and view their health information</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add Patient</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {patients.map((patient) => (
              <motion.div
                key={patient.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectPatient(patient)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedPatient?.id === patient.id
                    ? 'bg-blue-500/20 border-blue-500/50'
                    : 'bg-slate-700/50 border-slate-600/50 hover:border-slate-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{patient.name}</div>
                      <div className="text-sm text-gray-400">
                        {patient.age} years old • {patient.gender}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last visit: {patient.lastVisit.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                    {patient.nextAppointment && (
                      <div className="text-xs text-gray-400 mt-1">
                        Next: {patient.nextAppointment.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-1">
          {selectedPatient ? (
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50">
              <h3 className="text-lg font-semibold text-white mb-4">Patient Details</h3>
              
              {/* Vitals */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Current Vitals</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-600/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-gray-400">BP</span>
                    </div>
                    <div className="text-white font-semibold">{selectedPatient.vitals.bloodPressure}</div>
                  </div>
                  <div className="bg-slate-600/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Activity className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-gray-400">HR</span>
                    </div>
                    <div className="text-white font-semibold">{selectedPatient.vitals.heartRate} bpm</div>
                  </div>
                  <div className="bg-slate-600/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      <span className="text-xs text-gray-400">Temp</span>
                    </div>
                    <div className="text-white font-semibold">{selectedPatient.vitals.temperature}°F</div>
                  </div>
                  <div className="bg-slate-600/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Weight className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-gray-400">Weight</span>
                    </div>
                    <div className="text-white font-semibold">{selectedPatient.vitals.weight} lbs</div>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Conditions</h4>
                <div className="space-y-2">
                  {selectedPatient.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Stethoscope className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Medications</h4>
                <div className="space-y-2">
                  {selectedPatient.medications.map((medication, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Pill className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white">{medication}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Notes</h4>
                <div className="space-y-2">
                  {selectedPatient.notes.map((note, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <FileText className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600/50 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Select a patient to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AppointmentsTab: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
  const todayAppointments = appointments.filter(apt => 
    apt.date.toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Appointments</h2>
          <p className="text-gray-400">Manage your daily schedule and patient appointments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Appointment</span>
        </motion.button>
      </div>

      {/* Today's Appointments */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Today's Schedule</h3>
        <div className="space-y-3">
          {todayAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{appointment.patientName}</div>
                    <div className="text-sm text-gray-400">{appointment.time}</div>
                    <div className="text-xs text-gray-500 capitalize">{appointment.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                  {appointment.notes && (
                    <div className="text-xs text-gray-400 mt-1 max-w-xs text-right">
                      {appointment.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Appointments */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">All Appointments</h3>
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{appointment.patientName}</div>
                    <div className="text-sm text-gray-400">
                      {appointment.date.toLocaleDateString()} at {appointment.time}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{appointment.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const VitalsTab: React.FC<{ vitalReadings: VitalReading[] }> = ({ vitalReadings }) => {
  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return <Heart className="w-4 h-4 text-red-400" />;
      case 'heart_rate': return <Activity className="w-4 h-4 text-green-400" />;
      case 'temperature': return <Thermometer className="w-4 h-4 text-orange-400" />;
      case 'weight': return <Weight className="w-4 h-4 text-blue-400" />;
      case 'oxygen_saturation': return <Droplets className="w-4 h-4 text-cyan-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const getVitalLabel = (type: string) => {
    switch (type) {
      case 'blood_pressure': return 'Blood Pressure';
      case 'heart_rate': return 'Heart Rate';
      case 'temperature': return 'Temperature';
      case 'weight': return 'Weight';
      case 'oxygen_saturation': return 'Oxygen Saturation';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Vital Signs</h2>
          <p className="text-gray-400">Monitor patient vital signs and health metrics</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Record Vitals</span>
        </motion.button>
      </div>

      <div className="space-y-3">
        {vitalReadings.map((reading) => (
          <div key={reading.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                  {getVitalIcon(reading.type)}
                </div>
                <div>
                  <div className="text-white font-semibold">{getVitalLabel(reading.type)}</div>
                  <div className="text-sm text-gray-400">
                    {reading.timestamp.toLocaleDateString()} at {reading.timestamp.toLocaleTimeString()}
                  </div>
                  {reading.notes && (
                    <div className="text-xs text-gray-500 mt-1">{reading.notes}</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {reading.value} {reading.unit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatTab: React.FC<{ selectedPatient: Patient | null }> = ({ selectedPatient }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      content: 'Hello! I\'m your Care Orchestrator AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: 'user',
        content: newMessage,
        timestamp: new Date()
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: 'I understand. Let me help you with that. Based on the patient data, I can provide insights and recommendations.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">AI Chat Assistant</h2>
        <p className="text-gray-400">Chat with your Care Orchestrator AI for insights and recommendations</p>
      </div>

      <div className="bg-slate-700/50 rounded-lg border border-slate-600/50 h-96 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-600 text-white'
                }`}
              >
                <div className="text-sm">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-600/50">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
            >
              Send
            </motion.button>
          </div>
        </div>
      </div>

      {/* Patient Context */}
      {selectedPatient && (
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <h3 className="text-lg font-semibold text-white mb-2">Patient Context</h3>
          <div className="text-sm text-gray-300">
            Currently viewing: <span className="text-white font-medium">{selectedPatient.name}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            The AI can provide insights specific to this patient's conditions and vitals.
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-400/20';
    case 'critical': return 'text-red-400 bg-red-400/20';
    case 'inactive': return 'text-gray-400 bg-gray-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

const getAppointmentStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled': return 'text-blue-400 bg-blue-400/20';
    case 'in-progress': return 'text-yellow-400 bg-yellow-400/20';
    case 'completed': return 'text-green-400 bg-green-400/20';
    case 'cancelled': return 'text-red-400 bg-red-400/20';
    default: return 'text-gray-400 bg-gray-400/20';
  }
};

export default ProviderWorkspace;
