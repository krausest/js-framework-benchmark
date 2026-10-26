import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";

const TERSER_OPTIONS = {
  module: true,
  compress: { passes: 3 },
  mangle: true,
};

export default {
  input: "src/main.jsx",
  output: { file: "dist/main.js", format: "iife" },
  plugins: [
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      plugins: [["@solidjs/babel-plugin", { omitNestedClosingTags: true }]],
    }),
    resolve({ extensions: [".js", ".jsx"], browser: true }),
    process.env.production && terser(TERSER_OPTIONS),
  ].filter(Boolean),
};
