import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

const isProd = process.env.production;

export default {
  input: "src/main.js",
  output: {
    file: "dist/main.js",
    format: "iife",
  },
  plugins: [
    babel({ babelHelpers: "bundled", plugins: ["sinuous/babel-plugin-htm"] }),
    resolve(),
    isProd && terser(),
  ],
};
