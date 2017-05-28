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
          benchmarksMEM} = this.props;
        return (
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
          </div>
        );
    }
}
