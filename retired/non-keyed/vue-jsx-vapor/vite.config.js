import { defineConfig } from "vite";
import vueJsxVapor from "vue-jsx-vapor/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueJsxVapor(),
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
