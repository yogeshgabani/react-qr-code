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
import { GettingStarted, QRCodeModal } from './components';
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
    icon: '⚡',
    description: '16 ready-to-use QR payload wrappers',
    Component: TypesTab,
  },
  {
    id: 'design',
    label: 'Design Engine',
    group: 'Showcase',
    icon: '🎨',
    description: 'Module shapes, eye styles, gradients, animations',
    Component: DesignTab,
  },
  {
    id: 'themes',
    label: 'Themes',
    group: 'Showcase',
    icon: '✨',
    description: '10 hand-tuned presets — one prop applies the whole look',
    Component: ThemesTab,
  },
  {
    id: 'templates',
    label: 'Templates',
    group: 'Showcase',
    icon: '🗂',
    description: 'Industry-specific presets across 11 categories',
    Component: TemplatesTab,
  },
  {
    id: 'studio',
    label: 'Studio',
    group: 'Apps',
    icon: '🛠',
    description: 'Visual editor — every knob on one screen',
    Component: StudioTab,
  },
  {
    id: 'scanner',
    label: 'Scanner',
    group: 'Apps',
    icon: '📷',
    description: 'Live camera scanning with jsQR',
    Component: ScannerTab,
  },
  {
    id: 'batch',
    label: 'Batch',
    group: 'Apps',
    icon: '📦',
    description: 'CSV / JSON → ZIP or PDF',
    Component: BatchTab,
  },
  {
    id: 'dynamic',
    label: 'Dynamic',
    group: 'Apps',
    icon: '🔁',
    description: 'Swap destinations, expire, throttle',
    Component: DynamicTab,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    group: 'Apps',
    icon: '📊',
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
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
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
              ◉
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
            v0.1.0 · playground
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
          <code style={{ color: tokens.accent }}>playground/src/</code> — Vite HMR refreshes
          instantly.
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────── */}
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

        <footer
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
          <span>react-qr-master · open source, MIT</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Generator · Scanner · Studio · Batch · Dynamic · Analytics
          </span>
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
