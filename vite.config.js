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
  // [BUG FIX - "JsonRpcProvider is not a constructor"] A known class of
  // bug with Vite/Rollup production builds and near-api-js: Rollup's
  // module concatenation can reorder class declarations relative to
  // where they're used, breaking JS class-hoisting rules (a class isn't
  // usable before its own declaration runs, unlike a function). Forcing
  // near-api-js through esbuild's dependency pre-bundling keeps its
  // internal module structure intact for dev/preview.
  optimizeDeps: {
    include: ['near-api-js', 'near-seed-phrase'],
  },
  build: {
    commonjsOptions: {
      // [BUG FIX - "JsonRpcProvider is not a constructor", cont'd] The
      // previous attempt (transformMixedEsModules) pushed near-api-js
      // THROUGH Vite's CommonJS-interop plugin - but near-api-js v7 is
      // pure ESM with no CommonJS in it at all, so that transform was
      // itself introducing the reordering bug, not avoiding it. This is
      // the confirmed fix other projects have used for this exact error
      // with near-api-js: skip the CommonJS plugin for every dependency
      // entirely, so a pure-ESM package like this one is left exactly
      // as its author wrote it.
      include: [],
    },
    rollupOptions: {
      output: {
        // [BUG FIX - cont'd] optimizeDeps.include above mainly helps
        // dev/preview - production's actual bundler is Rollup, not
        // esbuild, so it needs its own fix too: isolating near-api-js
        // into its own chunk changes where Rollup draws its
        // concatenation boundaries, which is what actually avoids the
        // class-hoisting reorder bug in the final production bundle.
        manualChunks: {
          'near-api-js': ['near-api-js'],
        },
      },
    },
    // Game file has a lot of embedded base64 images - raise the warning
    // limit so Vite doesn't spam warnings about chunk size (it's still a
    // single optimized bundle, just naturally larger than a typical app).
    chunkSizeWarningLimit: 5000,
  },
});
