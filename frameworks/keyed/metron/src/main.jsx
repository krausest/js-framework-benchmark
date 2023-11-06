import { createMutatorAtom } from "metron-core/atom.js";
import { untracked } from "metron-core/particle.js";
import { createAtomList } from "metron-core/list.js";
import { createSelector } from "metron-core/selector.js";
import { render } from "metron-jsx/web-dom/render.js";
import { template } from "metron-jsx/web-dom/template.js";

let idCounter = 1;
const adjectives = [
    "pretty",
    "large",
    "big",
    "small",
    "tall",
    "short",
    "long",
    "handsome",
    "plain",
    "quaint",
    "clean",
    "elegant",
    "easy",
    "angry",
    "crazy",
    "helpful",
    "mushy",
    "odd",
    "unsightly",
    "adorable",
    "important",
    "inexpensive",
    "cheap",
    "expensive",
    "fancy",
  ],
  colours = [
    "red",
    "yellow",
    "blue",
    "green",
    "pink",
    "brown",
    "purple",
    "brown",
    "white",
    "black",
    "orange",
  ],
  nouns = [
    "table",
    "chair",
    "house",
    "bbq",
    "desk",
    "car",
    "pony",
    "cookie",
    "sandwich",
    "burger",
    "pizza",
    "mouse",
    "keyboard",
  ];

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    const [label, mutateLabel] = createMutatorAtom(
      `${adjectives[_random(adjectives.length)]} ${
        colours[_random(colours.length)]
      } ${nouns[_random(nouns.length)]}`
    );

    const id = idCounter++;

    data[i] = {
      id,
      label,
      mutateLabel,
    };
  }
  return data;
}

function Button({ id, text, fn }) {
  return (
    <div class="col-sm-6 smallpad">
      <button
        id={id}
        class="btn btn-primary btn-block"
        type="button"
        on:click={fn}
      >
        {text}
      </button>
    </div>
  );
}

const [data, dataWriter] = createAtomList([]);
const rawData = untracked(data);

const [selector, setSelected] = createSelector();

const run = () => {
  dataWriter.replace(buildData(1000));
};

const runLots = () => {
  dataWriter.replace(buildData(10_000));
};

const add = () => {
  dataWriter.append(buildData(1000));
};

const update = () => {
  const length = rawData.size;
  for (let i = 0; i < length; i += 10) {
    const item = rawData.at(i);
    item.mutateLabel((text) => text + " !!!");
  }
};

const swapRows = () => {
  if (rawData.size > 998) {
    dataWriter.swap(1, 998);
  }
};

const clear = dataWriter.clear;

const remove = (id) => {
  let idx = -1;

  let i = 0;
  for (const item of rawData) {
    if (item.id === id) {
      idx = i;
      break;
    }
    i++;
  }

  dataWriter.delete(idx);
};

const appRoot = document.querySelector("#main");

const Row = template(({ id, onRemove, onSelect, className, label }) => (
  <tr class={className}>
    <td class="col-md-1">{id}</td>
    <td class="col-md-4">
      <a on:click={onSelect}>{label}</a>
    </td>
    <td class="col-md-1">
      <a on:click={onRemove}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true" />
      </a>
    </td>
    <td class="col-md-6" />
  </tr>
));

const App = (
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Metron Keyed</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <Button id="run" text="Create 1,000 rows" fn={run} />
            <Button id="runlots" text="Create 10,000 rows" fn={runLots} />
            <Button id="add" text="Append 1,000 rows" fn={add} />
            <Button id="update" text="Update every 10th row" fn={update} />
            <Button id="clear" text="Clear" fn={clear} />
            <Button id="swaprows" text="Swap Rows" fn={swapRows} />
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-data">
      <tbody>
        {data.map(({ id, label }) => (
          <Row
            id={id}
            className={selector(id, (isSelected) =>
              isSelected ? "danger" : ""
            )}
            label={label}
            onRemove={() => remove(id)}
            onSelect={() => setSelected(id)}
          />
        ))}
      </tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
  </div>
);

render({
  root: appRoot,
  children: App,
});
