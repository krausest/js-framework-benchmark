import yargs from "yargs";
import { checkElementContainsText, checkElementExists, clickElement, startBrowser } from "./playwrightAccess.js";
import { config, FrameworkData, initializeFrameworks, BenchmarkOptions } from "./common.js";

let args: any = yargs(process.argv)
  .usage(
    "$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--chromeBinary path] \n or: $0 [directory1] [directory2] .. [directory3]"
  )
  .help("help")
  .boolean("headless")
  .default("headless", false)
  .array("framework")
  .array("benchmark")
  .string("chromeBinary").argv;

console.log("args", args);

console.log("HEADLESS***", args.headless);

let benchmarkOptions: BenchmarkOptions = {
  port: 8080,
  host: "localhost",
  browser: args.browser,
  remoteDebuggingPort: 9999,
  chromePort: 9998,
  headless: args.headless,
  chromeBinaryPath: args.chromeBinary,
  numIterationsForCPUBenchmarks:
    config.NUM_ITERATIONS_FOR_BENCHMARK_CPU + config.NUM_ITERATIONS_FOR_BENCHMARK_CPU_DROP_SLOWEST_COUNT,
  numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
  numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
  numIterationsForSizeBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_SIZE,
  batchSize: 1,
  resultsDirectory: "results",
  tracesDirectory: "traces",
  allowThrottling: !args.nothrottling,
};

let allArgs = args._.length <= 2 ? [] : args._.slice(2);

console.log("args.framework", args.framework, !args.framework);

async function runBench(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  frameworkNames: string[] // Not used in the function, but is used when calling the function in other files
) {
  let runFrameworks;
  let matchesDirectoryArg = (directoryName: string) =>
    allArgs.length === 0 || allArgs.some((arg: string) => arg == directoryName);
  runFrameworks = await initializeFrameworks(benchmarkOptions, matchesDirectoryArg);
  console.log("Frameworks that will be checked", runFrameworks.map((f) => f.fullNameWithKeyedAndVersion).join(" "));

  let allCorrect = true;

  console.log("*** headless", benchmarkOptions.headless);

  let browser = await startBrowser(benchmarkOptions);
  let page = await browser.newPage();
  try {
    for (let i = 0; i < runFrameworks.length; i++) {
      let cspCheckSucessful = true;
      let framework: FrameworkData = runFrameworks[i];
      let frameworkPath = (framework.keyed ? "keyed" : "non-keyed") + "/" + framework.name
      console.log(`checking ${frameworkPath}`);
      await page.goto(`http://${benchmarkOptions.host}:${benchmarkOptions.port}/csp/enable`);

      await page.goto(`http://${benchmarkOptions.host}:${benchmarkOptions.port}/${framework.uri}/index.html`, {
        waitUntil: "networkidle",
      });
      try {
        await checkElementExists(page, "#add");
      } catch (error) {
        cspCheckSucessful = false;
        console.log(`CSP test failed for ${runFrameworks[i].fullNameWithKeyedAndVersion} - during load`);
      }
      if (cspCheckSucessful) {
        try {
          await clickElement(page, "#add");
          await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "1000");
        } catch (error) {
          cspCheckSucessful = false;
          console.log(`CSP test failed for ${runFrameworks[i].fullNameWithKeyedAndVersion} - when clicking`);
        }
      }
      await page.goto(`http://${benchmarkOptions.host}:${benchmarkOptions.port}/csp`);
      const extractedText = await page.$eval("*", (el: any) => el.innerText);
      let failed: string[] = JSON.parse(extractedText);
      if (failed.includes(frameworkPath)) {
        cspCheckSucessful = false;
        console.log(`CSP test failed for ${runFrameworks[i].fullNameWithKeyedAndVersion} - due to reporting`);
      }
      if (cspCheckSucessful == framework.issues.includes((1139))) {
        const hint = cspCheckSucessful ? "The flag 1139 should be removed" : "The flag 1139 should be added";
        console.log(`ERROR: CSP is incorrectly categorized for ${runFrameworks[i].fullNameWithKeyedAndVersion} . ${hint}`);
        cspCheckSucessful = false;
        allCorrect = false;
      }
    }
  } finally {
    await page.goto(`http://${benchmarkOptions.host}:${benchmarkOptions.port}/csp/disable`);
    await page.close();
    await browser.close();
  }

  if (!allCorrect) process.exit(1);
}

let runFrameworks = (args.framework && args.framework.length > 0 ? args.framework : [""]).map((v: string) =>
  v.toString()
);

async function main() {
  if (args.help) {
    // yargs.showHelp();
  } else {
    await runBench(runFrameworks);
  }
}

main().catch((error) => {
  console.log("Error in isKeyed", error);
});
