var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var commandExists = require('command-exists');

var instalCommand = 'npm install';

commandExists('yarn', function(err, commandExists) {

	instalCommand = commandExists ? 'yarn' : 'npm install';

	_.each(fs.readdirSync('.'), function(name) {
		if(fs.statSync(name).isDirectory() && name[0] !== '.' && name !== 'css' && name !== 'node_modules') {
			exec(instalCommand, {
				cwd: name,
				stdio: 'inherit'
			});
		}
	});
});
