import { useCallback, useMemo, useRef, useState, type CSSProperties } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';
import { parseCSVRows, parseJSONRows, type BatchRow } from '../../utils/batch-rows';
import { canvasToBlob, svgToCanvas, triggerBlobDownload } from '../../utils/download';
import { buildPDF, canvasToPdfImage, fitHelvetica, measureHelvetica, type PdfPage } from '../../utils/pdf';
import { buildZip, uniqueFileName, type ZipEntry } from '../../utils/zip';

export type { BatchRow } from '../../utils/batch-rows';

export interface QRBatchGeneratorProps {
  /** Initial rows. */
  initialRows?: BatchRow[];
  /** Default QR options applied to every QR in the batch. */
  qrOptions?: Omit<QRCodeProps, 'value'>;
  /** Pixel size used when exporting raster formats. Defaults 512. */
  exportPixelSize?: number;
  /** Container style overrides. */
  className?: string;
  style?: CSSProperties;
}

/** Render a QR off-screen and rasterise it. */
async function renderQRToCanvas(
  value: string,
  options: Omit<QRCodeProps, 'value'> | undefined,
  pixelSize: number,
): Promise<HTMLCanvasElement> {
  const [{ createRoot }, { flushSync }] = await Promise.all([
    import('react-dom/client'),
    import('react-dom'),
  ]);
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    // flushSync commits synchronously, so the <svg> exists right after.
    flushSync(() => {
      root.render(<QRCode value={value} {...(options ?? {})} size={pixelSize} />);
    });
    const svg = container.querySelector('svg');
    if (!svg) throw new Error('Failed to render QR for batch export');
    return await svgToCanvas(svg, pixelSize);
  } finally {
    root.unmount();
    container.remove();
  }
}

// A4 portrait in points, 3 columns × 4 rows per page.
const A4 = { width: 595.28, height: 841.89 };
const PDF_MARGIN = 36;
const PDF_GAP = 18;
const PDF_COLS = 3;
const PDF_LABEL_SIZE = 9;
const PDF_LABEL_SPACE = 16;

function batchLabel(row: BatchRow): string {
  return row.label ?? row.id ?? row.value;
}

export function QRBatchGenerator({
  initialRows = [],
  qrOptions,
  exportPixelSize = 512,
  className,
  style,
}: QRBatchGeneratorProps) {
  const [rows, setRows] = useState<BatchRow[]>(initialRows);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = useCallback(async (file: File) => {
    setError(null);
    try {
      const text = await file.text();
      const ext = file.name.split('.').pop()?.toLowerCase();
      const parsed = ext === 'json' ? parseJSONRows(text) : parseCSVRows(text);
      setRows(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const handleDownloadZIP = useCallback(async () => {
    if (!rows.length) return;
    setBusy(true);
    setError(null);
    try {
      const used = new Set<string>();
      const entries: ZipEntry[] = [];
      for (const row of rows) {
        const canvas = await renderQRToCanvas(row.value, qrOptions, exportPixelSize);
        const png = await canvasToBlob(canvas, 'png');
        entries.push({
          name: uniqueFileName(row.id || row.value, 'png', used),
          data: new Uint8Array(await png.arrayBuffer()),
        });
      }
      const zip = new Blob([buildZip(entries) as BlobPart], { type: 'application/zip' });
      triggerBlobDownload(zip, `qr-batch-${Date.now()}.zip`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, [rows, qrOptions, exportPixelSize]);

  const handleDownloadPDF = useCallback(async () => {
    if (!rows.length) return;
    setBusy(true);
    setError(null);
    try {
      const cell = (A4.width - PDF_MARGIN * 2 - PDF_GAP * (PDF_COLS - 1)) / PDF_COLS;
      const rowHeight = cell + PDF_LABEL_SPACE + PDF_GAP;
      const rowsPerPage = Math.floor((A4.height - PDF_MARGIN * 2 + PDF_GAP) / rowHeight);
      const perPage = PDF_COLS * rowsPerPage;

      const pages: PdfPage[] = [];
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i]!;
        if (i % perPage === 0) pages.push({ ...A4, images: [], texts: [] });
        const page = pages[pages.length - 1]!;
        const slot = i % perPage;
        const x = PDF_MARGIN + (slot % PDF_COLS) * (cell + PDF_GAP);
        const y = PDF_MARGIN + Math.floor(slot / PDF_COLS) * rowHeight;

        const canvas = await renderQRToCanvas(r.value, qrOptions, exportPixelSize);
        page.images!.push({ image: await canvasToPdfImage(canvas), x, y, width: cell, height: cell });

        const label = fitHelvetica(batchLabel(r), PDF_LABEL_SIZE, cell);
        const labelX = x + (cell - measureHelvetica(label, PDF_LABEL_SIZE)) / 2;
        page.texts!.push({ text: label, x: labelX, y: y + cell + 12, size: PDF_LABEL_SIZE });
      }
      const pdf = new Blob([buildPDF(pages) as BlobPart], { type: 'application/pdf' });
      triggerBlobDownload(pdf, `qr-batch-${Date.now()}.pdf`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, [rows, qrOptions, exportPixelSize]);

  const previewRows = useMemo(() => rows.slice(0, 12), [rows]);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        ...style,
      }}
    >
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json,text/csv,application/json"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleImport(f);
            e.target.value = '';
          }}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '8px 14px',
            background: '#f3f4f6',
            border: '1px solid #d1d5db',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          Import CSV / JSON
        </button>
        <button
          type="button"
          onClick={handleDownloadZIP}
          disabled={busy || !rows.length}
          style={{
            padding: '8px 14px',
            background: '#111827',
            color: '#fff',
            border: 0,
            borderRadius: 8,
            cursor: busy || !rows.length ? 'not-allowed' : 'pointer',
            opacity: busy || !rows.length ? 0.5 : 1,
            fontSize: 13,
          }}
        >
          {busy ? 'Working…' : 'Download ZIP'}
        </button>
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={busy || !rows.length}
          style={{
            padding: '8px 14px',
            background: '#4f46e5',
            color: '#fff',
            border: 0,
            borderRadius: 8,
            cursor: busy || !rows.length ? 'not-allowed' : 'pointer',
            opacity: busy || !rows.length ? 0.5 : 1,
            fontSize: 13,
          }}
        >
          {busy ? 'Working…' : 'Download PDF'}
        </button>
        <span style={{ color: '#6b7280', fontSize: 13, marginLeft: 6 }}>
          {rows.length} row{rows.length === 1 ? '' : 's'}
        </span>
      </div>
      {error ? (
        <div
          style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      ) : null}
      {previewRows.length ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 10,
          }}
        >
          {previewRows.map((r, i) => (
            <div
              key={r.id ?? i}
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                border: '1px solid #e5e7eb',
              }}
            >
              <QRCode value={r.value} size={100} {...(qrOptions ?? {})} />
              <span
                style={{
                  fontSize: 11,
                  color: '#374151',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                }}
              >
                {batchLabel(r).slice(0, 40)}
              </span>
            </div>
          ))}
          {rows.length > previewRows.length ? (
            <div
              style={{
                background: '#fff',
                borderRadius: 10,
                padding: 8,
                display: 'grid',
                placeItems: 'center',
                color: '#6b7280',
                border: '1px dashed #d1d5db',
                fontSize: 12,
              }}
            >
              +{rows.length - previewRows.length} more
            </div>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            padding: 20,
            border: '1px dashed #d1d5db',
            borderRadius: 10,
            color: '#6b7280',
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          Import a CSV (columns: <code>id</code>, <code>value</code>, <code>label</code>) or a JSON
          array, then download as ZIP or PDF.
        </div>
      )}
    </div>
  );
}
