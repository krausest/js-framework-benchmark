import * as React from 'react';
import {Benchmark, BenchmarkType} from '../Common';
import {useDispatch, useSelector} from 'react-redux'
import { areAllBenchmarksSelected, isNoneBenchmarkSelected, selectBenchmark, selectAllBenchmarks, State } from '../reducer';
import DropDown from './DropDown'
import { DropDownContents } from './DropDownContents'

  const SelectBarBenchmarks = ({benchmarks, isSelected, select}: {
    benchmarks: Array<Benchmark>;
    isSelected: (benchmark: Benchmark) => boolean;
    select: (benchmark: Benchmark, add: boolean) => void;
  }) => {
        console.log("SelectBarBenchmarks");
        return (
        <div>
          {benchmarks.map(item =>
              <div key={item.id} className="col-md-12">
                  <div className="form-check">
                      <input id={'inp-'+item.id} className="form-check-input" type="checkbox" 
                        onChange={(evt) => select(item, evt.target.checked)}
                        checked={isSelected(item)} />
                      <label htmlFor={'inp-'+item.id} className="form-check-label">
                      {item.label}
                      </label>
                  </div>
              </div>
          )}
        </div>);
  };

const SelectBenchmarkCategory = ({ benchmarkType, label}:
    {   benchmarkType: BenchmarkType; 
        label: string;
    }) => {
        console.log("SelectBenchmarkCategory");

        const dispatch = useDispatch();
        const benchmarks = useSelector<State, Benchmark[]>((state) => state.benchmarkLists[benchmarkType]);
        const selectedBenchmarks = useSelector<State, Set<Benchmark>>((state) => state.selectedBenchmarks);
        const isNoneSelected = useSelector<State, boolean>((state) => isNoneBenchmarkSelected(state, benchmarkType));
        const areAllSelected = useSelector<State, boolean>((state) => areAllBenchmarksSelected(state, benchmarkType));
        
    return (<DropDownContents isNoneSelected={isNoneSelected} areAllSelected={areAllSelected} selectNone={() => dispatch(selectAllBenchmarks(benchmarkType, false))} selectAll={() => dispatch(selectAllBenchmarks(benchmarkType, true))}>
        <h3>{label}</h3>
        <div>
            <SelectBarBenchmarks isSelected={b => selectedBenchmarks.has(b)} select={(benchmark, add) => dispatch(selectBenchmark(benchmark, add))} benchmarks={benchmarks} />
        </div>
    </DropDownContents>);
}

const SelectBenchmarks = () => {
  console.log("SelectBenchmarks");

    return <DropDown label="Which benchmarks?" width='300px'>
        <SelectBenchmarkCategory benchmarkType={BenchmarkType.CPU}  label="Duration"/>
        <SelectBenchmarkCategory benchmarkType={BenchmarkType.STARTUP} label="Startup"/>
        <SelectBenchmarkCategory benchmarkType={BenchmarkType.MEM} label="Memory"/>
    </DropDown>
}

export default SelectBenchmarks;