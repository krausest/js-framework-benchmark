var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var yargs =require('yargs');

let frameworks = process.argv.length<=2 ? [] : process.argv.slice(2,process.argv.length);

if (frameworks.length === 0) {
    console.log("usage: rebuild.js [directory1, directory2, ...]");
} else {
    for (let framework of frameworks) {
        let dir = 'frameworks/'+framework;
        console.log("rebuilding "+framework);
        if (!fs.existsSync(dir)) throw "ERROR: directory "+dir+" not found";
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
        }
    }
    exec('npm run index', {
        cwd: 'webdriver-ts',
        stdio: 'inherit'
    });
    let frameworkNames = frameworks.map(f => f.split("/")[1]).join(" ");
    if (frameworkNames.length>1) {
        exec('npm run isKeyed -- --framework '+frameworkNames, {
            cwd: 'webdriver-ts',
            stdio: 'inherit'
        });
    }
}