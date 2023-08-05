const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const cliArgs = process.argv.length <= 2 ? [] : process.argv.slice(2);

// Use npm ci or npm install ?
const useCi = cliArgs.includes("--ci");

// Copy package-lock back for docker build or build locally?
const useDocker = cliArgs.includes("--docker");

const frameworks = cliArgs.filter((a) => !a.startsWith("--"));

console.log(
  "rebuild-build-single.js started: args",
  cliArgs,
  "useCi",
  useCi,
  "useDocker",
  useDocker,
  "frameworks",
  frameworks
);

/*
rebuild-single.js [--ci] [--docker] [keyed/framework1 ... non-keyed/frameworkN]

This script rebuilds a single framework
By default it rebuilds from scratch, deletes all package.json and package-lock.json files
and invokes npm install and npm run build-prod for the benchmark

With argument --ci it rebuilds using the package-lock.json dependencies, i.e.
it calls npm ci and npm run build-prod for the benchmark

Pass list of frameworks
*/

/**
 * Log command and run it with execSync
 * @param {string} command
 * @param {string|URL|undefined} cwd
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
  const pathToFramework = path.join("frameworks", keyed, name);

  if (useDocker) {
    if (fs.existsSync(pathToFramework)) {
      console.log("deleting folder ", pathToFramework);
      fs.rmSync(pathToFramework, { recursive: true });
    }

    const rsyncCmd = `rsync -avC --exclude elm-stuff --exclude dist --exclude output ${
      useCi ? "" : "--exclude package-lock.json"
    } --exclude tmp --exclude node_modules --exclude bower_components /src/frameworks/${keyed}/${name} /build/frameworks/${keyed}/`;
    runCommand(rsyncCmd);
  }

  const rmCmd = `rm -rf ${
    useCi ? "" : "package-lock.json"
  } yarn.lock dist elm-stuff bower_components node_modules output`;
  runCommand(rmCmd, pathToFramework);

  const installCmd = `npm ${useCi ? "ci" : "install"} && npm run build-prod`;
  runCommand(installCmd, pathToFramework);

  if (useDocker) {
    const packageJSONPath = path.join(pathToFramework, "package-lock.json");
    const destinationPath = path.join("/src", packageJSONPath);
    fs.copyFileSync(packageJSONPath, destinationPath);
  }
}

function rebuildFrameworks() {
  if (!frameworks.length) {
    console.log(
      "ERROR: Missing arguments. Command: docker-rebuild keyed/framework1 non-keyed/framework2 ..."
    );
    process.exit(1);
  }

  for (const framework of frameworks) {
    rebuildFramework(framework);
  }

  console.log("rebuild-build-single.js finished: Build finsished sucessfully!");
}

rebuildFrameworks();
