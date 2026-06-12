import { useState } from 'react';
import { QRCode, QRScanner, useQRAnalytics } from 'react-qr-master';
import { subtle, button } from '../styles';

export function AnalyticsTab() {
  const { summary, track, clear } = useQRAnalytics();
  const [trackedId, setTrackedId] = useState('demo-campaign');
  const [trackedValue, setTrackedValue] = useState('https://demo.example.com/landing');

  return (
    <div>
      <p style={subtle}>
        Every scan recorded via <code>track()</code> is stamped with device / browser / OS /
        timestamp and persisted to <code>localStorage</code>. Pair with your own ingest endpoint
        for production analytics across devices.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,1fr) minmax(320px,2fr)', gap: 18 }}>
        <section
          style={{
            background: '#fff',
            padding: 16,
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#0f172a' }}>
            Sample QR + manual tracking
          </h3>
          <QRCode value={trackedValue} size={200} />
          <div style={{ display: 'grid', gap: 6, width: '100%' }}>
            <input
              value={trackedId}
              onChange={(e) => setTrackedId(e.target.value)}
              placeholder="QR identifier (campaign id)"
              style={{ padding: 8, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
            />
            <input
              value={trackedValue}
              onChange={(e) => setTrackedValue(e.target.value)}
              placeholder="Destination value"
              style={{ padding: 8, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button style={button} onClick={() => track(trackedId, trackedValue)}>
              Track a scan
            </button>
            <button style={{ ...button, background: '#dc2626' }} onClick={clear}>
              Clear data
            </button>
          </div>
          <details style={{ width: '100%', fontSize: 12, color: '#475569' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Auto-track from Scanner</summary>
            <p style={{ marginTop: 8 }}>
              The scanner below records every successful scan as analytic event with id "scanner".
            </p>
            <div style={{ maxWidth: 240 }}>
              <QRScanner
                onScan={(r) => track('scanner', r.data)}
                height={180}
                facingMode="environment"
              />
            </div>
          </details>
        </section>

        <section style={{ display: 'grid', gap: 14 }}>
          <Stat label="Total scans" value={summary.totalScans} />
          <Stat label="Unique QR ids" value={summary.uniqueScans} />
          <Breakdown title="By device" data={summary.byDevice} />
          <Breakdown title="By browser" data={summary.byBrowser} />
          <Breakdown title="By OS" data={summary.byOS} />
          <Breakdown title="By date" data={summary.byDate} />
          <Breakdown title="By hour" data={summary.byHour} />
          <Recent recent={summary.recent} />
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 14,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <span style={{ fontSize: 13, color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{value}</span>
    </div>
  );
}

function Breakdown({ title, data }: { title: string; data: Record<string, number> }) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] ?? 1;
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>
        {title}
      </h4>
      {entries.length === 0 ? (
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>No data yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
          {entries.map(([k, v]) => (
            <li key={k} style={{ fontSize: 12, color: '#1e293b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span>{k}</span>
                <span style={{ color: '#64748b' }}>{v}</span>
              </div>
              <div style={{ height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(v / max) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg,#6366f1,#a855f7)',
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Recent({ recent }: { recent: { id: string; value: string; timestamp: number }[] }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <h4 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>
        Recent events
      </h4>
      {recent.length === 0 ? (
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>None yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
          {recent.map((e, i) => (
            <li
              key={i}
              style={{
                fontSize: 12,
                color: '#1e293b',
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <span style={{ color: '#64748b', flexShrink: 0 }}>
                {new Date(e.timestamp).toLocaleTimeString()}
              </span>
              <span style={{ fontWeight: 600 }}>{e.id}</span>
              <span style={{ color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.value}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
