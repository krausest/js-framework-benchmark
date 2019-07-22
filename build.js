var _ = require('lodash');
var util = require('util');
var exec = require('child_process').execSync;
var fs = require('fs');
var fsp = require('fs').promises;
var path = require('path');
var yargs = require('yargs');

var execp = util.promisify(require('child_process').exec);

let args = yargs(process.argv)
    .usage("npm run build [-- [--check] [--skipIrrelevant] [--restartWith] [--benchmarks_only]]")
    .help('help')
    .boolean('check')
    .boolean('benchmarks_only')
    .boolean('skipIrrelevant')
    .string('restartWith')
    .argv;

var referenceBranch = "origin/master";

var restartWithFramework = args.restartWith || '';

var core = args.benchmarks_only ? [] : ["webdriver-ts", "webdriver-ts-results"].map(f => ["", f]);

var frameworks = [].concat(
  fs.readdirSync('./frameworks/keyed').map(f => ['frameworks/keyed/', f]),
  fs.readdirSync('./frameworks/non-keyed').map(f => ['frameworks/non-keyed/', f]));

var notRestarter = ([_, name]) => !name.startsWith(restartWithFramework || undefined);
var [skippable, buildable] = !restartWithFramework
    ? [[],
       frameworks]
    : [_.takeWhile(frameworks, notRestarter),
       _.dropWhile(frameworks, notRestarter)];

var relevant = args.skipIrrelevant && !_.some(core, isDifferent)
    ? _.filter(buildable, isDifferent)
    : buildable;

_.each(skippable, ([dir,name]) => console.log("*** Skipping " + dir + name));

const buildProject = async ([dir,name]) => {
    let fullname = dir + name;
    try {
        if((await fsp.stat(fullname)).isDirectory() &&
           (await fsp.stat(path.join(fullname, "package.json"))).isFile()) {
            console.log("*** Executing npm install in "+fullname);
            await execp('npm install', {
                cwd: fullname
            });
            console.log("*** Executing npm run build-prod in "+fullname);
            await execp('npm run build-prod', {
                cwd: fullname
            });
        }
    } catch (err) {
        console.log(
            '*** Failed to execute ' + fullname + "\n" +
            err.stderr + "\n" +
            err.stdout);
    }
}
Promise.all([].concat(relevant, core).map(buildProject));

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
