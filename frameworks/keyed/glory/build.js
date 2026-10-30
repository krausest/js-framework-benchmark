import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cwd = dirname(fileURLToPath(import.meta.url));
const bindgen = process.env.WASM_BINDGEN || "wasm-bindgen";
const version = execFileSync(bindgen, ["--version"], { encoding: "utf8" }).trim();
if (version !== "wasm-bindgen 0.2.130") {
  throw new Error(`Expected wasm-bindgen 0.2.130, got ${version}`);
}

const metadata = JSON.parse(
  execFileSync("cargo", ["metadata", "--locked", "--format-version", "1"], {
    cwd,
    encoding: "utf8",
  })
);
const revision = "c988506d40938d50c210d2b8a27a708121449609";
const expectedSource = `git+https://github.com/glory-rs/glory?rev=${revision}#${revision}`;
const runtime = metadata.packages.filter((pkg) => pkg.name === "glory" || pkg.name.startsWith("glory-"));
if (runtime.length === 0) throw new Error("Missing Glory runtime");
for (const pkg of runtime) {
  if (pkg.version !== "0.6.1" || pkg.source !== expectedSource) {
    throw new Error(`Expected Glory 0.6.1 at ${revision}, got ${pkg.id}`);
  }
}

execFileSync("cargo", ["build", "--locked", "--release", "--target", "wasm32-unknown-unknown"], {
  cwd,
  stdio: "inherit",
});
const output = join(cwd, "bundled-dist");
mkdirSync(output, { recursive: true });
execFileSync(
  bindgen,
  [
    join(metadata.target_directory, "wasm32-unknown-unknown", "release", "js-framework-benchmark-glory.wasm"),
    "--target",
    "web",
    "--out-dir",
    output,
    "--out-name",
    "app",
  ],
  { cwd, stdio: "inherit" }
);
copyFileSync(join(cwd, "index.html"), join(output, "index.html"));
