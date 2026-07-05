import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
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
    rollupOptions: {
      output: {
        // [BUG FIX - "JsonRpcProvider is not a constructor"] This is a
        // known, previously-documented bug between Rollup and
        // near-api-js specifically: some of its internal files import
        // each other circularly (A needs something from B, B needs
        // something from A). Rollup's default behavior CONCATENATES
        // every module into a small number of combined chunks, which
        // can reorder a class's declaration to come AFTER the line that
        // tries to use it - something that works fine as separate ES
        // modules (where the JS engine resolves circular references
        // lazily) but breaks once everything is concatenated into one
        // physical block of code top-to-bottom. preserveModules stops
        // Rollup from concatenating at all - every source file becomes
        // its own real output file, exactly as near-api-js's author
        // wrote and ordered it, so nothing gets reordered and the
        // circular reference resolves the same way it does in dev mode.
        preserveModules: true,
      },
    },
  },
});
