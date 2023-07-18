const fs = require("fs");
const path = require("path");

/**
 * @param {string} dir
 */
function rmIfExists(dir) {
  if (fs.existsSync(dir)) {
    console.log("Cleaning", dir);
    fs.rmSync(dir, { recursive: true });
  }
}

/**
 * @param {string} basePath
 * @param {string} keyedTypes
 */
function cleanFrameworkDirectories(basePath, keyedTypes) {
  for (const keyedType of keyedTypes) {
    const frameworkDir = path.resolve(basePath, keyedType);
    const directories = fs.readdirSync(frameworkDir);

    for (const directory of directories) {
      const frameworkPath = path.resolve(frameworkDir, directory);
      console.log("cleaning ", frameworkPath);

      rmIfExists(path.join(frameworkPath, "package-lock.json"));
      rmIfExists(path.join(frameworkPath, "yarn.lock"));
      rmIfExists(path.join(frameworkPath, "node_modules"));
      rmIfExists(path.join(frameworkPath, "dist"));
      rmIfExists(path.join(frameworkPath, "elm-stuff"));
      rmIfExists(path.join(frameworkPath, "bower_components"));
    }
  }
}

const keyedTypes = ["keyed", "non-keyed"];
const frameworksPath = path.resolve("frameworks");

cleanFrameworkDirectories(frameworksPath, keyedTypes);
