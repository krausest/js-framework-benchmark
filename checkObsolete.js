const { execSync } = require("child_process");
const fs = require("fs");
const JSON5 = require("json5");
const path = require("path");

const DEBUG = false;

/**
 * Returns an array with arrays of types and names of frameworks
 * @example getFramewokrs()
 * @returns [{type:"keyed", name:"vue"},{type:"keyed", name:"qwik"},{type:"non-keyed", name:"svelte"}]
 */
function getFrameworks() {
  const keyedFrameworks = fs
    .readdirSync("./frameworks/keyed")
    .map((framework) => ({ type: "keyed", name: framework }));
  const nonKeyedFrameworks = fs
    .readdirSync("./frameworks/non-keyed")
    .map((framework) => ({ type: "non-keyed", name: framework }));
  return [...keyedFrameworks, ...nonKeyedFrameworks];
}

const frameworks = getFrameworks();

/**
 * Looks for duplicate frameworks
 * @param {{type: string, name: string}[]} frameworks
 * @returns {string[]}
 */
function findDuplicateFrameworks(frameworks) {
  const names = frameworks.map((framework) => framework.name); // Creates an array with framework names only
  const duplicateNames = names.filter(
    (name, index) => names.indexOf(name) !== index
  ); // Filters out repetitive framework names

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
    const obsoleteDate = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDay()
    );

    const modifiedDate = new Date(timeData.modified);
    const isObsolete = modifiedDate < obsoleteDate;
    const formattedDate = modifiedDate.toISOString().substring(0, 10);

    return { isObsolete, packageName, lastUpdate: formattedDate };
  } catch (error) {
    console.error(
      `Failed to execute npm view for ${packageName}. Error Code ${error.status} and message: ${error.message}`
    );
    return { isObsolete: false, packageName, lastUpdate: null };
  }
}

const missingPackageWarnings = [];
const manualChecks = [];

/**
 * Checks frameworks in frameworks/keyed and frameworks/non-keyed for obsolescence,
 * the presence of package.json and the presence of the frameworkVersionFromPackage property
 */
function checkFrameworks() {
  for (const { type, name } of frameworks) {
    const frameworkPath = path.join("frameworks", type, name);
    const packageJSONPath = path.join(frameworkPath, "package.json");

    if (!fs.existsSync(packageJSONPath)) {
      missingPackageWarnings.push(
        `WARN: skipping ${type}/${name} since there's no package.json`
      );
      continue;
    }

    const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf-8"));
    const mainPackages =
      packageJSON?.["js-framework-benchmark"]?.frameworkVersionFromPackage;

    if (!mainPackages) {
      manualChecks.push(`${type}/${name} has no frameworkVersionFromPackage`);
      continue;
    }

    if (DEBUG) {
      console.log(`Checking ${type}/${name} ${mainPackages}`);
    }

    const packages = mainPackages.split(":");
    const isPackageObsolete = packages.map(maybeObsolete);

    if (DEBUG) {
      console.log(`Results for ${type}/${name} ${isPackageObsolete}`);
    }

    const anyPackageObsolete = isPackageObsolete.some(
      (packageFramework) => packageFramework.isObsolete
    );

    if (anyPackageObsolete) {
      const formattedPackages = isPackageObsolete
        .map((result) => `${result.packageName}:${result.lastUpdate}`)
        .join(", ");

      console.log(
        `Last npm update for ${type}/${name} - ${mainPackages} is older than a year: ${formattedPackages}`
      );
      continue;
    }

    if (DEBUG) {
      console.log(
        `Last npm update for ${type}/${name} ${mainPackages} is newer than a year`
      );
    }
  }

  if (missingPackageWarnings.length > 0)
    console.warn("\nWarnings:\n" + missingPackageWarnings.join("\n"));
  if (manualChecks.length > 0)
    console.warn(
      "\nThe following frameworks must be checked manually\n" +
        manualChecks.join("\n")
    );
}

checkFrameworks();
