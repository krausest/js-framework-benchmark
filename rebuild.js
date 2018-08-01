var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var yargs =require('yargs');

let args = yargs(process.argv)
    .array("framework").argv;

for (let framework of args.framework) {
    let dir = 'frameworks/'+framework;
    console.log("rebuilding "+framework);
    if (!fs.existsSync(dir)) console.log ("ERROR: directory "+dir+" not found");
    else {
        console.log("running rm -rf package-lock.json yarn.lock dist elm-stuff bower_components node_modules");
        try {
            exec('rm -rf package-lock.json yarn.lock dist elm-stuff bower_components node_modules', {
                cwd: dir,
                stdio: 'inherit'
            });
        } catch {}
        console.log("running npm install && npm run build-prod");
        exec('npm install && npm run build-prod', {
            cwd: dir,
            stdio: 'inherit'
        });
        exec('npm install && npm run build-prod', {
            cwd: dir,
            stdio: 'inherit'
        });
        }
    exec('npm run index', {
        cwd: 'webdriver-ts',
        stdio: 'inherit'
    });
    let frameworkNames = args.framework.map(f => f.split("/")[1]).join(" ");
    exec('npm run nonKeyed -- --framework '+frameworkNames, {
        cwd: 'webdriver-ts',
        stdio: 'inherit'
    });
}