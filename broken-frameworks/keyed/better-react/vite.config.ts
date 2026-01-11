import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: 'src/main.ts',
      output: {
        entryFileNames: 'main.js',
      },
    },
  }
});
