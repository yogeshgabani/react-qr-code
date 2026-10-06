import { useCallback, useRef } from 'react';
import {
  copyQR,
  downloadQR,
  shareQR,
  type DownloadFormat,
  type DownloadOptions,
  type ShareOptions,
} from '../utils/download';
import { verifyQR, type VerifyOptions, type VerifyResult } from '../utils/verify';

export interface UseQRDownloadResult<T extends SVGSVGElement> {
  ref: React.RefObject<T>;
  download: (format: DownloadFormat, options?: DownloadOptions) => Promise<void>;
  /** Copy the QR to the clipboard as PNG. Call from a click handler. */
  copy: (options?: { pixelSize?: number }) => Promise<void>;
  /** Open the native share sheet. Resolves `false` if unsupported or cancelled. */
  share: (options?: ShareOptions) => Promise<boolean>;
  /** Decode the rendered QR to check it actually scans. */
  verify: (options?: VerifyOptions) => Promise<VerifyResult>;
}

export function useQRDownload<T extends SVGSVGElement = SVGSVGElement>(): UseQRDownloadResult<T> {
  const ref = useRef<T | null>(null);

  const getSvg = useCallback((): T => {
    if (!ref.current) {
      throw new Error('useQRDownload: ref is not attached to an SVG element');
    }
    return ref.current;
  }, []);

  const download = useCallback(
    async (format: DownloadFormat, options?: DownloadOptions) =>
      downloadQR(getSvg(), format, options),
    [getSvg],
  );
  const copy = useCallback(
    async (options?: { pixelSize?: number }) => copyQR(getSvg(), options),
    [getSvg],
  );
  const share = useCallback(
    async (options?: ShareOptions) => shareQR(getSvg(), options),
    [getSvg],
  );
  const verify = useCallback(
    async (options?: VerifyOptions) => verifyQR(getSvg(), options),
    [getSvg],
  );

  return { ref: ref as React.RefObject<T>, download, copy, share, verify };
}
