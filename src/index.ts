// ── Core component ──────────────────────────────────────────────────────────
export { QRCode } from './components/QRCode/QRCode';
export type {
  QRCodeProps,
  QRGradient,
  QRThemeName,
  QRAnimation,
} from './components/QRCode/QRCode';
export type { ModuleShape, CornerStyle, EyeShape } from './core/shapes';

// ── Specialised QR types ────────────────────────────────────────────────────
export { WebsiteQR } from './components/WebsiteQR/WebsiteQR';
export type { WebsiteQRProps } from './components/WebsiteQR/WebsiteQR';

export { TextQR } from './components/TextQR/TextQR';
export type { TextQRProps } from './components/TextQR/TextQR';

export { WiFiQR } from './components/WiFiQR/WiFiQR';
export type { WiFiQRProps } from './components/WiFiQR/WiFiQR';

export { EmailQR } from './components/EmailQR/EmailQR';
export type { EmailQRProps } from './components/EmailQR/EmailQR';

export { PhoneQR } from './components/PhoneQR/PhoneQR';
export type { PhoneQRProps } from './components/PhoneQR/PhoneQR';

export { SMSQR } from './components/SMSQR/SMSQR';
export type { SMSQRProps } from './components/SMSQR/SMSQR';

export { WhatsAppQR } from './components/WhatsAppQR/WhatsAppQR';
export type { WhatsAppQRProps } from './components/WhatsAppQR/WhatsAppQR';

export { ContactQR } from './components/ContactQR/ContactQR';
export type { ContactQRProps } from './components/ContactQR/ContactQR';

export { GoogleMapsQR } from './components/GoogleMapsQR/GoogleMapsQR';
export type { GoogleMapsQRProps } from './components/GoogleMapsQR/GoogleMapsQR';

export { LocationQR } from './components/LocationQR/LocationQR';
export type { LocationQRProps } from './components/LocationQR/LocationQR';

export { EventQR } from './components/EventQR/EventQR';
export type { EventQRProps } from './components/EventQR/EventQR';

export { CalendarQR } from './components/CalendarQR/CalendarQR';
export type { CalendarQRProps } from './components/CalendarQR/CalendarQR';

export { UPIQR } from './components/UPIQR/UPIQR';
export type { UPIQRProps } from './components/UPIQR/UPIQR';

export { CryptoQR } from './components/CryptoQR/CryptoQR';
export type { CryptoQRProps } from './components/CryptoQR/CryptoQR';

export { SocialQR } from './components/SocialQR/SocialQR';
export type { SocialQRProps } from './components/SocialQR/SocialQR';

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

// ── Download utilities ──────────────────────────────────────────────────────
export { downloadQR } from './utils/download';
export type { DownloadFormat, DownloadOptions } from './utils/download';

// ── Themes & templates ──────────────────────────────────────────────────────
export { THEMES } from './core/themes';
export type { QRTheme } from './core/themes';
export { TEMPLATES } from './core/templates';
export type { QRTemplate, TemplateCategory } from './core/templates';

// ── Payload encoders (for headless / advanced use) ──────────────────────────
export {
  encodeWiFi,
  encodeEmail,
  encodePhone,
  encodeSMS,
  encodeWhatsApp,
  encodeContact,
  encodeLocation,
  encodeGoogleMaps,
  encodeEvent,
  encodeUPI,
  encodeCrypto,
  encodeSocial,
} from './core/encoders';

export type {
  WiFiPayload,
  WiFiEncryption,
  EmailPayload,
  PhonePayload,
  SMSPayload,
  WhatsAppPayload,
  ContactPayload,
  ContactAddress,
  LocationPayload,
  GoogleMapsPayload,
  EventPayload,
  UPIPayload,
  CryptoPayload,
  CryptoCoin,
  SocialPayload,
  SocialPlatform,
} from './core/encoders';

// ── Low-level matrix generation ─────────────────────────────────────────────
export { generateMatrix } from './core/qr-generator';
export type { ErrorCorrectionLevel, QRMatrix } from './core/qr-generator';
