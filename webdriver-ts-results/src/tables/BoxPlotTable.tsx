import React from 'react'
import {SORT_BY_NAME, Benchmark, Framework, ResultLookup} from '../Common'; 
let Plotly = require('plotly.js-cartesian-dist');

interface IBoxPlotData {
    framework: string;
    values: number[];
}

class BoxPlot extends React.Component<{traces: IBoxPlotData[]}, {}>
{
    private elemRef: React.RefObject<HTMLDivElement>;
    constructor(props: any) {
        super(props);
        this.elemRef = React.createRef();
        this.repaint = this.repaint.bind(this);
    }
    repaint() {
        let traces = this.props.traces.map(t => ({
            type: 'box',
            y: t.values,
            boxpoints: false,
            jitter: 0.5,
            name: t.framework,
            boxmean: 'sd'
        }));

        let layout = {
            showlegend: false,
            margin: {
                l: 40,
                r: 0,
                b: 120,
                t: 0,
                pad: 0
              },
        };
        Plotly.newPlot(this.elemRef.current, traces, layout, {staticPlot: true, editable: false});
    }
    componentDidMount() {
        this.repaint();
    }
    componentDidUpdate() {
        this.repaint();
    }
    render() {
        return <div ref={this.elemRef} style={{height: '100%', width: '100%'}}></div>
    }
}

const RenderBoxPlotsRows = ({frameworks, benchmarks, results, currentSortKey, sortBy}
    : {frameworks: Array<Framework>, benchmarks: Array<Benchmark>, results: ResultLookup, currentSortKey: string, sortBy: (name:string) => void}) => {
    return <>{benchmarks.map((benchmark) =>
    (<tr key={benchmark.id} style={{height: 400}}>
        <th className='benchname'><button className={currentSortKey===benchmark.id ? 'sortKey textButton' : 'textButton'}
        onClick={(event) => {event.preventDefault(); sortBy(benchmark.id)}}>{benchmark.label}</button>
          <div className="rowCount">{benchmark.description}</div>
        </th>
        <td>
            <BoxPlot traces={frameworks.map(f => ({framework: f.name, values: results(benchmark, f) ? results(benchmark, f)!.values : [] })) as IBoxPlotData[]}/>
        </td>
    </tr>))}</>
}
// {data.frameworks.map(f => <th key={f.name}>{f.name}</th>)}

const BoxPlotTable = ({frameworks, benchmarks, results, currentSortKey, sortBy} :
    {frameworks: Array<Framework>, benchmarks: Array<Benchmark>, results: ResultLookup, currentSortKey: string, sortBy: (name:string) => void}) => {
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