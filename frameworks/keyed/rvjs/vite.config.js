import { defineConfig } from "vite";
import rvjsPlugin from "vite-plugin-rvjs";

export default defineConfig({
  base: "/frameworks/keyed/rvjs/dist/",
  plugins: [rvjsPlugin()],
});
