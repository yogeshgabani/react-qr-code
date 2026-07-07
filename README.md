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
# or
yarn add react-qr-master
# or
pnpm add react-qr-master
```

**Requirements:** React **18+** and React DOM **18+** (they are peer dependencies, so they use the versions already in your app). Works with any React setup — Vite, Next.js, Create React App, Remix, etc.

The package ships ESM + CJS builds and its own TypeScript types — no `@types` package needed.

## Getting Started (How to Use)

The whole library is just React components — import one, give it a `value`, and render it. No provider, no config, no async setup.

### 1. Render your first QR code

```tsx
import { QRCode } from "react-qr-master";

export default function App() {
  return <QRCode value="https://example.com" size={256} />;
}
```

That's it — `value` is the only required prop. `value` can be any string: a URL, plain text, a phone number, WiFi string, etc.

### 2. Style it

Every visual prop is optional and composable:

```tsx
<QRCode
  value="https://example.com"
  size={280}
  fgColor="#4f46e5" // module color
  bgColor="#ffffff" // background color
  shape="rounded" // module shape
  cornerStyle="rounded" // finder "eye" outer ring
  eyeShape="circle" // finder "eye" inner pupil
  level="H" // error correction: L | M | Q | H
/>
```

### 3. Or use a specialized type

Instead of hand-building the `value`, use a wrapper that encodes it for you:

```tsx
import { WiFiQR, ContactQR } from "react-qr-master";

// Scanning this connects the phone to WiFi automatically
<WiFiQR ssid="HomeNetwork" password="secret123" encryption="WPA2" size={256} />

// Scanning this saves a contact (vCard)
<ContactQR firstName="Jane" lastName="Doe" email="jane@acme.com" mobile="+1 415 555 2671" size={256} />
```

All design props (`shape`, `theme`, `gradient`, `logo`, …) work on every specialized type too.

### 4. Let users download it

Attach the `ref` from `useQRDownload`, then call `download(format)` — see [Download QR Codes](#download-qr-codes) below.

> **Next.js note:** these are client components. In the App Router, add `"use client"` at the top of any file that renders a QR component.

## More Examples

### Website QR

```tsx
import { WebsiteQR } from "react-qr-master";

<WebsiteQR url="https://example.com" size={256} />;
```

### With Theme

```tsx
import { QRCode, THEMES } from "react-qr-master";

<QRCode value="https://example.com" theme="neon" size={256} />;
```

### Full Customization

```tsx
import { QRCode } from "react-qr-master";

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
/>;
```

## Available QR Types

Each specialized component takes the fields below **plus every design prop** of `QRCode` (`size`, `shape`, `theme`, `gradient`, `logo`, colors, …).

| Type        | Component      | Key props                                                  |
| ----------- | -------------- | ---------------------------------------------------------- |
| Generic     | `QRCode`       | `value`                                                    |
| Website     | `WebsiteQR`    | `url`                                                      |
| Text        | `TextQR`       | `text`                                                     |
| WiFi        | `WiFiQR`       | `ssid, password, encryption, hidden`                      |
| Email       | `EmailQR`      | `to, subject, body`                                        |
| Phone       | `PhoneQR`      | `phoneNumber`                                              |
| SMS         | `SMSQR`        | `phoneNumber, message`                                     |
| WhatsApp    | `WhatsAppQR`   | `phoneNumber, message`                                     |
| Contact     | `ContactQR`    | `firstName, lastName, email, mobile, organization, website`|
| Google Maps | `GoogleMapsQR` | `query` _or_ `latitude, longitude`                        |
| Location    | `LocationQR`   | `latitude, longitude, query`                              |
| Event       | `EventQR`      | `title, start, end, location`                             |
| Calendar    | `CalendarQR`   | `title, start, end, recurrence`                           |
| UPI         | `UPIQR`        | `payeeVPA, payeeName, amount, note`                       |
| Crypto      | `CryptoQR`     | `coin, address, amount`                                   |
| Social      | `SocialQR`     | `platform, username`                                      |

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

Use the `useQRDownload` hook. It gives you a `ref` (attach it to the `QRCode`) and a `download(format, options?)` function.

```tsx
import { QRCode, useQRDownload } from "react-qr-master";

function DownloadableQR() {
  const { ref, download } = useQRDownload();

  return (
    <>
      <QRCode ref={ref} value="https://example.com" size={256} />

      <button onClick={() => download("png", { pixelSize: 1024 })}>PNG</button>
      <button onClick={() => download("svg")}>SVG</button>
      <button onClick={() => download("pdf", { filename: "my-qr.pdf" })}>PDF</button>
    </>
  );
}
```

**Supported formats:** `"svg"`, `"png"`, `"jpg"`, `"jpeg"`, `"webp"`, `"pdf"`.

**Options** (second argument, all optional):

| Option      | Type     | Default          | Description                                  |
| ----------- | -------- | ---------------- | -------------------------------------------- |
| `filename`  | `string` | `qrcode.<format>`| Downloaded file name.                        |
| `pixelSize` | `number` | `1024`           | Output resolution in px (raster/PDF formats).|
| `quality`   | `number` | —                | 0–1 quality for `jpg` / `webp`.              |

## Interactive Studio

Full-featured QR code designer:

```tsx
import { QRStudio } from "react-qr-master";

<QRStudio initialValue="https://example.com" />;
```

## QR Scanner

Scan QR codes with camera support:

```tsx
import { QRScanner } from "react-qr-master";

<QRScanner
  onScan={(result) => console.log("Scanned:", result)}
  onError={(error) => console.error(error)}
/>;
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
import { QRBatchGenerator } from "react-qr-master";

const rows = [
  { id: "qr1", value: "https://example1.com", label: "QR1" },
  { id: "qr2", value: "https://example2.com", label: "QR2" },
];

<QRBatchGenerator
  initialRows={rows}
  qrOptions={{ shape: "rounded", size: 256 }}
  exportPixelSize={1024}
/>;
```

Users can also import rows from CSV / JSON inside the component and export the whole batch as a ZIP of PNGs or a paginated PDF.

## Dynamic QR

Create QR codes with editable targets:

```tsx
import { DynamicQRCode } from "react-qr-master";

<DynamicQRCode
  id="promo-2026"
  initialValue="https://example.com"
  maxScans={1000}
  expiresAt={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
  size={256}
/>;
```

State is stored client-side (localStorage). For true cross-device dynamic QR (edit the target after printing), point the QR at your own redirect endpoint.

## Custom Gradients

Apply gradient effects to modules:

```tsx
<QRCode
  value="https://example.com"
  gradient={{
    type: "linear", // "linear" | "radial" | "conic"
    colors: ["#667eea", "#764ba2", "#f093fb"],
    rotation: 135, // degrees (ignored for radial)
  }}
  size={256}
/>
```

## Logo / Branding

Drop a logo in the center of the QR. When a `logo` is set, error correction auto-bumps to `H` so the code still scans reliably.

```tsx
<QRCode
  value="https://example.com"
  size={300}
  logo="/logo.png" // URL or data URI (PNG / SVG / JPG / WEBP)
  logoSize={0.22} // fraction of QR size, 0–0.5 (default 0.2)
  logoShape="rounded" // "square" | "rounded" | "circle"
  logoPadding={1} // quiet space around the logo, in module units
/>
```

Extra logo controls:

| Prop              | Type                                     | Description                                                     |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------- |
| `logoMode`        | `"foreground" \| "embedded" \| "background"` | `foreground` = box behind logo; `embedded` = no box; `background` = image fills the QR. |
| `logoPosition`    | `"center" \| "top" \| "bottom" \| "left" \| "right"` | Placement (ignored in `background` mode).              |
| `logoBorderColor` | `string`                                 | Border color around the logo cut-out.                          |
| `logoBorderWidth` | `number`                                 | Border thickness in module units.                              |

> **Tip:** keep `logoSize` around `0.2`. Too large and the logo covers more modules than the error correction can recover, breaking scans.

## Hooks

### useQRDownload

```tsx
const { ref, download } = useQRDownload();
// attach ref to <QRCode ref={ref} .../>, then:
download("png", { pixelSize: 1024, filename: "qr.png" });
```

### useQRGenerator

Headless — returns the raw module matrix for custom rendering (canvas, native, ASCII, …).

```tsx
const matrix = useQRGenerator("https://example.com", "M");
// matrix.size, matrix.modules (boolean[][])
```

### useDynamicQR

Client-side dynamic-QR state, persisted to `localStorage`.

```tsx
const { value, setValue, recordScan, reset, scanCount, expired, overUsed } =
  useDynamicQR({
    id: "promo-2026",
    initialValue: "https://example.com/landing",
    maxScans: 1000,
    expiresAt: "2026-12-31",
  });
```

### useBatchQR

Import rows from CSV / JSON, then render or export them.

```tsx
const { rows, setRows, importCSV, importJSON, clear, error } = useBatchQR();
```

### useQRAnalytics

Client-side scan tracking + summary.

```tsx
const { summary, track, clear } = useQRAnalytics();
track("qr-id", "https://example.com"); // record a scan
```

## Complete Example

```tsx
import React, { useState } from "react";
import { QRCode, WebsiteQR, THEMES, useQRDownload } from "react-qr-master";

export function QRCodeGenerator() {
  const [url, setUrl] = useState("https://example.com");
  const [theme, setTheme] = useState("modern");
  const [shape, setShape] = useState("rounded");
  const [moduleSpacing, setModuleSpacing] = useState(0.1);
  const { ref, download } = useQRDownload();

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

      <div
        style={{
          padding: 30,
          backgroundColor: "#f5f5f5",
          borderRadius: 12,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <QRCode
          ref={ref}
          value={url}
          theme={theme as any}
          shape={shape as any}
          moduleSpacing={moduleSpacing}
          size={256}
        />
      </div>

      <button onClick={() => download("png", { pixelSize: 512 })}>Download PNG</button>
      <button onClick={() => download("svg")}>Download SVG</button>
      <button onClick={() => download("pdf")}>Download PDF</button>
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
} from "react-qr-master";
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

MIT © [2024-present] © react-datetime-kit
MIT License - Copyright (c) 2026 **Yogesh Gabani**

Built by **Yogesh Gabani**.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

**Ready to generate beautiful QR codes? Install today:**

```bash
npm install react-qr-master
```

## Interactive Playground

Want to see every type, theme, shape, and the live designer in action? Clone the repo and run the playground:

```bash
# clone this repository, then:
npm install
npm run playground
```
