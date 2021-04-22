var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');
const rimraf = require('rimraf');

let args = yargs(process.argv)
    .usage("npm run build [-- [--restartWith]]")
    .help('help')
    .string('restartWith')
    .argv;

    
var restartWithFramework = args.restartWith || '';
console.log("ARGS", process.argv, "restartWith", restartWithFramework);

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
      exec('rm -rf package-lock.json yarn.lock dist elm-stuff bower_components node_modules output', {
          cwd: path,
          stdio: 'inherit'
      });
      console.log("running npm install && npm run build-prod");
      exec('npm install && npm run build-prod', {
          cwd: path,
          stdio: 'inherit'
      });
      let packageLockPath = path+"/package-lock.json";
      fs.copyFileSync(packageLockPath, "/src/"+packageLockPath);
    }
}

console.log("All frameworks were built!");
