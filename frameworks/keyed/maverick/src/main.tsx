import { ForKeyed, render, signal, tick, selector, WriteSignal } from "maverick.js";

let idCount = 1;

// prettier-ignore
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"], 
colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
  let data = new Array(count);

  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCount++,
      label: signal(
        `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${
          nouns[_random(nouns.length)]
        }`
      ),
    };
  }

  return data;
}

function Button({ id, text, onClick }) {
  return (
    <div class="col-sm-6 smallpad">
      <button id={id} class="btn btn-primary btn-block" type="button" $on:click={onClick}>
        {text}
      </button>
    </div>
  );
}

interface Data {
  id: number;
  label: WriteSignal<string>;
}

function App() {
  const $data = signal<Data[]>([]),
    $selected = signal<number>(-1),
    $selector = selector($selected),
    run = () => {
      $data.set(buildData(1000));
      tick();
    },
    runLots = () => {
      $data.set(buildData(10000));
      tick();
    },
    add = () => {
      $data.set((prev) => {
        prev.push(...buildData(1000));
        return prev.slice();
      });
      tick();
    },
    update = () => {
      const data = $data();
      for (let i = 0; i < data.length; i += 10) {
        data[i].label.set((label) => label + "  !!!");
      }
    },
    swapRows = () => {
      const data = $data();
      if (data.length > 998) {
        const a = data[1],
          b = data[998];
        data[1] = b;
        data[998] = a;
        $data.set(data.slice());
        tick();
      }
    },
    clear = () => {
      $data.set([]);
      tick();
    },
    select = (id: number) => {
      $selected.set(id);
      tick();
    },
    remove = (id: number) => {
      $data.set((prev) => {
        const index = prev.findIndex((data) => data.id === id);
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      });
      tick();
    };

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Maverick</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" text="Create 1,000 rows" onClick={run} />
              <Button id="runlots" text="Create 10,000 rows" onClick={runLots} />
              <Button id="add" text="Append 1,000 rows" onClick={add} />
              <Button id="update" text="Update every 10th row" onClick={update} />
              <Button id="clear" text="Clear" onClick={clear} />
              <Button id="swaprows" text="Swap Rows" onClick={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          <ForKeyed each={$data}>
            {(row) => {
              return (
                <tr class={$selector(row.id)() ? "danger" : ""}>
                  <td class="col-md-1" $prop:textContent={row.id} />
                  <td class="col-md-4">
                    <a $on:click={[select, row.id]} $prop:textContent={row.label()} />
                  </td>
                  <td class="col-md-1">
                    <a $on:click={[remove, row.id]}>
                      <span class="glyphicon glyphicon-remove" aria-hidden="true" />
                    </a>
                  </td>
                  <td class="col-md-6" />
                </tr>
              );
            }}
          </ForKeyed>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}

render(App, {
  target: document.getElementById("main")!,
});
