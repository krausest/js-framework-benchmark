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
            <div key={item.name}>
                <input className="form-check-input" id={'inp-'+item.name+'-'+item.type}
                    type="checkbox"
                    onChange={(evt) => select(item, evt.target.checked)}
                    checked={isSelected(item)}
                />
                <label htmlFor={'inp-'+item.name+'-'+item.type} className="form-check-label">
                    {item.displayname}
                </label>
            </div>
        )}
      </>);
};

const SelectFrameworks = () => {
  console.log("SelectFrameworks");
  const dispatch = useDispatch();
  const selectedFrameworks = useSelector<State, Set<Framework>>((state) => state.selectedFrameworksDropDown);
  const frameworksKeyed = useSelector<State, Framework[]>(state => state.frameworkLists[FrameworkType.KEYED]);
  const frameworksNonKeyed = useSelector<State, Framework[]>(state => state.frameworkLists[FrameworkType.NON_KEYED]);
  const isNoneKeyedSelected = useSelector<State, boolean>(state => isNoneFrameworkSelected(state, FrameworkType.KEYED));
  const areAllKeyedSelected = useSelector<State, boolean>(state => areAllFrameworksSelected(state, FrameworkType.KEYED));
  const isNoneNonKeyedSelected = useSelector<State, boolean>(state => isNoneFrameworkSelected(state, FrameworkType.NON_KEYED));
  const areAllNoneKeyedSelected = useSelector<State, boolean>(state => areAllFrameworksSelected(state, FrameworkType.NON_KEYED));

  return <DropDown label="Which frameworks?" width='1024px'>
            <DropDownContents grid isNoneSelected={isNoneKeyedSelected} areAllSelected={areAllKeyedSelected}  selectNone={() => dispatch(selectAllFrameworks(FrameworkType.KEYED, false))} selectAll={() => dispatch(selectAllFrameworks(FrameworkType.KEYED, true))}>
                <h3>Keyed frameworks:</h3>
                <SelectBarFrameworks isSelected={(framework) => selectedFrameworks.has(framework)} select={(framework, add) => dispatch(selectFramework(framework, add))} frameworks={frameworksKeyed} />
            </DropDownContents>
            <DropDownContents grid isNoneSelected={isNoneNonKeyedSelected} areAllSelected={areAllNoneKeyedSelected} selectNone={() => dispatch(selectAllFrameworks(FrameworkType.NON_KEYED, false))} selectAll={() => dispatch(selectAllFrameworks(FrameworkType.NON_KEYED, true))}>
                <h3>Non-keyed frameworks:</h3>
                <SelectBarFrameworks isSelected={(framework) => selectedFrameworks.has(framework)} select={(framework, add) => dispatch(selectFramework(framework, add))} frameworks={frameworksNonKeyed} />
            </DropDownContents>
        </DropDown>
};


export default SelectFrameworks;