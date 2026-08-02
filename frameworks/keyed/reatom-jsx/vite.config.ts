import { defineConfig } from 'vite'

export default defineConfig({
  base: '/frameworks/keyed/reatom-jsx/dist/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'hf',
    jsxInject: 'import { h, hf } from "@reatom/jsx"',
  },
})
