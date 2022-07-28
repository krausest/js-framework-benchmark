import { action, observable } from "mobx";
import { map, render, createSelector } from "mobx-jsx";

function _random (max) { return Math.round(Math.random() * 1000) % max; };

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
    }
  }
  return data;
}

const Button = ({ id, text, fn }) =>
  <div class='col-sm-6 smallpad'>
    <button id={ id } class='btn btn-primary btn-block' type='button' onClick={ fn }>{ text }</button>
  </div>

const App = () => {
  const data = observable([]),
    selected = observable.box(null),
    isSelected = createSelector(() => selected.get()),
    run = action(() => {
      data.replace(buildData(1000));
      selected.set(null);
    }),
    runLots = action(() => {
      data.replace(buildData(10000));
      selected.set(null);
    }),
    add = action(() => data.spliceWithArray(data.length, 0, buildData(1000))),
    update = action(() => {
      let index = 0;
      while (index < data.length) {
        data[index].label += " !!!";
        index += 10;
      }
    }),
    swapRows = action(() => {
      if (data.length > 998) {
        let a = data[1];
        data[1] = data[998];
        data[998] = a;
      }
    }),
    clear = action(() => {
      data.clear();
      selected.set(null);
    }),
    remove = action((item) => data.remove(item)),
    select = action((itemId) => selected.set(itemId));

  const list = map(data, row => {
    const rowId = row.id;
    return <tr class={isSelected(rowId) ? "danger" : ""}>
      <td class='col-md-1' textContent={ rowId } />
      <td class='col-md-4'><a onClick={[select, rowId]} textContent={ row.label } /></td>
      <td class='col-md-1'><a onClick={[remove, row]}><span class='glyphicon glyphicon-remove' aria-hidden="true" /></a></td>
      <td class='col-md-6'/>
    </tr>
  });

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class='col-md-6'><h1>MobX-JSX Keyed</h1></div>
      <div class='col-md-6'><div class='row'>
        <Button id='run' text='Create 1,000 rows' fn={ run } />
        <Button id='runlots' text='Create 10,000 rows' fn={ runLots } />
        <Button id='add' text='Append 1,000 rows' fn={ add } />
        <Button id='update' text='Update every 10th row' fn={ update } />
        <Button id='clear' text='Clear' fn={ clear } />
        <Button id='swaprows' text='Swap Rows' fn={ swapRows } />
      </div></div>
    </div></div>
    <table class='table table-hover table-striped test-data'><tbody>
      {list}
    </tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>
};

render(() => <App />, document.getElementById("main"));
