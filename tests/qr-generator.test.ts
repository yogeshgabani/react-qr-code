import { describe, expect, it } from 'vitest';
import jsQR from 'jsqr';
import { generateMatrix, type ErrorCorrectionLevel } from '../src/core/qr-generator';
import { encodeContact, encodeUPI, encodeWiFi } from '../src/core/encoders';

/** Rasterise a module matrix (black on white, 4-module quiet zone) and decode it. */
function decode(value: string, level: ErrorCorrectionLevel): string | undefined {
  const { modules, size } = generateMatrix(value, level);
  const scale = 4;
  const margin = 4;
  const px = (size + margin * 2) * scale;
  const rgba = new Uint8ClampedArray(px * px * 4).fill(255);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!modules[r]?.[c]) continue;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const i = (((r + margin) * scale + dy) * px + (c + margin) * scale + dx) * 4;
          rgba[i] = rgba[i + 1] = rgba[i + 2] = 0;
        }
      }
    }
  }
  return jsQR(rgba, px, px)?.data;
}

const samples: Record<string, string> = {
  url: 'https://example.com/path?query=1&x=y',
  numeric: '0123456789012345678901234567890',
  hindi: 'नमस्ते दुनिया — UPI भुगतान',
  emoji: 'Scan me 🚀✨ café',
  wifi: encodeWiFi({ ssid: 'Home;Net', password: 'p@ss:"word"', encryption: 'WPA2' }),
  upi: encodeUPI({ payeeVPA: 'shop@okhdfc', payeeName: 'Ravi Kumar', amount: 249.5, note: 'Order 42' }),
  vcard: encodeContact({
    firstName: 'Jane',
    lastName: 'Doe',
    organization: 'Acme Inc.',
    email: 'jane@acme.com',
    mobile: '+1 415 555 2671',
    website: 'https://acme.com',
    address: { street: '1 Main St', city: 'Springfield', country: 'USA' },
  }),
  long: 'x'.repeat(1200),
};

describe('generateMatrix', () => {
  for (const [name, value] of Object.entries(samples)) {
    for (const level of ['L', 'M', 'Q', 'H'] as const) {
      it(`round-trips ${name} at level ${level}`, () => {
        expect(decode(value, level)).toBe(value);
      });
    }
  }

  it('grows the symbol for longer data and higher error correction', () => {
    expect(generateMatrix('hi', 'L').size).toBe(21);
    const long = samples.long!;
    expect(generateMatrix(long, 'H').size).toBeGreaterThan(generateMatrix(long, 'L').size);
  });
});
