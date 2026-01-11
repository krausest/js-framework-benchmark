// @ts-check
import { program } from "commander";

import {
  updateFrameworks,
  cleanFrameworkDirectories,
  configureStyles,
  copyProjectToDist,
  createFrameworkZipArchive,
  updateFrameworkLockfiles,
  rebuildAllFrameworks,
  rebuildSingleFramework,
} from "./cli/index.js";
import { updateOneFramework } from "./cli/update-frameworks.js";

program.command("zip").description("Create a zip archive of frameworks").action(createFrameworkZipArchive);

program.command("copy").description("Copy project to dist directory").action(copyProjectToDist);

program
  .command("update-frameworks")
  .option("--type [types...]", "", ["keyed", "non-keyed"])
  .description("Update implementations in the frameworks directory")
  .action((options) => {
    updateFrameworks(options);
  });

  program
  .command("update-one-framework")
  .arguments("<frameworks>")
  .description("Update implementation in the frameworks directory")
  .action((framework) => {
    let [type, name] = framework.split("/");
    if (!["keyed","non-keyed"].includes(type)) throw new Error("Invalid framework name. Must be something like keyed/vue");
    updateOneFramework({type,name, debug: true});
  });


program
  .command("cleanup")
  .description(
    "Clean all framework directories of package-lock.json, yarn-lock and the elm-stuff, node-modules, bower-components and dist directories"
  )
  .option("--frameworks-dir-path [string]", "", "frameworks")
  .option("--frameworks-types [types...]", "", ["keyed", "non-keyed"])
  .action((options) => {
    cleanFrameworkDirectories(options);
  });

program
  .command("update-lockfiles")
  .description("Update lockfiles for all frameworks in the frameworks directory")
  .option("--frameworks-dir-path [string]", "", "frameworks")
  .option("--frameworks-types [types...]", "", ["keyed", "non-keyed"])
  .option("--latest-lockfile-version [number]", "", "3")
  .action((options) => {
    updateFrameworkLockfiles(options);
  });

program
  .command("configure-styles")
  .description("Configure CSS styles for all frameworks in the frameworks directory")
  .option("--bootstrap [boolean]", "", false)
  .option("--minimal [boolean]", "", false)
  .action(async (options) => {
    await configureStyles(options);
  });

program
  .command("rebuild-all")
  .option("--type [types...]", "", ["keyed", "non-keyed"])
  .option("--ci [boolean]", "", false)
  .option("--restart-with-framework [string]", "", "")
  .action((options) => {
    rebuildAllFrameworks({ type: options.type, restartWithFramework: options.restartWithFramework, useCi: options.ci });
  });

program
  .command("rebuild-single")
  .option("-f, --frameworks [frameworks...]", "", [])
  .option("--ci [boolean]", "", false)
  .action((options) => {
    rebuildSingleFramework(options);
  });

program.parse();
