import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    // Polyfills Node-only globals (Buffer, process, global, etc.) that
    // near-api-js / near-seed-phrase / @near-wallet-selector internally
    // expect - without this, the app crashes immediately on load with
    // something like "Buffer is not defined" or "global is not defined".
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    react(),
  ],
  // [BUG FIX - "JsonRpcProvider is not a constructor"] near-api-js v7's
  // own dependency tree mixes real ESM and real CommonJS (e.g. its
  // `mustache` dependency is genuine CJS) - a blanket
  // commonjsOptions.include: [] (an earlier attempt at this fix) skips
  // Rollup's CJS-interop entirely and breaks that legitimate case
  // instead. The actual fix: leave Rollup's default CJS handling alone,
  // and instead stop it from downleveling modern class syntax at all -
  // 'esnext' keeps every class exactly as near-api-js's author wrote
  // it, native JS class-hoisting semantics intact, which is what avoids
  // the reordering bug in the first place.
  build: {
    target: 'esnext',
    // Game file has a lot of embedded base64 images - raise the warning
    // limit so Vite doesn't spam warnings about chunk size (it's still a
    // single optimized bundle, just naturally larger than a typical app).
    chunkSizeWarningLimit: 5000,
  },
});
