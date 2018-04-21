import {BenchmarkType, Benchmark, benchmarks, fileName, LighthouseData} from './benchmarks'
import * as fs from 'fs';
import * as yargs from 'yargs';
import {JSONResult, config, FrameworkData, frameworks, BenchmarkError, BenchmarkOptions} from './common'
import * as R from 'ramda';
import { fork } from 'child_process';
import {executeBenchmark} from './forkedBenchmarkRunner';


function forkedRun(frameworkName: string, benchmarkName: string, benchmarkOptions: BenchmarkOptions): Promise<BenchmarkError[]> {    
    if (config.FORK_CHROMEDRIVER) {
        return new Promise(function(resolve, reject) {
            const forked = fork('dist/forkedBenchmarkRunner.js');
            if (config.LOG_DEBUG) console.log("forked child process");
            forked.send({frameworkName, benchmarkName, benchmarkOptions});
                forked.on('message', (msg) => {
                    if (config.LOG_DEBUG) console.log("main process got message from child", msg);
                    resolve(msg.errors);
            });
        });
    } else {
        return executeBenchmark(frameworkName, benchmarkName, benchmarkOptions);
    }
}




async function runBench(frameworkNames: string[], benchmarkNames: string[], dir: string) {
    var errors: BenchmarkError[] = [];
    let runFrameworks = frameworks.filter(f => frameworkNames.some(name => f.name.indexOf(name)>-1));
    let runBenchmarks = benchmarks.filter(b => benchmarkNames.some(name => b.id.toLowerCase().indexOf(name)>-1));
    console.log("Frameworks that will be benchmarked", runFrameworks);
    console.log("Benchmarks that will be run", runBenchmarks.map(b => b.id));

    let data : [[FrameworkData, Benchmark]] = <any>[];
    for (let i=0;i<runFrameworks.length;i++) {
       for (let j=0;j<runBenchmarks.length;j++) {
            data.push( [runFrameworks[i], runBenchmarks[j]] );
       }
    }

    for (let i = 0; i < data.length; i++) {
        let framework = data[i][0];
        let benchmark = data[i][1];


        let benchmarkOptions: BenchmarkOptions = {
            outputDirectory: dir,
            port: config.PORT.toFixed(),
            headless: args.headless,
            chromeBinaryPath: args.chromeBinary
        }

        try {
            errors.splice(errors.length, 0, ...await forkedRun(framework.name, benchmark.id, benchmarkOptions));
        } catch (err) {
            console.log(`Error executing benchmark ${framework.name} and benchmark ${benchmark.id}`);
        }
    }

    if(errors.length == 0) return;

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

let args = yargs(process.argv)
.usage("$0 [--framework Framework1,Framework2,...] [--benchmark Benchmark1,Benchmark2,...] [--count n] [--exitOnError]")
.help('help')
.default('check','false')
.default('fork','true')
.default('exitOnError','false')
.default('count', config.REPEAT_RUN)
.default('port', config.PORT)
.string('chromeBinary')
.string('chromeDriver')
.boolean('headless')
.array("framework").array("benchmark").argv;

console.log(args);

let runBenchmarks = args.benchmark && args.benchmark.length>0 ? args.benchmark : [""];
let runFrameworks = args.framework && args.framework.length>0 ? args.framework : [""];
let count = Number(args.count);
config.PORT = Number(args.port);
config.REPEAT_RUN = count;
config.FORK_CHROMEDRIVER = args.fork === 'true';

let dir = args.check === 'true' ? "results_check" : "results"
let exitOnError = args.exitOnError === 'true'

config.EXIT_ON_ERROR = exitOnError;

console.log("fork chromedriver process?", config.FORK_CHROMEDRIVER);

if (!fs.existsSync(dir))
    fs.mkdirSync(dir);

if (args.help) {
    yargs.showHelp();
} else {
    runBench(runFrameworks, runBenchmarks, dir).then(_ => {
        console.log("successful run");
    }).catch(error => {
        console.log("run was not completely sucessful");
    })
}

