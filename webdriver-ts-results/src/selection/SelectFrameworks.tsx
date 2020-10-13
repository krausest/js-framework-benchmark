import * as React from 'react';
import {Framework, FrameworkType} from '../Common';
import {useDispatch, useSelector} from 'react-redux'
import { areAllFrameworksSelected, isNoneFrameworkSelected, selectFramework, selectAllFrameworks, State } from '../reducer';
import DropDown from './DropDown'
import { DropDownContents } from './DropDownContents'

interface Props {
  frameworks: Array<Framework>;
  isSelected: (benchmark: Framework) => boolean;
  select: (benchmark: Framework, add: boolean) => void;
}

export const SelectBarFrameworks = ({frameworks, isSelected, select}: Props) => {
  console.log("SelectBarFrameworks")
  return (
      <>
        {frameworks.map(item =>
            <div key={item.name} className="col-3">
                <input className="form-check-input" id={'inp-'+item.name+'-'+item.type}
                    type="checkbox"
                    onChange={(evt) => select(item, evt.target.checked)}
                    checked={isSelected(item)}
                />
                <label htmlFor={'inp-'+item.name+'-'+item.type} className="form-check-label">
                    {item.name}
                </label>
            </div>
        )}
      </>);
};

const SelectFrameworks = () => {
  console.log("SelectFrameworks");
  let dispatch = useDispatch();
  let selectedFrameworks = useSelector<State, Set<Framework>>((state) => state.selectedFrameworksDropDown);
  let frameworksKeyed = useSelector<State, Framework[]>(state => state.frameworkLists[FrameworkType.KEYED]);
  let frameworksNonKeyed = useSelector<State, Framework[]>(state => state.frameworkLists[FrameworkType.NON_KEYED]);
  let isNoneKeyedSelected = useSelector<State, boolean>(state => isNoneFrameworkSelected(state, FrameworkType.KEYED));
  let areAllKeyedSelected = useSelector<State, boolean>(state => areAllFrameworksSelected(state, FrameworkType.KEYED));
  let isNoneNonKeyedSelected = useSelector<State, boolean>(state => isNoneFrameworkSelected(state, FrameworkType.NON_KEYED));
  let areAllNoneKeyedSelected = useSelector<State, boolean>(state => areAllFrameworksSelected(state, FrameworkType.NON_KEYED));

  return <DropDown label="Which frameworks?" width='1024px'>
            <DropDownContents isNoneSelected={isNoneKeyedSelected} areAllSelected={areAllKeyedSelected}  selectNone={() => dispatch(selectAllFrameworks(FrameworkType.KEYED, false))} selectAll={() => dispatch(selectAllFrameworks(FrameworkType.KEYED, true))}>
                <h3>Keyed frameworks:</h3>
                <SelectBarFrameworks isSelected={(framework) => selectedFrameworks.has(framework)} select={(framework, add) => dispatch(selectFramework(framework, add))} frameworks={frameworksKeyed} />
            </DropDownContents>
            <DropDownContents isNoneSelected={isNoneNonKeyedSelected} areAllSelected={areAllNoneKeyedSelected} selectNone={() => dispatch(selectAllFrameworks(FrameworkType.NON_KEYED, false))} selectAll={() => dispatch(selectAllFrameworks(FrameworkType.NON_KEYED, true))}>
                <h3>Non-keyed frameworks:</h3>
                <SelectBarFrameworks isSelected={(framework) => selectedFrameworks.has(framework)} select={(framework, add) => dispatch(selectFramework(framework, add))} frameworks={frameworksNonKeyed} />
            </DropDownContents>
        </DropDown>
};


export default SelectFrameworks;