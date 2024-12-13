// @ts-check
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";

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
 * @param {string|undefined} cwd - The current working directory (optional)
 */
function runCommand(command, cwd) {
  console.log(`running '${command}' in '${cwd}'`);
  if (cwd && !fs.existsSync(cwd)) {
    throw `working directory ${cwd} doesn't exist.`;
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
 * @param {boolean} useCi
 */
export function rebuildFramework(framework, useCi) {
  const components = framework.split("/");

  if (components.length !== 2) {
    console.log(`ERROR: invalid name ${framework}. It must contain exactly one /.`);
    return false
  }
  console.log("Rebuilding framework", framework);
  const [keyed, name] = components;
  const frameworkPath = path.join("frameworks", keyed, name);

  const filesToDelete = ["yarn-lock", "dist", "elm-stuff", "bower_components", "node_modules", "output"].concat(
    useCi ? [] : ["package-lock.json"]
  );

  deleteFrameworkFiles(frameworkPath, filesToDelete);

  const installCmd = `npm ${useCi ? "ci" : "install"}`;
  runCommand(installCmd, frameworkPath);
  const buildCmd = "npm run build-prod";
  runCommand(buildCmd, frameworkPath);
  return true;
}

/**
 * @param {string[]} frameworks
 * @param {boolean} useCi
 */
export function rebuildFrameworks(frameworks, useCi) {
  console.log("Rebuild build single: useCi", useCi, "frameworks", frameworks);

  if (frameworks.length === 0) {
    console.log("ERROR: Missing arguments. Command: rebuild keyed/framework1 non-keyed/framework2 ...");
    return false;
  }

  for (const framework of frameworks) {
    if (!rebuildFramework(framework, useCi)) {
      return false;
    }
  }

  console.log("rebuild-build-single.js finished: Build finsished sucessfully!");
  return true;
}
