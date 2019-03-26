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

export interface BenchmarkDriverOptions {
    headless?: boolean;
    chromeBinaryPath?: string;
}

export interface BenchmarkOptions extends BenchmarkDriverOptions {
    outputDirectory: string;
    port: string;
    numIterationsForCPUBenchmarks: number;
    numIterationsForMemBenchmarks: number;
    numIterationsForStartupBenchmark: number;
}

export let config = {
    PORT: 8080,
    REPEAT_RUN: 10,
    REPEAT_RUN_MEM: 5,
    REPEAT_RUN_STARTUP: 4,
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

type KeyedType = 'keyed' | 'non-keyed';

function computeHash(keyedType: KeyedType, directory: string) {
    return keyedType+'/'+directory;
}

export interface FrameworkId {
    keyedType: KeyedType;
    directory: string;
}


abstract class FrameworkVersionInformationValid implements FrameworkId {
    public url: string;
    constructor(public keyedType: KeyedType, public directory: string, customURL: string|undefined, public useShadowRoot: boolean) {
        this.keyedType = keyedType;
        this.directory = directory;
        this.url = 'frameworks/'+keyedType+'/'+directory + (customURL ? customURL : '');
    }
}

export class FrameworkVersionInformationDynamic extends FrameworkVersionInformationValid  {
    constructor(keyedType: KeyedType, directory: string, public packageNames: string[],
        customURL: string|undefined, useShadowRoot: boolean = false) {
            super(keyedType, directory, customURL, useShadowRoot);
        }
    }

export class FrameworkVersionInformationStatic extends FrameworkVersionInformationValid  {
    constructor(keyedType: KeyedType, directory: string, public frameworkVersion: string, customURL: string|undefined, useShadowRoot: boolean = false) {
        super(keyedType, directory, customURL, useShadowRoot);
    }
    getFrameworkData(): FrameworkData {
        return {name: this.directory,
            fullNameWithKeyedAndVersion: this.directory+(this.frameworkVersion ? '-v'+this.frameworkVersion : '')+'-'+this.keyedType,
            uri: this.url,
            keyed: this.keyedType === 'keyed',
            useShadowRoot: this.useShadowRoot
        }
    }
}

export class FrameworkVersionInformationError implements FrameworkId  {
    constructor(public keyedType: KeyedType, public directory: string, public error: string) {}
}

export type FrameworkVersionInformation = FrameworkVersionInformationDynamic | FrameworkVersionInformationStatic | FrameworkVersionInformationError;

export class PackageVersionInformationValid {
    constructor(public packageName: string, public version: string) {}
}

export class PackageVersionInformationErrorUnknownPackage  {
    constructor(public packageName: string) {}
}

export class PackageVersionInformationErrorNoPackageJSONLock  {
    constructor() {}
}

export type PackageVersionInformation = PackageVersionInformationValid | PackageVersionInformationErrorUnknownPackage | PackageVersionInformationErrorNoPackageJSONLock;

export interface IMatchPredicate {
    (frameworkDirectory: string): boolean
}

const matchAll : IMatchPredicate= (frameworkDirectory: string) => true;

export function loadFrameworkVersionInformation(matchPredicate: IMatchPredicate = matchAll): FrameworkVersionInformation[] {
    let result = new Array<FrameworkVersionInformation>();
    let frameworksPath = path.resolve('..','frameworks');
    ['keyed','non-keyed'].forEach((keyedType: KeyedType) => {
        let directories = fs.readdirSync(path.resolve(frameworksPath, keyedType));

        for (let directory of directories) {
            let frameworkPath = path.join(keyedType, directory);
            if (matchPredicate(frameworkPath)) {
                let packageJSONPath = path.resolve(frameworksPath, frameworkPath, 'package.json');
                if (fs.existsSync(packageJSONPath)) {
                    let packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'));
                    if (packageJSON['js-framework-benchmark']) {
                        if (packageJSON['js-framework-benchmark']['frameworkVersionFromPackage']) {
                            result.push(new FrameworkVersionInformationDynamic(keyedType, directory,
                                packageJSON['js-framework-benchmark']['frameworkVersionFromPackage'].split(':'),
                                packageJSON['js-framework-benchmark']['customURL'],
                                packageJSON['js-framework-benchmark']['useShadowRoot']
                            ));
                        } else if (typeof packageJSON['js-framework-benchmark']['frameworkVersion'] === 'string') {
                            result.push(new FrameworkVersionInformationStatic(keyedType, directory,
                                packageJSON['js-framework-benchmark']['frameworkVersion'],
                                packageJSON['js-framework-benchmark']['customURL'],
                                packageJSON['js-framework-benchmark']['useShadowRoot']
                            ));
                        } else {
                            result.push(new FrameworkVersionInformationError(keyedType, directory, 'package.json must contain a \'frameworkVersionFromPackage\' or \'frameworkVersion\' in the \'js-framework-benchmark\'.property'));
                        }
                    } else {
                        result.push(new FrameworkVersionInformationError(keyedType, directory, 'package.json must contain a \'js-framework-benchmark\' property'));
                    }
                } else {
                    result.push(new FrameworkVersionInformationError(keyedType, directory, 'No package.json found'));
                }
            }
        }
    });
    return result;
}

export class PackageVersionInformationResult {
    public versions: Array<PackageVersionInformation> = [];
    constructor(public framework: FrameworkVersionInformationDynamic) {}
    public add(packageVersionInformation: PackageVersionInformation) {
        this.versions.push(packageVersionInformation);
    }
    public getVersionName(): string {
        if (this.versions.filter(pi => pi instanceof PackageVersionInformationErrorNoPackageJSONLock).length>0) {
            return "invalid (no package-lock)";
        }
        return this.versions.map(version => (version instanceof PackageVersionInformationValid) ? version.version : 'invalid').join(' + ');
    }
    getFrameworkData(): FrameworkData {
        return {name: this.framework.directory,
            fullNameWithKeyedAndVersion: this.framework.directory+'-v'+this.getVersionName()+'-'+this.framework.keyedType,
            uri: this.framework.url,
            keyed: this.framework.keyedType === 'keyed',
            useShadowRoot: this.framework.useShadowRoot
        }
    }
}

export function determineInstalledVersions(framework: FrameworkVersionInformationDynamic): PackageVersionInformationResult {
    let frameworksPath = path.resolve('..','frameworks');
    let packageLockJSONPath = path.resolve(frameworksPath, framework.keyedType, framework.directory, 'package-lock.json');
    let versions = new PackageVersionInformationResult(framework);
    if (fs.existsSync(packageLockJSONPath)) {
        let packageLock = JSON.parse(fs.readFileSync(packageLockJSONPath, 'utf8'));
        for (let packageName of framework.packageNames) {
            if (packageLock.dependencies[packageName]) {
                versions.add(new PackageVersionInformationValid(packageName, packageLock.dependencies[packageName].version));
            } else {
                versions.add(new PackageVersionInformationErrorUnknownPackage(packageName));
            }
        }
    } else {
        versions.add(new PackageVersionInformationErrorNoPackageJSONLock());
    }
    return versions;
}

export function initializeFrameworks(matchPredicate: IMatchPredicate = matchAll): FrameworkData[] {
    let frameworkVersionInformations = loadFrameworkVersionInformation(matchPredicate);

    let frameworks = frameworkVersionInformations.map(frameworkVersionInformation => {
        if (frameworkVersionInformation instanceof FrameworkVersionInformationDynamic) {
            return determineInstalledVersions(frameworkVersionInformation).getFrameworkData();
        } else if (frameworkVersionInformation instanceof FrameworkVersionInformationStatic) {
            return frameworkVersionInformation.getFrameworkData();
        } else {
            console.log(`WARNING: Ignoring package ${frameworkVersionInformation.keyedType}/${frameworkVersionInformation.directory}: ${frameworkVersionInformation.error}`)
            return null;
        }
    });

    frameworks = frameworks.filter(f => f!==null);
    if (config.LOG_DETAILS) {
        console.log("All available frameworks: ");
        console.log(frameworks.map(fd => fd.fullNameWithKeyedAndVersion));
    }
    return frameworks;
}
