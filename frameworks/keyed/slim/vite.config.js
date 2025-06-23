import slim from "@slim-js/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [slim()],
  base: '/frameworks/keyed/slim/dist/',
  build: { modulePreload: false },
});
