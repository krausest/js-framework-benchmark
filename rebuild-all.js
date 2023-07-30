const takeWhile = require("lodash/takeWhile");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/*
This script rebuilds all frameworks from scratch,
it deletes all package.json and package-lock.json files
and invokes npm install and npm run build-prod for all benchmarks 

If building a framework fails you can resume building like
npm run rebuild-frameworks --restartWith keyed/react
*/

const cliArgs = process.argv.slice(2);

// Use npm ci or npm install ?
const useCi = cliArgs.includes("--ci");

// Copy package-lock back for docker build or build locally?
const useDocker = cliArgs.includes("--docker");

const restartBuildingWith = cliArgs.find((arg) => !arg.startsWith("--"));
const restartWithFramework = restartBuildingWith || "";

console.log(
  "ARGS",
  "ci",
  useCi,
  "docker",
  useDocker,
  "restartWith",
  restartWithFramework,
);

/**
 * @typedef {Object} Framework
 * @property {string} type - Type of the framework (e.g., "keyed" or "non-keyed")
 * @property {string} name - Name of the framework (e.g., "vue", "qwik", "svelte")
 */

/**
 * Returns an array of frameworks with their type and name
 * @example getFramewokrs()
 * @returns {Framework[]}
 */
function getFrameworks() {
  const keyedFrameworks = fs
    .readdirSync("./frameworks/keyed")
    .map((framework) => ({ type: "keyed", name: framework }));
  const nonKeyedFrameworks = fs
    .readdirSync("./frameworks/non-keyed")
    .map((framework) => ({ type: "non-keyed", name: framework }));
  return [...keyedFrameworks, ...nonKeyedFrameworks];
}

/**
 * @param {Framework}
 * @returns {boolean}
 */
function shouldSkipFramework({ type, name }) {
  if (!restartWithFramework) return false;
  if (restartWithFramework.indexOf("/") > -1) {
    return !`${type}/${name}`.startsWith(restartWithFramework);
  } else {
    return !name.startsWith(restartWithFramework);
  }
}

/**
 * Run a command synchronously in the specified directory
 * @param {string} command - The command to run
 * @param {string} cwd - The current working directory (optional)
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
 * @returns
 */
function buildFramework(framework) {
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
  const filesToDelete = ((useCi) ? [] : ["package-lock.json"]).concat([
    "yarn-lock",
    "dist",
    "elm-stuff",
    "bower_components",
    "node_modules",
    "output",
  ]);

  deleteFrameworkFiles(frameworkPath, filesToDelete);

  const installCmd = `npm ${useCi ? "ci" : "install"}`;
  runCommand(installCmd, frameworkPath);

  const buildCmd = "npm run build-prod";
  runCommand(buildCmd, frameworkPath);

  if (useDocker) {
    const packageLockPath = path.join(frameworkPath, "package-lock.json");
    const destinationPath = path.join("/src", packageLockPath);
    fs.copyFileSync(packageLockPath, destinationPath);
  }
}

function buildFrameworks() {
  const frameworks = getFrameworks();
  const skippableFrameworks = takeWhile(frameworks, shouldSkipFramework);
  const buildableFrameworks = frameworks.slice(skippableFrameworks.length);

  console.log("Building frameworks:", buildableFrameworks);

  for (const framework of buildableFrameworks) {
    buildFramework(framework);
  }

  console.log("All frameworks were built!");
}

buildFrameworks();
