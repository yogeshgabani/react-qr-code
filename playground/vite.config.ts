import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pkg = JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')) as {
  version: string;
  homepage: string;
};

// Absolute URL for the canonical / og: / twitter: tags in index.html, since
// social crawlers ignore relative image URLs. Netlify sets URL during builds;
// otherwise fall back to the GitHub Pages homepage.
const siteUrl = (process.env.SITE_URL || process.env.URL || pkg.homepage).replace(/\/?$/, '/');

export default defineConfig({
  // GitHub Pages serves the demo from /react-qr-code/; see .github/workflows/pages.yml.
  base: process.env.PLAYGROUND_BASE ?? '/',
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html) => html.replace(/%SITE_URL%/g, siteUrl),
    },
  ],
  // Shown in the sidebar, so the playground always matches package.json.
  define: {
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      'react-qr-master': resolve(import.meta.dirname, '../src/index.ts'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
