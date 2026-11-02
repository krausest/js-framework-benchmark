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

let sdkSource = readFileSync(sdkPath, "utf8")
  .replace(/\/\*\*[\s\S]*?\*\/\s*/, "")
  .replace(/\b(?!DEFAULT_)ADJECTIVES\b/g, "DEFAULT_ADJECTIVES")
  .replace(/\b(?!DEFAULT_)COLOURS\b/g, "DEFAULT_COLOURS")
  .replace(/\b(?!DEFAULT_)NOUNS\b/g, "DEFAULT_NOUNS")
  .replace(/\bexport const ROW_HTML\b/g, "export const DEFAULT_ROW_HTML")
  .replace(
    /const doc = container\.ownerDocument \|\| document;\s*const tpl1 = doc\.createElement\("template"\);\s*tpl1\.innerHTML = ROW_HTML;/,
    'const ROW_HTML = props.rowHtml || DEFAULT_ROW_HTML;\n    const doc = container.ownerDocument || document;\n    const tpl1 = doc.createElement("template");\n    tpl1.innerHTML = ROW_HTML;'
  )
  .replace(
    /if\s*\(\s*typeof document !== "undefined"[\s\S]*?\}\s*$/,
    ""
  );

if (!sdkSource.includes("appendRowsData(")) {
  sdkSource = sdkSource.replace(
    /render\(countOrRows,\s*isAppend\s*=\s*false\)\s*\{\s*const count = typeof countOrRows === "number" \? countOrRows : countOrRows\.length;\s*const view = isAppend \? this\.engine\.appendRows\(count\) : this\.engine\.buildRows\(count\);/,
    `render(countOrRows, isAppend = false) {
    let view;
    if (Array.isArray(countOrRows)) {
      const start = isAppend ? this.engine.count : 0;
      const total = start + countOrRows.length;
      this.engine.ensureCapacity(total);
      this.engine.count = total;
      for (let i = 0; i < countOrRows.length; i++) {
        const r = countOrRows[i];
        this.engine.ids[start + i] = r.id;
        this.engine.labels[start + i] = r.label;
      }
      view = this.engine.getRowView();
    } else {
      const count = typeof countOrRows === "number" ? countOrRows : countOrRows.length;
      view = isAppend ? this.engine.appendRows(count) : this.engine.buildRows(count);
    }`
  );
}

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
