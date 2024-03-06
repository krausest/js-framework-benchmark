// @ts-check
import { rebuildCheckSingle } from "./rebuild-check-single.js";
import { rebuildFrameworks } from "./rebuild-build-single.js";

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
 *
 * @param {Object} options
 * @param {string[]} options.frameworks
 * @param {boolean} options.useCi
 */
export function rebuildSingleFramework({ frameworks, useCi }) {
  console.log("Rebuild single:", "ci", useCi, "frameworks", frameworks);

  if (frameworks.length === 0) {
    console.log("ERROR: Missing arguments. Command: rebuild-single keyed/framework1 non-keyed/framework2 ...");
    process.exit(1);
  }

  try {
    rebuildFrameworks(frameworks, useCi);

    rebuildCheckSingle({ frameworks });
  } catch (error) {
    console.log(`ERROR: Rebuilding  ${frameworks} was not successful`);
  }
}
