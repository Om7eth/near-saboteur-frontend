import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  // [BUG FIX - "JsonRpcProvider is not a constructor", real root cause]
  // The renamed variable in every version of this error
  // (browserIndex$1, then $2, now "ze") is Rollup's own tell for a
  // NAME COLLISION - it means near-api-js is being bundled TWICE: once
  // as our own direct dependency, and again as a separate copy pulled
  // in internally by @near-wallet-selector's own packages. Two
  // different copies of the same class end up in the bundle, and
  // whichever one actually gets called isn't set up the way the OTHER
  // copy's code expects - hence "is not a constructor" despite the
  // class genuinely existing. Forcing every package to resolve to the
  // SAME single copy is the standard fix for exactly this symptom.
  resolve: {
    dedupe: ['near-api-js'],
  },
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    react(),
  ],
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 5000,
  },
});
