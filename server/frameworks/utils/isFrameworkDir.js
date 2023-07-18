import fs from "fs";
import path from "path";
import { frameworksDirectory } from "../../config/directories.js";

/**
 * @param {string} keyedDir
 * @param {string} directoryName
 * @returns {boolean}
 */
function isFrameworkDir(keyedDir, directoryName) {
  const frameworkPath = path.resolve(
    frameworksDirectory,
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
