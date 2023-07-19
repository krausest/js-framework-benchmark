const { execSync } = require("child_process");
const fs = require("fs");
const JSON5 = require("json5");
const path = require("path");

const DEBUG = false;

const missingPackageWarnings = [];
const manualChecks = [];

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

/**
 * @param {string} packageName
 */
function maybeObsolete(packageName) {
  try {
    const npmCmd = `npm view ${packageName} time`;
    const output = execSync(npmCmd, {
      stdio: ["ignore", "pipe", "ignore"],
    }).toString();
    const timeData = JSON5.parse(output);

    const now = new Date();
    const obsoleteDate = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDay()
    );

    const modifiedDate = new Date(timeData.modified);
    const isObsolete = modifiedDate < obsoleteDate;
    const formattedDate = modifiedDate.toISOString().substring(0, 10);

    return [isObsolete, packageName, formattedDate];
  } catch (error) {
    console.error(
      `Failed to execute npm view for ${packageName}. Error Code ${error.status} and message: ${error.message}`
    );
    return [false, packageName, null];
  }
}

function checkFrameworks() {
  const frameworks = getFrameworks();

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

    const anyPackageObsolete = isPackageObsolete.some((r) => r[0]);
    if (anyPackageObsolete) {
      const formattedPackages = isPackageObsolete
        .map((result) => result.slice(1).join(":"))
        .join(", ");

      console.log(
        `Last npm update for ${type}/${name} ${mainPackages} is older than a year: ${formattedPackages}`
      );
    } else {
      if (DEBUG)
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
