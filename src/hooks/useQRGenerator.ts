import { useMemo } from 'react';
import {
  generateMatrix,
  type ErrorCorrectionLevel,
  type QRMatrix,
} from '../core/qr-generator';

/**
 * Headless QR matrix generator. Returns the raw module grid for custom
 * rendering (canvas, native, terminal art, etc.).
 */
export function useQRGenerator(
  value: string,
  level: ErrorCorrectionLevel = 'M',
): QRMatrix {
  return useMemo(() => generateMatrix(value, level), [value, level]);
}
