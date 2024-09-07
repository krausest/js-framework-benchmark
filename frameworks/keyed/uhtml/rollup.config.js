import minifyHTML from "rollup-plugin-html-literals";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.js",
  output: {
    esModule: true,
    file: "dist/index.js",
  },
  plugins: [
    minifyHTML({
      options: {
        minifyOptions: {
          keepClosingSlash: true,
        },
      },
    }),
    nodeResolve(),
    isProduction && terser(),
  ],
};
