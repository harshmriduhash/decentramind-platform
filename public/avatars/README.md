# Agent Avatars Directory

This directory contains static avatar images for DecentraMind AI agents.

## Usage

### Next.js Image Component
```tsx
import Image from 'next/image';

// For agent avatars
<Image
  src="/avatars/agent-cfo.png"
  alt="Autonomous CFO"
  width={40}
  height={40}
  className="rounded-full"
/>
```

### Direct Path Reference
```tsx
// In CSS or style attributes
backgroundImage: 'url(/avatars/agent-crypto.png)'

// In Tailwind classes
className="bg-[url('/avatars/agent-care.png')]"
```

## File Naming Convention

- `agent-cfo.png` - Autonomous CFO avatar
- `agent-crypto.png` - Crypto Alpha Assistant avatar  
- `agent-care.png` - Care Orchestrator avatar
- `default-agent.png` - Fallback avatar for unknown agents

## Image Specifications

- **Format**: PNG with transparency support
- **Size**: 200x200px minimum (Next.js will optimize)
- **Style**: Consistent design language with DecentraMind branding
- **Background**: Transparent or solid color matching theme

## Adding New Agent Avatars

1. Add PNG file to this directory following naming convention
2. Update agent service to reference the new avatar
3. Test with Next.js Image component for optimization

## Static Asset Loading

All files in `/public/avatars/` are served statically by Next.js at `/avatars/filename.png`.

No additional configuration needed - Next.js handles optimization automatically.

