// @ts-check
import * as fs from "node:fs";
import path from "node:path";

const ALLOWED_REGISTRY_PREFIXES = [
  "https://registry.npmjs.org/",
];

/**
 * Validates that all resolved URLs in a package-lock.json point to allowed registries.
 * This prevents supply chain attacks where a contributor points resolved URLs to a malicious registry.
 * @param {string} frameworkPath - Path to the framework directory (e.g., "frameworks/keyed/vue")
 * @returns {{ valid: boolean, violations: string[] }}
 */
export function validateLockfileUrls(frameworkPath) {
  const lockfilePath = path.join(frameworkPath, "package-lock.json");

  if (!fs.existsSync(lockfilePath)) {
    return { valid: true, violations: [] };
  }

  const lockfile = JSON.parse(fs.readFileSync(lockfilePath, "utf-8"));
  const violations = [];

  const packages = lockfile.packages;
  if (!packages) {
    return { valid: true, violations: [] };
  }

  for (const [pkg, entry] of Object.entries(packages)) {
    const resolved = /** @type {any} */ (entry).resolved;
    if (!resolved) continue;

    const isAllowed = ALLOWED_REGISTRY_PREFIXES.some((prefix) => resolved.startsWith(prefix));
    if (!isAllowed) {
      violations.push(`${pkg || "(root)"}: ${resolved}`);
    }
  }

  return { valid: violations.length === 0, violations };
}
