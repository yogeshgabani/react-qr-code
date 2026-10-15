import {
  useMemo,
  useState,
  useEffect,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { QRCode, type LabelPosition, type LabelStyle } from '../QRCode/QRCode';
import { useQRDownload } from '../../hooks/useQRDownload';
import type { ModuleShape, CornerStyle, EyeShape } from '../../core/shapes';
import type { QRThemeName } from '../../core/themes';
import type { QRAnimation } from '../../core/animations';
import type { QRGradient } from '../../core/qr-types';
import type { DownloadFormat } from '../../utils/download';
import type { ErrorCorrectionLevel } from '../../core/qr-generator';

// ─── Constants ──────────────────────────────────────────────────────────────
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
const THEME_NAMES: QRThemeName[] = [
  'light',
  'dark',
  'neon',
  'corporate',
  'glassmorphism',
  'gradient',
  'modern',
  'minimal',
  'cyberpunk',
  'premium',
];
const ANIMATIONS: (QRAnimation | 'none')[] = [
  'none',
  'pulse',
  'zoom',
  'bounce',
  'rotate',
  'fade',
  'wave',
  'glow',
  'breathing',
  'scan',
];
const LEVELS: ErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H'];
const FORMATS: DownloadFormat[] = ['png', 'jpg', 'webp', 'svg', 'pdf'];

// Tiny preview swatches for each theme — pure colour pairs so we don't have to
// render full QRs in the picker chips.
const THEME_SWATCHES: Record<QRThemeName, [string, string]> = {
  light: ['#0f172a', '#ffffff'],
  dark: ['#ffffff', '#0a0a0f'],
  neon: ['#22d3ee', '#0a0a0f'],
  corporate: ['#1e3a8a', '#f8fafc'],
  glassmorphism: ['#f0f0f5', '#7c3aed'],
  gradient: ['#ec4899', '#3b82f6'],
  modern: ['#0f172a', '#f1f5f9'],
  minimal: ['#334155', '#ffffff'],
  cyberpunk: ['#f0abfc', '#0a0a0f'],
  premium: ['#fbbf24', '#0a0a0f'],
};

// ─── Style tokens — premium dark glass palette ─────────────────────────────
const COLORS = {
  bg: '#08080f',
  bgSoft: '#0e0e17',
  surface: 'rgba(255,255,255,0.035)',
  surfaceHover: 'rgba(255,255,255,0.06)',
  surfaceActive: 'rgba(168,85,247,0.12)',
  border: 'rgba(255,255,255,0.08)',
  borderBright: 'rgba(255,255,255,0.16)',
  borderActive: 'rgba(168,85,247,0.45)',
  text: '#f0f0f5',
  textMuted: '#a0a0b5',
  textSubtle: '#60607a',
  accent: '#a855f7',
  accentSoft: 'rgba(168,85,247,0.18)',
  accentDark: '#7c3aed',
  accent2: '#22d3ee',
  success: '#34d399',
  danger: '#f87171',
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
};

// Wrapped in a pure IIFE: the `${COLORS.x}` reads would otherwise count as
// side effects and keep this CSS in every bundle that imports the package.
const styleSheet = /* @__PURE__ */ (() => `
.qrm-studio {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', system-ui, sans-serif;
  color: ${COLORS.text};
}
.qrm-studio input[type="text"],
.qrm-studio input[type="number"],
.qrm-studio input[type="url"],
.qrm-studio select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${COLORS.border};
  background: ${COLORS.surface};
  border-radius: 10px;
  font-size: 13px;
  color: ${COLORS.text};
  font-family: inherit;
  transition: all 0.18s ease;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
}
.qrm-studio input::placeholder { color: ${COLORS.textSubtle}; }
.qrm-studio select {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%23a0a0b5' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 11px 7px;
  padding-right: 32px;
  cursor: pointer;
}
.qrm-studio select option {
  background: ${COLORS.bgSoft};
  color: ${COLORS.text};
}
.qrm-studio input:hover,
.qrm-studio select:hover {
  border-color: ${COLORS.borderBright};
  background: ${COLORS.surfaceHover};
}
.qrm-studio input:focus,
.qrm-studio select:focus {
  border-color: ${COLORS.borderActive};
  background: ${COLORS.surfaceHover};
  box-shadow: 0 0 0 4px ${COLORS.accentSoft};
}
.qrm-studio input[type="range"] {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  height: 22px;
  padding: 0;
  border: 0;
}
.qrm-studio input[type="range"]:hover,
.qrm-studio input[type="range"]:focus { background: transparent; box-shadow: none; }
.qrm-studio input[type="range"]::-webkit-slider-runnable-track {
  height: 4px;
  background: linear-gradient(to right, ${COLORS.accent}, ${COLORS.accent2});
  background-color: ${COLORS.border};
  border-radius: 999px;
}
.qrm-studio input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  margin-top: -6px;
  background: #fff;
  border: 0;
  border-radius: 50%;
  box-shadow: 0 0 0 2px ${COLORS.accent}, 0 4px 10px rgba(168,85,247,0.45);
  transition: transform 0.15s ease;
}
.qrm-studio input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.15); }
.qrm-studio input[type="range"]::-moz-range-track {
  height: 4px;
  background: ${COLORS.border};
  border-radius: 999px;
}
.qrm-studio input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #fff;
  border: 0;
  border-radius: 50%;
  box-shadow: 0 0 0 2px ${COLORS.accent}, 0 4px 10px rgba(168,85,247,0.45);
}
.qrm-chip {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 6px;
  background: ${COLORS.surface};
  border: 1px solid ${COLORS.border};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s ease;
  color: ${COLORS.textMuted};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: capitalize;
  text-align: center;
  user-select: none;
  min-height: 56px;
}
.qrm-chip:hover {
  background: ${COLORS.surfaceHover};
  border-color: ${COLORS.borderBright};
  color: ${COLORS.text};
  transform: translateY(-1px);
}
.qrm-chip[data-active="true"] {
  background: ${COLORS.surfaceActive};
  border-color: ${COLORS.borderActive};
  color: #fff;
  box-shadow: 0 0 0 1px ${COLORS.borderActive}, 0 8px 20px -8px ${COLORS.accent};
}
.qrm-chip svg { color: currentColor; }
.qrm-tab {
  flex: 1;
  padding: 9px 10px;
  background: transparent;
  border: 0;
  color: ${COLORS.textMuted};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.4px;
  cursor: pointer;
  border-radius: 8px;
  text-transform: uppercase;
  font-family: inherit;
  transition: all 0.18s ease;
  position: relative;
}
.qrm-tab:hover { color: ${COLORS.text}; }
.qrm-tab[data-active="true"] {
  background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark});
  color: #fff;
  box-shadow: 0 4px 14px -4px ${COLORS.accent};
}
.qrm-color-swatch {
  position: relative;
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 1px solid ${COLORS.border};
  cursor: pointer;
  overflow: hidden;
  transition: all 0.18s ease;
}
.qrm-color-swatch:hover {
  border-color: ${COLORS.borderBright};
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.4);
}
.qrm-color-swatch input[type="color"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: 0;
  padding: 0;
}
.qrm-fmt-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  background: ${COLORS.surface};
  color: ${COLORS.text};
  border: 1px solid ${COLORS.border};
  border-radius: 999px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  font-family: ${COLORS.mono};
  transition: all 0.18s ease;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.qrm-fmt-btn:hover {
  background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark});
  border-color: ${COLORS.accent};
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 10px 24px -8px ${COLORS.accent};
}
.qrm-upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 18px 14px;
  background: ${COLORS.surface};
  border: 1.5px dashed ${COLORS.borderBright};
  border-radius: 12px;
  cursor: pointer;
  font-size: 12px;
  color: ${COLORS.textMuted};
  text-align: center;
  font-weight: 500;
  transition: all 0.18s ease;
}
.qrm-upload-zone:hover {
  border-color: ${COLORS.accent};
  background: ${COLORS.surfaceActive};
  color: ${COLORS.text};
}
.qrm-toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
  cursor: pointer;
  user-select: none;
}
.qrm-toggle-row input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 36px;
  height: 20px;
  background: ${COLORS.border};
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  border: 0;
  box-shadow: none;
}
.qrm-toggle-row input[type="checkbox"]:hover { background: ${COLORS.borderBright}; }
.qrm-toggle-row input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.4);
  transition: transform 0.2s ease;
}
.qrm-toggle-row input[type="checkbox"]:checked {
  background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentDark});
  box-shadow: 0 0 12px -2px ${COLORS.accent};
}
.qrm-toggle-row input[type="checkbox"]:checked::before { transform: translateX(16px); }
.qrm-controls::-webkit-scrollbar { width: 8px; }
.qrm-controls::-webkit-scrollbar-track { background: transparent; }
.qrm-controls::-webkit-scrollbar-thumb {
  background: ${COLORS.border};
  border-radius: 999px;
}
.qrm-controls::-webkit-scrollbar-thumb:hover { background: ${COLORS.borderBright}; }
@keyframes qrm-ambient {
  0%, 100% { transform: translate(0,0) scale(1); opacity: 0.55; }
  50% { transform: translate(20px,-20px) scale(1.1); opacity: 0.75; }
}
.qrm-ambient-a, .qrm-ambient-b {
  position: absolute;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: qrm-ambient 14s ease-in-out infinite;
}
.qrm-ambient-a {
  top: -80px;
  left: -80px;
  background: radial-gradient(circle, rgba(168,85,247,0.55), transparent 70%);
}
.qrm-ambient-b {
  bottom: -100px;
  right: -100px;
  background: radial-gradient(circle, rgba(34,211,238,0.45), transparent 70%);
  animation-delay: -7s;
}
`)();

// ─── Mini SVG previews for shape/corner/eye chips ──────────────────────────
const SHAPE_SVG: Record<ModuleShape, ReactNode> = {
  square: <rect x="2" y="2" width="16" height="16" fill="currentColor" />,
  rounded: <rect x="2" y="2" width="16" height="16" rx="3" ry="3" fill="currentColor" />,
  'extra-rounded': <rect x="2" y="2" width="16" height="16" rx="6" ry="6" fill="currentColor" />,
  circle: <circle cx="10" cy="10" r="8" fill="currentColor" />,
  dot: <circle cx="10" cy="10" r="5" fill="currentColor" />,
  diamond: <rect x="4" y="4" width="12" height="12" transform="rotate(45 10 10)" fill="currentColor" />,
  hexagon: (
    <polygon
      points="10,2 17,6 17,14 10,18 3,14 3,6"
      fill="currentColor"
    />
  ),
  star: (
    <polygon
      points="10,2 12,8 18,8 13,12 15,18 10,14.5 5,18 7,12 2,8 8,8"
      fill="currentColor"
    />
  ),
};

const CORNER_SVG: Record<CornerStyle, ReactNode> = {
  square: (
    <>
      <rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" fill="currentColor" />
    </>
  ),
  rounded: (
    <>
      <rect x="2" y="2" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" rx="1" fill="currentColor" />
    </>
  ),
  'soft-rounded': (
    <>
      <rect x="2" y="2" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" rx="2" fill="currentColor" />
    </>
  ),
  circle: (
    <>
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="10" cy="10" r="3" fill="currentColor" />
    </>
  ),
  modern: (
    <>
      <path
        d="M2 7 Q2 2 7 2 L18 2 L18 13 Q18 18 13 18 L2 18 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect x="7" y="7" width="6" height="6" rx="2" fill="currentColor" />
    </>
  ),
};

const EYE_SVG: Record<EyeShape, ReactNode> = {
  square: (
    <>
      <rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" fill="currentColor" />
    </>
  ),
  rounded: (
    <>
      <rect x="2" y="2" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" rx="1.5" fill="currentColor" />
    </>
  ),
  circle: (
    <>
      <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="10" cy="10" r="3" fill="currentColor" />
    </>
  ),
  diamond: (
    <>
      <rect x="4" y="4" width="12" height="12" transform="rotate(45 10 10)" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="7" width="6" height="6" transform="rotate(45 10 10)" fill="currentColor" />
    </>
  ),
  modern: (
    <>
      <path
        d="M3 8 Q3 3 8 3 L17 3 L17 12 Q17 17 12 17 L3 17 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="10" cy="10" r="3" fill="currentColor" />
    </>
  ),
};

function MiniSvg({ children }: { children: ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ display: 'block' }}>
      {children}
    </svg>
  );
}

// Generic chip select grid
function ChipSelect<T extends string>({
  options,
  value,
  onChange,
  renderIcon,
  cols = 4,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  renderIcon?: (opt: T) => ReactNode;
  cols?: number;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 8,
      }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className="qrm-chip"
          data-active={value === opt}
          onClick={() => onChange(opt)}
        >
          {renderIcon ? renderIcon(opt) : null}
          <span>{opt}</span>
        </button>
      ))}
    </div>
  );
}

// Theme chip — shows the fg/bg pair as a tiny preview pip
function ThemeChip({
  name,
  active,
  onClick,
}: {
  name: QRThemeName | '';
  active: boolean;
  onClick: () => void;
}) {
  const [fg, bg] = name === '' ? ['#a0a0b5', '#1a1a26'] : THEME_SWATCHES[name];
  return (
    <button
      type="button"
      className="qrm-chip"
      data-active={active}
      onClick={onClick}
      style={{ minHeight: 64 }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: bg,
          border: `1px solid ${COLORS.border}`,
          display: 'grid',
          placeItems: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 2, background: fg }} />
      </div>
      <span style={{ fontSize: 9.5, letterSpacing: 0.3 }}>
        {name === '' ? 'none' : name}
      </span>
    </button>
  );
}

// ─── Layout helpers ────────────────────────────────────────────────────────
const labelStyle: CSSProperties = /* @__PURE__ */ (() => ({
  fontSize: 10.5,
  fontWeight: 700,
  color: COLORS.textMuted,
  marginBottom: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  letterSpacing: 0.6,
  textTransform: 'uppercase',
  fontFamily: COLORS.mono,
}))();

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={labelStyle}>
        <span>{label}</span>
        {hint ? <span style={{ color: COLORS.text, fontWeight: 600 }}>{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function Row({ children, cols = 2 }: { children: ReactNode; cols?: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
  clearable,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  clearable?: boolean;
}) {
  return (
    <Field
      label={label}
      hint={value ? value.toUpperCase() : clearable ? 'auto' : undefined}
    >
      <div style={{ display: 'flex', gap: 6 }}>
        <div
          className="qrm-color-swatch"
          style={{
            background:
              value ||
              'repeating-conic-gradient(rgba(255,255,255,0.08) 0% 25%, rgba(255,255,255,0.02) 0% 50%) 50% / 8px 8px',
          }}
        >
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        {clearable && value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              padding: '0 12px',
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 11,
              color: COLORS.textMuted,
              fontWeight: 700,
            }}
            title="Clear"
          >
            ×
          </button>
        ) : null}
      </div>
    </Field>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="qrm-toggle-row">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{label}</span>
    </label>
  );
}

type TabKey = 'content' | 'design' | 'colors' | 'brand';

// ─── Main component ────────────────────────────────────────────────────────
export interface QRStudioProps {
  initialValue?: string;
  className?: string;
  style?: CSSProperties;
}

export function QRStudio({
  initialValue = 'https://example.com',
  className,
  style,
}: QRStudioProps) {
  const [tab, setTab] = useState<TabKey>(() => {
    const saved = typeof window !== 'undefined'
      ? localStorage.getItem('qrm-studio-tab')
      : null;
    return (['content', 'design', 'colors', 'brand'].includes(saved || '')
      ? (saved as TabKey)
      : 'content');
  });
  const [value, setValue] = useState(initialValue);
  const [size, setSize] = useState(280);
  const [level, setLevel] = useState<ErrorCorrectionLevel>('M');
  const [fgColor, setFgColor] = useState('#0f172a');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [eyeColor, setEyeColor] = useState('');
  const [shape, setShape] = useState<ModuleShape>('square');
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>('square');
  const [eyeShape, setEyeShape] = useState<EyeShape>('square');
  const [theme, setTheme] = useState<QRThemeName | ''>('');
  const [animation, setAnimation] = useState<QRAnimation | 'none'>('none');
  const [useGradient, setUseGradient] = useState(false);
  const [gradType, setGradType] = useState<QRGradient['type']>('linear');
  const [gradColor1, setGradColor1] = useState('#a855f7');
  const [gradColor2, setGradColor2] = useState('#22d3ee');
  const [gradRotation, setGradRotation] = useState(135);
  const [logo, setLogo] = useState('');
  const [logoSize, setLogoSize] = useState(0.22);
  const [logoPadding, setLogoPadding] = useState(1);
  const [logoShape, setLogoShape] = useState<'square' | 'rounded' | 'circle'>('rounded');
  const [logoMode, setLogoMode] = useState<'foreground' | 'embedded' | 'background'>(
    'foreground',
  );
  const [logoPosition, setLogoPosition] = useState<
    'center' | 'top' | 'bottom' | 'left' | 'right'
  >('center');
  const [logoBorderColor, setLogoBorderColor] = useState('');
  const [logoBorderWidth, setLogoBorderWidth] = useState(0.6);
  const [frame, setFrame] = useState<'square' | 'rounded'>('square');
  const [margin, setMargin] = useState(4);
  const [moduleSpacing, setModuleSpacing] = useState(0);
  const [ctaText, setCtaText] = useState('');
  const [ctaStyle, setCtaStyle] = useState<LabelStyle>('banner');
  const [ctaPosition, setCtaPosition] = useState<LabelPosition>('bottom');
  const [ctaColor, setCtaColor] = useState('');
  const [ctaBackground, setCtaBackground] = useState('');

  // Adding a logo covers data modules, so the QR needs higher error correction
  // to stay scannable. Bump from default 'M' to 'H' on add, but respect an
  // explicit L/Q pick.
  const applyLogo = (nextLogo: string) => {
    setLogo(nextLogo);
    if (nextLogo) setLevel((cur) => (cur === 'M' ? 'H' : cur));
  };

  const handleLogoUpload = (file: File | null) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Logo must be < 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => applyLogo(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsDataURL(file);
  };

  const gradient: QRGradient | undefined = useMemo(
    () =>
      useGradient
        ? { type: gradType, colors: [gradColor1, gradColor2], rotation: gradRotation }
        : undefined,
    [useGradient, gradType, gradColor1, gradColor2, gradRotation],
  );

  // Persist active tab to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('qrm-studio-tab', tab);
    }
  }, [tab]);

  const { ref, download } = useQRDownload();

  return (
    <div
      className={`qrm-studio ${className ?? ''}`}
      style={{
        background: COLORS.bg,
        borderRadius: 24,
        overflow: 'hidden',
        border: `1px solid ${COLORS.border}`,
        boxShadow:
          '0 1px 3px rgba(0,0,0,0.4), 0 30px 80px -20px rgba(0,0,0,0.7)',
        display: 'grid',
        gridTemplateColumns: 'minmax(360px, 1.35fr) minmax(380px, 1fr)',
        minHeight: 680,
        ...style,
      }}
    >
      <style>{styleSheet}</style>

      {/* ── Preview pane ──────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          background: `radial-gradient(120% 80% at 50% 0%, rgba(168,85,247,0.08), transparent 60%), ${COLORS.bgSoft}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '70px 40px 80px',
          gap: 28,
          overflow: 'hidden',
        }}
      >
        <div className="qrm-ambient-a" />
        <div className="qrm-ambient-b" />

        {/* Header */}
        <div
          style={{
            position: 'absolute',
            top: 22,
            left: 26,
            right: 26,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            zIndex: 2,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: COLORS.textMuted,
                letterSpacing: 1.6,
                textTransform: 'uppercase',
                fontFamily: COLORS.mono,
              }}
            >
              QR Studio
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: COLORS.text,
                marginTop: 4,
                letterSpacing: -0.4,
                background: `linear-gradient(135deg, ${COLORS.text}, ${COLORS.accent2})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Design & export
            </div>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              padding: '6px 12px',
              background: 'rgba(52,211,153,0.1)',
              border: `1px solid rgba(52,211,153,0.3)`,
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              color: COLORS.success,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              fontFamily: COLORS.mono,
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: COLORS.success,
                boxShadow: `0 0 8px ${COLORS.success}`,
              }}
            />
            Live
          </div>
        </div>

        {/* QR card with ambient glow */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              position: 'absolute',
              inset: -30,
              background: `radial-gradient(circle, ${COLORS.accentSoft}, transparent 70%)`,
              filter: 'blur(20px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'relative',
              padding: 24,
              background: '#fff',
              borderRadius: 22,
              boxShadow:
                '0 4px 20px rgba(0,0,0,0.3), 0 30px 70px -15px rgba(0,0,0,0.5)',
            }}
          >
            <QRCode
              ref={ref}
              value={value || ' '}
              size={size}
              level={level}
              fgColor={fgColor}
              bgColor={bgColor}
              {...(eyeColor ? { eyeColor } : {})}
              shape={shape}
              cornerStyle={cornerStyle}
              eyeShape={eyeShape}
              margin={margin}
              moduleSpacing={moduleSpacing}
              {...(theme ? { theme } : {})}
              {...(animation !== 'none' ? { animation } : {})}
              {...(gradient ? { gradient } : {})}
              frame={frame}
              {...(ctaText
                ? {
                    label: ctaText,
                    labelStyle: ctaStyle,
                    labelPosition: ctaPosition,
                    ...(ctaColor ? { labelColor: ctaColor } : {}),
                    ...(ctaBackground ? { labelBackground: ctaBackground } : {}),
                  }
                : {})}
              {...(logo
                ? {
                    logo,
                    logoSize,
                    logoPadding,
                    logoShape,
                    logoMode,
                    logoPosition,
                    ...(logoBorderColor ? { logoBorderColor, logoBorderWidth } : {}),
                  }
                : {})}
            />
          </div>
        </div>

        {/* Format download bar */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              className="qrm-fmt-btn"
              onClick={() => download(fmt, { pixelSize: 1024 })}
              title={`Download .${fmt}`}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1.5V8M6 8L3 5M6 8L9 5M2 10.5H10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {fmt}
            </button>
          ))}
        </div>

        {/* Status strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 22,
            left: 26,
            right: 26,
            display: 'flex',
            justifyContent: 'center',
            gap: 14,
            fontSize: 10,
            color: COLORS.textSubtle,
            fontFamily: COLORS.mono,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            fontWeight: 600,
            zIndex: 2,
          }}
        >
          <span>{size}px</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>EC {level}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{shape}</span>
          {gradient ? (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: COLORS.accent }}>{gradient.type} grad</span>
            </>
          ) : null}
          {logo ? (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: COLORS.accent2 }}>logo</span>
            </>
          ) : null}
        </div>
      </div>

      {/* ── Controls pane ─────────────────────────────────────────────── */}
      <div
        style={{
          background: COLORS.bg,
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `1px solid ${COLORS.border}`,
        }}
      >
        {/* Tab bar */}
        <div
          style={{
            padding: '18px 18px 14px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            gap: 6,
            background: COLORS.bgSoft,
          }}
        >
          {(['content', 'design', 'colors', 'brand'] as TabKey[]).map((t) => (
            <button
              key={t}
              type="button"
              className="qrm-tab"
              data-active={tab === t}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div
          className="qrm-controls"
          style={{
            padding: '22px 20px 28px',
            overflowY: 'auto',
            maxHeight: 720,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            flex: 1,
          }}
        >
          {/* ─ Content tab ───────────────────────────────────────── */}
          {tab === 'content' ? (
            <>
              <Field label="Value">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="https://…"
                />
              </Field>
              <Field label="Size" hint={`${size} px`}>
                <input
                  type="range"
                  min={120}
                  max={640}
                  step={8}
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                />
              </Field>
              <Field label="Margin" hint={`${margin} mod`}>
                <input
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                />
              </Field>
              <Field label="Error correction" hint="data resilience">
                <ChipSelect
                  options={LEVELS}
                  value={level}
                  onChange={setLevel}
                  cols={4}
                />
              </Field>
              <Field label="Outer frame">
                <ChipSelect
                  options={['square', 'rounded'] as const}
                  value={frame}
                  onChange={setFrame}
                  cols={2}
                />
              </Field>
            </>
          ) : null}

          {/* ─ Design tab ────────────────────────────────────────── */}
          {tab === 'design' ? (
            <>
              <Field label="Theme preset">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8,
                  }}
                >
                  <ThemeChip
                    name=""
                    active={theme === ''}
                    onClick={() => setTheme('')}
                  />
                  {THEME_NAMES.map((t) => (
                    <ThemeChip
                      key={t}
                      name={t}
                      active={theme === t}
                      onClick={() => setTheme(t)}
                    />
                  ))}
                </div>
              </Field>
              <Field label="Module shape">
                <ChipSelect
                  options={MODULES}
                  value={shape}
                  onChange={setShape}
                  cols={4}
                  renderIcon={(s) => <MiniSvg>{SHAPE_SVG[s]}</MiniSvg>}
                />
              </Field>
              <Field label="Corner style">
                <ChipSelect
                  options={CORNERS}
                  value={cornerStyle}
                  onChange={setCornerStyle}
                  cols={5}
                  renderIcon={(c) => <MiniSvg>{CORNER_SVG[c]}</MiniSvg>}
                />
              </Field>
              <Field label="Eye shape">
                <ChipSelect
                  options={EYES}
                  value={eyeShape}
                  onChange={setEyeShape}
                  cols={5}
                  renderIcon={(e) => <MiniSvg>{EYE_SVG[e]}</MiniSvg>}
                />
              </Field>
              <Field label="Animation">
                <select
                  value={animation}
                  onChange={(e) => setAnimation(e.target.value as QRAnimation | 'none')}
                >
                  {ANIMATIONS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={`Module spacing: ${(moduleSpacing * 100).toFixed(0)}%`}>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={moduleSpacing}
                  onChange={(e) => setModuleSpacing(parseFloat(e.target.value))}
                  style={{ width: '100%', cursor: 'pointer' }}
                />
              </Field>
            </>
          ) : null}

          {/* ─ Colors tab ────────────────────────────────────────── */}
          {tab === 'colors' ? (
            <>
              <Row cols={3}>
                <ColorField label="Foreground" value={fgColor} onChange={setFgColor} />
                <ColorField label="Background" value={bgColor} onChange={setBgColor} />
                <ColorField label="Eye" value={eyeColor} onChange={setEyeColor} clearable />
              </Row>

              <div
                style={{
                  height: 1,
                  background: COLORS.border,
                  margin: '4px 0',
                }}
              />

              <Toggle label="Gradient fill" checked={useGradient} onChange={setUseGradient} />
              {useGradient ? (
                <>
                  <Field label="Gradient type">
                    <ChipSelect
                      options={['linear', 'radial', 'conic'] as const}
                      value={gradType}
                      onChange={(v) => setGradType(v as QRGradient['type'])}
                      cols={3}
                    />
                  </Field>
                  <Row cols={2}>
                    <ColorField
                      label="Color 1"
                      value={gradColor1}
                      onChange={setGradColor1}
                    />
                    <ColorField
                      label="Color 2"
                      value={gradColor2}
                      onChange={setGradColor2}
                    />
                  </Row>
                  <Field label="Rotation" hint={`${gradRotation}°`}>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={gradRotation}
                      onChange={(e) => setGradRotation(Number(e.target.value))}
                    />
                  </Field>
                  {/* Live gradient preview strip */}
                  <div
                    style={{
                      height: 24,
                      borderRadius: 8,
                      border: `1px solid ${COLORS.border}`,
                      background:
                        gradType === 'radial'
                          ? `radial-gradient(circle, ${gradColor1}, ${gradColor2})`
                          : gradType === 'conic'
                            ? `conic-gradient(from ${gradRotation}deg, ${gradColor1}, ${gradColor2}, ${gradColor1})`
                            : `linear-gradient(${gradRotation}deg, ${gradColor1}, ${gradColor2})`,
                    }}
                  />
                </>
              ) : null}
            </>
          ) : null}

          {/* ─ Brand (logo) tab ──────────────────────────────────── */}
          {tab === 'brand' ? (
            <>
              <Field label="Logo overlay">
                <label className="qrm-upload-zone">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3V15M12 3L7 8M12 3L17 8M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{logo ? 'Replace logo file' : 'Drop or pick logo'}</span>
                  <span style={{ fontSize: 10, color: COLORS.textSubtle }}>
                    PNG · SVG · JPG · WEBP · max 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                    onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)}
                    style={{ display: 'none' }}
                  />
                </label>
              </Field>

              <Field label="Or paste a URL">
                <input
                  type="url"
                  value={logo.startsWith('data:') ? '' : logo}
                  placeholder="https://…/logo.svg"
                  onChange={(e) => applyLogo(e.target.value)}
                />
              </Field>

              {logo ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: 10,
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background:
                          'repeating-conic-gradient(rgba(255,255,255,0.08) 0% 25%, rgba(255,255,255,0.02) 0% 50%) 50% / 8px 8px',
                        backgroundImage: `url(${logo})`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        border: `1px solid ${COLORS.border}`,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: COLORS.text,
                        }}
                      >
                        Logo attached
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: COLORS.textSubtle,
                          fontFamily: COLORS.mono,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {logo.startsWith('data:') ? 'uploaded file' : logo}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLogo('')}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${COLORS.border}`,
                        color: COLORS.danger,
                        fontSize: 11,
                        cursor: 'pointer',
                        fontWeight: 700,
                        padding: '6px 10px',
                        borderRadius: 8,
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  <Row>
                    <Field label="Size" hint={`${Math.round(logoSize * 100)}%`}>
                      <input
                        type="range"
                        min={0.1}
                        max={0.4}
                        step={0.01}
                        value={logoSize}
                        onChange={(e) => setLogoSize(Number(e.target.value))}
                      />
                    </Field>
                    <Field label="Padding" hint={`${logoPadding}`}>
                      <input
                        type="range"
                        min={0}
                        max={4}
                        step={0.5}
                        value={logoPadding}
                        onChange={(e) => setLogoPadding(Number(e.target.value))}
                      />
                    </Field>
                  </Row>

                  <Field label="Shape">
                    <ChipSelect
                      options={['square', 'rounded', 'circle'] as const}
                      value={logoShape}
                      onChange={(v) =>
                        setLogoShape(v as 'square' | 'rounded' | 'circle')
                      }
                      cols={3}
                    />
                  </Field>

                  <Field label="Mode">
                    <ChipSelect
                      options={['foreground', 'embedded', 'background'] as const}
                      value={logoMode}
                      onChange={(v) =>
                        setLogoMode(
                          v as 'foreground' | 'embedded' | 'background',
                        )
                      }
                      cols={3}
                    />
                  </Field>

                  {logoMode !== 'background' ? (
                    <Field label="Position">
                      <ChipSelect
                        options={['center', 'top', 'bottom', 'left', 'right'] as const}
                        value={logoPosition}
                        onChange={(v) =>
                          setLogoPosition(
                            v as 'center' | 'top' | 'bottom' | 'left' | 'right',
                          )
                        }
                        cols={5}
                      />
                    </Field>
                  ) : null}

                  <Row>
                    <ColorField
                      label="Border colour"
                      value={logoBorderColor}
                      onChange={setLogoBorderColor}
                      clearable
                    />
                    <Field label="Border width" hint={`${logoBorderWidth}`}>
                      <input
                        type="range"
                        min={0.1}
                        max={2}
                        step={0.1}
                        value={logoBorderWidth}
                        onChange={(e) => setLogoBorderWidth(Number(e.target.value))}
                      />
                    </Field>
                  </Row>
                </>
              ) : null}

              <Field label="Call to action" hint={ctaText ? undefined : 'none'}>
                <input
                  type="text"
                  value={ctaText}
                  maxLength={40}
                  placeholder="SCAN ME"
                  onChange={(e) => setCtaText(e.target.value)}
                />
              </Field>

              {ctaText ? (
                <>
                  <Field label="Label style">
                    <ChipSelect
                      options={['banner', 'pill', 'plain'] as const}
                      value={ctaStyle}
                      onChange={setCtaStyle}
                      cols={3}
                    />
                  </Field>
                  <Field label="Label position">
                    <ChipSelect
                      options={['bottom', 'top'] as const}
                      value={ctaPosition}
                      onChange={setCtaPosition}
                      cols={2}
                    />
                  </Field>
                  <Row>
                    <ColorField
                      label="Label text"
                      value={ctaColor}
                      onChange={setCtaColor}
                      clearable
                    />
                    {ctaStyle !== 'plain' ? (
                      <ColorField
                        label="Label fill"
                        value={ctaBackground}
                        onChange={setCtaBackground}
                        clearable
                      />
                    ) : null}
                  </Row>
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
