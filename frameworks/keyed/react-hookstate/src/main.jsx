import React from 'react';
import ReactDOM from 'react-dom';
import { useStateLink, createStateLink, None, Downgraded } from '@hookstate/core';

function random(max) { return Math.round(Math.random() * 1000) % max; }

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
    "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
    "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
    "keyboard"];

let nextId = 1;

function buildData(count) {
    const data = {};
    for (let i = 0; i < count; i++) {
        data[nextId] = {
            id: nextId,
            label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
        };
        nextId += 1;
    }
    return data;
}

const globalState = createStateLink({});
let selectedState = undefined;

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = ({ itemState }) => {
    const state = useStateLink(itemState).with(Downgraded);
    const item = state.value;
    const select = () => {
        if (selectedState && selectedState.nested) {
            selectedState.nested.selected.set(false)
        }
        selectedState = state
        selectedState.nested.selected.set(true)
    };
    const remove = () => state.set(None);

    return (<tr key={item.id} className={item.selected ? "danger" : ""}>
        <td className="col-md-1">{item.id}</td>
        <td className="col-md-4"><a onClick={select}>{item.label}</a></td>
        <td className="col-md-1"><a onClick={remove}>{GlyphIcon}</a></td>
        <td className="col-md-6"></td>
    </tr>);
}

const Button = ({ id, cb, title }) => (
    <div className="col-sm-6 smallpad">
        <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
    </div>
);

const Jumbotron = () => {
    const dataState = globalState

    return (<div className="jumbotron">
        <div className="row">
            <div className="col-md-6">
                <h1>React Hookstate keyed</h1>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <Button id="run" title="Create 1,000 rows" cb={() => {
                        dataState.set(buildData(1000))
                    }} />
                    <Button id="runlots" title="Create 10,000 rows" cb={() => {
                        dataState.set(buildData(10000))
                    }} />
                    <Button id="add" title="Append 1,000 rows" cb={() => {
                        dataState.merge(buildData(1000))
                    }} />
                    <Button id="update" title="Update every 10th row" cb={() => {
                        dataState.merge(p => {
                            const mergee = {}
                            const keys = Object.keys(p);
                            for (let i = 0; i < keys.length; i += 10) {
                                const itemId = keys[i];
                                const itemState = p[itemId];
                                itemState.label = itemState.label + " !!!";
                                mergee[itemId] = itemState
                            }
                            return mergee;
                        })
                    }} />
                    <Button id="clear" title="Clear" cb={() => {
                        dataState.set({})
                    }} />
                    <Button id="swaprows" title="Swap Rows" cb={() => {
                        dataState.merge(p => {
                            const mergee = {}
                            const keys = Object.keys(p);
                            if (keys.length > 2) {
                                mergee[keys[1]] = p[keys[keys.length - 2]]
                                mergee[keys[keys.length - 2]] = p[keys[1]]
                            }
                            return mergee;
                        })
                    }} />
                </div>
            </div>
        </div>
    </div>)
}

const Rows = () => {
    const dataState = useStateLink(globalState);

    return (<table className="table table-hover table-striped test-data"><tbody>
        {dataState.keys.map(itemKey =>
            <Row key={itemKey} itemState={dataState.nested[itemKey]} />
        )}
    </tbody></table>)
}

const Main = () => {
    return (<div className="container">
        <Jumbotron />
        <Rows />
        <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>);
}

ReactDOM.render(<Main />, document.getElementById('main'));
