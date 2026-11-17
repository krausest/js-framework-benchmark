import { defineConfig } from 'vite'
import { stillflow_plugin } from 'stillflow.engine/vite'

export default defineConfig({
  base: './',
  plugins: [stillflow_plugin()],
  build: {
    target: 'esnext',
    sourcemap: false
  }
})
