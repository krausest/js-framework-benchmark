import React from 'react';
import { useDispatch } from 'react-redux';
import { Framework, TableResultComparisonEntry } from '../Common';
import { compare, stopCompare } from '../reducer';

const CompareRow = ({comparison, compareWith}: {comparison: Array<TableResultComparisonEntry|null>; compareWith: Framework|undefined}): JSX.Element => {
    const dispatch = useDispatch()

    if (!compareWith) {
        return (<tr>
        <th>compare: Green means significantly faster, red significantly slower</th>
        {comparison.map((result,idx) => result == null ? <th key={idx}></th> : 
            <th key={result.key} style={{backgroundColor:result.bgColor, color:result.textColor}}>
                <button className={'sortKey textButton'} onClick={() => dispatch(compare(result.framework))}>compare</button>
            </th>    
        )}
    </tr>)
    } else {
        return (
            <tr>
        <th>compare: Green means significantly faster, red significantly slower</th>
        {comparison.map((result,idx) => result == null ? <th key={idx}></th> : 
            <th key={result.key} style={{backgroundColor:result.bgColor, color:result.textColor}}>
                {result.label}
                {  (compareWith === result.framework) ? <button className={'sortKey textButton'} onClick={() => dispatch(stopCompare(result.framework))}>stop compare</button>
            : <button className={'sortKey textButton'} onClick={() => dispatch(compare(result.framework))}>compare</button> }
            </th>    
        )}
    </tr>)
    }
}

export default CompareRow;