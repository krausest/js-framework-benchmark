import * as b from 'bobril';
import { Store } from "./store";

// For who ever will read this: in Bobril you normally don't use bootstrap or class names directly, you use b.styleDef instead.
b.asset("../../css/bootstrap/dist/css/bootstrap.min.css");
b.asset("../../css/main.css");

var startTime: number;
var lastMeasure: string;
var startMeasure = function (name) {
    startTime = performance.now();
    lastMeasure = name;
}
var stopMeasure = function () {
    var last = lastMeasure;
    if (lastMeasure) {
        window.setTimeout(function () {
            lastMeasure = null;
            var stop = performance.now();
            var duration = 0;
            console.log(last + " took " + (stop - startTime));
        }, 0);
    }
}

function divWithClass(name: string, children: b.IBobrilChildren) {
    return { tag: "div", className: name, children };
}

function tdWithClass(name: string, children: b.IBobrilChildren) {
    return { tag: "td", className: name, children };
}

let store = new Store();

interface IButtonData {
    children?: b.IBobrilChildren;
    id: string;
    action: () => void;
}

interface IButtonCtx extends b.IBobrilCtx {
    data: IButtonData;
}

const Button = b.createVirtualComponent<IButtonData>({
    render(ctx: IButtonCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        me.tag = "button";
        me.className = "btn btn-primary btn-block";
        me.attrs = { id: d.id };
        me.children = d.children;
    },
    onClick(ctx: IButtonCtx): boolean {
        startMeasure(ctx.data.id);
        ctx.data.action();
        b.invalidate();
        return true;
    }
});

interface IHeaderData {
}

interface IHeaderCtx extends b.IBobrilCtx {
    data: IHeaderData;
}

const Header = b.createComponent<IHeaderData>({
    shouldChange() { return false; },
    render(ctx: IHeaderCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        me.className = "jumbotron";
        me.children = divWithClass("row", [
            divWithClass("col-md-6", { tag: 'h1', children: "Bobril v4.44.1" }),
            divWithClass("col-md-6", [
                divWithClass("col-sm-6 smallpad", Button({ id: "run", action: () => store.run() }, "Create 1,000 rows")),
                divWithClass("col-sm-6 smallpad", Button({ id: "runlots", action: () => store.runLots() }, "Create 10,000 rows")),
                divWithClass("col-sm-6 smallpad", Button({ id: "add", action: () => store.add() }, "Append 1,000 rows")),
                divWithClass("col-sm-6 smallpad", Button({ id: "update", action: () => store.update() }, "Update every 10th row")),
                divWithClass("col-sm-6 smallpad", Button({ id: "clear", action: () => store.clear() }, "Clear")),
                divWithClass("col-sm-6 smallpad", Button({ id: "swaprows", action: () => store.swapRows() }, "Swap Rows")),
            ])
        ]);
    }
});

const ClickSelect = {
    onClick(ctx: { data: number }) {
        startMeasure("select");
        store.select(ctx.data);
        b.invalidate();
        return true;
    }
};

const ClickRemove = {
    onClick(ctx: { data: number }) {
        startMeasure("delete");
        store.delete(ctx.data);
        b.invalidate();
        return true;
    }
};

interface IRowData {
    item: { id: number, label: string };
    selected: boolean;
}

interface IRowCtx extends b.IBobrilCtx {
    data: IRowData;
}

const Row = b.createVirtualComponent<IRowData>({
    init(ctx: IRowCtx) {
    },
    shouldChange(ctx: IRowCtx, me: b.IBobrilNode): boolean {
        return ctx.data.item !== me.data.item || ctx.data.selected !== me.data.selected;
    },
    render(ctx: IRowCtx, me: b.IBobrilNode) {
        const d = ctx.data;
        me.tag = "tr";
        me.className = d.selected ? "danger" : "";
        const id = d.item.id;
        me.children = [
            tdWithClass("col-md-1", id),
            tdWithClass("col-md-4", { tag: "a", data: id, component: ClickSelect, children: d.item.label }),
            tdWithClass("col-md-1", { tag: "a", data: id, component: ClickRemove, children: { tag: "span", className: "glyphicon glyphicon-remove", attrs: { "aria-hidden": "true" } } }),
            tdWithClass("col-md-6", "")
        ];
    }
});

b.init(() => {
    return {
        tag: "div", className: "container", component: {
            postUpdateDom: stopMeasure
        }, children: [
            Header(),
            {
                tag: "table", className: "table table-hover table-striped test-data", children: {
                    tag: "tbody", children: store.data.map((item) => b.withKey(Row({ item, selected: item.id === store.selected }), <any>item.id))
                }
            },
            { tag: "span", className: "preloadicon glyphicon glyphicon-remove", attrs: { "aria-hidden": "true" } }
        ]
    };
});
