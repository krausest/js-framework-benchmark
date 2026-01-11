import path from "node:path";
import * as fs from "node:fs";

import { frameworksDirectory } from "../config/directories.js";
import { buildFrameworkVersionString, copyProps } from "./helpers/index.js";
import { BenchmarkData, Result } from "./types/index.js";

function isErrorWithCode(err: unknown): err is Error & { code: unknown } {
  return err instanceof Error && "code" in err;
}

const keyedTypes = ["keyed", "non-keyed"];

class PackageJSONProvider {
  #frameworksDir;

  constructor(frameworksDir: string) {
    this.#frameworksDir = frameworksDir;
  }

  async getPackageJSON(keyedDir: string, framework: string) {
    try {
      const packageJSONPath = path.join(this.#frameworksDir, keyedDir, framework, "package.json");
      const packageJSON = await fs.promises.readFile(packageJSONPath, "utf8");
      return JSON.parse(packageJSON);
    } catch (error) {
      if (error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT") {
        throw new Error(`Package.json not found for ${framework}.`);
      }
      console.error(`error in ${keyedDir}/${framework} ${error}`);
    }
  }

  async getPackageLockJSON(keyedDir: string, framework: string) {
    try {
      const packageLockJSONPath = path.join(this.#frameworksDir, keyedDir, framework, "package-lock.json");
      const packageLockJSON = await fs.promises.readFile(packageLockJSONPath, "utf8");
      return JSON.parse(packageLockJSON);
    } catch (error) {
      if (isErrorWithCode(error) && error.code === "ENOENT") {
        throw new Error(`Package-lock.json not found for ${framework}.`);
      }
      console.error(`error in ${keyedDir}/${framework} ${error}`);
    }
  }
}

function isFrameworkDir(keyedDir: string, framework: string): boolean {
  const frameworkPath = path.resolve(frameworksDirectory, keyedDir, framework);
  const packageJSONPath = path.resolve(frameworkPath, "package.json");
  const packageLockJSONPath = path.resolve(frameworkPath, "package-lock.json");

  return fs.existsSync(packageJSONPath) && fs.existsSync(packageLockJSONPath);
}

const packageJSONProvider = new PackageJSONProvider(frameworksDirectory);

/**
 * Load framework information from package.json and package-lock.json files.
 */
export async function loadFrameworkInfo(keyedDir: string, framework: string) {
  const result: Result = {
    type: keyedDir,
    directory: framework,
  };
  const packageJSON = await packageJSONProvider.getPackageJSON(keyedDir, framework);
  const packageLockJSON = await packageJSONProvider.getPackageLockJSON(keyedDir, framework);

  const benchmarkData: Partial<BenchmarkData> = packageJSON["js-framework-benchmark"];
  if (!benchmarkData) {
    result.error = "package.json must contain a 'js-framework-benchmark' property";
    return result;
  }

  if (benchmarkData.frameworkVersionFromPackage) {
    const packageNames = benchmarkData.frameworkVersionFromPackage.split(":");
    const versions: Required<Result>["versions"] = {};

    for (const packageName of packageNames) {
      const packageVersion =
        packageLockJSON.dependencies?.[packageName]?.version ||
        packageLockJSON.packages?.[`node_modules/${packageName}`]?.version ||
        "ERROR: Not found in package-lock";
      versions[packageName] = packageVersion;
    }

    result.frameworkVersionString = buildFrameworkVersionString(
      framework,
      packageNames.map((name) => versions[name]).join(" + "),
      keyedDir
    );

    result.versions = versions;

    copyProps(result, benchmarkData);
  } else if (typeof benchmarkData.frameworkVersion === "string") {
    result.version = benchmarkData.frameworkVersion;
    result.frameworkVersionString = buildFrameworkVersionString(framework, result.version, keyedDir);

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
    const directories = await fs.promises.readdir(path.resolve(frameworksDirectory, keyedType));

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
