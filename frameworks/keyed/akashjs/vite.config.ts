import { defineConfig } from 'vite';
import akash from '@akashjs/vite-plugin';

export default defineConfig({
  base: './',
  plugins: [akash()],
  build: {
    outDir: 'dist',
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
