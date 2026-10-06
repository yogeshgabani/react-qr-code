export type JsQR = typeof import('jsqr').default;

let cached: Promise<JsQR> | undefined;

/**
 * Load the jsQR decoder on first use. A top-level `import jsQR from 'jsqr'`
 * would pull ~130 KB of CommonJS into every app that imports anything from
 * this package, because bundlers can't tree-shake CommonJS.
 */
export function loadJsQR(): Promise<JsQR> {
  cached ??= import('jsqr').then(
    (mod) => {
      // jsqr ships CommonJS; depending on the bundler the function is either
      // the default export or the module itself.
      const jsQR = ((mod as { default?: JsQR }).default ?? mod) as JsQR;
      // jsQR throws a TypeError from `locate` on some images instead of
      // returning null. Treat that as "no QR found".
      return ((...args: Parameters<JsQR>) => {
        try {
          return jsQR(...args);
        } catch {
          return null;
        }
      }) as JsQR;
    },
    (e: unknown) => {
      cached = undefined;
      throw e;
    },
  );
  return cached;
}
