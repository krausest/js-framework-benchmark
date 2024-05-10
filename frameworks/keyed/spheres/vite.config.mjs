import { defineConfig } from "vite"

export default defineConfig({
  root: "../../../",
  optimizeDeps: {
    entries: [
      "frameworks/keyed/spheres/index.html",
      "frameworks/keyed/spheres/local.html"
    ],
    force: true
  },
  css: {
    devSourcemap: true
  },
  server: {
    fs: {
      strict: false
    }
  },
  build: {
    outDir: "frameworks/keyed/spheres/dist",
    rollupOptions: {
      input: "./src/app.ts",
      output: {
        entryFileNames: 'main.js',
      },
    }
  }
})