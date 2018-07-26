var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var path = require('path');

// set the following variable to resume building with a framework and skip all
// other frameworks that would be buils before
var restartWithFramework = '';
var build = !restartWithFramework ? true : false;

var directories = ["webdriver-ts", "webdriver-ts-results"]
    .concat(fs.readdirSync('./frameworks/keyed').map(f => 'frameworks/keyed/' + f))
    .concat(fs.readdirSync('./frameworks/non-keyed').map(f => 'frameworks/non-keyed/' + f));

_.each(directories, function(name) {
	if(fs.statSync(name).isDirectory() && fs.existsSync(path.join(name, "package.json"))) {
		if (!build && name.startsWith(restartWithFramework)) build = true;
		if (build) {
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
		} else {
			console.log("*** Skipping "+name);
		}
	}
});
