import { useCallback, useState } from 'react';
import { parseCSVRows, parseJSONRows, type BatchRow } from '../utils/batch-rows';

export type { BatchRow } from '../utils/batch-rows';

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
      setRows(parseCSVRows(csv));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const importJSON = useCallback((json: string) => {
    setError(null);
    try {
      setRows(parseJSONRows(json));
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
