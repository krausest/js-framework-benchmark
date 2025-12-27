import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vueJsxVapor from "vue-jsx-vapor/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vueJsxVapor({ interop: true })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      input: "src/main.js",
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
