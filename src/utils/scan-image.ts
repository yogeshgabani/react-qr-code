import { loadJsQR } from './load-jsqr';

/** Anything `scanQRFromImage` can read a QR from. */
export type QRImageSource = Blob | string | HTMLImageElement | HTMLCanvasElement | ImageBitmap;

type Drawable = HTMLImageElement | HTMLCanvasElement | ImageBitmap;

// Phone photos are 12+ MP. jsQR is slow on those and often reads a downscaled
// copy better, so try a moderate size first, then a larger and a smaller one.
const TARGET_SIZES = [1024, 2048, 512];

function loadImage(url: string, crossOrigin: boolean): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load the image'));
    img.src = url;
  });
}

async function toDrawable(source: QRImageSource): Promise<{ image: Drawable; release: () => void }> {
  if (typeof source === 'string') {
    return { image: await loadImage(source, !source.startsWith('data:')), release: () => {} };
  }
  if (source instanceof Blob) {
    // createImageBitmap applies EXIF rotation, but some browsers reject SVG
    // blobs, so fall back to an <img>.
    if (typeof createImageBitmap === 'function') {
      try {
        const bitmap = await createImageBitmap(source);
        return { image: bitmap, release: () => bitmap.close() };
      } catch {
        // fall through
      }
    }
    const url = URL.createObjectURL(source);
    try {
      return { image: await loadImage(url, false), release: () => {} };
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  if (source instanceof HTMLImageElement && !source.complete) {
    await source.decode();
  }
  return { image: source, release: () => {} };
}

function sizeOf(image: Drawable): { width: number; height: number } {
  if (image instanceof HTMLImageElement) {
    return { width: image.naturalWidth, height: image.naturalHeight };
  }
  return { width: image.width, height: image.height };
}

/**
 * Read a QR code from an image: a `File` from `<input type="file">`, a `Blob`,
 * an image URL or data URI, an `<img>`, a `<canvas>` or an `ImageBitmap`.
 * Resolves the decoded text, or `null` when the image has no readable QR.
 * Reads light-on-dark codes too.
 */
export async function scanQRFromImage(source: QRImageSource): Promise<string | null> {
  if (typeof document === 'undefined') {
    throw new Error('scanQRFromImage can only be called in the browser');
  }
  const [jsQR, { image, release }] = await Promise.all([loadJsQR(), toDrawable(source)]);
  try {
    const { width, height } = sizeOf(image);
    if (!width || !height) return null;
    const longest = Math.max(width, height);
    const targets = [...new Set(TARGET_SIZES.map((t) => Math.min(t, longest)))];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas 2D context unavailable');

    for (const target of targets) {
      const w = Math.max(1, Math.round((width * target) / longest));
      const h = Math.max(1, Math.round((height * target) / longest));
      canvas.width = w;
      canvas.height = h;
      // Transparent pixels read as black; a white backdrop keeps dark-on-
      // transparent PNGs readable.
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(image, 0, 0, w, h);
      let pixels: Uint8ClampedArray;
      try {
        pixels = ctx.getImageData(0, 0, w, h).data;
      } catch {
        throw new Error(
          'The image is on another origin without CORS headers, so its pixels cannot be read. ' +
            'Pass it as a Blob or File instead.',
        );
      }
      const hit = jsQR(pixels, w, h, { inversionAttempts: 'attemptBoth' });
      if (hit) return hit.data;
    }
    return null;
  } finally {
    release();
  }
}
