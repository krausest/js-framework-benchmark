import path from "node:path";
import * as fs from "node:fs";

import { frameworksDirectory } from "../config/directories.js";
import { buildFrameworkVersionString, copyProps } from "./helpers/index.js";

const keyedTypes = ["keyed", "non-keyed"];

class PackageJSONProvider {
  #frameworksDir;

  /** @param {string} frameworksDir */
  constructor(frameworksDir) {
    this.#frameworksDir = frameworksDir;
  }

  /**
   * Returns the parsed package.json
   * @param {string} keyedDir
   * @param {string} framework
   * @returns {Promise<unknown>}
   */
  async getPackageJSON(keyedDir, framework) {
    try {
      const packageJSONPath = path.join(
        this.#frameworksDir,
        keyedDir,
        framework,
        "package.json",
      );
      const packageJSON = await fs.promises.readFile(packageJSONPath, "utf-8");
      return JSON.parse(packageJSON);
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`Package.json not found for ${framework}.`);
      }
      console.error(error);
    }
  }

  /**
   * Returns the parsed package-lock.json
   * @param {string} keyedDir
   * @param {string} framework
   * @returns {Promise<unknown>}
   */
  async getPackageLockJSON(keyedDir, framework) {
    try {
      const packageLockJSONPath = path.join(
        this.#frameworksDir,
        keyedDir,
        framework,
        "package-lock.json",
      );
      const packageLockJSON = await fs.promises.readFile(
        packageLockJSONPath,
        "utf-8",
      );
      return JSON.parse(packageLockJSON);
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`Package-lock.json not found for ${framework}.`);
      }
      console.error(error);
    }
  }
}

/**
 * @param {string} keyedDir
 * @param {string} framework
 * @returns {boolean}
 */
function isFrameworkDir(keyedDir, framework) {
  const frameworkPath = path.resolve(frameworksDirectory, keyedDir, framework);
  const packageJSONPath = path.resolve(frameworkPath, "package.json");
  const packageLockJSONPath = path.resolve(frameworkPath, "package-lock.json");
  const exists =
    fs.existsSync(packageJSONPath) && fs.existsSync(packageLockJSONPath);

  return exists;
}

const packageJSONProvider = new PackageJSONProvider(frameworksDirectory);

/**
 * Load framework information from package.json and package-lock.json files.
 * @param {string} keyedDir - The type of the framework directory (e.g., "keyed" or "non-keyed").
 * @param {string} framework - The name of the framework directory.
 * @returns {Promise<object>} - The loaded framework information.
 */
export async function loadFrameworkInfo(keyedDir, framework) {
  const result = {
    type: keyedDir,
    directory: framework,
  };
  const packageJSON = await packageJSONProvider.getPackageJSON(
    keyedDir,
    framework,
  );
  const packageLockJSON = await packageJSONProvider.getPackageLockJSON(
    keyedDir,
    framework,
  );

  const benchmarkData = packageJSON["js-framework-benchmark"];
  if (!benchmarkData) {
    result.error =
      "package.json must contain a 'js-framework-benchmark' property";
    return result;
  }

  if (benchmarkData.frameworkVersionFromPackage) {
    const packageNames = benchmarkData.frameworkVersionFromPackage.split(":");

    result.versions = {};

    for (const packageName of packageNames) {
      if (packageLockJSON.dependencies?.[packageName]) {
        result.versions[packageName] =
          packageLockJSON.dependencies[packageName].version;
      } else if (packageLockJSON.packages?.[`node_modules/${packageName}`]) {
        result.versions[packageName] =
          packageLockJSON.packages[`node_modules/${packageName}`].version;
      } else {
        result.versions[packageName] = "ERROR: Not found in package-lock";
      }
    }

    result.frameworkVersionString = buildFrameworkVersionString(
      framework,
      packageNames.map((name) => result.versions[name]).join(" + "),
      keyedDir,
    );

    copyProps(result, benchmarkData);
  } else if (typeof benchmarkData.frameworkVersion === "string") {
    result.version = benchmarkData.frameworkVersion;
    result.frameworkVersionString = buildFrameworkVersionString(
      framework,
      result.version,
      keyedDir,
    );

    copyProps(result, benchmarkData);
  } else {
    result.error =
      "package.json must contain a 'frameworkVersionFromPackage' or 'frameworkVersion' in the 'js-framework-benchmark'.property";
  }

  return result;
}

export async function loadFrameworkVersions() {
  const resultsProm = [];

  for (const keyedType of keyedTypes) {
    const directories = await fs.promises.readdir(
      path.resolve(frameworksDirectory, keyedType),
    );

    for (const directory of directories) {
      if (!isFrameworkDir(keyedType, directory)) {
        continue;
      }

      const frameworkInfoPromise = loadFrameworkInfo(keyedType, directory);
      resultsProm.push(frameworkInfoPromise);
    }
  }
  return Promise.all(resultsProm);
}
