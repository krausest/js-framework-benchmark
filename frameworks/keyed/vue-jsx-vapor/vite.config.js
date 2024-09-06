import { defineConfig } from "vite";
import vueJsxVapor from "unplugin-vue-jsx-vapor/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueJsxVapor({
      restructure: true,
    }),
  ],
  build: {
    rollupOptions: {
      input: "src/main.js",
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
