import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  build: {
    assetsDir: "",
    chunkSizeWarningLimit: 2000,
    rolldownOptions: {
      input: {
        results: fileURLToPath(new URL("./index.html", import.meta.url)),
        overview: fileURLToPath(new URL("./overview.html", import.meta.url)),
      },
      output: {
        codeSplitting: {
          minSize: 1000,
          groups: [
            {
              name: "chartjs",
              test: /chart\.js|@sgratzl[\\/]chartjs-chart-boxplot/,
            },
          ],
        },
      },
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react()],
});
