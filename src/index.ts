// Main entry. The build prepends "use client", so everything here can be
// imported from Next.js App Router files, including Server Components.

export * from './entry-core';

// ── Apps / interactive components ───────────────────────────────────────────
export { QRScanner } from './components/QRScanner/QRScanner';
export type { QRScannerProps, QRScannerHandle, QRScanResult } from './components/QRScanner/QRScanner';

export { DynamicQRCode } from './components/DynamicQRCode/DynamicQRCode';
export type { DynamicQRCodeProps } from './components/DynamicQRCode/DynamicQRCode';

export { QRBatchGenerator } from './components/QRBatchGenerator/QRBatchGenerator';
export type {
  QRBatchGeneratorProps,
  BatchRow,
} from './components/QRBatchGenerator/QRBatchGenerator';

export { QRStudio } from './components/QRStudio/QRStudio';
export type { QRStudioProps } from './components/QRStudio/QRStudio';

// ── Hooks ───────────────────────────────────────────────────────────────────
export { useQRDownload } from './hooks/useQRDownload';
export type { UseQRDownloadResult } from './hooks/useQRDownload';

export { useQRGenerator } from './hooks/useQRGenerator';
export { useDynamicQR } from './hooks/useDynamicQR';
export type { UseDynamicQROptions, UseDynamicQRResult } from './hooks/useDynamicQR';
export { useBatchQR } from './hooks/useBatchQR';
export type { UseBatchQRResult } from './hooks/useBatchQR';
export { useQRAnalytics } from './hooks/useQRAnalytics';
export type {
  QRScanEvent,
  QRAnalyticsSummary,
  UseQRAnalyticsResult,
} from './hooks/useQRAnalytics';

// ── Download / share / verify utilities ─────────────────────────────────────
export { downloadQR, copyQR, shareQR, canShareQR } from './utils/download';
export type { DownloadFormat, DownloadOptions, ShareOptions } from './utils/download';
export { verifyQR } from './utils/verify';
export type { VerifyOptions, VerifyResult } from './utils/verify';
