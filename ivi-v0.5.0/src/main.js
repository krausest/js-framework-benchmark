import { Component, connect, Events, $h, $c, selectorData, createStore, render, update, mut } from "ivi";

let startTime = 0;
let lastMeasure = null;

function startMeasure(name) {
    startTime = performance.now();
    lastMeasure = name;
}

function stopMeasure() {
    const last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            const now = performance.now();
            lastMeasure = null;
            console.log(`${last} took ${now - startTime}`);
        }, 0);
    }
}

function random(max) {
    return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
    "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable",
    "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza",
    "mouse", "keyboard"];

let nextId = 1;

function buildData(count = 1000) {
    const data = new Array(count);
    for (let i = 0; i < count; i++) {
        data[i] = {
            id: nextId++,
            label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
        };
    }
    return data;
}

const store = createStore(
    { data: mut([]), selected: null },
    function (state, action) {
        const data = state.data.ref;
        switch (action.type) {
            case "delete":
                data.splice(data.indexOf(action.item), 1);
                return Object.assign({}, state, { data: mut(data) });
            case "run":
                return { data: mut(buildData(1000)), selected: null };
            case "add":
                return Object.assign({}, state, { data: mut(state.data.ref.concat(buildData(1000))) });
            case "update":
                for (let i = 0; i < data.length; i += 10) {
                    const r = data[i];
                    data[i] = { id: r.id, label: r.label + " !!!" };
                }
                return Object.assign({}, state);
            case "select":
                return Object.assign({}, state, { selected: action.item });
            case "runlots":
                return { data: mut(buildData(10000)), selected: null };
            case "clear":
                return { data: mut([]), selected: null };
            case "swaprows":
                if (data.length > 10) {
                    const a = data[4];
                    data[4] = data[9];
                    data[9] = a;
                }
                return Object.assign({}, state, { data: mut(data) });
        }
        return state;
    },
    function () {
        update();
        stopMeasure();
    }
);

class Row extends Component {
    constructor(props) {
        super(props);
        this.click = Events.onClick(this.click.bind(this));
        this.del = Events.onClick(this.del.bind(this));
    }

    click() {
        startMeasure("select");
        store.dispatch({ type: "select", item: this.props.item });
    }

    del() {
        startMeasure("delete");
        store.dispatch({ type: "delete", item: this.props.item });
    }

    render() {
        const { selected, item } = this.props;
        return $h("tr", selected ? "danger" : null)
            .children([
                $h("td", "col-md-1").children(item.id),
                $h("td", "col-md-4").children(
                    $h("a").events(this.click).children(item.label)
                ),
                $h("td", "col-md-1").children(
                    $h("a").events(this.del).children(
                        $h("span", "glyphicon glyphicon-remove").props({ "aria-hidden": "true" })
                    )
                ),
                $h("td", "col-md-6")
            ]);
    }
}

const $Row = connect(
    function (prev, id) {
        const item = store.getState().data.ref[id];
        const selected = store.getState().selected === item;
        if (prev && prev.in.item === item && prev.in.selected === selected) {
            return prev;
        }
        return selectorData({ item, selected });
    },
    Row
);

function RowList(rows) {
    const children = new Array(rows.length);
    for (let i = 0; i < children.length; i++) {
        children[i] = $Row(i).key(rows[i].id);
    }
    return $h("tbody").children(children);
}

const $RowList = connect(
    function (prev) {
        const rows = store.getState().data;
        if (prev && prev.in === rows) {
            return prev;
        }
        return selectorData(rows, rows.ref);
    },
    RowList
);

function $Button(text, id) {
    return $h("div", "col-sm-6 smallpad").children(
        $h("button", "btn btn-primary btn-block")
            .events(Events.onClick(() => {
                startMeasure(id);
                store.dispatch({ type: id });
            }))
            .props({ "type": "button", "id": id })
            .children(text)
    );
}

function Controller() {
    return $h("div", "container")
        .children([
            $h("div", "jumbotron").children(
                $h("div", "row").children([
                    $h("div", "col-md-6").children(
                        $h("h1").children("ivi v0.5.0")
                    ),
                    $h("div", "col-md-6").children(
                        $h("div", "row").children([
                            $Button("Create 1,000 rows", "run"),
                            $Button("Create 10,000 rows", "runlots"),
                            $Button("Append 1,000 rows", "add"),
                            $Button("Update every 10th row", "update"),
                            $Button("Clear", "clear"),
                            $Button("Swap Rows", "swaprows")
                        ])
                    )
                ])
            ),
            $h("table", "table table-hover table-striped test-data").children($RowList()),
            $h("span", "preloadicon glyphicon glyphicon-remove").props({ "aria-hidden": "true" })
        ]);
}

render($c(Controller), document.getElementById("main"));
