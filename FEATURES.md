# React QR Master - Complete Features Guide

This guide shows you how to use all the features available in react-qr-master, exactly as they appear in the live playground.

## 16 Built-in QR Types

### 1. Website QR
```tsx
import { WebsiteQR } from 'react-qr-master';

<WebsiteQR url="https://example.com" size={256} />
```

### 2. Text QR
```tsx
import { TextQR } from 'react-qr-master';

<TextQR text="Hello World" size={256} />
```

### 3. WiFi QR
```tsx
import { WiFiQR } from 'react-qr-master';

<WiFiQR ssid="Network" password="pass123" security="WPA" size={256} />
```

### 4. Email QR
```tsx
import { EmailQR } from 'react-qr-master';

<EmailQR email="user@example.com" subject="Hello" body="Message" size={256} />
```

### 5. Phone QR
```tsx
import { PhoneQR } from 'react-qr-master';

<PhoneQR phone="+1234567890" size={256} />
```

### 6. SMS QR
```tsx
import { SMSQR } from 'react-qr-master';

<SMSQR phone="+1234567890" message="Hello" size={256} />
```

### 7. WhatsApp QR
```tsx
import { WhatsAppQR } from 'react-qr-master';

<WhatsAppQR phone="+1234567890" message="Hello" size={256} />
```

### 8. Contact QR
```tsx
import { ContactQR } from 'react-qr-master';

<ContactQR
  name="John Doe"
  email="john@example.com"
  phone="+1234567890"
  organization="Acme"
  size={256}
/>
```

### 9. Google Maps QR
```tsx
import { GoogleMapsQR } from 'react-qr-master';

<GoogleMapsQR lat={40.7128} lng={-74.0060} zoom={15} size={256} />
```

### 10. Location QR
```tsx
import { LocationQR } from 'react-qr-master';

<LocationQR lat={40.7128} lng={-74.0060} altitude={0} size={256} />
```

### 11. Event QR
```tsx
import { EventQR } from 'react-qr-master';

<EventQR
  title="Conference"
  startDate="2024-06-15"
  startTime="10:00"
  location="Hall A"
  size={256}
/>
```

### 12. Calendar QR
```tsx
import { CalendarQR } from 'react-qr-master';

<CalendarQR
  title="Meeting"
  startDate="2024-06-15"
  startTime="14:30"
  endDate="2024-06-15"
  endTime="15:30"
  location="Room 101"
  size={256}
/>
```

### 13. UPI QR
```tsx
import { UPIQR } from 'react-qr-master';

<UPIQR upiId="user@bank" payeeName="John" amount={100} size={256} />
```

### 14. Crypto QR
```tsx
import { CryptoQR } from 'react-qr-master';

<CryptoQR coin="bitcoin" address="1A1z7agoat..." size={256} />
```

### 15. Social QR
```tsx
import { SocialQR } from 'react-qr-master';

<SocialQR platform="twitter" handle="@username" size={256} />
```

### 16. Generic QR
```tsx
import { QRCode } from 'react-qr-master';

<QRCode value="Any text or URL" size={256} />
```

## Core QRCode Component with All Styling Options

### Full-Featured Example
```tsx
import { QRCode, THEMES } from 'react-qr-master';

<QRCode
  value="https://example.com"
  size={300}
  level="H"  // Error correction: L, M, Q, H
  shape="rounded"  // square, rounded, extra-rounded, circle, dot, diamond, hexagon, star
  cornerStyle="modern"  // square, rounded, soft-rounded, circle, modern
  eyeShape="modern"  // square, rounded, circle, diamond, modern
  fgColor="#000000"
  bgColor="#ffffff"
  moduleSpacing={0.1}  // 0-0.5, creates gaps between modules
  theme="neon"  // or use a custom theme
/>
```

## Module Shapes
Create unique QR codes with different module designs:

```tsx
const shapes = [
  'square',
  'rounded',
  'extra-rounded',
  'circle',
  'dot',
  'diamond',
  'hexagon',
  'star',
];

shapes.map(shape => (
  <QRCode
    key={shape}
    value="https://example.com"
    shape={shape}
    size={200}
  />
));
```

## Corner Styles
Customize the finder pattern (corner) appearance:

```tsx
const cornerStyles = [
  'square',
  'rounded',
  'soft-rounded',
  'circle',
  'modern',
];

cornerStyles.map(style => (
  <QRCode
    key={style}
    value="https://example.com"
    cornerStyle={style}
    size={200}
  />
));
```

## Eye Shapes
Customize the inner part of finder patterns:

```tsx
const eyeShapes = [
  'square',
  'rounded',
  'circle',
  'diamond',
  'modern',
];

eyeShapes.map(shape => (
  <QRCode
    key={shape}
    value="https://example.com"
    eyeShape={shape}
    size={200}
  />
));
```

## Module Spacing
Create visually separated modules:

```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
  <div>
    <p>No spacing (0)</p>
    <QRCode value="https://example.com" moduleSpacing={0} size={200} />
  </div>
  <div>
    <p>Medium (0.25)</p>
    <QRCode value="https://example.com" moduleSpacing={0.25} size={200} />
  </div>
  <div>
    <p>Maximum (0.5)</p>
    <QRCode value="https://example.com" moduleSpacing={0.5} size={200} />
  </div>
</div>
```

## 10 Professional Themes

### Available Themes
```tsx
import { THEMES } from 'react-qr-master';

// Light: Clean white background with dark modules
<QRCode value="..." theme="light" size={200} />

// Dark: Dark background with light modules
<QRCode value="..." theme="dark" size={200} />

// Neon: Cyan modules on dark purple with glow animation
<QRCode value="..." theme="neon" size={200} />

// Corporate: Professional blue and red styling
<QRCode value="..." theme="corporate" size={200} />

// Glassmorphism: Frosted glass effect with indigo accents
<QRCode value="..." theme="glassmorphism" size={200} />

// Gradient: Purple to pink gradient modules
<QRCode value="..." theme="gradient" size={200} />

// Modern: Clean rounded corners with dark text
<QRCode value="..." theme="modern" size={200} />

// Minimal: Minimalist dot design
<QRCode value="..." theme="minimal" size={200} />

// Cyberpunk: Yellow and magenta neon with star shapes
<QRCode value="..." theme="cyberpunk" size={200} />

// Premium: Gold and dark luxury styling with hexagons
<QRCode value="..." theme="premium" size={200} />
```

## Custom Themes
```tsx
import { QRCode } from 'react-qr-master';

<QRCode
  value="https://example.com"
  fgColor="#667eea"
  bgColor="#ffffff"
  shape="hexagon"
  cornerStyle="modern"
  eyeShape="modern"
  gradient={{
    type: 'linear',
    colors: ['#667eea', '#764ba2'],
    rotation: 135,
  }}
  size={250}
/>
```

## Animations
Apply smooth animations to your QR codes:

```tsx
import { QRCode } from 'react-qr-master';

const animations = [
  'pulse',      // Gentle scale pulse
  'zoom',       // Larger zoom in and out
  'bounce',     // Vertical bounce effect
  'rotate',     // 360 degree rotation
  'fade',       // Opacity fade in and out
  'wave',       // Horizontal skew wave
  'glow',       // Drop shadow glow effect
  'breathing',  // Subtle breathing animation
  'scan',       // Scanning line effect
];

animations.map(anim => (
  <QRCode
    key={anim}
    value="https://example.com"
    animation={anim}
    size={200}
  />
));
```

## Error Correction Levels
Higher error correction allows QR to be scanned even if partially damaged:

```tsx
// L: ~7% error correction (smallest size)
<QRCode value="..." level="L" />

// M: ~15% error correction (default, balanced)
<QRCode value="..." level="M" />

// Q: ~25% error correction
<QRCode value="..." level="Q" />

// H: ~30% error correction (largest size, most robust)
<QRCode value="..." level="H" />
```

## Download Utilities
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

## QRStudio - Interactive Designer
Build QR codes with a complete UI:

```tsx
import { QRStudio } from 'react-qr-master';

<QRStudio
  initialValue="https://example.com"
  onCodeGenerated={(props) => console.log(props)}
/>
```

## QRScanner - Scan QR Codes
Add scanning functionality with camera support:

```tsx
import { QRScanner } from 'react-qr-master';

<QRScanner
  onScan={(result) => console.log('Scanned:', result)}
  onError={(error) => console.error(error)}
/>
```

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
Create QR codes that update links without changing the code:

```tsx
import { DynamicQRCode } from 'react-qr-master';

<DynamicQRCode
  shortCode="abc123"
  targetUrl="https://example.com"
  expiresAt={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
/>
```

## Complete Real-World Example

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
  const [size, setSize] = useState(250);
  const [theme, setTheme] = useState('modern');
  const [shape, setShape] = useState('rounded');
  const [moduleSpacing, setModuleSpacing] = useState(0);
  const { downloadPNG, downloadSVG, downloadPDF } = useQRDownload();

  return (
    <div style={{ padding: 40 }}>
      <h1>QR Code Generator</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          style={{ padding: 8, width: 300, marginRight: 10 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Size: {size}px</label>
        <input
          type="range"
          min="120"
          max="600"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          style={{ width: 300 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Theme:</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{ padding: 6, marginLeft: 10 }}
        >
          {Object.keys(THEMES).map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Module Shape:</label>
        <select
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          style={{ padding: 6, marginLeft: 10 }}
        >
          {['square', 'rounded', 'circle', 'diamond', 'hexagon', 'star'].map(
            (s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ),
          )}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Module Spacing: {(moduleSpacing * 100).toFixed(0)}%</label>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.05"
          value={moduleSpacing}
          onChange={(e) => setModuleSpacing(parseFloat(e.target.value))}
          style={{ width: 300 }}
        />
      </div>

      <div
        style={{
          padding: 30,
          backgroundColor: '#f5f5f5',
          borderRadius: 12,
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        <QRCode
          value={url}
          size={size}
          theme={theme as any}
          shape={shape as any}
          moduleSpacing={moduleSpacing}
        />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => downloadPNG('qr-code', size)}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Download PNG
        </button>
        <button
          onClick={() => downloadSVG('qr-code', size)}
          style={{
            padding: '10px 20px',
            background: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Download SVG
        </button>
        <button
          onClick={() => downloadPDF('qr-code', size)}
          style={{
            padding: '10px 20px',
            background: '#f59e0b',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
```

## Advanced Features

### Getting Animation CSS
If you need to manually apply animations:

```tsx
import { getAnimationCSS } from 'react-qr-master';

const pulseCSS = getAnimationCSS('pulse');
console.log(pulseCSS); // Returns keyframes and class
```

### Color Gradients
Apply gradient colors to modules:

```tsx
<QRCode
  value="https://example.com"
  gradient={{
    type: 'linear',
    colors: ['#667eea', '#764ba2', '#f093fb'],
    rotation: 135,
  }}
  size={250}
/>
```

## Export All Components & Utilities

The library exports everything you need:

```tsx
// Components
import {
  QRCode,
  WebsiteQR,
  TextQR,
  WiFiQR,
  EmailQR,
  PhoneQR,
  SMSQR,
  WhatsAppQR,
  ContactQR,
  GoogleMapsQR,
  LocationQR,
  EventQR,
  CalendarQR,
  UPIQR,
  CryptoQR,
  SocialQR,
  QRScanner,
  QRStudio,
  QRBatchGenerator,
  DynamicQRCode,
} from 'react-qr-master';

// Hooks
import {
  useQRDownload,
  useQRGenerator,
  useDynamicQR,
  useBatchQR,
  useQRAnalytics,
} from 'react-qr-master';

// Utilities
import {
  downloadQR,
  THEMES,
  TEMPLATES,
  getAnimationCSS,
} from 'react-qr-master';

// Types
import type {
  QRCodeProps,
  QRTheme,
  QRAnimation,
  QRTemplate,
} from 'react-qr-master';
```

## Tips & Best Practices

1. **Module Spacing**: Use 0.1-0.2 for subtle gaps, 0.3+ for dramatic effect
2. **Error Correction**: Use "H" for small QR codes that might be damaged
3. **Themes**: Cyberpunk and Premium themes work great for modern designs
4. **Animations**: Keep animations subtle in production (pulse, breathing, fade)
5. **Downloads**: Always test download functionality across different browsers
6. **Responsive**: Use size based on container width for responsive designs
7. **Colors**: Ensure high contrast between foreground and background for scanning

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported (uses ES6+ features)

---

**For more examples and the interactive playground, visit the repository!**
