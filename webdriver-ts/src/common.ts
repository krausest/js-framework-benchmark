import * as fs from 'fs';
import * as path from 'path';

export interface JSONResult {
    framework: string, benchmark: string, type: string, min: number,
        max: number, mean: number, geometricMean: number,
        standardDeviation: number, median: number, values: Array<number>
}

export interface BenchmarkError {
    imageFile : string;
    exception : string
}

export interface ErrorsAndWarning {
    errors: BenchmarkError[];
    warnings: String[];
}

export interface BenchmarkOptions {
    outputDirectory: string;
    port: string;
    headless?: boolean;
    chromeBinaryPath?: string;
    numIterationsForAllBenchmarks: number;
}

export let config = {
    PORT: 8080,
    REPEAT_RUN: 10,
    DROP_WORST_RUN: 0,
    WARMUP_COUNT: 5,
    TIMEOUT: 60 * 1000,
    LOG_PROGRESS: true,
    LOG_DETAILS: false,
    LOG_DEBUG: false,
    LOG_TIMELINE: false,
    EXIT_ON_ERROR: false,
    STARTUP_DURATION_FROM_EVENTLOG: true,
    STARTUP_SLEEP_DURATION: 1000,
    FORK_CHROMEDRIVER: true
}

export interface FrameworkData {
    name: string;
    version: string;
    resultFileName: string;
    uri: string;
    keyed: boolean;
    useShadowRoot: boolean;
}

interface Options {
    uri: string;
    useShadowRoot? : boolean;
}

export function initializeFrameworks() {
    function f(name: string, version:string, resultFileName:string, keyed: boolean, options: Options = {uri: null, useShadowRoot: false}): FrameworkData {
        let ret = {name, version, keyed, resultFileName, uri: 'frameworks/' + (options.uri ? options.uri : name), useShadowRoot: options.useShadowRoot};
        return ret;
    }

    console.log("building framework list:");

    let directories = fs.readdirSync('../frameworks')
    let frameworks: FrameworkData[] = [];

    for (let dir of directories) {

        let p = path.resolve('..', 'frameworks', dir);

        let framework = '';
        if (!dir.endsWith("-keyed")) {
            console.log(`ERROR: Directory name ${p} must end with '-keyed' or '-non-keyed'`);
            throw `ERROR: Directory name ${p} must end with '-keyed' or '-non-keyed'`;
        }
        framework = dir;

        let keyed = !dir.endsWith("-non-keyed");

        let useShadowRoot = false;
        let uri = null;
        let version = '';

        let addFramework = true;

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
                        } else {
                            console.log(`ERROR: The package version could not be read from package-lock.json for ${p}`);
                            throw `ERROR: The package version could not be read from package-lock.json for ${p}`;
                        }
                    } else {
                        addFramework = false;
                        console.log(`WARNING: No package-lock.json found in directory ${p}. You might need to run npm install first`);
                    }
                } else if (packageJSON['js-framework-benchmark'].frameworkVersion) {
                    version = packageJSON['js-framework-benchmark'].frameworkVersion;
                }

                if (packageJSON['js-framework-benchmark'].customURL) {
                    uri = dir+packageJSON['js-framework-benchmark'].customURL;
                }
                if (packageJSON['js-framework-benchmark'].useShadowRoot) {
                    useShadowRoot = packageJSON['js-framework-benchmark'].useShadowRoot;
                }
            } else {
                console.log(`ERROR: Property 'js-framework-benchmark' in package.json in ${p} is missing`);
                throw `ERROR: Property 'js-framework-benchmark' in package.json in ${p} is missing`;
            }
        } else {
            console.log("ERROR: No package.json in ${packageJSONFile} found");
            throw "ERROR: No package.json in ${packageJSONFile} found";
        }

        let opts = {uri, useShadowRoot};
        let match = framework.match(/^(.*?)(-non)?-keyed$/);
        let resultFileName = match[1]+"v"+version+(keyed ? "-keyed" : "-non-keyed");
        console.log("resultFileName", resultFileName);
        // Temporary fix: Leave version empty until renaming finished, don't compute result file name
        let fd  = f(framework, "", framework, keyed, opts);
        if (addFramework) frameworks.push(fd);
    }
    console.log("All available frameworks: ")
    console.log(frameworks.map(fd => fd.name));
    return frameworks;
}


