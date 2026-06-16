import { useState, useEffect, type CSSProperties } from 'react';
import { TypesTab } from './tabs/TypesTab';
import { DesignTab } from './tabs/DesignTab';
import { ThemesTab } from './tabs/ThemesTab';
import { TemplatesTab } from './tabs/TemplatesTab';
import { StudioTab } from './tabs/StudioTab';
import { ScannerTab } from './tabs/ScannerTab';
import { BatchTab } from './tabs/BatchTab';
import { DynamicTab } from './tabs/DynamicTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { GettingStarted, QRCodeModal, SocialIcons } from './components';
import { tokens, pill } from './styles';
import { QRModalContext } from './QRModalContext';
import type { QRCodeProps } from 'react-qr-master';

type TabId =
  | 'types'
  | 'design'
  | 'themes'
  | 'templates'
  | 'studio'
  | 'scanner'
  | 'batch'
  | 'dynamic'
  | 'analytics';

interface TabDef {
  id: TabId;
  label: string;
  group: string;
  icon: string;
  description: string;
  Component: () => JSX.Element;
}

const TABS: TabDef[] = [
  {
    id: 'types',
    label: 'QR Types',
    group: 'Showcase',
    icon: 'âš¡',
    description: '16 ready-to-use QR payload wrappers',
    Component: TypesTab,
  },
  {
    id: 'design',
    label: 'Design Engine',
    group: 'Showcase',
    icon: 'ðŸŽ¨',
    description: 'Module shapes, eye styles, gradients, animations',
    Component: DesignTab,
  },
  {
    id: 'themes',
    label: 'Themes',
    group: 'Showcase',
    icon: 'âœ¨',
    description: '10 hand-tuned presets â€” one prop applies the whole look',
    Component: ThemesTab,
  },
  {
    id: 'templates',
    label: 'Templates',
    group: 'Showcase',
    icon: 'ðŸ—‚',
    description: 'Industry-specific presets across 11 categories',
    Component: TemplatesTab,
  },
  {
    id: 'studio',
    label: 'Studio',
    group: 'Apps',
    icon: 'ðŸ› ',
    description: 'Visual editor â€” every knob on one screen',
    Component: StudioTab,
  },
  {
    id: 'scanner',
    label: 'Scanner',
    group: 'Apps',
    icon: 'ðŸ“·',
    description: 'Live camera scanning with jsQR',
    Component: ScannerTab,
  },
  {
    id: 'batch',
    label: 'Batch',
    group: 'Apps',
    icon: 'ðŸ“¦',
    description: 'CSV / JSON â†’ ZIP or PDF',
    Component: BatchTab,
  },
  {
    id: 'dynamic',
    label: 'Dynamic',
    group: 'Apps',
    icon: 'ðŸ”',
    description: 'Swap destinations, expire, throttle',
    Component: DynamicTab,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    group: 'Apps',
    icon: 'ðŸ“Š',
    description: 'Client-side scan tracking and breakdowns',
    Component: AnalyticsTab,
  },
];

const STATS = [
  { value: '16', label: 'QR types' },
  { value: '8', label: 'Module shapes' },
  { value: '5', label: 'Eye styles' },
  { value: '3', label: 'Gradients' },
  { value: '9', label: 'Animations' },
  { value: '10', label: 'Themes' },
  { value: '18', label: 'Templates' },
];

const sidebarBtn = (active: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid transparent',
  background: active ? 'linear-gradient(135deg,rgba(168,85,247,0.18),rgba(124,58,237,0.06))' : 'transparent',
  borderColor: active ? 'rgba(168,85,247,0.35)' : 'transparent',
  color: active ? tokens.text : tokens.textMuted,
  cursor: 'pointer',
  fontSize: 13.5,
  fontWeight: active ? 600 : 500,
  width: '100%',
  textAlign: 'left',
  transition: 'all 0.15s ease',
  position: 'relative',
});

const groupLabel: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: tokens.textSubtle,
  textTransform: 'uppercase',
  letterSpacing: 1.4,
  padding: '14px 12px 6px',
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
};

export default function App() {
  const [active, setActive] = useState<TabId>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    return (
      (TABS.some((t) => t.id === tabParam) ? (tabParam as TabId) : 'types') || 'types'
    );
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState<Partial<QRCodeProps>>({ value: 'https://example.com' });
  const [modalTitle, setModalTitle] = useState('QR Code Designer');

  const openQRModal = (props: Partial<QRCodeProps>, title = 'QR Code Designer') => {
    setModalProps(props);
    setModalTitle(title);
    setModalOpen(true);
  };

  const closeQRModal = () => {
    setModalOpen(false);
  };

  const current = TABS.find((t) => t.id === active) ?? TABS[0]!;
  const Tab = current.Component;

  // Sync active tab to URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (active === 'types') {
      params.delete('tab');
    } else {
      params.set('tab', active);
    }
    const newUrl =
      params.toString() === ''
        ? window.location.pathname
        : `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [active]);

  const groups = Array.from(new Set(TABS.map((t) => t.group)));

  return (
    <QRModalContext.Provider value={{ openQRModal, closeQRModal }}>
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '260px minmax(0, 1fr)',
        gap: 0,
      }}
    >
      {/* â”€â”€ Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <aside
        style={{
          padding: '24px 16px',
          borderRight: `1px solid ${tokens.border}`,
          background: 'rgba(13,13,21,0.55)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ padding: '0 8px 16px', borderBottom: `1px solid ${tokens.border}`, marginBottom: 8 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 800,
              fontSize: 16,
              letterSpacing: -0.2,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg,#a855f7,#22d3ee)',
                display: 'grid',
                placeItems: 'center',
                fontSize: 16,
                boxShadow: '0 6px 20px rgba(168,85,247,0.35)',
              }}
            >
              â—‰
            </div>
            <span style={{ background: 'linear-gradient(135deg,#fff,#c4b5fd)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
              react-qr-master
            </span>
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 11,
              color: tokens.textSubtle,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: 0.4,
            }}
          >
            v0.1.0 Â· playground
          </div>
        </div>

        {groups.map((group) => (
          <div key={group}>
            <div style={groupLabel}>{group}</div>
            {TABS.filter((t) => t.group === group).map((t) => (
              <button
                key={t.id}
                style={sidebarBtn(t.id === active)}
                onClick={() => setActive(t.id)}
                onMouseEnter={(e) => {
                  if (t.id !== active) (e.currentTarget.style.background = 'rgba(255,255,255,0.04)');
                }}
                onMouseLeave={(e) => {
                  if (t.id !== active) (e.currentTarget.style.background = 'transparent');
                }}
              >
                <span style={{ fontSize: 16, width: 22, textAlign: 'center' }}>{t.icon}</span>
                <span style={{ flex: 1 }}>{t.label}</span>
                {t.id === active ? (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: tokens.primary,
                      boxShadow: `0 0 8px ${tokens.primary}`,
                    }}
                  />
                ) : null}
              </button>
            ))}
          </div>
        ))}

        <div style={{ flex: 1 }} />
        <div
          style={{
            padding: 12,
            background: tokens.bgCard,
            border: `1px solid ${tokens.border}`,
            borderRadius: 10,
            fontSize: 11,
            color: tokens.textMuted,
            lineHeight: 1.5,
          }}
        >
          Edit anything under <code style={{ color: tokens.accent }}>src/</code> or{' '}
          <code style={{ color: tokens.accent }}>playground/src/</code> â€” Vite HMR refreshes
          instantly.
        </div>
      </aside>

      {/* â”€â”€ Main content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <main style={{ padding: '0', minWidth: 0 }}>
        {/* Hero / header strip */}
        <header
          style={{
            padding: '40px 48px 28px',
            borderBottom: `1px solid ${tokens.border}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span
              style={{
                ...pill,
                color: tokens.accent,
                borderColor: 'rgba(34,211,238,0.3)',
                background: 'rgba(34,211,238,0.06)',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: tokens.accent }} />
              Live preview
            </span>
            <span style={{ ...pill }}>{current.group}</span>
          </div>
          <h1
            style={{
              fontSize: 38,
              margin: 0,
              fontWeight: 800,
              letterSpacing: -1,
              lineHeight: 1.1,
              background: 'linear-gradient(135deg,#ffffff 0%,#c4b5fd 60%,#a5f3fc 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {current.icon} {current.label}
          </h1>
          <p
            style={{
              fontSize: 15,
              color: tokens.textMuted,
              margin: '10px 0 0',
              maxWidth: 720,
            }}
          >
            {current.description}
          </p>

          {active === 'types' ? (
            <div
              style={{
                marginTop: 24,
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
              }}
            >
              {STATS.map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 6,
                    padding: '8px 14px',
                    background: tokens.bgCard,
                    border: `1px solid ${tokens.border}`,
                    borderRadius: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: tokens.text,
                      letterSpacing: -0.5,
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: tokens.textSubtle,
                      fontFamily: "'JetBrains Mono', monospace",
                      letterSpacing: 0.4,
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </header>

        <div style={{ padding: '32px 48px 64px' }}>
          {active === 'types' && <GettingStarted />}
          <Tab />
        </div>

        {/* <footer
          style={{
            borderTop: `1px solid ${tokens.border}`,
            padding: '20px 48px',
            color: tokens.textSubtle,
            fontSize: 12,
            display: 'flex',
            gap: 16,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <span>react-qr-master Â· open source, MIT</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Generator Â· Scanner Â· Studio Â· Batch Â· Dynamic Â· Analytics
          </span>
        </footer> */}

        {/* Footer */}
        <footer style={{ marginTop: 96, marginBottom: 24 }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 20,
              padding: 1,
              background:
                'linear-gradient(135deg, rgba(244,114,182,0.55) 0%, rgba(167,139,250,0.15) 40%, rgba(56,189,248,0.55) 100%)',
            }}
          >
            <div
              style={{
                borderRadius: 19,
                background:
                  'linear-gradient(180deg, rgb(var(--surface-strong-rgb) / 0.85) 0%, rgb(var(--surface-strong-rgb) / 0.95) 100%)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                padding: '28px 20px',
              }}
            >
              {/* Top row: brand + action buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 20,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 30,
                      borderRadius: 10,
                      background: 'rgba(167,139,250,0.12)',
                      border: '1px solid rgba(167,139,250,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      padding: '4px',
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bfa' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f472b6' }} />
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8' }} />
                  </div>
                  <div>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: 700,
                        fontSize: 16,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      react-next-select
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>
                      Modern, accessible select component for React & Next.js
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <a
                    href="https://github.com/yogeshgabani/react-next-select"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 16px',
                      borderRadius: 999,
                      border: '1px solid rgb(var(--border-rgb) / 0.18)',
                      background: 'rgb(var(--surface-rgb) / 0.04)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.04.78 2.1v3.11c0 .31.21.67.79.56 4.57-1.52 7.86-5.83 7.86-10.91C23.5 5.65 18.35.5 12 .5Z" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href="https://www.npmjs.com/package/react-next-select"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 16px',
                      borderRadius: 999,
                      border: '1px solid rgb(var(--border-rgb) / 0.18)',
                      background: 'rgb(var(--surface-rgb) / 0.04)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="22" height="14" viewBox="0 0 27 16" fill="currentColor" aria-hidden>
                      <path d="M0 0h27v14H14v2H7v-2H0V0Zm2 12h5V4h3v8h2V2H2v10Zm12-10v12h5v-2h5V2H14Zm8 2h-3v6h3V4Z" />
                    </svg>
                    npm
                  </a>
                  <a
                    href="#demos"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 16px',
                      borderRadius: 999,
                      border: '1px solid rgb(var(--border-rgb) / 0.18)',
                      background: 'rgb(var(--surface-rgb) / 0.04)',
                      color: 'var(--text-primary)',
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="3" y="4" width="18" height="14" rx="2" />
                      <path d="M3 8h18" />
                    </svg>
                    Demos
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  margin: '24px 0 20px',
                  background:
                    'linear-gradient(90deg, transparent, rgb(var(--border-rgb) / 0.20), transparent)',
                }}
              />

              {/* Social card â€” horizontal profile row, wraps on small screens */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 18,
                  padding: "18px 22px",
                  marginBottom: 20,
                  borderRadius: 16,
                  border: "1px solid rgb(var(--border-rgb) / 0.12)",
                  background:
                    "radial-gradient(120% 140% at 0% 50%, rgba(168, 85, 247, 0.14), transparent 55%), radial-gradient(120% 140% at 100% 50%, rgba(56, 189, 248, 0.10), transparent 55%), rgb(var(--surface-rgb) / 0.03)",
                  overflow: "hidden",
                }}
              >
                {/* Top gradient hairline */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "10%",
                    right: "10%",
                    height: 2,
                    borderRadius: 2,
                    background:
                      "linear-gradient(90deg, transparent, #a855f7, #ec4899, #38bdf8, transparent)",
                    opacity: 0.7,
                  }}
                />

                {/* Left: avatar + text â€” kept together so they wrap as a unit */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    minWidth: 0,
                    flex: "1 1 auto",
                  }}
                >
                  {/* Avatar-style monogram */}
                  <div
                    aria-hidden
                    style={{
                      flex: "0 0 auto",
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 17,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      color: "#fff",
                      background:
                        "linear-gradient(135deg, #a855f7 0%, #ec4899 55%, #38bdf8 100%)",
                      boxShadow:
                        "0 8px 24px rgba(168, 85, 247, 0.35), 0 0 0 4px rgba(168, 85, 247, 0.12)",
                    }}
                  >
                    YG
                  </div>

                  {/* Heading + subtitle */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        letterSpacing: -0.2,
                        background:
                          "linear-gradient(135deg, #a855f7, #ec4899 55%, #38bdf8)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Connect with Yogesh
                    </span>
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 400,
                        color: "var(--text-muted, #64748b)",
                      }}
                    >
                      Follow for updates, releases &amp; new components
                    </span>
                  </div>
                </div>

                {/* Right: social icons */}
                <SocialIcons size={38} />
              </div>

              {/* Social icons row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  paddingBottom: 16,
                }}
              >
                <SocialIcons size={32} />
              </div>

              {/* Bottom row: license + credit */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '3px 9px',
                        borderRadius: 6,
                        border: '1px solid rgba(167,139,250,0.35)',
                        background: 'rgba(167,139,250,0.10)',
                        color: '#c4b5fd',
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                      }}
                    >
                      MIT
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      Â· Â© 2026 react-next-select
                    </span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    Crafted with <span style={{ color: '#f472b6' }}>â™¥</span> for the React & Next.js community
                  </div>
                </div>

                <a
                  href="https://github.com/yogeshgabani"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 16px',
                    borderRadius: 999,
                    border: '1px solid rgb(var(--border-rgb) / 0.18)',
                    background: 'rgb(var(--surface-rgb) / 0.04)',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Built by{' '}
                  <span
                    style={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #38bdf8 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                    }}
                  >
                    Yogesh Gabani
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <QRCodeModal
        isOpen={modalOpen}
        onClose={closeQRModal}
        initialProps={modalProps}
        title={modalTitle}
      />
    </div>
    </QRModalContext.Provider>
  );
}
