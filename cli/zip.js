// @ts-check
import AdmZip from "adm-zip";
import * as fs from "node:fs";
import path from "node:path";

const zip = new AdmZip();
const outputFile = "build.zip";
const frameworksTypes = ["keyed", "non-keyed"];

/**
 * Adds a directory to the zip archive, if it exists.
 * @param {string} sourcePath
 * @param {string} zipPath
 */
function addLocalFolderIfExists(sourcePath, zipPath) {
  if (fs.existsSync(sourcePath)) {
    zip.addLocalFolder(sourcePath, zipPath);
  }
}

/**
 * Adds a file to the zip archive, if it exists.
 * @param {string} sourcePath
 * @param {string} zipPath
 */
function addLocalFileIfExists(sourcePath, zipPath) {
  if (fs.existsSync(sourcePath)) {
    zip.addLocalFile(sourcePath, zipPath);
  }
}

/**
 * Adds frameworks to the zip archive.
 * Default: includes dist/ and package-lock.json.
 * Extra paths are declared in the framework's package.json under
 * js-framework-benchmark.includeInBuild as a colon-separated list of
 * relative file or directory paths.
 * @param {string} frameworkType
 * @param {string} frameworkDir
 * @param {string} frameworkName
 */
function addFrameworksToZip(frameworkType, frameworkDir, frameworkName) {
  const zipFrameworkPath = path.join("frameworks", frameworkType, frameworkName);

  addLocalFileIfExists(`${frameworkDir}/package-lock.json`, zipFrameworkPath);
  addLocalFolderIfExists(`${frameworkDir}/dist`, `${zipFrameworkPath}/dist`);

  const pkgPath = `${frameworkDir}/package.json`;
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const includeInBuild = pkg["js-framework-benchmark"]?.includeInBuild;
  if (!includeInBuild) return;

  for (const entry of includeInBuild.split(":")) {
    if (entry.includes("..") || path.isAbsolute(entry)) {
      console.warn(`Skipping unsafe includeInBuild entry "${entry}" in ${frameworkDir}`);
      continue;
    }
    const fullPath = `${frameworkDir}/${entry}`;
    const zipEntry = `${zipFrameworkPath}/${entry}`;
    if (!fs.existsSync(fullPath)) continue;
    if (fs.statSync(fullPath).isDirectory()) {
      zip.addLocalFolder(fullPath, zipEntry);
    } else {
      zip.addLocalFile(fullPath, path.dirname(zipEntry));
    }
  }
}

export function createFrameworkZipArchive() {
  console.log("Create a zip archive of frameworks");

  for (const frameworkType of frameworksTypes) {
    const frameworkTypeDirPath = path.resolve("frameworks", frameworkType);
    const frameworkNames = fs.readdirSync(frameworkTypeDirPath);

    for (const frameworkName of frameworkNames) {
      const frameworkPath = path.resolve(frameworkTypeDirPath, frameworkName);
      console.log("zipping", frameworkPath);

      addFrameworksToZip(frameworkType, frameworkPath, frameworkName);
    }
  }

  zip.writeZip(outputFile);
}
