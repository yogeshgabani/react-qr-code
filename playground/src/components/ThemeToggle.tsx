import { useTheme } from '../ThemeContext';
import { tokens } from '../styles';
import { Icon } from './Icon';

interface ThemeToggleProps {
  /** Full-width labelled button (for the sidebar) vs. a compact square (top bar). */
  wide?: boolean;
  size?: number;
}

export function ThemeToggle({ wide = false, size = 40 }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  // Show the destination: in dark mode offer the sun (→ light), and vice-versa.
  const icon = isDark ? 'sun' : 'moon';
  const label = isDark ? 'Light mode' : 'Dark mode';

  if (wide) {
    return (
      <button
        aria-label={label}
        title={label}
        onClick={toggleTheme}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '10px 12px',
          borderRadius: 10,
          border: `1px solid ${tokens.border}`,
          background: tokens.bgCard,
          color: tokens.text,
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = tokens.bgCardHover;
          e.currentTarget.style.borderColor = tokens.borderBright;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = tokens.bgCard;
          e.currentTarget.style.borderColor = tokens.border;
        }}
      >
        <Icon name={icon} size={18} />
        <span style={{ flex: 1, textAlign: 'left' }}>{label}</span>
      </button>
    );
  }

  return (
    <button
      aria-label={label}
      title={label}
      onClick={toggleTheme}
      style={{
        display: 'grid',
        placeItems: 'center',
        width: size,
        height: size,
        borderRadius: 10,
        border: `1px solid ${tokens.border}`,
        background: tokens.bgCard,
        color: tokens.text,
        cursor: 'pointer',
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.45)} />
    </button>
  );
}
