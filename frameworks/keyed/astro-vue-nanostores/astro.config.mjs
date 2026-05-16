import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";

export default defineConfig({
  base: "/frameworks/keyed/astro-vue-nanostores/dist",
  integrations: [vue()],
  devToolbar: {
    enabled: false,
  },
});
