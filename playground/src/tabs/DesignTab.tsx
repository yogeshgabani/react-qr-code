import { QRCode, type ModuleShape, type CornerStyle, type EyeShape, type QRAnimation } from 'react-qr-master';
import { card, cardLabel, grid, sectionHeading, subtle, tokens } from '../styles';
import { HowToUse, CopyButton } from '../components';

const SAMPLE = 'https://react-qr-master.dev/design';

const MODULES: ModuleShape[] = [
  'square',
  'rounded',
  'extra-rounded',
  'circle',
  'dot',
  'diamond',
  'hexagon',
  'star',
];
const CORNERS: CornerStyle[] = ['square', 'rounded', 'soft-rounded', 'circle', 'modern'];
const EYES: EyeShape[] = ['square', 'rounded', 'circle', 'diamond', 'modern'];
const ANIMATIONS: QRAnimation[] = ['pulse', 'zoom', 'bounce', 'rotate', 'fade', 'wave', 'glow', 'breathing', 'scan'];

export function DesignTab() {
  return (
    <div>
      <HowToUse
        title="Design Engine"
        description="Customize the visual appearance of your QR codes with module shapes, corner styles, eye designs, gradients, and animations."
        examples={[
          {
            language: 'tsx',
            label: 'Module Shape',
            code: `<QRCode
  value="https://example.com"
  shape="rounded"
  size={256}
/>`,
            description: 'Change data-module appearance. Options: square, rounded, extra-rounded, circle, dot, diamond, hexagon, star.'
          },
          {
            language: 'tsx',
            label: 'Corner + Eye Combo',
            code: `<QRCode
  value="https://example.com"
  cornerStyle="modern"
  eyeShape="circle"
  size={256}
/>`,
            description: 'Customize the finder pattern (the three corner squares). cornerStyle affects the outer ring, eyeShape affects the inner pupil.'
          },
          {
            language: 'tsx',
            label: 'Gradient Fill',
            code: `<QRCode
  value="https://example.com"
  gradient={{
    type: 'linear',
    colors: ['#3b82f6', '#7c3aed'],
    rotation: 135
  }}
  size={256}
/>`,
            description: 'Apply linear, radial, or conic gradients to the QR modules. Supports color lists and rotation.'
          },
          {
            language: 'tsx',
            label: 'Animation',
            code: `<QRCode
  value="https://example.com"
  animation="pulse"
  size={256}
/>`,
            description: 'Add CSS animation: pulse, zoom, bounce, rotate, fade, wave, glow, breathing, or scan.'
          },
        ]}
      />

      <h2 style={sectionHeading}>Module shapes · 8</h2>
      <p style={subtle}>Data-cell appearance — controls every non-eye module.</p>
      <div style={grid}>
        {MODULES.map((shape) => (
          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card" key={shape}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <p style={cardLabel}>shape="{shape}"</p>
              <CopyButton text={`shape="${shape}"`} label="Copy" size="sm" />
            </div>
            <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
              <QRCode value={SAMPLE} size={160} shape={shape} />
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ ...sectionHeading, marginTop: 32 }}>Corner styles · 5</h2>
      <p style={subtle}>The outer ring of each finder pattern ("eye frame").</p>
      <div style={grid}>
        {CORNERS.map((cornerStyle) => (
          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card" key={cornerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <p style={cardLabel}>cornerStyle="{cornerStyle}"</p>
              <CopyButton text={`cornerStyle="${cornerStyle}"`} label="Copy" size="sm" />
            </div>
            <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
              <QRCode value={SAMPLE} size={160} cornerStyle={cornerStyle} eyeShape="square" />
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ ...sectionHeading, marginTop: 32 }}>Eye shapes · 5</h2>
      <p style={subtle}>The inner pupil of each finder pattern.</p>
      <div style={grid}>
        {EYES.map((eyeShape) => (
          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card" key={eyeShape}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <p style={cardLabel}>eyeShape="{eyeShape}"</p>
              <CopyButton text={`eyeShape="${eyeShape}"`} label="Copy" size="sm" />
            </div>
            <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
              <QRCode value={SAMPLE} size={160} eyeShape={eyeShape} cornerStyle="rounded" />
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ ...sectionHeading, marginTop: 32 }}>Gradients · 3 types</h2>
      <p style={subtle}>Linear (with rotation), radial, and conic (CSS via foreignObject).</p>
      <div style={grid}>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <p style={cardLabel}>Linear · 135°</p>
            <CopyButton text={`gradient={{ type: 'linear', colors: ['#3b82f6', '#7c3aed'], rotation: 135 }}`} label="Code" size="sm" />
          </div>
          <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
            <QRCode
              value={SAMPLE}
              size={180}
              shape="rounded"
              cornerStyle="modern"
              eyeShape="modern"
              gradient={{ type: 'linear', colors: ['#3b82f6', '#7c3aed', '#ec4899'], rotation: 135 }}
            />
          </div>
        </div>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <p style={cardLabel}>Radial</p>
            <CopyButton text={`gradient={{ type: 'radial', colors: ['#10b981', '#064e3b'] }}`} label="Code" size="sm" />
          </div>
          <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
            <QRCode
              value={SAMPLE}
              size={180}
              shape="dot"
              cornerStyle="circle"
              eyeShape="circle"
              gradient={{ type: 'radial', colors: ['#10b981', '#064e3b'] }}
            />
          </div>
        </div>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <p style={cardLabel}>Conic</p>
            <CopyButton text={`gradient={{ type: 'conic', colors: ['#a855f7', '#ec4899', '#f59e0b'] }}`} label="Code" size="sm" />
          </div>
          <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
            <QRCode
              value={SAMPLE}
              size={180}
              shape="rounded"
              cornerStyle="modern"
              eyeShape="modern"
              gradient={{ type: 'conic', colors: ['#a855f7', '#ec4899', '#f59e0b', '#a855f7'] }}
            />
          </div>
        </div>
      </div>

      <h2 style={{ ...sectionHeading, marginTop: 32 }}>Animations · 9</h2>
      <p style={subtle}>
        CSS keyframes embedded in the SVG — no global stylesheet needed. Use higher error correction
        ('Q' / 'H') if combined with dotted/star shapes.
      </p>
      <div style={grid}>
        {ANIMATIONS.map((animation) => (
          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }} className="qrm-card" key={animation}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <p style={cardLabel}>animation="{animation}"</p>
              <CopyButton text={`animation="${animation}"`} label="Copy" size="sm" />
            </div>
            <div style={{ display: 'grid', placeItems: 'center', flex: 1 }}>
              <QRCode
                value={SAMPLE}
                size={160}
                animation={animation}
                shape="rounded"
                cornerStyle="rounded"
                eyeShape="rounded"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
