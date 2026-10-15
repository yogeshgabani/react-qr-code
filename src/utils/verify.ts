import { svgToCanvas } from './download';
import { loadJsQR, type JsQR } from './load-jsqr';

export interface VerifyOptions {
  /** The value the QR should decode to. When set, `ok` also requires a match. */
  expected?: string;
  /** Base raster size used for decoding. Defaults to 400px, close to what a phone camera sees. */
  pixelSize?: number;
}

export interface VerifyResult {
  /** True when the QR decodes with normal colours (and matches `expected`, if given). */
  ok: boolean;
  /** Decoded text, or `null` when nothing could be read. */
  data: string | null;
  /** Whether `data` equals `expected`; `null` when no `expected` was passed. */
  matches: boolean | null;
  /**
   * Share of simulated viewing conditions (sizes × camera blur) that decoded,
   * 0..1. Plain dark-on-light codes score close to 1; under 0.5 is fragile.
   */
  score: number;
  /** Readable only with colours inverted (light modules on dark). Some scanner apps can't read these. */
  inverted: boolean;
  /** Human-readable reasons when the result is not a clean pass. */
  warnings: string[];
}

// Each view renders the QR at a size and blur (in module widths). A little blur
// mimics camera optics: it merges dot / diamond / star modules the way a phone
// sees them, which a sharp render hides from jsQR.
const SCALES = [0.75, 1, 1.5];
const BLURS = [0, 0.25, 0.4];

function readPixels(source: HTMLCanvasElement, blurPx: number): Uint8ClampedArray {
  const { width, height } = source;
  let canvas = source;
  if (blurPx > 0) {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.filter = `blur(${blurPx}px)`;
    ctx.drawImage(source, 0, 0);
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  return ctx.getImageData(0, 0, width, height).data;
}

interface View {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
}

function decodeAll(
  jsQR: JsQR,
  views: View[],
  inversionAttempts: 'dontInvert' | 'invertFirst',
): string[] {
  const found: string[] = [];
  for (const { pixels, width, height } of views) {
    const hit = jsQR(pixels, width, height, { inversionAttempts });
    if (hit) found.push(hit.data);
  }
  return found;
}

/**
 * Check that a rendered QR actually scans by decoding it with jsQR under
 * several simulated viewing conditions. Heavy styling (low contrast, big
 * logos, wide module spacing) can produce codes that look fine but fail on
 * real devices; run this after changing the design.
 */
export async function verifyQR(
  svg: SVGSVGElement,
  options: VerifyOptions = {},
): Promise<VerifyResult> {
  const { expected, pixelSize = 400 } = options;
  // The SVG's viewBox is measured in modules (quiet zone and label included).
  const moduleCount = svg.viewBox?.baseVal?.width || 41;
  const jsQR = await loadJsQR();

  const views: View[] = [];
  for (const scale of SCALES) {
    const size = Math.round(pixelSize * scale);
    const sharp = await svgToCanvas(svg, size, '#ffffff');
    const { width, height } = sharp;
    for (const blur of BLURS) {
      views.push({ pixels: readPixels(sharp, (blur * size) / moduleCount), width, height });
    }
  }

  const normal = decodeAll(jsQR, views, 'dontInvert');
  // Not 'onlyInvert': jsQR 1.4 crashes on it for every image.
  const invertedHits = normal.length ? [] : decodeAll(jsQR, views, 'invertFirst');

  const data = normal[0] ?? invertedHits[0] ?? null;
  const inverted = !normal.length && invertedHits.length > 0;
  const score = Math.round((normal.length / views.length) * 100) / 100;
  const matches = expected === undefined || data === null ? null : data === expected;

  const warnings: string[] = [];
  if (data === null) {
    warnings.push(
      'QR could not be decoded. Increase contrast, reduce logoSize or moduleSpacing, ' +
        'use a simpler shape, or raise the error-correction level.',
    );
  } else if (inverted) {
    warnings.push(
      'QR only decodes with inverted colours (light on dark). Recent iOS/Android cameras read these, ' +
        'but some scanner apps do not; dark modules on a light background are safest.',
    );
  } else if (score < 0.5) {
    warnings.push(
      `QR decodes in only ${Math.round(score * 100)}% of simulated conditions and may fail on some phones. ` +
        'Increase contrast or use a simpler shape.',
    );
  }
  if (matches === false) {
    warnings.push('Decoded value does not match the expected value.');
  }

  return {
    ok: normal.length > 0 && matches !== false,
    data,
    matches,
    score,
    inverted,
    warnings,
  };
}
