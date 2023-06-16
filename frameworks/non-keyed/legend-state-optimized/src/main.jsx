import { beginBatch, endBatch, observable } from "@legendapp/state";
import { For, useSelector } from "@legendapp/state/react";
import React, { memo } from "react";
import ReactDOM from "react-dom";

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
    "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
    "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
    "keyboard"];

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;
function buildData(count) {
    let data = new Array(count);
    for (let i = 0; i < count; i++) {
        data[i] = {
            id: nextId++,
            label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
        }
    }
    return data;
}

let selectedItem = undefined;
const arr$ = observable([]);

function run() {
    arr$.set(buildData(1000));
}
function runLots() {
    arr$.set(buildData(10000));
}
function add() {
    arr$.set(arr$.concat(buildData(1000)));
}
function update() {
    beginBatch();
    const list = arr$;
    const length = list.length;
    for (let i = 0; i < length; i += 10) {
        list[i].label.set(v => v + " !!!");
    }
    endBatch();
}
function remove(itemData) {
    const idx = arr$.peek().indexOf(itemData);
    arr$.splice(idx, 1);
}
function select(item) {
    if (selectedItem !== undefined) {
        selectedItem.selected.set(false);
    }
    item.selected.set(true);
    selectedItem = item;
}
function swapRows() {
    beginBatch();
    const arr = arr$;
    const tmp = arr[1].peek();
    arr[1].set(arr[998].peek());
    arr[998].set(tmp);
    endBatch();
}
function clear() {
    arr$.set([]);
}

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = ({ item }) => {
    const itemData = useSelector(item);
    const { label, selected, id } = itemData;

    return (
        <tr className={selected ? "danger" : ""}>
            <td className="col-md-1">{id}</td>
            <td className="col-md-4"><a onClick={() => select(item)}>{label}</a></td>
            <td className="col-md-1"><a onClick={() => remove(itemData)}>{GlyphIcon}</a></td>
            <td className="col-md-6"></td>
        </tr>
    )
};

const RowList = () => {
    return <For each={arr$} item={Row} optimized />;
};

const Button = memo(({ id, title, cb }) => (
    <div className="col-sm-6 smallpad">
        <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
    </div>
));

const Main = () => {
    return (
        <div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-6"><h1>Legend-State v1.2.9 (Optimized)</h1></div>
                    <div className="col-md-6"><div className="row">
                        <Button id="run" title="Create 1,000 rows" cb={run} />
                        <Button id="runlots" title="Create 10,000 rows" cb={runLots} />
                        <Button id="add" title="Append 1,000 rows" cb={add} />
                        <Button id="update" title="Update every 10th row" cb={update} />
                        <Button id="clear" title="Clear" cb={clear} />
                        <Button id="swaprows" title="Swap Rows" cb={swapRows} />
                    </div></div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data"><tbody><RowList /></tbody></table>
            <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>
    );
};

ReactDOM.render(
    <Main />,
    document.getElementById("main")
);
