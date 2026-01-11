import ripple from "rollup-plugin-ripple";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const plugins = [
  resolve({ browser: true }),
  ripple({
    emitCss: false,
  }),
];

if (process.env.production) {
  plugins.push(
    terser({
      toplevel: true,
      mangle: true,
      module: true,
      compress: {
        inline: 0,
        reduce_vars: false,
        passes: 5,
        booleans: false,
        comparisons: false,
        keep_infinity: true,  
      },
    })
  );
}

export default {
  input: "src/main.js",
  output: {
    file: "dist/main.js",
    format: "iife",
    name: "main",
  },
  plugins,
};
