import terser from "@rollup/plugin-terser";
import minifyHTML from "rollup-plugin-html-literals";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: `src/index.js`,
  output: { file: `dist/index.js`, format: "iife" },
  plugins: [isProduction && minifyHTML(), isProduction && terser()],
};
