import { defineConfig } from "vite";
import marko from "@marko/run/vite";
import staticAdapter from "@marko/run-adapter-static";

export default defineConfig({
  base:'/frameworks/keyed/marko5/dist/',
  plugins: [
    marko({
      adapter: staticAdapter()
    })
  ]
});