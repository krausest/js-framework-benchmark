import * as fs from "node:fs";
import path from "node:path";

/**
 * @typedef {Object} Framework
 * @property {string} name - Name of the framework (e.g., "vue", "qwik", "svelte")
 * @property {string} type - Type of the framework (e.g., "keyed" or "non-keyed")
 */

/**
 * Returns an array with arrays of types and names of frameworks
 * @param {string} frameworksDirPath
 * @param {Array<string>} frameworksTypes
 * @returns {Framework[]}
 */
export function getFrameworks(frameworksDirPath = "frameworks", frameworksTypes = ["keyed", "non-keyed"]) {
  const frameworks = frameworksTypes.flatMap((type) =>
    fs.readdirSync(path.join(frameworksDirPath, type)).map((framework) => ({
      name: framework,
      type,
    }))
  );

  return frameworks;
}
