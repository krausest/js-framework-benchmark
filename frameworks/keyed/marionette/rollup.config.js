import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonJS from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

const DEV = !!process.env.production;

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
    DEV && terser(),
  ],
};
