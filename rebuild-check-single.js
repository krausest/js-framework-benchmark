var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');
const rimraf = require('rimraf');

let args = process.argv.length <= 2 ? [] : process.argv.slice(2, process.argv.length);

let frameworks = args.filter(a => !a.startsWith("--"));

console.log("rebuild-check-single.js started: args", args, "frameworks", frameworks);

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
    let frameworkNames = frameworks.join(" ");
    let bench_cmd = 'npm run bench -- --headless true --smoketest true ' + frameworkNames; 
    console.log(bench_cmd);
    exec(bench_cmd, {
        cwd: 'webdriver-ts',
        stdio: 'inherit'
    });

    let keyed_cmd = 'npm run isKeyed -- --headless true ' + frameworkNames; 
    console.log(keyed_cmd);
    exec(keyed_cmd, {
        cwd: 'webdriver-ts',
        stdio: 'inherit'
    });

    console.log("rebuild-check-single.js finished");
    console.log("All checks are fine!");
    console.log("======> Please rerun the benchmark: npm run bench ", frameworkNames);
} catch (e) {
    console.log(`rebuild-check-single failed for ${frameworks.join(" ")}`);
    process.exit(-1);
}