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


if (frameworks.length == 0) {
    console.log("ERROR: Missing arguments. Command: docker-rebuild keyed/framework1 non-keyed/framework2 ...");
    process.exit(1);
}

for (f of frameworks) {
    let components = f.split("/");
    if (components.length != 2) {
        console.log(`ERROR: invalid name ${f}. It must contain exactly one /.`)
        process.exit(1);
    }
    let [keyed, name] = components;
    let path = `frameworks/${keyed}/${name}`
    if (fs.existsSync(path)) {
        console.log("deleting folder ", path);
        exec(`rm -r ${path}`);
    }
    let rsync_cmd = `rsync -avC --exclude elm-stuff --exclude dist --exclude output ${ci ? '' : '--exclude package-lock.json'} --exclude tmp --exclude node_modules --exclude bower_components /src/frameworks/${keyed}/${name} /build/frameworks/${keyed}/`;
    console.log(rsync_cmd);
    exec(rsync_cmd,
    {
        stdio: 'inherit'
    });        
    let rm_cmd = `rm -rf ${ci ? '' : 'package-lock.json'} yarn.lock dist elm-stuff bower_components node_modules output`;
    console.log(rm_cmd);
    exec(rm_cmd, {
        cwd: path,
        stdio: 'inherit'
    });
    let install_cmd = `npm ${ci ? 'ci' : 'install'} && npm run build-prod`;
    console.log(install_cmd);
    exec(install_cmd, {
        cwd: path,
        stdio: 'inherit'
    });
    if (docker) {
        let packageLockPath = path + "/package-lock.json";
        fs.copyFileSync(packageLockPath, "/src/" + packageLockPath)
    }
}

let frameworkNames = frameworks.join(" ");
let bench_cmd = 'npm run bench -- --headless --noResults --exitOnError true --count 1  ' + frameworkNames; 
console.log(bench_cmd);
exec(bench_cmd, {
    cwd: 'webdriver-ts',
    stdio: 'inherit'
});

let keyed_cmd = 'npm run isKeyed -- --headless ' + frameworkNames; 
console.log(keyed_cmd);
exec(keyed_cmd, {
    cwd: 'webdriver-ts',
    stdio: 'inherit'
});

exec('npm run index', {
    cwd: 'webdriver-ts',
    stdio: 'inherit'
});

console.log("All checks are fine!");
console.log("======> Please rerun the benchmark: npm run bench ", frameworkNames);
