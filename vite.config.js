import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui-components': path.resolve(__dirname, './src/ui/components'),
      '@game-components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/ui/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@core': path.resolve(__dirname, './src/core'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@scenes': path.resolve(__dirname, './src/scenes'),
      '@ui': path.resolve(__dirname, './src/ui'),
    },
  },
  server: {
    port: 9000,
    open: true,
    host: true,
  },
  build: {
    outDir: 'dist',
  },
});
