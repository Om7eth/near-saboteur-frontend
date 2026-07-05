import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    // Polyfills Node-only globals (Buffer, process, global, etc.) that
    // near-api-js / near-seed-phrase / @near-wallet-selector internally
    // expect - without this, the app crashes immediately on load with
    // something like "Buffer is not defined" or "global is not defined",
    // before React ever gets a chance to render anything (a blank white
    // screen, no visible error, since it happens before our own code
    // even runs).
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
