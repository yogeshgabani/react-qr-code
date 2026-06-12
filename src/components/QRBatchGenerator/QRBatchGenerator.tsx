import { useCallback, useMemo, useRef, useState, type CSSProperties } from 'react';
import Papa from 'papaparse';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';

export interface BatchRow {
  /** Unique identifier used as the filename stem. */
  id?: string;
  /** The QR payload value. */
  value: string;
  /** Optional label / display name. */
  label?: string;
}

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

function parseJSONRows(input: string): BatchRow[] {
  const parsed: unknown = JSON.parse(input);
  if (!Array.isArray(parsed)) {
    throw new Error('JSON must be an array of {id?, value, label?} objects.');
  }
  return parsed.map((row, idx) => {
    if (typeof row === 'string') return { value: row, id: `row-${idx + 1}` };
    if (row && typeof row === 'object' && 'value' in row) {
      const r = row as Record<string, unknown>;
      return {
        id: typeof r.id === 'string' ? r.id : `row-${idx + 1}`,
        value: String(r.value),
        ...(typeof r.label === 'string' ? { label: r.label } : {}),
      };
    }
    throw new Error(`Row ${idx + 1} missing "value" field.`);
  });
}

function parseCSVRows(input: string): BatchRow[] {
  const result = Papa.parse<Record<string, string>>(input.trim(), {
    header: true,
    skipEmptyLines: true,
  });
  if (result.errors.length) {
    throw new Error(result.errors[0]?.message ?? 'CSV parse error');
  }
  return result.data.map((row, idx) => ({
    id: row.id ?? `row-${idx + 1}`,
    value: row.value ?? row.url ?? row.text ?? '',
    ...(row.label ? { label: row.label } : {}),
  })).filter((r) => r.value);
}

async function renderQRToBlob(
  value: string,
  options: Omit<QRCodeProps, 'value'> | undefined,
  pixelSize: number,
): Promise<Blob> {
  // Render off-screen using a temporary container.
  const { createRoot } = await import('react-dom/client');
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    await new Promise<void>((resolve) => {
      root.render(
        <QRCode value={value} {...(options ?? {})} size={pixelSize} />,
      );
      requestAnimationFrame(() => resolve());
    });
    const svg = container.querySelector('svg');
    if (!svg) throw new Error('Failed to render QR for batch export');
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    try {
      const img = await new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = () => rej(new Error('SVG → image failed'));
        i.src = url;
      });
      const canvas = document.createElement('canvas');
      canvas.width = pixelSize;
      canvas.height = pixelSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D unavailable');
      ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
      return await new Promise<Blob>((res, rej) => {
        canvas.toBlob((b) => (b ? res(b) : rej(new Error('toBlob null'))), 'image/png');
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  } finally {
    root.unmount();
    container.remove();
  }
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
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      for (const row of rows) {
        const blob = await renderQRToBlob(row.value, qrOptions, exportPixelSize);
        zip.file(`${row.id || row.value.slice(0, 30)}.png`, blob);
      }
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-batch-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
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
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const cellSize = 160;
      const gap = 20;
      const cols = 3;
      const colW = (pageW - gap * (cols + 1)) / cols;
      let col = 0;
      let row = 0;
      for (const r of rows) {
        const blob = await renderQRToBlob(r.value, qrOptions, exportPixelSize);
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((res, rej) => {
          reader.onload = () => res(reader.result as string);
          reader.onerror = () => rej(reader.error ?? new Error('FileReader error'));
          reader.readAsDataURL(blob);
        });
        const x = gap + col * (colW + gap);
        const y = gap + 40 + row * (cellSize + 40);
        pdf.addImage(dataUrl, 'PNG', x, y, colW, colW);
        pdf.setFontSize(9);
        pdf.text(r.label ?? r.id ?? r.value.slice(0, 28), x, y + colW + 14, {
          maxWidth: colW,
        });
        col++;
        if (col >= cols) {
          col = 0;
          row++;
          if (y + cellSize * 2 > pdf.internal.pageSize.getHeight()) {
            pdf.addPage();
            row = 0;
          }
        }
      }
      pdf.save(`qr-batch-${Date.now()}.pdf`);
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
                {r.label ?? r.id ?? r.value.slice(0, 24)}
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
