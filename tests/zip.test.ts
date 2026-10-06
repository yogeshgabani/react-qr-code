import { describe, expect, it } from 'vitest';
import { buildZip, crc32, uniqueFileName } from '../src/utils/zip';

const enc = new TextEncoder();
const dec = new TextDecoder();

/** Read a STORE-only zip back by walking the central directory. */
function readZip(zip: Uint8Array): Record<string, string> {
  const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
  const eocd = zip.length - 22;
  expect(view.getUint32(eocd, true)).toBe(0x06054b50);
  const count = view.getUint16(eocd + 10, true);
  let p = view.getUint32(eocd + 16, true);
  const out: Record<string, string> = {};
  for (let i = 0; i < count; i++) {
    expect(view.getUint32(p, true)).toBe(0x02014b50);
    const crc = view.getUint32(p + 16, true);
    const size = view.getUint32(p + 24, true);
    const nameLen = view.getUint16(p + 28, true);
    const local = view.getUint32(p + 42, true);
    const name = dec.decode(zip.subarray(p + 46, p + 46 + nameLen));
    expect(view.getUint32(local, true)).toBe(0x04034b50);
    const start = local + 30 + view.getUint16(local + 26, true) + view.getUint16(local + 28, true);
    const data = zip.subarray(start, start + size);
    expect(crc32(data)).toBe(crc);
    out[name] = dec.decode(data);
    p += 46 + nameLen + view.getUint16(p + 30, true) + view.getUint16(p + 32, true);
  }
  return out;
}

describe('zip', () => {
  it('computes the standard CRC-32 check value', () => {
    expect(crc32(enc.encode('123456789'))).toBe(0xcbf43926);
  });

  it('writes an archive that reads back intact, including UTF-8 names', () => {
    const zip = buildZip([
      { name: 'a.txt', data: enc.encode('hello') },
      { name: 'qr-नमस्ते.png', data: enc.encode('x'.repeat(1000)) },
      { name: 'empty.bin', data: new Uint8Array() },
    ]);
    expect(readZip(zip)).toEqual({
      'a.txt': 'hello',
      'qr-नमस्ते.png': 'x'.repeat(1000),
      'empty.bin': '',
    });
  });

  it('makes file names safe and unique', () => {
    const used = new Set<string>();
    expect(uniqueFileName('https://example.com/a/b?c', 'png', used)).toBe('example.com-a-b-c.png');
    expect(uniqueFileName('row-1', 'png', used)).toBe('row-1.png');
    expect(uniqueFileName('ROW-1', 'png', used)).toBe('ROW-1-2.png');
    expect(uniqueFileName('///', 'png', used)).toBe('qrcode.png');
  });
});
