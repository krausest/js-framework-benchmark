import { createFarmRendererPlugin } from "@farm.js/react/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/frameworks/keyed/farm-react/dist/",
  css: {
    postcss: { plugins: [] },
  },
  plugins: createFarmRendererPlugin({
    rendererOptions: {
      experimental: {
        compiler: {
          mode: "infer",
          onUnsupported: "error",
          reactivity: "hybrid",
        },
      },
    },
  }),
})
