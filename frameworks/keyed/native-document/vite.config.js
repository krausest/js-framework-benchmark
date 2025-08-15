// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: "./src/main.js",
      output: {
        // Customize entry chunk names
        entryFileNames: 'main.js',
      },
    },
  },
});