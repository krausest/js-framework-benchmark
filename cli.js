import { program } from "commander";

import {
  checkObsoleteFrameworks,
  cleanFrameworkDirectories,
  configureStyles,
  copyProjectToDist,
  createFrameworkZipArchive,
  updateLockfilesOfAllFrameworks,
} from "./cli/index.js";

program.command("zip").action(createFrameworkZipArchive);

program.command("copy").action(copyProjectToDist);

program
  .command("check-obsolete")
  .option("--debug [boolean]", "", false)
  .action((options) => {
    checkObsoleteFrameworks(options);
  });

program
  .command("cleanup")
  .option("--frameworks-dir-path [string]", "", "frameworks")
  .option("--frameworks-types [Array<string>]", "", ["keyed", "non-keyed"])
  .action((options) => {
    cleanFrameworkDirectories(options);
  });

program
  .command("update-lockfiles")
  .option("--frameworks-dir-path [string]", "", "frameworks")
  .option("--frameworks-types [Array<string>]", "", ["keyed", "non-keyed"])
  .option("--latest-lockfile-version [number]", "", 3)
  .action((options) => {
    updateLockfilesOfAllFrameworks(options);
  });

program
  .command("configure-styles")
  .option("--bootstrap [boolean]", "", false)
  .option("--minimal [boolean]", "", false)
  .action(async (options) => {
    await configureStyles(options);
  });

program.parse();
