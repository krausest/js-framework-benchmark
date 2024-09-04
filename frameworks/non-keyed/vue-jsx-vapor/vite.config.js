import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vueJsxVapor from "unplugin-vue-jsx-vapor/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueJsxVapor({
      restructure: true,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: "src/main.js",
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
