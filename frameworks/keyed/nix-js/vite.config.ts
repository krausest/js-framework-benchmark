import { defineConfig } from 'vite'
import nixJsPlugin from '@deijose/vite-plugin-nix-js'

export default defineConfig({
  base: '/frameworks/keyed/nix-js/dist/',
  plugins: [nixJsPlugin({ compiler: true })],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: '.',
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]',
      },
    },
  },
  server: {
    port: 8080,
    strictPort: true,
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
})
