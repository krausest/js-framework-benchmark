import { execSync } from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";
import { cwd } from "node:process";

import { getFrameworks } from "./helpers/frameworks.js";

/**
 * @typedef {Object} Framework
 * @property {string} name - Name of the framework (e.g., "vue", "qwik", "svelte")
 * @property {string} type - Type of the framework (e.g., "keyed" or "non-keyed")
 */

/** @param {string} frameworkPath */
function runNpmInstall(frameworkPath) {
  try {
    execSync("npm install --package-lock-only", {
      cwd: frameworkPath,
      stdio: "inherit",
    });
    console.log(`npm install completed successfully in ${frameworkPath}`);
  } catch (error) {
    console.error(`npm install failed in ${frameworkPath}: ${error.message}`);
  }
}

/**
 * Reads the lockfile, parses it, and returns the lockfile version. If lockfile is not found, returns an error.
 * @param {string} packageLockJSONPath
 * @returns
 */
function getPackageLockJSONVersion(packageLockJSONPath) {
  try {
    const packageLockJSON = fs.readFileSync(packageLockJSONPath, "utf8");
    const parsedPackageLockJSON = JSON.parse(packageLockJSON);
    return parsedPackageLockJSON.lockfileVersion;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Lockfile wasn't found. Create new!");
      return;
    }
    throw new Error(error.message);
  }
}

/**
 * Updates the lockfile of one framework
 * @param {Framework} framework
 * @param {number} latestLockfileVersion
 * @param {string} frameworkDirPath
 */
function updateFrameworkLockfile(framework, latestLockfileVersion, frameworkDirPath) {
  const { name, type } = framework;

  console.log(`Checking ${type} ${name} lockfile`);

  const frameworkPath = path.join(cwd(), frameworkDirPath, type, name);

  const packageLockJSONPath = path.join(frameworkPath, "package-lock.json");
  const packageLockJSONVersion = getPackageLockJSONVersion(packageLockJSONPath);

  if (packageLockJSONVersion === latestLockfileVersion) {
    console.log(`Skip update for v${latestLockfileVersion} lockfile`);
    return;
  }

  fs.rmSync(packageLockJSONPath, { force: true });
  runNpmInstall(frameworkPath);
}

/**
 * Updates all frameworks lockfiles in the frameworks directory.
 * @param {Object} options
 * @param {string} options.frameworksDirPath
 * @param {string[]} options.frameworksTypes
 * @param {string} options.latestLockfileVersion
 */
export function updateFrameworkLockfiles({ frameworksDirPath, frameworksTypes, latestLockfileVersion }) {
  console.log("Update framework names");

  const frameworks = getFrameworks(frameworksDirPath, frameworksTypes);

  for (const framework of frameworks) {
    updateFrameworkLockfile(framework, +latestLockfileVersion, frameworksDirPath);
  }
}
