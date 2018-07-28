const fs = require('fs');
const path = require('path');
const ncu = require('npm-check-updates');
const semver = require('semver');

let mustRebuildFrameworks = [];

async function main() {
    for (let keyedType of ['keyed', 'non-keyed']) {
        let directories = fs.readdirSync(path.resolve('frameworks', keyedType));

        for (let dir of directories) {

            let p = path.resolve('frameworks', keyedType, dir);

            let packageJSONFile = path.resolve(p, 'package.json');
            if (fs.existsSync(packageJSONFile)) {
                let packageJSON = JSON.parse(fs.readFileSync(packageJSONFile, 'utf8'));
                if (packageJSON['js-framework-benchmark']) {
                    if (packageJSON['js-framework-benchmark'].frameworkVersionFromPackage) {
                        let packageName = packageJSON['js-framework-benchmark'].frameworkVersionFromPackage;
                        let packageLockJSONFile = path.resolve(p, 'package-lock.json');
                        if (fs.existsSync(packageLockJSONFile)) {
                            let packageLock = JSON.parse(fs.readFileSync(path.resolve(p, 'package-lock.json'), 'utf8'));
                            if (packageLock.dependencies[packageName]) {
                                version = packageLock.dependencies[packageName].version;

                                let upgraded = await ncu.run({
                                    packageFile: packageJSONFile,
                                    silent: true,
                                    jsonUpgraded: true,
                                    loglevel: 'silent'
                                });
                                if (upgraded) {
                                    let newVersion = upgraded[packageName];
                                    if (newVersion && newVersion.startsWith('^')) newVersion = newVersion.substring(1);
                                    if (newVersion &&  newVersion.startsWith('~')) newVersion = newVersion.substring(1);
                                    if (newVersion) {
                                        if (!semver.satisfies(newVersion, '~'+version)) {
                                            console.log(`*** Update ${packageName} old version is ${version}, new version ${newVersion}`);
                                            mustRebuildFrameworks.push(p);
                                            await ncu.run({
                                                packageFile: packageJSONFile,
                                                upgrade: true
                                            });
                                        }
                                    }
                                }

                            } else {
                                console.log(`ERROR: The package version could not be read from package-lock.json for ${p}`);
                                throw `ERROR: The package version could not be read from package-lock.json for ${p}`;
                            }
                        }
                    } else {
                        console.log(`WARN: Can't check framework ${p} due to absence fo frameworkVersionFromPackage in package.json`);
                    }
                } else {
                    console.log(`ERROR: Property 'js-framework-benchmark' in package.json in ${p} is missing`);
                    throw `ERROR: Property 'js-framework-benchmark' in package.json in ${p} is missing`;
                }
            } else {
                console.log("ERROR: No package.json in ${packageJSONFile} found");
                throw "ERROR: No package.json in ${packageJSONFile} found";
            }
        }
    }

    console.log("Rebuilding is required for", mustRebuildFrameworks);
}

main()
    .then(text => {
        console.log('finished');
    })
    .catch(err => {
        console.log('error', err);
    });