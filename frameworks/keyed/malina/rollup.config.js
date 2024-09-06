import { nodeResolve } from "@rollup/plugin-node-resolve";
import derver from "derver/rollup-plugin";
import terser from "@rollup/plugin-terser";
import malina from "malinajs/malina-rollup.js";
import staticText from "malinajs/plugins/static-text.js";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/main.js",
  output: {
    file: "dist/bundle.js",
    format: "iife",
  },
  plugins: [
    malina({
      passClass: false,
      compact: "full",
      useGroupReferencing: false,
      plugins: [staticText()],
    }),
    nodeResolve(),
    !isProduction && derver(),
    isProduction && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
