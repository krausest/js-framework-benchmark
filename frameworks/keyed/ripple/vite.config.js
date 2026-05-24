import { defineConfig } from "vite";
import { ripple } from "@ripple-ts/vite-plugin";

export default defineConfig({
  base: "/frameworks/keyed/ripple/dist/",
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
  plugins: [ripple()],
});
