import { defineConfig } from "vite";
import { larkMvcPlugin } from "@lark.js/mvc/vite";

export default defineConfig({
  base: "/frameworks/keyed/lark-mvc/dist/",
  plugins: [larkMvcPlugin({ vdom: true })],
  build: {
    minify: true,
  },
});
