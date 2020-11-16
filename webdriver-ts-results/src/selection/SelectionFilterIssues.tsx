import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { categories} from '../Common';
import { selectAllCategories, selectCategory, State } from '../reducer';
import DropDown from './DropDown';
import { DropDownContents } from './DropDownContents';

const SelectionFilterIssues = () => 
{
    console.log("SelectionFilterIssues")
    const dispatch = useDispatch();    
    const selectedCategories = useSelector<State, Set<number>>(state => state.categories)
    const isNoneSelected = false;
    const areAllSelected = false;
    
    return (
      <DropDown label="Which implementations?" width='368px'>
        <DropDownContents isNoneSelected={isNoneSelected} areAllSelected={areAllSelected} selectNone={() => dispatch(selectAllCategories(false))} selectAll={() => dispatch(selectAllCategories(true))}>
            <h3>Show Implementations with</h3>
            <div>
            {categories.map(item =>
              <div key={item.id} className="col-md-12">
                  <div className="form-check">
                      <input id={'inp-'+item.id} className="form-check-input" type="checkbox" 
                        onChange={(evt) => dispatch(selectCategory(item.id, evt.target.checked))}
                        checked={selectedCategories.has(item.id)} />
                      <label htmlFor={'inp-'+item.id} className="form-check-label check-full-width">
                      {item.text}
                      </label>
                  </div>
              </div>
            )}
            </div>
        </DropDownContents>
      </DropDown>
    );
};

export default SelectionFilterIssues;

/*
        <>
        <label htmlFor="filterIssues">Suppress implementations</label>
        <div className="hspan" />
        <select id="filterIssues" className="custom-select" value={filerMode} onChange={(evt) => dispatch(selectFilterIssuesMode(Number(evt.target.value) as FilterIssuesMode))}>
            <option value={FilterIssuesMode.AllImplentations}>none</option>
            <option value={FilterIssuesMode.FilterErrors}>with errors</option>
            <option value={FilterIssuesMode.FilterSevereIssues}>with severe issues/cheats</option>
            <option value={FilterIssuesMode.FilterWarnings}>with any issues/cheats</option>
        </select>
        </>
*/