import { useCallback, useRef } from 'react';
import {
  downloadQR,
  type DownloadFormat,
  type DownloadOptions,
} from '../utils/download';

export interface UseQRDownloadResult<T extends SVGSVGElement> {
  ref: React.RefObject<T>;
  download: (format: DownloadFormat, options?: DownloadOptions) => Promise<void>;
}

export function useQRDownload<T extends SVGSVGElement = SVGSVGElement>(): UseQRDownloadResult<T> {
  const ref = useRef<T | null>(null);
  const download = useCallback(
    async (format: DownloadFormat, options?: DownloadOptions) => {
      if (!ref.current) {
        throw new Error('useQRDownload: ref is not attached to an SVG element');
      }
      await downloadQR(ref.current, format, options);
    },
    [],
  );
  return { ref: ref as React.RefObject<T>, download };
}
