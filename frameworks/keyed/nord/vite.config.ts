// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  base: './', 
  build: {
    outDir: 'dist',
    modulePreload: {
      polyfill: false 
    },
  }
})