export type DownloadFormat = 'svg' | 'png' | 'jpg' | 'jpeg' | 'webp' | 'pdf';

export interface DownloadOptions {
  filename?: string;
  /** Pixel size for raster outputs (PNG/JPG/WEBP/PDF). Defaults to 1024. */
  pixelSize?: number;
  /** 0..1 quality for JPG and WEBP. */
  quality?: number;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function serializeSvg(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute('xmlns')) {
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  return new XMLSerializer().serializeToString(clone);
}

async function svgToRasterBlob(
  svg: SVGSVGElement,
  format: 'png' | 'jpg' | 'jpeg' | 'webp',
  pixelSize: number,
  quality?: number,
): Promise<Blob> {
  const svgStr = serializeSvg(svg);
  const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
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
    if (format === 'jpg' || format === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pixelSize, pixelSize);
    }
    ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
    const mime = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob returned null'))),
        mime,
        quality,
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
    reader.readAsDataURL(blob);
  });
}

export async function downloadQR(
  svg: SVGSVGElement,
  format: DownloadFormat,
  options: DownloadOptions = {},
): Promise<void> {
  if (!isBrowser()) {
    throw new Error('downloadQR can only be called in the browser');
  }
  const { filename = `qrcode.${format}`, pixelSize = 1024, quality } = options;

  if (format === 'svg') {
    const blob = new Blob([serializeSvg(svg)], { type: 'image/svg+xml;charset=utf-8' });
    triggerBlobDownload(blob, filename);
    return;
  }

  if (format === 'pdf') {
    const [{ jsPDF }, pngBlob] = await Promise.all([
      import('jspdf'),
      svgToRasterBlob(svg, 'png', pixelSize),
    ]);
    const dataUrl = await blobToDataURL(pngBlob);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [pixelSize, pixelSize],
      hotfixes: ['px_scaling'],
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, pixelSize, pixelSize);
    pdf.save(filename);
    return;
  }

  const blob = await svgToRasterBlob(svg, format, pixelSize, quality);
  triggerBlobDownload(blob, filename);
}
