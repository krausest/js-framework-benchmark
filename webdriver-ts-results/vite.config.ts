import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  build: {
    assetsDir: "",
    rollupOptions: {
      output: {
        manualChunks: {
          plotly: ["plotly.js-cartesian-dist"],
        },
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
});
