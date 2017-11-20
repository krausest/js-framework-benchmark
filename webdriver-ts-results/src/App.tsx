import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import {benchmarks, frameworks, results} from './results';
import {Framework, Benchmark, BenchmarkType, convertToMap, ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN} from './Common';
import {SelectBar} from './SelectBar';
import {ResultTable} from './ResultTable';
require('babel-polyfill')

import "bootstrap/dist/css/bootstrap.css";

interface State {
  benchmarks: Array<Benchmark>;
  benchmarksCPU: Array<Benchmark>;
  benchmarksMEM: Array<Benchmark>;
  frameworks: Array<Framework>;
  frameworksKeyed: Array<Framework>;
  frameworksNonKeyed: Array<Framework>;
  selectedBenchmarks: Set<Benchmark>;
  selectedFrameworks: Set<Framework>;
  separateKeyedAndNonKeyed: boolean;
  resultTables: Array<ResultTableData>;
  sortKey: string;
  compareWith: Framework | undefined;
  useMedian: boolean;
}

let allBenchmarks = () => benchmarks.reduce((set, b) => set.add(b), new Set() );
let allFrameworks = () => frameworks.reduce((set, f) => set.add(f), new Set() );

let _allBenchmarks = allBenchmarks();
let _allFrameworks = allFrameworks();

let resultLookup = convertToMap(results);

class App extends React.Component<{}, State> {
    benchSelect = (memBenchmarks: boolean) => ({
      selectAll: (event: React.SyntheticEvent<any>) => {    
        event.preventDefault();
        let set = this.state.selectedBenchmarks;
        benchmarks.forEach(b => {if ((b.type === BenchmarkType.MEM) === memBenchmarks) set.add(b);});
        this.nextState.selectedBenchmarks = set;
        this.setState({selectedBenchmarks: set, resultTables: this.updateResultTable()});
      },
      selectNone: (event: React.SyntheticEvent<any>) => {    
        event.preventDefault();
        let set = this.state.selectedBenchmarks;
        benchmarks.forEach(b => {if ((b.type === BenchmarkType.MEM) === memBenchmarks) set.delete(b);});
        this.nextState.selectedBenchmarks = set;
        this.nextState.sortKey = SORT_BY_NAME;
        this.setState({selectedBenchmarks: set, sortKey: SORT_BY_NAME, resultTables: this.updateResultTable()});
      },
      areAllSelected: () => benchmarks.filter(b => memBenchmarks ? b.type === BenchmarkType.MEM : b.type !== BenchmarkType.MEM)
                              .every(b => this.state.selectedBenchmarks.has(b)),
      isNoneSelected: () => benchmarks.filter(b => memBenchmarks ? b.type === BenchmarkType.MEM : b.type !== BenchmarkType.MEM)
                              .every(b => !this.state.selectedBenchmarks.has(b)),
      isSelected: (benchmark: Benchmark) => this.state.selectedBenchmarks.has(benchmark)
  })
  frameworkSelect = (keyed: boolean) => ({
      selectAll: (event: React.SyntheticEvent<any>) => {    
        event.preventDefault();
        let set = this.state.selectedFrameworks;
        frameworks.forEach(framework => {if (framework.keyed === keyed && !set.has(framework)) set.add(framework);});
        this.nextState.selectedFrameworks = set;
        this.setState({selectedFrameworks: set, resultTables: this.updateResultTable()});
      },
      selectNone: (event: React.SyntheticEvent<any>) => {    
        event.preventDefault();
        let set = this.state.selectedFrameworks;
        set.forEach(framework => {if (framework.keyed === keyed) set.delete(framework);});
        this.nextState.selectedFrameworks = set;
        this.setState({selectedFrameworks: set, resultTables: this.updateResultTable()});
      },
      areAllSelected: () => frameworks.filter(f => f.keyed===keyed).every(f => this.state.selectedFrameworks.has(f)),
      isNoneSelected: () => frameworks.filter(f => f.keyed===keyed).every(f => !this.state.selectedFrameworks.has(f)),
      isSelected: (framework: Framework) => this.state.selectedFrameworks.has(framework)
  });
  benchSelectCpu = this.benchSelect(false);
  benchSelectMem = this.benchSelect(true);
  frameworkSelectKeyed = this.frameworkSelect(true);
  frameworkSelectNonKeyed = this.frameworkSelect(false);
  nextState: State;

  constructor(props: object) {
    super(props);
    this.nextState = {benchmarks, 
                  benchmarksCPU: benchmarks.filter(b => b.type !== BenchmarkType.MEM),
                  benchmarksMEM: benchmarks.filter(b => b.type === BenchmarkType.MEM),
                  frameworks,
                  frameworksKeyed: frameworks.filter(f => f.keyed === true),
                  frameworksNonKeyed: frameworks.filter(f => f.keyed === false),
                  selectedBenchmarks: _allBenchmarks,
                  selectedFrameworks: _allFrameworks,
                  separateKeyedAndNonKeyed: true,
                  resultTables: [],
                  sortKey: SORT_BY_GEOMMEAN,
                  compareWith: undefined,
                  useMedian: false,
                };
    this.nextState.resultTables = this.updateResultTable();
    this.state = this.nextState;
  }
  selectBenchmark = (benchmark: Benchmark, value: boolean) => {
    let set = new Set();
    this.state.selectedBenchmarks.forEach(benchmark => set.add(benchmark));
    if (set.has(benchmark)) set.delete(benchmark);
    else set.add(benchmark);
    let sortKey = this.state.sortKey;
    let setIds = new Set();
    set.forEach(b => setIds.add(b.id))
    if ((sortKey!=SORT_BY_NAME && sortKey!=SORT_BY_GEOMMEAN) && !setIds.has(sortKey)) sortKey = SORT_BY_NAME;
    this.nextState.selectedBenchmarks = set;
    this.setState({selectedBenchmarks: set, sortKey, resultTables: this.updateResultTable()});
  }
  selectFramework = (framework: Framework, value: boolean): void => {
    let set = new Set();
    this.state.selectedFrameworks.forEach(framework => set.add(framework));
    if (set.has(framework)) set.delete(framework);
    else set.add(framework);
    this.nextState.selectedFrameworks = set;
    this.setState({selectedFrameworks: set, resultTables: this.updateResultTable()});
  }  
  selectSeparateKeyedAndNonKeyed = (value: boolean): void => {
    this.nextState.separateKeyedAndNonKeyed = value;
    this.setState({separateKeyedAndNonKeyed: value, resultTables: this.updateResultTable()});
  }
  selectMedian = (value: boolean): void => {
    this.nextState.useMedian = value;
    this.setState({useMedian: value, resultTables: this.updateResultTable()});
  }
  updateResultTable() {
    if (this.nextState.separateKeyedAndNonKeyed) {
      return [new ResultTableData(frameworks, benchmarks, resultLookup, this.nextState.selectedFrameworks, this.nextState.selectedBenchmarks, false, this.nextState.sortKey, this.nextState.compareWith, this.nextState.useMedian),
              new ResultTableData(frameworks, benchmarks, resultLookup, this.nextState.selectedFrameworks, this.nextState.selectedBenchmarks, true, this.nextState.sortKey, this.nextState.compareWith, this.nextState.useMedian)]      
    } else {
      return [new ResultTableData(frameworks, benchmarks, resultLookup, this.nextState.selectedFrameworks, this.nextState.selectedBenchmarks, undefined, this.nextState.sortKey, this.nextState.compareWith, this.nextState.useMedian)]
    }
  }
  selectComparison = (framework: string): void => {
    let compareWith: Framework | undefined = undefined;
    compareWith = this.state.frameworksKeyed.find((f) => f.name === framework);
    if (!compareWith) {
      compareWith = this.state.frameworksNonKeyed.find((f) => f.name === framework);
    }
    this.nextState.compareWith = compareWith;
    this.setState({compareWith:compareWith, resultTables: this.updateResultTable()});
  }

  sortBy = (sortkey: string, tableIdx: number): void => {
    this.state.resultTables[tableIdx].sortBy(sortkey);
    this.nextState.sortKey = sortkey;
    this.setState({sortKey:sortkey, resultTables: this.updateResultTable()});
  }
  render() {
    let disclaimer = (false) ? (<div>
          <h2>Results for js web frameworks benchmark – round 7</h2>
          <p>Go here for the accompanying article <a href="http://www.stefankrause.net/wp/?p=454">http://www.stefankrause.net/wp/?p=454</a>. Source code can be found in the github <a href="https://github.com/krausest/js-framework-benchmark">repository</a>.</p>	
        </div>) :
        (<p>Warning: These results are preliminary - use with caution (they may e.g. be from different browser versions).Official results are published on my <a href="http://www.stefankrause.net/">blog</a>.</p>);

    return (
      <div>   
        {disclaimer}
        <p>The benchmark was run on a MacBook Pro 15 (2,5 GHz i7, 16 GB RAM, OSX 10.13.1, Chrome 62.0.3202.94 (64-bit))</p>        
        <SelectBar  benchmarksCPU={this.state.benchmarksCPU} 
                    benchmarksMEM={this.state.benchmarksMEM} 
                    frameworksKeyed={this.state.frameworksKeyed} 
                    frameworksNonKeyed={this.state.frameworksNonKeyed} 
                    frameworkSelectKeyed={this.frameworkSelectKeyed}
                    frameworkSelectNonKeyed={this.frameworkSelectNonKeyed}
                    benchSelectCpu={this.benchSelectCpu}
                    benchSelectMem={this.benchSelectMem}
                    selectBenchmark={this.selectBenchmark}
                    selectFramework={this.selectFramework}
                    selectSeparateKeyedAndNonKeyed={this.selectSeparateKeyedAndNonKeyed}
                    separateKeyedAndNonKeyed={this.state.separateKeyedAndNonKeyed}
                    compareWith={this.state.compareWith}
                    selectComparison={this.selectComparison}
                    useMedian={this.state.useMedian}
                    selectMedian={this.selectMedian}
                    />
          {!this.state.compareWith ? null :           
          (<p style={{marginTop:'10px'}}>In comparison mode white cells mean there's no statistically significant difference. 
            Green cells are significantly faster than the comparison and red cells are slower. 
            The test is performed as a one sided t-test. The significance level is 10%. The darker the color the lower the p-Value.</p>
          )}
          <ResultTable currentSortKey={this.state.sortKey} data={this.state.resultTables} separateKeyedAndNonKeyed={this.state.separateKeyedAndNonKeyed} sortBy={this.sortBy}/>
      </div>
    );
  }
}

export default App;

ReactDOM.render(
  <App />,
  document.getElementById('main') as HTMLElement
);