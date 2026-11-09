import { defineConfig } from 'vite';
import { resolve } from 'path';
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
    // [HOW TO PLAY] a second, plain page at /how-to-play/ - a real file in the
    // build, so it works on any domain/host with no rewrite rules.
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        howToPlay: resolve(__dirname, 'how-to-play/index.html'),
      },
    },
  },
});
