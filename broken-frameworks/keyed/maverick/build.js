const { esbuild: maverick } = require("@maverick-js/compiler");

const dev = process.argv.includes("--dev");

require("esbuild").build({
  entryPoints: ["src/main.tsx"],
  outfile: "dist/main.js",
  watch: dev,
  bundle: true,
  minify: !dev,
  platform: "browser",
  target: "es2020",
  conditions: [dev ? "development" : "production", "default"],
  plugins: [
    maverick({
      include: ["src/**/*.tsx"],
      delegateEvents: true,
      groupDOMEffects: true,
    }),
  ],
});
