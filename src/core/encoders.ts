// Payload encoders for specialised QR types.
// Each encoder returns the plain-text string that gets embedded into the QR.

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
  const parts: string[] = [
    `T:${t}`,
    `S:${escapeWiFi(ssid)}`,
  ];
  if (password && t !== 'nopass') {
    parts.push(`P:${escapeWiFi(password)}`);
  }
  if (hidden) {
    parts.push('H:true');
  }
  return `WIFI:${parts.join(';')};;`;
}

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
