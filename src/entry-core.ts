// Server-safe entry (`react-qr-master/core`): no "use client" directive and
// only React APIs that exist in the React Server Components build (forwardRef,
// useId, useMemo). Import from here in Server Components, route handlers or
// plain Node; everything here is also re-exported from the main entry.

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

// ── Themes & templates ──────────────────────────────────────────────────────
export { THEMES } from './core/themes';
export type { QRTheme } from './core/themes';
export { TEMPLATES } from './core/templates';
export type { QRTemplate, TemplateCategory } from './core/templates';

// ── Animations ──────────────────────────────────────────────────────────────
export { getAnimationCSS } from './core/animations';

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
