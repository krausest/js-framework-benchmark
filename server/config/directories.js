import { join } from "path";
import process from "process";

const isFrameworksDirectorySpecifies = process.argv.length === 3;

const frameworksDirectory = isFrameworksDirectorySpecifies
  ? join(process.cwd(), "..", process.argv[2])
  : join(process.cwd(), "..", "frameworks");

if (isFrameworksDirectorySpecifies) {
  console.log(`Changing working directory to ${process.argv[2]}`);
}

export { frameworksDirectory };
