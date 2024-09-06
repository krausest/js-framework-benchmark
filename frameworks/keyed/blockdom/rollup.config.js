import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "app.js",
  output: {
    file: "dist/app.min.js",
    format: "es",
    name: "app",
    sourcemap: false,
  },
  plugins: [
    nodeResolve({
      mainFields: ["main"],
    }),
    isProduction && terser(),
  ],
};
