// Checks the built `dist/` before publishing:
//  1. Bundle-size budget: bundles typical imports the way an app bundler would
//     (minified, React external) and fails when gzip size exceeds the budget.
//     Catches tree-shaking regressions, e.g. a new top-level `forwardRef(...)`
//     without a /* @__PURE__ */ annotation, or a static import of a CommonJS
//     dependency.
//  2. Directives: the main entry starts with "use client"; `core` doesn't.
//  3. Server safety: `core` only imports React APIs that exist in the React
//     Server Components build, so it works in Server Components.
import { build } from 'esbuild';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const cases = [
  { name: 'QRCode', code: "export { QRCode } from './dist/index.js';", budgetKB: 9 },
  { name: 'QRCode (core)', code: "export { QRCode } from './dist/core.js';", budgetKB: 9 },
  { name: 'WiFiQR + useQRDownload', code: "export { WiFiQR, useQRDownload } from './dist/index.js';", budgetKB: 13 },
  { name: 'encodeWiFi (core)', code: "export { encodeWiFi } from './dist/core.js';", budgetKB: 1 },
  { name: 'everything', code: "export * from './dist/index.js';", budgetKB: 30 },
];

const failures = [];

for (const { name, code, budgetKB } of cases) {
  const result = await build({
    stdin: { contents: code, resolveDir: process.cwd(), loader: 'js' },
    bundle: true,
    minify: true,
    format: 'esm',
    write: false,
    external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client', 'jsqr'],
    logLevel: 'error',
  });
  const bytes = result.outputFiles[0].contents;
  const gzipKB = gzipSync(bytes).length / 1024;
  const ok = gzipKB <= budgetKB;
  if (!ok) failures.push(`${name}: ${gzipKB.toFixed(1)} KB gzip exceeds ${budgetKB} KB budget`);
  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(24)} ${(bytes.length / 1024).toFixed(1).padStart(6)} KB min  ${gzipKB.toFixed(1).padStart(5)} KB gzip  (budget ${budgetKB} KB)`,
  );
}

const SERVER_SAFE_REACT = new Set(['forwardRef', 'useId', 'useMemo', 'useCallback', 'Fragment', 'createElement']);
for (const ext of ['js', 'cjs']) {
  const index = readFileSync(`dist/index.${ext}`, 'utf8');
  const core = readFileSync(`dist/core.${ext}`, 'utf8');
  if (!index.startsWith('"use client";')) failures.push(`dist/index.${ext} is missing "use client"`);
  if (core.includes('"use client"')) failures.push(`dist/core.${ext} must not contain "use client"`);

  const reactImports = [
    ...core.matchAll(/import\s*\{([^}]*)\}\s*from\s*["']react["']/g),
    ...core.matchAll(/var\s*\{([^}]*)\}\s*=\s*require\(["']react["']\)/g),
  ].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+as\s+|:\s*/)[0]).filter(Boolean));
  const unsafe = reactImports.filter((n) => !SERVER_SAFE_REACT.has(n));
  if (unsafe.length) failures.push(`dist/core.${ext} imports client-only React APIs: ${unsafe.join(', ')}`);
  for (const dep of ['react-dom', 'jsqr']) {
    if (new RegExp(`["']${dep}["']`).test(core)) failures.push(`dist/core.${ext} imports ${dep}`);
  }
}
console.log(failures.some((f) => /use client|React APIs|imports/.test(f)) ? 'FAIL server-safety checks' : 'ok   directives and server-safe core');

if (failures.length) {
  console.error(`\n${failures.join('\n')}`);
  process.exit(1);
}
