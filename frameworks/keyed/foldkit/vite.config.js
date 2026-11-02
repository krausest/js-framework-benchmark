import { defineConfig } from "vite";
import { foldkit } from "@foldkit/vite-plugin";

export default defineConfig({
  build: {
    target: "esnext",
    modulePreload: { polyfill: false },
    lib: {
      name: "main",
      formats: ["iife"],
      entry: "src/main.ts",
      fileName: () => "main.js",
    },
  },
  plugins: [foldkit()],
});
