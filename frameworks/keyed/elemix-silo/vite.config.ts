import { defineConfig } from 'vite';
import { elemix } from '@neuralfog/elemix-vite';

export default defineConfig({
  base: './',
  plugins: [elemix()],
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
