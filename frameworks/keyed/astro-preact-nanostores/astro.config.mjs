import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
  base: '/frameworks/keyed/astro-preact-nanostores/dist',
  integrations: [preact()],
  devToolbar: {
    enabled: false,
  },
});
