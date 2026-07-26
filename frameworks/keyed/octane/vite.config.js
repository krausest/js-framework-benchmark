import { defineConfig } from "vite";
import { octane } from "@octanejs/vite-plugin";

export default defineConfig({
  base: "/frameworks/keyed/octane/dist/",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
    lib: {
      name: "main",
      formats: ["iife"],
      entry: "src/main.js",
      fileName: () => "main.js",
    },
    minify: "terser",
  },
  plugins: [octane()],
});
