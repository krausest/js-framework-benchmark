// SPDX-License-Identifier: LicenseRef-Silicium-Community-1.0
// Protected under Patent Pending (The Silicium Authors). All rights reserved.

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const srcMain = join(rootDir, "src", "main.mjs");
const distDir = join(rootDir, "dist");

mkdirSync(distDir, { recursive: true });

// Remove any pre-compressed .gz artifacts
for (const entry of readdirSync(distDir)) {
  if (entry.endsWith(".gz")) {
    rmSync(join(distDir, entry), { force: true });
  }
}

const candidateSdkPaths = [
  join(rootDir, "node_modules", "silicium-dom", "sdk", "silicium_dom.mjs"),
  join(rootDir, "node_modules", "@silicium", "dom", "sdk", "silicium_dom.mjs"),
  resolve(rootDir, "..", "..", "..", "sdk", "silicium_dom.mjs"),
];
const candidateWasmPaths = [
  join(rootDir, "node_modules", "silicium-dom", "bin", "silicium_dom.wasm"),
  join(rootDir, "node_modules", "@silicium", "dom", "bin", "silicium_dom.wasm"),
  resolve(rootDir, "..", "..", "..", "bin", "silicium_dom.wasm"),
];

const sdkPath = candidateSdkPaths.find((p) => existsSync(p));
const wasmPath = candidateWasmPaths.find((p) => existsSync(p));
if (!sdkPath || !wasmPath) {
  throw new Error("Could not locate silicium_dom.mjs or silicium_dom.wasm in node_modules/silicium-dom or ../../../");
}

const sdkSource = readFileSync(sdkPath, "utf8")
  .replaceAll("../bin/silicium_dom.wasm", "./silicium_dom.wasm")
  .replace(/if\s*\(\s*typeof document !== "undefined"[\s\S]*?\}\s*$/, "");

const adapterSource = readFileSync(srcMain, "utf8")
  .replace(/^import\s+\{[^}]+\}\s+from\s+["'][^"']+["'];?\s*$/gm, "")
  .trim();

const distMjs = join(distDir, "main.mjs");
const distWasm = join(distDir, "silicium_dom.wasm");

writeFileSync(distMjs, `${sdkSource.trimEnd()}\n\n// --- Client Adapter (src/main.mjs) ---\n${adapterSource}\n`, "utf8");
copyFileSync(wasmPath, distWasm);

const wasmBytes = statSync(distWasm).size;
if (wasmBytes < 1024) {
  throw new Error(`Invalid WASM binary size in dist/: ${wasmBytes} bytes`);
}
console.log(`[silicium-wasm] build-prod complete: dist/main.mjs + dist/silicium_dom.wasm (${wasmBytes} B)`);
