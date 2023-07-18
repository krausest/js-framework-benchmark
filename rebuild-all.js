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

const [, , ...cliArgs] = process.argv;

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
  restartWithFramework
);

/**
 * Returns an array with arrays of types and names of frameworks
 * @example getFramewokrs()
 * @returns [["keyed", "vue"],["keyed", "qwik"],["non-keyed", "svelte"]]
 */
function getFrameworks() {
  const keyedFrameworks = fs
    .readdirSync("./frameworks/keyed")
    .map((framework) => ["keyed", framework]);
  const nonKeyedFrameworks = fs
    .readdirSync("./frameworks/non-keyed")
    .map((framework) => ["non-keyed", framework]);
  return [...keyedFrameworks, ...nonKeyedFrameworks];
}

/**
 * @param {[string,string]} tuple
 * @returns {boolean}
 */
function shouldSkipFramework([dir, name]) {
  if (!restartWithFramework) return false;
  if (restartWithFramework.indexOf("/") > -1) {
    return !`${dir}/${name}`.startsWith(restartWithFramework);
  } else {
    return !name.startsWith(restartWithFramework);
  }
}

/**
 * @param {string} frameworkPath
 */
function removeFiles(frameworkPath) {
  const rmCmd = `rm -rf ${
    useCi ? "" : "package-lock.json"
  } yarn.lock dist elm-stuff bower_components node_modules output`;
  console.log(rmCmd);
  execSync(rmCmd, {
    cwd: frameworkPath,
    stdio: "inherit",
  });
}

/**
 * @param {string} frameworkPath
 */
function installAndBuild(frameworkPath) {
  const installCmd = `npm ${useCi ? "ci" : "install"} && npm run build-prod`;
  console.log(installCmd);
  execSync(installCmd, {
    cwd: frameworkPath,
    stdio: "inherit",
  });
}

/**
 * @param {string} frameworkPath
 */
function copyPackageLock(frameworkPath) {
  if (useDocker) {
    const packageLockPath = path.join(frameworkPath, "package-lock.json");
    fs.copyFileSync(packageLockPath, path.join("/src", packageLockPath));
  }
}

function buildFrameworks() {
  const frameworks = getFrameworks();
  const skippableFrameworks = takeWhile(frameworks, shouldSkipFramework);
  const buildableFrameworks = frameworks.slice(skippableFrameworks.length);

  console.log("Building frameworks:", buildableFrameworks);

  for (const framework of buildableFrameworks) {
    console.log("Building framework:", framework);

    const [keyed, name] = framework;
    const frameworkPath = path.join("frameworks", keyed, name);

    if (!fs.existsSync(`${frameworkPath}/package.json`)) {
      console.log(
        "WARN: skipping ",
        framework,
        " since there's no package.json"
      );
      continue;
    }
    // if (fs.existsSync(path)) {
    //     console.log("deleting folder ",path);
    //     execSync(`rm -r ${path}`);
    // }
    // rsync(keyed,name);

    removeFiles(frameworkPath);
    installAndBuild(frameworkPath);
    copyPackageLock(frameworkPath);
  }

  console.log("All frameworks were built!");
}

buildFrameworks();
