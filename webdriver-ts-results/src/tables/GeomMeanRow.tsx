import React from 'react'
import { TableResultGeommeanEntry, T_SORT_BY_GEOMMEAN} from '../Common'; 

const GeomMeanRow = ({geomMean, currentSortKey, sortBy, sortbyGeommeanEnum} 
    : {geomMean: Array<TableResultGeommeanEntry|null>, currentSortKey: string,
    sortBy: (name:string) => void , sortbyGeommeanEnum: T_SORT_BY_GEOMMEAN}) => {
    let sort = (sortValue: string) => (event: any) => {
        event.preventDefault();
        sortBy(sortValue)
    }
    return (
    <tr>
        <th><button className={currentSortKey === sortbyGeommeanEnum ? 'sortKey textButton' : 'textButton'} onClick={sort(sortbyGeommeanEnum)}>geometric mean</button>of all factors in the table</th>
        {geomMean.map(result => result == null ? <th></th> : 
            <th key={result.key} style={{backgroundColor:result.bgColor, color:result.textColor}}>{result.mean.toFixed(2)}
            </th>    
        )}
    </tr>)
}

export default GeomMeanRow;