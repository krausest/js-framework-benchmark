import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/main.js",
  output: {
    file: "dist/main.js",
    format: "iife",
    name: "main",
  },
  onwarn(warning, warn) {
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    warn(warning);
  },
  plugins: [nodeResolve(), isProduction && terser()],
};
