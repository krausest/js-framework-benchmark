// SPDX-License-Identifier: LicenseRef-Silicium-Community-1.0
// Protected under Patent Pending (The Silicium Authors). All rights reserved.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const srcMain = join(rootDir, "src", "main.mjs");
const distDir = join(rootDir, "dist");

mkdirSync(distDir, { recursive: true });

// Remove any pre-compressed .gz artifacts (Rule P04)
for (const entry of readdirSync(distDir)) {
  if (entry.endsWith(".gz")) {
    rmSync(join(distDir, entry), { force: true });
  }
}

const candidateSdkPaths = [
  join(rootDir, "node_modules", "silicium-dom", "sdk", "silicium_v8_dom.mjs"),
  resolve(rootDir, "..", "..", "..", "sdk", "silicium_v8_dom.mjs"),
];

const sdkPath = candidateSdkPaths.find((p) => existsSync(p));
if (!sdkPath) {
  throw new Error("Could not locate silicium_v8_dom.mjs in node_modules/silicium-dom or ../../../sdk");
}

const sdkSource = readFileSync(sdkPath, "utf8")
  .replace(/\/\*\*[\s\S]*?\*\/\s*/, "")
  .replace(
    /if\s*\(\s*typeof document !== "undefined"[\s\S]*?\}\s*$/,
    ""
  );

const adapterSource = readFileSync(srcMain, "utf8")
  .replace(/^import\s+\{[^}]+\}\s+from\s+["'][^"']+["'];?\s*$/gm, "")
  .trim();

const distMjs = join(distDir, "main.mjs");
writeFileSync(distMjs, `${sdkSource.trimEnd()}\n\n// --- Client Adapter (src/main.mjs) ---\n${adapterSource}\n`, "utf8");

const mjsBytes = statSync(distMjs).size;
if (mjsBytes < 1024) {
  throw new Error(`Invalid V8 bundle size in dist/: ${mjsBytes} bytes`);
}
console.log(`[silicium-v8] build-prod complete: dist/main.mjs (${mjsBytes} B)`);
