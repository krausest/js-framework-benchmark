var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var commandExists = require('command-exists');

var instalCommand = 'npm install';

commandExists('yarn', function(err, commandExists) {

	instalCommand = commandExists ? 'yarn' : 'npm install';

	_.each(fs.readdirSync('.'), function(name) {
		if(fs.statSync(name).isDirectory() && name[0] !== '.' && ['css', 'dist','node_modules'].indexOf(name)==-1) {
			exec(instalCommand, {
				cwd: name,
				stdio: 'inherit'
			});
		}
	});
});
