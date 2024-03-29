// @ts-check
import { execSync } from "node:child_process";

/*
rebuild-check-single.js [keyed/framework1 ... non-keyed/frameworkN]

This script is used to run benchmarks and check if the specified frameworks are keyed.

It performs the following steps:
1. Executes benchmarks for the specified frameworks with the necessary options.
2. Checks if the specified frameworks are keyed.

Pass list of frameworks
*/

/**
 * Run a command synchronously in the specified directory and log command
 * @param {string} command - The command to run
 * @param {string|undefined} cwd - The current working directory (optional)
 */
function runCommand(command, cwd) {
  console.log(command);
  execSync(command, { stdio: "inherit", cwd });
}

/**
 * @param {Object} options
 * @param {Array<string>} options.frameworks
 */
export function rebuildCheckSingle({ frameworks }) {
  console.log("Rebuild check single:", "frameworks", frameworks);

  const frameworkNames = frameworks.join(" ");

  try {
    const benchCmd = `npm run bench -- --headless true --smoketest true ${frameworkNames}`;
    runCommand(benchCmd, "webdriver-ts");

    const keyedCmd = `npm run isKeyed -- --headless true ${frameworkNames}`;
    runCommand(keyedCmd, "webdriver-ts");

    const cspCmd = `npm run checkCSP -- --headless true ${frameworkNames}`;
    runCommand(cspCmd, "webdriver-ts");

    console.log("rebuild-check-single.js finished");
    console.log("All checks are fine!");
    console.log(`======> Please rerun the benchmark: npm run bench ${frameworkNames}`);
  } catch (error) {
    console.log(`rebuild-check-single failed for ${frameworks.join(" ")}`);
    process.exit(-1);
  }
}
