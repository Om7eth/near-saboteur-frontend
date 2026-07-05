import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    // Polyfills Node-only globals (Buffer, process, global) that
    // @near-wallet-selector and near-seed-phrase internally expect.
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
    // Game file has a lot of embedded base64 images - raise the warning
    // limit so Vite doesn't spam warnings about chunk size (it's still a
    // single optimized bundle, just naturally larger than a typical app).
    chunkSizeWarningLimit: 5000,
  },
});
