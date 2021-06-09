import { BenchmarkType, Benchmark, benchmarks, fileName, LighthouseData } from './benchmarks'
import * as fs from 'fs';
import * as yargs from 'yargs';
import * as path from 'path'
import { JSONResult, config, FrameworkData, initializeFrameworks, ErrorAndWarning, BenchmarkOptions } from './common'
import * as R from 'ramda';
import { fork } from 'child_process';
import { executeBenchmark } from './forkedBenchmarkRunner';
import mapObjIndexed from 'ramda/es/mapObjIndexed';
import {writeResults} from './writeResults';
import { resolve } from 'dns';

function forkAndCallBenchmark(frameworks: FrameworkData[], frameworkName: string, keyed: boolean, benchmarkName: string, benchmarkOptions: BenchmarkOptions): Promise<ErrorAndWarning> {
    return new Promise((resolve, reject) => {
        const forked = fork('dist/forkedBenchmarkRunner.js');
                if (config.LOG_DETAILS) console.log("FORKING:  forked child process");
                forked.send({ config, frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions });
                forked.on('message', async (msg: ErrorAndWarning) => {
                    if (config.LOG_DETAILS) console.log("FORKING: main process got message from child", msg);
                    resolve(msg);
                });
                forked.on('close', (msg) => {
                    if (config.LOG_DETAILS) console.log("FORKING: child closed", msg);
                });
                forked.on('error', (msg) => {
                    if (config.LOG_DETAILS) console.log("FORKING: child error", msg);
                    reject(msg);
                });
                forked.on('exit', (code, signal) => {
                    if (config.LOG_DEBUG) console.log("child exit", code, signal);
                });
            });
}

async function runBenchmakLoop(frameworks: FrameworkData[], frameworkName: string, keyed: boolean, benchmarkName: string, benchmarkOptions: BenchmarkOptions): Promise<{errors:String[], warnings:String[]}> {
    if (config.FORK_CHROMEDRIVER) {
        let runFrameworks = frameworks.filter(f => f.keyed === keyed).filter(f => frameworkName === f.name);
        let runBenchmarks = benchmarks.filter(b => benchmarkName === b.id);
        if (runFrameworks.length!=1) throw `Framework name ${frameworkName} is not unique`;
        if (runBenchmarks.length!=1) throw `Benchmark name ${benchmarkName} is not unique`;

        let framework = runFrameworks[0];
        let benchmark = runBenchmarks[0];

        let warnings : String[] = [];
        let errors : String[] = [];

        let results: Array<number|LighthouseData> = [];
        let count = 0;

        if (benchmark.type == BenchmarkType.CPU) {
            count = benchmarkOptions.numIterationsForCPUBenchmarks;
            benchmarkOptions.batchSize = config.ALLOW_BATCHING && benchmark.allowBatching ? count : 1;
        } else if (benchmark.type == BenchmarkType.MEM) {
            count = benchmarkOptions.numIterationsForMemBenchmarks;
            benchmarkOptions.batchSize = 1;
        } else {
            count = benchmarkOptions.numIterationsForStartupBenchmark
            benchmarkOptions.batchSize = 1;
        }

        let retries = 0;

        while (results.length < count) {
            benchmarkOptions.batchSize = Math.min(benchmarkOptions.batchSize, count-results.length);
            console.log("FORKING: ", benchmark.id, " BatchSize ", benchmarkOptions.batchSize);
            let res = await forkAndCallBenchmark(frameworks, frameworkName, keyed, benchmarkName, benchmarkOptions);
            if (res.result) {
                if (Array.isArray(res.result)) { results = results.concat(res.result)}
                else results.push(res.result);
            }
            warnings = warnings.concat(res.warnings);
            if (res.error) {
                if (res.error.indexOf("Server terminated early with status 1")>-1) {
                    console.log("******* STRANGE selenium error found - retry #",(retries+1));
                    retries++;
                    if (retries==3) break;
                } else {
                    errors.push(`Executing ${framework.uri} and benchmark ${benchmark.id} failed: `+res.error);
                    break;
                }
            }
        }
        if (benchmark.type == BenchmarkType.CPU) {
            // console.log("CPU results before: ", results);
            (results as number[]).sort((a:number,b:number) => a-b)
            results = results.slice(0, config.NUM_ITERATIONS_FOR_BENCHMARK_CPU)
            // console.log("CPU results after: ", results)
        }
    
        console.log("******* result ", results);
        await writeResults(config, { framework: framework, benchmark: benchmark, results: results });
        return ({errors, warnings})
    // } else {
    //     return executeBenchmark(frameworks, keyed, frameworkName, benchmarkName, benchmarkOptions);
    }
}

async function runBench(runFrameworks: FrameworkData[], benchmarkNames: string[]) {
    let errors: String[] = [];
    let warnings: String[] = [];

    let runBenchmarks = benchmarks.filter(b => benchmarkNames.some(name => b.id.toLowerCase().indexOf(name) > -1));

    let restart: string = undefined;
    let index = runFrameworks.findIndex(f => f.fullNameWithKeyedAndVersion===restart);
    if (index>-1) {
        runFrameworks = runFrameworks.slice(index);
    }

    console.log("Frameworks that will be benchmarked", runFrameworks.map(f => f.fullNameWithKeyedAndVersion));
    console.log("Benchmarks that will be run", runBenchmarks.map(b => b.id));

    let benchmarkOptions: BenchmarkOptions = {
        port: config.PORT.toFixed(),
        remoteDebuggingPort: config.REMOTE_DEBUGGING_PORT,
        chromePort: config.CHROME_PORT,
        headless: args.headless,
        chromeBinaryPath: args.chromeBinary,
        numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
        numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
        numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
        batchSize: 1
    }

    for (let i = 0; i < runFrameworks.length; i++) {
        for (let j = 0; j < runBenchmarks.length; j++) {
            try {
                let result = await runBenchmakLoop(runFrameworks, runFrameworks[i].name, runFrameworks[i].keyed, runBenchmarks[j].id, benchmarkOptions);
                errors = errors.concat(result.errors);
                warnings = warnings.concat(result.warnings);
            } catch (e) {
                console.log("UNHANDELED ERROR", e);
                errors.push(e);
            }
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
            console.log(e);
        });
        throw "Benchmarking failed with errors";
    }
}

// FIXME: Clean up args.
// What works: npm run bench keyed/react, npm run bench -- keyed/react, npm run bench -- keyed/react --count 1 --benchmark 01_
// What doesn't work (keyed/react becomes an element of argument benchmark): npm run bench -- --count 1 --benchmark 01_ keyed/react

let args: any = yargs(process.argv)
    .usage("$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--count n] [--exitOnError] \n or: $0 [directory1] [directory2] .. [directory3] \n or: $0 installed")
    .help('help')
    .boolean('onlyKeyed')
    .boolean('onlyNonKeyed')
    .default('check', 'false')
    .default('fork', 'true')
    .boolean('noResults')
    .default('exitOnError', 'false')
    .default('count', Number.MAX_SAFE_INTEGER)
    .default('port', config.PORT)
    .string('chromeBinary')
    .string('chromeDriver')
    .boolean('headless')
    .boolean('installed')
    .array("framework").array("benchmark")
    .argv;

console.log("args", args);

let allArgs = args._.length<=2 ? [] : args._.slice(2,args._.length);

let runBenchmarksFromDirectoryNamesArgs = !args.framework;

async function main() {

    let runBenchmarks = (args.benchmark && args.benchmark.length > 0 ? args.benchmark : [""]).map((v:string) => v.toString());
    let runFrameworks: FrameworkData[];
    if(args.onlyKeyed){
        console.log("MODE: Only keyed");
        let matchesDirectoryArg = (directoryName: string) => directoryName.startsWith("keyed/");
        runFrameworks = await initializeFrameworks(matchesDirectoryArg);
    } else if(args.onlyNonKeyed){
        console.log("MODE: Only non keyed");
        let matchesDirectoryArg = (directoryName: string) => directoryName.startsWith("non-keyed/");
        runFrameworks = await initializeFrameworks(matchesDirectoryArg);
    } else if(args.installed){
        console.log("MODE: Installed frameworks.");
        const hasPackageLock = (directoryName: string)=>
            !!fs.existsSync(path.join(path.resolve('..','frameworks'), directoryName, 'package-lock.json'))
        runFrameworks = await initializeFrameworks(hasPackageLock)
    } else if (runBenchmarksFromDirectoryNamesArgs) {
        console.log("MODE: Directory names. Using arguments as the directory names to be re-run: ", allArgs);
        let matchesDirectoryArg = (directoryName: string) => allArgs.length==0 || allArgs.some((arg:string) => arg==directoryName)
        runFrameworks = await initializeFrameworks(matchesDirectoryArg);
    } else {
        console.log("MODE: Classic command line options");
        let frameworkNames = (args.framework && args.framework.length > 0 ? args.framework : [""]).map((v:any) => v.toString());
        let frameworks = await initializeFrameworks();
        runFrameworks = frameworks.filter(f => frameworkNames.some((name:string) => f.fullNameWithKeyedAndVersion.indexOf(name) > -1));
    }
    let count = Number(args.count);
    config.PORT = Number(args.port);
    if (count < Number.MAX_SAFE_INTEGER) config.NUM_ITERATIONS_FOR_BENCHMARK_CPU = count;
    config.NUM_ITERATIONS_FOR_BENCHMARK_MEM = Math.min(count, config.NUM_ITERATIONS_FOR_BENCHMARK_MEM);
    config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP = Math.min(count, config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP);
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