import { useState } from 'react';
import { tokens } from '../styles';

export interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: 'minimal' | 'filled' | 'outline';
  size?: 'sm' | 'md';
}

export function CopyButton({ text, label = 'Copy', variant = 'minimal', size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sizeStyles = size === 'sm'
    ? { padding: '6px 10px', fontSize: 12 }
    : { padding: '8px 14px', fontSize: 13 };

  const variantStyles = variant === 'minimal'
    ? {
        background: 'transparent',
        border: `1px solid ${tokens.border}`,
        color: copied ? tokens.success : tokens.textMuted,
      }
    : variant === 'filled'
    ? {
        background: tokens.bgCard,
        border: `1px solid ${tokens.border}`,
        color: tokens.text,
      }
    : {
        background: 'transparent',
        border: `1px solid ${tokens.primary}`,
        color: tokens.primary,
      };

  return (
    <button
      onClick={handleCopy}
      style={{
        ...variantStyles,
        borderRadius: 8,
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
        ...sizeStyles,
      }}
      onMouseEnter={(e) => {
        if (!copied) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          e.currentTarget.style.borderColor = tokens.borderBright;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variantStyles.background;
        e.currentTarget.style.borderColor = variantStyles.border;
      }}
      title={`${label} (${text.length} characters)`}
    >
      <span>{copied ? '✓' : '📋'}</span>
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
}
