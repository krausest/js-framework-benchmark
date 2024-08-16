import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [vue(), Inspect()],
  build: {
    rollupOptions: {
      input: "src/main.js",
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
