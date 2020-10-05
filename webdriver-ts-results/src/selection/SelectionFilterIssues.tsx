import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterIssuesMode } from '../Common';
import { selectFilterIssuesMode, State } from '../reducer';

const SelectionFilterIssues = () => 
{
    console.log("SelectionFilterIssues")
    const dispatch = useDispatch();    
    const filerMode = useSelector<State, FilterIssuesMode>(state => state.filterIssuesMode)
    
    return (
        <>
        <label htmlFor="filterIssues">Filter implementations</label>
        <div className="hspan" />
        <select id="filterIssues" className="custom-select" value={filerMode} onChange={(evt) => dispatch(selectFilterIssuesMode(Number(evt.target.value) as FilterIssuesMode))}>
            <option value={FilterIssuesMode.AllImplentations}>no filter</option>
            <option value={FilterIssuesMode.FilterErrors}>with errors</option>
            <option value={FilterIssuesMode.FilterSevereIssues}>with severe issues/cheats</option>
            <option value={FilterIssuesMode.FilterWarnings}>with any issues/cheats</option>
        </select>
        </>
    );
};

export default SelectionFilterIssues;