import * as React from 'react';
import {ResultTableData, DisplayMode, BenchmarkType, FrameworkType, CpuDurationMode} from './Common';
import CpuResultsTable from './tables/CpuResultsTable'
import MemResultsTable from './tables/MemResultsTable'
import StartupResultsTable from './tables/StartupResultsTable'
import { useDispatch, useSelector } from 'react-redux';
import { sort, State } from './reducer';
const BoxPlotTable = React.lazy(() => import(/* webpackChunkName: "BoxPlotTable" */ './tables/BoxPlotTable'));

interface Props {
  type: FrameworkType;
}

const ResultTable = ({type}: Props): JSX.Element|null => {
  const texts = {
    [FrameworkType.KEYED]: 
      {label: 'Keyed results', 
      description: 'Keyed implementations create an association between the domain data and a dom element by assigning a \'key\'. If data changes the dom element with that key will be updated. In consequence inserting or deleting an element in the data array causes a corresponding change to the dom.'}, 
    [FrameworkType.NON_KEYED]:  
      {label: 'Non keyed results', 
        description: 'Non keyed implementations are allowed to reuse existing dom elements. In consequence inserting or deleting an element in the data array might append after or delete the last table row and update the contents of all elements after the inserting or deletion index. This can perform better, but can cause problems if dom state is modified externally.'}
      };
  const dispatch = useDispatch()
  const data = useSelector<State, ResultTableData|undefined>((state) => state.resultTables[type]);
  const currentSortKey = useSelector<State, string>((state) => state.sortKey);
  const displayMode = useSelector<State, DisplayMode>((state) => state.displayMode);
  const cpuDurationMode = useSelector<State, CpuDurationMode>((state) => state.cpuDurationMode);
  const sortBy = (sortKey: string) => dispatch(sort(sortKey))

  if (data === undefined || data.frameworks.length===0 || (data.getResult(BenchmarkType.CPU).benchmarks.length===0 && data.getResult(BenchmarkType.STARTUP).benchmarks.length===0 && data.getResult(BenchmarkType.MEM).benchmarks.length===0)) return null;

    return (
    <div className="mt-3">
        <div key={texts[type].label}>
          <h1>{texts[type].label}</h1>
          <p>{texts[type].description}</p>
          {cpuDurationMode==CpuDurationMode.Script && <h3>Warning: This is an experimental view. Don't rely on those values yet.</h3>}
            {
        displayMode === DisplayMode.BoxPlot ?
                (
            <React.Suspense fallback={<div>Loading...</div>}>
              <BoxPlotTable results={data.results} frameworks={data.frameworks} benchmarks={data.getResult(BenchmarkType.CPU).benchmarks} currentSortKey={currentSortKey} sortBy={sortBy} cpuDurationMode={cpuDurationMode}/>
            </React.Suspense>
                )
        :
            (<>
            <CpuResultsTable currentSortKey={currentSortKey} sortBy={sortBy} data={data}/>
            <StartupResultsTable currentSortKey={currentSortKey} sortBy={sortBy} data={data}/>
            <MemResultsTable currentSortKey={currentSortKey} sortBy={sortBy} data={data}/>
            </>)}
          </div>
    </div>)
  };

export default ResultTable;