// @ts-check
import { takeWhile } from "./utils/index.js";
import { getFrameworks } from "./helpers/frameworks.js";
import { rebuildFramework } from "./helpers/rebuild-utils.js";

/*
This script rebuilds all frameworks from scratch,
it deletes all package.json and package-lock.json files
and invokes npm install and npm run build-prod for all benchmarks 

If building a framework fails you can resume building like
npm run rebuild-frameworks --restartWith keyed/react
*/

/**
 * @typedef {Object} Framework
 * @property {string} name - Name of the framework (e.g., "vue", "qwik", "svelte")
 * @property {string} type - Type of the framework (e.g., "keyed" or "non-keyed")
 */

/**
 * @param {Framework} framework
 * @param {string} restartWithFramework
 * @returns {boolean}
 */
function shouldSkipFramework({ type, name }, restartWithFramework) {
  if (!restartWithFramework) return false;
  if (restartWithFramework.includes("/")) {
    return !`${type}/${name}`.startsWith(restartWithFramework);
  } else {
    return !name.startsWith(restartWithFramework);
  }
}

/**
 * @param {Object} options
 * @param {string[]} [options.type]
 * @param {string} options.restartWithFramework
 * @param {boolean} options.useCi
 */
export function rebuildAllFrameworks({ type, restartWithFramework, useCi }) {
  let types = type || ["keyed", "non-keyed"];
  console.log(`Rebuild all frameworks. ci: ${useCi}, restartWith: ${restartWithFramework}, types: ${types}`);

  let frameworks = getFrameworks();
  frameworks = frameworks.filter(f => types.includes(f.type));
  const skippableFrameworks = takeWhile(frameworks, (framework) =>
    shouldSkipFramework(framework, restartWithFramework)
  );
  const buildableFrameworks = frameworks.slice(skippableFrameworks.length);

  for (const framework of buildableFrameworks) {
    rebuildFramework(`${framework.type}/${framework.name}`, useCi);
  }

  console.log("All frameworks were built!");
}
