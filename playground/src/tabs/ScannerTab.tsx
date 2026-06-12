import { useRef, useState } from 'react';
import { QRScanner, type QRScannerHandle, type QRScanResult } from 'react-qr-master';
import { subtle, button } from '../styles';

export function ScannerTab() {
  const scannerRef = useRef<QRScannerHandle>(null);
  const [results, setResults] = useState<QRScanResult[]>([]);
  const [paused, setPaused] = useState(false);
  const [facing, setFacing] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <p style={subtle}>
        Uses <code>navigator.mediaDevices.getUserMedia</code> + jsQR. Browser will prompt for
        camera permission. Torch / front-back camera toggle supported on capable devices.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px,1fr) minmax(280px,1fr)', gap: 20 }}>
        <div>
          <QRScanner
            ref={scannerRef}
            onScan={(r) => setResults((prev) => [r, ...prev].slice(0, 30))}
            onError={(e) => setError(e.message)}
            facingMode={facing}
            height={360}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
            <button
              style={button}
              onClick={() => {
                if (paused) scannerRef.current?.resume();
                else scannerRef.current?.pause();
                setPaused(!paused);
              }}
            >
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              style={{ ...button, background: '#4f46e5' }}
              onClick={() => setFacing(facing === 'environment' ? 'user' : 'environment')}
            >
              Switch to {facing === 'environment' ? 'front' : 'rear'} camera
            </button>
            <button
              style={{ ...button, background: '#0891b2' }}
              onClick={async () => {
                const on = (await scannerRef.current?.toggleTorch()) ?? false;
                setTorchOn(on);
              }}
            >
              Torch {torchOn ? 'on' : 'off'}
            </button>
            <button
              style={{ ...button, background: '#dc2626' }}
              onClick={() => setResults([])}
            >
              Clear history
            </button>
          </div>
          {error ? (
            <p style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</p>
          ) : null}
        </div>
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 14,
            border: '1px solid #e5e7eb',
            maxHeight: 410,
            overflow: 'auto',
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', color: '#0f172a' }}>
            Scan history ({results.length})
          </h3>
          {results.length === 0 ? (
            <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>
              Point camera at any QR — results show up here. Deduplication is on by default.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {results.map((r, i) => (
                <li
                  key={`${r.timestamp}-${i}`}
                  style={{
                    padding: '8px 10px',
                    background: '#f8fafc',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#1e293b',
                    wordBreak: 'break-all',
                  }}
                >
                  <div style={{ color: '#64748b', fontSize: 11, marginBottom: 2 }}>
                    {new Date(r.timestamp).toLocaleTimeString()}
                  </div>
                  {r.data}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
