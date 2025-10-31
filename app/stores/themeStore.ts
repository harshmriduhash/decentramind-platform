import { create } from 'zustand';

// Theme Store using Zustand
export interface ThemeState {
  visualTheme: 'cosmic' | 'nature' | 'neon' | 'minimal';
  audioTheme: 'meditation' | 'synthwave' | 'ambient' | 'silence';
  isOpen: boolean;
  setVisualTheme: (theme: ThemeState['visualTheme']) => void;
  setAudioTheme: (theme: ThemeState['audioTheme']) => void;
  toggleOpen: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  visualTheme: 'cosmic',
  audioTheme: 'silence',
  isOpen: false,
  setVisualTheme: (theme) => set({ visualTheme: theme }),
  setAudioTheme: (theme) => set({ audioTheme: theme }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
