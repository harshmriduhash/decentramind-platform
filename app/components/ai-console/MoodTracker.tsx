'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodEntry {
  id: string;
  mood: string;
  emoji: string;
  description: string;
  xpReward: number;
  timestamp: string;
}

const MoodTracker: React.FC = () => {
  const [moods, setMoods] = useState<MoodEntry[]>([
    {
      id: '1',
      mood: 'Happy',
      emoji: '😊',
      description: 'Feeling great after morning workout!',
      xpReward: 5,
      timestamp: '2024-01-15T08:00:00Z'
    },
    {
      id: '2',
      mood: 'Energetic',
      emoji: '⚡',
      description: 'Productive day at work',
      xpReward: 5,
      timestamp: '2024-01-14T14:00:00Z'
    },
    {
      id: '3',
      mood: 'Calm',
      emoji: '😌',
      description: 'Relaxing evening with meditation',
      xpReward: 5,
      timestamp: '2024-01-14T20:00:00Z'
    }
  ]);

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const moodOptions = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'from-yellow-400 to-orange-500' },
    { id: 'energetic', emoji: '⚡', label: 'Energetic', color: 'from-blue-400 to-cyan-500' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: 'from-green-400 to-emerald-500' },
    { id: 'focused', emoji: '🎯', label: 'Focused', color: 'from-purple-400 to-indigo-500' },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'from-gray-400 to-slate-500' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'from-red-400 to-pink-500' },
    { id: 'excited', emoji: '🤩', label: 'Excited', color: 'from-pink-400 to-rose-500' },
    { id: 'grateful', emoji: '🙏', label: 'Grateful', color: 'from-emerald-400 to-teal-500' }
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleAddMood = () => {
    if (!selectedMood || !description.trim()) return;

    const moodOption = moodOptions.find(m => m.id === selectedMood);
    if (!moodOption) return;

    const newMood: MoodEntry = {
      id: Date.now().toString(),
      mood: moodOption.label,
      emoji: moodOption.emoji,
      description: description.trim(),
      xpReward: 5,
      timestamp: new Date().toISOString()
    };

    setMoods(prev => [newMood, ...prev]);
    setDescription('');
    setSelectedMood(null);
    setIsAdding(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const totalXP = moods.reduce((sum, mood) => sum + mood.xpReward, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">❤️</span>
            <div>
              <h3 className="text-lg font-semibold text-white">Mood Tracker</h3>
              <p className="text-sm text-gray-400">{moods.length} entries • {totalXP} XP earned</p>
            </div>
          </div>
          <motion.button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg text-white font-medium hover:from-rose-600 hover:to-pink-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAdding ? 'Cancel' : 'Add Mood'}
          </motion.button>
        </div>
      </div>

      {/* Add Mood Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 border-b border-slate-700/30"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">How are you feeling?</label>
                <div className="grid grid-cols-4 gap-2">
                  {moodOptions.map((mood) => (
                    <motion.button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        selectedMood === mood.id
                          ? `bg-gradient-to-r ${mood.color} text-white border-transparent`
                          : 'bg-slate-700/30 border-slate-600/30 text-gray-300 hover:bg-slate-600/50'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">{mood.emoji}</div>
                        <div className="text-xs">{mood.label}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-3 bg-slate-700/30 border border-slate-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-rose-500/50 transition-colors duration-200"
                  rows={2}
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  onClick={handleAddMood}
                  disabled={!selectedMood}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedMood
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700'
                      : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={selectedMood ? { scale: 1.05 } : {}}
                  whileTap={selectedMood ? { scale: 0.95 } : {}}
                >
                  Log Mood (+5 XP)
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood History */}
      <div className="p-6">
        <div className="space-y-4">
          {moods.map((mood, index) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:bg-slate-700/50 transition-all duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{mood.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-white">{mood.mood}</h4>
                    <span className="text-emerald-400 text-sm">+{mood.xpReward} XP</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{mood.description}</p>
                  <div className="text-xs text-gray-500">{formatTimestamp(mood.timestamp)}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {moods.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl mb-4">😊</div>
            <h3 className="text-lg font-medium text-gray-400 mb-2">No mood entries yet</h3>
            <p className="text-sm text-gray-500">Start tracking your daily mood and earn XP!</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MoodTracker;
