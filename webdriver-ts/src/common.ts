import * as fs from 'fs';
import * as path from 'path';

export interface JSONResult {
    framework: string, keyed: boolean, benchmark: string, type: string, min: number,
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
    fullNameWithKeyedAndVersion: string;
    uri: string;
    keyed: boolean;
    useShadowRoot: boolean;
}

interface Options {
    uri: string;
    useShadowRoot? : boolean;
}

export function initializeFrameworks() {
    function f(name: string, fullNameWithKeyedAndVersion:string, keyed: boolean, options: Options = {uri: null, useShadowRoot: false}): FrameworkData {
        let ret = {name, fullNameWithKeyedAndVersion, keyed, uri: 'frameworks/' + (keyed ? 'keyed/' : 'non-keyed/') + (options.uri ? options.uri : name), useShadowRoot: options.useShadowRoot};
        return ret;
    }

    console.log("building framework list:");
    let frameworks: FrameworkData[] = [];

    for (let keyedType of ['keyed','non-keyed']) {
        let directories = fs.readdirSync(path.resolve('..','frameworks',keyedType));

        for (let dir of directories) {

            let p = path.resolve('..', 'frameworks', keyedType, dir);

            let framework = dir;

            let keyed = 'keyed' === keyedType;

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
            let fullNameWithKeyedAndVersion = framework+(version ? "-v"+version : "")+(keyed ? "-keyed" : "-non-keyed");
            let fd  = f(framework, fullNameWithKeyedAndVersion, keyed, opts);
            if (addFramework) frameworks.push(fd);
        }
    }
    console.log("All available frameworks: ")
    console.log(frameworks.map(fd => fd.fullNameWithKeyedAndVersion));
    return frameworks;
}

