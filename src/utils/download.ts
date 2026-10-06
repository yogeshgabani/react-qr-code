import { buildPDF, canvasToPdfImage } from './pdf';

export type DownloadFormat = 'svg' | 'png' | 'jpg' | 'jpeg' | 'webp' | 'pdf';
export type RasterFormat = 'png' | 'jpg' | 'jpeg' | 'webp';

export interface DownloadOptions {
  filename?: string;
  /** Pixel size for raster outputs (PNG/JPG/WEBP/PDF). Defaults to 1024. */
  pixelSize?: number;
  /** 0..1 quality for JPG and WEBP. */
  quality?: number;
}

export interface ShareOptions {
  /** File name of the shared image. Defaults to `qrcode.png`. */
  filename?: string;
  /** Pixel size of the shared PNG. Defaults to 1024. */
  pixelSize?: number;
  title?: string;
  text?: string;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function assertBrowser(fn: string): void {
  if (!isBrowser()) throw new Error(`${fn} can only be called in the browser`);
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoking synchronously can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  return new XMLSerializer().serializeToString(clone);
}

/** Rasterise an SVG element onto a square canvas of `pixelSize` px. */
export async function svgToCanvas(
  svg: SVGSVGElement,
  pixelSize: number,
  background?: string,
): Promise<HTMLCanvasElement> {
  const svgBlob = new Blob([serializeSvg(svg)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('Failed to load SVG image for rasterisation'));
      i.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = pixelSize;
    canvas.height = pixelSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, pixelSize, pixelSize);
    }
    ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: RasterFormat,
  quality?: number,
): Promise<Blob> {
  const mime = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob returned null'))),
      mime,
      quality,
    );
  });
}

async function svgToRasterBlob(
  svg: SVGSVGElement,
  format: RasterFormat,
  pixelSize: number,
  quality?: number,
): Promise<Blob> {
  // JPEG has no alpha channel, so give it a white backdrop.
  const background = format === 'jpg' || format === 'jpeg' ? '#ffffff' : undefined;
  return canvasToBlob(await svgToCanvas(svg, pixelSize, background), format, quality);
}

/** Render an SVG QR into a single-page PDF sized to `pixelSize` CSS px. */
export async function svgToPdfBlob(svg: SVGSVGElement, pixelSize = 1024): Promise<Blob> {
  const image = await canvasToPdfImage(await svgToCanvas(svg, pixelSize));
  const pt = pixelSize * 0.75; // 96 CSS px per inch → 72 pt per inch
  const pdf = buildPDF([
    { width: pt, height: pt, images: [{ image, x: 0, y: 0, width: pt, height: pt }] },
  ]);
  return new Blob([pdf as BlobPart], { type: 'application/pdf' });
}

export async function downloadQR(
  svg: SVGSVGElement,
  format: DownloadFormat,
  options: DownloadOptions = {},
): Promise<void> {
  assertBrowser('downloadQR');
  const { filename = `qrcode.${format}`, pixelSize = 1024, quality } = options;

  if (format === 'svg') {
    const blob = new Blob([serializeSvg(svg)], { type: 'image/svg+xml;charset=utf-8' });
    triggerBlobDownload(blob, filename);
    return;
  }

  if (format === 'pdf') {
    triggerBlobDownload(await svgToPdfBlob(svg, pixelSize), filename);
    return;
  }

  const blob = await svgToRasterBlob(svg, format, pixelSize, quality);
  triggerBlobDownload(blob, filename);
}

/**
 * Copy the QR to the clipboard as a PNG image. Call it from a click handler:
 * browsers only allow clipboard writes during a user gesture.
 */
export async function copyQR(
  svg: SVGSVGElement,
  options: { pixelSize?: number } = {},
): Promise<void> {
  assertBrowser('copyQR');
  if (typeof ClipboardItem === 'undefined' || !navigator.clipboard?.write) {
    throw new Error('Copying images is not supported in this browser');
  }
  // Pass the Blob as a promise: Safari drops the user gesture if we await first.
  const png = svgToRasterBlob(svg, 'png', options.pixelSize ?? 1024);
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
}

/** True when the Web Share API can share image files (mostly mobile browsers). */
export function canShareQR(): boolean {
  if (!isBrowser() || typeof navigator.canShare !== 'function') return false;
  try {
    const probe = new File([new Uint8Array(1)], 'qrcode.png', { type: 'image/png' });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/**
 * Open the native share sheet with the QR as a PNG. Resolves `false` when
 * sharing isn't supported or the user cancels, `true` once shared.
 */
export async function shareQR(svg: SVGSVGElement, options: ShareOptions = {}): Promise<boolean> {
  assertBrowser('shareQR');
  if (!canShareQR()) return false;
  const { filename = 'qrcode.png', pixelSize = 1024, title, text } = options;
  const blob = await svgToRasterBlob(svg, 'png', pixelSize);
  const file = new File([blob], filename, { type: 'image/png' });
  try {
    await navigator.share({ files: [file], title, text });
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return false;
    throw e;
  }
}
