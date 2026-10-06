import type { CSSProperties, ReactNode } from 'react';
// The repo's CHANGELOG.md is the single source of truth: add a release there
// and this tab picks it up.
import changelog from '../../../CHANGELOG.md?raw';
import { cardDark, pill, sectionHeading, subtle, tokens } from '../styles';

interface Section {
  title: string | null;
  items: string[];
}

interface Release {
  version: string;
  date?: string;
  sections: Section[];
}

/** Parse the subset of Markdown CHANGELOG.md uses: `## version - date`, `### Section`, `- item`. */
function parseChangelog(md: string): Release[] {
  const releases: Release[] = [];
  let release: Release | undefined;
  let section: Section | undefined;
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trimEnd();
    let m = /^##\s+\[?v?([^\]\s]+)\]?(?:\s+[-–—]\s+(.+))?$/.exec(line);
    if (m) {
      release = { version: m[1]!, date: m[2]?.trim(), sections: [] };
      releases.push(release);
      section = undefined;
      continue;
    }
    if (!release) continue;
    m = /^###\s+(.+)$/.exec(line);
    if (m) {
      section = { title: m[1]!, items: [] };
      release.sections.push(section);
      continue;
    }
    m = /^\s*[-*]\s+(.+)$/.exec(line);
    if (m) {
      if (!section) {
        section = { title: null, items: [] };
        release.sections.push(section);
      }
      section.items.push(m[1]!);
      continue;
    }
    // Indented continuation of the previous bullet.
    if (line.trim() && /^\s{2,}/.test(raw) && section?.items.length) {
      section.items[section.items.length - 1] += ` ${line.trim()}`;
    }
  }
  return releases;
}

const RELEASES = parseChangelog(changelog);

const SECTION_COLORS: Record<string, string> = {
  added: tokens.success,
  changed: tokens.accent,
  fixed: tokens.warning,
  removed: tokens.danger,
  deprecated: tokens.danger,
  security: tokens.danger,
};

const codeStyle: CSSProperties = {
  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
  fontSize: '0.88em',
  padding: '1px 6px',
  borderRadius: 5,
  background: 'color-mix(in srgb, currentColor 10%, transparent)',
  whiteSpace: 'nowrap',
};

/** Render `code`, **bold** and [links](url) inside a changelog line. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} style={{ color: tokens.text }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} style={codeStyle}>
              {part.slice(1, -1)}
            </code>
          );
        }
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          return (
            <a key={i} href={link[2]} target="_blank" rel="noreferrer" style={{ color: tokens.accent }}>
              {link[1]}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? date
    : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ReleaseCard({ release, latest }: { release: Release; latest: boolean }) {
  return (
    <article style={{ position: 'relative', paddingLeft: 30 }}>
      {/* Timeline dot */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          top: 26,
          width: 14,
          height: 14,
          borderRadius: 999,
          background: latest ? 'linear-gradient(135deg,#a855f7,#22d3ee)' : tokens.bgCardSolid,
          border: `2px solid ${latest ? 'transparent' : tokens.borderBright}`,
          boxShadow: latest ? '0 0 0 4px rgba(168,85,247,0.18)' : 'none',
        }}
      />
      <div style={{ ...cardDark, gap: 18, padding: '20px 22px' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h3
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: -0.5,
              background: 'linear-gradient(135deg,#a855f7,#22d3ee)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            v{release.version}
          </h3>
          {latest ? (
            <span
              style={{
                ...pill,
                color: tokens.success,
                borderColor: 'color-mix(in srgb, var(--success) 45%, transparent)',
                background: 'color-mix(in srgb, var(--success) 12%, transparent)',
              }}
            >
              Latest
            </span>
          ) : null}
          {release.date ? (
            <span style={{ color: tokens.textMuted, fontSize: 13 }}>{formatDate(release.date)}</span>
          ) : null}
          <a
            href={`https://www.npmjs.com/package/react-qr-master/v/${release.version}`}
            target="_blank"
            rel="noreferrer"
            style={{ marginLeft: 'auto', color: tokens.textMuted, fontSize: 13, textDecoration: 'none' }}
          >
            npm ↗
          </a>
        </header>

        {release.sections.map((section, i) => {
          const color = SECTION_COLORS[section.title?.toLowerCase() ?? ''] ?? tokens.primary;
          return (
            <section key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {section.title ? (
                <span
                  style={{
                    ...pill,
                    alignSelf: 'flex-start',
                    color,
                    borderColor: `color-mix(in srgb, ${color} 45%, transparent)`,
                    background: `color-mix(in srgb, ${color} 12%, transparent)`,
                  }}
                >
                  {section.title} · {section.items.length}
                </span>
              ) : null}
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {section.items.map((item, j) => (
                  <li key={j} style={{ color: tokens.textMuted, fontSize: 14, lineHeight: 1.6 }}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </article>
  );
}

export function ChangelogTab() {
  return (
    <div>
      <h2 style={sectionHeading}>Release history</h2>
      <p style={subtle}>
        Every release of <code style={codeStyle}>react-qr-master</code>, newest first. Upgrade with{' '}
        <code style={codeStyle}>npm install react-qr-master@latest</code>. The full file is{' '}
        <a
          href="https://github.com/yogeshgabani/react-qr-code/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noreferrer"
          style={{ color: tokens.accent }}
        >
          CHANGELOG.md on GitHub
        </a>
        .
      </p>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 880 }}>
        {/* Timeline rail */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 6,
            top: 30,
            bottom: 30,
            width: 2,
            borderRadius: 2,
            background: `linear-gradient(180deg, #a855f7, ${tokens.border})`,
          }}
        />
        {RELEASES.map((release, i) => (
          <ReleaseCard key={release.version} release={release} latest={i === 0} />
        ))}
      </div>
    </div>
  );
}
