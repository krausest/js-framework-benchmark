import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 8082,
    host: "0.0.0.0",
  },
  root: "src",
  publicDir: "../../../../",
});
