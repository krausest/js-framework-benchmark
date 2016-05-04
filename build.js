var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');

_.each(fs.readdirSync('.'), function(name) {
	if(fs.statSync(name).isDirectory() && name[0] !== '.' && name !== 'css' && name !== 'node_modules' && name !== 'webdriver-java') {
		exec('npm run build-prod', {
			cwd: name,
			stdio: 'inherit'
		});
	}
});