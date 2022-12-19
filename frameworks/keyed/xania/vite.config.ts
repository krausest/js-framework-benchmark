import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "/frameworks/keyed/xania/dist/",
  build: {
    outDir: "../dist",
  },
  esbuild: {
    drop: ["console", "debugger"],
  },
});
