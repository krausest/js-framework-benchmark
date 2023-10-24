import {memo} from 'react';
import {createRoot} from 'react-dom/client';
import {createSignal, useSelector} from "react-tagged-state";

const random = (max) => Math.round(Math.random() * 1000) % max;

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
    "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
    "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
    "keyboard"];

let nextId = 1;

const buildData = (count) => {
    const data = new Array(count);

    for (let i = 0; i < count; i++) {
        data[i] = {
            id: nextId++,
            label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
        };
    }

    return data;
};

const data = createSignal([]);

const selected = createSignal(0);

const Row = memo(({item}) => {
    const isSelected = useSelector(selected, (curr) => curr === item.id);

    return <tr className={isSelected ? "danger" : ""}>
        <td className="col-md-1">{item.id}</td>
        <td className="col-md-4">
            <a onClick={() => selected(item.id)}>{item.label}</a>
        </td>
        <td className="col-md-1">
            <a onClick={() => data((curr) => {
                const idx = curr.findIndex((d) => d.id === item.id);

                return [...curr.slice(0, idx), ...curr.slice(idx + 1)];
            })}>
                <span className="glyphicon glyphicon-remove" aria-hidden="true"/>
            </a>
        </td>
        <td className="col-md-6"/>
    </tr>
})

const Rows = () => {
    const items = useSelector(data);

    return items.map(item => (<Row key={item.id} item={item}/>));
}

const Button = ({id, cb, title}) => (
    <div className="col-sm-6 smallpad">
        <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
    </div>
);

const Main = () => (
    <div className="container">
        <div className="jumbotron">
            <div className="row">
                <div className="col-md-6">
                    <h1>React Tagged State keyed</h1>
                </div>
                <div className="col-md-6">
                    <div className="row">
                        <Button id="run" title="Create 1,000 rows" cb={() => {
                            data(buildData(1000));
                            selected(0);
                        }}/>
                        <Button id="runlots" title="Create 10,000 rows" cb={() => {
                            data(buildData(10000));
                            selected(0);
                        }}/>
                        <Button id="add" title="Append 1,000 rows"
                                cb={() => data((curr) => curr.concat(buildData(1000)))}/>
                        <Button id="update" title="Update every 10th row" cb={() => data((curr) => {
                            const newData = curr.slice(0);

                            for (let i = 0; i < newData.length; i += 10) {
                                const r = newData[i];

                                newData[i] = {id: r.id, label: r.label + " !!!"};
                            }

                            return newData;
                        })}/>
                        <Button id="clear" title="Clear" cb={() => {
                            data([]);
                            selected(0);
                        }}/>
                        <Button id="swaprows" title="Swap Rows"
                                cb={() => data((curr) => curr.length > 998 ? [curr[0], curr[998], ...curr.slice(2, 998), curr[1], curr[999]] : curr)}/>
                    </div>
                </div>
            </div>
        </div>
        <table className="table table-hover table-striped test-data">
            <tbody>
            <Rows/>
            </tbody>
        </table>
        <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
    </div>
)

createRoot(document.getElementById("main")).render(<Main/>);
