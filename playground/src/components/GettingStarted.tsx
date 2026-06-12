import { useState } from 'react';
import { CopyButton } from './CopyButton';
import { tokens } from '../styles';

export function GettingStarted() {
  const [expanded, setExpanded] = useState(false);

  const section: React.CSSProperties = {
    marginBottom: 24,
  };

  const heading: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 700,
    color: tokens.text,
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const code: React.CSSProperties = {
    background: 'rgba(0,0,0,0.3)',
    border: `1px solid ${tokens.border}`,
    borderRadius: 8,
    padding: 12,
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    color: tokens.text,
    overflow: 'auto',
    lineHeight: 1.5,
    margin: '8px 0',
  };

  const bullet: React.CSSProperties = {
    fontSize: 13,
    color: tokens.textMuted,
    lineHeight: 1.7,
    marginBottom: 8,
  };

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: `linear-gradient(135deg, rgba(34,211,238,0.12), rgba(168,85,247,0.06))`,
          border: `1px solid rgba(34,211,238,0.2)`,
          borderRadius: 12,
          color: tokens.text,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          transition: 'all 0.2s ease',
          textAlign: 'left',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(34,211,238,0.4)';
          e.currentTarget.style.background = `linear-gradient(135deg, rgba(34,211,238,0.16), rgba(168,85,247,0.1))`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(34,211,238,0.2)';
          e.currentTarget.style.background = `linear-gradient(135deg, rgba(34,211,238,0.12), rgba(168,85,247,0.06))`;
        }}
      >
        <span style={{ fontSize: 16 }}>🚀</span>
        <span>Get Started with react-qr-master in 5 minutes</span>
        <span style={{ marginLeft: 'auto' }}>→</span>
      </button>
    );
  }

  return (
    <div
      style={{
        background: tokens.bgCard,
        border: `1px solid ${tokens.border}`,
        borderRadius: 12,
        padding: 24,
        marginBottom: 32,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: tokens.text }}>
          🚀 Getting Started
        </h2>
        <button
          onClick={() => setExpanded(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: tokens.textMuted,
            fontSize: 20,
            cursor: 'pointer',
            padding: 8,
          }}
        >
          ✕
        </button>
      </div>

      {/* Installation */}
      <div style={section}>
        <h3 style={heading}>1️⃣ Install Package</h3>
        <div style={code}>npm install react-qr-master</div>
        <p style={bullet}>Or with yarn: <code style={{ color: tokens.accent }}>yarn add react-qr-master</code></p>
      </div>

      {/* Import */}
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

      {/* Basic Usage */}
      <div style={section}>
        <h3 style={heading}>3️⃣ Create Your QR Code</h3>
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
              text={`export function MyComponent() {
  return (
    <QRCode
      value="https://example.com"
      size={256}
      shape="rounded"
      theme="neon"
    />
  );
}`}
              label="Copy"
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </div>

      {/* Key Props */}
      <div style={section}>
        <h3 style={heading}>📋 Essential Props</h3>
        <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${tokens.border}`, borderRadius: 8, padding: 14 }}>
          <div style={bullet}><strong>value</strong> — The data to encode (URL, text, WiFi, etc.)</div>
          <div style={bullet}><strong>size</strong> — QR code dimensions in pixels (default: 256)</div>
          <div style={bullet}><strong>level</strong> — Error correction: 'L'|'M'|'Q'|'H' (default: 'M')</div>
          <div style={bullet}><strong>shape</strong> — Module design: 'square'|'rounded'|'circle'|'diamond'|'hexagon'|'star'</div>
          <div style={bullet}><strong>theme</strong> — Preset style: 'light'|'dark'|'neon'|'corporate'|'glassmorphism'|'gradient'|'modern'|'minimal'|'cyberpunk'|'premium'</div>
          <div style={bullet}><strong>fgColor</strong> — Foreground (module) color (hex, rgb, etc.)</div>
          <div style={bullet}><strong>bgColor</strong> — Background color</div>
          <div style={bullet}><strong>gradient</strong> — Apply linear/radial/conic gradient: <code style={{ color: tokens.accent }}>{'{ type, colors, rotation }'}</code></div>
          <div style={bullet}><strong>logo</strong> — Image URL or data URI for center overlay</div>
          <div style={bullet}><strong>animation</strong> — CSS animation: 'pulse'|'zoom'|'bounce'|'rotate'|'fade'|'wave'|'glow'|'breathing'|'scan'</div>
        </div>
      </div>

      {/* Specialized Types */}
      <div style={section}>
        <h3 style={heading}>🎯 Use Specialized QR Types</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <strong style={{ color: tokens.accent }}>WebsiteQR</strong> — URLs with validation
            <div style={{ ...code, marginBottom: 0 }}>{`<WebsiteQR url="acme.com" />`}</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <strong style={{ color: tokens.accent }}>WiFiQR</strong> — Auto-connect WiFi networks
            <div style={{ ...code, marginBottom: 0 }}>{`<WiFiQR ssid="Network" password="pass" />`}</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <strong style={{ color: tokens.accent }}>ContactQR</strong> — vCard contact save
            <div style={{ ...code, marginBottom: 0 }}>{`<ContactQR firstName="John" email="john@example.com" />`}</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <strong style={{ color: tokens.accent }}>EventQR</strong> — Calendar event invite (iCal)
            <div style={{ ...code, marginBottom: 0 }}>{`<EventQR title="Meeting" start="2026-10-15T09:00Z" />`}</div>
          </div>
          <div style={{ padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
            <strong style={{ color: tokens.accent }}>CryptoQR</strong> — Bitcoin, Ethereum, Solana payments
            <div style={{ ...code, marginBottom: 0 }}>{`<CryptoQR coin="bitcoin" address="..." amount={0.05} />`}</div>
          </div>
        </div>
        <p style={{ ...bullet, marginTop: 12 }}>See <strong>QR Types</strong> tab for all 16 specialized wrappers (EmailQR, PhoneQR, SMSQR, WhatsAppQR, CalendarQR, UPIQR, SocialQR, etc.)</p>
      </div>

      {/* Download & Export */}
      <div style={section}>
        <h3 style={heading}>💾 Download QR Code</h3>
        <p style={bullet}>Use the <strong>useQRDownload</strong> hook to download as PNG, SVG, PDF, etc.:</p>
        <div style={{ position: 'relative' }}>
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
      </div>

      {/* Resources */}
      <div>
        <h3 style={heading}>🔗 Resources</h3>
        <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${tokens.border}`, borderRadius: 8, padding: 14 }}>
          <div style={bullet}><strong>GitHub:</strong> github.com/anthropics/react-qr-master</div>
          <div style={bullet}><strong>NPM:</strong> npm install react-qr-master</div>
          <div style={bullet}><strong>Playground:</strong> All tabs showcase features with live examples</div>
          <div style={bullet}><strong>Click any QR:</strong> Opens interactive editor with live changes</div>
          <div style={bullet}><strong>Copy code:</strong> Available on all code snippets</div>
        </div>
      </div>
    </div>
  );
}