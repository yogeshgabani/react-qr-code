import type { ReactNode } from 'react';

// ─── Module shapes (data cells) ─────────────────────────────────────────────

export type ModuleShape =
  | 'square'
  | 'rounded'
  | 'extra-rounded'
  | 'circle'
  | 'dot'
  | 'diamond'
  | 'hexagon'
  | 'star';

function hexagonPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + Math.PI / 6;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(' ');
}

function starPoints(cx: number, cy: number, outer: number, inner: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
  }
  return pts.join(' ');
}

/** Render a single 1x1 data module at module-unit coordinates (x, y). */
export function renderModule(
  shape: ModuleShape,
  x: number,
  y: number,
  key: string,
  spacing: number = 0,
): ReactNode {
  // spacing: 0 = no gap (full 1x1), 0.5 = maximum gap (0.5x0.5 center)
  const gap = Math.max(0, Math.min(spacing, 0.5));
  const offset = gap / 2;
  const size = 1 - gap;

  const cx = x + 0.5;
  const cy = y + 0.5;

  switch (shape) {
    case 'square':
      return <rect key={key} x={x + offset} y={y + offset} width={size} height={size} />;
    case 'rounded':
      return <rect key={key} x={x + offset} y={y + offset} width={size} height={size} rx={0.25 * size} ry={0.25 * size} />;
    case 'extra-rounded':
      return <rect key={key} x={x + offset} y={y + offset} width={size} height={size} rx={0.45 * size} ry={0.45 * size} />;
    case 'circle':
      return <circle key={key} cx={cx} cy={cy} r={0.5 * size} />;
    case 'dot':
      return <circle key={key} cx={cx} cy={cy} r={0.4 * size} />;
    case 'diamond':
      return (
        <polygon
          key={key}
          points={`${cx},${y + offset} ${x + 1 - offset},${cy} ${cx},${y + 1 - offset} ${x + offset},${cy}`}
        />
      );
    case 'hexagon':
      return <polygon key={key} points={hexagonPoints(cx, cy, 0.55 * size)} />;
    case 'star':
      return <polygon key={key} points={starPoints(cx, cy, 0.55 * size, 0.24 * size)} />;
  }
}

// ─── Corner styles (outer 7x7 ring of finder patterns) ──────────────────────

export type CornerStyle =
  | 'square'
  | 'rounded'
  | 'circle'
  | 'soft-rounded'
  | 'modern';

/** Outer ring of a finder pattern at (ox, oy). 7x7 dark with 5x5 hole. */
export function renderFinderCorner(
  style: CornerStyle,
  ox: number,
  oy: number,
  fgColor: string,
  bgColor: string,
  key: string,
): ReactNode {
  switch (style) {
    case 'square':
      return (
        <g key={key}>
          <rect x={ox} y={oy} width={7} height={7} fill={fgColor} />
          <rect x={ox + 1} y={oy + 1} width={5} height={5} fill={bgColor} />
        </g>
      );
    case 'rounded':
      return (
        <g key={key}>
          <rect x={ox} y={oy} width={7} height={7} rx={2} ry={2} fill={fgColor} />
          <rect x={ox + 1} y={oy + 1} width={5} height={5} rx={1.5} ry={1.5} fill={bgColor} />
        </g>
      );
    case 'soft-rounded':
      return (
        <g key={key}>
          <rect x={ox} y={oy} width={7} height={7} rx={1} ry={1} fill={fgColor} />
          <rect x={ox + 1} y={oy + 1} width={5} height={5} rx={0.75} ry={0.75} fill={bgColor} />
        </g>
      );
    case 'circle':
      return (
        <g key={key}>
          <circle cx={ox + 3.5} cy={oy + 3.5} r={3.5} fill={fgColor} />
          <circle cx={ox + 3.5} cy={oy + 3.5} r={2.5} fill={bgColor} />
        </g>
      );
    case 'modern':
      return (
        <g key={key}>
          <rect x={ox} y={oy} width={7} height={7} rx={3} ry={3} fill={fgColor} />
          <rect x={ox + 1} y={oy + 1} width={5} height={5} rx={2.5} ry={2.5} fill={bgColor} />
        </g>
      );
  }
}

// ─── Eye shapes (inner 3x3 dot of finder patterns) ──────────────────────────

export type EyeShape = 'square' | 'rounded' | 'circle' | 'diamond' | 'modern';

/** Inner pupil of a finder pattern. (ox, oy) is the top-left of the 7x7. */
export function renderFinderInner(
  shape: EyeShape,
  ox: number,
  oy: number,
  color: string,
  key: string,
): ReactNode {
  const cx = ox + 3.5;
  const cy = oy + 3.5;
  switch (shape) {
    case 'square':
      return <rect key={key} x={ox + 2} y={oy + 2} width={3} height={3} fill={color} />;
    case 'rounded':
      return (
        <rect
          key={key}
          x={ox + 2}
          y={oy + 2}
          width={3}
          height={3}
          rx={1}
          ry={1}
          fill={color}
        />
      );
    case 'circle':
    case 'modern':
      return <circle key={key} cx={cx} cy={cy} r={1.5} fill={color} />;
    case 'diamond':
      return (
        <polygon
          key={key}
          points={`${cx},${oy + 2} ${ox + 5},${cy} ${cx},${oy + 5} ${ox + 2},${cy}`}
          fill={color}
        />
      );
  }
}
