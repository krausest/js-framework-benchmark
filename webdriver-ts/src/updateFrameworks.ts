import * as fs from 'fs';
import * as path from 'path';
const ncu = require('npm-check-updates');
import * as semver from 'semver';
import * as yargs from 'yargs';
import {loadFrameworkVersionInformation, determineInstalledVersions, FrameworkVersionInformation, FrameworkVersionInformationStatic, FrameworkVersionInformationDynamic, FrameworkVersionInformationError,
    PackageVersionInformation, PackageVersionInformationValid, PackageVersionInformationErrorUnknownPackage, PackageVersionInformationErrorNoPackageJSONLock, PackageVersionInformationResult} from './common';

let args = yargs(process.argv)
    .usage("$0 --updade true|false")
    .default('update', 'true')
    .boolean('update').argv;

let updatePackages = args.update;

async function ncuReportsUpdatedVersion(packageVersionInfo: PackageVersionInformationResult) {
    let ncuInfo = await ncu.run({
        packageFile: path.resolve('..', 'frameworks', packageVersionInfo.framework.keyedType, packageVersionInfo.framework.directory, 'package.json'),
        silent: true,
        jsonUpgraded: true,
        loglevel: 'silent'
    });
    if (ncuInfo) {
        return packageVersionInfo.versions.filter((pi: PackageVersionInformationValid) => ncuInfo[pi.packageName])
            .some((pi: PackageVersionInformationValid) => {
                let newVersion = ncuInfo[pi.packageName];
                if (newVersion.startsWith('^')) newVersion = newVersion.substring(1);
                if ( newVersion.startsWith('~')) newVersion = newVersion.substring(1);
                if (newVersion) {
                    return !semver.satisfies(newVersion, '~'+pi.version);
                } else {
                    return false;
                }
        });
    } else {
        return false;
    }
}

async function ncuRunUpdate(packageVersionInfo: PackageVersionInformationResult) {
    console.log("Update "+packageVersionInfo.framework.keyedType +'/' + packageVersionInfo.framework.directory);
    await ncu.run({
        packageFile: path.resolve('..', 'frameworks', packageVersionInfo.framework.keyedType, packageVersionInfo.framework.directory, 'package.json'),
        upgrade: true
    });
}


async function main() {

    let frameworkVersionInformations = loadFrameworkVersionInformation();

    let errors = frameworkVersionInformations.filter(frameworkVersionInformation => frameworkVersionInformation instanceof FrameworkVersionInformationError);

    if (errors.length > 0) {
        console.log("ERROR: The following frameworks do not include valid version info and must be fixed");
        console.log(errors.map(val => val.keyedType +'/' + val.directory).join('\n') + '\n');
    }

    let manually = frameworkVersionInformations.filter(frameworkVersionInformation => frameworkVersionInformation instanceof FrameworkVersionInformationStatic);

    if (manually.length > 0) {
        console.log("WARNING: The following frameworks must be updated manually: ");
        console.log(manually.map(val => val.keyedType + '/' + val.directory).join('\n') + '\n');
    }

    let automatically = frameworkVersionInformations
            .filter(frameworkVersionInformation => frameworkVersionInformation instanceof FrameworkVersionInformationDynamic)
            .map(frameworkVersionInformation => frameworkVersionInformation as FrameworkVersionInformationDynamic);

    let packageLockInformations : PackageVersionInformationResult[] = automatically.map(frameworkVersionInformation => determineInstalledVersions(frameworkVersionInformation));

    let noPackageLock = packageLockInformations.filter(pli => pli.versions.some((packageVersionInfo: PackageVersionInformation) => packageVersionInfo instanceof PackageVersionInformationErrorNoPackageJSONLock));

    if (noPackageLock.length > 0) {
        console.log("WARNING: The following frameworks do not yet have a package-lock.json file (maybe you must 'npm install' it): ");
        console.log(noPackageLock.map(val => val.framework.keyedType +'/' + val.framework.directory).join('\n') + '\n');
    }

    let unknownPackages = packageLockInformations.filter(pli => pli.versions.some((packageVersionInfo: PackageVersionInformation) => packageVersionInfo instanceof PackageVersionInformationErrorUnknownPackage));

    if (unknownPackages.length > 0) {
        console.log("WARNING: The following frameworks do not have a version for the specified packages in package-lock.json file (maybe you misspelled the package name): ");
        let unknownPackagesStr = (packageVersionInfo: PackageVersionInformationResult) => packageVersionInfo.versions.filter(pvi => pvi instanceof PackageVersionInformationErrorUnknownPackage).
            map((packageVersionInfo: PackageVersionInformationErrorUnknownPackage) => packageVersionInfo.packageName).join(', ');

        console.log(unknownPackages.map(val => val.framework.keyedType +'/' + val.framework.directory + ' for package ' + unknownPackagesStr(val)).join('\n') + '\n');
    }

    let checkVersionsFor = packageLockInformations.filter(pli => pli.versions.every((packageVersionInfo: PackageVersionInformation) => packageVersionInfo instanceof PackageVersionInformationValid));

    let toBeUpdated = new Array<PackageVersionInformationResult>();
    for (let f of checkVersionsFor) {
        if (await ncuReportsUpdatedVersion(f)) toBeUpdated.push(f);
    }
    console.log("The following frameworks can be updated");

    if (toBeUpdated.length > 0) {
        console.log(toBeUpdated.map(val => val.framework.keyedType +'/' + val.framework.directory).join('\n') + '\n');

        if (updatePackages) {
            for (let val of toBeUpdated) {
                console.log("ACTION: Updating package.json for " +  val.framework.keyedType +'/' + val.framework.directory);
                await ncuRunUpdate(val);
                console.log("\nTODO: ebuilding is required:");
                let prefix = `frameworks/${val.framework.keyedType}/${val.framework.directory}/`;
                console.log(`cd ${prefix}`);
                console.log(`rm -r node_modules package-lock.json dist elm-stuff bower_components`);
                console.log(`npm install && npm run build-prod`);
                console.log(`cd ../..`);
            }

            console.log("\nTODO: Rerunning those frameworks is required:");

            console.log(`cd webdriver-ts`);
            let frameworkList = toBeUpdated.map(framework => framework.getFrameworkData().fullNameWithKeyedAndVersion).join(' ');
            console.log(`npm run selenium -- --framework ${frameworkList}`);
        }
    }
}

main()
    .then(text => {
    })
    .catch(err => {
        console.log('error', err);
    });


