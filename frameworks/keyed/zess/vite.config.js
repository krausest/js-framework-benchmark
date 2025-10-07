import zess from "@zessjs/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [zess()],
  build: {
    rollupOptions: {
      input: "src/main.jsx",
      output: {
        entryFileNames: "main.js",
      },
    },
  },
});
