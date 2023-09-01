import { execSync } from "node:child_process";
import { cwd } from "node:process";
import * as fs from "node:fs";
import path from "node:path";
import yargs from "yargs";

const args = yargs(process.argv)
  .usage("$0 [--frameworks-dir]")
  .help("help")
  .string("frameworks-dir")
  .default("frameworks-dir", "frameworks")
  .array("frameworks-types")
  .default("frameworks-types", ["keyed", "non-keyed"])
  .number("latest-lockfile-version")
  .default("latest-lockfile-version", 3).argv;

/**
 * @type {string}
 */
const frameworksDir = args.frameworksDir;

/**
 * @type {string[]}
 */
const frameworksTypes = args.frameworksTypes;

/**
 * @type {number}
 */
const latestLockfileVersion = args.latestLockfileVersion;

/**
 * @typedef {Object} Framework
 * @property {string} name - Name of the framework (e.g., "vue", "qwik", "svelte")
 * @property {string} type - Type of the framework (e.g., "keyed" or "non-keyed")
 */

/**
 * Returns an array with arrays of types and names of frameworks
 * @returns {Framework[]}
 */
function getFrameworks() {
  const frameworks = frameworksTypes.flatMap((type) =>
    fs.readdirSync(path.join(frameworksDir, type)).map((framework) => ({
      name: framework,
      type,
    })),
  );

  return frameworks;
}

/**
 * @param {string} frameworkPath
 */
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
    const packageLockJSON = fs.readFileSync(packageLockJSONPath, "utf-8");
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
 */
function processFramework(framework) {
  const { name, type } = framework;

  console.log(`Checking ${type} ${name} lockfile`);

  const frameworkPath = path.join(cwd(), frameworksDir, type, name);

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
 */
function processAllFrameworks() {
  const frameworks = getFrameworks();

  for (const framework of frameworks) {
    processFramework(framework);
  }
}

processAllFrameworks();
