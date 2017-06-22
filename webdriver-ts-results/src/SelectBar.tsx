import * as React from 'react';
import './App.css';
import {DropDown} from './DropDown'
import {DropDownContents} from './DropDownContents'
import {Framework, Benchmark, DropdownCallback} from './Common';
import {SelectBarFrameworks} from './SelectBarFrameworks';
import {SelectBarBenchmarks} from './SelectBarBenchmarks';

export interface Props {
  frameworkSelectKeyed: DropdownCallback<Framework>;
  frameworkSelectNonKeyed: DropdownCallback<Framework>;
  benchSelectCpu: DropdownCallback<Benchmark>;
  benchSelectMem: DropdownCallback<Benchmark>;
  selectFramework: (framework: Framework, value: boolean) => void;
  selectBenchmark: (benchmark: Benchmark, value: boolean) => void;
  selectSeparateKeyedAndNonKeyed: (value: boolean) => void;
  separateKeyedAndNonKeyed: boolean;
  frameworksKeyed: Array<Framework>;
  frameworksNonKeyed: Array<Framework>;
  benchmarksCPU: Array<Benchmark>;
  benchmarksMEM: Array<Benchmark>;
  compareWith: Framework | undefined;
  selectComparison: (framework: string) => void;
  useMedian: boolean;
  selectMedian: (value: boolean) => void;
  countSamples: number,
  selectSampleCount: (value: number) => void;
}

export class SelectBar extends React.Component<Props, void> {
    render() {
    let   {frameworkSelectKeyed,
          frameworkSelectNonKeyed,
          benchSelectCpu,
          benchSelectMem,
          selectFramework,
          selectBenchmark,
          selectSeparateKeyedAndNonKeyed,
          separateKeyedAndNonKeyed,
          frameworksKeyed,
          frameworksNonKeyed,
          benchmarksCPU,
          benchmarksMEM,
          compareWith,
          selectComparison,
          useMedian,
          selectMedian,
          countSamples,
          selectSampleCount,
      } = this.props;
        return (
          <div>
            <div className="form-inline">
              (Just as an experiment)
              <div className="hspan"/>
                <div className="checkbox" style={{display:"inline-block"}}>
                    <label>
                      <input type="checkbox" onChange={(evt) => selectMedian(evt.target.checked)} checked={useMedian} />
                      <div className="hspan"/>
                      Use median instead of mean
                    </label>
                </div>
                <div className="hspan"/>
                <div style={{display:"inline-block"}}>
                    <div className="form-group">
                      Simulate # samples
                      <div className="hspan"/>
                      <input id="countSample" className="form-control" type="range" min="3" max="25" value={countSamples} onChange={(evt) => selectSampleCount(Number(evt.target.value))}/>
                      <div className="hspan"/>
                      {countSamples}
                    </div>
                </div>

            </div>
            <div>
              <DropDown label="Which frameworks?" width='1024px'>
                <DropDownContents {...frameworkSelectKeyed}>
                  <h3>Keyed frameworks:</h3>
                  <div>
                    <SelectBarFrameworks isSelected={frameworkSelectKeyed.isSelected} select={selectFramework} frameworks={frameworksKeyed} />
                  </div>
                </DropDownContents>
                <DropDownContents {...frameworkSelectNonKeyed}>
                  <h3>Non-keyed frameworks:</h3>
                  <div>
                    <SelectBarFrameworks isSelected={frameworkSelectNonKeyed.isSelected} select={selectFramework} frameworks={frameworksNonKeyed}/>
                  </div>
                </DropDownContents>
              </DropDown>
              <div className="hspan"/>
              <DropDown label="Which benchmarks?" width='300px'>
                <DropDownContents {...benchSelectCpu}>
                  <h3>Time:</h3>
                  <div>
                    <SelectBarBenchmarks isSelected={benchSelectCpu.isSelected} select={selectBenchmark} benchmarks={benchmarksCPU} />
                  </div>
                </DropDownContents>
                <DropDownContents {...benchSelectMem}>
                  <h3>Memory:</h3>
                  <div>
                    <SelectBarBenchmarks isSelected={benchSelectMem.isSelected} select={selectBenchmark} benchmarks={benchmarksMEM} />
                  </div>
                </DropDownContents>
              </DropDown>
              <div className="hspan"/>
              <div className="checkbox" style={{display:"inline-block"}}>
                  <label>
                    <input type="checkbox" onChange={(evt) => selectSeparateKeyedAndNonKeyed(evt.target.checked)} checked={separateKeyedAndNonKeyed} />
                    Separate keyed and non-keyed
                  </label>
              </div>
              <div className="hspan"/>
              <form className="form-inline" style={{display:"inline-block"}}>
                <div className="form-group">
                    <div className="hspan"/>
                    <select className="form-control" value={compareWith ? compareWith.name : ''} onChange={(evt) => selectComparison(evt.target.value)}>
                      <option value=''>Compare with ...</option>                        
                      <optgroup label="Keyed">
                        {
                          frameworksKeyed.map(f => 
                              <option key={f.name} value={f.name}>{f.name}</option>                        
                          )
                        }
                      </optgroup>
                      <optgroup label="Non-keyed">
                        {
                          frameworksNonKeyed.map(f => 
                              <option key={f.name} value={f.name}>{f.name}</option>                        
                          )
                        }
                      </optgroup>
                    </select>
                </div>
              </form>
            </div>
          </div>
        );
    }
}
