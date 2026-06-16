import { useEffect, useRef, useState, useMemo } from 'react';
import { QRCode, useQRDownload, type QRCodeProps } from 'react-qr-master';
import { tokens } from '../styles';
import { CopyButton } from './CopyButton';

export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProps?: Partial<QRCodeProps>;
  title?: string;
}

const PRESETS = {
  shapes: ['square', 'rounded', 'extra-rounded', 'circle', 'dot', 'diamond', 'hexagon', 'star'] as const,
  corners: ['square', 'rounded', 'soft-rounded', 'circle', 'modern'] as const,
  eyes: ['square', 'rounded', 'circle', 'diamond', 'modern'] as const,
  levels: ['L', 'M', 'Q', 'H'] as const,
};

const DEFAULTS = {
  value: 'https://example.com',
  size: 300,
  level: 'M',
  fgColor: '#000000',
  bgColor: '#ffffff',
  shape: 'square',
  cornerStyle: 'square',
  eyeShape: 'square',
};

export function QRCodeModal({ isOpen, onClose, initialProps = {}, title = 'QR Code Designer' }: QRCodeModalProps) {
  const { ref, download } = useQRDownload();
  const codeRef = useRef<HTMLDivElement>(null);

  // Initialize with provided values or defaults
  const initialValue = initialProps.value || DEFAULTS.value;
  const initialSize = initialProps.size || DEFAULTS.size;
  const initialLevel = initialProps.level || DEFAULTS.level;
  const initialFgColor = initialProps.fgColor || DEFAULTS.fgColor;
  const initialBgColor = initialProps.bgColor || DEFAULTS.bgColor;
  const initialShape = initialProps.shape || DEFAULTS.shape;
  const initialCornerStyle = initialProps.cornerStyle || DEFAULTS.cornerStyle;
  const initialEyeShape = initialProps.eyeShape || DEFAULTS.eyeShape;

  const [value, setValue] = useState(initialValue);
  const [size, setSize] = useState(initialSize);
  const [level, setLevel] = useState(initialLevel);
  const [fgColor, setFgColor] = useState(initialFgColor);
  const [bgColor, setBgColor] = useState(initialBgColor);
  const [shape, setShape] = useState(initialShape);
  const [cornerStyle, setCornerStyle] = useState(initialCornerStyle);
  const [eyeShape, setEyeShape] = useState(initialEyeShape);
  const [moduleSpacing, setModuleSpacing] = useState(0);

  const qrProps: QRCodeProps = {
    value,
    size,
    level: level as any,
    fgColor,
    bgColor,
    shape: shape as any,
    cornerStyle: cornerStyle as any,
    eyeShape: eyeShape as any,
    moduleSpacing,
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
    if (moduleSpacing !== 0) props.push(`moduleSpacing={${moduleSpacing.toFixed(2)}}`);

    const propsStr = props.length > 0 ? `\n  ${props.join('\n  ')}\n` : '';
    return `import { QRCode } from 'react-qr-master';\n\nexport function MyQRCode() {\n  return (\n    <QRCode${propsStr}/>\n  );\n}`;
  };

  const handleReset = () => {
    setValue(initialValue);
    setSize(initialSize);
    setLevel(initialLevel);
    setFgColor(initialFgColor);
    setBgColor(initialBgColor);
    setShape(initialShape);
    setCornerStyle(initialCornerStyle);
    setEyeShape(initialEyeShape);
    setModuleSpacing(0);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') handleClose();
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

  // Animation styles
  const backdropStyle = {
    animation: 'fadeIn 0.2s ease-out',
  };

  const modalStyle = {
    animation: 'slideUp 0.3s ease-out',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'rgba(0,0,0,0.4)',
    border: `1px solid ${tokens.border}`,
    borderRadius: 8,
    color: tokens.text,
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
  };

  const labelStyle = {
    fontSize: 10,
    fontWeight: 700,
    color: tokens.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 8,
    display: 'block',
  };

  const chipStyle = (active: boolean, color?: string) => ({
    padding: '10px 12px',
    background: active ? (color || tokens.primary) : tokens.bgCard,
    border: `2px solid ${active ? (color || tokens.primary) : tokens.border}`,
    borderRadius: 10,
    color: active ? '#fff' : tokens.textMuted,
    fontSize: 12,
    fontWeight: 700 as const,
    cursor: 'pointer' as const,
    transition: 'all 0.2s ease',
    boxShadow: active ? `0 0 12px ${(color || tokens.primary)}40` : 'none',
  });

  // Color schemes for different button types
  const shapeColors: Record<string, string> = {
    square: '#8B5CF6',
    rounded: '#EC4899',
    'extra-rounded': '#F59E0B',
    circle: '#10B981',
    dot: '#06B6D4',
    diamond: '#EF4444',
    hexagon: '#6366F1',
    star: '#F97316',
  };

  const cornerColors: Record<string, string> = {
    square: '#3B82F6',
    rounded: '#8B5CF6',
    'soft-rounded': '#D946EF',
    circle: '#EC4899',
    modern: '#F59E0B',
  };

  const eyeColors: Record<string, string> = {
    square: '#06B6D4',
    rounded: '#14B8A6',
    circle: '#10B981',
    diamond: '#84CC16',
    modern: '#FBBF24',
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16,
          ...backdropStyle,
        } as any}
        onClick={handleClose}
      >
        <div
          style={{
            background: tokens.bgCard,
            border: `2px solid ${tokens.primary}`,
            borderRadius: 16,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maxWidth: 1000,
            width: '100%',
            maxHeight: '95vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            ...modalStyle,
          } as any}
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: `1px solid ${tokens.border}`,
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: tokens.text }}>
            {title}
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: `1px solid ${tokens.border}`,
                color: tokens.textMuted,
                padding: '8px 14px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Reset all values to original"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = tokens.borderBright;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = tokens.border;
              }}
            >
              ↻ Reset
            </button>
            <button
              onClick={handleClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: tokens.textMuted,
                fontSize: 24,
                cursor: 'pointer',
                padding: '0px 8px',
              }}
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content: Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 0, flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Left: Preview & Code */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              padding: '20px',
              background: 'rgba(255,255,255,0.02)',
              borderRight: `1px solid ${tokens.border}`,
              overflow: 'auto',
              alignItems: 'stretch',
              minWidth: 0,
            }}
          >
            {/* QR Preview - Responsive */}
            <div
              style={{
                background: '#ffffff',
                padding: 16,
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
                border: `2px solid ${tokens.border}`,
                width: '100%',
                maxWidth: `${Math.min(size + 40, 400)}px`,
                aspectRatio: '1',
                overflow: 'auto',
              }}
            >
              <div style={{ maxWidth: `${size}px`, maxHeight: `${size}px`, width: '100%', aspectRatio: '1' }}>
                <QRCode ref={ref} {...qrProps} style={{ width: '100%', height: '100%' }} />
              </div>
            </div>

            {/* Download & Copy Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <button
                onClick={() => download('png', { pixelSize: 1024 })}
                style={{
                  padding: '12px 14px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                🖼 PNG
              </button>
              <button
                onClick={() => download('svg')}
                style={{
                  padding: '12px 14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                📄 SVG
              </button>
              <button
                onClick={() => download('pdf')}
                style={{
                  padding: '12px 14px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                  e.currentTarget.style.transform = 'scale(0.98)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
              >
                📋 PDF
              </button>
            </div>

            {/* Code Section */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={labelStyle as any}>React Code</label>
                <CopyButton text={generateCode()} label="Copy" variant="outline" size="sm" />
              </div>
              <pre
                ref={codeRef}
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${tokens.border}`,
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: 11,
                  lineHeight: 1.5,
                  color: tokens.text,
                  fontFamily: "'JetBrains Mono', monospace",
                  margin: 0,
                  overflow: 'auto',
                  maxHeight: '200px',
                  minHeight: '100px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word' as any,
                  width: '100%',
                  boxSizing: 'border-box' as any,
                }}
              >
                <code>{generateCode()}</code>
              </pre>
            </div>
          </div>

          {/* Right: Controls (Scrollable) */}
          <div
            style={{
              padding: 24,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            {/* QR Value */}
            <div>
              <label style={labelStyle}>QR Data</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://example.com"
                style={inputStyle as any}
              />
              <p style={{ fontSize: 10, color: tokens.textSubtle, margin: '6px 0 0' }}>
                URL, text, WiFi, email, phone, etc.
              </p>
            </div>

            {/* Size */}
            <div>
              <label style={labelStyle}>Size: {size}px</label>
              <input
                type="range"
                min={120}
                max={600}
                step={20}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', height: 6 }}
              />
            </div>

            {/* Module Spacing */}
            <div>
              <label style={labelStyle}>Module Spacing: {(moduleSpacing * 100).toFixed(0)}%</label>
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.05}
                value={moduleSpacing}
                onChange={(e) => setModuleSpacing(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', height: 6 }}
              />
              <p style={{ fontSize: 9, color: tokens.textSubtle, margin: '4px 0 0' }}>
                0% = no gaps, 50% = maximum gaps
              </p>
            </div>

            {/* Error Correction */}
            <div>
              <label style={labelStyle}>Error Correction</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {PRESETS.levels.map((l, idx) => {
                  const levelColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];
                  return (
                    <button
                      key={l}
                      onClick={() => setLevel(l as any)}
                      style={chipStyle(level === l, levelColors[idx]) as any}
                      onMouseEnter={(e) => {
                        if (level !== l) {
                          e.currentTarget.style.borderColor = levelColors[idx];
                          e.currentTarget.style.background = `${levelColors[idx]}20`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (level !== l) {
                          e.currentTarget.style.borderColor = tokens.border;
                          e.currentTarget.style.background = tokens.bgCard;
                        }
                      }}
                      title={`Level ${l}: ${['7%', '15%', '25%', '30%'][idx]} recovery`}
                    >
                      <strong>{l}</strong>
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: 9, color: tokens.textSubtle, margin: '8px 0 0' }}>
                L=7% | M=15% | Q=25% | H=30% recovery
              </p>
            </div>

            {/* Colors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={labelStyle}>Foreground</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    style={{ width: 44, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    style={{ ...inputStyle, flex: 1, fontSize: 11 } as any}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Background</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ width: 44, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer' }}
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    style={{ ...inputStyle, flex: 1, fontSize: 11 } as any}
                  />
                </div>
              </div>
            </div>

            {/* Module Shape */}
            <div>
              <label style={labelStyle}>Module Shape</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {PRESETS.shapes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s as any)}
                    style={chipStyle(shape === s, shapeColors[s]) as any}
                    onMouseEnter={(e) => {
                      if (shape !== s) {
                        e.currentTarget.style.borderColor = shapeColors[s];
                        e.currentTarget.style.background = `${shapeColors[s]}20`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (shape !== s) {
                        e.currentTarget.style.borderColor = tokens.border;
                        e.currentTarget.style.background = tokens.bgCard;
                      }
                    }}
                    title={s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Style */}
            <div>
              <label style={labelStyle}>Corner Style</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {PRESETS.corners.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCornerStyle(c as any)}
                    style={chipStyle(cornerStyle === c, cornerColors[c]) as any}
                    onMouseEnter={(e) => {
                      if (cornerStyle !== c) {
                        e.currentTarget.style.borderColor = cornerColors[c];
                        e.currentTarget.style.background = `${cornerColors[c]}20`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (cornerStyle !== c) {
                        e.currentTarget.style.borderColor = tokens.border;
                        e.currentTarget.style.background = tokens.bgCard;
                      }
                    }}
                    title={c}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Eye Shape */}
            <div>
              <label style={labelStyle}>Eye Shape</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {PRESETS.eyes.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEyeShape(e as any)}
                    style={chipStyle(eyeShape === e, eyeColors[e]) as any}
                    onMouseEnter={(el) => {
                      if (eyeShape !== e) {
                        el.currentTarget.style.borderColor = eyeColors[e];
                        el.currentTarget.style.background = `${eyeColors[e]}20`;
                      }
                    }}
                    onMouseLeave={(el) => {
                      if (eyeShape !== e) {
                        el.currentTarget.style.borderColor = tokens.border;
                        el.currentTarget.style.background = tokens.bgCard;
                      }
                    }}
                    title={e}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
