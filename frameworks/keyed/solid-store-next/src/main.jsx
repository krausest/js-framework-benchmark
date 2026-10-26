import { createStore } from "solid-js";
import { render } from "@solidjs/web";

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
  const [state, setState] = createStore({ data: [] });
  const [selected, setSelected] = createStore({ selected: null });
  const run = () => setState((s) => { s.data = buildData(1_000); });
  const runLots = () => setState((s) => { s.data = buildData(10_000); });
  const add = () => setState((s) => { s.data.push(...buildData(1_000)); });
  const update = () =>
    setState((s) => {
      for (let i = 0, d = s.data, len = d.length; i < len; i += 10) d[i].label += " !!!";
    });
  const swapRows = () =>
    setState((s) => {
      const d = s.data;
      if (d.length > 998) {
        const item = d[1];
        d[1] = d[998];
        d[998] = item;
      }
    });
  const clear = () => setState((s) => { s.data = []; });
  const select = (id) =>
    setSelected((s) => {
      const prev = s.selected;
      if (prev != null && id !== prev) delete s[prev];
      s[id] = true;
      s.selected = id;
    });
  const remove = (id) => setState((s) => { s.data.splice(s.data.findIndex((d) => d.id === id), 1); });

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Solid Store Next</h1>
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
                <tr class={selected[rowId] ? "danger" : ""}>
                  <td class="col-md-1" textContent={rowId} />
                  <td class="col-md-4">
                    <a onClick={() => select(rowId)} textContent={row.label} />
                  </td>
                  <td class="col-md-1">
                    <a onClick={() => remove(rowId)}>
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
