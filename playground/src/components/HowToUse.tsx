import { useState } from 'react';
import { CopyButton } from './CopyButton';
import { tokens } from '../styles';

export interface CodeExample {
  language: 'tsx' | 'jsx' | 'javascript';
  label: string;
  code: string;
  description?: string;
}

export interface HowToUseProps {
  title: string;
  description: string;
  examples: CodeExample[];
  children?: React.ReactNode;
}

export function HowToUse({ title, description, examples, children }: HowToUseProps) {
  const [activeExample, setActiveExample] = useState(0);
  const [expanded, setExpanded] = useState(false);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          width: '100%',
          padding: '14px 16px',
          background: `linear-gradient(135deg, rgba(168,85,247,0.08), rgba(34,211,238,0.04))`,
          border: `1px solid rgba(168,85,247,0.2)`,
          borderRadius: 12,
          color: tokens.text,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(168,85,247,0.4)';
          e.currentTarget.style.background = `linear-gradient(135deg, rgba(168,85,247,0.12), rgba(34,211,238,0.08))`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(168,85,247,0.2)';
          e.currentTarget.style.background = `linear-gradient(135deg, rgba(168,85,247,0.08), rgba(34,211,238,0.04))`;
        }}
      >
        <span>💡</span>
        <span>How to Use: {title}</span>
        <span style={{ marginLeft: 'auto' }}>→</span>
      </button>
    );
  }

  const current = examples[activeExample];

  return (
    <div
      style={{
        background: tokens.bgCard,
        border: `1px solid ${tokens.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 32,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: tokens.text }}>
            💡 {title}
          </h3>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: tokens.textMuted }}>
            {description}
          </p>
        </div>
        <button
          onClick={() => setExpanded(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: tokens.textMuted,
            fontSize: 18,
            cursor: 'pointer',
            padding: 8,
          }}
        >
          ✕
        </button>
      </div>

      {children && (
        <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${tokens.border}` }}>
          {children}
        </div>
      )}

      {examples.length > 1 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setActiveExample(i)}
              style={{
                padding: '6px 12px',
                background: activeExample === i ? tokens.primary : tokens.bgSoft,
                border: `1px solid ${activeExample === i ? tokens.primary : tokens.border}`,
                borderRadius: 8,
                color: activeExample === i ? '#000' : tokens.text,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      )}

      {current.description && (
        <p style={{ fontSize: 12, color: tokens.textMuted, marginBottom: 12 }}>
          {current.description}
        </p>
      )}

      <div style={{ position: 'relative' }}>
        <pre
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: `1px solid ${tokens.border}`,
            borderRadius: 8,
            padding: 16,
            overflow: 'auto',
            fontSize: 12,
            lineHeight: 1.6,
            color: tokens.text,
            fontFamily: "'JetBrains Mono', monospace",
            margin: 0,
          }}
        >
          <code>{current.code}</code>
        </pre>
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <CopyButton text={current.code} label="Copy code" variant="outline" size="sm" />
        </div>
      </div>
    </div>
  );
}
