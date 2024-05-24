import { createSelector } from "solid-js";
import { render } from "solid-js/web";
import { createStore } from "solid-js/store";

const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"]; // prettier-ignore
const colors = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"]; // prettier-ignore
const nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"]; // prettier-ignore

const random = (max) => Math.round(Math.random() * 1000) % max;

let nextId = 1;

const buildData = (count) => {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${adjectives[random(adjectives.length)]} ${colors[random(colors.length)]} ${nouns[random(nouns.length)]}`
    }
  }
  return data;
};

const Button = ([id, text, fn]) => (
  <div class="col-sm-6 smallpad">
    <button prop:id={id} class="btn btn-primary btn-block" type="button" onClick={fn}>
      {text}
    </button>
  </div>
);

render(() => {
  const [state, setState] = createStore({ data: [], selected: null });
  const run = () => setState({ data: buildData(1_000) });
  const runLots = () => setState({ data: buildData(10_000) });
  const add = () => setState("data", (d) => [...d, ...buildData(1_000)]);
  const update = () => setState("data", { by: 10 }, "label", (l) => l + " !!!");
  const swapRows = () => setState("data", (d) => (d.length > 998 ? { 1: d[998], 998: d[1] } : d));
  const clear = () => setState({ data: [] });
  const isSelected = createSelector(() => state.selected);

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Solid Store</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button {...["run", "Create 1,000 rows", run]} />
              <Button {...["runlots", "Create 10,000 rows", runLots]} />
              <Button {...["add", "Append 1,000 rows", add]} />
              <Button {...["update", "Update every 10th row", update]} />
              <Button {...["clear", "Clear", clear]} />
              <Button {...["swaprows", "Swap Rows", swapRows]} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          <For each={state.data}>
            {(row) => {
              const rowId = row.id;
              return (
                <tr class={isSelected(rowId) ? "danger" : ""}>
                  <td class="col-md-1" textContent={rowId} />
                  <td class="col-md-4">
                    <a onClick={() => setState("selected", rowId)} textContent={row.label} />
                  </td>
                  <td class="col-md-1">
                    <a onClick={() => setState("data", (d) => d.toSpliced(d.findIndex((d) => d.id === rowId), 1))}>
                      <span class="glyphicon glyphicon-remove" aria-hidden="true" />
                    </a>
                  </td>
                  <td class="col-md-6" />
                </tr>
              ); //prettier-ignore
            }}
          </For>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}, document.getElementById("main"));
