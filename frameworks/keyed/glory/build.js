import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const cwd = dirname(fileURLToPath(import.meta.url));
const bindgen = process.env.WASM_BINDGEN || "wasm-bindgen";
const version = execFileSync(bindgen, ["--version"], { encoding: "utf8" }).trim();
if (version !== "wasm-bindgen 0.2.129") {
  throw new Error(`Expected wasm-bindgen 0.2.129, got ${version}`);
}

const metadata = JSON.parse(
  execFileSync("cargo", ["metadata", "--locked", "--format-version", "1"], {
    cwd,
    encoding: "utf8",
  })
);
const runtime = metadata.packages.filter((pkg) => pkg.name === "glory" || pkg.name.startsWith("glory-"));
if (runtime.length === 0) throw new Error("Missing Glory runtime");
for (const pkg of runtime) {
  if (pkg.version !== "0.6.0" || pkg.source !== "registry+https://github.com/rust-lang/crates.io-index") {
    throw new Error(`Expected published Glory 0.6.0, got ${pkg.id}`);
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
