import { useEffect, useRef, useState } from 'react';
import { QRCode, useQRDownload, type QRCodeProps } from 'react-qr-master';
import { tokens } from '../styles';
import { CopyButton } from './CopyButton';

export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProps?: Partial<QRCodeProps>;
  title?: string;
}

type EditableKeys = 'value' | 'size' | 'level' | 'fgColor' | 'bgColor' | 'shape' | 'cornerStyle' | 'eyeShape';

const PRESETS = {
  shapes: ['square', 'rounded', 'extra-rounded', 'circle', 'dot', 'diamond', 'hexagon', 'star'] as const,
  corners: ['square', 'rounded', 'soft-rounded', 'circle', 'modern'] as const,
  eyes: ['square', 'rounded', 'circle', 'diamond', 'modern'] as const,
  levels: ['L', 'M', 'Q', 'H'] as const,
};

export function QRCodeModal({ isOpen, onClose, initialProps = {}, title = 'QR Code Designer' }: QRCodeModalProps) {
  const { ref, download } = useQRDownload();
  const codeRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState(initialProps.value || 'https://example.com');
  const [size, setSize] = useState(initialProps.size || 300);
  const [level, setLevel] = useState(initialProps.level || 'M');
  const [fgColor, setFgColor] = useState(initialProps.fgColor || '#000000');
  const [bgColor, setBgColor] = useState(initialProps.bgColor || '#ffffff');
  const [shape, setShape] = useState(initialProps.shape || 'square');
  const [cornerStyle, setCornerStyle] = useState(initialProps.cornerStyle || 'square');
  const [eyeShape, setEyeShape] = useState(initialProps.eyeShape || 'square');

  const qrProps: QRCodeProps = {
    value,
    size,
    level: level as any,
    fgColor,
    bgColor,
    shape: shape as any,
    cornerStyle: cornerStyle as any,
    eyeShape: eyeShape as any,
  };

  const generateCode = () => {
    const props = [];
    if (value !== 'https://example.com') props.push(`value="${value}"`);
    if (size !== 300) props.push(`size={${size}}`);
    if (level !== 'M') props.push(`level="${level}"`);
    if (fgColor !== '#000000') props.push(`fgColor="${fgColor}"`);
    if (bgColor !== '#ffffff') props.push(`bgColor="${bgColor}"`);
    if (shape !== 'square') props.push(`shape="${shape}"`);
    if (cornerStyle !== 'square') props.push(`cornerStyle="${cornerStyle}"`);
    if (eyeShape !== 'square') props.push(`eyeShape="${eyeShape}"`);

    const propsStr = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    return `import { QRCode } from 'react-qr-master';\n\nexport function MyQRCode() {\n  return (\n    <QRCode${propsStr}/>\n  );\n}`;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    background: 'rgba(0,0,0,0.3)',
    border: `1px solid ${tokens.border}`,
    borderRadius: 8,
    color: tokens.text,
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: tokens.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.4,
    marginBottom: 6,
  };

  const sectionStyle = {
    paddingBottom: 16,
    borderBottom: `1px solid ${tokens.border}`,
    marginBottom: 16,
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  };

  const chipStyle = (active: boolean) => ({
    padding: '6px 12px',
    background: active ? tokens.primary : tokens.bgCard,
    border: `1px solid ${active ? tokens.primary : tokens.border}`,
    borderRadius: 8,
    color: active ? '#000' : tokens.text,
    fontSize: 11,
    fontWeight: 600 as const,
    cursor: 'pointer' as const,
    transition: 'all 0.2s ease',
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: tokens.bgCard,
          border: `1px solid ${tokens.border}`,
          borderRadius: 16,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          maxWidth: 1000,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Preview & Code */}
        <div
          style={{
            padding: 32,
            background: 'rgba(255,255,255,0.02)',
            borderRight: `1px solid ${tokens.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: tokens.text }}>
              Preview
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: tokens.textMuted,
                fontSize: 24,
                cursor: 'pointer',
                padding: 4,
              }}
            >
              ✕
            </button>
          </div>

          {/* QR Preview */}
          <div
            style={{
              background: '#ffffff',
              padding: 24,
              borderRadius: 12,
              display: 'grid',
              placeItems: 'center',
              aspectRatio: '1',
              border: `1px solid ${tokens.border}`,
            }}
          >
            <QRCode ref={ref} {...qrProps} />
          </div>

          {/* Download Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={() => download('png', { pixelSize: 1024 })}
              style={{
                padding: '10px 14px',
                background: tokens.primary,
                color: '#000',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              📥 PNG
            </button>
            <button
              onClick={() => download('svg')}
              style={{
                padding: '10px 14px',
                background: tokens.primary,
                color: '#000',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              📥 SVG
            </button>
          </div>

          {/* Code Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tokens.text }}>React Code</h3>
              <CopyButton text={generateCode()} label="Copy" variant="outline" size="sm" />
            </div>
            <pre
              ref={codeRef}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: `1px solid ${tokens.border}`,
                borderRadius: 8,
                padding: 12,
                fontSize: 10,
                lineHeight: 1.5,
                color: tokens.text,
                fontFamily: "'JetBrains Mono', monospace",
                margin: 0,
                overflow: 'auto',
                maxHeight: 200,
              }}
            >
              <code>{generateCode()}</code>
            </pre>
          </div>
        </div>

        {/* Right: Controls */}
        <div
          style={{
            padding: 32,
            overflow: 'auto',
          }}
        >
          <h2 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800, color: tokens.text }}>
            Customize
          </h2>

          {/* QR Value */}
          <div style={sectionStyle}>
            <label style={labelStyle}>QR Value / Data</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://example.com"
              style={inputStyle as any}
            />
            <p style={{ fontSize: 10, color: tokens.textSubtle, margin: '6px 0 0' }}>
              URL, text, WiFi SSID, email, phone, etc.
            </p>
          </div>

          {/* Size */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Size: {size}px</label>
            <input
              type="range"
              min={120}
              max={600}
              step={20}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          {/* Error Correction */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Error Correction</label>
            <div style={gridStyle}>
              {PRESETS.levels.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  style={chipStyle(level === l)}
                  onMouseEnter={(e) => {
                    if (level !== l) e.currentTarget.style.borderColor = tokens.borderBright;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = level === l ? tokens.primary : tokens.border;
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 10, color: tokens.textSubtle, margin: '6px 0 0' }}>
              L=7% M=15% Q=25% H=30% recovery
            </p>
          </div>

          {/* Colors */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Foreground Color</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                style={{ width: 50, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                style={inputStyle as any}
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Background Color</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                style={{ width: 50, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                style={inputStyle as any}
              />
            </div>
          </div>

          {/* Module Shape */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Module Shape</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {PRESETS.shapes.map((s) => (
                <button
                  key={s}
                  onClick={() => setShape(s)}
                  style={chipStyle(shape === s)}
                  onMouseEnter={(e) => {
                    if (shape !== s) e.currentTarget.style.borderColor = tokens.borderBright;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = shape === s ? tokens.primary : tokens.border;
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Style */}
          <div style={sectionStyle}>
            <label style={labelStyle}>Corner Style</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {PRESETS.corners.map((c) => (
                <button
                  key={c}
                  onClick={() => setCornerStyle(c)}
                  style={chipStyle(cornerStyle === c)}
                  onMouseEnter={(e) => {
                    if (cornerStyle !== c) e.currentTarget.style.borderColor = tokens.borderBright;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = cornerStyle === c ? tokens.primary : tokens.border;
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Eye Shape */}
          <div>
            <label style={labelStyle}>Eye Shape</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {PRESETS.eyes.map((e) => (
                <button
                  key={e}
                  onClick={() => setEyeShape(e)}
                  style={chipStyle(eyeShape === e)}
                  onMouseEnter={(el) => {
                    if (eyeShape !== e) el.currentTarget.style.borderColor = tokens.borderBright;
                  }}
                  onMouseLeave={(el) => {
                    el.currentTarget.style.borderColor = eyeShape === e ? tokens.primary : tokens.border;
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
