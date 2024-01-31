import { defineConfig } from "vite";
import { compiler, stripGXTDebug } from "@lifeart/gxt/compiler";
import babel from 'vite-plugin-babel';

export default defineConfig(({ mode }) => ({
  plugins: [babel({
    babelConfig: {
      babelrc: false,
      configFile: false,
      plugins: [stripGXTDebug]
    }
  }),compiler(mode, {
    flags: {
      TRY_CATCH_ERROR_HANDLING: false,
      SUPPORT_SHADOW_DOM: false,
    }
  })],
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
        passes: 5,
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
