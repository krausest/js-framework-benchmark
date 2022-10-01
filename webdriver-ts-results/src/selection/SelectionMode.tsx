import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DisplayMode } from '../Common';
import { selectDisplayMode, State } from '../reducer';

const SelectionMode = (): JSX.Element => 
{
    console.log("SelectionMode")
    const dispatch = useDispatch();    
    const displayMode = useSelector<State, DisplayMode>(state => state.displayMode)
    
    return (
        <>
        <label htmlFor="displayMode">Display mode</label>
        <div className="hspan" />
        <select id="displayMode" className="custom-select" value={displayMode} onChange={(evt) => dispatch(selectDisplayMode(Number(evt.target.value) as DisplayMode))}>
            <option value={DisplayMode.DisplayMean}>mean results</option>
            <option value={DisplayMode.DisplayMedian}>median results</option>
            <option value={DisplayMode.BoxPlot}>box plot</option>
        </select>
        </>
    );
};

export default SelectionMode;