import * as React from 'react';
import {Benchmark} from './Common';

interface Props {
  benchmarks: Array<Benchmark>;
  isSelected: (benchmark: Benchmark) => boolean;
  select: (benchmark: Benchmark, value: boolean) => void;
}

export const SelectBarBenchmarks = (props: Props) => {
    return (
      <div>
        {props.benchmarks.map(item => 
            <div key={item.id} className="col-md-12">
                <div className="checkbox">
                    <label>
                    <input type="checkbox" onChange={(evt) => props.select(item, evt.target.checked)} checked={props.isSelected(item)} />
                    {item.label}
                    </label>
                </div>
            </div>
        )}
      </div>);
};