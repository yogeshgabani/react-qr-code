import { useEffect, useLayoutEffect, useRef, useState } from 'react';
// Fallback for "Last Updated" until npm answers (or if it can't be reached).
import changelog from '../../../CHANGELOG.md?raw';
import { tokens } from '../styles';
import { Icon } from './Icon';

/**
 * Site stats strip — Last Updated / npm Downloads / Total Hits / Total Visitors.
 *
 * The latest version, its publish date and download counts come live from the
 * npm registry and api.npmjs.org (both CORS-enabled, no key).
 * The playground has no backend, so hits and visitors are tracked in
 * localStorage (per browser, same approach as the Analytics tab). A seeded
 * base keeps a fresh browser looking populated; real visits increment on top.
 */
const BASE_HITS = 200;
const BASE_VISITORS = 30;

const NPM_PACKAGE = 'react-qr-master';
const DOWNLOADS_API = 'https://api.npmjs.org/downloads/point';

/** Newest dated release in CHANGELOG.md, e.g. `## 0.2.0 - 2026-10-06`. */
const CHANGELOG_RELEASE = /^## (\d\S*) - (\d{4}-\d{2}-\d{2})/m.exec(changelog);

interface NpmStats {
  version: string;
  publishedAt: string;
  total: number;
  lastWeek: number;
  /** Last day npm has counted; its stats lag a day or two behind. */
  through: string;
}

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`${url} returned ${res.status}`);
  return (await res.json()) as T;
}

async function fetchNpmStats(signal: AbortSignal): Promise<NpmStats> {
  type Point = { downloads: number; end: string };
  const [doc, week] = await Promise.all([
    getJson<{ 'dist-tags': { latest: string }; time: Record<string, string> }>(
      `https://registry.npmjs.org/${NPM_PACKAGE}`,
      signal,
    ),
    getJson<Point>(`${DOWNLOADS_API}/last-week/${NPM_PACKAGE}`, signal),
  ]);

  // The downloads API caps one range at 18 months, so the all-time total is
  // summed a year at a time from the first publish.
  const day = (d: Date) => d.toISOString().slice(0, 10);
  const today = new Date();
  const periods: string[] = [];
  for (let start = new Date(doc.time.created!); start <= today; ) {
    const next = new Date(start);
    next.setUTCFullYear(next.getUTCFullYear() + 1);
    const end = new Date(Math.min(next.getTime() - 86_400_000, today.getTime()));
    periods.push(`${day(start)}:${day(end)}`);
    start = next;
  }
  const years = await Promise.all(
    periods.map((period) => getJson<Point>(`${DOWNLOADS_API}/${period}/${NPM_PACKAGE}`, signal)),
  );

  const version = doc['dist-tags'].latest;
  return {
    version,
    publishedAt: doc.time[version] ?? doc.time.modified!,
    total: years.reduce((sum, y) => sum + y.downloads, 0),
    lastWeek: week.downloads,
    through: week.end,
  };
}

/** "2026-10-07" → "Oct 7, 2026", read as UTC so a bare date never shifts a day. */
function formatDate(iso: string, withYear = true) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: withYear ? 'numeric' : undefined,
    timeZone: 'UTC',
  });
}

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

/**
 * Width of the strip itself rather than the viewport: on desktop the sidebar
 * takes 260px, so the same screen can fit four cards or only two.
 */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => entry && setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

export function LiveStats() {
  const [gridRef, width] = useWidth<HTMLDivElement>();
  const columns = width >= 1080 ? 4 : width >= 520 ? 2 : 1;
  const isMobile = columns === 1;
  const compact = columns === 4;
  const [counts, setCounts] = useState({ hits: BASE_HITS, visitors: BASE_VISITORS });
  const [npm, setNpm] = useState<NpmStats | 'error' | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchNpmStats(ctrl.signal).then(setNpm, () => {
      if (!ctrl.signal.aborted) setNpm('error');
    });
    return () => ctrl.abort();
  }, []);

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
  const downloads = useCountUp(npm && npm !== 'error' ? npm.total : 0);

  const updated =
    npm && npm !== 'error'
      ? { date: formatDate(npm.publishedAt), hint: `v${npm.version} on npm` }
      : CHANGELOG_RELEASE
        ? { date: formatDate(CHANGELOG_RELEASE[2]!), hint: `v${CHANGELOG_RELEASE[1]} · from CHANGELOG` }
        : { date: '—', hint: `v${__PKG_VERSION__}` };

  const cardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: compact ? 14 : 16,
    padding: isMobile ? '16px 18px' : compact ? '20px' : '20px 24px',
    borderRadius: 16,
    border: `1px solid ${tokens.border}`,
    background:
      'linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(34,211,238,0.03) 100%)',
    minWidth: 0,
  } as const;

  const iconBox = (from: string, to: string, iconColor: string) =>
    ({
      flex: '0 0 auto',
      width: compact ? 42 : 46,
      height: compact ? 42 : 46,
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
    fontSize: isMobile || compact ? 22 : 26,
    fontWeight: 900,
    color: tokens.text,
    letterSpacing: -0.5,
    whiteSpace: 'nowrap',
  } as const;

  const hint = {
    marginTop: 4,
    fontSize: 12,
    color: tokens.textSubtle,
  } as const;

  return (
    <div
      ref={gridRef}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: isMobile ? 12 : compact ? 16 : 20,
        maxWidth: 1240,
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
          <div style={value}>{updated.date}</div>
          <div style={hint}>{updated.hint}</div>
        </div>
      </div>

      {/* npm Downloads */}
      <div style={cardStyle}>
        <div style={iconBox('rgba(251,191,36,0.25)', 'rgba(245,158,11,0.12)', '#fcd34d')}>
          <Icon name="download" size={22} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={label}>npm Downloads</div>
          <div style={value}>
            {npm && npm !== 'error' ? downloads.toLocaleString() : '—'}
          </div>
          <div style={hint}>
            {npm === null
              ? 'Fetching from npm…'
              : npm === 'error'
                ? 'npm stats unavailable'
                : `${npm.lastWeek.toLocaleString()} last 7 days · through ${formatDate(npm.through, false)}`}
          </div>
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
