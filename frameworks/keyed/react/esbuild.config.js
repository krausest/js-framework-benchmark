import { build, context } from "esbuild";
import licensePlugin from "esbuild-plugin-license";

/** @type {import("esbuild-plugin-license").Options;} */
const licensePluginConfig = {
  banner: "/*! For license information please see main.js.LICENSE.txt */",
  thirdParty: {
    output: {
      file: "dist/main.js.LICENSE.txt",
      template(dependencies) {
        return dependencies
          .map(
            (dependency) =>
              `/** ${dependency.packageJson.name} ${dependency.packageJson.version} */\n\n${dependency.licenseText}`
          )
          .join("\n");
      },
    },
  },
};

/** @type {import("esbuild").BuildOptions;} */
const esbuildConfig = {
  entryPoints: ["src/main.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  logLevel: "info",
  outfile: "dist/main.js",
  plugins: [licensePlugin(licensePluginConfig)],
};

// Activates watch mode
if (process.argv[2] === "--watch") {
  const ctx = await context(esbuildConfig);
  await ctx.watch();
} else {
  await build(esbuildConfig);
}
