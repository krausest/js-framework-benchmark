import * as React from 'react';
import SelectBenchmarks from './SelectBenchmarks';
import SelectFrameworks from './SelectFrameworks';
import SelectionMode from './SelectionMode';
import SelectionFilterIssues from './SelectionFilterIssues';

export const SelectionBar = () => 
{
    console.log("SelectionBar")
    return (
        <div className="selectBar">
            <div className="header-row">
                <SelectFrameworks />
                <div className="hspan" />
                <SelectBenchmarks />
                <div className="hspan" />
                <SelectionMode />
                <div className="hspan" />
                <SelectionFilterIssues />
            </div>
        </div>
    );
};
