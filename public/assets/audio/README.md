# Audio Assets for Theme Customizer

This directory contains audio files for the Theme Customizer component.

## Required Audio Files:

### 🧘 Meditation Theme
- **File**: `wind.wav`
- **Description**: Gentle wind sounds for meditation
- **Format**: WAV, 44.1kHz, stereo
- **Duration**: 2-5 minutes (looped)

### 🎵 Synthwave Theme  
- **File**: `synthwave.mp3`
- **Description**: Retro electronic/synthwave music
- **Format**: MP3, 128kbps or higher
- **Duration**: 3-5 minutes (looped)

### 🌊 Ambient Theme
- **File**: `ambient.mp3` 
- **Description**: Atmospheric ambient sounds
- **Format**: MP3, 128kbps or higher
- **Duration**: 4-6 minutes (looped)

## Audio File Guidelines:

1. **File Size**: Keep under 5MB per file for web performance
2. **Loop Points**: Ensure seamless looping (no clicks/pops)
3. **Volume**: Normalize to -12dB to prevent clipping
4. **Fade**: Add 1-2 second fade in/out for smooth transitions
5. **Licensing**: Use royalty-free or properly licensed audio

## Placeholder Files:

Currently using placeholder files. Replace with actual audio files:

```bash
# Example commands to add real audio files:
cp /path/to/wind.wav wind.wav
cp /path/to/synthwave.mp3 synthwave.mp3  
cp /path/to/ambient.mp3 ambient.mp3
```

## Integration:

The ThemeCustomizer component will automatically load these files when users select audio themes. Audio playback is handled via HTML5 Audio API with volume controls and loop functionality.
