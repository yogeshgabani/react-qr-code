import { useState } from 'react';
import { DynamicQRCode, useDynamicQR } from 'react-qr-master';
import { subtle, button } from '../styles';

export function DynamicTab() {
  const [destination, setDestination] = useState('https://primary.example.com');
  const expires = useDynamicQR({
    id: 'demo-expires',
    initialValue: 'https://before-expiry.example.com',
    expiresAt: new Date(Date.now() + 30_000), // 30s from now
  });
  const limited = useDynamicQR({
    id: 'demo-limit',
    initialValue: 'https://limited.example.com',
    maxScans: 3,
  });

  return (
    <div>
      <p style={subtle}>
        Swap destinations at runtime, enforce expiry + scan limits. Backed by{' '}
        <code>localStorage</code>. For real cross-device dynamism, point a redirect backend at the
        encoded URL and update the destination server-side.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
        <Card title="Live destination swap">
          <DynamicQRCode
            id="demo-swap"
            initialValue={destination}
            value={destination}
            size={200}
          />
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{ padding: 8, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, width: '100%' }}
          />
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            Type a new URL — the QR re-encodes immediately. State persists across reloads.
          </p>
        </Card>

        <Card title="Expiry · 30s window">
          <DynamicQRCode
            id="demo-expires"
            initialValue="https://before-expiry.example.com"
            expiresAt={new Date(Date.now() + 30_000)}
            size={200}
          />
          <p style={{ fontSize: 12, color: '#64748b', margin: 0, textAlign: 'center' }}>
            Reload after 30s to see the expired state. <code>expires.expired</code> ={' '}
            <strong>{String(expires.expired)}</strong>
          </p>
        </Card>

        <Card title="Usage limit · 3 scans">
          <DynamicQRCode
            id="demo-limit"
            initialValue="https://limited.example.com"
            maxScans={3}
            size={200}
          />
          <p style={{ fontSize: 12, color: '#64748b', margin: 0, textAlign: 'center' }}>
            Recorded scans: <strong>{limited.scanCount}</strong>
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button style={button} onClick={limited.recordScan}>
              Record a scan
            </button>
            <button style={{ ...button, background: '#dc2626' }} onClick={limited.reset}>
              Reset
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 16,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>{title}</h3>
      {children}
    </div>
  );
}
