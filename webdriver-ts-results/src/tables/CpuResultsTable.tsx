import React from 'react'
import {ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN_CPU, DisplayMode, BenchmarkType, Framework, findIssue} from '../Common'; 
import GeomMeanRow from './GeomMeanRow'
import CompareRow from './CompareRow'
import ValueResultRow from './ValueResultRow'

function issueStyle(framework: Framework) {
  let minSeverity: number = framework.issues.reduce((min, i) => Math.min(min, findIssue(i)?.severity ?? Number.POSITIVE_INFINITY), Number.POSITIVE_INFINITY)
  switch (minSeverity) {
    case 0:
    case 1:
      return 'error';
    case 2:
      return 'warning';
    default:
      return '';
  }
}

const CpuResultsTable = ({data, currentSortKey, sortBy, displayMode} : {data: ResultTableData, currentSortKey: string, sortBy: (name:string) => void, displayMode: DisplayMode}) => {
    let resultsCPU = data.getResult(BenchmarkType.CPU);
    return resultsCPU.results.length===0 ? null :
          (<div>
            <h3>Duration in milliseconds ± 95% confidence interval (Slowdown = Duration / Fastest)</h3>
            <table className='results'>
              <thead>
                <tr>
                  <th className='benchname'><button className={currentSortKey===SORT_BY_NAME ? 'sortKey textButton' : 'textButton'} onClick={(event) => {event.preventDefault(); sortBy(SORT_BY_NAME)}}>Name</button><br/>Duration for...</th>
                  {data.frameworks.map(f => <th key={f.displayname}>{f.displayname}</th>)}
                </tr>
              </thead>
              <thead>
                <tr>
                    <th className='openIssues'><b>Issues</b> Errors are red, cheats are yellow</th>
                    {data.frameworks.map(f => <th className={issueStyle(f)} key={f.name}>{
                      f.issues && f.issues.map(i => <><a key={i.toFixed()} href={'#'+i.toFixed()}>{i.toFixed()}</a><span> </span></> )
                    }</th>)}
                </tr>
              </thead>
              <tbody>
                {resultsCPU.results.map((resultsForBenchmark, benchIdx) =>
                  <ValueResultRow key={resultsCPU.benchmarks[benchIdx]?.id} benchIdx={benchIdx} resultsForBenchmark={resultsForBenchmark} benchmarks={resultsCPU.benchmarks} currentSortKey={currentSortKey} sortBy={sortBy}/>
                )}
                  <GeomMeanRow currentSortKey={currentSortKey} sortBy={sortBy} geomMean={resultsCPU.geomMean} sortbyGeommeanEnum={SORT_BY_GEOMMEAN_CPU}/>
                  <CompareRow comparison={resultsCPU.comparison} compareWith={data.compareWith}/>
              </tbody>
            </table>
          </div>);
  };

export default CpuResultsTable;
