// @ts-check
import JSON5 from "json5";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";

import { getFrameworks } from "./helpers/frameworks.js";

/**
 * @typedef {Object} Framework
 * @property {string} name - Name of the framework (e.g., "vue", "qwik", "svelte")
 * @property {string} type - Type of the framework (e.g., "keyed" or "non-keyed")
 */

const frameworks = getFrameworks();

/**
 * Looks for duplicate frameworks
 * @param {{type: string, name: string}[]} frameworks
 * @returns {string[]}
 */
function findDuplicateFrameworks(frameworks) {
  const names = frameworks.map((framework) => framework.name); // Creates an array with framework names only
  const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index); // Filters out repetitive framework names

  return duplicateNames;
}

const duplicateFrameworks = findDuplicateFrameworks(frameworks);
const frameworksCache = new Map();

/**
 * @param {string} packageName
 */
function maybeObsolete(packageName) {
  try {
    const npmCmd = `npm view ${packageName} time`;
    let timeData;

    if (duplicateFrameworks.includes(packageName)) {
      if (frameworksCache.has(packageName)) {
        const output = frameworksCache.get(packageName);
        timeData = JSON5.parse(output);
        return;
      }

      const output = execSync(npmCmd, {
        stdio: ["ignore", "pipe", "ignore"],
      }).toString();
      timeData = JSON5.parse(output);

      frameworksCache.set(packageName, JSON5.stringify(timeData));
    } else {
      const output = execSync(npmCmd, {
        stdio: ["ignore", "pipe", "ignore"],
      }).toString();
      timeData = JSON5.parse(output);
    }

    const now = new Date();
    const obsoleteDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDay());

    const modifiedDate = new Date(timeData.modified);
    const isObsolete = modifiedDate < obsoleteDate;
    const formattedDate = modifiedDate.toISOString().slice(0, 10);

    return { isObsolete, lastUpdate: formattedDate, packageName };
  } catch (error) {
    console.error(
      `Failed to execute npm view for ${packageName}. Error Code ${error.status} and message: ${error.message}`
    );
    return { isObsolete: false, lastUpdate: null, packageName };
  }
}

const missingPackageWarnings = [];
const manualChecks = [];

/**
 * Checks frameworks in frameworks/keyed and frameworks/non-keyed for obsolescence,
 * the presence of package.json and the presence of the frameworkVersionFromPackage property
 * @param {Object} options
 * @param {boolean} options.debug
 */
export function checkObsoleteFrameworks({ debug }) {
  console.log("Check obsolete frameworks", "debug", debug);

  const DEBUG = debug;

  for (const { name, type } of frameworks) {
    const frameworkPath = path.join("frameworks", type, name);
    const packageJSONPath = path.join(frameworkPath, "package.json");

    if (!fs.existsSync(packageJSONPath)) {
      missingPackageWarnings.push(`WARN: skipping ${type}/${name} since there's no package.json`);
      continue;
    }

    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"));
    const mainPackages = packageJSON?.["js-framework-benchmark"]?.frameworkVersionFromPackage;

    if (!mainPackages) {
      manualChecks.push(`${type}/${name} has no frameworkVersionFromPackage`);
      continue;
    }

    if (DEBUG) {
      console.log(`Checking ${type}/${name} ${mainPackages}`);
    }

    const packages = mainPackages.split(":");
    const isPackageObsolete = packages.map((element) => maybeObsolete(element));

    if (DEBUG) {
      console.log(`Results for ${type}/${name} ${isPackageObsolete}`);
    }

    const anyPackageObsolete = isPackageObsolete.some((packageFramework) => packageFramework.isObsolete);

    if (anyPackageObsolete) {
      const formattedPackages = isPackageObsolete
        .map((result) => `${result.packageName}:${result.lastUpdate}`)
        .join(", ");

      console.log(`Last npm update for ${type}/${name} - ${mainPackages} is older than a year: ${formattedPackages}`);
      continue;
    }

    if (DEBUG) {
      console.log(`Last npm update for ${type}/${name} ${mainPackages} is newer than a year`);
    }
  }

  if (missingPackageWarnings.length > 0) console.warn("\nWarnings:\n" + missingPackageWarnings.join("\n"));
  if (manualChecks.length > 0)
    console.warn("\nThe following frameworks must be checked manually\n" + manualChecks.join("\n"));
}
