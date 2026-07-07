import { useEffect, useRef, useState } from 'react';
import { tokens } from '../styles';
import { Icon } from './Icon';

/**
 * Site stats strip — Last Updated / Total Hits / Total Visitors.
 *
 * The playground has no backend, so counts are tracked in localStorage
 * (per browser, same approach as the Analytics tab). A seeded base keeps a
 * fresh browser looking populated; real visits increment on top of it.
 */
const BASE_HITS = 200;
const BASE_VISITORS = 30;
const LAST_UPDATED = 'May 28, 2026';

// Guard so counting happens once per page load (React StrictMode double-mounts effects in dev).
let hasCounted = false;

function readCounts() {
  try {
    // Every mount is a hit.
    const hits = Number(localStorage.getItem('rqm_hits') || '0') + 1;
    localStorage.setItem('rqm_hits', String(hits));

    // A visitor is counted only once per browser.
    let visitors = Number(localStorage.getItem('rqm_visitors') || '0');
    if (!localStorage.getItem('rqm_visited')) {
      visitors += 1;
      localStorage.setItem('rqm_visitors', String(visitors));
      localStorage.setItem('rqm_visited', '1');
    }
    return { hits: BASE_HITS + hits, visitors: BASE_VISITORS + visitors };
  } catch {
    return { hits: BASE_HITS, visitors: BASE_VISITORS };
  }
}

/** Animate a number from 0 → target with an ease-out curve. */
function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target <= 0) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint,
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return isMobile;
}

export function LiveStats() {
  const isMobile = useIsMobile(768);
  const [counts, setCounts] = useState({ hits: BASE_HITS, visitors: BASE_VISITORS });
  const started = useRef(false);

  useEffect(() => {
    if (started.current || hasCounted) {
      setCounts(readCountsReadOnly());
      return;
    }
    started.current = true;
    hasCounted = true;
    setCounts(readCounts());
  }, []);

  const hits = useCountUp(counts.hits);
  const visitors = useCountUp(counts.visitors);

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: isMobile ? '16px 18px' : '20px 24px',
    borderRadius: 16,
    border: `1px solid ${tokens.border}`,
    background:
      'linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(34,211,238,0.03) 100%)',
    minWidth: 0,
  } as const;

  const iconBox = (from: string, to: string, iconColor: string) =>
    ({
      flex: '0 0 auto',
      width: 46,
      height: 46,
      borderRadius: 12,
      display: 'grid',
      placeItems: 'center',
      color: iconColor,
      background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
      border: `1px solid ${tokens.border}`,
    }) as const;

  const label = {
    fontSize: 10.5,
    fontWeight: 700,
    color: tokens.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  } as const;

  const value = {
    marginTop: 4,
    fontSize: isMobile ? 22 : 26,
    fontWeight: 900,
    color: tokens.text,
    letterSpacing: -0.5,
  } as const;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? 12 : 20,
        maxWidth: 1100,
        margin: '0 auto',
      }}
    >
      {/* Last Updated */}
      <div style={cardStyle}>
        <div style={iconBox('rgba(168,85,247,0.25)', 'rgba(124,58,237,0.12)', '#c4b5fd')}>
          <Icon name="calendar" size={22} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={label}>Last Updated</div>
          <div style={value}>{LAST_UPDATED}</div>
        </div>
      </div>

      {/* Total Hits */}
      <div style={cardStyle}>
        <div style={iconBox('rgba(34,211,238,0.25)', 'rgba(14,165,233,0.12)', '#67e8f9')}>
          <Icon name="eye" size={22} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={label}>Total Hits</div>
          <div style={value}>{hits.toLocaleString()}</div>
        </div>
      </div>

      {/* Total Visitors */}
      <div style={cardStyle}>
        <div style={iconBox('rgba(52,211,153,0.25)', 'rgba(16,185,129,0.12)', '#6ee7b7')}>
          <Icon name="users" size={22} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={label}>
            Total Visitors
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '2px 8px',
                borderRadius: 999,
                background: 'rgba(52,211,153,0.14)',
                border: '1px solid rgba(52,211,153,0.4)',
                color: tokens.success,
                fontSize: 9,
                letterSpacing: 0.8,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: tokens.success,
                  boxShadow: `0 0 8px ${tokens.success}`,
                  animation: 'rqmPulse 1.4s ease-in-out infinite',
                }}
              />
              LIVE
            </span>
          </div>
          <div style={{ ...value, color: tokens.success }}>{visitors.toLocaleString()}</div>
        </div>
      </div>

      <style>{`
        @keyframes rqmPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}

/** Re-read counts without incrementing (used on StrictMode's second mount). */
function readCountsReadOnly() {
  try {
    const hits = Number(localStorage.getItem('rqm_hits') || '0');
    const visitors = Number(localStorage.getItem('rqm_visitors') || '0');
    return { hits: BASE_HITS + hits, visitors: BASE_VISITORS + visitors };
  } catch {
    return { hits: BASE_HITS, visitors: BASE_VISITORS };
  }
}
