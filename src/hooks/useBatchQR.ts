import { useCallback, useState } from 'react';
import Papa from 'papaparse';

export interface BatchRow {
  id?: string;
  value: string;
  label?: string;
}

export interface UseBatchQRResult {
  rows: BatchRow[];
  setRows: (rows: BatchRow[]) => void;
  importCSV: (csv: string) => void;
  importJSON: (json: string) => void;
  clear: () => void;
  error: string | null;
}

/** Headless batch-row state with CSV/JSON ingest. Pair with the existing
 *  `<QRBatchGenerator/>` component or render the rows yourself. */
export function useBatchQR(initialRows: BatchRow[] = []): UseBatchQRResult {
  const [rows, setRows] = useState<BatchRow[]>(initialRows);
  const [error, setError] = useState<string | null>(null);

  const importCSV = useCallback((csv: string) => {
    setError(null);
    try {
      const result = Papa.parse<Record<string, string>>(csv.trim(), {
        header: true,
        skipEmptyLines: true,
      });
      if (result.errors.length) {
        throw new Error(result.errors[0]?.message ?? 'CSV parse error');
      }
      const parsed: BatchRow[] = result.data
        .map((row, idx) => ({
          id: row.id ?? `row-${idx + 1}`,
          value: row.value ?? row.url ?? row.text ?? '',
          ...(row.label ? { label: row.label } : {}),
        }))
        .filter((r) => r.value);
      setRows(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const importJSON = useCallback((json: string) => {
    setError(null);
    try {
      const parsed: unknown = JSON.parse(json);
      if (!Array.isArray(parsed)) throw new Error('JSON must be an array.');
      const out: BatchRow[] = parsed.map((row, idx) => {
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
      setRows(out);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const clear = useCallback(() => {
    setRows([]);
    setError(null);
  }, []);

  return { rows, setRows, importCSV, importJSON, clear, error };
}
