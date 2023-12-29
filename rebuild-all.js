import { execSync } from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";
import yargs from "yargs";
import { takeWhile } from "./utils/common/index.js";
import { getFrameworks } from "./utils/frameworks/index.js";
import { hideBin } from "yargs/helpers";
import esMain from "es-main";

/*
This script rebuilds all frameworks from scratch,
it deletes all package.json and package-lock.json files
and invokes npm install and npm run build-prod for all benchmarks 

If building a framework fails you can resume building like
npm run rebuild-frameworks --restartWith keyed/react
*/

/**
 * @typedef {Object} Framework
 * @property {string} name - Name of the framework (e.g., "vue", "qwik", "svelte")
 * @property {string} type - Type of the framework (e.g., "keyed" or "non-keyed")
 */

/**
 * @param {Framework} framework
 * @param {string} restartWithFramework
 * @returns {boolean}
 */
function shouldSkipFramework({ type, name }, restartWithFramework) {
  if (!restartWithFramework) return false;
  if (restartWithFramework.indexOf("/") > -1) {
    return !`${type}/${name}`.startsWith(restartWithFramework);
  } else {
    return !name.startsWith(restartWithFramework);
  }
}

/**
 * Run a command synchronously in the specified directory and log command
 * @param {string} command - The command to run
 * @param {string} [cwd] - The current working directory (optional)
 */
function runCommand(command, cwd = undefined) {
  console.log(command);
  execSync(command, { stdio: "inherit", cwd });
}

/**
 * Delete specified files in the framework directory
 * @param {string} frameworkPath
 * @param {string[]} filesToDelete
 */
function deleteFrameworkFiles(frameworkPath, filesToDelete) {
  for (const file of filesToDelete) {
    const filePath = path.join(frameworkPath, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  }
  console.log(`Deleted: ${filesToDelete}`);
}

/**
 * Build single framework
 * @param {Framework} framework
 * @param {boolean} useCi
 * @returns
 */
function buildFramework(framework, useCi) {
  console.log("Building framework:", framework);

  const { type, name } = framework;
  const frameworkPath = path.join("frameworks", type, name);
  const packageJSONPath = path.join(frameworkPath, "package.json");

  if (!fs.existsSync(packageJSONPath)) {
    console.log(`WARN: skipping ${framework} since there's no package.json`);
    return;
  }
  // if (fs.existsSync(path)) {
  //     console.log("deleting folder ",path);
  //     execSync(`rm -r ${path}`);
  // }
  // rsync(keyed,name);

  const filesToDelete = [
    "yarn-lock",
    "dist",
    "elm-stuff",
    "bower_components",
    "node_modules",
    "output",
  ].concat(useCi ? [] : ["package-lock.json"]);

  deleteFrameworkFiles(frameworkPath, filesToDelete);

  const installCmd = `npm ${useCi ? "ci" : "install"}`;
  runCommand(installCmd, frameworkPath);

  const buildCmd = "npm run build-prod";
  runCommand(buildCmd, frameworkPath);
}

/**
 * @param {string} restartWithFramework
 * @param {boolean} useCi
 */
function buildFrameworks(restartWithFramework, useCi) {
  const frameworks = getFrameworks();

  const skippableFrameworks = takeWhile(frameworks, (framework) =>
    shouldSkipFramework(framework, restartWithFramework)
  );
  const buildableFrameworks = frameworks.slice(skippableFrameworks.length);

  // console.log("Building frameworks:", buildableFrameworks);

  for (const framework of buildableFrameworks) {
    buildFramework(framework, useCi);
  }

  console.log("All frameworks were built!");
}

if (esMain(import.meta)) {
  const args = yargs(hideBin(process.argv))
    .usage("$0 [--ci keyed/framework1 ... non-keyed/frameworkN]")
    .help()
    .boolean("ci")
    .default("ci", false)
    .default("restartWith", "")
    .describe("ci", "Use npm ci or npm install?")
    .parseSync();

  const useCi = args.ci;
  const restartWithFramework = args.restartWith;

  console.log("ARGS", args, "ci", useCi, "restartWith", restartWithFramework);

  buildFrameworks(restartWithFramework, useCi);
}
