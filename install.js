var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var commandExists = require('command-exists');

var installCommand = 'npm install';

commandExists('yarn', function(err, commandExists) {

	installCommand = commandExists ? 'yarn' : 'npm install';

	_.each(fs.readdirSync('.'), function(name) {
		if(fs.statSync(name).isDirectory() && name[0] !== '.' && ['css', 'dist', 'node_modules'].indexOf(name) == -1) {
			exec(installCommand, {
				cwd: name,
				stdio: 'inherit'
			});
		}
	});
});
