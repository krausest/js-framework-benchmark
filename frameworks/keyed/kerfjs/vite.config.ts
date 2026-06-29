import { defineConfig } from 'vite';

export default defineConfig({
  base: '',
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'kerfjs',
  },
  build: {
    target: 'es2022',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
