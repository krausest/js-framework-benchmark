import { defineConfig } from "vite";
import { octane } from "@octanejs/vite-plugin";

export default defineConfig({
  base: "/frameworks/keyed/octane/dist/",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    target: "esnext",
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
    // Match Octane's TSRX benchmark profile and preserve its V8-friendly code shape.
    terserOptions: {
      compress: {
        passes: 5,
        reduce_vars: false,
        inline: 0,
        booleans: false,
        comparisons: false,
        toplevel: true,
      },
      mangle: {
        toplevel: true,
      },
    },
  },
  plugins: [octane()],
});
