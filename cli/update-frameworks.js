// @ts-check
import JSON5 from "json5";
import { execSync } from "node:child_process";
import * as fs from "node:fs";
import path from "node:path";
import semver from 'semver'

import { getFrameworks } from "./helpers/frameworks.js";
import { rebuildSingleFramework } from "./rebuild-single-framework.js";
import { rebuildFramework } from "./rebuild-build-single.js";
import { rebuildCheckSingle } from "./rebuild-check-single.js";

/**
 * @typedef {Object} Framework
 * @property {string} name - Name of the framework (e.g., "vue", "qwik", "svelte")
 * @property {string} type - Type of the framework (e.g., "keyed" or "non-keyed")
 */

const frameworks = getFrameworks();


function performUpdate(frameworkPath, frameworkName) {
  console.log(`Updating ${frameworkName}`);
  try {
    const npmCmd = `ncu -u`;
    execSync(npmCmd, {
      cwd: frameworkPath,
      stdio: "inherit",
    });
    rebuildFramework(frameworkName, false);
    rebuildCheckSingle({frameworks: [frameworkName]});
    return `Sucessfully updated ${frameworkPath}`;
  } catch (error) {
    console.error(`Failed to update ${frameworkPath}. Error Code ${error.status} and message: ${error.message}`);
    return `Failed to update ${frameworkPath}`;
  }
}

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

function getVersionFromPackageLock(packageJSONLockPath, packageNames) {
  if (!fs.existsSync(packageJSONLockPath)) {
    throw new Error(`package-lock.json not found at ${packageJSONLockPath}`);
  }

  let versions = {};

  for (let packageName of packageNames) {
    const packageLockJSON = JSON.parse(fs.readFileSync(packageJSONLockPath, "utf8"));
    const packageVersion =
    packageLockJSON.dependencies?.[packageName]?.version ||
    packageLockJSON.packages?.[`node_modules/${packageName}`]?.version ||
    "ERROR: Not found in package-lock";
    versions[packageName] = packageVersion;
  }
  return versions;
}

function shouldUpdate(packageJSONLockPath, packageNames, DEBUG) {
  try {
    let versions = getVersionFromPackageLock(packageJSONLockPath, packageNames);
    console.log(versions);

    for (let packageName of packageNames) {
      const npmCmd = `npm view ${packageName} version`;


      const newestVersion = execSync(npmCmd, {
        stdio: ["ignore", "pipe", "ignore"],
      }).toString();

      let res = semver.diff(versions[packageName], newestVersion);
      console.log(`Latest version for ${packageName} is ${newestVersion} and the 
        current version is ${versions[packageName]} comparison result is ${res}`);
        if (res === 'major' || res === 'minor') {
          if (DEBUG) {
            console.log(`Update required for ${packageName}`);
          }
          return true;
        }
    }
  } catch (error) {
    console.error(
      `Failed to get latest versions for ${packageNames}. Error Code ${error.status} and message: ${error.message}`
    );
    return { isObsolete: false, lastUpdate: null, packageNames };
  }    
  return false;
}

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
export function updateFrameworks({ type, debug }) {
  let types = type || ["keyed", "non-keyed"];
  console.log("Check implementations for updates", "debug", debug,"type", type);  
  let log = [];

  const DEBUG = debug;

  for (const { name, type } of frameworks) {
    if (!types.includes(type)) continue
    console.log(`Checking ${type}/${name}`);  
    const frameworkPath = path.join("frameworks", type, name);
    const packageJSONPath = path.join(frameworkPath, "package.json");
    const packageJSONLockPath = path.join(frameworkPath, "package-lock.json");

    if (!fs.existsSync(packageJSONPath)) {
      missingPackageWarnings.push(`WARN: skipping ${type}/${name} since there's no package.json`);
      continue;
    }

    try {

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
      const update = shouldUpdate(packageJSONLockPath, packages);
      
      if (update) {
        log.push(performUpdate(frameworkPath, type+"/"+name));
      } else {
        const isPackageObsolete = packages.map((element) => maybeObsolete(element));
        const anyPackageObsolete = isPackageObsolete.some((packageFramework) => packageFramework.isObsolete);
    
        if (anyPackageObsolete) {
          const formattedPackages = isPackageObsolete
            .map((result) => `${result.packageName}:${result.lastUpdate}`)
            .join(", ");
    
          console.log(`Last npm update for ${type}/${name} - ${mainPackages} is older than a year: ${formattedPackages}`);
          log.push(`Retire ${type}/${name} - ${mainPackages} is older than a year`);
        }  
        else if (DEBUG) {
          log.push(`Nothing to do for ${type}/${name}`);
        }
      }
    } catch (error) {
      console.error(`Failed to check ${type}/${name}. Error Code ${error.status} and message: ${error.message}`);
      log.push(`Error checking ${type}/${name}`);
    }
  }

  console.log("Log:\n", log.join("\n"));
  if (missingPackageWarnings.length > 0) console.warn("\nWarnings:\n" + missingPackageWarnings.join("\n"));
  if (manualChecks.length > 0)
    console.warn("\nThe following frameworks must be checked manually\n" + manualChecks.join("\n"));
}
