import { QRCode, THEMES, type QRThemeName } from 'react-qr-master';
import { card, cardLabel, grid, sectionHeading, subtle } from '../styles';

const NAMES = Object.keys(THEMES) as QRThemeName[];

export function ThemesTab() {
  return (
    <div>
      <h2 style={sectionHeading}>10 built-in themes</h2>
      <p style={subtle}>
        Pass <code>theme="..."</code> to apply. Individual props (fgColor, shape, etc.) override the
        preset.
      </p>
      <div style={grid}>
        {NAMES.map((theme) => (
          <div style={card} className="qrm-card" key={theme}>
            <p style={cardLabel}>{theme}</p>
            <QRCode value={`https://example.com/${theme}`} size={170} theme={theme} />
          </div>
        ))}
      </div>
    </div>
  );
}
