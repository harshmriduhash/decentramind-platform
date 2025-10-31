'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '../stores/themeStore';

// Theme Context for global access
const ThemeContext = createContext<{
  visualTheme: string;
  audioTheme: string;
}>({
  visualTheme: 'cosmic',
  audioTheme: 'silence',
});

export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { visualTheme, audioTheme } = useThemeStore();

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-cosmic', 'theme-nature', 'theme-neon', 'theme-minimal');
    
    // Add current theme class
    root.classList.add(`theme-${visualTheme}`);
    
    // Update CSS custom properties
    const themes = {
      cosmic: {
        bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
        accent: 'from-purple-500 to-blue-500',
        text: 'text-white',
      },
      nature: {
        bg: 'bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900',
        accent: 'from-emerald-500 to-green-500',
        text: 'text-white',
      },
      neon: {
        bg: 'bg-gradient-to-br from-black via-purple-900 to-pink-900',
        accent: 'from-cyan-400 to-pink-500',
        text: 'text-white',
      },
      minimal: {
        bg: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
        accent: 'from-gray-600 to-gray-800',
        text: 'text-gray-900',
      },
    };

    const currentTheme = themes[visualTheme as keyof typeof themes];
    
    root.style.setProperty('--theme-bg', currentTheme.bg);
    root.style.setProperty('--theme-accent', currentTheme.accent);
    root.style.setProperty('--theme-text', currentTheme.text);
  }, [visualTheme]);

  return (
    <ThemeContext.Provider value={{ visualTheme, audioTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};