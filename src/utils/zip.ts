// Minimal, dependency-free ZIP writer (STORE method, no compression).
// PNG/JPEG/PDF payloads are already compressed, so deflating them again
// would cost CPU for almost no size win. Replaces JSZip.

export interface ZipEntry {
  /** Path inside the archive. Use forward slashes for folders. */
  name: string;
  data: Uint8Array;
  /** Modification time stored in the archive. Defaults to now. */
  date?: Date;
}

let crcTable: Uint32Array | undefined;

export function crc32(data: Uint8Array): number {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]!) & 0xff]! ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(d: Date): { time: number; date: number } {
  const year = Math.max(1980, d.getFullYear());
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
    date: ((year - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

/** Build a .zip archive from in-memory files. */
export function buildZip(entries: ZipEntry[]): Uint8Array {
  const encoder = new TextEncoder();
  const UTF8_FLAG = 0x0800; // file names are UTF-8
  const local: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = encoder.encode(entry.name);
    const crc = crc32(entry.data);
    const size = entry.data.length;
    const { time, date } = dosDateTime(entry.date ?? new Date());

    const header = new Uint8Array(30 + name.length);
    const h = new DataView(header.buffer);
    h.setUint32(0, 0x04034b50, true);
    h.setUint16(4, 10, true); // version needed: 1.0 (stored)
    h.setUint16(6, UTF8_FLAG, true);
    h.setUint16(8, 0, true); // method: store
    h.setUint16(10, time, true);
    h.setUint16(12, date, true);
    h.setUint32(14, crc, true);
    h.setUint32(18, size, true);
    h.setUint32(22, size, true);
    h.setUint16(26, name.length, true);
    header.set(name, 30);
    local.push(header, entry.data);

    const record = new Uint8Array(46 + name.length);
    const r = new DataView(record.buffer);
    r.setUint32(0, 0x02014b50, true);
    r.setUint16(4, 20, true); // version made by
    r.setUint16(6, 10, true);
    r.setUint16(8, UTF8_FLAG, true);
    r.setUint16(10, 0, true);
    r.setUint16(12, time, true);
    r.setUint16(14, date, true);
    r.setUint32(16, crc, true);
    r.setUint32(20, size, true);
    r.setUint32(24, size, true);
    r.setUint16(28, name.length, true);
    r.setUint32(42, offset, true);
    record.set(name, 46);
    central.push(record);

    offset += header.length + size;
  }

  const centralSize = central.reduce((n, c) => n + c.length, 0);
  const end = new Uint8Array(22);
  const e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true);
  e.setUint16(8, entries.length, true);
  e.setUint16(10, entries.length, true);
  e.setUint32(12, centralSize, true);
  e.setUint32(16, offset, true);

  const out = new Uint8Array(offset + centralSize + end.length);
  let pos = 0;
  for (const part of [...local, ...central, end]) {
    out.set(part, pos);
    pos += part.length;
  }
  return out;
}

/**
 * Make `name` safe as a file name and unique within `used`. Strips path
 * separators so a value like "https://a.com/x" can't create nested folders.
 */
export function uniqueFileName(name: string, ext: string, used: Set<string>): string {
  const stem =
    name
      .replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')
      .replace(/[\\/:*?"<>|\x00-\x1f]+/g, '-')
      .replace(/^[-.\s]+|[-.\s]+$/g, '')
      .slice(0, 60) || 'qrcode';
  let candidate = `${stem}.${ext}`;
  for (let i = 2; used.has(candidate.toLowerCase()); i++) candidate = `${stem}-${i}.${ext}`;
  used.add(candidate.toLowerCase());
  return candidate;
}
