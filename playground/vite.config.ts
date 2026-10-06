import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  // GitHub Pages serves the demo from /react-qr-code/; see .github/workflows/pages.yml.
  base: process.env.PLAYGROUND_BASE ?? '/',
  plugins: [react()],
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
