import { defineConfig, type Options } from 'tsup';

const shared: Options = {
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: false,
  // `npm run build` wipes dist first; cleaning here would race between the
  // two parallel builds below.
  clean: false,
  // esbuild already tree-shakes ESM output. tsup's Rollup-based `treeshake`
  // pass strips the "use client" banner, so it stays off.
  treeshake: false,
  splitting: false,
  minify: false,
  target: 'es2020',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
};

export default defineConfig([
  {
    ...shared,
    entry: { index: 'src/index.ts' },
    // Every export is a client component or browser utility. The directive
    // lets Next.js App Router users import them from Server Components.
    banner: { js: '"use client";' },
  },
  {
    // Server-safe subset (`react-qr-master/core`): no directive, so encoders
    // and QRCode can run inside React Server Components and route handlers.
    ...shared,
    entry: { core: 'src/entry-core.ts' },
  },
]);
