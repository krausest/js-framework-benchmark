import path from "path";
import { cwd } from "process";

let FrameworksDirectory = path.join(cwd(), "..", "frameworks");

if (process.argv.length === 3) {
  console.log(`Changing working directory to ${process.argv[2]}`);
  FrameworksDirectory = path.join(cwd(), "..", process.argv[2]);
}

export { FrameworksDirectory };
