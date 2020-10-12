import React from 'react'

interface Props {
    formattedValue: string;
    deviation: string|null;
    formattedFactor: string;
    bgColor: string;
    textColor: string;
    statisticallySignificantFactor: string|number|undefined;
}

const ValueCell = ({formattedValue, statisticallySignificantFactor, textColor, bgColor, formattedFactor, deviation}: Props) => {
    return (<td style={{backgroundColor:bgColor, color: textColor}}>
                <span className="mean">{formattedValue}</span>
                {deviation!=null && <span className="deviation">{deviation}</span>}
                <br />
                <span className="factor">({formattedFactor})</span>
                {statisticallySignificantFactor && <>
                <br/>
                <span className="factor">{statisticallySignificantFactor}</span>
                </>
                }
            </td>)
}

export default ValueCell;