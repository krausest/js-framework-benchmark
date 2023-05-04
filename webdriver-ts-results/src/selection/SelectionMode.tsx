import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CpuDurationMode, DisplayMode } from '../Common';
import { selectCpuDurationMode, selectDisplayMode, State } from '../reducer';

const SelectionMode = (): JSX.Element => 
{
    console.log("SelectionMode")
    const dispatch = useDispatch();    
    const displayMode = useSelector<State, DisplayMode>(state => state.displayMode)
    const cpuDurationMode = useSelector<State, CpuDurationMode>(state => state.cpuDurationMode)
    
    return (
        <>
        <label htmlFor="displayMode">Display mode</label>
        <div className="hspan" />
        <select id="displayMode" className="custom-select" value={displayMode} onChange={(evt) => dispatch(selectDisplayMode(Number(evt.target.value) as DisplayMode))}>
            <option value={DisplayMode.DisplayMean}>mean results</option>
            <option value={DisplayMode.DisplayMedian}>median results</option>
            <option value={DisplayMode.BoxPlot}>box plot</option>
        </select>
        <label htmlFor="displayMode">(Experimental) Duration measurement mode</label>
        <div className="hspan" />
        <select id="displayMode" className="custom-select" value={cpuDurationMode} onChange={(evt) => dispatch(selectCpuDurationMode(evt.target.value as CpuDurationMode))}>
            <option value={CpuDurationMode.Total}>total duration</option>
            <option value={CpuDurationMode.Script}>only JS duration</option>
        </select>
        </>
    );
};

export default SelectionMode;