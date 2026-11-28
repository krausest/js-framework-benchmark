import { defineConfig } from 'vite'
import { stillflow_plugin } from 'stillflow.engine/vite'
import { dom } from 'stillflow.engine/vms'

export default defineConfig({
  base: './',
  plugins: [
    stillflow_plugin({
      targets: {
        0: dom
      }
    })
  ],
  build: {
    target: 'esnext',
    sourcemap: false
  }
})
