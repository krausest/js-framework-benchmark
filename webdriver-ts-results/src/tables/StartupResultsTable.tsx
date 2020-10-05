import React from 'react'
import {ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN_STARTUP, BenchmarkType} from '../Common'; 
import ValueResultRow from './ValueResultRow'
import GeomMeanRow from './GeomMeanRow'

const StartupResultsTable = ({data, currentSortKey, sortBy} : {data: ResultTableData, currentSortKey: string, sortBy: (name:string) => void}) => {
  let resultsStartup = data.getResult(BenchmarkType.STARTUP);
    return resultsStartup.results.length===0 ? null :
          (<div>
            <h3>Startup metrics (lighthouse with mobile simulation)</h3>
            <table className='results'>
              <thead>
                <tr>
                  <th className='benchname'><button className={currentSortKey===SORT_BY_NAME ? 'sortKey textButton' : 'textButton'} onClick={(event) => {event.preventDefault(); sortBy(SORT_BY_NAME)}}>Name</button></th>
                  {data.frameworks.map(f => <th key={f.name}>{f.name}</th>)}
                </tr>
              </thead>
              <tbody>
              {resultsStartup.results.map((resultsForBenchmark, benchIdx) =>
                  <ValueResultRow key={resultsStartup.benchmarks[benchIdx]?.id}  benchIdx={benchIdx} resultsForBenchmark={resultsForBenchmark} benchmarks={resultsStartup.benchmarks} currentSortKey={currentSortKey} sortBy={sortBy}/>
                )}
              <GeomMeanRow currentSortKey={currentSortKey} sortBy={sortBy} geomMean={resultsStartup.geomMean} sortbyGeommeanEnum={SORT_BY_GEOMMEAN_STARTUP}/>
              </tbody>
            </table>
          </div>);
  };

  export default StartupResultsTable;