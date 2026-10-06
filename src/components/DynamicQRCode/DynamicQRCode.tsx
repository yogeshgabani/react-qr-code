import { forwardRef, useEffect, useMemo, useState } from 'react';
import { QRCode, type QRCodeProps } from '../QRCode/QRCode';

export interface DynamicQRCodeProps extends Omit<QRCodeProps, 'value'> {
  /** Identifier used for localStorage key. */
  id: string;
  /** Initial destination URL. */
  initialValue: string;
  /** Optional explicit value override (skips localStorage if provided). */
  value?: string;
  /** Expiry ISO timestamp or Date — after which QR shows expired state. */
  expiresAt?: string | Date;
  /** Maximum scans allowed (tracked client-side via localStorage scanCount). */
  maxScans?: number;
  /** Renders when QR is past expiry or over usage limit. */
  fallback?: React.ReactNode;
  /** Called when the active value changes (e.g. user edits). */
  onValueChange?: (value: string) => void;
}

interface DynamicState {
  value: string;
  scanCount: number;
}

/**
 * A client-side dynamic QR. The encoded value is stored under
 * `localStorage[`qrm-dyn-${id}`]` and can be updated at runtime. Expiry +
 * max-scans are enforced locally. Pair with a real redirect backend in
 * production for cross-device dynamism.
 */
export const DynamicQRCode = /* @__PURE__ */ forwardRef<SVGSVGElement, DynamicQRCodeProps>(
  function DynamicQRCode(
    {
      id,
      initialValue,
      value: controlled,
      expiresAt,
      maxScans,
      fallback,
      onValueChange,
      ...rest
    },
    ref,
  ) {
    const storageKey = `qrm-dyn-${id}`;
    const [state, setState] = useState<DynamicState>(() => {
      if (typeof window === 'undefined') return { value: initialValue, scanCount: 0 };
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) return JSON.parse(raw) as DynamicState;
      } catch {
        // fall through
      }
      return { value: initialValue, scanCount: 0 };
    });

    // Sync controlled prop.
    useEffect(() => {
      if (controlled !== undefined && controlled !== state.value) {
        setState((s) => ({ ...s, value: controlled }));
      }
    }, [controlled, state.value]);

    // Persist state changes.
    useEffect(() => {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        // localStorage unavailable; silent
      }
      onValueChange?.(state.value);
    }, [state, storageKey, onValueChange]);

    const expired = useMemo(() => {
      if (!expiresAt) return false;
      const t = expiresAt instanceof Date ? expiresAt.getTime() : new Date(expiresAt).getTime();
      return Number.isFinite(t) && Date.now() > t;
    }, [expiresAt]);

    const overUsed = typeof maxScans === 'number' && state.scanCount >= maxScans;

    if (expired || overUsed) {
      return (
        <>
          {fallback ?? (
            <div
              style={{
                width: rest.size ?? 256,
                height: rest.size ?? 256,
                background: '#f3f4f6',
                color: '#6b7280',
                borderRadius: 12,
                display: 'grid',
                placeItems: 'center',
                fontFamily: 'ui-sans-serif, system-ui',
                fontSize: 14,
                padding: 16,
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              {expired ? 'QR expired' : 'Scan limit reached'}
            </div>
          )}
        </>
      );
    }

    return <QRCode ref={ref} value={state.value} {...rest} />;
  },
);
