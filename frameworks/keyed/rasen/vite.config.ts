import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'src/main.ts'),
      output: {
        entryFileNames: 'main.js',
        format: 'es'
      }
    },
    minify: 'esbuild'
  },
  resolve: {
    alias: {
      '@rasenjs/core': resolve(__dirname, '../../../../@rasen/packages/core/src'),
      '@rasenjs/dom': resolve(__dirname, '../../../../@rasen/packages/dom/src'),
      '@rasenjs/reactive-vue': resolve(__dirname, '../../../../@rasen/packages/reactive-vue/src')
    }
  }
})
