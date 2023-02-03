import { defineConfig } from "vite";

import SignalJSX from "./plugin_signal_jsx";

export default defineConfig({
  build: {
    lib: {
      name: "main",
      entry: "src/main.ts",
      formats: ["iife"],
      fileName: () => "main.js",
    },
  },
  plugins: [SignalJSX()],
});
