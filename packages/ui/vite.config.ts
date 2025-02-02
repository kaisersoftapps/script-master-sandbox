import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  base: '',
  plugins: [react(), eslint()],
  build: {
    outDir: './build',
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3030,
  },
});
