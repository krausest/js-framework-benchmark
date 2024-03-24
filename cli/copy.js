// @ts-check
import * as fs from "node:fs";
import path from "node:path";

const internalExclude = ["node_modules", "elm-stuff", "project", ".DS_Store"];
const rootExclude = ["dist", "node_modules", "webdriver-ts"];

/**
 * Checks whether a given file or directory `name` should be included based on certain conditions.
 * @param {string} name
 * @returns {boolean}
 */
function shouldInclude(name) {
  const isBindingScala = name.includes("binding.scala");

  if (isBindingScala) {
    const isTarget = name.includes("/target");
    const isTargetWeb = name.includes("/target/web");

    console.log(
      `File: ${name}\nIs Binding Scala: ${isBindingScala}\nIs Target: ${isTarget}\nIs Target Web: ${isTargetWeb}`
    );

    if (isTarget) {
      return name.endsWith("/target") || isTargetWeb;
    }
  }

  return internalExclude.every((ex) => !name.includes(ex));
}

/**
 * Recursively copies the contents of one directory to another directory.
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @returns
 */
function copyFolderRecursiveSync(sourcePath, destinationPath) {
  if (!fs.existsSync(sourcePath) || !fs.lstatSync(sourcePath).isDirectory()) {
    return;
  }

  // Check if folder needs to be created or integrated
  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath);
  }

  const files = fs.readdirSync(sourcePath);

  for (const file of files) {
    const srcFilePath = path.join(sourcePath, file);
    const destFilePath = path.join(destinationPath, file);

    if (!shouldInclude(srcFilePath)) {
      continue;
    }

    const fileStats = fs.lstatSync(srcFilePath);

    if (fileStats.isDirectory()) {
      console.log(`copy dir ${srcFilePath}`);
      copyFolderRecursiveSync(srcFilePath, destFilePath);
    } else if (fileStats.isSymbolicLink()) {
      console.log("**** LINK");
    } else {
      fs.copyFileSync(srcFilePath, destFilePath);
    }
  }
} // It will be possible to replace with `fs.cpSync` if the version of Node.js >= 16.7.0.

/**
 * Reads the contents of the root directory and recursively copies the contents of each folder, unless they are excluded.
 */
function processDirectories() {
  const directories = fs.readdirSync(".");
  const nonHiddenDirectories = directories.filter((directory) => !directory.startsWith("."));

  for (const directory of nonHiddenDirectories) {
    if (fs.statSync(directory).isDirectory() && !rootExclude.includes(directory)) {
      const dirPath = path.join("dist", directory);
      console.log(dirPath);
      fs.mkdirSync(dirPath);
      copyFolderRecursiveSync(directory, path.join("dist", directory));
    }
  }
}

/**
 * Creates a dist directory, copies `table.html` from `webdriver-ts` and `index.html` into it,
 * and then starts copying the project folders recursively using `processDirectories()`.
 */
export function copyProjectToDist() {
  console.log("Copying project to dist directory");

  fs.rmSync("dist", { force: true, recursive: true });
  fs.mkdirSync(path.join("dist", "webdriver-ts"), { recursive: true });

  fs.copyFileSync(path.join("webdriver-ts", "table.html"), path.join("dist", "webdriver-ts", "table.html"));
  fs.copyFileSync("index.html", path.join("dist", "index.html"));

  processDirectories();
}
