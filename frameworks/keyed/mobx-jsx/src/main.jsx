import { observable, action } from 'mobx';
import { r, selectWhen, root } from 'mobx-jsx';

function _random (max) {
  return Math.round(Math.random() * 1000) % max;
};

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
  <div class ='col-sm-6 smallpad'>
    <button id={ id } class='btn btn-primary btn-block' type='button' onClick={ fn }>{ text }</button>
  </div>

const App = () => {
  const state = observable({data: [], selected: null});

  const clickRow = (e, id, intent) => {
    action(() => {
      if (intent === 'remove') {
        const data = state.data.slice(0);
        data.splice(data.findIndex(d => d.id === id), 1)
        state.data = data;
      } else state.selected = id;
    })();
  };

  const run = action(e => {
    state.data = buildData(1000);
    state.selected = null;
  });

  const runLots = action(e => {
    state.data = buildData(10000);
    state.selected = null;
  });

  const add = action(e => {
    state.data = state.data.concat(buildData(1000));
  });

  const update = action(e => {
    let index = 0;
    while (index < state.data.length) {
      state.data[index].label += ' !!!';
      index += 10;
    }
  });

  const swapRows = action(e => {
    if (state.data.length > 998) {
      let data = state.data.slice(0);
      data[1] = state.data[998];
      data[998] = state.data[1];
      state.data = data;
    }
  });

  const clear = action(e => {
    state.data = [];
    state.selected = null;
  });

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class ='col-md-6'><h1>MobX-JSX Keyed</h1></div>
      <div class ='col-md-6'><div class ='row'>
        <Button id='run' text='Create 1,000 rows' fn={ run } />
        <Button id='runlots' text='Create 10,000 rows' fn={ runLots } />
        <Button id='add' text='Append 1,000 rows' fn={ add } />
        <Button id='update' text='Update every 10th row' fn={ update } />
        <Button id='clear' text='Clear' fn={ clear } />
        <Button id='swaprows' text='Swap Rows' fn={ swapRows } />
      </div></div>
    </div></div>
    <table class='table table-hover table-striped test-data'><tbody onClick={ clickRow }>
      <$ each={ state.data } afterRender={selectWhen(() => state.selected, 'danger')}>{
        row =>
          <tr model={ row.id }>
            <td class='col-md-1' textContent={ row.id } />
            <td class='col-md-4'><a>{( row.label )}</a></td>
            <td class='col-md-1'><a action={'remove'}><span class='glyphicon glyphicon-remove' /></a></td>
            <td class='col-md-6'/>
          </tr>
      }</$>
    </tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>
}

root(() => document.getElementById("main").appendChild(<App />))
