// Core components
export { QRCode } from './components/QRCode/QRCode';
export type { QRCodeProps } from './components/QRCode/QRCode';

export { WebsiteQR } from './components/WebsiteQR/WebsiteQR';
export type { WebsiteQRProps } from './components/WebsiteQR/WebsiteQR';

export { TextQR } from './components/TextQR/TextQR';
export type { TextQRProps } from './components/TextQR/TextQR';

export { WiFiQR } from './components/WiFiQR/WiFiQR';
export type { WiFiQRProps } from './components/WiFiQR/WiFiQR';

export { EmailQR } from './components/EmailQR/EmailQR';
export type { EmailQRProps } from './components/EmailQR/EmailQR';

// Hooks
export { useQRDownload } from './hooks/useQRDownload';
export type { UseQRDownloadResult } from './hooks/useQRDownload';

// Utilities
export { downloadQR } from './utils/download';
export type { DownloadFormat, DownloadOptions } from './utils/download';

// Payload encoders (for advanced/headless use)
export { encodeWiFi, encodeEmail } from './core/encoders';
export type { WiFiPayload, WiFiEncryption, EmailPayload } from './core/encoders';

// Low-level matrix generation
export { generateMatrix } from './core/qr-generator';
export type { ErrorCorrectionLevel, QRMatrix } from './core/qr-generator';
