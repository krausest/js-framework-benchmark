const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

const args = yargs(process.argv.slice(2))
  .usage("$0 [--ci --docker keyed/framework1 ... non-keyed/frameworkN]")
  .boolean("ci")
  .default("ci", false)
  .describe("ci", "Use npm ci or npm install ?")
  .boolean("docker")
  .default("docker", false)
  .describe(
    "docker",
    "Copy package-lock back for docker build or build locally?"
  ).argv;

/**
 * Use npm ci or npm install?
 * @type {boolean}
 */
const useCi = args.ci;

/**
 * Copy package-lock back for docker build or build locally?
 * @type {boolean}
 */
const useDocker = args.docker;

/**
 * @type {string}
 */
const frameworks = args._.filter((arg) => !arg.startsWith("--"));

console.log(
  "rebuild-build-single.js started: args",
  args,
  "useCi",
  useCi,
  "useDocker",
  useDocker,
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
  useCi && "package-lock.json",
].filter(Boolean);

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
 * Run a command synchronously in the specified directory and log command
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

  if (useDocker) {
    if (fs.existsSync(frameworkPath)) {
      console.log("deleting folder ", frameworkPath);
      fs.rmSync(frameworkPath, { recursive: true });
    }

    const rsyncCmd = `rsync -avC --exclude elm-stuff --exclude dist --exclude output ${
      useCi ? "" : "--exclude package-lock.json"
    } --exclude tmp --exclude node_modules --exclude bower_components /src/frameworks/${keyed}/${name} /build/frameworks/${keyed}/`;
    runCommand(rsyncCmd);
  }

  deleteFrameworkFiles(frameworkPath, filesToDelete);

  const installCmd = `npm ${useCi ? "ci" : "install"}`;
  runCommand(installCmd, frameworkPath);

  const buildCmd = "npm run build-prod";
  runCommand(buildCmd, frameworkPath);

  if (useDocker) {
    const packageJSONPath = path.join(frameworkPath, "package-lock.json");
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
