import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

export default defineConfig({
  base: "/frameworks/keyed/astro-svelte/dist",
  integrations: [svelte()],
  devToolbar: {
    enabled: false,
  },
});
