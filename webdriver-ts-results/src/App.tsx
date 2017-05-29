import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import {benchmarks, frameworks, results} from './results';
import {Framework, Benchmark, BenchmarkType, convertToMap, ResultTableData, SORT_BY_NAME, SORT_BY_GEOMMEAN} from './Common';
import {SelectBar} from './SelectBar';
import {ResultTable} from './ResultTable';

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
        this.setState({selectedBenchmarks: set, resultTables: this.updateResultTable(set, this.state.selectedFrameworks, this.state.separateKeyedAndNonKeyed, this.state.sortKey)});
      },
      selectNone: (event: React.SyntheticEvent<any>) => {    
        event.preventDefault();
        let set = this.state.selectedBenchmarks;
        benchmarks.forEach(b => {if ((b.type === BenchmarkType.MEM) === memBenchmarks) set.delete(b);});
        this.setState({selectedBenchmarks: set, sortKey: SORT_BY_NAME, resultTables: this.updateResultTable(set, this.state.selectedFrameworks, this.state.separateKeyedAndNonKeyed, SORT_BY_NAME)});
      },
      areAllSelected: () => benchmarks.filter(b => memBenchmarks ? b.type === BenchmarkType.MEM : b.type !== BenchmarkType.MEM)
                              .every(b => this.state.selectedBenchmarks.has(b)),
      isNoneSelected: () => benchmarks.filter(b => memBenchmarks ? b.type === BenchmarkType.MEM : b.type !== BenchmarkType.MEM)
                              .every(b => !this.state.selectedBenchmarks.has(b)),
      isSelected: (benchmark: Benchmark) => this.state.selectedBenchmarks.has(benchmark)
  })
  frameworkSelect = (nonKeyed: boolean) => ({
      selectAll: (event: React.SyntheticEvent<any>) => {    
        event.preventDefault();
        let set = this.state.selectedFrameworks;
        frameworks.forEach(framework => {if (framework.nonKeyed === nonKeyed && !set.has(framework)) set.add(framework);});
        this.setState({selectedFrameworks: set, resultTables: this.updateResultTable(this.state.selectedBenchmarks, set, this.state.separateKeyedAndNonKeyed, this.state.sortKey)});
      },
      selectNone: (event: React.SyntheticEvent<any>) => {    
        event.preventDefault();
        let set = this.state.selectedFrameworks;
        set.forEach(framework => {if (framework.nonKeyed === nonKeyed) set.delete(framework);});
        this.setState({selectedFrameworks: set, resultTables: this.updateResultTable(this.state.selectedBenchmarks, set, this.state.separateKeyedAndNonKeyed, this.state.sortKey)});
      },
      areAllSelected: () => frameworks.filter(f => f.nonKeyed===nonKeyed).every(f => this.state.selectedFrameworks.has(f)),
      isNoneSelected: () => frameworks.filter(f => f.nonKeyed===nonKeyed).every(f => !this.state.selectedFrameworks.has(f)),
      isSelected: (framework: Framework) => this.state.selectedFrameworks.has(framework)
  });
  benchSelectCpu = this.benchSelect(false);
  benchSelectMem = this.benchSelect(true);
  frameworkSelectKeyed = this.frameworkSelect(false);
  frameworkSelectNonKeyed = this.frameworkSelect(true);

  constructor(props: object) {
    super(props);
    this.state = {benchmarks, 
                  benchmarksCPU: benchmarks.filter(b => b.type !== BenchmarkType.MEM),
                  benchmarksMEM: benchmarks.filter(b => b.type === BenchmarkType.MEM),
                  frameworks,
                  frameworksKeyed: frameworks.filter(f => f.nonKeyed === false),
                  frameworksNonKeyed: frameworks.filter(f => f.nonKeyed === true),
                  selectedBenchmarks: _allBenchmarks,
                  selectedFrameworks: _allFrameworks,
                  separateKeyedAndNonKeyed: true,
                  resultTables: this.updateResultTable(_allBenchmarks, _allFrameworks, true, SORT_BY_NAME),
                  sortKey: SORT_BY_NAME     
                };
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
    this.setState({selectedBenchmarks: set, sortKey, resultTables: this.updateResultTable(set, this.state.selectedFrameworks, this.state.separateKeyedAndNonKeyed, sortKey)});
  }
  selectFramework = (framework: Framework, value: boolean): void => {
    let set = new Set();
    this.state.selectedFrameworks.forEach(framework => set.add(framework));
    if (set.has(framework)) set.delete(framework);
    else set.add(framework);
    this.setState({selectedFrameworks: set, resultTables: this.updateResultTable(this.state.selectedBenchmarks, set, this.state.separateKeyedAndNonKeyed, this.state.sortKey)});
  }  
  selectSeparateKeyedAndNonKeyed = (value: boolean): void => {
    this.setState({separateKeyedAndNonKeyed: value, resultTables: this.updateResultTable(this.state.selectedBenchmarks, this.state.selectedFrameworks, value, this.state.sortKey)});
  }
  updateResultTable(selectedBenchmarks: Set<Benchmark>, selectedFrameworks: Set<Framework>, separateKeyedAndNonKeyed: boolean, sortKey: string) {
    if (separateKeyedAndNonKeyed) {
      return [new ResultTableData(frameworks, benchmarks, resultLookup, selectedFrameworks, selectedBenchmarks, false, sortKey),
              new ResultTableData(frameworks, benchmarks, resultLookup, selectedFrameworks, selectedBenchmarks, true, sortKey)]      
    } else {
      return [new ResultTableData(frameworks, benchmarks, resultLookup, selectedFrameworks, selectedBenchmarks, undefined, sortKey)]
    }
  }
  sortBy = (sortkey: string, tableIdx: number): void => {
    this.state.resultTables[tableIdx].sortBy(sortkey);
    this.setState({sortKey:sortkey, resultTables: this.updateResultTable(this.state.selectedBenchmarks, this.state.selectedFrameworks, this.state.separateKeyedAndNonKeyed, sortkey)});
  }
  render() {
    let disclaimer = (false) ? (<div>
          <h2>Results for js web frameworks benchmark – round 6</h2>
          <p>Go here for the accompanying article <a href="http://www.stefankrause.net/wp/?p=431">http://www.stefankrause.net/wp/?p=431</a>. Source code can be found in the github <a href="https://github.com/krausest/js-framework-benchmark">repository</a>.</p>	
        </div>) :
        (<p>Warning: These results are preliminary - use with caution (they may e.g. be from different browser versions).Official results are published on my <a href="http://www.stefankrause.net/">blog</a>.</p>);

    return (
      <div>   
        {disclaimer}
        <p>The benchmark was run on a MacBook Pro 15 (2,5 GHz i7, 16 GB RAM, OSX 10.12.5, Chrome 58.0.3029.110 (64-bit))</p>        
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
                    separateKeyedAndNonKeyed={this.state.separateKeyedAndNonKeyed}/>
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