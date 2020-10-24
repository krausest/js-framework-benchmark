import React from 'react'
import {ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN_CPU, BenchmarkType} from '../Common'; 
import GeomMeanRow from './GeomMeanRow'
import CompareRow from './CompareRow'
import ValueResultRow from './ValueResultRow'

const CpuResultsTable = ({data, currentSortKey, sortBy}: {data: ResultTableData; currentSortKey: string; sortBy: (name: string) => void}) => {
  const resultsCPU = data.getResult(BenchmarkType.CPU);
    return resultsCPU.results.length===0 ? null :
          (<div>
            <h3>Duration in milliseconds ± 95% confidence interval (Slowdown = Duration / Fastest)</h3>
            <table className='results'>
              <thead>
                <tr>
                  <th className='benchname'><button className={currentSortKey===SORT_BY_NAME ? 'sortKey textButton' : 'textButton'} onClick={(event) => {event.preventDefault(); sortBy(SORT_BY_NAME)}}>Name</button><br/>Duration for...</th>
                  {data.frameworks.map((f,idx) => <th key={idx}>{f.displayname}</th>)}
                </tr>
              </thead>
              <thead>
                <tr>
                    <th>Implementationn notes</th>
                    {data.frameworks.map(f => 
                      <th key={f.name} >
                      {
                        f.issues && f.issues.map(i => <React.Fragment key={i.toFixed()}><a href={'#'+i.toFixed()}>{i.toFixed()}</a><span> </span></React.Fragment> )
                      }
                      </th>)}
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
