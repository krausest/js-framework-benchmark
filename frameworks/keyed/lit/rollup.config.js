import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import htmlLiterals from "rollup-plugin-html-literals";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: `src/main.ts`,
  output: { file: `dist/main.js`, format: "iife", name: "app" },
  plugins: [nodeResolve(), typescript(), htmlLiterals(), isProduction && terser()],
};
