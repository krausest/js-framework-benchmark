import { defineConfig } from "vite";
import { larkMvcPlugin } from "@lark.js/mvc/vite";

export default defineConfig(({ command }) => ({
  base: "/frameworks/keyed/lark-mvc/dist/",
  plugins: [larkMvcPlugin({ vdom: true, debug: command === "serve" })],
  build: {
    rolldownOptions: {
      output: {
        minify: true,
      },
    },
  },
}));
