import { exoJsx } from '@exodra/jsx';
import { composeExoMachine, createExoMachine, wireExoNode, withExoEffects, withExoHandlers, withExoWire } from '@exodra/core';
import type { TExoAttrPort, TExoChildrenPort, TExoEventPort, TExoTextPort } from '@exodra/core';
import { ExoDomBackend, withExoBuiltSchemas } from '@exodra/dom';
import type { TExoDomNode, TExoDomPortChildList } from '@exodra/dom';
import { createExoChildrenReconciler } from '@exodra/list-reconcile';

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]; // prettier-ignore
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]; // prettier-ignore
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]; // prettier-ignore

const random = (max: number): number => Math.round(Math.random() * 1000) % max;

type TRow = { readonly id: number; label: string };
type TChange = { kind: 'rows' } | { kind: 'labels' } | { kind: 'selection'; was: number };

let nextId = 1;

function buildRows(count: number): TRow[] {
    const rows: TRow[] = new Array(count);
    for (let i = 0; i < count; i++) {
        rows[i] = {
            id: nextId++,
            label: `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`,
        };
    }
    return rows;
}

const store = {
    rows: [] as TRow[],
    selected: 0,
    listener: null as ((change: TChange) => void) | null,
    emit(change: TChange): void {
        this.listener?.(change);
    },
    run(): void {
        this.rows = buildRows(1000);
        this.emit({ kind: 'rows' });
    },
    runLots(): void {
        this.rows = buildRows(10000);
        this.emit({ kind: 'rows' });
    },
    add(): void {
        this.rows = this.rows.concat(buildRows(1000));
        this.emit({ kind: 'rows' });
    },
    update(): void {
        for (let i = 0; i < this.rows.length; i += 10) this.rows[i].label += ' !!!';
        this.emit({ kind: 'labels' });
    },
    clear(): void {
        this.rows = [];
        this.emit({ kind: 'rows' });
    },
    swapRows(): void {
        if (this.rows.length <= 998) return;
        const rows = this.rows.slice();
        const second = rows[1];
        rows[1] = rows[998];
        rows[998] = second;
        this.rows = rows;
        this.emit({ kind: 'rows' });
    },
    select(id: number): void {
        const was = this.selected;
        this.selected = id;
        this.emit({ kind: 'selection', was });
    },
    remove(id: number): void {
        const at = this.rows.findIndex((row) => row.id === id);
        if (at < 0) return;
        this.rows = this.rows.toSpliced(at, 1);
        this.emit({ kind: 'rows' });
    },
};

interface TRowPorts {
    className: TExoAttrPort;
    id: TExoTextPort;
    label: TExoTextPort;
    select: TExoEventPort;
    remove: TExoEventPort;
}

const rowSchema = exoJsx<TRowPorts>(($) => (
    <tr class={$.className}>
        <td class="col-md-1">{$.id}</td>
        <td class="col-md-4">
            <a onClick={$.select}>{$.label}</a>
        </td>
        <td class="col-md-1">
            <a onClick={$.remove}>
                <span class="glyphicon glyphicon-remove" aria-hidden="true" />
            </a>
        </td>
        <td class="col-md-6" />
    </tr>
));
const RowPorts = rowSchema.ports;

const rowMachine = composeExoMachine(
    createExoMachine<TExoDomNode, TRow, { row: TRow }>(rowSchema, {
        createInitialState: (_c, row) => ({ row }),
    }),
    (m) =>
        withExoWire(m, (c, row: TRow) => {
            c.text(RowPorts.id, String(row.id));
            c.text(RowPorts.label, row.label);
            c.attr(RowPorts.className, row.id === store.selected ? 'danger' : null);
        }),
    (m) =>
        withExoHandlers(m, (on) => {
            on(RowPorts.select, (c) => store.select(c.state.row.id));
            on(RowPorts.remove, (c) => store.remove(c.state.row.id));
        })
);

const reconcileRows = createExoChildrenReconciler<TRow>(rowMachine);

interface TAppPorts {
    run: TExoEventPort;
    runLots: TExoEventPort;
    add: TExoEventPort;
    update: TExoEventPort;
    clear: TExoEventPort;
    swapRows: TExoEventPort;
    rows: TExoChildrenPort;
}

const appSchema = exoJsx<TAppPorts>(($) => (
    <div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>Exodra-keyed</h1>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="run" onClick={$.run}>
                                Create 1,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="runlots" onClick={$.runLots}>
                                Create 10,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="add" onClick={$.add}>
                                Append 1,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="update" onClick={$.update}>
                                Update every 10th row
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="clear" onClick={$.clear}>
                                Clear
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button type="button" class="btn btn-primary btn-block" id="swaprows" onClick={$.swapRows}>
                                Swap Rows
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table class="table table-hover table-striped test-data">
            <tbody>
                <$.rows />
            </tbody>
        </table>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
));
const AppPorts = appSchema.ports;

function showChange(c: TExoDomNode, change: TChange): void {
    if (change.kind === 'rows') {
        reconcileRows(c, AppPorts.rows, store.rows);
        return;
    }
    const kids = (c as TExoDomNode & TExoDomPortChildList).portChildList(AppPorts.rows);
    const rows = store.rows;
    if (change.kind === 'labels') {
        for (let i = 0; i < rows.length; i += 10) wireExoNode(kids.at(i)!, rows[i]);
        return;
    }
    for (let i = 0; i < rows.length; i++) {
        const id = rows[i].id;
        if (id === change.was || id === store.selected) wireExoNode(kids.at(i)!, rows[i]);
    }
}

const appMachine = composeExoMachine(
    createExoMachine<TExoDomNode>(appSchema),
    (m) =>
        withExoHandlers(m, (on) => {
            on(AppPorts.run, () => store.run());
            on(AppPorts.runLots, () => store.runLots());
            on(AppPorts.add, () => store.add());
            on(AppPorts.update, () => store.update());
            on(AppPorts.clear, () => store.clear());
            on(AppPorts.swapRows, () => store.swapRows());
        }),
    (m) =>
        withExoEffects(m, (effect) => {
            effect((c) => {
                store.listener = (change) => showChange(c, change);
                return () => {
                    store.listener = null;
                };
            });
        })
);

withExoBuiltSchemas(new ExoDomBackend()).render(appMachine, document.getElementById('main')!);
