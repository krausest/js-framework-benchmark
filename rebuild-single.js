import { execSync } from "node:child_process";
import yargs from "yargs";

const args = yargs(process.argv.slice(2))
  .usage("$0 [--ci  keyed/framework1 ... non-keyed/frameworkN]")
  .boolean("ci")
  .default("ci", false)
  .describe("ci", "Use npm ci or npm install ?")
  .argv;

/**
 * Use npm ci or npm install ?
 * @type {boolean}
 */
const useCi = args.ci;

/**
 * @type {string}
 */
const frameworks = args._.filter((arg) => !arg.startsWith("--"));

/**
 * @type {string}
 */
const frameworksNames = frameworks.join(" ");

console.log(
  "rebuild-single.js args",
  args,
  "ci",
  useCi,
  "frameworks",
  frameworks
);

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
  execSync(command, { stdio: "inherit", cwd });
}

try {
  if (frameworks.length == 0) {
    console.log(
      "ERROR: Missing arguments. Command: rebuild-single keyed/framework1 non-keyed/framework2 ..."
    );
    process.exit(1);
  }

  const buildCmd = `node rebuild-build-single.js ${useCi ? '--ci' : ''} ${frameworksNames}`;
  runCommand(buildCmd);

  const checkCmd = `node rebuild-check-single.js ${frameworksNames}`;
  runCommand(checkCmd);
} catch (e) {
  console.log(`ERROR: Rebuilding  ${frameworksNames} was not successful`);
}
