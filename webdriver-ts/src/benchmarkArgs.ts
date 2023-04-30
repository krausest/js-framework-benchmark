import yargs from 'yargs';

// FIXME: Clean up args.
// What works: npm run bench keyed/react, npm run bench -- keyed/react, npm run bench -- keyed/react --count 1 --benchmark 01_
// What doesn't work (keyed/react becomes an element of argument benchmark): npm run bench -- --count 1 --benchmark 01_ keyed/react

export let args: any = yargs(process.argv)
  .usage(
    "$0 [--framework Framework1 Framework2 ...] [--benchmark Benchmark1 Benchmark2 ...] [--chromeBinary path] \n or: $0 [directory1] [directory2] .. [directory3]"
  )
  .help("help")
  .boolean("headless").default("headless", false)
  .boolean("smoketest")
  .boolean("nothrottling").default("nothrottling", false)
  .string("runner").default("runner","puppeteer")
  .string("browser").default("browser","chrome")
  .array("framework")
  .array("benchmark")
  .string("chromeBinary").argv;

console.log("args", args);