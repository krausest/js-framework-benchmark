import { defineConfig } from "astro/config";
import solidJs from "@astrojs/solid-js";

export default defineConfig({
  base: "/frameworks/keyed/astro-solid-nanostores/dist",
  integrations: [solidJs()],
  devToolbar: {
    enabled: false,
  },
});
