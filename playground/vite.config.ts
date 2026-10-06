import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8')) as {
  version: string;
};

export default defineConfig({
  // GitHub Pages serves the demo from /react-qr-code/; see .github/workflows/pages.yml.
  base: process.env.PLAYGROUND_BASE ?? '/',
  plugins: [react()],
  // Shown in the sidebar, so the playground always matches package.json.
  define: {
    __PKG_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      'react-qr-master': resolve(__dirname, '../src/index.ts'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
