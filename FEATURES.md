# React QR Master: API Reference

Every component, hook and utility exported by `react-qr-master`, with its real props. All examples on this page are type-checked against the source on every release (`npm run check:docs`), so they stay in sync with the code.

- [QRCode](#qrcode): the core component
- [Specialised QR types](#specialised-qr-types): WiFi, vCard, UPI, WhatsApp, events and more
- [Download, copy, share, verify](#download-copy-share-verify)
- [Scanner](#qrscanner)
- [Studio](#qrstudio), [Batch](#qrbatchgenerator), [Dynamic QR](#dynamicqrcode)
- [Hooks](#hooks)
- [Themes, templates, animations](#themes-templates-animations)
- [Headless utilities](#headless-utilities)

---

## QRCode

```tsx
import { QRCode } from 'react-qr-master';

<QRCode value="https://example.com" size={256} />
```

Renders an `<svg>`. The ref is forwarded to that `<svg>` element.

### Content and size

| Prop     | Type                       | Default | Description                                                                                      |
| -------- | -------------------------- | ------- | ------------------------------------------------------------------------------------------------ |
| `value`  | `string`                   | —       | **Required.** Text to encode. Any UTF-8 text works, including Hindi, emoji and other scripts.     |
| `size`   | `number`                   | `256`   | Width and height in px. With a [`label`](#label) the SVG gets taller; `size` stays the width.     |
| `margin` | `number`                   | `4`     | Quiet zone in modules. Keep at least 4 for reliable scanning.                                    |
| `level`  | `'L' \| 'M' \| 'Q' \| 'H'` | `'M'`   | Error correction (~7 / 15 / 25 / 30 % recovery). Becomes `'H'` automatically when a `logo` is set. |

### Design

| Prop            | Type                                                                                              | Default    | Description                                     |
| --------------- | ------------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------- |
| `fgColor`       | `string`                                                                                          | `#000000`  | Module colour.                                  |
| `bgColor`       | `string`                                                                                          | `#ffffff`  | Background colour.                              |
| `shape`         | `'square' \| 'rounded' \| 'extra-rounded' \| 'circle' \| 'dot' \| 'diamond' \| 'hexagon' \| 'star'` | `'square'` | Data-module shape.                              |
| `cornerStyle`   | `'square' \| 'rounded' \| 'soft-rounded' \| 'circle' \| 'modern'`                                 | `'square'` | Outer ring of the three finder "eyes".          |
| `eyeShape`      | `'square' \| 'rounded' \| 'circle' \| 'diamond' \| 'modern'`                                      | `'square'` | Inner pupil of the eyes.                        |
| `eyeColor`      | `string`                                                                                          | `fgColor`  | Separate colour for the eyes.                   |
| `gradient`      | `{ type: 'linear' \| 'radial' \| 'conic'; colors: string[]; rotation?: number }`                  | —          | Gradient fill for the modules.                  |
| `moduleSpacing` | `number` (0–0.5)                                                                                  | `0`        | Gap between modules, as a fraction of a module. |
| `theme`         | `QRThemeName`                                                                                     | —          | Preset; any prop you pass overrides it.         |
| `animation`     | `QRAnimation`                                                                                     | —          | CSS animation embedded in the SVG.              |
| `frame`         | `'square' \| 'rounded'`                                                                           | `'square'` | Rounds the background corners.                  |

```tsx
<QRCode
  value="https://example.com"
  size={300}
  shape="dot"
  cornerStyle="rounded"
  eyeShape="circle"
  eyeColor="#111827"
  gradient={{ type: 'linear', colors: ['#4f46e5', '#db2777'], rotation: 45 }}
  moduleSpacing={0.1}
/>
```

### Logo

| Prop              | Type                                                  | Default        | Description                                                                                    |
| ----------------- | ----------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| `logo`            | `string`                                              | —              | Image URL or data URI (PNG, SVG, JPG, WEBP).                                                   |
| `logoSize`        | `number`                                              | `0.2`          | Fraction of the QR width. Capped at a safe size for the error-correction level (H: 0.3).        |
| `logoPadding`     | `number`                                              | `1`            | Clear space around the logo, in modules.                                                       |
| `logoShape`       | `'square' \| 'rounded' \| 'circle'`                   | `'square'`     | Clip shape of the logo.                                                                        |
| `logoMode`        | `'foreground' \| 'embedded' \| 'background'`          | `'foreground'` | `foreground` puts a box behind the logo, `embedded` has no box, `background` fills the whole QR. |
| `logoPosition`    | `'center' \| 'top' \| 'bottom' \| 'left' \| 'right'`  | `'center'`     | Placement; ignored in `background` mode.                                                       |
| `logoBorderColor` | `string`                                              | —              | Border around the logo box.                                                                    |
| `logoBorderWidth` | `number`                                              | `0.5`          | Border width in modules.                                                                       |

```tsx
<QRCode value="https://example.com" logo="/logo.png" logoSize={0.22} logoShape="circle" />
```

### Label

A call to action such as "SCAN ME", drawn inside the SVG so downloads, copies and shares include it. `size` stays the width of the SVG and the height grows to fit the label. Long text shrinks to fit the width, so keep it short.

| Prop              | Type                             | Default                | Description                                                                 |
| ----------------- | -------------------------------- | ---------------------- | --------------------------------------------------------------------------- |
| `label`           | `string`                         | —                      | The text. No label is drawn when it's empty.                                |
| `labelStyle`      | `'banner' \| 'pill' \| 'plain'`  | `'banner'`             | `banner` frames the QR and puts the text in a band, `pill` puts it in a rounded button, `plain` is text only. |
| `labelPosition`   | `'bottom' \| 'top'`              | `'bottom'`             | Side of the QR the label sits on.                                           |
| `labelColor`      | `string`                         | `bgColor` / `fgColor`  | Text colour. `bgColor` for `banner` and `pill`, `fgColor` for `plain`.      |
| `labelBackground` | `string`                         | `fgColor`              | Frame and pill colour (the first gradient colour when `gradient` is set).   |
| `labelFont`       | `string`                         | system sans-serif      | CSS `font-family`. Downloads can only use fonts installed on the device, not web fonts. |

```tsx
<>
  <QRCode value="https://example.com/menu" label="SCAN FOR MENU" frame="rounded" />
  <QRCode
    value="https://example.com"
    label="SCAN ME"
    labelStyle="pill"
    labelBackground="#4f46e5"
    gradient={{ type: 'linear', colors: ['#4f46e5', '#db2777'] }}
  />
</>
```

### DOM

`className`, `style`, `id`, and `title`. `title` also sets the accessible name; without it the SVG is labelled "QR code for {value}".

---

## Specialised QR types

Each component builds the correct payload format for its type and accepts **every `QRCode` prop** except `value` (and `title` on `ContactQR`, `EventQR` and `CalendarQR`, where it's part of the data). The matching `encode*` functions return the raw string if you want it without React (see [Headless utilities](#headless-utilities)).

### WebsiteQR

```tsx
<WebsiteQR url="example.com/menu" size={256} />
```

`url`: `https://` is added when the scheme is missing.

### TextQR

```tsx
<TextQR text="Hello world" />
```

### WiFiQR

Scanning joins the network.

```tsx
<WiFiQR ssid="HomeNetwork" password="secret123" encryption="WPA2" />
```

| Prop         | Type                                              | Default |
| ------------ | ------------------------------------------------- | ------- |
| `ssid`       | `string`                                          | —       |
| `password`   | `string`                                          | —       |
| `encryption` | `'WPA' \| 'WPA2' \| 'WPA3' \| 'WEP' \| 'nopass'` | `'WPA'` |
| `hidden`     | `boolean`                                         | `false` |

### EmailQR

```tsx
<EmailQR to="hello@acme.com" subject="Order #42" body="Hi there," />
```

Props: `to` (required), `subject`, `body`, `cc`, `bcc`.

### PhoneQR, SMSQR, WhatsAppQR

```tsx
<>
  <PhoneQR phoneNumber="+1 415 555 2671" />
  <SMSQR phoneNumber="+14155552671" message="I'd like a quote" />
  <WhatsAppQR phoneNumber="14155552671" message="Hi! I saw your ad." />
</>
```

For `WhatsAppQR`, use the country code without `+`; non-digits are stripped.

### ContactQR (vCard 3.0)

Scanning offers to save the contact.

```tsx
<ContactQR
  firstName="Jane"
  lastName="Doe"
  organization="Acme"
  title="CTO"
  mobile="+1 415 555 2671"
  email="jane@acme.com"
  website="https://acme.com"
  address={{ street: '1 Main St', city: 'Springfield', postalCode: '12345', country: 'USA' }}
/>
```

Props: `firstName`, `lastName`, `fullName`, `organization`, `title`, `phone`, `mobile`, `workPhone`, `email`, `website`, `address` (`street`, `city`, `region`, `postalCode`, `country`), `note`.

### GoogleMapsQR and LocationQR

```tsx
<>
  <GoogleMapsQR query="Eiffel Tower, Paris" />
  <GoogleMapsQR latitude={48.8584} longitude={2.2945} />
  <LocationQR latitude={48.8584} longitude={2.2945} query="Eiffel Tower" />
</>
```

`GoogleMapsQR` opens Google Maps (pass `query` or `latitude` + `longitude`). `LocationQR` writes a standard `geo:` URI that any maps app can open; it also takes `accuracy` in metres.

### EventQR and CalendarQR (iCalendar)

```tsx
<>
  <EventQR
    title="Launch party"
    start="2026-11-20T18:00:00+05:30"
    end="2026-11-20T21:00:00+05:30"
    location="Hall A"
  />
  <CalendarQR title="Stand-up" start={new Date('2026-11-02T09:30:00Z')} recurrence="FREQ=WEEKLY;BYDAY=MO,WE,FR" />
</>
```

Props: `title`, `start` (`Date` or ISO string), `end` (default: start + 1 h), `allDay`, `location`, `description`, `url`, `organizer`. `CalendarQR` adds `recurrence` (an iCal RRULE).

### UPIQR (India)

Opens GPay, PhonePe, Paytm, BHIM and other UPI apps with the payment pre-filled.

```tsx
<UPIQR payeeVPA="shop@okhdfc" payeeName="Ravi Stores" amount="249.00" note="Order 42" />
```

Props: `payeeVPA`, `payeeName`, `amount`, `note`, `transactionRef`, `merchantCode`, `currency` (default `'INR'`).

### CryptoQR

```tsx
<>
  <CryptoQR coin="bitcoin" address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" amount="0.001" />
  <CryptoQR coin="usdt" address="0xRecipient" tokenAddress="0xdAC17F958D2ee523a2206206994597C13D831ec7" amount={25} />
</>
```

`coin`: `'bitcoin'` (BIP21), `'ethereum'`, `'polygon'` (EIP-681), `'solana'` (Solana Pay), `'usdt'` (ERC-20 transfer; `tokenAddress` required). Also `amount`, `label`, `message`.

### SocialQR

```tsx
<SocialQR platform="instagram" username="@acme" />
```

`platform`: `'facebook' | 'instagram' | 'linkedin' | 'x' | 'twitter' | 'youtube' | 'tiktok' | 'github' | 'discord'`. `username` can also be a full URL.

---

## Download, copy, share, verify

`useQRDownload()` returns a `ref` for the QR and actions that use it.

```tsx
import { QRCode, useQRDownload } from 'react-qr-master';

function ShareableQR() {
  const { ref, download, copy, share, verify } = useQRDownload();

  return (
    <>
      <QRCode ref={ref} value="https://example.com" size={256} />
      <button onClick={() => download('png', { pixelSize: 1024 })}>PNG</button>
      <button onClick={() => download('pdf', { filename: 'menu-qr.pdf' })}>PDF</button>
      <button onClick={() => copy()}>Copy image</button>
      <button onClick={() => share({ title: 'Our menu' })}>Share</button>
      <button
        onClick={async () => {
          const result = await verify({ expected: 'https://example.com' });
          alert(result.ok ? `Scans fine (score ${result.score})` : result.warnings.join('\n'));
        }}
      >
        Check it scans
      </button>
    </>
  );
}
```

| Action                       | Description                                                                                                                                     |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `download(format, options?)` | `format`: `'svg' \| 'png' \| 'jpg' \| 'jpeg' \| 'webp' \| 'pdf'`. Options: `filename`, `pixelSize` (width in px, default 1024; the height follows the QR, so a labelled QR is taller), `quality` (0–1, JPG/WEBP). PDFs are lossless in modern browsers. |
| `copy(options?)`             | Copies a PNG to the clipboard. Call it from a click handler.                                                                                    |
| `share(options?)`            | Opens the native share sheet (mostly mobile). Resolves `false` if sharing is unsupported or the user cancels. Options: `filename`, `pixelSize`, `title`, `text`. |
| `verify(options?)`           | Decodes the rendered QR to check it really scans. See below.                                                                                    |

The same functions exist standalone for any `<svg>` element: `downloadQR(svg, format, options)`, `copyQR(svg)`, `shareQR(svg, options)`, `canShareQR()` and `verifyQR(svg, options)`.

### verifyQR: does it actually scan?

Styling can produce a QR that looks great and doesn't scan: low contrast, a big logo, wide module spacing, light-on-dark colours. `verify` renders the QR at three sizes, each sharp and with two levels of simulated camera blur, decodes every view, and reports:

| Field      | Type              | Meaning                                                                                       |
| ---------- | ----------------- | --------------------------------------------------------------------------------------------- |
| `ok`       | `boolean`         | Decodes with normal colours, and equals `expected` if you passed one.                         |
| `data`     | `string \| null`  | The decoded text.                                                                             |
| `matches`  | `boolean \| null` | `data === expected`, or `null` without `expected`.                                            |
| `score`    | `number`          | Share of views (0–1) that decoded. Plain codes score about 0.9–1; under 0.5 is fragile.        |
| `inverted` | `boolean`         | Decodes only with colours inverted. Recent phone cameras read these, but some scanner apps don't. |
| `warnings` | `string[]`        | What to fix.                                                                                  |

The decoder is lazy-loaded the first time you call `verify` or mount `QRScanner`, so it costs nothing until then.

---

## QRScanner

Camera scanner (uses the rear camera on phones).

```tsx
import { useRef } from 'react';
import { QRScanner, type QRScannerHandle } from 'react-qr-master';

function Scan() {
  const scanner = useRef<QRScannerHandle>(null);
  return (
    <>
      <QRScanner
        ref={scanner}
        onScan={(result) => console.log(result.data)}
        onError={(error) => console.error(error)}
        pauseOnScan
      />
      <button onClick={() => scanner.current?.toggleTorch()}>Torch</button>
      <button onClick={() => scanner.current?.resume()}>Scan again</button>
    </>
  );
}
```

| Prop            | Type                       | Default         | Description                                |
| --------------- | -------------------------- | --------------- | ------------------------------------------ |
| `onScan`        | `(result) => void`         | —               | Receives `{ data, timestamp }`.            |
| `onError`       | `(error: Error) => void`   | —               | Camera permission or device errors.        |
| `facingMode`    | `'user' \| 'environment'`  | `'environment'` | Which camera to use.                       |
| `deduplicate`   | `boolean`                  | `true`          | Ignore repeated scans of the same value.   |
| `pauseOnScan`   | `boolean`                  | `false`         | Stop after the first successful read.      |
| `showOverlay`   | `boolean`                  | `true`          | Framing reticle and scan line.             |
| `overlayColor`  | `string`                   | `#22d3ee`       | Reticle colour.                            |
| `allowImageUpload` | `boolean`               | `false`         | Adds a "Scan an image" button for photos and screenshots. It also works when the camera is blocked or missing. |
| `width`, `height` | `number \| string`       | `'100%'`, `320` | Viewport size.                             |

Ref methods: `pause()`, `resume()`, `toggleTorch()` (resolves the new torch state; Android Chrome), `isTorchOn()`, and `scanImage(source)`, which reads an image and reports it through `onScan` like the upload button does. Use it for your own upload or drag-and-drop UI.

Camera access needs HTTPS (or `localhost`).

### scanQRFromImage

Reads a QR from an image without any UI. It accepts a `File` or `Blob`, an image URL or data URI, an `<img>`, a `<canvas>` or an `ImageBitmap`. It resolves the decoded text, or `null` when the image has no readable QR. Large photos are downscaled before decoding, and light-on-dark codes are read too.

```tsx
function UploadQR() {
  const [text, setText] = useState<string | null>(null);
  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) setText(await scanQRFromImage(file));
        }}
      />
      <p>{text ?? 'No QR found yet'}</p>
    </>
  );
}
```

An image URL on another origin can only be read if it's served with CORS headers. Otherwise, fetch it yourself and pass the `Blob`.

---

## QRStudio

A complete QR designer UI (content, design, colours, branding tabs) to drop into an app.

```tsx
<QRStudio initialValue="https://example.com" />
```

Props: `initialValue`, `className`, `style`.

---

## QRBatchGenerator

Import rows from CSV or JSON, preview them, and export every QR as a ZIP of PNGs or an A4 PDF sheet (12 per page, labelled).

```tsx
<QRBatchGenerator
  initialRows={[
    { id: 'table-1', value: 'https://example.com/t/1', label: 'Table 1' },
    { id: 'table-2', value: 'https://example.com/t/2', label: 'Table 2' },
  ]}
  qrOptions={{ shape: 'rounded', fgColor: '#111827' }}
  exportPixelSize={1024}
/>
```

CSV needs a header row with a `value` column (or `url` / `text`); `id` and `label` are optional. Comma, semicolon, tab and pipe delimiters are detected automatically. JSON is an array of strings or `{ id?, value, label? }` objects.

---

## DynamicQRCode

A QR whose target you can change after it's shown, with optional expiry and scan limit.

```tsx
<DynamicQRCode
  id="promo-2026"
  initialValue="https://example.com/landing"
  maxScans={1000}
  expiresAt="2026-12-31"
  fallback={<p>This offer has ended.</p>}
/>
```

State lives in the browser's `localStorage`. To change where a printed QR points, encode a URL on your own server and redirect from there.

---

## Hooks

### useQRDownload

See [Download, copy, share, verify](#download-copy-share-verify).

### useQRGenerator

Returns the raw module matrix for custom renderers (canvas, React Native, terminal).

```tsx
function AsciiQR() {
  const { modules } = useQRGenerator('https://example.com', 'M');
  return <pre>{modules.map((row) => row.map((dark) => (dark ? '██' : '  ')).join('')).join('\n')}</pre>;
}
```

### useDynamicQR

```tsx
function Promo() {
  const { value, setValue, recordScan, reset, scanCount, expired, overUsed } = useDynamicQR({
    id: 'promo-2026',
    initialValue: 'https://example.com/landing',
    maxScans: 1000,
    expiresAt: '2026-12-31',
  });
  if (expired || overUsed) return <button onClick={reset}>Reset</button>;
  return (
    <div onClick={recordScan}>
      <QRCode value={value} />
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>{scanCount} scans</p>
    </div>
  );
}
```

### useBatchQR

Headless version of the batch generator's import logic.

```tsx
function Batch() {
  const { rows, importCSV, importJSON, clear, error } = useBatchQR();
  return (
    <>
      <textarea onBlur={(e) => importCSV(e.target.value)} placeholder="value,label" />
      <button onClick={() => importJSON('["https://a.com", "https://b.com"]')}>Load sample</button>
      <button onClick={clear}>Clear</button>
      {error && <p>{error}</p>}
      {rows.map((r) => (
        <QRCode key={r.id} value={r.value} size={96} />
      ))}
    </>
  );
}
```

### useQRAnalytics

Records scan events (device, browser, OS, time) in `localStorage` and summarises them. Useful for demos and QA. For production numbers, send events to your own server.

```tsx
function Stats() {
  const { summary, track, clear } = useQRAnalytics();
  return (
    <>
      <button onClick={() => track('promo-2026', 'https://example.com')}>Simulate scan</button>
      <p>
        {summary.totalScans} scans, {summary.uniqueScans} unique
      </p>
      <button onClick={clear}>Reset</button>
    </>
  );
}
```

---

## Themes, templates, animations

### Themes

`light`, `dark`, `neon`, `corporate`, `glassmorphism`, `gradient`, `modern`, `minimal`, `cyberpunk`, `premium`.

```tsx
<>
  <QRCode value="https://example.com" theme="corporate" />
  <QRCode value="https://example.com" theme="dark" fgColor="#fde68a" />
</>
```

`dark`, `neon`, `cyberpunk` and `premium` put light modules on a dark background. Recent iOS and Android cameras read these, but some scanner apps don't. Use a light theme when the code must work everywhere, or check the result with `verify()`.

`THEMES` is exported if you want to list or extend the presets.

### Templates

`TEMPLATES` holds 19 ready-made designs across business, restaurant, wedding, event, education, real-estate, healthcare, e-commerce, startup and agency categories. Each has `id`, `name`, `category`, `description`, `sampleValue` and a `preset` of `QRCode` props:

```tsx
const template = TEMPLATES.find((t) => t.id === 'restaurant-menu');

<QRCode value="https://example.com/menu" {...template?.preset} />
```

### Animations

`pulse`, `zoom`, `bounce`, `rotate`, `fade`, `wave`, `glow`, `breathing`, `scan`.

```tsx
<QRCode value="https://example.com" animation="breathing" />
```

The CSS is embedded inside the SVG, so no global stylesheet is needed. `getAnimationCSS(name)` returns it if you want to apply it elsewhere (the class is `.qrm-anim`).

---

## Headless utilities

No React needed. Import from `react-qr-master/core` to use them in Server Components, route handlers or plain Node (the main entry is marked `"use client"`).

```ts
import { encodeWiFi, encodeUPI, encodeContact, generateMatrix } from 'react-qr-master/core';

const wifi = encodeWiFi({ ssid: 'Cafe', password: 'latte', encryption: 'WPA2' });
// "WIFI:T:WPA;S:Cafe;P:latte;;"

const upi = encodeUPI({ payeeVPA: 'shop@upi', payeeName: 'Shop', amount: '10.00' });
// "upi://pay?pa=shop%40upi&pn=Shop&am=10.00&cu=INR"

const { size, modules } = generateMatrix(wifi, 'M'); // modules[row][col] === true for dark
```

Encoders: `encodeWiFi`, `encodeEmail`, `encodePhone`, `encodeSMS`, `encodeWhatsApp`, `encodeContact`, `encodeLocation`, `encodeGoogleMaps`, `encodeEvent`, `encodeUPI`, `encodeCrypto`, `encodeSocial`.

### Render an SVG string on the server

`QRCode` renders without browser APIs, so `react-dom/server` turns it into a standalone SVG for emails, PDFs or API responses in Node, Express or Vite SSR:

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { QRCode } from 'react-qr-master/core';

const svg = renderToStaticMarkup(<QRCode value="https://example.com" shape="rounded" />);
```
