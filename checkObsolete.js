var _ = require("lodash");
var exec = require("child_process").execSync;
var fs = require("fs");
var path = require("path");
const JSON5 = require("json5");

let args = process.argv.length <= 2 ? [] : process.argv.slice(2, process.argv.length);

var frameworks = [].concat(
  fs.readdirSync("./frameworks/keyed").map((f) => ["keyed", f]),
  fs.readdirSync("./frameworks/non-keyed").map((f) => ["non-keyed", f])
);

let now = new Date();
let obsoleteDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDay());

let warnings = [];
let manually = [];

function maybeObsolete(package) {
  let output;
  try {
    let output = exec(`npm view ${package} time`, {
      stdio: ["ignore", "pipe", "ignore"],
    }).toString();
    let r = JSON5.parse(output);
    return [new Date(r.modified) < obsoleteDate, package, new Date(r.modified).toISOString().substring(0, 10)];
  } catch (error) {
    console.error(`Failed to execute npm view for ${package}. Error Code ${error.status} and message: ${error.message}`);
    return [false, package, null];
  }
}

const DEBUG = false;

for (f of frameworks) {
  let [dir, name] = f;
  let path = `frameworks/${dir}/${name}`;
  if (!fs.existsSync(path + "/package.json")) {
    warnings.push(`WARN: skipping ${dir}/${name} since there's no package.json`);
  } else {
    let packageJSON = JSON.parse(fs.readFileSync(path + "/package.json"));
    let mainPackages = packageJSON?.["js-framework-benchmark"]?.frameworkVersionFromPackage;
    if (mainPackages) {
      if (DEBUG) console.log(`Checking ${dir}/${name} ${mainPackages}`);
      let packages = mainPackages.split(":");
      let maybeObsoleteResults = packages.map((p) => maybeObsolete(p));
      if (DEBUG) console.log(`Results for ${dir}/${name} ${maybeObsoleteResults}`);
      maybeObsoleteResult = maybeObsoleteResults.some((r) => r[0]);
      if (maybeObsoleteResult) {
        console.log(
          `Last npm update for ${dir}/${name} ${mainPackages} is older than a year: ${maybeObsoleteResults
            .map((a) => a.slice(1).join(":"))
            .join(", ")}`
        );
      } else {
        if (DEBUG) console.log(`    Last npm update for ${dir}/${name} ${mainPackages} is newer than a year`);
      }
    } else {
      manually.push(`${dir}/${name} has no frameworkVersionFromPackage`);
    }
  }
}

if (warnings.length > 0) console.log("\nWarnings:\n" + warnings.join("\n"));
if (manually.length > 0) console.log("\nThe following frameworks must be checked manually\n" + manually.join("\n"));
