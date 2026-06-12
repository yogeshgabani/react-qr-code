// Payload encoders for specialised QR types.
// Each encoder returns the plain-text string that gets embedded into the QR.
// All encoders are pure functions and can be used headlessly without React.

// ─── WiFi (WIFI: URI scheme) ────────────────────────────────────────────────

const WIFI_ESCAPE = /([\\;,":])/g;

function escapeWiFi(s: string): string {
  return s.replace(WIFI_ESCAPE, '\\$1');
}

export type WiFiEncryption = 'WPA' | 'WPA2' | 'WPA3' | 'WEP' | 'nopass';

export interface WiFiPayload {
  ssid: string;
  password?: string;
  /** Defaults to 'WPA'. WPA2/WPA3 are normalised to 'WPA' per the WIFI: URI scheme. */
  encryption?: WiFiEncryption;
  hidden?: boolean;
}

export function encodeWiFi({
  ssid,
  password,
  encryption = 'WPA',
  hidden = false,
}: WiFiPayload): string {
  const t =
    encryption === 'nopass' ? 'nopass' : encryption === 'WEP' ? 'WEP' : 'WPA';
  const parts: string[] = [`T:${t}`, `S:${escapeWiFi(ssid)}`];
  if (password && t !== 'nopass') parts.push(`P:${escapeWiFi(password)}`);
  if (hidden) parts.push('H:true');
  return `WIFI:${parts.join(';')};;`;
}

// ─── Email (mailto:) ────────────────────────────────────────────────────────

export interface EmailPayload {
  to: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

export function encodeEmail({ to, subject, body, cc, bcc }: EmailPayload): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  if (cc) params.set('cc', cc);
  if (bcc) params.set('bcc', bcc);
  const qs = params.toString().replace(/\+/g, '%20');
  const recipient = encodeURIComponent(to).replace(/%40/g, '@');
  return `mailto:${recipient}${qs ? `?${qs}` : ''}`;
}

// ─── Phone (tel:) ───────────────────────────────────────────────────────────

export interface PhonePayload {
  phoneNumber: string;
}

export function encodePhone({ phoneNumber }: PhonePayload): string {
  return `tel:${phoneNumber.replace(/\s+/g, '')}`;
}

// ─── SMS (sms: per RFC 5724) ────────────────────────────────────────────────

export interface SMSPayload {
  phoneNumber: string;
  message?: string;
}

export function encodeSMS({ phoneNumber, message }: SMSPayload): string {
  const num = phoneNumber.replace(/\s+/g, '');
  if (!message) return `sms:${num}`;
  return `sms:${num}?body=${encodeURIComponent(message)}`;
}

// ─── WhatsApp (wa.me click-to-chat) ─────────────────────────────────────────

export interface WhatsAppPayload {
  /** Digits only. Country code without leading +. E.g. "14155552671". */
  phoneNumber: string;
  message?: string;
}

export function encodeWhatsApp({ phoneNumber, message }: WhatsAppPayload): string {
  const num = phoneNumber.replace(/\D/g, '');
  const base = `https://wa.me/${num}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// ─── Contact / vCard 3.0 ────────────────────────────────────────────────────

function escapeVCard(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export interface ContactAddress {
  street?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
}

export interface ContactPayload {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  organization?: string;
  title?: string;
  phone?: string;
  mobile?: string;
  workPhone?: string;
  email?: string;
  website?: string;
  address?: ContactAddress;
  note?: string;
}

export function encodeContact(c: ContactPayload): string {
  const fn = c.fullName ?? [c.firstName, c.lastName].filter(Boolean).join(' ').trim();
  const n = `${escapeVCard(c.lastName ?? '')};${escapeVCard(c.firstName ?? '')};;;`;
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];
  if (fn) lines.push(`FN:${escapeVCard(fn)}`);
  lines.push(`N:${n}`);
  if (c.organization) lines.push(`ORG:${escapeVCard(c.organization)}`);
  if (c.title) lines.push(`TITLE:${escapeVCard(c.title)}`);
  if (c.phone) lines.push(`TEL;TYPE=VOICE:${c.phone}`);
  if (c.mobile) lines.push(`TEL;TYPE=CELL:${c.mobile}`);
  if (c.workPhone) lines.push(`TEL;TYPE=WORK:${c.workPhone}`);
  if (c.email) lines.push(`EMAIL:${c.email}`);
  if (c.website) lines.push(`URL:${c.website}`);
  if (c.address) {
    const a = c.address;
    lines.push(
      `ADR:;;${escapeVCard(a.street ?? '')};${escapeVCard(a.city ?? '')};${escapeVCard(a.region ?? '')};${escapeVCard(a.postalCode ?? '')};${escapeVCard(a.country ?? '')}`,
    );
  }
  if (c.note) lines.push(`NOTE:${escapeVCard(c.note)}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

// ─── Location (geo: URI per RFC 5870) ───────────────────────────────────────

export interface LocationPayload {
  latitude: number;
  longitude: number;
  /** Optional uncertainty in metres. */
  accuracy?: number;
  /** Optional query/label appended as `?q=`. Honoured by many parsers. */
  query?: string;
}

export function encodeLocation({
  latitude,
  longitude,
  accuracy,
  query,
}: LocationPayload): string {
  let uri = `geo:${latitude},${longitude}`;
  const params: string[] = [];
  if (typeof accuracy === 'number') params.push(`u=${accuracy}`);
  if (query) params.push(`q=${encodeURIComponent(query)}`);
  if (params.length) uri += `?${params.join('&')}`;
  return uri;
}

// ─── Google Maps (https) ────────────────────────────────────────────────────

export interface GoogleMapsPayload {
  /** Either `query` (place name/address) or both `latitude` and `longitude`. */
  query?: string;
  latitude?: number;
  longitude?: number;
}

export function encodeGoogleMaps({
  query,
  latitude,
  longitude,
}: GoogleMapsPayload): string {
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }
  throw new Error(
    'encodeGoogleMaps requires either `query` or both `latitude` and `longitude`.',
  );
}

// ─── Event (iCalendar VEVENT) ───────────────────────────────────────────────

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function formatICalDate(d: Date, allDay: boolean): string {
  const y = d.getUTCFullYear();
  const mo = pad2(d.getUTCMonth() + 1);
  const da = pad2(d.getUTCDate());
  if (allDay) return `${y}${mo}${da}`;
  const h = pad2(d.getUTCHours());
  const mi = pad2(d.getUTCMinutes());
  const s = pad2(d.getUTCSeconds());
  return `${y}${mo}${da}T${h}${mi}${s}Z`;
}

function escapeICal(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function toDate(d: Date | string): Date {
  return d instanceof Date ? d : new Date(d);
}

export interface EventPayload {
  title: string;
  start: Date | string;
  /** Defaults to start + 1 hour. */
  end?: Date | string;
  allDay?: boolean;
  location?: string;
  description?: string;
  url?: string;
  organizer?: string;
}

export function encodeEvent(p: EventPayload): string {
  const start = toDate(p.start);
  const end = p.end ? toDate(p.end) : new Date(start.getTime() + 60 * 60 * 1000);
  const allDay = p.allDay ?? false;
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//react-qr-master//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${escapeICal(p.title)}`,
    `DTSTART:${formatICalDate(start, allDay)}`,
    `DTEND:${formatICalDate(end, allDay)}`,
  ];
  if (p.location) lines.push(`LOCATION:${escapeICal(p.location)}`);
  if (p.description) lines.push(`DESCRIPTION:${escapeICal(p.description)}`);
  if (p.url) lines.push(`URL:${p.url}`);
  if (p.organizer) lines.push(`ORGANIZER:${p.organizer}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

// ─── UPI Payment (upi://pay) ────────────────────────────────────────────────

export interface UPIPayload {
  /** Payee VPA, e.g. "merchant@upi". */
  payeeVPA: string;
  payeeName: string;
  /** Amount in INR. String is preferred to preserve formatting (e.g. "10.00"). */
  amount?: number | string;
  /** Transaction note shown to the user. */
  note?: string;
  /** Merchant transaction reference ID. */
  transactionRef?: string;
  /** Merchant category code. */
  merchantCode?: string;
  /** Currency code. Defaults to "INR" per the UPI spec. */
  currency?: string;
}

export function encodeUPI({
  payeeVPA,
  payeeName,
  amount,
  note,
  transactionRef,
  merchantCode,
  currency = 'INR',
}: UPIPayload): string {
  const params = new URLSearchParams();
  params.set('pa', payeeVPA);
  params.set('pn', payeeName);
  if (amount !== undefined) params.set('am', String(amount));
  params.set('cu', currency);
  if (note) params.set('tn', note);
  if (transactionRef) params.set('tr', transactionRef);
  if (merchantCode) params.set('mc', merchantCode);
  return `upi://pay?${params.toString()}`;
}

// ─── Cryptocurrency (BIP21, EIP-681, Solana Pay) ────────────────────────────

export type CryptoCoin = 'bitcoin' | 'ethereum' | 'solana' | 'polygon' | 'usdt';

export interface CryptoPayload {
  coin: CryptoCoin;
  address: string;
  /** Amount in the coin's display unit (BTC, ETH, MATIC, SOL, USDT). */
  amount?: number | string;
  label?: string;
  message?: string;
  /** ERC-20 token contract address. Required when `coin: 'usdt'`. */
  tokenAddress?: string;
}

function unitsToBaseUnits(amount: number | string, decimals: number): string {
  const [whole = '0', frac = ''] = String(amount).split('.');
  const padded = (frac + '0'.repeat(decimals)).slice(0, decimals);
  return (whole + padded).replace(/^0+(?=\d)/, '') || '0';
}

export function encodeCrypto(p: CryptoPayload): string {
  switch (p.coin) {
    case 'bitcoin': {
      const params = new URLSearchParams();
      if (p.amount !== undefined) params.set('amount', String(p.amount));
      if (p.label) params.set('label', p.label);
      if (p.message) params.set('message', p.message);
      const qs = params.toString();
      return `bitcoin:${p.address}${qs ? `?${qs}` : ''}`;
    }
    case 'ethereum':
    case 'polygon': {
      const chainId = p.coin === 'polygon' ? 137 : 1;
      const params = new URLSearchParams();
      if (p.amount !== undefined) params.set('value', unitsToBaseUnits(p.amount, 18));
      const qs = params.toString();
      return `ethereum:${p.address}@${chainId}${qs ? `?${qs}` : ''}`;
    }
    case 'solana': {
      const params = new URLSearchParams();
      if (p.amount !== undefined) params.set('amount', String(p.amount));
      if (p.label) params.set('label', p.label);
      if (p.message) params.set('message', p.message);
      const qs = params.toString();
      return `solana:${p.address}${qs ? `?${qs}` : ''}`;
    }
    case 'usdt': {
      if (!p.tokenAddress) {
        throw new Error(
          'encodeCrypto: `usdt` requires `tokenAddress` (the ERC-20 contract address).',
        );
      }
      const params = new URLSearchParams();
      params.set('address', p.address);
      if (p.amount !== undefined) {
        params.set('uint256', unitsToBaseUnits(p.amount, 6));
      }
      return `ethereum:${p.tokenAddress}@1/transfer?${params.toString()}`;
    }
  }
}

// ─── Social Media (URL builders) ────────────────────────────────────────────

export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'x'
  | 'twitter'
  | 'youtube'
  | 'tiktok'
  | 'github'
  | 'discord';

export interface SocialPayload {
  platform: SocialPlatform;
  /** Username/handle, or a full URL (in which case it is returned as-is). */
  username: string;
}

export function encodeSocial({ platform, username }: SocialPayload): string {
  if (/^https?:\/\//i.test(username)) return username;
  const stripped = username.replace(/^@/, '');
  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/${stripped}`;
    case 'instagram':
      return `https://www.instagram.com/${stripped}`;
    case 'linkedin':
      return `https://www.linkedin.com/in/${stripped}`;
    case 'x':
      return `https://x.com/${stripped}`;
    case 'twitter':
      return `https://twitter.com/${stripped}`;
    case 'youtube':
      return `https://www.youtube.com/@${stripped}`;
    case 'tiktok':
      return `https://www.tiktok.com/@${stripped}`;
    case 'github':
      return `https://github.com/${stripped}`;
    case 'discord':
      return `https://discord.gg/${stripped}`;
  }
}
