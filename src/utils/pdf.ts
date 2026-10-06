// Minimal, dependency-free PDF writer. Supports exactly what QR exports need:
// pages with raster images (lossless Flate RGB or JPEG) and single-line
// Helvetica text. Replaces jsPDF, which pulled ~30 MB of transitive deps
// (html2canvas, dompurify, …) into every install.

export interface PdfImage {
  /** Pixel width of the image data. */
  width: number;
  /** Pixel height of the image data. */
  height: number;
  /** zlib-compressed 8-bit RGB pixels (FlateDecode) or a JPEG file (DCTDecode). */
  data: Uint8Array;
  filter: 'FlateDecode' | 'DCTDecode';
}

export interface PdfPage {
  /** Page width in points (1pt = 1/72 inch). */
  width: number;
  /** Page height in points. */
  height: number;
  /** Images placed with a top-left origin, in points. */
  images?: Array<{ image: PdfImage; x: number; y: number; width: number; height: number }>;
  /** Text runs; `y` is the baseline measured from the top of the page. */
  texts?: Array<{ text: string; x: number; y: number; size: number }>;
}

// Helvetica advance widths (1/1000 em) for ASCII 32..126, from the standard AFM.
// prettier-ignore
const HELVETICA_WIDTHS = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278,
  556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556,
  1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778,
  667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556,
  333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556,
  556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584,
];

/** Width of `text` in points when set in Helvetica at `size`. */
export function measureHelvetica(text: string, size: number): number {
  let units = 0;
  for (const ch of toWinAnsi(text)) {
    units += HELVETICA_WIDTHS[ch.charCodeAt(0) - 32] ?? 556;
  }
  return (units * size) / 1000;
}

/** Shorten `text` with an ellipsis so it fits within `maxWidth` points. */
export function fitHelvetica(text: string, size: number, maxWidth: number): string {
  if (measureHelvetica(text, size) <= maxWidth) return text;
  let out = text;
  while (out.length > 0 && measureHelvetica(`${out}...`, size) > maxWidth) {
    out = out.slice(0, -1);
  }
  return `${out}...`;
}

// The standard 14 fonts only cover WinAnsi. Keep printable Latin-1 and
// replace everything else so the content stream stays valid.
function toWinAnsi(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 63;
    out += (code >= 32 && code <= 126) || (code >= 160 && code <= 255) ? ch : '?';
  }
  return out;
}

function escapePdfString(text: string): string {
  return toWinAnsi(text).replace(/[\\()]/g, '\\$&');
}

// Content streams and dictionaries are built as strings whose chars are all
// < 256, so a byte-per-char conversion is exact.
function latin1(s: string): Uint8Array {
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i) & 0xff;
  return bytes;
}

function num(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(3).replace(/\.?0+$/, '');
}

/** Serialise pages into a complete PDF 1.4 file. */
export function buildPDF(pages: PdfPage[]): Uint8Array {
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;

  const push = (bytes: Uint8Array) => {
    chunks.push(bytes);
    length += bytes.length;
  };

  // Object numbers: 1 catalog, 2 page tree, 3 font, then per page
  // [page, content, ...images].
  const FONT_ID = 3;
  let nextId = 4;
  const layout = pages.map((page) => {
    const pageId = nextId++;
    const contentId = nextId++;
    const imageIds = (page.images ?? []).map(() => nextId++);
    return { page, pageId, contentId, imageIds };
  });

  const writeObject = (id: number, body: string, stream?: Uint8Array) => {
    offsets[id] = length;
    if (stream) {
      push(latin1(`${id} 0 obj\n${body.replace(/>>$/, `/Length ${stream.length}>>`)}\nstream\n`));
      push(stream);
      push(latin1('\nendstream\nendobj\n'));
    } else {
      push(latin1(`${id} 0 obj\n${body}\nendobj\n`));
    }
  };

  // Header; the binary comment marks the file as binary for transfer tools.
  push(latin1('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'));

  writeObject(1, '<</Type/Catalog/Pages 2 0 R>>');
  writeObject(
    2,
    `<</Type/Pages/Kids[${layout.map((l) => `${l.pageId} 0 R`).join(' ')}]/Count ${layout.length}>>`,
  );
  writeObject(FONT_ID, '<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>');

  for (const { page, pageId, contentId, imageIds } of layout) {
    const ops: string[] = [];
    (page.images ?? []).forEach((img, i) => {
      // PDF's origin is bottom-left; convert from top-left placement.
      const y = page.height - img.y - img.height;
      ops.push(`q ${num(img.width)} 0 0 ${num(img.height)} ${num(img.x)} ${num(y)} cm /Im${i} Do Q`);
    });
    for (const t of page.texts ?? []) {
      ops.push(
        `BT /F1 ${num(t.size)} Tf ${num(t.x)} ${num(page.height - t.y)} Td (${escapePdfString(t.text)}) Tj ET`,
      );
    }

    const xobjects = imageIds.map((id, i) => `/Im${i} ${id} 0 R`).join('');
    writeObject(
      pageId,
      `<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${num(page.width)} ${num(page.height)}]` +
        `/Resources<</Font<</F1 ${FONT_ID} 0 R>>/XObject<<${xobjects}>>>>/Contents ${contentId} 0 R>>`,
    );
    writeObject(contentId, '<<>>', latin1(ops.join('\n')));

    (page.images ?? []).forEach(({ image }, i) => {
      writeObject(
        imageIds[i]!,
        `<</Type/XObject/Subtype/Image/Width ${image.width}/Height ${image.height}` +
          `/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/${image.filter}>>`,
        image.data,
      );
    });
  }

  // Cross-reference table: every entry must be exactly 20 bytes.
  const xrefOffset = length;
  const xref = [`xref\n0 ${nextId}\n`, '0000000000 65535 f \n'];
  for (let id = 1; id < nextId; id++) {
    xref.push(`${String(offsets[id]).padStart(10, '0')} 00000 n \n`);
  }
  push(latin1(xref.join('')));
  push(latin1(`trailer\n<</Size ${nextId}/Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF\n`));

  const out = new Uint8Array(length);
  let pos = 0;
  for (const c of chunks) {
    out.set(c, pos);
    pos += c.length;
  }
  return out;
}

/** zlib-compress bytes with the platform CompressionStream (browsers + Node 18+). */
async function deflate(bytes: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new CompressionStream('deflate'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * Turn RGBA pixels into a lossless PDF image. Transparent pixels are
 * composited onto white, since PDF images here carry no alpha channel.
 */
export async function rgbaToPdfImage(
  rgba: Uint8ClampedArray | Uint8Array,
  width: number,
  height: number,
): Promise<PdfImage> {
  const rgb = new Uint8Array(width * height * 3);
  for (let src = 0, dst = 0; src < rgba.length; src += 4, dst += 3) {
    const a = rgba[src + 3]! / 255;
    rgb[dst] = Math.round(rgba[src]! * a + 255 * (1 - a));
    rgb[dst + 1] = Math.round(rgba[src + 1]! * a + 255 * (1 - a));
    rgb[dst + 2] = Math.round(rgba[src + 2]! * a + 255 * (1 - a));
  }
  return { width, height, data: await deflate(rgb), filter: 'FlateDecode' };
}

/** Lossless when CompressionStream exists, otherwise falls back to a high-quality JPEG. */
export async function canvasToPdfImage(canvas: HTMLCanvasElement): Promise<PdfImage> {
  const { width, height } = canvas;
  if (typeof CompressionStream !== 'undefined') {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    return rgbaToPdfImage(ctx.getImageData(0, 0, width, height).data, width, height);
  }
  // JPEG has no alpha: flatten onto white first or transparent areas turn black.
  const flat = document.createElement('canvas');
  flat.width = width;
  flat.height = height;
  const flatCtx = flat.getContext('2d');
  if (!flatCtx) throw new Error('Canvas 2D context unavailable');
  flatCtx.fillStyle = '#ffffff';
  flatCtx.fillRect(0, 0, width, height);
  flatCtx.drawImage(canvas, 0, 0);
  const jpeg = await new Promise<Blob>((resolve, reject) => {
    flat.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob returned null'))),
      'image/jpeg',
      0.95,
    );
  });
  return { width, height, data: new Uint8Array(await jpeg.arrayBuffer()), filter: 'DCTDecode' };
}
