import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

export default defineConfig({
  base: "/frameworks/keyed/astro-svelte-nanostores/dist",
  integrations: [svelte()],
  devToolbar: {
    enabled: false,
  },
});
