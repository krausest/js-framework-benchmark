const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

const zip = new AdmZip();
const outputFile = "build.zip";
const keyedTypes = ["keyed", "non-keyed"];

if (fs.existsSync(outputFile)) {
  fs.rmSync(outputFile);
}

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
 * @param {string} keyedType
 * @param {string} frameworkDir
 * @param {string} frameworkName
 */
function addFrameworksToZip(keyedType, frameworkDir, frameworkName) {
  const zipFrameworkPath = `frameworks/${keyedType}/${frameworkName}`;

  addLocalFileIfExists(
    `${frameworkDir}/package-lock.json`,
    `${zipFrameworkPath}`
  );

  addLocalFolderIfExists(`${frameworkDir}/dist`, `${zipFrameworkPath}/dist`);
  addLocalFolderIfExists(
    `${frameworkDir}/scripts`,
    `${zipFrameworkPath}/scripts`
  );
  addLocalFolderIfExists(
    `${frameworkDir}/node_modules/slim-js/dist`,
    `${zipFrameworkPath}/node_modules/slim-js/dist`
  );
  addLocalFolderIfExists(
    `${frameworkDir}/node_modules/@neow/core/dist`,
    `${zipFrameworkPath}/node_modules/@neow/core/dist`
  );
  addLocalFolderIfExists(
    `${frameworkDir}/target/web/stage`,
    `${zipFrameworkPath}/target/web/stage`
  );
  addLocalFolderIfExists(`${frameworkDir}/build`, `${zipFrameworkPath}/build`);

  if (frameworkName !== "ember" && frameworkName !== "glimmer") {
    addLocalFolderIfExists(
      `${frameworkDir}/public`,
      `${zipFrameworkPath}/public`
    );
  }

  if (frameworkName === "halogen") {
    addLocalFileIfExists(
      `${frameworkDir}/output/bundle.js`,
      `${zipFrameworkPath}/output`
    );
  } else if (frameworkName === "dojo") {
    addLocalFolderIfExists(
      `${frameworkDir}/output/dist`,
      `${zipFrameworkPath}/output/dist`
    );
  } else if (frameworkName === "stem") {
    addLocalFolderIfExists(
      `${frameworkDir}/node_modules/babel-polyfill/dist`,
      `${zipFrameworkPath}/node_modules/babel-polyfill/dist`
    );
    addLocalFileIfExists(
      `${frameworkDir}/src/bundle.js`,
      `${zipFrameworkPath}/src`
    );
  } else {
    addLocalFolderIfExists(
      `${frameworkDir}/output`,
      `${zipFrameworkPath}/output`
    );
  }
}

for (const keyedType of keyedTypes) {
  const frameworksDir = path.resolve("frameworks", keyedType);
  const frameworkNames = fs.readdirSync(frameworksDir);

  for (const frameworkName of frameworkNames) {
    const frameworkDir = path.resolve(frameworksDir, frameworkName);
    console.log("zipping ", frameworkDir);

    addFrameworksToZip(keyedType, frameworkDir, frameworkName);
  }
}
zip.writeZip(outputFile);
