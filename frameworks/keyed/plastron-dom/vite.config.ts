import { defineConfig } from "vite";

// Krausest's harness serves the framework dir root and expects
// `index.html` at root to reference a built bundle. Following the
// convention used by other vite-based framework dirs (e.g.
// keyed/vue-vapor): bundle src/main.ts → dist/main.js with a stable
// filename (no hash) so index.html can reference ./dist/main.js
// directly. The harness's `npm run build-prod` runs `vite build`,
// which produces just the dist/main.js (the index.html at root is the
// runtime entry, served as-is).
export default defineConfig({
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      input: "src/main.ts",
      external: ["pyodide", "quickjs-emscripten", "wabt"],
      output: {
        entryFileNames: "main.js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
