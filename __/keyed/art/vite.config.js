import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    polyfillModulePreload: false,
    rollupOptions:{
      input: "src/main.jsx",
      output:{
        entryFileNames: 'main.js'
      }
    }
  },
  esbuild: {
    jsxFactory: 'art.h',
    jsxFragment: 'art.Fragment',
    jsxInject: `import art from 'js-art'`
  },
  resolve: {
    alias: {
      art: path.resolve(__dirname, 'art')
    }
  }
})
