const { execSync } = require("child_process");

const args = process.argv.slice(2);
const frameworks = args.filter((a) => !a.startsWith("--"));
const frameworkNames = frameworks.join(" ");

console.log(
  "rebuild-check-single.js started: args",
  args,
  "frameworks",
  frameworks
);

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
  const benchCmd = `npm run bench -- --headless true --smoketest true ${frameworkNames}`;
  console.log(benchCmd);
  execSync(benchCmd, {
    cwd: "webdriver-ts",
    stdio: "inherit",
  });

  const keyedCmd = `npm run isKeyed -- --headless true ${frameworkNames}`;
  console.log(keyedCmd);
  execSync(keyedCmd, {
    cwd: "webdriver-ts",
    stdio: "inherit",
  });

  console.log("rebuild-check-single.js finished");
  console.log("All checks are fine!");
  console.log(
    `======> Please rerun the benchmark: npm run bench ${frameworkNames}`
  );
} catch (e) {
  console.log(`rebuild-check-single failed for ${frameworks.join(" ")}`);
  process.exit(-1);
}
