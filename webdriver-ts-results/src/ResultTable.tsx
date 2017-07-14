import './App.css';
import * as React from 'react';
import {ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN} from './Common';

export interface Props {
  separateKeyedAndNonKeyed: boolean;
  data: Array<ResultTableData>;
  sortBy: (name:string, tableIdx: number) => void;
  currentSortKey: string;
}

const CpuResultsTable = ({data, currentSortKey, sortBy} : {data: ResultTableData, currentSortKey: string, sortBy: (name:string) => void}) => {
  return data.resultsCPU.length==0 ? null :
        (<div>
          <h3>Duration in milliseconds ± standard deviation (Slowdown = Duration / Fastest)</h3>
          <table className='results'>
            <thead>
              <tr>
                <th className='benchname'><a href='#' className={currentSortKey==SORT_BY_NAME ? 'sortKey' : ''} onClick={(event) => {event.preventDefault(); sortBy(SORT_BY_NAME)}}>Name</a></th>
                {data.frameworks.map(f => <th key={f.name}>{f.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.resultsCPU.map((resultsForBenchmark, benchIdx) => 
                (<tr key={data.benchmarksCPU[benchIdx].id}>
                    <th className='benchname'><a href='#' className={currentSortKey==data.benchmarksCPU[benchIdx].id ? 'sortKey' : ''} onClick={(event) => {event.preventDefault(); sortBy(data.benchmarksCPU[benchIdx].id)}}>{data.benchmarksCPU[benchIdx].label}</a>
                      <div className="rowCount">{data.benchmarksCPU[benchIdx].description}</div>
                    </th>
                    {resultsForBenchmark.map(result => result == null ? <td></td> : result.render())}
                </tr>
              ))}                      
              <tr>
                <th><a href='#' className={currentSortKey==SORT_BY_GEOMMEAN ? 'sortKey' : ''} onClick={(event) => {event.preventDefault(); sortBy(SORT_BY_GEOMMEAN)}}>slowdown geometric mean</a></th>
                {data.geomMeanCPU.map(result => result == null ? <td></td> : result.render())}
              </tr>                      
            </tbody>
          </table>
        </div>);
};

const MemResultsTable = ({data, currentSortKey, sortBy} : {data: ResultTableData, currentSortKey: string, sortBy: (name:string) => void}) => {
  return data.resultsMEM.length==0 ? null :
        (<div>
          <h3>Memory allocation in MBs ± standard deviation</h3>
          <table className='results'>
            <thead>
              <tr>
                <th className='benchname'><a href='#' className={currentSortKey==SORT_BY_NAME ? 'sortKey' : ''} onClick={(event) => {event.preventDefault(); sortBy(SORT_BY_NAME)}}>Name</a></th>
                {data.frameworks.map(f => <th key={f.name}>{f.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.resultsMEM.map((resultsForBenchmark, benchIdx) => 
                (<tr key={data.benchmarksMEM[benchIdx].id}>
                    <th className='benchname'><a href='#' className={currentSortKey==data.benchmarksMEM[benchIdx].id ? 'sortKey' : ''} onClick={(event) => {event.preventDefault(); sortBy(data.benchmarksMEM[benchIdx].id)}}>{data.benchmarksMEM[benchIdx].label}</a>
                      <div className="rowCount">{data.benchmarksMEM[benchIdx].description}</div>
                    </th>
                    {resultsForBenchmark.map(result => result == null ? <td></td> : result.render())}
                </tr>
              ))}                      
            </tbody>
          </table>
        </div>);                
};

interface Texts {
  nonKeyed: boolean|undefined;
  label: string;
  description: string;
}

export class ResultTable extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }
  render() {
      let texts : Array<Texts> = this.props.separateKeyedAndNonKeyed ? 
                [{nonKeyed: false, label: 'Keyed results', description: 'Keyed implementations create an association between the domain data and a dom element by assigning a \'key\'. If data changes the dom element with that key will be updated. In consequence inserting or deleting an element in the data array causes a corresponding change to the dom.'}, {nonKeyed: true, label: 'Non keyed results', description: 'Non keyed implementations are allowed to reuse existing dom elements. In consequence inserting or deleting an element in the data array might append after or delete the last table row and update the contents of all elements after the inserting or deletion index. This can perform better, but can cause problems if dom state is modified externally.'}] 
                : [{nonKeyed: undefined, label: 'Mixed keyed and non-keyed', description: 'This is an apple to oranges comparison. Use it to find out how much a non-keyed version can be faster (if that doesn\'t introduce any problems e.g. with transitions).'}];
      return (
        <div>
          { this.props.data.map((data, idx) => {
            return ( data.frameworks.length===0 || data.benchmarksCPU.length==0 && data.benchmarksMEM.length==0 ? null : 
              <div key={texts[idx].label}>
                <h1>{texts[idx].label}</h1>
                <p>{texts[idx].description}</p>
                <CpuResultsTable currentSortKey={this.props.currentSortKey} sortBy={(sortKey) => this.props.sortBy(sortKey, idx)} data={data}/>
                <MemResultsTable currentSortKey={this.props.currentSortKey} sortBy={(sortKey) => this.props.sortBy(sortKey, idx)} data={data}/>
              </div>
            )})}
        </div>
      );
    }
}