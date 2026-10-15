# Changelog

All notable changes to `react-qr-master`. Versions follow [semver](https://semver.org).

## Unreleased

### Added

- `label` prop: a "SCAN ME" style call to action drawn inside the SVG, so downloads, copies, shares and batch exports include it. Three styles (`labelStyle`: `banner`, `pill`, `plain`), top or bottom placement, and `labelColor`, `labelBackground` and `labelFont` to restyle it. Long text shrinks to fit.
- `scanQRFromImage()`: read a QR from a photo, screenshot, `File`, `Blob`, image URL, `<img>` or `<canvas>`. It handles large photos and light-on-dark codes.
- `QRScanner` gets `allowImageUpload`, which adds a "Scan an image" button that also works when the camera is blocked, and a `scanImage()` ref method for custom upload or drag-and-drop UIs.
- QR Studio: call-to-action label controls on the Brand tab.

### Changed

- Raster exports (`download`, `copy`, `share`, `verify`, batch export) keep the SVG's aspect ratio. `pixelSize` is the width, so a labelled QR comes out taller instead of squashed. Square QRs export exactly as before.
- The npm homepage now points to the live demo at https://react-next-qrcode.netlify.app/.

## 0.2.0 - 2026-10-06

### Added

- `verify()` / `verifyQR()`: decodes the rendered QR under several simulated viewing conditions and reports `ok`, `score`, `inverted` and warnings, so you can catch designs that don't scan.
- `copy()` / `copyQR()`: copy the QR to the clipboard as a PNG.
- `share()` / `shareQR()` / `canShareQR()`: open the native share sheet with the QR image.
- `react-qr-master/core` entry: `QRCode`, every QR type component, the encoders, `generateMatrix`, themes and templates without `"use client"`, for React Server Components, route handlers and Node.
- The main entry now ships with `"use client"`, so it works in the Next.js App Router without extra setup.

### Changed

- **Much smaller bundles.** Importing only `<QRCode>` used to pull the whole library (about 62 KB gzipped) into your app; it's now about 8 KB. The scanner's decoder (`jsqr`) is loaded on demand.
- **One runtime dependency instead of five.** `jspdf`, `jszip`, `papaparse` and `@types/papaparse` were replaced by small built-in PDF, ZIP and CSV code. Installs drop from about 32 MB to under 1 MB, and the critical `npm audit` advisory that came through `jspdf` is gone.
- PDF downloads are now lossless in modern browsers.
- CSV import detects comma, semicolon, tab and pipe delimiters and accepts `value`, `url` or `text` columns in any letter case.

### Fixed

- Batch PDF export cut off the labels on the last row of each page.
- Batch ZIP export created nested folders when a row had no `id` and its value was a URL; file names are now sanitised and de-duplicated.
- `verifyQR` and the scanner no longer crash on images where jsQR throws internally.
- Docs: every example in README and the API reference now uses the real prop names and is type-checked in CI.
- CommonJS consumers now get the correct `.d.cts` type declarations.

## 0.1.0 - 2026-07-07

- Initial release: `QRCode` with themes, shapes, gradients, logos and animations; 16 QR type components; scanner, studio, batch, dynamic QR and analytics.
