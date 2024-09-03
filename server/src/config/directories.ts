import path from "node:path";
import process from "node:process";

// Checks if the directory is explicitly specified.
// It can be specified by writing for example `npm start other-frameworks-directory`.
const isFrameworksDirectorySpecifies = process.argv.length === 3;

const frameworksDirectory = isFrameworksDirectorySpecifies
  ? path.join(process.cwd(), "..", process.argv[2])
  : path.join(process.cwd(), "..", "frameworks");

if (isFrameworksDirectorySpecifies) {
  console.log(`Changing working directory to ${process.argv[2]}`);
}

export { frameworksDirectory };
