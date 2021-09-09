import React from 'react'
import {ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN_MEM, BenchmarkType} from '../Common'; 
import ValueResultRow from './ValueResultRow'
import GeomMeanRow from './GeomMeanRow'

const MemResultsTable = ({data, currentSortKey, sortBy}: {data: ResultTableData; currentSortKey: string; sortBy: (name: string) => void}) => {
  const resultsMEM = data.getResult(BenchmarkType.MEM);
  return (resultsMEM.results.length===0 ? null :
        (<div>
          <h3>Memory allocation in MBs ± 95% confidence interval</h3>
          <p>Please note that currently issue <a href="https://github.com/krausest/js-framework-benchmark/issues/916">#916</a> causes wrong values for some frameworks. 
          </p>
          <table className='results'>
            <thead>
              <tr>
                <th className='benchname'><button className={currentSortKey===SORT_BY_NAME ? 'sortKey textButton' : 'textButton'} onClick={(event) => {event.preventDefault(); sortBy(SORT_BY_NAME)}}>Name</button></th>
                {data.frameworks.map(f => <th key={f.displayname}>{f.displayname}</th>)}
              </tr>
            </thead>
            <tbody>
                {resultsMEM.results.map((resultsForBenchmark, benchIdx) =>
                  <ValueResultRow key={resultsMEM.benchmarks[benchIdx]?.id} benchIdx={benchIdx} resultsForBenchmark={resultsForBenchmark} benchmarks={resultsMEM.benchmarks} currentSortKey={currentSortKey} sortBy={sortBy}/>
                )}
                <GeomMeanRow currentSortKey={currentSortKey} sortBy={sortBy} geomMean={resultsMEM.geomMean} sortbyGeommeanEnum={SORT_BY_GEOMMEAN_MEM}/>
            </tbody>
          </table>
        </div>));
};

export default MemResultsTable