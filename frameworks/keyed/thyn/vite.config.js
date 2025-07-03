import thyn from "@thyn/vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [thyn()],
  base: '/frameworks/keyed/thyn/dist/',
  build: { modulePreload: false },
});
