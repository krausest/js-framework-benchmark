var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');
const rimraf = require('rimraf');

let args = process.argv.length <= 2 ? [] : process.argv.slice(2, process.argv.length);

// Use npm ci or npm install ?
let ci = args.includes("--ci");
// Copy package-lock back for docker build or build locally?
let docker = args.includes("--docker");

let frameworks = args.filter(a => !a.startsWith("--"));

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
        console.log("ERROR: Missing arguments. Command: docker-rebuild keyed/framework1 non-keyed/framework2 ...");
        process.exit(1);
    }

    if (docker) {
        let build_cmd = `podman exec -it js-framework-benchmark cp /src/rebuild-build-single.js /build/ && podman exec -it js-framework-benchmark node rebuild-build-single.js ${args.join(" ")}`;
        console.log(build_cmd);
        exec(build_cmd,
            {
                stdio: 'inherit'
            });        
    } else {
        let build_cmd = `node rebuild-build-single.js ${args.join(" ")}`;
        console.log(build_cmd);
        exec(build_cmd,
            {
                stdio: 'inherit'
            });    
    }

    let check_cmd = `node rebuild-check-single.js ${args.join(" ")}`;
    console.log(check_cmd);
    exec(check_cmd,
    {
        stdio: 'inherit'
    });        
} catch (e) {
    console.log(`ERROR: Rebuilding  ${args.join(" ")} was not successful`);
}
