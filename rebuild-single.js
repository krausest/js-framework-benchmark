import { rebuildCheckSingle } from "./cli/rebuild-check-single.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { rebuildFrameworks } from "./cli/rebuild-build-single.js";
import esMain from "es-main";

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
function rebuildSingle(frameworks, useCi) {
  console.log("rebuild-single.js: ci", useCi, "frameworks", frameworks);

  const frameworkNames = frameworks.join(" ");

  try {
    if (frameworks.length == 0) {
      console.log("ERROR: Missing arguments. Command: rebuild-single keyed/framework1 non-keyed/framework2 ...");
      process.exit(1);
    }

    rebuildFrameworks(frameworks, useCi);

    rebuildCheckSingle(frameworks);
  } catch (e) {
    console.log(`ERROR: Rebuilding  ${frameworkNames} was not successful`);
  }
}

if (esMain(import.meta)) {
  const args = yargs(hideBin(process.argv))
    .usage("$0 [--ci  keyed/framework1 ... non-keyed/frameworkN]")
    .boolean("ci")
    .default("ci", false)
    .describe("ci", "Use npm ci or npm install ?")
    .parseSync();

  const useCi = args.ci;
  const frameworks = args._.filter((arg) => !arg.startsWith("--"));

  console.log("args", args);
  rebuildSingle(frameworks, useCi);
}
