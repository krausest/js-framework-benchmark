import { defineConfig } from "vite";

export default defineConfig(({ command, mode, ssrBuild }) => {
  return {
    build: {
      modulePreload: { polyfill: true },
      rollupOptions: {
        input: "main.js",
        output: {
          entryFileNames: "main.js",
        },
      },
    },
    server: {
      open: true,
    },
  };
});
