import type { QRCodeProps } from '../components/QRCode/QRCode';

export type TemplateCategory =
  | 'business'
  | 'restaurant'
  | 'portfolio'
  | 'wedding'
  | 'event'
  | 'education'
  | 'real-estate'
  | 'healthcare'
  | 'ecommerce'
  | 'startup'
  | 'agency';

export interface QRTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  /** Preset props applied to <QRCode/>. */
  preset: Omit<QRCodeProps, 'value'>;
  /** Sample value used for the preview. */
  sampleValue: string;
}

export const TEMPLATES: QRTemplate[] = [
  // ── Business ─────────────────────────────────────────────────────────────
  {
    id: 'business-card-classic',
    name: 'Business Card · Classic',
    category: 'business',
    description: 'Crisp navy on white — the corporate default.',
    preset: { fgColor: '#1e3a8a', bgColor: '#ffffff', cornerStyle: 'rounded', eyeShape: 'rounded' },
    sampleValue: 'https://your-company.com',
  },
  {
    id: 'business-card-modern',
    name: 'Business Card · Modern',
    category: 'business',
    description: 'Rounded modules, gradient, soft modern eyes.',
    preset: {
      shape: 'rounded',
      cornerStyle: 'modern',
      eyeShape: 'modern',
      gradient: { type: 'linear', colors: ['#0ea5e9', '#1e40af'], rotation: 135 },
    },
    sampleValue: 'https://your-company.com',
  },

  // ── Restaurant ───────────────────────────────────────────────────────────
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    category: 'restaurant',
    description: 'Warm rust tones with rounded modules — feels like food.',
    preset: {
      fgColor: '#9a3412',
      bgColor: '#fff7ed',
      shape: 'rounded',
      cornerStyle: 'rounded',
      eyeShape: 'rounded',
    },
    sampleValue: 'https://restaurant.example.com/menu',
  },
  {
    id: 'restaurant-vibrant',
    name: 'Restaurant · Vibrant',
    category: 'restaurant',
    description: 'Tropical gradient, dotted modules.',
    preset: {
      shape: 'dot',
      cornerStyle: 'modern',
      eyeShape: 'modern',
      gradient: { type: 'linear', colors: ['#f97316', '#ef4444'], rotation: 90 },
    },
    sampleValue: 'https://restaurant.example.com/menu',
  },

  // ── Portfolio ────────────────────────────────────────────────────────────
  {
    id: 'portfolio-minimal',
    name: 'Portfolio · Minimal',
    category: 'portfolio',
    description: 'Soft dots, neutral tones, minimal aesthetic.',
    preset: {
      fgColor: '#1f2937',
      bgColor: '#fafafa',
      shape: 'dot',
      cornerStyle: 'rounded',
      eyeShape: 'rounded',
    },
    sampleValue: 'https://yourname.dev',
  },
  {
    id: 'portfolio-neon',
    name: 'Portfolio · Neon',
    category: 'portfolio',
    description: 'Cyber-neon vibes for designers and devs.',
    preset: { theme: 'neon' },
    sampleValue: 'https://yourname.dev',
  },

  // ── Wedding ──────────────────────────────────────────────────────────────
  {
    id: 'wedding-rose',
    name: 'Wedding · Rose',
    category: 'wedding',
    description: 'Soft rose gold gradient.',
    preset: {
      shape: 'rounded',
      cornerStyle: 'soft-rounded',
      eyeShape: 'rounded',
      gradient: { type: 'linear', colors: ['#fda4af', '#f43f5e'], rotation: 45 },
    },
    sampleValue: 'https://ourbigday.example.com',
  },
  {
    id: 'wedding-elegant',
    name: 'Wedding · Elegant',
    category: 'wedding',
    description: 'Dark navy and gold — formal invites.',
    preset: {
      fgColor: '#d97706',
      bgColor: '#0f172a',
      cornerStyle: 'modern',
      eyeShape: 'modern',
    },
    sampleValue: 'https://ourbigday.example.com',
  },

  // ── Event ────────────────────────────────────────────────────────────────
  {
    id: 'event-festival',
    name: 'Event · Festival',
    category: 'event',
    description: 'High-energy multi-stop gradient.',
    preset: {
      shape: 'star',
      cornerStyle: 'modern',
      eyeShape: 'diamond',
      gradient: { type: 'conic', colors: ['#a855f7', '#ec4899', '#f59e0b', '#a855f7'] },
      animation: 'pulse',
    },
    sampleValue: 'https://festival.example.com',
  },
  {
    id: 'event-conference',
    name: 'Event · Conference',
    category: 'event',
    description: 'Clean modern look for tech conferences.',
    preset: { theme: 'modern', eyeColor: '#6366f1' },
    sampleValue: 'https://conf.example.com',
  },

  // ── Education ────────────────────────────────────────────────────────────
  {
    id: 'edu-classroom',
    name: 'Education · Classroom',
    category: 'education',
    description: 'Friendly blue with rounded modules.',
    preset: {
      fgColor: '#1d4ed8',
      bgColor: '#eff6ff',
      shape: 'rounded',
      cornerStyle: 'rounded',
      eyeShape: 'rounded',
    },
    sampleValue: 'https://class.example.edu',
  },

  // ── Real estate ──────────────────────────────────────────────────────────
  {
    id: 'realestate-luxe',
    name: 'Real Estate · Luxe',
    category: 'real-estate',
    description: 'Luxury black + gold framing for listings.',
    preset: { theme: 'premium' },
    sampleValue: 'https://listings.example.com/123',
  },
  {
    id: 'realestate-clean',
    name: 'Real Estate · Clean',
    category: 'real-estate',
    description: 'Greyscale, easily printable.',
    preset: {
      fgColor: '#0f172a',
      bgColor: '#ffffff',
      shape: 'square',
      cornerStyle: 'square',
      eyeShape: 'square',
    },
    sampleValue: 'https://listings.example.com/123',
  },

  // ── Healthcare ───────────────────────────────────────────────────────────
  {
    id: 'health-trusted',
    name: 'Healthcare · Trusted',
    category: 'healthcare',
    description: 'Calming medical green.',
    preset: {
      fgColor: '#047857',
      bgColor: '#ecfdf5',
      cornerStyle: 'rounded',
      eyeShape: 'rounded',
    },
    sampleValue: 'https://clinic.example.com/appointment',
  },

  // ── E-commerce ───────────────────────────────────────────────────────────
  {
    id: 'ecom-vibrant',
    name: 'E-commerce · Vibrant',
    category: 'ecommerce',
    description: 'Eye-catching gradient for promotions.',
    preset: {
      shape: 'rounded',
      cornerStyle: 'modern',
      eyeShape: 'modern',
      gradient: { type: 'linear', colors: ['#ec4899', '#8b5cf6'], rotation: 135 },
    },
    sampleValue: 'https://shop.example.com/promo',
  },
  {
    id: 'ecom-receipt',
    name: 'E-commerce · Receipt',
    category: 'ecommerce',
    description: 'Subtle black/white for printed receipts.',
    preset: { fgColor: '#000', bgColor: '#fff', shape: 'square' },
    sampleValue: 'https://shop.example.com/order/12345',
  },

  // ── Startup ──────────────────────────────────────────────────────────────
  {
    id: 'startup-electric',
    name: 'Startup · Electric',
    category: 'startup',
    description: 'High-energy purple + cyan.',
    preset: {
      shape: 'rounded',
      cornerStyle: 'modern',
      eyeShape: 'modern',
      gradient: { type: 'linear', colors: ['#06b6d4', '#7c3aed'], rotation: 135 },
      animation: 'glow',
    },
    sampleValue: 'https://yourstartup.io',
  },

  // ── Agency ───────────────────────────────────────────────────────────────
  {
    id: 'agency-bold',
    name: 'Agency · Bold',
    category: 'agency',
    description: 'High-contrast hexagonal modules.',
    preset: {
      shape: 'hexagon',
      cornerStyle: 'modern',
      eyeShape: 'modern',
      fgColor: '#0f172a',
      bgColor: '#fde047',
    },
    sampleValue: 'https://agency.example.com',
  },
  {
    id: 'agency-cyber',
    name: 'Agency · Cyberpunk',
    category: 'agency',
    description: 'Hot pink + yellow, animated.',
    preset: { theme: 'cyberpunk' },
    sampleValue: 'https://agency.example.com',
  },
];
