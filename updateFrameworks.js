const fs = require('fs');
const path = require('path');
const ncu = require('npm-check-updates');
const semver = require('semver');
const yargs = require('yargs');

let updageLog = [];
let mustRebuildFrameworks = [];
let couldNotBeCheckedFrameworks = [];

let args = yargs(process.argv)
    .usage("$0 --updade true|false")
    .default('update', 'true')
    .boolean('update').argv;

let updatePackages = args.update;

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
                                            updageLog.push(`Update ${keyedType}/${dir} ${packageName}: old ${version}, new ${newVersion}`);
                                            mustRebuildFrameworks.push({keyedType, newVersion, directory: dir});

                                            if (updatePackages) {
                                                    await ncu.run({
                                                    packageFile: packageJSONFile,
                                                    upgrade: true
                                                });
                                            }
                                        }
                                    }
                                }

                            } else {
                                console.log(`ERROR: The package version could not be read from package-lock.json for ${p}`);
                                throw `ERROR: The package version could not be read from package-lock.json for ${p}`;
                            }
                        }
                    } else {
                        couldNotBeCheckedFrameworks.push({keyedType, directory: dir});
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

    console.log("\nThe following frameworks were updated");
    updageLog.forEach(l => {
        console.log(l);
    });
    console.log("\nRebuilding is required:");
    mustRebuildFrameworks.forEach((f) => {
        let prefix = `frameworks/${f.keyedType}/${f.directory}/`;
        console.log(`cd ${prefix}`);
        console.log(`rm -r node_modules package-lock.json dist elm-stuff bower_components`);
        console.log(`npm install && npm run build-prod`);
        console.log(`cd ../..`);
    })
    console.log("\nRerunning those frameworks is required:");

    console.log(`cd webdriver-ts`);
    let frameworkList = mustRebuildFrameworks.reduce(
        (prev, cur) => prev+ " "+cur.directory+"-"+cur.newVersion+"-"+cur.keyedType, ""
    );
    console.log(`npm run selenium -- --framework ${frameworkList}`);

    console.log("\nThe following frameworks must be checked manually:");
    couldNotBeCheckedFrameworks.forEach(({keyedType, directory}) => {
        console.log(keyedType+"/"+directory);
    });
}

main()
    .then(text => {
    })
    .catch(err => {
        console.log('error', err);
    });