import { raphy } from '@raphy-js/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [raphy({ sfc: { immutableKeys: true } })],
  build: { target: 'es2022' },
})
