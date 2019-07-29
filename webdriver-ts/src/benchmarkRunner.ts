import { BenchmarkType, Benchmark, benchmarks, fileName, LighthouseData } from './benchmarks'
import * as fs from 'fs';
import * as yargs from 'yargs';
import { JSONResult, config, FrameworkData, initializeFrameworks, BenchmarkError, ErrorsAndWarning, BenchmarkOptions } from './common'
import * as R from 'ramda';
import { fork } from 'child_process';
import { executeBenchmark } from './forkedBenchmarkRunner';
import mapObjIndexed from 'ramda/es/mapObjIndexed';

function forkedRun(frameworks: FrameworkData[], frameworkName: string, keyed: boolean, benchmarkName: string, benchmarkOptions: BenchmarkOptions): Promise<ErrorsAndWarning> {
    if (config.FORK_CHROMEDRIVER) {
        return new Promise(function (resolve, reject) {
            const forked = fork('dist/forkedBenchmarkRunner.js');
            if (config.LOG_DEBUG) console.log("forked child process");
            forked.send({ config, frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions });
            forked.on('message', (msg) => {
                if (config.LOG_DEBUG) console.log("main process got message from child", msg);
                resolve(msg);
            });
        });
    } else {
        return executeBenchmark(frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions);
    }
}

async function runBench(runFrameworks: FrameworkData[], benchmarkNames: string[]) {
    let errors: BenchmarkError[] = [];
    let warnings: String[] = [];

    let runBenchmarks = benchmarks.filter(b => benchmarkNames.some(name => b.id.toLowerCase().indexOf(name) > -1));

    let restart: string = undefined; // 'rx-domh-rxjs-v0.0.2-keyed';
    let index = runFrameworks.findIndex(f => f.fullNameWithKeyedAndVersion===restart);
    if (index>-1) {
        runFrameworks = runFrameworks.slice(index);
    }

    console.log("Frameworks that will be benchmarked", runFrameworks.map(f => f.fullNameWithKeyedAndVersion));
    console.log("Benchmarks that will be run", runBenchmarks.map(b => b.id));

    let data: [[FrameworkData, Benchmark]] = <any>[];
    for (let i = 0; i < runFrameworks.length; i++) {
        for (let j = 0; j < runBenchmarks.length; j++) {
            data.push([runFrameworks[i], runBenchmarks[j]]);
        }
    }

    for (let i = 0; i < data.length; i++) {
        let framework = data[i][0];
        let benchmark = data[i][1];


        let benchmarkOptions: BenchmarkOptions = {
            port: config.PORT.toFixed(),
            remoteDebuggingPort: config.REMOTE_DEBUGGING_PORT,
            chromePort: config.CHROME_PORT,
            headless: args.headless,
            chromeBinaryPath: args.chromeBinary,
            numIterationsForCPUBenchmarks: config.REPEAT_RUN,
            numIterationsForMemBenchmarks: config.REPEAT_RUN_MEM,
            numIterationsForStartupBenchmark: config.REPEAT_RUN_STARTUP
        }

        try {
            let errorsAndWarnings: ErrorsAndWarning = await forkedRun(runFrameworks, framework.name, framework.keyed, benchmark.id, benchmarkOptions);
            errors.splice(errors.length, 0, ...errorsAndWarnings.errors);
            warnings.splice(warnings.length, 0, ...errorsAndWarnings.warnings);
        } catch (err) {
            console.log(`Error executing benchmark ${framework.name} and benchmark ${benchmark.id}`);
        }
    }

    if (warnings.length > 0) {
        console.log("================================");
        console.log("The following warnings were logged:");
        console.log("================================");

        warnings.forEach(e => {
            console.log(e);
        });
    }

    if (errors.length > 0) {
        console.log("================================");
        console.log("The following benchmarks failed:");
        console.log("================================");

        errors.forEach(e => {
            console.log("[" + e.imageFile + "]");
            console.log(e.exception);
            console.log();
        });
        throw "Benchmarking failed with errors";
    }
}

// FIXME: Clean up args.
// What works: npm run bench keyed/react, npm run bench -- keyed/react, npm run bench -- keyed/react --count 1 --benchmark 01_
// What doesn't work (keyed/react becomes an element of argument benchmark): npm run bench -- --count 1 --benchmark 01_ keyed/react   

let args = yargs(process.argv)
    .usage("$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--count n] [--exitOnError] \n or: $0 [directory1] [directory2] .. [directory3]")
    .help('help')
    .default('check', 'false')
    .default('fork', 'true')
    .boolean('noResults')
    .default('exitOnError', 'false')
    .default('count', Number.MAX_SAFE_INTEGER)
    .default('port', config.PORT)
    .string('chromeBinary')
    .string('chromeDriver')
    .boolean('headless')
    .array("framework").array("benchmark")
    .argv;

let allArgs = args._.length<=2 ? [] : args._.slice(2,args._.length);

let runBenchmarksFromDirectoryNamesArgs = !args.framework;

async function main() {
    
    
    let runBenchmarks = (args.benchmark && args.benchmark.length > 0 ? args.benchmark : [""]).map(v => v.toString());
    let runFrameworks: FrameworkData[];
    if (runBenchmarksFromDirectoryNamesArgs) {    
        console.log("MODE: Directory names. Using arguments as the directory names to be re-run: ", allArgs);
        let matchesDirectoryArg = (directoryName: string) => allArgs.length==0 || allArgs.some(arg => arg==directoryName)
        runFrameworks = await initializeFrameworks(matchesDirectoryArg);
    } else {
        console.log("MODE: Classic command line options");
        let frameworkNames = (args.framework && args.framework.length > 0 ? args.framework : [""]).map(v => v.toString());
        let frameworks = await initializeFrameworks();
        runFrameworks = frameworks.filter(f => frameworkNames.some(name => f.fullNameWithKeyedAndVersion.indexOf(name) > -1));
    }
    let count = Number(args.count);
    config.PORT = Number(args.port);
    if (count < Number.MAX_SAFE_INTEGER) config.REPEAT_RUN = count;
    config.REPEAT_RUN_MEM = Math.min(count, config.REPEAT_RUN_MEM);
    config.REPEAT_RUN_STARTUP = Math.min(count, config.REPEAT_RUN_STARTUP);
    config.FORK_CHROMEDRIVER = args.fork === 'true';
    config.WRITE_RESULTS = !args.noResults;

    console.log(args, "no-results", args.noResults, config.WRITE_RESULTS);

    let exitOnError = args.exitOnError === 'true'

    config.EXIT_ON_ERROR = exitOnError;

    console.log("fork chromedriver process?", config.FORK_CHROMEDRIVER);

    if (!fs.existsSync(config.RESULTS_DIRECTORY))
    fs.mkdirSync(config.RESULTS_DIRECTORY);

    if (args.help) {
        yargs.showHelp();
    } else {
        return runBench(runFrameworks, runBenchmarks);
    }
}

main().then(_ => {
    console.log("successful run");
    process.exit(0);
}).catch(error => {
    console.log("run was not completely sucessful", error);
    process.exit(1);
})