import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { QRCode, THEMES, UPIQR, WiFiQR, type ModuleShape } from '../src';

const shapes: ModuleShape[] = [
  'square',
  'rounded',
  'extra-rounded',
  'circle',
  'dot',
  'diamond',
  'hexagon',
  'star',
];

describe('server rendering', () => {
  it('renders every shape and theme without touching browser globals', () => {
    for (const shape of shapes) {
      expect(renderToStaticMarkup(<QRCode value="https://example.com" shape={shape} />)).toMatch(/^<svg/);
    }
    for (const theme of Object.keys(THEMES) as Array<keyof typeof THEMES>) {
      expect(renderToStaticMarkup(<QRCode value="https://example.com" theme={theme} />)).toMatch(/^<svg/);
    }
  });

  it('renders logos, gradients and type wrappers', () => {
    const html = renderToStaticMarkup(
      <>
        <QRCode
          value="x"
          logo="/logo.png"
          logoShape="circle"
          gradient={{ type: 'linear', colors: ['#000', '#333'] }}
        />
        <QRCode value="x" gradient={{ type: 'conic', colors: ['#000', '#333'] }} />
        <WiFiQR ssid="Home" password="secret" />
        <UPIQR payeeVPA="shop@upi" payeeName="Shop" amount={10} />
      </>,
    );
    expect(html.match(/<svg/g)).toHaveLength(4);
    expect(html).toContain('href="/logo.png"');
  });
});

describe('core entry', () => {
  it('exports the server-safe subset and renders it', async () => {
    const core = await import('../src/entry-core');
    expect(renderToStaticMarkup(<core.WiFiQR ssid="Home" password="secret" />)).toMatch(/^<svg/);
    expect(core.encodeWiFi({ ssid: 'Cafe', password: 'latte' })).toBe('WIFI:T:WPA;S:Cafe;P:latte;;');
    expect('useQRDownload' in core).toBe(false);
  });
});
