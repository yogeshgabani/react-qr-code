import type { QRGradient } from './qr-types';
import type { ModuleShape, CornerStyle, EyeShape } from './shapes';
import type { QRAnimation } from './animations';

export type QRThemeName =
  | 'light'
  | 'dark'
  | 'neon'
  | 'corporate'
  | 'glassmorphism'
  | 'gradient'
  | 'modern'
  | 'minimal'
  | 'cyberpunk'
  | 'premium';

export interface QRTheme {
  fgColor?: string;
  bgColor?: string;
  shape?: ModuleShape;
  cornerStyle?: CornerStyle;
  eyeShape?: EyeShape;
  eyeColor?: string;
  gradient?: QRGradient;
  animation?: QRAnimation;
}

export const THEMES: Record<QRThemeName, QRTheme> = {
  light: {
    fgColor: '#0f172a',
    bgColor: '#ffffff',
    shape: 'square',
    cornerStyle: 'square',
    eyeShape: 'square',
  },
  dark: {
    fgColor: '#f8fafc',
    bgColor: '#0f172a',
    shape: 'square',
    cornerStyle: 'square',
    eyeShape: 'square',
  },
  neon: {
    fgColor: '#00ffe1',
    bgColor: '#0d0221',
    shape: 'dot',
    cornerStyle: 'modern',
    eyeShape: 'modern',
    eyeColor: '#ff00d4',
    animation: 'glow',
  },
  corporate: {
    fgColor: '#1e3a8a',
    bgColor: '#ffffff',
    shape: 'square',
    cornerStyle: 'rounded',
    eyeShape: 'rounded',
    eyeColor: '#dc2626',
  },
  glassmorphism: {
    fgColor: '#1e1b4b',
    bgColor: '#e0e7ff',
    shape: 'rounded',
    cornerStyle: 'soft-rounded',
    eyeShape: 'rounded',
    eyeColor: '#6366f1',
  },
  gradient: {
    fgColor: '#000000',
    bgColor: '#ffffff',
    shape: 'rounded',
    cornerStyle: 'modern',
    eyeShape: 'modern',
    gradient: {
      type: 'linear',
      colors: ['#667eea', '#764ba2'],
      rotation: 135,
    },
  },
  modern: {
    fgColor: '#111827',
    bgColor: '#ffffff',
    shape: 'rounded',
    cornerStyle: 'modern',
    eyeShape: 'modern',
  },
  minimal: {
    fgColor: '#1f2937',
    bgColor: '#fafafa',
    shape: 'dot',
    cornerStyle: 'rounded',
    eyeShape: 'rounded',
  },
  cyberpunk: {
    fgColor: '#f6ff00',
    bgColor: '#160c2c',
    shape: 'star',
    cornerStyle: 'modern',
    eyeShape: 'diamond',
    eyeColor: '#ff2bd6',
    gradient: {
      type: 'linear',
      colors: ['#f6ff00', '#ff2bd6'],
      rotation: 45,
    },
    animation: 'pulse',
  },
  premium: {
    fgColor: '#a16207',
    bgColor: '#0c0a09',
    shape: 'hexagon',
    cornerStyle: 'modern',
    eyeShape: 'modern',
    eyeColor: '#fbbf24',
    gradient: {
      type: 'linear',
      colors: ['#fbbf24', '#d97706', '#92400e'],
      rotation: 135,
    },
  },
};
