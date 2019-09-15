var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');

/*
The restart parameter can be used to rebuily only some of the frameworks.
One can either rebuild alll frameworks where the parameter matches the prefix of a 
framework name, no matter if keyed or non-keyed:
--restartWith angu 
(Matches keyed and non-keyed angular, angularjs, angular-ivy, ...)
Or it can be restrict matching to keyed or non-keyed frameworks:
--restartWith keyed/angu
(Matches only keyed angular, angularjs, angular-ivy, ...)
The distinction is made by checking whether a slash is contained in the parameter
*/

let args = yargs(process.argv)
    .usage("npm run build [-- [--check] [--skipIrrelevant] [--restartWith] [--benchmarks_only]]")
    .help('help')
    .boolean('check')
    .boolean('benchmarks_only')
    .boolean('skipIrrelevant')
    .string('restartWith')
    .argv;

console.log("ARGS", process.argv);

var referenceBranch = "origin/master";

var restartWithFramework = args.restartWith || '';

var core = args.benchmarks_only ? [] : ["webdriver-ts", "webdriver-ts-results"].map(f => ["", f]);

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

var relevant = args.skipIrrelevant && !_.some(core, isDifferent)
    ? _.filter(buildable, isDifferent)
    : buildable;

_.each(skippable, ([dir,name]) => console.log("*** Skipping " + dir + "/" + name));

_.each([].concat(relevant, core), function([dir,name]) {
  let fullname = path.join("frameworks", dir, name);
	if(fs.statSync(fullname).isDirectory() && fs.existsSync(path.join(fullname, "package.json"))) {
          console.log("*** Executing npm install in "+fullname);
            exec('npm install', {
				cwd: fullname,
				stdio: 'inherit'
			});
			console.log("*** Executing npm run build-prod in "+fullname);
			exec('npm run build-prod', {
				cwd: fullname,
				stdio: 'inherit'
			});
	}
});

var testable = args.check ? relevant : [];
_.each(testable, function([dir,name]) {
        let fullname = dir + name;
	if(fs.statSync(fullname).isDirectory() && fs.existsSync(path.join(fullname, "package.json"))) {
            console.log("*** Executing npm run selenium for "+fullname);
            exec('npm run selenium -- --count 1 --fork false --framework ' + name, {
				cwd: "webdriver-ts",
				stdio: 'inherit'
			});
	}
});

function isDifferent([dir,name]) {
  try { exec('git diff --quiet ' + referenceBranch + ' -- ' + dir + name); }
  catch(e) { return true; }
  return false;
};
