var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');

var excludedDirectories = ['css', 'dist','node_modules','webdriver-java'];

_.each(fs.readdirSync('.'), function(name) {
	if(fs.statSync(name).isDirectory() && name[0] !== '.' && excludedDirectories.indexOf(name)==-1) {
		console.log("Executing npm run build-prod in "+name);
		exec('npm run build-prod', {
			cwd: name,
			stdio: 'inherit'
		});
	}
});