import fs from "fs";
import path from "path";

import { frameworksDirectory } from "../../config/directories.js";

function copyProps(result, benchmarkData) {
  const {
    issues,
    customURL,
    frameworkHomeURL,
    useShadowRoot,
    useRowShadowRoot,
    shadowRootName,
    buttonsInShadowRoot,
  } = benchmarkData;

  result.issues = issues;
  result.customURL = customURL;
  result.frameworkHomeURL = frameworkHomeURL;
  result.useShadowRoot = useShadowRoot;
  result.useRowShadowRoot = useRowShadowRoot;
  result.shadowRootName = useShadowRoot
    ? shadowRootName ?? "main-element"
    : undefined;
  result.buttonsInShadowRoot = useShadowRoot
    ? buttonsInShadowRoot ?? true
    : undefined;
}

async function checkPackageJSON(packageJSONPath) {
  try {
    await fs.promises.access(packageJSONPath, fs.constants.R_OK);
    return true;
  } catch (error) {
    return false;
  }
}

function buildFrameworkVersionString(directoryName, version, keyedDir) {
  return `${directoryName}${version ? `-v${version}` : ""}-${keyedDir}`;
}

export async function loadFrameworkInfo(keyedDir, directoryName) {
  const result = {
    type: keyedDir,
    directory: directoryName,
  };

  const frameworkPath = path.resolve(
    frameworksDirectory,
    keyedDir,
    directoryName,
  );
  const packageJSONPath = path.resolve(frameworkPath, "package.json");
  const packageLockJSONPath = path.resolve(frameworkPath, "package-lock.json");

  const hasPackageJSON = await checkPackageJSON(packageJSONPath);
  if (!hasPackageJSON) {
    result.error = "No package.json found";
    return result;
  }

  const packageJSON = JSON.parse(
    await fs.promises.readFile(packageJSONPath, "utf8"),
  );
  const benchmarkData = packageJSON["js-framework-benchmark"];

  if (!benchmarkData) {
    result.error =
      "package.json must contain a 'js-framework-benchmark' property";
    return result;
  }

  if (benchmarkData.frameworkVersionFromPackage) {
    const packageNames = benchmarkData.frameworkVersionFromPackage.split(":");
    const packageLockJSON = JSON.parse(
      await fs.promises.readFile(packageLockJSONPath, "utf8"),
    );

    result.versions = {};

    for (const packageName of packageNames) {
      if (packageLockJSON.dependencies?.[packageName]) {
        result.versions[packageName] =
          packageLockJSON.dependencies[packageName].version;
      } else if (packageLockJSON.packages?.[`node_modules/${packageName}`]) {
        result.versions[packageName] =
          packageLockJSON.packages[`node_modules/${packageName}`].version;
      } else {
        result.versions[packageName] = "ERROR: Not found in package-lock";
      }
    }

    result.frameworkVersionString = buildFrameworkVersionString(
      directoryName,
      packageNames.map((p) => result.versions[p]).join(" + "),
      keyedDir,
    );

    copyProps(result, benchmarkData);
  } else if (typeof benchmarkData.frameworkVersion === "string") {
    result.version = benchmarkData.frameworkVersion;
    result.frameworkVersionString = buildFrameworkVersionString(
      directoryName,
      result.version,
      keyedDir,
    );

    copyProps(result, benchmarkData);
  } else {
    result.error =
      "package.json must contain a 'frameworkVersionFromPackage' or 'frameworkVersion' in the 'js-framework-benchmark'.property";
  }

  return result;
}
