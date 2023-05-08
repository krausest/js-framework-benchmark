import { DurationMeasurementMode } from "./benchmarksCommon.js";
import { readFile } from 'fs/promises';
import * as R from 'ramda';
import { TConfig } from "./common.js";

interface Timingresult {
    type: string;
    ts: number;
    dur?: number;
    end?: number;
    mem?: number;
    evt?: any;
  }
  
  export function extractRelevantEvents(config: TConfig, entries: any[]) {
    let filteredEvents: Timingresult[] = [];
    let click_start = 0;
    let click_end = 0;
  
    entries.forEach(x => {
        let e = x;
        if (config.LOG_DEBUG) console.log(JSON.stringify(e));
        if (e.name==='EventDispatch') {
            if (e.args.data.type==="click") {
              if (config.LOG_DETAILS) console.log("CLICK ",+e.ts);
                click_start = +e.ts;
                click_end = +e.ts+e.dur;
                filteredEvents.push({type:'click', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur});
            }
        } else if (e.name==='CompositeLayers' && e.ph==="X") {
          if (config.LOG_DETAILS) console.log("CompositeLayers",+e.ts, +e.ts+e.dur-click_start);
            filteredEvents.push({type:'compositelayers', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        } else if (e.name==='Layout' && e.ph==="X") {
          if (config.LOG_DETAILS) console.log("Layout",+e.ts, +e.ts+e.dur-click_start);
            filteredEvents.push({type:'layout', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        } else if (e.name==='Paint' && e.ph==="X") {
          if (config.LOG_DETAILS) console.log("PAINT",+e.ts, +e.ts+e.dur-click_start);
            filteredEvents.push({type:'paint', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        } else if (e.name==='FireAnimationFrame' && e.ph==="X") {
          if (config.LOG_DETAILS) console.log("FireAnimationFrame",+e.ts, +e.ts-click_start);
            filteredEvents.push({type:'fireAnimationFrame', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        } else if (e.name==='UpdateLayoutTree' && e.ph==="X") {
          if (config.LOG_DETAILS) console.log("UpdateLayoutTree",+e.ts, +e.ts-click_start);
            filteredEvents.push({type:'updateLayoutTree', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, evt: JSON.stringify(e)});
        } else if (e.name==='RequestAnimationFrame') {
          if (config.LOG_DETAILS) console.log("RequestAnimationFrame",+e.ts, +e.ts-click_start, +e.ts-click_end);
            filteredEvents.push({type:'requestAnimationFrame', ts: +e.ts, dur: 0, end: +e.ts, evt: JSON.stringify(e)});
        }
    });
    return filteredEvents;
  }
  
  async function fetchEventsFromPerformanceLog(config: TConfig, fileName: string): Promise<Timingresult[]> {
    let timingResults : Timingresult[] = [];
    let entries = [];
    do {
        let contents = await readFile(fileName, {encoding: "utf8"});
        let json  = JSON.parse(contents)
        let entries = json['traceEvents'];
        const filteredEvents = extractRelevantEvents(config, entries);
        timingResults = timingResults.concat(filteredEvents);
    } while (entries.length > 0);
    return timingResults;
  }
  
  const traceJSEventNames = [
    'EventDispatch',
    'EvaluateScript',
    'v8.evaluateModule',
    'FunctionCall',
    'TimerFire',
    'FireIdleCallback',
    'FireAnimationFrame',
    'RunMicrotasks',
    'V8.Execute',
  ];

  export function extractRelevantJSEvents(config: TConfig, entries: any[]) {
    let filteredEvents: any[] = [];
    let click_start = 0;
    let click_end = 0;
  
    entries.forEach(x => {
        let e = x;
        if (config.LOG_DEBUG) console.log(JSON.stringify(e));
        if (e.name==='EventDispatch') {
          if (e.args.data.type==="click") {
            if (config.LOG_DETAILS) console.log("CLICK ",+e.ts);
              click_start = +e.ts;
              click_end = +e.ts+e.dur;
              filteredEvents.push({type:'click', ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur});
          }
        }
        else if (traceJSEventNames.includes(e.name) && e.ph==="X") {
            filteredEvents.push({type:e.name, ts: +e.ts, dur: +e.dur, end: +e.ts+e.dur, orig: JSON.stringify(e)});
        }
    });
    return filteredEvents;
  }
  
  async function fetchJSEventsFromPerformanceLog(config: TConfig, fileName: string): Promise<Timingresult[]> {
    let timingResults : Timingresult[] = [];
    let entries = [];
    do {
        let contents = await readFile(fileName, {encoding: "utf8"});
        let json  = JSON.parse(contents)
        let entries = json['traceEvents'];
        const filteredEvents = extractRelevantJSEvents(config, entries);
        timingResults = timingResults.concat(filteredEvents);
    } while (entries.length > 0);
    return timingResults;
  }
  
  function type_eq(requiredType: string) {
    return (e: Timingresult) => e.type=== requiredType;
  }
  
  // export async function computeResultsCPUNew(fileName: string, durationMeasurementMode: DurationMeasurementMode): Promise<number> {
  //   let contents = await readFile(fileName, {encoding: "utf8"});
  //   let traceObj  = JSON.parse(contents)        
  //   let entries = traceObj['traceEvents'];
  
  //   let clickEvents = entries.filter((e:any) => {
  //     return (e.name==='EventDispatch') && (e.args.data.type==="click") ;
  //   });
  //   console.log("# clickEvents", clickEvents.length);
  //   let click_ts = +clickEvents[0].ts;
  
  //   // let eventsBeforeClick = entries.filter((e:any) => {
  //   //   return (e.ts< click_ts &&
  //   //   !( (e.name=='CompositeLayers') 
  //   //     || (e.name==='RunTask') 
  //   //     || (e.name==='Layout') 
  //   //     || (e.name==='Paint') 
  //   //     || (e.name==='FireAnimationFrame') 
  //   //     || (e.name==='UpdateLayoutTree') 
  //   //     || (e.name==='RequestAnimationFrame') 
  //   //     || (e.name==='HitTest') 
  //   //     || (e.name==='ScheduleStyleRecalculation') 
  //   //     || (e.name==='EventDispatch') 
  //   //     || (e.name==='UpdateLayerTree') 
  //   //     || (e.name==='UpdateLayer') 
  //   //     || (e.name==='SetLayerTreeId') 
  //   //     || (e.name==='IntersectionObserverController::computeIntersections') 
  //   //     || (e.name==='FunctionCall') 
  //   //     || (e.name==='RasterTask') 
  //   //     || (e.name==='EventTiming') 
  //   //   ))
  //   //   });
  //   //   console.log("before", click_ts);
  //   //   console.log(eventsBeforeClick);
  
  //   let eventsAfterClick = entries.filter((e:any) => {
  //     return !(e.ts< click_ts &&
  //       ( (e.name=='CompositeLayers') 
  //       || (e.name==='RunTask') 
  //       || (e.name==='Layout') 
  //       || (e.name==='Paint') 
  //       || (e.name==='FireAnimationFrame') 
  //       || (e.name==='UpdateLayoutTree') 
  //       || (e.name==='RequestAnimationFrame') 
  //       || (e.name==='HitTest') 
  //       || (e.name==='ScheduleStyleRecalculation') 
  //       || (e.name==='EventDispatch') 
  //       || (e.name==='UpdateLayerTree') 
  //       || (e.name==='UpdateLayer') 
  //       || (e.name==='SetLayerTreeId') 
  //       || (e.name==='IntersectionObserverController::computeIntersections') 
  //       || (e.name==='FunctionCall') 
  //       || (e.name==='RasterTask') 
  //       || (e.name==='EventTiming') 
  //     ))
  //     });
  //   console.log("#events total", entries.length, "#events after click", eventsAfterClick.length);
  
  export interface CPUDurationResult {
    tsStart: number;
    tsEnd : number;
    duration : number;
  }
  
  //   const tasks = new Tracelib(eventsAfterClick)
  //   const summary = tasks.getSummary()
  //   console.log("painting", summary.painting, "rendering", summary.rendering, "scripting", summary.scripting)
  //   return summary.painting +summary.rendering + summary.scripting;
  // }
  export async function computeResultsCPU(config: TConfig, fileName: string, durationMeasurementMode: DurationMeasurementMode): Promise<CPUDurationResult> {
    const perfLogEvents = (await fetchEventsFromPerformanceLog(config, fileName));
    let eventsDuringBenchmark = R.sortBy((e: Timingresult) => e.end)(perfLogEvents);
  
    // console.log("eventsDuringBenchmark ", eventsDuringBenchmark);
  
    let clicks = R.filter(type_eq('click'))(eventsDuringBenchmark)
    if (clicks.length !== 1) {
        console.log("exactly one click event is expected", eventsDuringBenchmark);
        throw "exactly one click event is expected";
    }
    let click = clicks[0];
  
    let onlyUsePaintEventsAfter: Timingresult;
    let layouts = R.filter((e: Timingresult) => e.ts > click.end)(R.filter(type_eq('layout'))(eventsDuringBenchmark))
    if (durationMeasurementMode==DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT) {
      if (layouts.length > 1) {
        console.log("INFO: more than one layout event found");
        layouts.forEach(l => {
          console.log("layout event",l.end-click.ts);
        })
      } else if (layouts.length == 0) {
        console.log("ERROR: exactly one layout event is expected", eventsDuringBenchmark);
        throw "exactly one layouts event is expected";
      }
      onlyUsePaintEventsAfter = layouts[layouts.length-1];
    } else {
      onlyUsePaintEventsAfter = click;
    }
  
    let paints = R.filter((e: Timingresult) => e.ts > onlyUsePaintEventsAfter.end)(R.filter(type_eq('paint'))(eventsDuringBenchmark));
    if (paints.length == 0) {
      console.log("ERROR: No paint event found ",fileName);
      throw "No paint event found";
    } 
    let paint = paints[durationMeasurementMode==DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT ? 0 : paints.length-1];
    let duration = (paint.end - clicks[0].ts)/1000.0;
    if (paints.length > 1) {
      console.log("more than one paint event found ",fileName);
      paints.forEach(l => {
        console.log("paints event",(l.end-click.ts)/1000.0);
      })
      if (durationMeasurementMode==DurationMeasurementMode.FIRST_PAINT_AFTER_LAYOUT) {
          console.log("IGNORING more than one paint due to FIRST_PAINT_AFTER_LAYOUT", fileName, duration);
      }
    }
    console.log("duration", duration);
  
    // let updateLayoutTree = R.filter((e: Timingresult) => e.ts > click.end)(R.filter(type_eq('updateLayoutTree'))(eventsDuringBenchmark));
    // console.log("updateLayoutTree", updateLayoutTree.length, updateLayoutTree[0].end);
  
    let rafs_withinClick = R.filter((e: Timingresult) => e.ts >= click.ts && e.ts <= click.end)(R.filter(type_eq('requestAnimationFrame'))(eventsDuringBenchmark));
    let fafs =  R.filter((e: Timingresult) => e.ts >= click.ts && e.ts < paint.ts)(R.filter(type_eq('fireAnimationFrame'))(eventsDuringBenchmark));
  
    if (rafs_withinClick.length>0 && fafs.length>0) {
      let waitDelay = (fafs[0].ts - click.end) / 1000.0;
      if (rafs_withinClick.length==1 && fafs.length==1) {
        if (waitDelay > 16) {
          let ignored = false;
          for (let e of layouts) {
            if (e.ts<fafs[0].ts) {
              console.log("IGNORING 1 raf, 1 faf, but layout before raf", waitDelay, fileName);
              ignored = true;
              break;
            } 
          }
          if (!ignored) {
            duration = duration - (waitDelay - 16);
            console.log("FOUND delay for 1 raf, 1 faf, but layout before raf", waitDelay, fileName);
          }
        } else {
          console.log("IGNORING delay < 16 msecs 1 raf, 1 faf ", waitDelay, fileName);
        }
       } else if (fafs.length==1) {
         throw "Unexpected situation. Did not happen in the past. One fire animation frame, but non consistent request animation frames in "+fileName;
      } else {
        console.log(`IGNORING Bad case ${rafs_withinClick.length} raf, ${fafs.length} faf ${fileName}`);
      }    
    }
  
    return {tsStart:click.ts, tsEnd:paint.end,  duration};
  }
  

  export async function computeResultsJS(cpuTrace: CPUDurationResult, config: TConfig, fileName: string, durationMeasurementMode: DurationMeasurementMode): Promise<number> {
    const totalDuration = cpuTrace;

    const perfLogEvents = (await fetchJSEventsFromPerformanceLog(config, fileName));
  
    const eventsWithin = R.filter<Timingresult>(e => e.ts >= totalDuration.tsStart && e.ts <= totalDuration.tsEnd)(perfLogEvents);

    for (let ev of eventsWithin) {
      ev.ts -=  totalDuration.tsStart;
      ev.end -= totalDuration.tsStart;
    }
    interface Interval {
      start: number,
      end: number,
      timingResult: Timingresult
    }
    function isContained(testIv: Interval, otherIv: Interval) {
      return intervals.some(iv => testIv.start>=otherIv.start && testIv.end<=otherIv.end);
    }
    function newContainedInterval(outer: Timingresult, intervals: Array<Interval>) {
      let outerIv = {start: outer.ts, end: outer.end, timingResult: outer};
      let cleanedUp: Array<Interval> = []
      let isContainedRes = intervals.some(iv => isContained(outerIv, iv));
      if (!isContainedRes) { cleanedUp.push(outerIv) }
      for (let iv of intervals) {
        if (iv.start<outer.ts || iv.end>outer.end) {
          cleanedUp.push(iv);
        }
      }            
      return cleanedUp;
    }
    
    let intervals: Array<Interval> = [];
    for (let ev of eventsWithin) {
      intervals = newContainedInterval(ev, intervals);
    }
  
    return intervals.reduce((p,c) => p+(c.end-c.start), 0)/1000.0;
  }
  