import minifyHTML from "rollup-plugin-minify-template-literals";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.BUILD === "production";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.js",
  plugins: [
    minifyHTML({
      options: {
        minifyOptions: {
          ignoreCustomComments: [/^!/],
          keepClosingSlash: true,
          caseSensitive: true,
        },
      },
    }),
    nodeResolve(),
    isProduction && terser(),
  ],
  output: {
    esModule: true,
    file: "dist/index.js",
  },
};
