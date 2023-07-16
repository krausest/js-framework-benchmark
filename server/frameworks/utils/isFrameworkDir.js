import fs from "fs";
import path from "path";
import { FrameworksDirectory } from "../../config/directories.js";

/**
 * @param {string} keyedDir
 * @param {string} directoryName
 * @returns {boolean}
 */
function isFrameworkDir(keyedDir, directoryName) {
  const frameworkPath = path.resolve(
    FrameworksDirectory,
    keyedDir,
    directoryName
  );
  const packageJSONPath = path.resolve(frameworkPath, "package.json");
  const packageLockJSONPath = path.resolve(frameworkPath, "package-lock.json");
  const exists =
    fs.existsSync(packageJSONPath) && fs.existsSync(packageLockJSONPath);

  return exists;
}

export default isFrameworkDir;
