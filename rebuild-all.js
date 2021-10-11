var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
const rimraf = require('rimraf');

let args = process.argv.length <= 2 ? [] : process.argv.slice(2, process.argv.length);

/*
This script rebuilds all frameworks from scratch,
it deletes all package.json and package-lock.json files
and invokes npm install and npm run build-prod for all benchmarks 

If building a framework fails you can resume building like
npm run rebuild-frameworks --restartWith keyed/react
*/

// Use npm ci or npm install ?
let ci = args.includes("--ci");
// Copy package-lock back for docker build or build locally?
let docker = args.includes("--docker");
let restartBuildingWith = args.find(a => !a.startsWith("--"));


var restartWithFramework = restartBuildingWith || '';
console.log("ARGS", "ci", ci, "docker", docker, "restartWith", restartWithFramework);

var frameworks = [].concat(
  fs.readdirSync('./frameworks/keyed').map(f => ['keyed', f]),
  fs.readdirSync('./frameworks/non-keyed').map(f => ['non-keyed', f]));

var notRestarter = ([dir, name]) => {
  if (!restartWithFramework) return false;
  if (restartWithFramework.indexOf("/")>-1) {
    return !(dir+"/"+name).startsWith(restartWithFramework);
  } else {
    return !name.startsWith(restartWithFramework);
  }
};

let skippable = _.takeWhile(frameworks, notRestarter);
let buildable = _.slice(frameworks, skippable.length);

console.log("Building ", buildable);


for (f of buildable) {
    console.log("BUILDING ", f);
    let [keyed,name] = f;
    let path = `frameworks/${keyed}/${name}`;
    if (!fs.existsSync(path+"/package.json")) {
      console.log("WARN: skipping ", f, " since there's no package.json");    
    } else {
      // if (fs.existsSync(path)) {
      //     console.log("deleting folder ",path);
      //     exec(`rm -r ${path}`);
      // }
      // rsync(keyed,name);
      let rm_cmd = `rm -rf ${ci ? '' : 'package-lock.json'} yarn.lock dist elm-stuff bower_components node_modules output`
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
        let packageLockPath = path+"/package-lock.json";
        fs.copyFileSync(packageLockPath, "/src/"+packageLockPath);
      }
    }
}

console.log("All frameworks were built!");
