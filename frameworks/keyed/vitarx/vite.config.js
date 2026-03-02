import vitarx from "@vitarx/plugin-vite";

import { defineConfig } from "vite";

export default defineConfig({
  base: "/frameworks/keyed/vitarx/dist/",
  plugins: [vitarx()],
});
