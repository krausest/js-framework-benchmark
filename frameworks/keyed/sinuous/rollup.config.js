import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
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
    babel({ babelHelpers: "bundled", plugins: ["sinuous/babel-plugin-htm"] }),
    nodeResolve(),
    isProduction && terser(),
  ],
};
