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
 * Adds frameworks to the zip archive
 * @param {string} frameworkType
 * @param {string} frameworkDir
 * @param {string} frameworkName
 */
function addFrameworksToZip(frameworkType, frameworkDir, frameworkName) {
  const zipFrameworkPath = path.join("frameworks", frameworkType, frameworkName);

  addLocalFileIfExists(`${frameworkDir}/package-lock.json`, `${zipFrameworkPath}`);

  addLocalFolderIfExists(`${frameworkDir}/dist`, `${zipFrameworkPath}/dist`);
  addLocalFolderIfExists(`${frameworkDir}/scripts`, `${zipFrameworkPath}/scripts`);
  addLocalFolderIfExists(`${frameworkDir}/node_modules/slim-js/dist`, `${zipFrameworkPath}/node_modules/slim-js/dist`);
  addLocalFolderIfExists(
    `${frameworkDir}/node_modules/@neow/core/dist`,
    `${zipFrameworkPath}/node_modules/@neow/core/dist`
  );
  addLocalFolderIfExists(`${frameworkDir}/target/web/stage`, `${zipFrameworkPath}/target/web/stage`);
  addLocalFolderIfExists(`${frameworkDir}/build`, `${zipFrameworkPath}/build`);

  if (frameworkName !== "ember" && frameworkName !== "glimmer") {
    addLocalFolderIfExists(`${frameworkDir}/public`, `${zipFrameworkPath}/public`);
  }

  switch (frameworkName) {
    case "deku": 
    case "halogen": {
      addLocalFileIfExists(`${frameworkDir}/output-es/bundle.js`, `${zipFrameworkPath}/output-es`);
      break;
    }
    case "dojo": {
      addLocalFolderIfExists(`${frameworkDir}/output/dist`, `${zipFrameworkPath}/output/dist`);
      break;
    }
    case "s2": {
      addLocalFolderIfExists(
        `${frameworkDir}/node_modules/s2-engine/dist`,
        `${zipFrameworkPath}/node_modules/s2-engine/dist`
      );
      break;
    }
    case "stem": {
      addLocalFolderIfExists(
        `${frameworkDir}/node_modules/babel-polyfill/dist`,
        `${zipFrameworkPath}/node_modules/babel-polyfill/dist`
      );
      addLocalFileIfExists(`${frameworkDir}/src/bundle.js`, `${zipFrameworkPath}/src`);
      break;
    }
    default: {
      addLocalFolderIfExists(`${frameworkDir}/output`, `${zipFrameworkPath}/output`);
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
