import { useCallback, useEffect, useState } from 'react';

interface DynamicState {
  value: string;
  scanCount: number;
  createdAt: number;
}

export interface UseDynamicQROptions {
  id: string;
  initialValue: string;
  expiresAt?: string | Date;
  maxScans?: number;
}

export interface UseDynamicQRResult {
  value: string;
  setValue: (next: string) => void;
  recordScan: () => void;
  reset: () => void;
  scanCount: number;
  expired: boolean;
  overUsed: boolean;
}

/**
 * Client-side dynamic-QR state, persisted to localStorage. Pair with a real
 * redirect backend in production for cross-device dynamism.
 */
export function useDynamicQR({
  id,
  initialValue,
  expiresAt,
  maxScans,
}: UseDynamicQROptions): UseDynamicQRResult {
  const storageKey = `qrm-dyn-${id}`;
  const [state, setState] = useState<DynamicState>(() => {
    if (typeof window === 'undefined') {
      return { value: initialValue, scanCount: 0, createdAt: Date.now() };
    }
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) return JSON.parse(raw) as DynamicState;
    } catch {
      // ignore
    }
    return { value: initialValue, scanCount: 0, createdAt: Date.now() };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, storageKey]);

  const setValue = useCallback((next: string) => {
    setState((s) => ({ ...s, value: next }));
  }, []);
  const recordScan = useCallback(() => {
    setState((s) => ({ ...s, scanCount: s.scanCount + 1 }));
  }, []);
  const reset = useCallback(() => {
    setState({ value: initialValue, scanCount: 0, createdAt: Date.now() });
  }, [initialValue]);

  const expired = (() => {
    if (!expiresAt) return false;
    const t = expiresAt instanceof Date ? expiresAt.getTime() : new Date(expiresAt).getTime();
    return Number.isFinite(t) && Date.now() > t;
  })();
  const overUsed = typeof maxScans === 'number' && state.scanCount >= maxScans;

  return {
    value: state.value,
    setValue,
    recordScan,
    reset,
    scanCount: state.scanCount,
    expired,
    overUsed,
  };
}
