# React QR Master

> The ultimate all-in-one QR Code ecosystem for React — generator, scanner, studio, analytics, dynamic, batch, and 100+ templates.

[![npm version](https://img.shields.io/npm/v/react-qr-master)](https://www.npmjs.com/package/react-qr-master)
[![React 18+](https://img.shields.io/badge/React-18+-blue)](https://react.dev)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

✨ **16 Built-in QR Types** — Website, Text, WiFi, Email, Phone, SMS, WhatsApp, Contact, Google Maps, Location, Event, Calendar, UPI, Crypto, Social, and Generic QR codes

🎨 **10 Professional Themes** — Light, Dark, Neon, Corporate, Glassmorphism, Gradient, Modern, Minimal, Cyberpunk, and Premium

🎭 **9 Animations** — Pulse, Zoom, Bounce, Rotate, Fade, Wave, Glow, Breathing, and Scan effects

🧩 **Module Customization** — 8 module shapes (square, rounded, circle, diamond, hexagon, star, etc.) with spacing control

🔧 **Advanced Styling** — Corner styles, eye shapes, color customization, gradients, and error correction levels (L/M/Q/H)

📥 **Multi-Format Downloads** — Export as PNG, SVG, or PDF with customizable sizes

📱 **Built-in Scanner** — QR code scanner with camera support, file upload, PDF detection, and history

🎛️ **Interactive Studio** — Full-featured QR code designer with real-time preview

📦 **Batch Generator** — Create multiple QR codes from CSV data

🔄 **Dynamic QR** — Generate dynamic QR codes that redirect to configurable URLs

📊 **Analytics** — Track QR code scans and performance metrics

## Installation

```bash
npm install react-qr-master
```

## Quick Start

### Basic QR Code

```tsx
import { QRCode } from 'react-qr-master';

export default function App() {
  return <QRCode value="https://example.com" size={256} />;
}
```

### Website QR

```tsx
import { WebsiteQR } from 'react-qr-master';

<WebsiteQR url="https://example.com" size={256} />
```

### With Theme

```tsx
import { QRCode, THEMES } from 'react-qr-master';

<QRCode
  value="https://example.com"
  theme="neon"
  size={256}
/>
```

### Full Customization

```tsx
import { QRCode } from 'react-qr-master';

<QRCode
  value="https://example.com"
  size={300}
  level="H"
  shape="hexagon"
  cornerStyle="modern"
  eyeShape="modern"
  moduleSpacing={0.15}
  fgColor="#667eea"
  bgColor="#ffffff"
  animation="pulse"
/>
```

## Available QR Types

| Type | Component | Props |
|------|-----------|-------|
| Generic | `QRCode` | `value` |
| Website | `WebsiteQR` | `url` |
| Text | `TextQR` | `text` |
| WiFi | `WiFiQR` | `ssid, password, security` |
| Email | `EmailQR` | `email, subject, body` |
| Phone | `PhoneQR` | `phone` |
| SMS | `SMSQR` | `phone, message` |
| WhatsApp | `WhatsAppQR` | `phone, message` |
| Contact | `ContactQR` | `name, email, phone, org` |
| Google Maps | `GoogleMapsQR` | `lat, lng, zoom` |
| Location | `LocationQR` | `lat, lng, altitude` |
| Event | `EventQR` | `title, startDate, startTime, location` |
| Calendar | `CalendarQR` | `title, startDate, startTime, endDate, endTime` |
| UPI | `UPIQR` | `upiId, payeeName, amount` |
| Crypto | `CryptoQR` | `coin, address` |
| Social | `SocialQR` | `platform, handle` |

## Themes

Pre-built professional themes ready to use:

```tsx
// Light theme (default)
<QRCode value="..." theme="light" />

// Dark theme
<QRCode value="..." theme="dark" />

// Neon with glow animation
<QRCode value="..." theme="neon" />

// Corporate styling
<QRCode value="..." theme="corporate" />

// Glassmorphism effect
<QRCode value="..." theme="glassmorphism" />

// Gradient modules
<QRCode value="..." theme="gradient" />

// Modern rounded
<QRCode value="..." theme="modern" />

// Minimal dots
<QRCode value="..." theme="minimal" />

// Cyberpunk with stars
<QRCode value="..." theme="cyberpunk" />

// Premium gold luxury
<QRCode value="..." theme="premium" />
```

## Animations

Apply smooth animations to your QR codes:

```tsx
<QRCode value="..." animation="pulse" />
<QRCode value="..." animation="zoom" />
<QRCode value="..." animation="bounce" />
<QRCode value="..." animation="rotate" />
<QRCode value="..." animation="fade" />
<QRCode value="..." animation="wave" />
<QRCode value="..." animation="glow" />
<QRCode value="..." animation="breathing" />
<QRCode value="..." animation="scan" />
```

## Module Customization

### Shapes
8 different module shapes for visual variety:

```tsx
<QRCode value="..." shape="square" />
<QRCode value="..." shape="rounded" />
<QRCode value="..." shape="extra-rounded" />
<QRCode value="..." shape="circle" />
<QRCode value="..." shape="dot" />
<QRCode value="..." shape="diamond" />
<QRCode value="..." shape="hexagon" />
<QRCode value="..." shape="star" />
```

### Module Spacing
Create visible gaps between modules:

```tsx
// No gap (0 = solid)
<QRCode value="..." moduleSpacing={0} />

// Small gap (0.1)
<QRCode value="..." moduleSpacing={0.1} />

// Medium gap (0.25)
<QRCode value="..." moduleSpacing={0.25} />

// Large gap (0.5 = maximum)
<QRCode value="..." moduleSpacing={0.5} />
```

### Corner & Eye Styles

```tsx
// Corner styles
<QRCode value="..." cornerStyle="square" />
<QRCode value="..." cornerStyle="rounded" />
<QRCode value="..." cornerStyle="soft-rounded" />
<QRCode value="..." cornerStyle="circle" />
<QRCode value="..." cornerStyle="modern" />

// Eye shapes
<QRCode value="..." eyeShape="square" />
<QRCode value="..." eyeShape="rounded" />
<QRCode value="..." eyeShape="circle" />
<QRCode value="..." eyeShape="diamond" />
<QRCode value="..." eyeShape="modern" />
```

## Download QR Codes

Export QR codes in multiple formats:

```tsx
import { useQRDownload } from 'react-qr-master';

function MyComponent() {
  const { downloadPNG, downloadSVG, downloadPDF } = useQRDownload();

  return (
    <>
      <button onClick={() => downloadPNG('qr-code', 300)}>
        Download PNG
      </button>
      <button onClick={() => downloadSVG('qr-code', 300)}>
        Download SVG
      </button>
      <button onClick={() => downloadPDF('qr-code', 300)}>
        Download PDF
      </button>
    </>
  );
}
```

## Interactive Studio

Full-featured QR code designer:

```tsx
import { QRStudio } from 'react-qr-master';

<QRStudio
  initialValue="https://example.com"
  onCodeGenerated={(props) => console.log(props)}
/>
```

## QR Scanner

Scan QR codes with camera support:

```tsx
import { QRScanner } from 'react-qr-master';

<QRScanner
  onScan={(result) => console.log('Scanned:', result)}
  onError={(error) => console.error(error)}
/>
```

Features:
- 📷 Camera-based scanning
- 📁 File upload support (PNG, JPEG, WebP, PDF, SVG)
- ✅ Automatic QR detection
- 🔦 Torch/flashlight support
- 📱 Mobile-friendly
- 📋 Scan history

## Batch Generator

Create multiple QR codes at once:

```tsx
import { QRBatchGenerator } from 'react-qr-master';

const data = [
  { url: 'https://example1.com', name: 'QR1' },
  { url: 'https://example2.com', name: 'QR2' },
];

<QRBatchGenerator
  data={data}
  onGenerated={(codes) => console.log(codes)}
/>
```

## Dynamic QR

Create QR codes with editable targets:

```tsx
import { DynamicQRCode } from 'react-qr-master';

<DynamicQRCode
  shortCode="abc123"
  targetUrl="https://example.com"
  expiresAt={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
/>
```

## Custom Gradients

Apply gradient effects to modules:

```tsx
<QRCode
  value="https://example.com"
  gradient={{
    type: 'linear',
    colors: ['#667eea', '#764ba2', '#f093fb'],
    rotation: 135,
  }}
  size={256}
/>
```

## Hooks

### useQRDownload
```tsx
const { downloadPNG, downloadSVG, downloadPDF } = useQRDownload();
```

### useQRGenerator
```tsx
const { generate, error, loading } = useQRGenerator();
```

### useDynamicQR
```tsx
const { create, update, delete: remove } = useDynamicQR({
  domain: 'qr.example.com',
});
```

### useBatchQR
```tsx
const { generate, progress, total } = useBatchQR();
```

### useQRAnalytics
```tsx
const { scans, summary } = useQRAnalytics(qrId);
```

## Complete Example

```tsx
import React, { useState } from 'react';
import {
  QRCode,
  WebsiteQR,
  THEMES,
  useQRDownload,
} from 'react-qr-master';

export function QRCodeGenerator() {
  const [url, setUrl] = useState('https://example.com');
  const [theme, setTheme] = useState('modern');
  const [shape, setShape] = useState('rounded');
  const [moduleSpacing, setModuleSpacing] = useState(0.1);
  const { downloadPNG, downloadSVG, downloadPDF } = useQRDownload();

  return (
    <div style={{ padding: 40 }}>
      <h1>QR Code Generator</h1>

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
        style={{ padding: 8, marginBottom: 20 }}
      />

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        style={{ padding: 6, marginLeft: 10, marginBottom: 20 }}
      >
        {Object.keys(THEMES).map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>

      <div style={{
        padding: 30,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        marginBottom: 20,
        textAlign: 'center',
      }}>
        <QRCode
          value={url}
          theme={theme as any}
          shape={shape as any}
          moduleSpacing={moduleSpacing}
          size={256}
        />
      </div>

      <button onClick={() => downloadPNG('qr-code', 256)}>Download PNG</button>
      <button onClick={() => downloadSVG('qr-code', 256)}>Download SVG</button>
      <button onClick={() => downloadPDF('qr-code', 256)}>Download PDF</button>
    </div>
  );
}
```

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import type {
  QRCodeProps,
  QRTheme,
  QRAnimation,
  QRTemplate,
  ModuleShape,
  CornerStyle,
  EyeShape,
} from 'react-qr-master';
```

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ❌ IE11 (uses ES6+ features)

## Performance

- **Lightweight**: ~150 KB (ESM), ~155 KB (CJS)
- **Tree-shakeable**: Only import what you need
- **Optimized**: Minified source maps for debugging
- **Fast**: SVG-based rendering, no canvas overhead

## API Reference

For detailed API documentation, see [FEATURES.md](./FEATURES.md).

## License

MIT © [2024-present]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

**Ready to generate beautiful QR codes? Install today:**

```bash
npm install react-qr-master
```

For more examples and interactive demos, visit the repository and run:

```bash
npm run playground
```
