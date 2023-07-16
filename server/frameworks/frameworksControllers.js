import path from "path";
import fs from "fs";

import { frameworksDirectory } from "../config/directories.js";
import isFrameworkDir from "./utils/isFrameworkDir.js";
import { loadFrameworkInfo } from "./helpers/index.js";

export async function loadFrameworkVersionInformation(filterForFramework) {
  const resultsProm = [];
  const frameworksPath = path.resolve(frameworksDirectory);
  const keyedTypes = ["keyed", "non-keyed"];

  for (const keyedType of keyedTypes) {
    const directories = fs.readdirSync(path.resolve(frameworksPath, keyedType));

    for (const directory of directories) {
      const pathInFrameworksDir = `${keyedType}/${directory}`;

      if (filterForFramework && filterForFramework !== pathInFrameworksDir) {
        continue;
      }

      if (!isFrameworkDir(keyedType, directory)) {
        continue;
      }

      const frameworkInfo = loadFrameworkInfo(keyedType, directory);
      resultsProm.push(frameworkInfo);
    }
  }
  return Promise.all(resultsProm);
}
