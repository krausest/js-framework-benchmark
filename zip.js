var _ = require('lodash');
var exec = require('child_process').execSync;
var fs = require('fs');
var commandExists = require('command-exists');
const path = require('path');
const rimraf = require('rimraf');
const AdmZip = require("adm-zip");

const zip = new AdmZip();
const outputFile = "build.zip";

if (fs.existsSync(outputFile)) {
	fs.rmSync(outputFile);
}

for (let keyedType of ['keyed', 'non-keyed']) {
    let dir = path.resolve('frameworks', keyedType);
    let directories = fs.readdirSync(dir);

    for (let name of directories) {
        let fd = path.resolve(dir, name);
        console.log('zipping ', fd);
		let zipPathName = "frameworks/"+"/"+keyedType+"/"+name;
		if (fs.existsSync(fd+"/dist"))
			zip.addLocalFolder(fd+"/dist", zipPathName+"/dist");
		if (fs.existsSync(fd+"/scripts/"))
			zip.addLocalFolder(fd+"/scripts/", zipPathName+"/scripts/");
		if (fs.existsSync(fd+"/node_modules/skruv/"))
			zip.addLocalFolder(fd+"/node_modules/skruv/", zipPathName+"/node_modules/skruv/");
		if (fs.existsSync(fd+"/node_modules/slim-js/dist"))
			zip.addLocalFolder(fd+"/node_modules/slim-js/dist", zipPathName+"/node_modules/slim-js/dist");
		if (fs.existsSync(fd+"/node_modules/@neow/core/dist"))
			zip.addLocalFolder(fd+"/node_modules/@neow/core/dist", zipPathName+"/node_modules/@neow/core/dist");
		if (name=="stem" && fs.existsSync(fd+"/node_modules/babel-polyfill/dist/")) {
			zip.addLocalFolder(fd+"/node_modules/babel-polyfill/dist/", zipPathName+"/node_modules/babel-polyfill/dist/");
			zip.addLocalFile(fd+"/src/bundle.js", zipPathName+"/src")
		}
		if (fs.existsSync(fd+"/public/"))
			zip.addLocalFolder(fd+"/public/", zipPathName+"/public/");
		if (fs.existsSync(fd+"/target/web/stage"))
			zip.addLocalFolder(fd+"/target/web/stage", zipPathName+"/target/web/stage");
		if (fs.existsSync(fd+"/output"))
			zip.addLocalFolder(fd+"/output", zipPathName+"/output");
		if (fs.existsSync(fd+"/build"))
			zip.addLocalFolder(fd+"/build", zipPathName+"/build");
	}
}
zip.writeZip(outputFile);
