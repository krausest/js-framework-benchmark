import { readFile } from "node:fs/promises";
import * as fs from "node:fs";
import * as R from "ramda";
import {
  BenchmarkType,
  CPUBenchmarkInfo,
  CPUBenchmarkResult,
} from "./benchmarksCommon.js";
import { BenchmarkOptions, FrameworkData, TConfig, config } from "./common.js";
import { writeResults } from "./writeResults.js";

const { LOG_DEBUG, LOG_DETAILS } = config;

interface Timingresult {
  type: string;
  ts: number;
  dur?: number;
  end?: number;
  mem?: number;
  pid: number;
  evt?: any;
}

export function extractRelevantEvents(entries: any[]) {
  const filteredEvents: Timingresult[] = [];
  let click_start = 0;
  let click_end = 0;

  entries.forEach((x) => {
    const e = x;
    if (LOG_DEBUG) console.log(JSON.stringify(e));
    if (e.name === "EventDispatch") {
      if (e.args.data.type === "click") {
        if (LOG_DETAILS) console.log("CLICK ", +e.ts);
        click_start = +e.ts;
        click_end = +e.ts + e.dur;
        filteredEvents.push({
          type: "click",
          ts: +e.ts,
          dur: +e.dur,
          end: +e.ts + e.dur,
          pid: e.pid,
          evt: JSON.stringify(e),
        });
      }
    } else if (e.name === "Layout" && e.ph === "X") {
      if (LOG_DETAILS)
        console.log("Layout", +e.ts, +e.ts + e.dur - click_start);
      filteredEvents.push({
        type: "layout",
        ts: +e.ts,
        dur: +e.dur,
        end: +e.ts + e.dur,
        pid: e.pid,
        evt: JSON.stringify(e),
      });
    } else if (e.name === "FunctionCall" && e.ph === "X") {
      if (LOG_DETAILS)
        console.log("FunctionCall", +e.ts, +e.ts + e.dur - click_start);
      filteredEvents.push({
        type: "functioncall",
        ts: +e.ts,
        dur: +e.dur,
        end: +e.ts + e.dur,
        pid: e.pid,
        evt: JSON.stringify(e),
      });
    } else if (e.name === "HitTest" && e.ph === "X") {
      if (LOG_DETAILS)
        console.log("HitTest", +e.ts, +e.ts + e.dur - click_start);
      filteredEvents.push({
        type: "hittest",
        ts: +e.ts,
        dur: +e.dur,
        end: +e.ts + e.dur,
        pid: e.pid,
        evt: JSON.stringify(e),
      });
    } else if (e.name === "Commit" && e.ph === "X") {
      if (LOG_DETAILS)
        console.log("COMMIT PAINT", +e.ts, +e.ts + e.dur - click_start);
      filteredEvents.push({
        type: "commit",
        ts: +e.ts,
        dur: +e.dur,
        end: +e.ts + e.dur,
        pid: e.pid,
        evt: JSON.stringify(e),
      });
    } else if (e.name === "Paint" && e.ph === "X") {
      if (LOG_DETAILS) console.log("PAINT", +e.ts, +e.ts + e.dur - click_start);
      filteredEvents.push({
        type: "paint",
        ts: +e.ts,
        dur: +e.dur,
        end: +e.ts + e.dur,
        pid: e.pid,
        evt: JSON.stringify(e),
      });
    } else if (e.name === "FireAnimationFrame" && e.ph === "X") {
      if (LOG_DETAILS)
        console.log("FireAnimationFrame", +e.ts, +e.ts - click_start);
      filteredEvents.push({
        type: "fireAnimationFrame",
        ts: +e.ts,
        dur: +e.dur,
        end: +e.ts + e.dur,
        pid: e.pid,
        evt: JSON.stringify(e),
      });
    } else if (e.name === "TimerFire" && e.ph === "X") {
      if (LOG_DETAILS)
        console.log("TimerFire", +e.ts, +e.ts - click_start, +e.ts - click_end);
      filteredEvents.push({
        type: "timerFire",
        ts: +e.ts,
        dur: 0,
        end: +e.ts,
        pid: e.pid,
        evt: JSON.stringify(e),
      });
    } else if (e.name === "RequestAnimationFrame") {
      if (LOG_DETAILS)
        console.log(
          "RequestAnimationFrame",
          +e.ts,
          +e.ts - click_start,
          +e.ts - click_end,
        );
      filteredEvents.push({
        type: "requestAnimationFrame",
        ts: +e.ts,
        dur: 0,
        end: +e.ts,
        pid: e.pid,
        evt: JSON.stringify(e),
      });
    }
  });
  return filteredEvents;
}

async function fetchEventsFromPerformanceLog(
  fileName: string,
): Promise<Timingresult[]> {
  let timingResults: Timingresult[] = [];
  const entries = [];
  do {
    const contents = await readFile(fileName, { encoding: "utf8" });
    const json = JSON.parse(contents);
    const entries = json["traceEvents"];
    const filteredEvents = extractRelevantEvents(entries);
    timingResults = timingResults.concat(filteredEvents);
  } while (entries.length > 0);
  return timingResults;
}

const traceJSEventNames = [
  "EventDispatch",
  "EvaluateScript",
  "v8.evaluateModule",
  "FunctionCall",
  "TimerFire",
  "FireIdleCallback",
  "FireAnimationFrame",
  "RunMicrotasks",
  "V8.Execute",
];

export function extractRelevantJSEvents(config: TConfig, entries: any[]) {
  const filteredEvents: any[] = [];

  entries.forEach((x) => {
    const e = x;
    if (LOG_DEBUG) console.log(JSON.stringify(e));
    if (e.name === "EventDispatch") {
      if (e.args.data.type === "click") {
        if (LOG_DETAILS) console.log("CLICK ", +e.ts);
        filteredEvents.push({
          type: "click",
          ts: +e.ts,
          dur: +e.dur,
          end: +e.ts + e.dur,
        });
      }
    } else if (traceJSEventNames.includes(e.name) && e.ph === "X") {
      filteredEvents.push({
        type: e.name,
        ts: +e.ts,
        dur: +e.dur,
        end: +e.ts + e.dur,
        orig: JSON.stringify(e),
      });
    }
  });
  return filteredEvents;
}

async function fetchJSEventsFromPerformanceLog(
  config: TConfig,
  fileName: string,
): Promise<Timingresult[]> {
  let timingResults: Timingresult[] = [];
  const entries = [];
  do {
    const contents = await readFile(fileName, { encoding: "utf8" });
    const json = JSON.parse(contents);
    const entries = json["traceEvents"];
    const filteredEvents = extractRelevantJSEvents(config, entries);
    timingResults = timingResults.concat(filteredEvents);
  } while (entries.length > 0);
  return timingResults;
}

function type_eq(...requiredTypes: string[]) {
  return (e: Timingresult) => requiredTypes.includes(e.type);
}
export interface CPUDurationResult {
  tsStart: number;
  tsEnd: number;
  duration: number;
  droppedNonMainProcessCommitEvents: boolean;
  droppedNonMainProcessOtherEvents: boolean;
  maxDeltaBetweenCommits: number;
  numberCommits: number;
  layouts: number;
  raf_long_delay: number;
}

function logEvents(events: Timingresult[], click: Timingresult) {
  events.forEach((e) => {
    console.log(
      "event",
      e.type,
      `${e.ts - click.ts} - ${e.end - click.ts}`,
      e.evt,
    );
  });
}

export async function computeResultsCPU(
  fileName: string,
  // warning_logger: (...msg: any) => void = console.log,
): Promise<CPUDurationResult> {
  const perfLogEvents = await fetchEventsFromPerformanceLog(fileName);
  const events = R.sortBy((e: Timingresult) => e.end)(perfLogEvents);

  // Find click event. This is the start of the benchmark
  const clicks = R.filter(type_eq("click"))(events);
  // Invariant: There must be exactly one click event
  if (clicks.length !== 1) {
    console.log("exactly one click event is expected", fileName, events);
    throw "exactly one click event is expected";
  }
  const click = clicks[0];
  // The PID for the click event. We're dropping all events from other processes.
  const pid = click.pid;
  const eventsDuringBenchmark = R.filter(
    (e: Timingresult) => e.ts > click.end || e.type === "click",
  )(events);
  if (LOG_DETAILS) logEvents(eventsDuringBenchmark, click);

  let droppedNonMainProcessCommitEvents = false;
  let droppedNonMainProcessOtherEvents = false;
  const eventsOnMainThreadDuringBenchmark = R.filter(
    (e: Timingresult) => e.pid === pid,
  )(eventsDuringBenchmark);
  if (
    eventsOnMainThreadDuringBenchmark.length !== eventsDuringBenchmark.length
  ) {
    const droppedEvents = R.filter((e: Timingresult) => e.pid !== pid)(events);
    if (R.any((e: Timingresult) => e.type === "commit")(droppedEvents)) {
      console.log(
        "INFO: Dropping commit events from other processes",
        fileName,
      );
      logEvents(droppedEvents, click);
      droppedNonMainProcessCommitEvents = true;
    }
    if (R.any((e: Timingresult) => e.type !== "commit")(droppedEvents)) {
      console.log(
        "INFO: Dropping non-commit events from other processes",
        fileName,
      );
      logEvents(droppedEvents, click);
      droppedNonMainProcessOtherEvents = true;
    }
  }

  const startFrom = R.filter(
    type_eq(
      "click",
      "fireAnimationFrame",
      "timerFire",
      "layout",
      "functioncall",
    ),
  )(eventsOnMainThreadDuringBenchmark);
  // we're looking for the commit after this event
  const startFromEvent = startFrom[startFrom.length - 1];
  if (LOG_DETAILS)
    console.log(
      "DEBUG: searching for commit event after",
      startFromEvent,
      "for",
      fileName,
    );
  let commit = R.find((e: Timingresult) => e.ts > startFromEvent.end)(
    R.filter(type_eq("commit"))(eventsOnMainThreadDuringBenchmark),
  );
  const allCommitsAfterClick = R.filter(type_eq("commit"))(
    eventsOnMainThreadDuringBenchmark,
  );

  const numberCommits = allCommitsAfterClick.length;
  if (!commit) {
    console.log("INFO: No commit event found according to filter ", fileName);
    if (allCommitsAfterClick.length === 0) {
      console.log("ERROR: No commit event found for ", fileName);
      throw "No commit event found for " + fileName;
    }

    commit = allCommitsAfterClick[allCommitsAfterClick.length - 1];
  }
  const maxDeltaBetweenCommits =
    (allCommitsAfterClick[allCommitsAfterClick.length - 1].ts -
      allCommitsAfterClick[0].ts) /
    1000.0;

  let duration = (commit.end - clicks[0].ts) / 1000.0;
  if (LOG_DEBUG) {
    console.log("duration", duration);
  }

  const layouts = R.filter(type_eq("layout"))(
    eventsOnMainThreadDuringBenchmark,
  );
  // Adjust bogus delay for requestAnimationFrame
  const rafs_withinClick = R.filter(
    (e: Timingresult) => e.ts >= click.ts && e.ts <= click.end,
  )(R.filter(type_eq("requestAnimationFrame"))(events));
  const fafs = R.filter(
    (e: Timingresult) => e.ts >= click.ts && e.ts < commit.ts,
  )(R.filter(type_eq("fireAnimationFrame"))(events));

  let raf_long_delay = 0;
  if (rafs_withinClick.length > 0 && fafs.length > 0) {
    const waitDelay = (fafs[0].ts - click.end) / 1000.0;
    if (rafs_withinClick.length === 1 && fafs.length === 1) {
      if (waitDelay > 16) {
        let ignored = false;
        for (const e of layouts) {
          if (e.ts < fafs[0].ts) {
            console.log(
              "IGNORING 1 raf, 1 faf, but layout before raf",
              waitDelay,
              fileName,
            );
            ignored = true;
            break;
          }
        }
        if (!ignored) {
          raf_long_delay = waitDelay - 16;
          duration = duration - raf_long_delay;
          console.log(
            "FOUND delay for 1 raf, 1 faf, but layout before raf",
            waitDelay,
            fileName,
          );
        }
      } else {
        console.log(
          "IGNORING delay < 16 msecs 1 raf, 1 faf ",
          waitDelay,
          fileName,
        );
      }
    } else if (fafs.length === 1) {
      throw (
        "Unexpected situation. Did not happen in the past. One fire animation frame, but non consistent request animation frames in " +
        fileName
      );
    } else {
      console.log(
        `IGNORING Bad case ${rafs_withinClick.length} raf, ${fafs.length} faf ${fileName}`,
      );
    }
  }

  // Some checks
  //   if (layouts.length > 1) {
  //     console.log("ERROR: more than one layout event found",fileName);
  //     logEvents(eventsOnMainThreadDuringBenchmark, click);
  //     throw "exactly one layout event is expected";
  //   } else if (layoutEventMustBePresent && layouts.length == 0) {
  //     console.log("ERROR: exactly one layout event is expected, but there was none",fileName);
  //     logEvents(eventsOnMainThreadDuringBenchmark, click);
  //     throw "one layout event is expected";
  //   } else if (!layoutEventMustBePresent && layouts.length == 0) {
  //     // no layout event, so we use the click event as the start of the measurement
  //     onlyUsePaintEventsAfterLayout = click;
  //   } else {
  //     // only one layout event, so use this one
  //     onlyUsePaintEventsAfterLayout = layouts[0];
  // }

  return {
    tsStart: click.ts,
    tsEnd: commit.end,
    duration,
    layouts: layouts.length,
    raf_long_delay,
    droppedNonMainProcessCommitEvents,
    droppedNonMainProcessOtherEvents,
    maxDeltaBetweenCommits,
    numberCommits,
  };
}

function putIfAbsent<K, V>(map: Map<K, V>, key: K, default_value: V) {
  if (map.get(key) === undefined) {
    map.set(key, default_value);
  }
}
export class PlausibilityCheck {
  maxDeltaBetweenCommits = new Map<string, number>();
  raf_long_delays = new Map<string, number>();
  unnecessaryLayouts = new Set<string>();

  check(
    result: CPUDurationResult,
    trace: string,
    framework: FrameworkData,
    benchmarkInfo: CPUBenchmarkInfo,
  ) {
    if (!benchmarkInfo.layoutEventRequired && result.layouts > 0) {
      this.unnecessaryLayouts.add(framework.fullNameWithKeyedAndVersion);
    }
    putIfAbsent(
      this.maxDeltaBetweenCommits,
      framework.fullNameWithKeyedAndVersion,
      0,
    );
    let val = this.maxDeltaBetweenCommits.get(
      framework.fullNameWithKeyedAndVersion,
    );
    this.maxDeltaBetweenCommits.set(
      framework.fullNameWithKeyedAndVersion,
      Math.max(val, result.maxDeltaBetweenCommits),
    );

    putIfAbsent(this.raf_long_delays, framework.fullNameWithKeyedAndVersion, 0);
    val = this.raf_long_delays.get(framework.fullNameWithKeyedAndVersion);
    this.raf_long_delays.set(
      framework.fullNameWithKeyedAndVersion,
      Math.max(val, result.raf_long_delay),
    );
  }

  print() {
    console.log("\n==== Results of PlausibilityCheck:");
    if (this.maxDeltaBetweenCommits.size > 0) {
      console.log(
        "Info: The following implementation had a unnecessary layout event for select row:",
      );
      for (const [impl, maxDelay] of this.maxDeltaBetweenCommits.entries()) {
        if (maxDelay > 0) console.log(` ${impl}: ${maxDelay}`);
      }
      console.log(
        "  Interpretation: Just an information. Could be optimized, but not a bug in the implementation.",
      );
    }
    if (this.raf_long_delays.size > 0) {
      console.log(
        "Info: Some frameworks have a delay between raf and fire animation frame longer than 16 msecs. The correction was:",
      );
      for (const [impl, maxDelay] of this.raf_long_delays.entries()) {
        if (maxDelay > 0) console.log(` ${impl}: ${maxDelay}`);
      }
      console.log(
        "  Interpretation: If the list contains more than just a few entries or large numbers the results should be checked",
      );
    }
    if (this.maxDeltaBetweenCommits.size > 0) {
      console.log(
        "Info: Implemenations with multiple commit events and max delay between both:",
      );
      for (const [impl, maxDelay] of this.maxDeltaBetweenCommits.entries()) {
        if (maxDelay > 0) console.log(` ${impl}: ${maxDelay}`);
      }
      console.log(
        "  Interpretation: Those frameworks make measuring the duration of the benchmark difficult. The results should be checked occasionally for correctness.",
      );
    }
  }
}

interface Interval {
  start: number;
  end: number;
  timingResult: Timingresult;
}

export async function computeResultsJS(
  cpuTrace: CPUDurationResult,
  config: TConfig,
  fileName: string,
): Promise<number> {
  const totalDuration = cpuTrace;

  const perfLogEvents = await fetchJSEventsFromPerformanceLog(config, fileName);

  const eventsWithin = R.filter<Timingresult>(
    (e) => e.ts >= totalDuration.tsStart && e.ts <= totalDuration.tsEnd,
  )(perfLogEvents);

  for (const ev of eventsWithin) {
    ev.ts -= totalDuration.tsStart;
    ev.end -= totalDuration.tsStart;
  }

  function isContained(testIv: Interval, otherIv: Interval) {
    return testIv.start >= otherIv.start && testIv.end <= otherIv.end;
  }
  function newContainedInterval(
    outer: Timingresult,
    intervals: Array<Interval>,
  ) {
    const outerIv = { start: outer.ts, end: outer.end, timingResult: outer };
    const cleanedUp: Array<Interval> = [];
    const isContainedRes = intervals.some((iv) => isContained(outerIv, iv));
    if (!isContainedRes) {
      cleanedUp.push(outerIv);
    }
    for (const iv of intervals) {
      if (iv.start < outer.ts || iv.end > outer.end) {
        cleanedUp.push(iv);
      }
    }
    return cleanedUp;
  }

  let intervals: Array<Interval> = [];
  for (const ev of eventsWithin) {
    intervals = newContainedInterval(ev, intervals);
  }
  if (intervals.length > 1) {
    console.log(
      `*** More than 1 interval ${intervals.length} for ${fileName}`,
      intervals,
    );
  } else {
    console.log(`1 interval for ${fileName}`, intervals);
  }

  const res = intervals.reduce((p, c) => p + (c.end - c.start), 0) / 1000.0;
  return res;
}

export async function parseCPUTrace(
  benchmarkOptions: BenchmarkOptions,
  framework: FrameworkData,
  benchmarkInfo: CPUBenchmarkInfo,
  plausibilityCheck: PlausibilityCheck,
) {
  let results: CPUBenchmarkResult[] = [];
  for (let i = 0; i < benchmarkOptions.numIterationsForCPUBenchmarks; i++) {
    const trace = `${fileNameTrace(
      framework,
      benchmarkInfo,
      i,
      benchmarkOptions,
    )}`;
    if (!fs.existsSync(trace)) {
      throw new Error(`Trace file ${trace} does not exist`);
    }
    console.log("analyzing trace ", trace);
    try {
      const result = await computeResultsCPU(trace);
      plausibilityCheck.check(result, trace, framework, benchmarkInfo);
      // let resultJS = await computeResultsJS(result, config, trace);
      results.push({ total: result.duration, script: 0 });
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
  results.sort(
    (a: CPUBenchmarkResult, b: CPUBenchmarkResult) => a.total - b.total,
  );
  results = results.slice(0, config.NUM_ITERATIONS_FOR_BENCHMARK_CPU);
  writeResults(benchmarkOptions.resultsDirectory, {
    framework: framework,
    benchmark: benchmarkInfo,
    results: results,
    type: BenchmarkType.CPU,
  });
}

export function fileNameTrace(
  framework: FrameworkData,
  benchmark: CPUBenchmarkInfo,
  run: number,
  benchmarkOptions: BenchmarkOptions,
) {
  return `${benchmarkOptions.tracesDirectory}/${framework.fullNameWithKeyedAndVersion}_${benchmark.id}_${run}.json`;
}
