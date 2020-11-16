import React, { useEffect, useRef } from 'react'
import {SORT_BY_NAME, Benchmark, Framework, ResultLookup} from '../Common'; 
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Plotly = require('plotly.js-cartesian-dist');

interface BoxPlotData {
    framework: string;
    values: number[];
}

const BoxPlot = ({traces}: {traces: Array<BoxPlotData>}) => 
{
    const elemRef = useRef(null);
    useEffect(() => {
        const plotlTtraces = traces.map(t => ({
            type: 'box',
            y: t.values,
            boxpoints: false,
            jitter: 0.5,
            name: t.framework,
            boxmean: 'sd'
        }));

        const layout = {
            showlegend: false,
            margin: {
                l: 40,
                r: 0,
                b: 120,
                t: 0,
                pad: 0
              },
        };
        Plotly.newPlot(elemRef.current, plotlTtraces, layout, {staticPlot: true, editable: false});
      }, [traces])
      return <div ref={elemRef} style={{height: '100%', width: '100%'}}></div>
}

const RenderBoxPlotsRows = ({frameworks, benchmarks, results, currentSortKey, sortBy}: {frameworks: Array<Framework>; benchmarks: Array<Benchmark>; results: ResultLookup; currentSortKey: string; sortBy: (name: string) => void}) => {
    return <>{benchmarks.map((benchmark) =>
    (<tr key={benchmark.id} style={{height: 400}}>
        <th className='benchname'><button className={currentSortKey===benchmark.id ? 'sortKey textButton' : 'textButton'}
        onClick={(event) => {event.preventDefault(); sortBy(benchmark.id)}}>{benchmark.label}</button>
          <div className="rowCount">{benchmark.description}</div>
        </th>
        <td>
            <BoxPlot traces={frameworks.map(f => ({framework: f.name, values: results(benchmark, f)?.values ?? [] })) as BoxPlotData[]}/>
        </td>
    </tr>))}</>
}
// {data.frameworks.map(f => <th key={f.name}>{f.name}</th>)}

const BoxPlotTable = ({frameworks, benchmarks, results, currentSortKey, sortBy}:
    {frameworks: Array<Framework>; benchmarks: Array<Benchmark>; results: ResultLookup; currentSortKey: string; sortBy: (name: string) => void}) => {
    return benchmarks.length===0 ? null :
        (<div>
          <h3>Duration in milliseconds</h3>
          <table className='results'>
            <thead>
              <tr>
                <th className='benchname'><button className={currentSortKey===SORT_BY_NAME ? 'sortKey textButton' : 'textButton'} onClick={(event) => {event.preventDefault(); sortBy(SORT_BY_NAME)}}>Name</button></th>
                 <th style={{width: frameworks.length*70+100}}></th>
              </tr>
            </thead>
            <tbody>
                <RenderBoxPlotsRows results={results} frameworks={frameworks} benchmarks={benchmarks} currentSortKey={currentSortKey} sortBy={sortBy}/>
            </tbody>
          </table>
        </div>);
};

export default BoxPlotTable;