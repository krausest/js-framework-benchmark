const fs = require("fs");
const path = require("path");
const yargs = require("yargs");

const args = yargs(process.argv)
  .help()
  .string("framework-dir")
  .default("framework-dir", "frameworks")
  .array("keyed-types")
  .default("keyed-types", ["keyed", "non-keyed"]).argv;

/**
 * @type {string}
 */
const frameworksDir = args.frameworkDir;

/**
 * @type {string[]}
 */
const keyedTypes = args.keyedTypes;

const frameworksPath = path.resolve(frameworksDir);

const filesToDelete = [
  "package-lock.json",
  "yarn-lock",
  "dist",
  "elm-stuff",
  "bower_components",
  "node_modules",
];

/**
 * Delete specified files in the framework directory
 * @param {string} frameworkPath
 * @param {string[]} filesToDelete
 */
function deleteFrameworkFiles(frameworkPath, filesToDelete) {
  for (const file of filesToDelete) {
    const filePath = path.join(frameworkPath, file);
    fs.rmSync(filePath, { recursive: true, force: true });
  }
  console.log(`Deleted: ${filesToDelete}`);
}

/**
 * Cleans all framework directories of package-lock.json, yarn-lock and the elm-stuff, node-modules, bower-components and dist directories.
 * @param {string} frameworksPath
 * @param {string} keyedTypes
 */
function cleanFrameworkDirectories(frameworksPath, keyedTypes) {
  for (const keyedType of keyedTypes) {
    const frameworkDir = path.resolve(frameworksPath, keyedType);
    const directories = fs.readdirSync(frameworkDir);

    for (const directory of directories) {
      const frameworkPath = path.resolve(frameworkDir, directory);
      console.log(`cleaning ${frameworkPath}`);

      deleteFrameworkFiles(frameworkPath, filesToDelete);
    }
  }
}

cleanFrameworkDirectories(frameworksPath, keyedTypes);
