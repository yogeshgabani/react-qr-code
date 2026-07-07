import { useState, useRef } from 'react';
import { CopyButton } from './CopyButton';
import { tokens } from '../styles';
import { useTheme } from '../ThemeContext';

type TabType = 'installation' | 'usage' | 'props' | 'types' | 'download';

export function GettingStarted() {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('installation');
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const section: React.CSSProperties = {
    marginBottom: 'clamp(16px, 5vw, 24px)',
  };

  const heading: React.CSSProperties = {
    fontSize: 'clamp(13px, 4vw, 14px)',
    fontWeight: 700,
    color: tokens.text,
    marginBottom: 'clamp(8px, 2vw, 12px)',
    display: 'flex',
    alignItems: 'center',
    gap: 'clamp(4px, 2vw, 8px)',
  };

  const code: React.CSSProperties = {
    background: 'var(--code-bg)',
    border: `1px solid var(--code-border)`,
    borderRadius: 8,
    padding: 'clamp(10px, 3vw, 12px)',
    fontSize: 'clamp(10px, 2.5vw, 11px)',
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--code-text)',
    overflow: 'auto',
    lineHeight: 1.5,
    margin: 'clamp(6px, 2vw, 8px) 0',
  };

  const bullet: React.CSSProperties = {
    fontSize: 'clamp(12px, 3.5vw, 13px)',
    color: tokens.textMuted,
    lineHeight: 1.7,
    marginBottom: 'clamp(6px, 2vw, 8px)',
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          width: '100%',
          padding: '18px 24px',
          background: theme === 'dark'
            ? `linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.08))`
            : `linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(124, 58, 237, 0.06))`,
          border: `1.5px solid ${theme === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.15)'}`,
          borderRadius: 14,
          color: tokens.text,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          textAlign: 'left',
          backdropFilter: 'blur(10px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(96, 165, 250, 0.4)' : 'rgba(37, 99, 235, 0.3)';
          e.currentTarget.style.background = theme === 'dark'
            ? `linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(167, 139, 250, 0.12))`
            : `linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(124, 58, 237, 0.1))`;
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.15)';
          e.currentTarget.style.background = theme === 'dark'
            ? `linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(167, 139, 250, 0.08))`
            : `linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(124, 58, 237, 0.06))`;
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <span style={{ fontSize: 18 }}>🚀</span>
        <span style={{ flex: 1 }}>Get Started with react-qr-master in 5 minutes</span>
        <span style={{
          marginLeft: 'auto',
          transition: 'transform 0.3s ease',
          display: 'inline-block',
        }}>↓</span>
      </button>
    );
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'installation', label: 'Install', icon: '📦' },
    { id: 'usage', label: 'Usage', icon: '⚡' },
    { id: 'props', label: 'Props', icon: '📋' },
    { id: 'types', label: 'Types', icon: '🎯' },
    { id: 'download', label: 'Download', icon: '💾' },
  ];

  return (
    <div
      style={{
        background: theme === 'dark'
          ? `linear-gradient(135deg, rgba(96, 165, 250, 0.05), rgba(167, 139, 250, 0.03))`
          : `linear-gradient(135deg, rgba(37, 99, 235, 0.03), rgba(124, 58, 237, 0.02))`,
        border: `1.5px solid ${theme === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.15)'}`,
        borderRadius: 16,
        marginBottom: 32,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        overflow: 'hidden',
        animation: 'slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(14px, 5vw, 20px) clamp(16px, 7vw, 28px)',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.08)'}`,
      }}>
        <h2 style={{
          margin: 0,
          fontSize: 'clamp(16px, 5vw, 18px)',
          fontWeight: 800,
          color: tokens.text,
        }}>
          🚀 Getting Started
        </h2>
        <button
          onClick={() => setExpanded(false)}
          style={{
            background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 15, 25, 0.05)',
            border: 'none',
            color: tokens.textMuted,
            fontSize: 'clamp(16px, 5vw, 20px)',
            cursor: 'pointer',
            padding: 'clamp(6px, 2vw, 8px)',
            borderRadius: 8,
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(15, 15, 25, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 15, 25, 0.05)';
          }}
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.08)'}`,
        overflowX: 'auto',
        padding: '0 clamp(16px, 5vw, 28px)',
        gap: 'clamp(4px, 2vw, 8px)',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: 'clamp(10px, 3vw, 14px) clamp(10px, 4vw, 18px)',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id
                ? `2px solid ${theme === 'dark' ? '#60a5fa' : '#2563eb'}`
                : '2px solid transparent',
              color: activeTab === tab.id
                ? (theme === 'dark' ? '#60a5fa' : '#2563eb')
                : tokens.textMuted,
              fontSize: 'clamp(11px, 3.5vw, 13px)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(4px, 2vw, 6px)',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = tokens.text;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.color = tokens.textMuted;
              }
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        style={{
          padding: 'clamp(16px, 6vw, 28px)',
          animation: 'fadeIn 0.3s ease',
          minHeight: '300px',
        }}
      >
        {/* Installation Tab */}
        {activeTab === 'installation' && (
          <>
            <div style={section}>
              <h3 style={heading}>1️⃣ Install Package</h3>
              <div style={code}>npm install react-qr-master</div>
              <p style={bullet}>Or with yarn: <code style={{ color: tokens.accent }}>yarn add react-qr-master</code></p>
            </div>

            <div style={section}>
              <h3 style={heading}>2️⃣ Import Component</h3>
              <div style={{ position: 'relative' }}>
                <pre style={code}>{`import { QRCode } from 'react-qr-master';`}</pre>
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <CopyButton text='import { QRCode } from "react-qr-master";' label="Copy" variant="outline" size="sm" />
                </div>
              </div>
              <p style={bullet}>Or import specialized types: <code style={{ color: tokens.accent }}>WebsiteQR, WiFiQR, ContactQR</code>, etc.</p>
            </div>
          </>
        )}

        {/* Usage Tab */}
        {activeTab === 'usage' && (
          <div style={section}>
            <h3 style={heading}>3️⃣ Create Your First QR Code</h3>
            <div style={{ position: 'relative' }}>
              <pre style={code}>{`export function MyComponent() {
  return (
    <QRCode
      value="https://example.com"
      size={256}
      shape="rounded"
      theme="neon"
    />
  );
}`}</pre>
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <CopyButton
                  text={`export function MyComponent() {\n  return (\n    <QRCode\n      value="https://example.com"\n      size={256}\n      shape="rounded"\n      theme="neon"\n    />\n  );\n}`}
                  label="Copy"
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
            <p style={bullet}>Change props in real-time: modify <code style={{ color: tokens.accent }}>size</code>, <code style={{ color: tokens.accent }}>shape</code>, <code style={{ color: tokens.accent }}>theme</code>, colors, and more!</p>
          </div>
        )}

        {/* Props Tab */}
        {activeTab === 'props' && (
          <div style={section}>
            <h3 style={heading}>📋 Essential Props</h3>
            <div style={{
              background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
              border: `1px solid ${tokens.border}`,
              borderRadius: 10,
              padding: 'clamp(12px, 4vw, 16px)',
              display: 'grid',
              gap: 'clamp(8px, 2vw, 12px)',
            }}>
              <div style={bullet}><strong>value</strong> — The data to encode (URL, text, WiFi, etc.)</div>
              <div style={bullet}><strong>size</strong> — QR code dimensions in pixels (default: 256)</div>
              <div style={bullet}><strong>level</strong> — Error correction: 'L'|'M'|'Q'|'H' (default: 'M')</div>
              <div style={bullet}><strong>shape</strong> — Module design: 'square'|'rounded'|'circle'|'diamond'|'hexagon'|'star'</div>
              <div style={bullet}><strong>theme</strong> — Preset style: 'light'|'dark'|'neon'|'corporate'|'glassmorphism'</div>
              <div style={bullet}><strong>fgColor</strong> — Foreground (module) color (hex, rgb, etc.)</div>
              <div style={bullet}><strong>bgColor</strong> — Background color</div>
              <div style={bullet}><strong>gradient</strong> — Apply linear/radial/conic gradient: <code style={{ color: tokens.accent }}>{'{ type, colors, rotation }'}</code></div>
              <div style={bullet}><strong>logo</strong> — Image URL or data URI for center overlay</div>
              <div style={bullet}><strong>animation</strong> — CSS animation: 'pulse'|'zoom'|'bounce'|'rotate'|'fade'|'wave'|'glow'</div>
            </div>
          </div>
        )}

        {/* Types Tab */}
        {activeTab === 'types' && (
          <div style={section}>
            <h3 style={heading}>🎯 Specialized QR Types</h3>
            <div style={{ display: 'grid', gap: 'clamp(8px, 3vw, 12px)' }}>
              <div style={{ padding: 'clamp(10px, 3vw, 12px)', background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)', borderRadius: 10 }}>
                <strong style={{ color: tokens.accent }}>WebsiteQR</strong> — URLs with validation
                <div style={{ ...code, marginBottom: 0 }}>{`<WebsiteQR url="acme.com" />`}</div>
              </div>
              <div style={{ padding: 12, background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)', borderRadius: 10 }}>
                <strong style={{ color: tokens.accent }}>WiFiQR</strong> — Auto-connect WiFi networks
                <div style={{ ...code, marginBottom: 0 }}>{`<WiFiQR ssid="Network" password="pass" />`}</div>
              </div>
              <div style={{ padding: 12, background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)', borderRadius: 10 }}>
                <strong style={{ color: tokens.accent }}>ContactQR</strong> — vCard contact save
                <div style={{ ...code, marginBottom: 0 }}>{`<ContactQR firstName="John" email="john@example.com" />`}</div>
              </div>
              <div style={{ padding: 12, background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)', borderRadius: 10 }}>
                <strong style={{ color: tokens.accent }}>EventQR</strong> — Calendar event invite
                <div style={{ ...code, marginBottom: 0 }}>{`<EventQR title="Meeting" start="2026-10-15T09:00Z" />`}</div>
              </div>
              <div style={{ padding: 12, background: theme === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)', borderRadius: 10 }}>
                <strong style={{ color: tokens.accent }}>CryptoQR</strong> — Payments (Bitcoin, Ethereum, Solana)
                <div style={{ ...code, marginBottom: 0 }}>{`<CryptoQR coin="bitcoin" address="..." amount={0.05} />`}</div>
              </div>
            </div>
            <p style={{ ...bullet, marginTop: 'clamp(12px, 4vw, 16px)' }}>Plus: EmailQR, PhoneQR, SMSQR, WhatsAppQR, CalendarQR, UPIQR, SocialQR, and more! See <strong>QR Types</strong> tab for full showcase.</p>
          </div>
        )}

        {/* Download Tab */}
        {activeTab === 'download' && (
          <div style={section}>
            <h3 style={heading}>💾 Download & Export QR Codes</h3>
            <p style={bullet}>Use the <strong>useQRDownload</strong> hook to export as PNG, SVG, PDF, and more:</p>
            <div style={{ position: 'relative', marginTop: 12 }}>
              <pre style={code}>{`import { QRCode, useQRDownload } from 'react-qr-master';

export function App() {
  const { ref, download } = useQRDownload();

  return (
    <>
      <QRCode ref={ref} value="https://example.com" size={256} />
      <button onClick={() => download('png', { pixelSize: 1024 })}>
        Download PNG
      </button>
    </>
  );
}`}
              </pre>
              <div style={{ position: 'absolute', top: 8, right: 8 }}>
                <CopyButton
                  text={`import { QRCode, useQRDownload } from 'react-qr-master';\n\nexport function App() {\n  const { ref, download } = useQRDownload();\n\n  return (\n    <>\n      <QRCode ref={ref} value="https://example.com" size={256} />\n      <button onClick={() => download('png', { pixelSize: 1024 })}>\n        Download PNG\n      </button>\n    </>\n  );\n}`}
                  label="Copy"
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
            <div style={{ marginTop: 'clamp(12px, 4vw, 16px)', padding: 'clamp(10px, 3vw, 12px)', background: theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.08)', borderRadius: 10 }}>
              <strong style={{ color: theme === 'dark' ? '#60a5fa' : '#2563eb', fontSize: 'clamp(12px, 3.5vw, 14px)' }}>Supported formats:</strong>
              <p style={{ margin: 'clamp(6px, 2vw, 8px) 0 0', color: tokens.textMuted, fontSize: 'clamp(12px, 3.5vw, 13px)' }}>PNG, SVG, PDF, JPEG — choose your preferred format and pixel size</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}