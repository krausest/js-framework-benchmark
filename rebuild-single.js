const { execSync } = require("child_process");

const args = process.argv.slice(2);
const argsString = args.join(" ");

// Use npm ci or npm install ?
const ci = args.includes("--ci");

// Copy package-lock back for docker build or build locally?
const docker = args.includes("--docker");

const frameworks = args.filter((a) => !a.startsWith("--"));

console.log("args", args, "ci", ci, "docker", docker, "frameworks", frameworks);

/*
rebuild-single.js [--ci] [--docker] [keyed/framework1 ... non-keyed/frameworkN]

This script rebuilds a single framework
By default it rebuilds from scratch, deletes all package.json and package-lock.json files
and invokes npm install and npm run build-prod for the benchmark

With argument --ci it rebuilds using the package-lock.json dependencies, i.e.
it calls npm ci and npm run build-prod for the benchmark

Pass list of frameworks
*/

try {
  if (frameworks.length == 0) {
    console.log(
      "ERROR: Missing arguments. Command: docker-rebuild keyed/framework1 non-keyed/framework2 ..."
    );
    process.exit(1);
  }

  const buildCmd = docker
    ? `docker exec -it js-framework-benchmark cp /src/rebuild-build-single.js /build/ && docker exec -it js-framework-benchmark node rebuild-build-single.js ${argsString}`
    : `node rebuild-build-single.js ${argsString}`;
  console.log(buildCmd);
  execSync(buildCmd, {
    stdio: "inherit",
  });

  const checkCmd = `node rebuild-check-single.js ${argsString}`;
  console.log(checkCmd);
  execSync(checkCmd, {
    stdio: "inherit",
  });
} catch (e) {
  console.log(`ERROR: Rebuilding  ${argsString} was not successful`);
}
