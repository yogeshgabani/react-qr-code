import type { CSSProperties } from 'react';

// ─── Design tokens ──────────────────────────────────────────────────────────
// Values are CSS variables (defined in index.html) so every inline style that
// reads a token flips automatically between light / dark themes.
export const tokens = {
  bg: 'var(--bg)',
  bgSoft: 'var(--bg-soft)',
  bgCard: 'var(--bg-card)',
  bgCardSolid: 'var(--card-solid)',
  bgCardHover: 'var(--bg-card-hover)',
  border: 'var(--border)',
  borderBright: 'var(--border-bright)',
  text: 'var(--text)',
  textMuted: 'var(--text-muted)',
  textSubtle: 'var(--text-subtle)',
  primary: 'var(--primary)',
  primaryDark: 'var(--primary-dark)',
  accent: 'var(--accent)',
  danger: 'var(--danger)',
  success: 'var(--success)',
  warning: 'var(--warning)',
};

// ─── Card surfaces ──────────────────────────────────────────────────────────
// Light card on dark bg = QR-friendly, premium feel.
export const card: CSSProperties = {
  background: '#ffffff',
  borderRadius: 16,
  padding: 18,
  border: '1px solid rgba(15,23,42,0.1)',
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
  fontWeight: 700,
  margin: 0,
  color: '#334155',
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
