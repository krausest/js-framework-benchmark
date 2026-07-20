import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const TERSER_OPTIONS = {
  module: true,
  compress: { passes: 3 },
  mangle: true,
};

export default {
  input: "src/main.js", 
  output: { 
    file: "dist/main.js", 
    format: "iife",
    sourcemap: false 
  },
  plugins: [
    resolve({ extensions: [".js"] }),
    process.env.production && terser(TERSER_OPTIONS),
  ].filter(Boolean),
};
