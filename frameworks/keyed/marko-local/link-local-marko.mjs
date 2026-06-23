#!/usr/bin/env node
// Links keyed/marko-local against a local checkout of Marko.
//
// Steps:
//   1. Build the local Marko packages (`@marko/compiler` + `@marko/runtime-tags`).
//   2. Apply Marko's own `scripts/pkg-override` so its `exports`/`main` point at
//      the production `dist/` output (the same swap Marko applies on publish),
//      vendor the built packages into `.local/` (gitignored), then revert the
//      swap so the Marko checkout is left untouched.
//   3. Install this framework so the `file:` deps resolve to the vendored copies.
//
// Re-run this whenever the local Marko changes to refresh the comparison.
// Override the Marko checkout location with the MARKO_REPO env var.

import cp from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDir = path.dirname(fileURLToPath(import.meta.url));
const markoRepo = path.resolve(
  process.env.MARKO_REPO || path.join(appDir, "../../../../marko"),
);
const localDir = path.join(appDir, ".local");

// The Marko packages we consume in the benchmark.
const packages = ["compiler", "runtime-tags"];

run();

function run() {
  if (!fs.existsSync(path.join(markoRepo, "package.json"))) {
    throw new Error(
      `Could not find a Marko checkout at ${markoRepo}. ` +
        `Set the MARKO_REPO env var to point at it.`,
    );
  }

  console.log(`> Using Marko checkout at ${markoRepo}`);

  if (!fs.existsSync(path.join(markoRepo, "node_modules"))) {
    exec("npm install", markoRepo);
  }

  // Build the production output for the packages we vendor.
  exec(
    `npm run build ${packages.map((name) => `-w @marko/${name}`).join(" ")}`,
    markoRepo,
  );

  // Use Marko's own pkg-override to point `exports`/`main` at `dist/`, vendor the
  // packages in that state, then revert so the Marko checkout is left untouched.
  // The swap is its own inverse, so the second run restores the original files.
  exec("node scripts/pkg-override", markoRepo);
  try {
    fs.rmSync(localDir, { recursive: true, force: true });
    fs.mkdirSync(localDir, { recursive: true });
    for (const name of packages) {
      const from = path.join(markoRepo, "packages", name);
      const to = path.join(localDir, name);
      console.log(`> Vendoring ${name} -> ${path.relative(appDir, to)}`);
      copyPackage(from, to);
    }
  } finally {
    exec("node scripts/pkg-override", markoRepo);
  }

  // Resolve the `file:` deps against the freshly vendored copies.
  exec("npm install", appDir);

  console.log("\n> Done. Run `npm run build-prod` to build the benchmark app.");
}

// Copy a package directory, skipping artifacts that should not be vendored.
function copyPackage(from, to) {
  const skip = new Set(["node_modules", "__tests__"]);
  fs.cpSync(from, to, {
    recursive: true,
    filter(src) {
      const base = path.basename(src);
      return !skip.has(base) && !base.endsWith(".tsbuildinfo");
    },
  });
}

function exec(command, cwd) {
  console.log(`> ${command}  (in ${path.relative(appDir, cwd) || "."})`);
  cp.execSync(command, { cwd, stdio: "inherit" });
}
