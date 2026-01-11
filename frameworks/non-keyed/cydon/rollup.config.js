import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/main.js",
  output: {
    compact: true,
    file: "dist/main.js",
  },
  plugins: [
    nodeResolve(),
    replace({
      "globalThis.CYDON_NO_EXTRA": "true",
      preventAssignment: true,
    }),
    isProduction && terser(),
  ],
};
