import { execSync } from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";
import yargs from "yargs";

const args = yargs(process.argv.slice(2))
  .usage("$0 [--ci keyed/framework1 ... non-keyed/frameworkN]")
  .boolean("ci")
  .default("ci", false)
  .describe("ci", "Use npm ci or npm install ?")
  .argv;

/**
 * Use npm ci or npm install?
 * @type {boolean}
 */
const useCi = args.ci;

/**
 * @type {string}
 */
const frameworks = args._.filter((arg) => !arg.startsWith("--"));

console.log(
  "rebuild-build-single.js started: args",
  args,
  "useCi",
  useCi,
  "frameworks",
  frameworks
);

const filesToDelete = [
  "yarn-lock",
  "dist",
  "elm-stuff",
  "bower_components",
  "node_modules",
  "output",
].concat(useCi ? [] : ["package-lock.json"]);

/*
rebuild-single.js [--ci] [keyed/framework1 ... non-keyed/frameworkN]

This script rebuilds a single framework
By default it rebuilds from scratch, deletes all package.json and package-lock.json files
and invokes npm install and npm run build-prod for the benchmark

With argument --ci it rebuilds using the package-lock.json dependencies, i.e.
it calls npm ci and npm run build-prod for the benchmark

Pass list of frameworks
*/

/**
 * Run a command synchronously in the specified directory and log command
 * @param {string} command - The command to run
 * @param {string} cwd - The current working directory (optional)
 */
function runCommand(command, cwd = undefined) {
  console.log(command);
  if (cwd) {
    if (!fs.existsSync(cwd)) {
      throw `working directory ${cwd} doesn't exist.`;
    }
  }
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
 * @param {string} framework
 */
function rebuildFramework(framework) {
  const components = framework.split("/");

  if (components.length !== 2) {
    console.log(
      `ERROR: invalid name ${framework}. It must contain exactly one /.`
    );
    process.exit(1);
  }

  const [keyed, name] = components;
  const frameworkPath = path.join("frameworks", keyed, name);

  deleteFrameworkFiles(frameworkPath, filesToDelete);

  const installCmd = `npm ${useCi ? "ci" : "install"}`;
  runCommand(installCmd, frameworkPath);

  const buildCmd = "npm run build-prod";
  runCommand(buildCmd, frameworkPath);

}

function rebuildFrameworks() {
  if (!frameworks.length) {
    console.log(
      "ERROR: Missing arguments. Command: rebuild keyed/framework1 non-keyed/framework2 ..."
    );
    process.exit(1);
  }

  for (const framework of frameworks) {
    rebuildFramework(framework);
  }

  console.log("rebuild-build-single.js finished: Build finsished sucessfully!");
}

rebuildFrameworks();
