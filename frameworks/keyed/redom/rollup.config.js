import buble from "@rollup/plugin-buble";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/main.js",
  output: {
    file: "dist/main.js",
    format: "iife",
  },
  plugins: [
    buble({
      transforms: {
        dangerousForOf: true,
      },
    }),
    nodeResolve(),
    isProduction && terser(),
  ],
};
