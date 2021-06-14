import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";

const extensions = [".js", ".ts", ".tsx"];

export default {
  input: `src/main.tsx`,
  output: { file: `dist/main.js`, format: "iife" },
  plugins: [
    babel({
      extensions,
      babelHelpers: "bundled",
    }),
    resolve({ extensions }),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": "false",
      },
    }),
    commonjs(),
    terser({ warnings: true, mangle: { module: true } }),
  ],
};
