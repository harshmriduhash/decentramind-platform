'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../stores/themeStore';

// Theme configurations
const visualThemes = {
  cosmic: {
    name: '🌌 Cosmic',
    description: 'Starfield, deep colors',
    bgClass: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    accentClass: 'from-purple-500 to-blue-500',
    textClass: 'text-white',
    previewBg: 'bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800',
  },
  nature: {
    name: '🌿 Nature',
    description: 'Vines, greens, floral overlays',
    bgClass: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900',
    accentClass: 'from-emerald-500 to-green-500',
    textClass: 'text-white',
    previewBg: 'bg-gradient-to-br from-emerald-800 via-green-700 to-teal-800',
  },
  neon: {
    name: '⚡ Neon',
    description: 'Cyberpunk glow',
    bgClass: 'bg-gradient-to-br from-black via-purple-900 to-pink-900',
    accentClass: 'from-cyan-400 to-pink-500',
    textClass: 'text-white',
    previewBg: 'bg-gradient-to-br from-gray-900 via-purple-800 to-pink-800',
  },
  minimal: {
    name: '⚪ Minimal',
    description: 'Clean, light',
    bgClass: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    accentClass: 'from-gray-600 to-gray-800',
    textClass: 'text-gray-900',
    previewBg: 'bg-gradient-to-br from-gray-100 via-white to-gray-200',
  },
};

const audioThemes = {
  meditation: {
    name: '🧘 Meditation',
    description: 'Wind sounds',
    file: '/assets/audio/wind.wav',
    icon: '🧘',
  },
  synthwave: {
    name: '🎵 Synthwave',
    description: 'Retro electronic',
    file: '/assets/audio/synthwave.mp3',
    icon: '🎵',
  },
  ambient: {
    name: '🌊 Ambient',
    description: 'Atmospheric sounds',
    file: '/assets/audio/ambient.mp3',
    icon: '🌊',
  },
  silence: {
    name: '🔇 Silence',
    description: 'No audio',
    file: null,
    icon: '🔇',
  },
};

const ThemeCustomizer = () => {
  const {
    visualTheme,
    audioTheme,
    isOpen,
    setVisualTheme,
    setAudioTheme,
    toggleOpen,
  } = useThemeStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle audio playback
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioTheme === 'silence') {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (audioRef.current && audioThemes[audioTheme].file) {
      audioRef.current.src = audioThemes[audioTheme].file!;
      audioRef.current.loop = true;
    }
  }, [audioTheme]);

  const toggleAudio = () => {
    if (audioTheme === 'silence') return;

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {
          console.log('Audio playback failed');
        });
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const theme = visualThemes[visualTheme];
    
    console.log('Applying theme:', visualTheme, theme);
    
    // Remove existing theme classes
    root.classList.remove(
      'theme-cosmic', 'theme-nature', 'theme-neon', 'theme-minimal'
    );
    
    // Add new theme class
    root.classList.add(`theme-${visualTheme}`);
    
    // Update CSS custom properties
    root.style.setProperty('--theme-bg', theme.bgClass);
    root.style.setProperty('--theme-accent', theme.accentClass);
    root.style.setProperty('--theme-text', theme.textClass);
    
    // Also apply theme to body for immediate visual feedback
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${visualTheme}`);
  }, [visualTheme]);

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => console.log('Audio loading failed')}
      />

      {/* Floating Theme Button */}
      <motion.button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full shadow-2xl shadow-purple-500/25 flex items-center justify-center text-white text-xl transition-all duration-300"
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 10px 30px rgba(147, 51, 234, 0.3)",
            "0 20px 40px rgba(147, 51, 234, 0.5)",
            "0 10px 30px rgba(147, 51, 234, 0.3)",
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        aria-label="Open theme customizer"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ⚙️
        </motion.div>
      </motion.button>

      {/* Theme Customizer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-40 right-6 z-40 w-80 max-w-[calc(100vw-3rem)] max-h-[calc(100vh-12rem)] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-labelledby="theme-customizer-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h2 id="theme-customizer-title" className="text-xl font-bold text-white">
                  Theme Customizer
                </h2>
                <motion.button
                  onClick={toggleOpen}
                  className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close theme customizer"
                >
                  ✕
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-16rem)]">
              {/* Visual Themes */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Visual Theme</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(visualThemes).map(([key, theme]) => (
                    <motion.button
                      key={key}
                      onClick={() => setVisualTheme(key as ThemeState['visualTheme'])}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        visualTheme === key
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-lg mb-1">{theme.name}</div>
                      <div className="text-sm text-gray-400">{theme.description}</div>
                      
                      {/* Theme Preview */}
                      <div className={`mt-3 w-full h-8 rounded-lg ${theme.previewBg} relative overflow-hidden`}>
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${theme.accentClass} opacity-30`}
                          animate={{
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Audio Themes */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Audio Theme</h3>
                <div className="space-y-2">
                  {Object.entries(audioThemes).map(([key, theme]) => (
                    <motion.button
                      key={key}
                      onClick={() => setAudioTheme(key as ThemeState['audioTheme'])}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left flex items-center justify-between ${
                        audioTheme === key
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{theme.icon}</span>
                        <div>
                          <div className="text-white font-medium">{theme.name}</div>
                          <div className="text-sm text-gray-400">{theme.description}</div>
                        </div>
                      </div>
                      {audioTheme === key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-purple-500 rounded-full"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                {/* Audio Controls */}
                {audioTheme !== 'silence' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
                  >
                    <div className="flex items-center space-x-4 mb-3">
                      <motion.button
                        onClick={toggleAudio}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isPlaying
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                      >
                        {isPlaying ? '⏸️' : '▶️'}
                      </motion.button>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">Volume</div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                          aria-label="Volume control"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {audioThemes[audioTheme].file ? 'Audio loaded' : 'No audio file'}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Live Preview */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
                <div className={`p-4 rounded-xl border border-slate-700/50 ${visualThemes[visualTheme].previewBg}`}>
                  <div className="space-y-3">
                    <div className={`h-4 rounded ${visualThemes[visualTheme].accentClass} bg-gradient-to-r`} />
                    <div className={`h-3 rounded bg-slate-600/50 w-3/4`} />
                    <div className={`h-3 rounded bg-slate-600/50 w-1/2`} />
                    <div className="flex space-x-2">
                      <div className={`w-8 h-8 rounded-full ${visualThemes[visualTheme].accentClass} bg-gradient-to-r`} />
                      <div className={`w-8 h-8 rounded-full ${visualThemes[visualTheme].accentClass} bg-gradient-to-r`} />
                      <div className={`w-8 h-8 rounded-full ${visualThemes[visualTheme].accentClass} bg-gradient-to-r`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
              <div className="text-xs text-gray-400 text-center">
                Themes are saved automatically
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            onClick={toggleOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeCustomizer;