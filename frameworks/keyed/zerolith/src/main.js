import { computed, each, html, render, signal } from "zerolith";

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let nextId = 1;

function pick(list)
{
    return list[Math.round(Math.random() * 1000) % list.length];
}

function buildData(count)
{
    return Array.from({ length: count }, () => ({ id: nextId++, label: `${pick(adjectives)} ${pick(colors)} ${pick(nouns)}` }));
}

const rows = signal([]);
const selected = signal(0);

function run()
{
    rows.set(buildData(1000));
}

function runLots()
{
    rows.set(buildData(10000));
}

function add()
{
    rows.set([...rows.get(), ...buildData(1000)]);
}

function update()
{
    rows.set(rows.get().map((row, index) => (index % 10 === 0 ? { id: row.id, label: row.label + " !!!" } : row)));
}

function clear()
{
    rows.set([]);
}

function swapRows()
{
    const list = rows.get().slice();
    if (list.length > 998)
    {
        const second = list[1];
        list[1] = list[998];
        list[998] = second;
        rows.set(list);
    }
}

function remove(id)
{
    rows.set(rows.get().filter((row) => row.id !== id));
}

/** One table row. The id is read once, since `each` keys the rows by it; the label and the selection stay live. The markup stays on one line so no whitespace text nodes sit between the cells, matching the reference markup. */
function Row(row)
{
    const { id } = row.get();
    const label = computed(() => row.get().label);
    const className = computed(() => (selected.get() === id ? "danger" : ""));
    return html`<tr class=${className}><td class="col-md-1">${id}</td><td class="col-md-4"><a @click=${() => selected.set(id)}>${label}</a></td><td class="col-md-1"><a @click=${() => remove(id)}><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;
}

function Button({ id, text, action })
{
    return html`
        <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id=${id} @click=${action}>${text}</button>
        </div>`;
}

function App()
{
    return html`
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6">
                        <h1>zerolith-"keyed"</h1>
                    </div>
                    <div class="col-md-6">
                        <div class="row">
                            ${Button({ id: "run", text: "Create 1,000 rows", action: run })}
                            ${Button({ id: "runlots", text: "Create 10,000 rows", action: runLots })}
                            ${Button({ id: "add", text: "Append 1,000 rows", action: add })}
                            ${Button({ id: "update", text: "Update every 10th row", action: update })}
                            ${Button({ id: "clear", text: "Clear", action: clear })}
                            ${Button({ id: "swaprows", text: "Swap Rows", action: swapRows })}
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>${each(rows, (row) => row.id, Row)}</tbody>
            </table>
            <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
        </div>`;
}

render(App(), "#main");
