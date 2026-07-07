import { useState } from 'react';
import { tokens } from '../styles';
import { Icon } from './Icon';

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

  // `minimal` is the default and always sits on white QR cards (in both themes),
  // so it uses fixed light-surface colors rather than theme variables.
  const variantStyles = variant === 'minimal'
    ? {
        background: 'rgba(15,23,42,0.04)',
        border: `1px solid rgba(15,23,42,0.14)`,
        color: copied ? '#059669' : '#475569',
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
          e.currentTarget.style.background =
            variant === 'minimal' ? 'rgba(15,23,42,0.09)' : tokens.bgCardHover;
          e.currentTarget.style.borderColor = tokens.borderBright;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = variantStyles.background;
        e.currentTarget.style.border = variantStyles.border;
      }}
      title={`${label} (${text.length} characters)`}
    >
      <Icon name={copied ? 'check' : 'copy'} size={14} />
      <span>{copied ? 'Copied!' : label}</span>
    </button>
  );
}
