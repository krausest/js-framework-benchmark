import { observable, action, autorun } from 'mobx';
import { Component, map, render } from 'mobx-jsx';

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

class App extends Component {
  @observable data = [];
  @observable selected = null;
  remove = (e, item) => action(() => this.data.remove(item))();
  select = (e, item) =>  action(() => this.selected = item)();

  @action.bound run(e) {
    this.data.replace(buildData(1000));
    this.selected = null;
  };
  @action.bound runLots(e) {
    this.data.replace(buildData(10000));
    this.selected = null;
  };
  @action.bound add(e) { this.data.spliceWithArray(this.data.length, 0, buildData(1000)); };
  @action.bound update(e) {
    let index = 0;
    while (index < this.data.length) {
      this.data[index].label += ' !!!';
      index += 10;
    }
  }
  @action.bound swapRows(e) {
    if (this.data.length > 998) {
      let a = this.data[1];
    	this.data[1] = this.data[998];
      this.data[998] = a;
    }
  }
  @action.bound clear(e) {
    this.data.clear();
    this.selected = null;
  }
  selectRow(rows) {
    let tr;
    const b = observable.box();
    autorun(() => b.set(rows()));
    autorun(() => {
      const s = this.selected;
      if (tr) tr.className = '';
      if (tr = s && b.get().find(tr => tr.model === s)) tr.className = 'danger';
    });
    return () => b.get();
  }

  render() {
    let rowId;
    const { run, runLots, add, update, clear, swapRows, select, remove } = this,
      items = this.selectRow(map(this.data, row => (
        rowId = row.id,
        <tr model={ row }>
          <td class='col-md-1' textContent={ rowId } />
          <td class='col-md-4'><a onClick={ select } textContent={ row.label } /></td>
          <td class='col-md-1'><a onClick={ remove }><span class='glyphicon glyphicon-remove' aria-hidden='true' /></a></td>
          <td class='col-md-6'/>
        </tr>
      )));

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
      <table class='table table-hover table-striped test-data'><tbody>{
        items
      }</tbody></table>
      <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
    </div>
  }
}

render(() => <App />, document.getElementById("main"));
