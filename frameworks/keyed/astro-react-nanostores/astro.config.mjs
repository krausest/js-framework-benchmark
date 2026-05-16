import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  base: "/frameworks/keyed/astro-react-nanostores/dist",
  integrations: [react()],
  devToolbar: {
    enabled: false,
  },
});
