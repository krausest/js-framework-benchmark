import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/main.jsx",
  output: {
    file: "dist/main.js",
    format: "iife",
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
      plugins: [["jsx-dom-expressions", { moduleName: "mobx-jsx" }]],
    }),
    nodeResolve({ extensions: [".js", ".jsx"] }),
    replace({ "process.env.NODE_ENV": "'production'" }),
    isProduction && terser(),
  ],
};
