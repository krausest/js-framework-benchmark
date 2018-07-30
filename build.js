var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');
var yargs = require('yargs');

let args = yargs(process.argv)
    .usage("npm run build [-- [--skipIrrelevant]]")
    .help('help')
    .boolean('skipIrrelevant')
    .argv;

var referenceBranch = "origin/master";

// set the following variable to resume building with a framework and skip all
// other frameworks that would be built before
var restartWithFramework = '';

var core = ["webdriver-ts", "webdriver-ts-results"]

var frameworks = [].concat(
  fs.readdirSync('./frameworks/keyed').map(f => 'frameworks/keyed/' + f),
  fs.readdirSync('./frameworks/non-keyed').map(f => 'frameworks/non-keyed/' + f));

var notRestarter = name => !name.startsWith(restartWithFramework || undefined);
var [skippable, buildable] = !restartWithFramework
    ? [[],
       frameworks]
    : [_.takeWhile(frameworks, notRestarter),
       _.dropWhile(frameworks, notRestarter)];

var relevant = args.skipIrrelevant && !_.some(core, isDifferent)
    ? _.filter(buildable, isDifferent)
    : buildable;

_.each(skippable, name => console.log("*** Skipping " + name));

_.each([].concat(relevant, core), function(name) {
	if(fs.statSync(name).isDirectory() && fs.existsSync(path.join(name, "package.json"))) {
            console.log("*** Executing npm install in "+name);
            exec('npm install', {
				cwd: name,
				stdio: 'inherit'
			});
			console.log("*** Executing npm run build-prod in "+name);
			exec('npm run build-prod', {
				cwd: name,
				stdio: 'inherit'
			});
	}
});

function isDifferent(name) {
  try { exec('git diff --quiet ' + referenceBranch + ' -- ' + name); }
  catch(e) { return true; }
  return false;
};
