import { observable, action, autorun, untracked } from 'mobx';
import { Component, map, render, wrap } from 'mobx-jsx';

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

const List = props => {
  const mapped = map(props.each, props.children),
    cache = observable.box();
  autorun(() => cache.set(mapped()));
  wrap(tr => {
    let i, s = props.selected;
    untracked(() => {
      if (tr) tr.className = "";
      if ((tr = s && (i = props.each.findIndex(el => el.id === s)) > -1 && cache.get()[i]))
        tr.className = "danger";
    });
    return tr;
  });
  return cache.get.bind(cache);
};

class App extends Component {
  @observable data = [];
  @observable selected = null;
  @action.bound run() {
    this.data.replace(buildData(1000));
    this.selected = null;
  };
  @action.bound runLots() {
    this.data.replace(buildData(10000));
    this.selected = null;
  };
  @action.bound add() { this.data.spliceWithArray(this.data.length, 0, buildData(1000)); };
  @action.bound update() {
    let index = 0;
    while (index < this.data.length) {
      this.data[index].label += ' !!!';
      index += 10;
    }
  }
  @action.bound swapRows() {
    if (this.data.length > 998) {
      let a = this.data[1];
    	this.data[1] = this.data[998];
      this.data[998] = a;
    }
  }
  @action.bound clear() {
    this.data.clear();
    this.selected = null;
  }
  @action.bound remove(item) { this.data.remove(item) };
  @action.bound select(itemId) { this.selected = itemId };

  render() {
    let rowId;
    const { run, runLots, add, update, clear, swapRows, select, remove } = this;

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
        <List each={ this.data } selected={ this.selected }>{ row => (
          rowId = row.id,
          <tr>
            <td class='col-md-1' textContent={ rowId } />
            <td class='col-md-4'><a onClick={[select, rowId]} textContent={ row.label } /></td>
            <td class='col-md-1'><a onClick={[remove, row]}><span class='glyphicon glyphicon-remove' aria-hidden="true" /></a></td>
            <td class='col-md-6'/>
          </tr>
        )}</List>
      </tbody></table>
      <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
    </div>
  }
}

render(() => <App />, document.getElementById("main"));
