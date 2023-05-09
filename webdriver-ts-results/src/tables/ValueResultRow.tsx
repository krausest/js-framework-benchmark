import React from 'react'
import {TableResultValueEntry, Benchmark} from '../Common'; 
import ValueCell from './ValueCell'; 

interface Props {
    benchIdx: number;
    resultsForBenchmark: Array<TableResultValueEntry|null>;
    benchmarks: Array<Benchmark>;
    currentSortKey: string;
    sortBy: (name: string) => void;
}
const ValueResultRow = ({benchIdx, resultsForBenchmark, benchmarks, currentSortKey, sortBy}: Props ): JSX.Element => {
    const sort = (sortValue: string) => (event: React.SyntheticEvent) => {
        event.preventDefault();
        sortBy(sortValue)
    }
    return <tr>
        <th className='benchname'><button className={currentSortKey === benchmarks[benchIdx].id ? 'sortKey textButton' : 'textButton'} onClick={sort(benchmarks[benchIdx].id)}>{benchmarks[benchIdx].label}</button>
          <div className="rowCount">{benchmarks[benchIdx].description}</div>
        </th>
        {resultsForBenchmark && resultsForBenchmark.map((result,idx) => result == null ? <td key={idx}></td> : 
            <ValueCell {...result} key={result.key}/>)}
    </tr>
};

export default ValueResultRow;