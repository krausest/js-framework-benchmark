import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8"));
const extraDeps = Object.keys(pkg.dependencies || {}).filter(
  (name) => !["vuact", "vuact-dom", "vue", "react", "react-dom"].includes(name)
);
const depAliases = Object.fromEntries(extraDeps.map((name) => [name, resolve(__dirname, "node_modules/" + name)]));

export default defineConfig({
  base: "/frameworks/keyed/vuact-hooks-use-transition/dist/",
  plugins: [vue()],
  resolve: {
    alias: {
      "react/jsx-runtime": resolve(__dirname, "node_modules/vuact/jsx-runtime"),
      "react/jsx-dev-runtime": resolve(__dirname, "node_modules/vuact/jsx-dev-runtime"),
      react: resolve(__dirname, "node_modules/vuact"),
      "react-dom/client": resolve(__dirname, "node_modules/vuact-dom/client"),
      "react-dom/server": resolve(__dirname, "node_modules/vuact-dom/server"),
      "react-dom": resolve(__dirname, "node_modules/vuact-dom"),
      ...depAliases,
    },
  },
  optimizeDeps: {
    exclude: ["react", "react-dom"],
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
});
