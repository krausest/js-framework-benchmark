import { createRoot, createState } from 'solid-js';
import { r, selectWhen } from 'solid-js/dom';

let idCounter = 1;
const adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"],
  colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"],
  nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

function _random (max) { return Math.round(Math.random() * 1000) % max; };

function buildData(count) {
  let data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: idCounter++,
      label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
    }
  }
  return data;
}

const Button = ({ id, text, fn }) =>
  <div class='col-sm-6 smallpad'>
    <button id={ id } class='btn btn-primary btn-block' type='button' onClick={ fn }>{ text }</button>
  </div>

const App = () => {
  const [ state, setState ] = createState({ data: [], selected: null }),
    run = () => setState({ data: buildData(1000), selected: null }),
    runLots = () => setState({ data: buildData(10000), selected: null }),
    add = () => setState('data', d => [...d, ...buildData(1000)]),
    update = () => setState('data', { by: 10 }, 'label', l => l + ' !!!'),
    swapRows = () => setState('data', d => d.length > 998 ? { 1: d[998], 998: d[1] } : d),
    clear = () => setState({ data: [], selected: null }),
    select = (e, id) => setState('selected', id),
    remove = (e, id) => setState('data', d => {
      const idx = d.findIndex(d => d.id === id);
      return [...d.slice(0, idx), ...d.slice(idx + 1)];
    });

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class='col-md-6'><h1>SolidJS Keyed</h1></div>
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
      <$ each={ state.data } afterRender={ selectWhen(() => state.selected, 'danger') }>{ row =>
        <tr model={ row.id }>
          <td class='col-md-1' textContent={ row.id } />
          <td class='col-md-4'><a onClick={ select }>{( row.label )}</a></td>
          <td class='col-md-1'><a onClick={ remove }><span class='glyphicon glyphicon-remove' /></a></td>
          <td class='col-md-6'/>
        </tr>
      }</$>
    </tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>
}

createRoot(() => document.getElementById("main").appendChild(<App />))
