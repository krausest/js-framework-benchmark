import yargs from "yargs";
import { checkElementContainsText, checkElementExists, clickElement, startBrowser } from "./playwrightAccess.js";
import { config, FrameworkData, initializeFrameworks, BenchmarkOptions } from "./common.js";

let args: any = yargs(process.argv)
  .usage("$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...]")
  .help("help")
  .default("port", config.PORT)
  .string("chromeBinary")
  .string("chromeDriver")
  .boolean("headless")
  .array("framework").argv;

let allArgs = args._.length <= 2 ? [] : args._.slice(2, args._.length);

console.log("args.framework", args.framework, !args.framework);


async function runBench(frameworkNames: string[]) {
  let runFrameworks;
  let matchesDirectoryArg = (directoryName: string) => allArgs.length == 0 || allArgs.some((arg: string) => arg == directoryName);
  runFrameworks = await initializeFrameworks(matchesDirectoryArg);
  console.log("Frameworks that will be checked", runFrameworks.map((f) => f.fullNameWithKeyedAndVersion).join(" "));

  let frameworkMap = new Map<string, FrameworkData>();

  let allCorrect = true;

  let browser = await startBrowser(benchmarkOptions);
  let page = await browser.newPage();
  try {
    await page.goto(`http://${config.HOST}:${config.PORT}/startCSP`)
  } finally {
    await page.close();
    await browser.close();
  }

  console.log("*** headless", benchmarkOptions.headless)

  for (let i = 0; i < runFrameworks.length; i++) {
    let cspError = false;
    let browser = await startBrowser(benchmarkOptions);
    let page = await browser.newPage();
    try {
      let framework: FrameworkData = runFrameworks[i];

      await page.goto(`http://${config.HOST}:${config.PORT}/${framework.uri}/index.html`, {waitUntil: "networkidle"});
      try {
        await checkElementExists(page, "#add");
      } catch (err) {
        console.log(`CSP test failed for ${runFrameworks[i].fullNameWithKeyedAndVersion} - during load`);
      }
      await clickElement(page, "#add");
      try {
        await checkElementContainsText(page, "tbody>tr:nth-of-type(1000)>td:nth-of-type(1)", "1000");
      } catch (err) {
        console.log(`CSP test failed for ${runFrameworks[i].fullNameWithKeyedAndVersion} - when clicking`);
      }
    } catch (e) {
      //console.log("ERROR running " + runFrameworks[i].fullNameWithKeyedAndVersion, e);
      allCorrect = false;
    } finally {
      try {
        await page.close();
        await browser.close();
      } catch (e) {
        console.log("error calling driver.quit - ignoring this exception");
      }
    }
  }
  
  browser = await startBrowser(benchmarkOptions);
  page = await browser.newPage();
  try {    
    await page.goto(`http://${config.HOST}:${config.PORT}/csp`)
    const extractedText = await page.$eval('*', (el:any) => el.innerText);    
    console.log(extractedText);
    let failed = JSON.parse(extractedText)
    console.log("CSP check failed for the following frameworks:\n", failed.join("\n"));
  } finally {
    await page.close();
    await browser.close();
  }
  
  if (!allCorrect) process.exit(1);
  
}

config.PORT = Number(args.port);

if (process.env.HOST) {
  config.HOST = process.env.HOST;
  console.log(`INFO: Using host ${config.HOST} instead of localhost`);
}

let runFrameworks = (args.framework && args.framework.length > 0 ? args.framework : [""]).map((v: string) => v.toString());

let benchmarkOptions: BenchmarkOptions = {
  HOST: config.HOST,
  port: config.PORT.toFixed(),
  browser: config.BROWSER,
  remoteDebuggingPort: config.REMOTE_DEBUGGING_PORT,
  chromePort: config.CHROME_PORT,
  headless: args.headless,
  chromeBinaryPath: args.chromeBinary,
  numIterationsForCPUBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_CPU,
  numIterationsForMemBenchmarks: config.NUM_ITERATIONS_FOR_BENCHMARK_MEM,
  numIterationsForStartupBenchmark: config.NUM_ITERATIONS_FOR_BENCHMARK_STARTUP,
  batchSize: 1,
};
async function main() {
  if (args.help) {
    // yargs.showHelp();
  } else {
    await runBench(runFrameworks);
  }
}

main().catch(err => {console.log("Error in isKeyed", err)});
