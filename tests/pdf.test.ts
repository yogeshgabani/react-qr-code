import { inflateSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { buildPDF, fitHelvetica, measureHelvetica, rgbaToPdfImage } from '../src/utils/pdf';

const latin1 = (b: Uint8Array) => Buffer.from(b).toString('latin1');

describe('pdf', () => {
  it('stores pixels losslessly, flattening transparency onto white', async () => {
    // 2x1: opaque red, fully transparent.
    const img = await rgbaToPdfImage(new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 0, 0]), 2, 1);
    expect(img.filter).toBe('FlateDecode');
    expect([...inflateSync(img.data)]).toEqual([255, 0, 0, 255, 255, 255]);
  });

  it('writes a well-formed file with a valid xref table', async () => {
    const image = await rgbaToPdfImage(new Uint8ClampedArray(4 * 4 * 4).fill(255), 4, 4);
    const pdf = buildPDF([
      {
        width: 200,
        height: 300,
        images: [{ image, x: 10, y: 20, width: 100, height: 100 }],
        texts: [{ text: 'Hi (there) \\ ✓', x: 10, y: 140, size: 9 }],
      },
      { width: 200, height: 300 },
    ]);
    const s = latin1(pdf);
    expect(s.startsWith('%PDF-1.4\n')).toBe(true);
    expect(s.endsWith('%%EOF\n')).toBe(true);

    const startxref = Number(/startxref\n(\d+)\n%%EOF\n$/.exec(s)![1]);
    expect(s.slice(startxref, startxref + 4)).toBe('xref');
    const count = Number(/^xref\n0 (\d+)\n/.exec(s.slice(startxref))![1]);
    const table = s.slice(startxref).split('\n').slice(2, 2 + count);
    expect(table[0]).toBe('0000000000 65535 f ');
    table.slice(1).forEach((entry, i) => {
      expect(entry).toMatch(/^\d{10} 00000 n $/);
      expect(s.slice(Number(entry.slice(0, 10)))).toMatch(new RegExp(`^${i + 1} 0 obj\\n`));
    });
    expect(s).toMatch(/\/Count 2>>/);

    // Image placed with a top-left origin → PDF y = 300 - 20 - 100.
    expect(s).toContain('q 100 0 0 100 10 180 cm /Im0 Do Q');
    // Parentheses and backslashes escaped, non-WinAnsi replaced.
    expect(s).toContain('(Hi \\(there\\) \\\\ ?) Tj');

    // Every stream's /Length matches its payload.
    for (const m of s.matchAll(/\/Length (\d+)>>\nstream\n/g)) {
      const start = m.index! + m[0].length;
      expect(s.slice(start + Number(m[1]), start + Number(m[1]) + 10)).toBe('\nendstream');
    }
  });

  it('measures and fits Helvetica text', () => {
    expect(measureHelvetica('A', 10)).toBeCloseTo(6.67);
    const fitted = fitHelvetica('https://example.com/a/very/long/path', 9, 80);
    expect(fitted.endsWith('...')).toBe(true);
    expect(measureHelvetica(fitted, 9)).toBeLessThanOrEqual(80);
    expect(fitHelvetica('short', 9, 80)).toBe('short');
  });
});
