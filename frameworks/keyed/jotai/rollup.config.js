import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: `src/main.tsx`,
  output: { file: `dist/main.js`, format: "iife" },
  plugins: [
    resolve(),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": "false",
      },
    }),
    commonjs(),
    typescript(),
    terser({ warnings: true, mangle: { module: true } }),
  ],
};
