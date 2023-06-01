import * as React from 'react';
import SelectBenchmarks from './SelectBenchmarks';
import SelectFrameworks from './SelectFrameworks';
import SelectionMode from './SelectionMode';
import CopyPasteSelection from './CopyPasteSelection';

export const SelectionBar = ({showDurationSelection}:{showDurationSelection:boolean}): JSX.Element => 
{
    console.log("SelectionBar")
    return (
        <div className="selectBar">
            <div className="header-row">
                <SelectFrameworks />
                <div className="hspan" />
                <SelectBenchmarks />
                <div className="hspan" />
                <SelectionMode showDurationSelection={showDurationSelection}/>
                <div className="hspan" />
                <CopyPasteSelection />
            </div>
        </div>
    );
};
