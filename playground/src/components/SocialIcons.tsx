import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface SocialLink {
  key: string;
  label: string;
  href: string;
  brand: string;
  brandDark?: string;
  icon: React.ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    key: 'github',
    label: 'GitHub',
    href: 'https://github.com/yogeshgabani',
    brand: '#24292F',
    brandDark: '#F0F6FC',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013-.405c1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z" />
      </svg>
    ),
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    href: 'https://twitter.com/yogeshgabani',
    brand: '#0F1419',
    brandDark: '#E7E9EA',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/yogeshgabani',
    brand: '#0A66C2',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
      </svg>
    ),
  },
];

interface SocialIconsProps {
  size?: number;
}

export function SocialIcons({ size = 36 }: SocialIconsProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const read = () => setIsDark((html.dataset.theme || 'dark') === 'dark');
    read();
    const obs = new MutationObserver(read);
    obs.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const [missing, setMissing] = useState<SocialLink | null>(null);

  useEffect(() => {
    if (!missing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMissing(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [missing]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {SOCIAL_LINKS.map((s) => {
          const hoverColor = isDark && s.brandDark ? s.brandDark : s.brand;
          const available = Boolean(s.href);
          return (
            <a
              key={s.key}
              href={available ? s.href : '#'}
              target={available ? '_blank' : undefined}
              rel="noreferrer noopener"
              aria-label={available ? s.label : `${s.label} — not available`}
              title={available ? s.label : `${s.label} — not configured yet`}
              onClick={(e) => {
                if (!available) {
                  e.preventDefault();
                  setMissing(s);
                }
              }}
              style={{
                width: size,
                height: size,
                borderRadius: 999,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
                background: 'color-mix(in srgb, currentColor 4%, transparent)',
                border: '1px solid color-mix(in srgb, currentColor 12%, transparent)',
                textDecoration: 'none',
                transition: 'all 180ms ease',
                opacity: available ? 1 : 0.65,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `color-mix(in srgb, ${hoverColor} 14%, transparent)`;
                e.currentTarget.style.borderColor = `color-mix(in srgb, ${hoverColor} 55%, transparent)`;
                e.currentTarget.style.color = hoverColor;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'color-mix(in srgb, currentColor 4%, transparent)';
                e.currentTarget.style.borderColor = 'color-mix(in srgb, currentColor 12%, transparent)';
                e.currentTarget.style.color = 'inherit';
                e.currentTarget.style.transform = '';
              }}
            >
              {s.icon}
            </a>
          );
        })}
      </div>
      {missing && (
        <SocialUnavailableModal
          social={missing}
          isDark={isDark}
          onClose={() => setMissing(null)}
        />
      )}
    </>
  );
}

interface SocialUnavailableModalProps {
  social: SocialLink;
  isDark: boolean;
  onClose: () => void;
}

function SocialUnavailableModal({ social, isDark, onClose }: SocialUnavailableModalProps) {
  const iconColor = isDark && social.brandDark ? social.brandDark : social.brand;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rnl-social-modal-title"
      aria-describedby="rnl-social-modal-desc"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.58)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 380,
          width: '100%',
          background: 'rgb(var(--surface-strong-rgb) / 0.98)',
          color: 'var(--text-primary)',
          borderRadius: 16,
          padding: '32px 24px 24px',
          border: '1px solid color-mix(in srgb, currentColor 12%, transparent)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Top gradient border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
          }}
        />

        {/* Close X */}
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: 'inherit',
            cursor: 'pointer',
            fontSize: 20,
            lineHeight: 1,
            opacity: 0.55,
            transition: 'opacity 160ms, background 160ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.background = 'color-mix(in srgb, currentColor 8%, transparent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.55';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ×
        </button>

        {/* Big social icon */}
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: `color-mix(in srgb, ${iconColor} 18%, transparent)`,
            border: `1px solid color-mix(in srgb, ${iconColor} 35%, transparent)`,
            color: iconColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'scale(1.7)',
              transformOrigin: 'center',
              lineHeight: 0,
            }}
          >
            {social.icon}
          </span>
        </div>

        <h3
          id="rnl-social-modal-title"
          style={{
            margin: '0 0 8px',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          Data Not Available
        </h3>
        <p
          id="rnl-social-modal-desc"
          style={{
            margin: '0 0 20px',
            fontSize: 13,
            color: 'var(--text-muted, #94a3b8)',
            lineHeight: 1.55,
          }}
        >
          The <strong style={{ color: 'inherit' }}>{social.label}</strong> link hasn&apos;t been
          configured yet. Please check back later.
        </p>

        <button
          onClick={onClose}
          style={{
            padding: '8px 22px',
            borderRadius: 999,
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(168, 85, 247, 0.35)',
            transition: 'transform 160ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = '';
          }}
        >
          Got it
        </button>
      </div>
    </div>,
    document.body,
  );
}
