import {memo} from "react";
import {createRoot} from 'react-dom/client';
import {createSignal, useSelector} from "react-tagged-state";

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
    "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
    "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
    "keyboard"];

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;

const buildData = (count) => {
    const res = new Array(count);

    for (let index = 0; index < count; index++) {
        res[index] = {
            id: nextId++,
            labelSignal: createSignal(`${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`),
            isSelectedSignal: createSignal(false)
        };
    }

    return res;
}

const dataSignal = createSignal([]);

let selectedSignal = createSignal(null);

const select = (item) => {
    selectedSignal((prev) => {
        if (prev) {
            prev.isSelectedSignal(false);
        }

        if (item) {
            item.isSelectedSignal(true);
        }

        return item;
    });
};

const run = () => {
    dataSignal(buildData(1000));
    select(null);
};

const runLots = () => {
    dataSignal(buildData(10000));
    select(null);
};

const add = () => {
    dataSignal((curr) => curr.concat(buildData(1000)));
};

const update = () => {
    const items = dataSignal();

    for (let index = 0; index < items.length; index += 10) {
        items[index].labelSignal((labelSignal) => labelSignal + " !!!");
    }
};

const clear = () => {
    dataSignal([]);
    select(null);
};

const swap = () => {
    dataSignal((curr) => [curr[0], curr[998], ...curr.slice(2, 998), curr[1], curr[999]]);
};

const remove = (id) => dataSignal((curr) => curr.filter((item) => item.id !== id));

const GlyphIcon = (
    <span className="glyphicon glyphicon-remove" aria-hidden="true"/>
);

const SelectableRow = ({isSelectedSignal, children}) => (
    <tr className={useSelector(isSelectedSignal) ? "danger" : ""}>
        {children}
    </tr>
);

const Label = ({labelSignal}) => useSelector(labelSignal);

const ListItem = memo(({item}) => (
    <SelectableRow isSelectedSignal={item.isSelectedSignal}>
        <td className="col-md-1">{item.id}</td>
        <td className="col-md-4">
            <a onClick={() => select(item)}><Label labelSignal={item.labelSignal}/></a>
        </td>
        <td className="col-md-1">
            <a onClick={() => remove(item.id)}>{GlyphIcon}</a>
        </td>
        <td className="col-md-6"/>
    </SelectableRow>
));

const List = () => {
    const items = useSelector(dataSignal);

    return items.map((item) => <ListItem key={item.id} item={item}/>)
};

const Button = ({id, title, cb}) => (
    <div className="col-sm-6 smallpad">
        <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
    </div>
);

const Main = () => (
    <div className="container">
        <div className="jumbotron">
            <div className="row">
                <div className="col-md-6"><h1>React Tagged State </h1></div>
                <div className="col-md-6">
                    <div className="row">
                        <Button id="run" title="Create 1,000 rows" cb={run}/>
                        <Button id="runlots" title="Create 10,000 rows" cb={runLots}/>
                        <Button id="add" title="Append 1,000 rows" cb={add}/>
                        <Button id="update" title="Update every 10th row" cb={update}/>
                        <Button id="clear" title="Clear" cb={clear}/>
                        <Button id="swaprows" title="Swap Rows" cb={swap}/>
                    </div>
                </div>
            </div>
        </div>
        <table className="table table-hover table-striped test-data">
            <tbody>
            <List/>
            </tbody>
        </table>
        <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
    </div>
);

createRoot(document.getElementById("main")).render(<Main/>);
