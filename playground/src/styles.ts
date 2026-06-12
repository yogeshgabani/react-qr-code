import type { CSSProperties } from 'react';

// ─── Design tokens ──────────────────────────────────────────────────────────
export const tokens = {
  bg: '#07070c',
  bgSoft: '#0d0d15',
  bgCard: 'rgba(255,255,255,0.04)',
  bgCardSolid: '#13131c',
  bgCardHover: 'rgba(255,255,255,0.07)',
  border: 'rgba(255,255,255,0.08)',
  borderBright: 'rgba(255,255,255,0.16)',
  text: '#f0f0f5',
  textMuted: '#a0a0b0',
  textSubtle: '#6a6a7a',
  primary: '#a855f7',
  primaryDark: '#7c3aed',
  accent: '#22d3ee',
  danger: '#f87171',
  success: '#34d399',
  warning: '#fbbf24',
};

// ─── Card surfaces ──────────────────────────────────────────────────────────
// Light card on dark bg = QR-friendly, premium feel.
export const card: CSSProperties = {
  background: '#ffffff',
  borderRadius: 16,
  padding: 18,
  border: '1px solid rgba(0,0,0,0.04)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2), 0 10px 30px -10px rgba(0,0,0,0.4)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  color: '#0f172a',
};

// Dark glass card for non-QR panels (scanner overlay, analytics widgets, etc.)
export const cardDark: CSSProperties = {
  background: tokens.bgCard,
  borderRadius: 16,
  padding: 18,
  border: `1px solid ${tokens.border}`,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  color: tokens.text,
};

export const cardLabel: CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  margin: 0,
  color: '#475569',
  textAlign: 'center',
  letterSpacing: 0.4,
  textTransform: 'uppercase',
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
};

// ─── Layout ─────────────────────────────────────────────────────────────────
export const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: 16,
};

// ─── Buttons ────────────────────────────────────────────────────────────────
export const button: CSSProperties = {
  padding: '8px 14px',
  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
  color: '#ffffff',
  border: 0,
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  boxShadow: '0 4px 14px rgba(124,58,237,0.25)',
  letterSpacing: 0.2,
  transition: 'all 0.15s ease',
};

export const buttonSecondary: CSSProperties = {
  padding: '8px 14px',
  background: tokens.bgCard,
  color: tokens.text,
  border: `1px solid ${tokens.border}`,
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: 0.2,
  transition: 'all 0.15s ease',
};

// ─── Headings ───────────────────────────────────────────────────────────────
export const sectionHeading: CSSProperties = {
  fontSize: 22,
  margin: '0 0 6px',
  color: tokens.text,
  fontWeight: 700,
  letterSpacing: -0.4,
};

export const subtle: CSSProperties = {
  color: tokens.textMuted,
  fontSize: 14,
  margin: '0 0 24px',
  maxWidth: 720,
  lineHeight: 1.55,
};

// ─── Pills / Badges ─────────────────────────────────────────────────────────
export const pill: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  background: tokens.bgCard,
  border: `1px solid ${tokens.border}`,
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 600,
  color: tokens.textMuted,
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  letterSpacing: 0.4,
  textTransform: 'uppercase',
};
