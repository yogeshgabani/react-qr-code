import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { QRCode } from '../src';
import { layoutLabel, type LabelPosition, type LabelStyle } from '../src/core/label';

const styles: LabelStyle[] = ['banner', 'pill', 'plain'];
const positions: LabelPosition[] = ['bottom', 'top'];

function viewBox(svg: string): number[] {
  return /viewBox="([^"]+)"/.exec(svg)![1]!.split(' ').map(Number);
}

describe('layoutLabel', () => {
  // 33 = a version-2 QR (25 modules) plus a 4-module quiet zone on each side.
  const total = 33;
  const margin = 4;

  for (const style of styles) {
    for (const position of positions) {
      it(`keeps the QR and label inside the drawing (${style}, ${position})`, () => {
        const l = layoutLabel('SCAN ME', style, position, total, margin);
        expect(l.qrX).toBeGreaterThanOrEqual(0);
        expect(l.qrY).toBeGreaterThanOrEqual(0);
        expect(l.qrX + total).toBeLessThanOrEqual(l.width + 1e-9);
        expect(l.qrY + total).toBeLessThanOrEqual(l.height + 1e-9);
        expect(l.textY).toBeGreaterThan(0);
        expect(l.textY).toBeLessThan(l.height);
        // The label sits outside the QR's data area.
        const modulesTop = l.qrY + margin;
        const modulesBottom = l.qrY + total - margin;
        if (position === 'bottom') expect(l.textY - l.fontSize).toBeGreaterThan(modulesBottom);
        else expect(l.textY).toBeLessThan(modulesTop);
      });
    }
  }

  it('keeps at least 2 modules between the code and a pill or plain label', () => {
    for (const style of ['pill', 'plain'] as const) {
      for (const m of [0, 1, 4, 8]) {
        const t = 25 + m * 2;
        const bottom = layoutLabel('SCAN ME', style, 'bottom', t, m);
        const boxTop = bottom.pill?.y ?? bottom.textY - bottom.fontSize;
        expect(boxTop - (t - m)).toBeGreaterThanOrEqual(2 - 1e-9);
      }
    }
  });

  it('places top and bottom labels symmetrically', () => {
    for (const style of styles) {
      const top = layoutLabel('SCAN ME', style, 'top', total, margin);
      const bottom = layoutLabel('SCAN ME', style, 'bottom', total, margin);
      expect(top.height).toBeCloseTo(bottom.height);
      expect(top.width).toBeCloseTo(bottom.width);
    }
  });

  it('shrinks long text to fit the width', () => {
    const short = layoutLabel('SCAN ME', 'banner', 'bottom', total, margin);
    const long = layoutLabel('Scan to see our full menu and order from your table', 'banner', 'bottom', total, margin);
    expect(long.fontSize).toBeLessThan(short.fontSize);
    // The band height doesn't depend on the text.
    expect(long.height).toBeCloseTo(short.height);

    const pill = layoutLabel('Scan to see our full menu and order', 'pill', 'bottom', total, margin);
    expect(pill.pill!.x).toBeGreaterThanOrEqual(0);
    expect(pill.pill!.x + pill.pill!.width).toBeLessThanOrEqual(total);
  });
});

describe('QRCode label', () => {
  it('leaves the SVG untouched without a label', () => {
    const plain = renderToStaticMarkup(<QRCode value="https://example.com" size={200} />);
    const [, , w, h] = viewBox(plain);
    expect(w).toBe(h);
    expect(plain).toContain('height="200"');
    expect(plain).not.toContain('<text');
    expect(renderToStaticMarkup(<QRCode value="https://example.com" size={200} label="   " />)).toBe(plain);
  });

  it('keeps size as the width and grows taller for the label', () => {
    for (const labelStyle of styles) {
      const svg = renderToStaticMarkup(
        <QRCode value="https://example.com" size={200} label="SCAN ME" labelStyle={labelStyle} />,
      );
      const [, , w, h] = viewBox(svg);
      expect(h).toBeGreaterThan(w!);
      expect(svg).toContain('width="200"');
      expect(svg).toContain(`height="${(200 * h!) / w!}"`);
      expect(svg).toContain('>SCAN ME</text>');
    }
  });

  it('colours the label from the QR by default and accepts overrides', () => {
    const banner = renderToStaticMarkup(
      <QRCode value="x" label="SCAN ME" fgColor="#112233" bgColor="#fefefe" />,
    );
    expect(banner).toMatch(/<rect width="[\d.]+" height="[\d.]+" fill="#112233"/);
    expect(banner).toMatch(/<text[^>]*fill="#fefefe"/);

    const plain = renderToStaticMarkup(
      <QRCode value="x" label="SCAN ME" labelStyle="plain" fgColor="#112233" labelBackground="#ff0000" />,
    );
    expect(plain).toMatch(/<text[^>]*fill="#112233"/);

    const custom = renderToStaticMarkup(
      <QRCode value="x" label="SCAN ME" labelStyle="pill" labelColor="#00ff00" labelBackground="#0000ff" />,
    );
    expect(custom).toMatch(/<rect[^>]*fill="#0000ff"/);
    expect(custom).toMatch(/<text[^>]*fill="#00ff00"/);
  });

  it('escapes label text', () => {
    const svg = renderToStaticMarkup(<QRCode value="x" label={'<b>"hi"</b>'} />);
    expect(svg).not.toContain('<b>');
    expect(svg).toContain('&lt;b&gt;');
  });
});
