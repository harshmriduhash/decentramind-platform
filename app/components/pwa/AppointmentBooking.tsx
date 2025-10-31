'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AppointmentBookingProps {
  hospitalSlug: string;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ hospitalSlug }) => {
  const [bookingForm, setBookingForm] = useState({
    patientName: '',
    email: '',
    phone: '',
    department: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
    urgency: 'normal'
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const departments = [
    'Cardiology',
    'Dermatology',
    'Emergency Medicine',
    'Family Medicine',
    'Internal Medicine',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Psychiatry',
    'Radiology'
  ];

  const doctors = [
    'Dr. Sarah Johnson',
    'Dr. Michael Chen',
    'Dr. Emily Rodriguez',
    'Dr. David Kim',
    'Dr. Lisa Thompson'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleInputChange = (field: string, value: string) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    // Simulate available slots based on date
    const slots = timeSlots.filter(() => Math.random() > 0.3);
    setAvailableSlots(slots);
  };

  const handleBookAppointment = () => {
    if (!bookingForm.patientName || !bookingForm.email || !selectedDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Simulate booking process
    console.log('Booking appointment:', { ...bookingForm, date: selectedDate });
    alert('Appointment booked successfully! You will receive a confirmation email shortly.');
    
    // Reset form
    setBookingForm({
      patientName: '',
      email: '',
      phone: '',
      department: '',
      doctor: '',
      date: '',
      time: '',
      reason: '',
      urgency: 'normal'
    });
    setSelectedDate('');
    setAvailableSlots([]);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'normal':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
          <p className="text-gray-400">Hospital: {hospitalSlug}</p>
        </div>
        <div className="text-sm text-gray-400">
          Available Today
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Patient Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={bookingForm.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={bookingForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={bookingForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Department
              </label>
              <select
                value={bookingForm.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preferred Doctor
              </label>
              <select
                value={bookingForm.doctor}
                onChange={(e) => handleInputChange('doctor', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor} value={doctor}>{doctor}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Urgency Level
              </label>
              <select
                value={bookingForm.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
              >
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for Visit
              </label>
              <textarea
                value={bookingForm.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                placeholder="Briefly describe your symptoms or reason for the appointment..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* Date & Time Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Schedule Appointment</h3>
          
          {/* Date Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
            />
          </div>

          {/* Available Time Slots */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <motion.button
                    key={slot}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInputChange('time', slot)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      bookingForm.time === slot
                        ? 'bg-purple-500 text-white'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                    }`}
                  >
                    {slot}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Booking Summary */}
          {selectedDate && bookingForm.time && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
            >
              <h4 className="text-white font-medium mb-2">Appointment Summary</h4>
              <div className="space-y-1 text-sm">
                <p className="text-gray-300">Date: {selectedDate}</p>
                <p className="text-gray-300">Time: {bookingForm.time}</p>
                {bookingForm.department && (
                  <p className="text-gray-300">Department: {bookingForm.department}</p>
                )}
                {bookingForm.doctor && (
                  <p className="text-gray-300">Doctor: {bookingForm.doctor}</p>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300">Urgency:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(bookingForm.urgency)}`}>
                    {bookingForm.urgency}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Book Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookAppointment}
            disabled={!selectedDate || !bookingForm.time}
            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-all duration-300"
          >
            Book Appointment
          </motion.button>
        </motion.div>
      </div>

      {/* Emergency Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
      >
        <div className="flex items-center space-x-2">
          <span className="text-red-400 text-lg">🚨</span>
          <div>
            <p className="text-red-400 font-medium">Emergency Notice</p>
            <p className="text-red-300 text-sm">
              For urgent medical issues, please call 911 or visit the emergency room immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AppointmentBooking;
