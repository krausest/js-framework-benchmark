// @ts-check
import { rebuildFramework } from "./helpers/rebuild-utils.js";

export { rebuildFramework };

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
