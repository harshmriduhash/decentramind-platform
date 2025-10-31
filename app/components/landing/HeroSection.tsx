'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import NatureOverlays from './NatureOverlays';
import { useWallet } from '../../providers/WalletContext';

const HeroSection = () => {
  const router = useRouter();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { mintAgent } = useWallet();

  const handleMintAgent = async () => {
    try {
      await mintAgent('autonomous-cfo');
    } catch (error) {
      console.error('Failed to mint agent:', error);
    }
  };

  const handleLaunchDemo = () => {
    router.push('/dashboard');
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
    
    if (!isMusicPlaying) {
      // Create a simple data URL for ambient sound
      const audioDataUrl = createAmbientDataUrl();
      if (audioRef.current) {
        audioRef.current.src = audioDataUrl;
        audioRef.current.loop = true;
        audioRef.current.volume = 0.08; // Very subtle for true meditation
        audioRef.current.play().catch(() => {
          // If audio fails, just show visual feedback
          console.log('Audio playback not supported, showing visual feedback only');
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const createAmbientDataUrl = () => {
    // Create truly meditative ambient sound - like nature sounds
    const sampleRate = 44100;
    const duration = 8; // Longer duration for more natural feel
    const samples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate meditative ambient sound - like wind through trees
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      
      // Create noise-like sound (like wind) with gentle filtering
      let sample = 0;
      
      // Multiple frequency bands for rich, natural sound
      for (let band = 0; band < 5; band++) {
        const freq = 60 + band * 40; // 60Hz, 100Hz, 140Hz, 180Hz, 220Hz
        const amplitude = 0.02 / (band + 1); // Decreasing amplitude for higher frequencies
        
        // Add slight randomness to make it more organic
        const randomPhase = Math.sin(t * 0.05 + band) * 0.1;
        const wave = Math.sin(2 * Math.PI * freq * t + randomPhase) * amplitude;
        
        // Apply gentle envelope for natural breathing
        const envelope = Math.sin(Math.PI * t / duration) * 0.6 + 0.4;
        sample += wave * envelope;
      }
      
      // Add very subtle high-frequency shimmer (like distant wind chimes)
      const shimmer = Math.sin(2 * Math.PI * 800 * t) * 0.005 * Math.sin(t * 0.3);
      sample += shimmer;
      
      // Soft limiting to prevent harsh sounds
      sample = Math.tanh(sample * 2) * 0.5;
      
      view.setInt16(44 + i * 2, sample * 32767, true);
    }
    
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    // Initialize audio element
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = 0.08; // Very subtle for true meditation
      audioRef.current = audio;
    }
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Nature Overlays */}
      <NatureOverlays />
      
      {/* Enhanced cosmic elements */}
      <div className="absolute inset-0">
        {/* Large glowing orb */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Secondary orb */}
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Nature overlays - Crystal roots */}
        <div className="absolute inset-0">
          {[
            { left: 10, top: 20, rotation: 15 },
            { left: 80, top: 30, rotation: -20 },
            { left: 20, top: 70, rotation: 30 },
            { left: 70, top: 80, rotation: -15 },
          ].map((root, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-2 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-full"
              style={{
                left: `${root.left}%`,
                top: `${root.top}%`,
                transform: `rotate(${root.rotation}deg)`,
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scaleX: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 1,
              }}
            />
          ))}
        </div>

        {/* Floating blossoms */}
        {[
          { left: 15, top: 25, delay: 0 },
          { left: 85, top: 35, delay: 1 },
          { left: 25, top: 75, delay: 2 },
          { left: 75, top: 65, delay: 3 },
        ].map((blossom, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-60"
            style={{
              left: `${blossom.left}%`,
              top: `${blossom.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: blossom.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full mr-3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-purple-300">🚀 Now Live on Devnet</span>
          </div>
        </motion.div>

        {/* Enhanced Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-12"
        >
          {/* Floating AI Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-gradient-to-r from-cyan-400/40 to-purple-400/40 rounded-full"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.4, 0.8, 0.4],
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.6,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Enhanced Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight text-center mb-8"
        >
          <motion.span
            className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent block mb-2"
            animate={{
              textShadow: [
                "0 0 20px rgba(139, 92, 246, 0.5)",
                "0 0 40px rgba(139, 92, 246, 0.8)",
                "0 0 20px rgba(139, 92, 246, 0.5)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            DecentraMind
          </motion.span>
          <motion.span
            className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mb-4"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            Labs
          </motion.span>
          <motion.span
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-emerald-300 mt-6 block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            — The Swiss Army of AI Agents
          </motion.span>
        </motion.h1>


        {/* Enhanced Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl sm:text-2xl text-gray-300 mb-16 max-w-5xl mx-auto leading-relaxed"
        >
          <span className="text-cyan-400 font-semibold">Empowering users</span> through{' '}
          <span className="text-purple-400 font-semibold">tokenized intelligence</span>,{' '}
          <span className="text-emerald-400 font-semibold">decentralized governance</span>, and{' '}
          <span className="text-pink-400 font-semibold">self-evolving agents</span>.
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
        >
          <motion.button
            onClick={handleMintAgent}
            className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl font-bold text-xl transition-all duration-300 overflow-hidden shadow-2xl shadow-purple-500/25"
            whileHover={{ scale: 1.05, y: -2 }}
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
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 flex items-center">
              <span className="mr-3">🤖</span>
              Mint Your Agent
            </span>
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-xs">✨</span>
            </motion.div>
          </motion.button>

          <motion.button
            onClick={handleLaunchDemo}
            className="group px-12 py-6 border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 rounded-2xl font-bold text-xl transition-all duration-300 backdrop-blur-sm shadow-xl shadow-purple-500/10"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="group-hover:text-purple-300 transition-colors flex items-center">
              <span className="mr-3">🚀</span>
              Launch MVP Demo
            </span>
          </motion.button>
        </motion.div>

        {/* Ambient Music Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex justify-center mb-8"
        >
          <button
            onClick={toggleMusic}
            className="flex items-center px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
          >
            <span className="text-lg mr-2">{isMusicPlaying ? '🔊' : '🔇'}</span>
            <span className="text-sm text-gray-300">
              {isMusicPlaying ? 'Ambient On' : 'Ambient Off'}
            </span>
          </button>
        </motion.div>

        {/* Animated scroll cue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col items-center"
        >
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <motion.div
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.8,
              }}
            />
          ))}
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
