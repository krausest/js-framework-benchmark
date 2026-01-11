// @ts-check
import * as fs from "node:fs";
import path from "node:path";

const filesToDelete = ["package-lock.json", "yarn-lock", "dist", "elm-stuff", "bower_components", "node_modules"];

/**
 * Delete specified files in the framework directory
 * @param {string} frameworkPath
 * @param {string[]} filesToDelete
 */
function deleteFrameworkFiles(frameworkPath, filesToDelete) {
  for (const file of filesToDelete) {
    const filePath = path.join(frameworkPath, file);
    fs.rmSync(filePath, { force: true, recursive: true });
  }
  console.log(`Deleted: ${filesToDelete}`);
}

/**
 * Cleans all framework directories of package-lock.json, yarn-lock and the elm-stuff, node-modules, bower-components and dist directories.
 * @param {Object} options
 * @param {string} options.frameworksDirPath
 * @param {Array<string>} options.frameworksTypes
 */
export function cleanFrameworkDirectories({ frameworksDirPath, frameworksTypes }) {
  console.log(
    "Clean framework directories",
    "frameworksDirPath",
    frameworksDirPath,
    "frameworksTypes",
    frameworksTypes
  );

  for (const frameworkType of frameworksTypes) {
    const frameworkDir = path.resolve(frameworksDirPath, frameworkType);
    const directories = fs.readdirSync(frameworkDir);

    for (const directory of directories) {
      const frameworkPath = path.resolve(frameworkDir, directory);
      console.log(`cleaning ${frameworkPath}`);
      deleteFrameworkFiles(frameworkPath, filesToDelete);
    }
  }
}
