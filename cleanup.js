var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var commandExists = require('command-exists');
const path = require('path');

var installCommand = 'npm install';

var excludedDirectories = ['css', 'dist','node_modules','webdriver-java'];

function rmIfExists(base, name) {
	let dir = path.join(base, name);
	if(fs.existsSync(dir)) {
		let cleanCommand = 'rm -r '+name;
		console.log("Executing "+cleanCommand+" in "+base);
		exec(cleanCommand, {
			cwd: base,
			stdio: 'inherit'
		});
	}
}

_.each(fs.readdirSync('.'), function(name) {
	if(fs.statSync(name).isDirectory() && name[0] !== '.' && excludedDirectories.indexOf(name)==-1) {
		if(fs.existsSync(name+"/node_modules")) {
			let cleanCommand = 'rm -r node_modules';
			console.log("Executing "+cleanCommand+" in "+name);
			exec(cleanCommand, {
				cwd: name,
				stdio: 'inherit'
			});
		}
		rmIfExists(name, "package-lock.json");
		rmIfExists(name, "yarn.lock");
		rmIfExists(name, "dist");
		rmIfExists(name, "elm-stuff");
		rmIfExists(name, "bower_components");
		rmIfExists(name, "node_modules");
	}
});
