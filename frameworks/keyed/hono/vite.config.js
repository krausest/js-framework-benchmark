import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/frameworks/keyed/hono/dist/",
  build: {
    rollupOptions: {
      input: "src/index.tsx",
      output: {
        entryFileNames: "index.js",
      },
    },
  },
});
