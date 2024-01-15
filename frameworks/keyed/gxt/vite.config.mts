import { defineConfig } from "vite";
import { compiler } from "@lifeart/gxt/compiler";

export default defineConfig(({ mode }) => ({
  plugins: [compiler(mode)],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: "terser",
    rollupOptions: {
      treeshake: "recommended",
      input: "src/main.ts",
      output: {
        entryFileNames: "main.js",
      },
    },
    terserOptions: {
      module: true,
      compress: {
        hoist_funs: true,
        drop_console: true,
        inline: 2,
        passes: 4,
        unsafe: true,
        unsafe_symbols: true,
      },
      mangle: {
        module: true,
        toplevel: true,
        properties: false,
      },
    },
  },
}));
