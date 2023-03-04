import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/main.jsx',
      output: {
        entryFileNames: 'main.js',
      },
    },
  },
  plugins: [react()],
});
