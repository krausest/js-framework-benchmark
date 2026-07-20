import { build, context } from "esbuild";
import licensePlugin from "esbuild-plugin-license";

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

const esbuildConfig = {
  entryPoints: ["src/main.tsx"],
  bundle: true,
  minify: true,
  format: "iife",
  logLevel: "info",
  outfile: "dist/main.js",
  jsx: "automatic",
  jsxImportSource: "@knno/jsx",
  plugins: [licensePlugin(licensePluginConfig)],
};

if (process.argv[2] === "--watch") {
  const ctx = await context(esbuildConfig);
  await ctx.watch();
} else {
  await build(esbuildConfig);
}
