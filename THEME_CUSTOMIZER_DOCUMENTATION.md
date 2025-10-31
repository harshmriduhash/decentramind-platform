# ThemeCustomizer Component Documentation

## Overview

The `ThemeCustomizer` component provides a comprehensive theme customization system for the DecentraMind landing page, allowing users to personalize both visual and audio experiences.

## Features

### 🎨 Visual Themes
- **🌌 Cosmic**: Starfield with deep purple/blue colors
- **🌿 Nature**: Green/emerald theme with natural elements  
- **⚡ Neon**: Cyberpunk glow with cyan/pink accents
- **⚪ Minimal**: Clean, light theme with gray tones

### 🎵 Audio Themes
- **🧘 Meditation**: Wind sounds for relaxation
- **🎵 Synthwave**: Retro electronic music
- **🌊 Ambient**: Atmospheric ambient sounds
- **🔇 Silence**: No audio

## Technical Implementation

### Dependencies
- **Next.js 14**: React framework
- **Tailwind CSS**: Styling system
- **Framer Motion**: Animations
- **Zustand**: State management

### File Structure
```
app/
├── components/landing/
│   └── ThemeCustomizer.tsx          # Main component
├── providers/
│   └── ThemeProvider.tsx            # Global theme context
└── globals.css                      # Theme CSS classes

public/assets/audio/
├── wind.wav                         # Meditation audio
├── synthwave.mp3                    # Synthwave audio
├── ambient.mp3                      # Ambient audio
└── README.md                        # Audio documentation
```

## Component Architecture

### State Management (Zustand)
```typescript
interface ThemeState {
  visualTheme: 'cosmic' | 'nature' | 'neon' | 'minimal';
  audioTheme: 'meditation' | 'synthwave' | 'ambient' | 'silence';
  isOpen: boolean;
  setVisualTheme: (theme) => void;
  setAudioTheme: (theme) => void;
  toggleOpen: () => void;
}
```

### Theme Configuration
Each visual theme includes:
- Background gradient classes
- Accent color gradients
- Text color classes
- Preview background colors

### Audio Management
- HTML5 Audio API integration
- Volume control (0-1 range)
- Loop functionality
- Error handling for missing files

## Usage

### Basic Integration
The component is already integrated into `LandingWorld.tsx`:

```tsx
import ThemeCustomizer from './ThemeCustomizer';

// In component render:
<ThemeCustomizer />
```

### Global Theme Access
Use the theme context in any component:

```tsx
import { useTheme } from '../providers/ThemeProvider';

const MyComponent = () => {
  const { visualTheme, audioTheme } = useTheme();
  
  return (
    <div className={`theme-${visualTheme}`}>
      Current theme: {visualTheme}
    </div>
  );
};
```

## Accessibility Features

### Keyboard Navigation
- Tab navigation through all interactive elements
- Enter/Space to activate buttons
- Escape to close panel
- Arrow keys for volume control

### Screen Reader Support
- ARIA labels on all interactive elements
- Semantic HTML structure
- Role attributes for dialog and modal
- Descriptive text for all controls

### Visual Accessibility
- High contrast mode support
- Reduced motion preferences
- Focus indicators
- Color-blind friendly themes

## Customization

### Adding New Visual Themes
1. Add theme configuration to `visualThemes` object
2. Define CSS classes in `globals.css`
3. Update theme provider logic

### Adding New Audio Themes
1. Add audio file to `/public/assets/audio/`
2. Update `audioThemes` configuration
3. Test audio playback functionality

### Styling Customization
- Modify CSS custom properties in `globals.css`
- Update Tailwind classes in component
- Adjust animation timings in Framer Motion

## Performance Considerations

### Optimizations
- Zustand for efficient state management
- CSS custom properties for theme switching
- Lazy loading of audio files
- Debounced theme changes

### Browser Support
- Modern browsers with CSS custom properties
- HTML5 Audio API support
- ES6+ JavaScript features

## Integration with Layout

### ThemeProvider Setup
The `ThemeProvider` is already configured in `layout.tsx`:

```tsx
<ThemeProvider>
  <WalletProvider>
    <ToastProvider>
      {children}
    </ToastProvider>
  </WalletProvider>
</ThemeProvider>
```

### CSS Integration
Theme classes are automatically applied to `document.documentElement`:

```css
.theme-cosmic { /* cosmic styles */ }
.theme-nature { /* nature styles */ }
.theme-neon { /* neon styles */ }
.theme-minimal { /* minimal styles */ }
```

## Audio File Requirements

### File Formats
- **WAV**: For meditation sounds (uncompressed)
- **MP3**: For music and ambient sounds (compressed)

### Specifications
- **Sample Rate**: 44.1kHz
- **Bit Depth**: 16-bit minimum
- **Channels**: Stereo preferred
- **File Size**: Under 5MB per file
- **Duration**: 2-6 minutes (will loop)

### Licensing
- Use royalty-free or properly licensed audio
- Ensure commercial use rights
- Credit artists if required

## Troubleshooting

### Common Issues
1. **Audio not playing**: Check file paths and browser audio policies
2. **Theme not applying**: Verify CSS classes are loaded
3. **Performance issues**: Check for memory leaks in audio elements

### Debug Mode
Enable console logging for theme changes:
```typescript
// Add to ThemeCustomizer component
console.log('Theme changed:', { visualTheme, audioTheme });
```

## Future Enhancements

### Planned Features
- Custom color picker for themes
- Audio visualization
- Theme sharing/export
- User preference persistence
- Advanced audio controls (EQ, effects)

### API Integration
- Theme synchronization across devices
- Community theme sharing
- Analytics on theme usage
- A/B testing for theme effectiveness

## Support

For issues or feature requests:
1. Check console for errors
2. Verify audio file accessibility
3. Test in different browsers
4. Review accessibility compliance

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Compatibility**: Next.js 14+, React 18+, Modern browsers
