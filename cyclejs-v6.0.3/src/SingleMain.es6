'use strict';

import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM, * as dom from '@cycle/dom';

let id = 1;

function _random(max) {
    return Math.round(Math.random()*1000)%max;
}

let adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
let colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
let nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function buildData(count = 1000) {
    var data = [];
    for (var i = 0; i < count; i++)
        data.push({id: id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
    return data;
}

let Operations = {
    Run: state => ({items: buildData(), selected: undefined}),
    Update: state => ({items: state.items.map((item, idx) => (idx%10 === 0) ? ({id:item.id, label: item.label+' !!!'}) : item), selected: state.selected}),
    Add: state => ({items: state.items.concat(buildData(1000)), selected: state.selected}),
    SelectItem: item => state => ({items: state.items, selected: item}),
    RemoveItem: id => state => ({items: state.items.filter(item => item.id !== id), selected: state.selected}),
    HideAll: state => ({items: [], selected: null, olditems: state.items}),
    ShowAll: state => ({items: state.olditems, selected: null}),
    RunLots: state => ({items: buildData(10000), selected: null}),
    Clear: state => ({items: [], selected: null}),
    SwapRows: state => {
        let d = state.items.splice(0);
        if(d.length > 10) {
            var a = d[4];
            d[4] = d[9];
            d[9] = a;
        }
        return {items: d, selected: state.selected};
    }
}

function intent({DOM}) {
    let intent = Rx.Observable.merge(
        DOM.select('#run').events('click').map(evt => Operations.Run),
        DOM.select('#update').events('click').map(evt => Operations.Update),
        DOM.select('#add').events('click').map(evt => Operations.Add),
        DOM.select('#hideall').events('click').map(evt => Operations.HideAll),
        DOM.select('#showall').events('click').map(evt => Operations.ShowAll),
        DOM.select('#runlots').events('click').map(evt => Operations.RunLots),
        DOM.select('#clear').events('click').map(evt => Operations.Clear),
        DOM.select('#swaprows').events('click').map(evt => Operations.SwapRows),
        DOM.select('.remove').events('click').map(evt => {
            evt.preventDefault();
            evt.stopPropagation();
            let elem =  evt.ownerTarget;
            let id = parseInt(evt.ownerTarget["data-id"]);
            return Operations.RemoveItem(id);
        }),
        DOM.select('.select').events('click').map(evt => {
            evt.preventDefault();
            evt.stopPropagation();
            let id = parseInt(evt.ownerTarget["data-id"]);
            return Operations.SelectItem(id);
        })
    );
    return intent;
}

function model(intents) {
    var state$ = intents.startWith({ items: [] }).scan((state, operation) => {
        return operation(state);
    });
    return state$;
}

function view(state$) {
    const h = CycleDOM.h;
    return state$.
    map(state => {
        let rows = state.items.map(data =>
            dom.tr(state.selected === data.id ? '.danger' : '', [
                    dom.td(".col-md-1", data.id.toString()),
                    dom.td(".col-md-4", [
                        dom.a(".select", {"data-id": data.id.toString()}, data.label)
                    ]),
                    dom.td(".col-md-1", [
                        dom.a(".remove", {"data-id": data.id.toString()}, [
                            dom.span(".glyphicon .glyphicon-remove", {
                                ariaHidden: true})
                        ])
                    ]),
                    dom.td(".col-md-6")
                ]));
        return dom.div(".container", [
            dom.div(".jumbotron", [
                dom.div(".row", [
                    dom.div(".col-md-8", [
                        dom.h1("Cycle.js v6.0.3")
                    ]),
                    dom.div(".col-md-4", [
                        dom.button(".btn .btn-primary .btn-block", {type: "button", id:"add"},"Add 1000 rows"),
                        dom.button(".btn .btn-primary .btn-block", {type: "button", id:"run"},"Create 1000 rows"),
                        dom.button(".btn .btn-primary .btn-block", {type: "button", id:"update"},"Update every 10th row"),
                        dom.button(".btn .btn-primary .btn-block", {type: "button", id:"hideall"},"HideAll"),
                        dom.button(".btn .btn-primary .btn-block", {type: "button", id:"showall"},"ShowAll"),
                        dom.button(".btn .btn-primary .btn-block", {type: "button", id:"runlots"},"Create lots of rows"),
                        dom.button(".btn .btn-primary .btn-block", {type: "button", id:"clear"},"Clear"),
                        dom.button(".btn .btn-primary .btn-block", {type: "button", id:"swaprows"},"Swap Rows")
                    ])
                ])
            ]),
            dom.div(".container", [
                dom.table(".table .table-hover .table-striped .test-data", [
                    dom.tbody(rows)
                ])
            ])
        ]);
/*
        <div className="container">
            <table className="table table-hover table-striped test-data">
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>
        */
      /*
        let rows = state.items.map(data =>
            <tr className={state.selected === data.id ? 'danger' : ''}>
                <td className="col-md-1">{data.id}</td>
                <td className="col-md-4">
                    <a href={data.id} className="select">{data.label}</a>
                </td>
                <td className="col-md-1"><a is className="remove" href={data.id}><span className="glyphicon glyphicon-remove"
                                                                 aria-hidden="true"></span></a></td>
                <td className="col-md-6"></td>
            </tr>);
        return (<div className="container">
            <div className="jumbotron">
                <div className="row">
                    <div className="col-md-8">
                        <h1>Cycle.js</h1>
                    </div>
                    <div className="col-md-4">
                        <button type="button" className="btn btn-primary btn-block" id="add">Add 1000 rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="run">Create 1000 rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="update">Update every 10th row</button>
                        <button type="button" className="btn btn-primary btn-block" id="hideall">HideAll</button>
                        <button type="button" className="btn btn-primary btn-block" id="showall">ShowAll</button>
                        <button type="button" className="btn btn-primary btn-block" id="runlots">Create lots of rows</button>
                        <button type="button" className="btn btn-primary btn-block" id="clear">Clear</button>
                        <button type="button" className="btn btn-primary btn-block" id="swaprows">Swap Rows</button>
                        <h3 id="duration"><span className="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;</h3>
                    </div>
                </div>
            </div>
            <table className="table table-hover table-striped test-data">
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>)
        */; }
    );
}

function main({DOM}) {
    return {
        DOM: view(model(intent({DOM})))
    }
}

// Bootstrap the application
Cycle.run(main, {
    DOM: CycleDOM.makeDOMDriver('#main')
});