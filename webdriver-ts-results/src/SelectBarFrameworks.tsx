import * as React from 'react';
import {Framework} from './Common';

interface Props {
  frameworks: Array<Framework>;
  isSelected: (framework: Framework) => boolean;
  select: (framework: Framework, value: boolean) => void;
}

export const SelectBarFrameworks = (props: Props) => {
    return (
      <div>
        {props.frameworks.map(item => 
            <div key={item.name} className="col-md-3">
                <div className="checkbox">
                    <label>
                      <input 
                          type="checkbox" 
                          onChange={(evt) => props.select(item, evt.target.checked)} 
                          checked={props.isSelected(item)} 
                      />
                      {item.name}
                    </label>
                </div>
            </div>
        )}
      </div>);
};