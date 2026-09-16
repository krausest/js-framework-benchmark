// The repository's .gitignore excludes dist/, so the committed bundle lives in bundeled-dist/.
import { execSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));

execSync("dotnet tool restore", { cwd: here, stdio: "inherit" });
execSync("dotnet fable . -c Release --noCache", { cwd: here, stdio: "inherit" });

await esbuild.build({
  entryPoints: [resolve(here, "src/App.fs.js")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  outfile: resolve(here, "bundeled-dist/app.js"),
});
