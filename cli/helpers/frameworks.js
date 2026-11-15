// @ts-check
import * as fs from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} Framework
 * @property {string} name - Name of the framework (e.g., "vue", "qwik", "svelte")
 * @property {string} type - Type of the framework (e.g., "keyed" or "non-keyed")
 */

/**
 * Returns an array with arrays of types and names of frameworks
 * @param {string} frameworksDirPath
 * @param {Array<string>} frameworksTypes
 * @returns {Framework[]}
 */
export function getFrameworks(frameworksDirPath = "frameworks", frameworksTypes = ["keyed", "non-keyed"]) {
  const frameworks = frameworksTypes
    // non-keyed implementations are retired, so frameworks/non-keyed may not exist
    .filter((type) => fs.existsSync(path.join(frameworksDirPath, type)))
    .flatMap((type) =>
      fs.readdirSync(path.join(frameworksDirPath, type)).map((framework) => ({
        name: framework,
        type,
      }))
    );

  return frameworks;
}

/**
 * Reads the installed versions of the given packages from a package-lock.json
 * @param {string} packageJSONLockPath
 * @param {string[]} packageNames
 * @returns {Record<string, string>} version per package name
 */
export function getVersionFromPackageLock(packageJSONLockPath, packageNames) {
  if (!fs.existsSync(packageJSONLockPath)) {
    throw new Error(`package-lock.json not found at ${packageJSONLockPath}`);
  }

  const packageLockJSON = JSON.parse(fs.readFileSync(packageJSONLockPath, "utf8"));
  /** @type {Record<string, string>} */
  const versions = {};

  for (const packageName of packageNames) {
    versions[packageName] =
      packageLockJSON.dependencies?.[packageName]?.version ||
      packageLockJSON.packages?.[`node_modules/${packageName}`]?.version ||
      "ERROR: Not found in package-lock";
  }
  return versions;
}

/**
 * Builds the framework name as used in the benchmark results (e.g. "vue-v3.5.0-keyed").
 * Mirrors loadFrameworkInfo / buildFrameworkVersionString in the server.
 * @param {string} type - "keyed" or "non-keyed"
 * @param {string} name - directory name of the framework
 * @param {any} packageJSON - parsed package.json of the framework
 * @returns {string | null} null if the version can't be determined
 */
export function getFrameworkVersionString(type, name, packageJSON) {
  const meta = packageJSON?.["js-framework-benchmark"] ?? {};
  let version;

  if (meta.frameworkVersionFromPackage) {
    const packageNames = meta.frameworkVersionFromPackage.split(":");
    const lockPath = path.join("frameworks", type, name, "package-lock.json");
    try {
      const versions = getVersionFromPackageLock(lockPath, packageNames);
      version = packageNames.map((packageName) => versions[packageName]).join(" + ");
    } catch {
      return null;
    }
  } else if (typeof meta.frameworkVersion === "string") {
    version = meta.frameworkVersion;
  } else {
    return null;
  }

  return `${name}${version ? `-v${version}` : ""}-${type}`;
}
