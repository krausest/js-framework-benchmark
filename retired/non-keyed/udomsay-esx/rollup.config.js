import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "./src/main.jsx",
  output: {
    file: "dist/main.js",
    format: "iife",
  },
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      targets: {
        esmodules: true,
      },
      plugins: [["@ungap/babel-plugin-transform-esx"]],
    }),
    nodeResolve({ extensions: [".js", ".jsx"] }),
    isProduction && terser(),
  ],
};
