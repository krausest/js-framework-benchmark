import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import virtual from "@rollup/plugin-virtual";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/Main.js",
  output: {
    file: "dist/main.js",
    format: "iife",
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
    }),
    nodeResolve(),
    commonJS({
      include: "node_modules/**",
    }),
    // jquery is an optional dependency of Bb
    virtual({ jquery: "export default []" }),
    isProduction && terser(),
  ],
};
