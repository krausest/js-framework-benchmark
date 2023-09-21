import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import react from "@vitejs/plugin-react";

const needSinglefile = !!process.env.SINGLEFILE;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
        manualChunks: !needSinglefile
          ? {
              plotly: ["plotly.js-cartesian-dist"],
            }
          : undefined,
      },
    },
  },
  plugins: [react(), needSinglefile && viteSingleFile()],
});
