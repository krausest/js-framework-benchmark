var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs-extra');
var path = require('path');

if (fs.existsSync("dist")) fs.removeSync("dist");
fs.mkdirSync("dist");
fs.mkdirSync("dist"+path.sep+"webdriver-java");
fs.copySync("webdriver-ts"+path.sep+"table.html", "dist"+path.sep+"webdriver-java"+path.sep+"table.html");

fs.copySync("index.html", "dist"+path.sep+"index.html");
fs.copySync("css", "dist"+path.sep+"css");

_.each(fs.readdirSync('.'), function(name) {
	if(fs.statSync(name).isDirectory() && name[0] !== '.' && name !== 'css' && name !== 'node_modules' && name !== 'webdriver-java' && name !== 'dist') {
		console.log("dist"+path.sep+name);
		fs.mkdirSync("dist"+path.sep+name);
		fs.mkdirSync("dist"+path.sep+name+path.sep+"dist");
		fs.copySync(name+path.sep+"dist", "dist"+path.sep+name+path.sep+"dist");
		if (fs.existsSync(name+path.sep+"index.html")) {
			fs.copySync(name+path.sep+"index.html", "dist"+path.sep+name+path.sep+"index.html");
		}
	}
});

