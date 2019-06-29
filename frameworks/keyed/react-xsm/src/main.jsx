var React = require('react');
var ReactDOM = require('react-dom');
import { set, get, setcfg, bindState } from 'xsm';

setcfg({framework: 'React', sharedBindings: ['lastthis'], debug: false});

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const rowstr = 'rows';
const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let startingIdx = 1;

function buildData(count, addmore) {
  const data = new Array(count);
  var al=A.length, cl=C.length, nl=N.length;
  for (let i=0; i<count; i++) {
    data[i] = {
      id: startingIdx++,
      label: `${A[random(al)]} ${C[random(cl)]} ${N[random(nl)]}`,
    };
  }
  if( !addmore ) {
      set(rowstr, data);
  } else {
      let rows = get(rowstr);
      rows.push(...data);
      set(rowstr, rows);
  }
}

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

function Button({ id, cb, title }) {
  return (
    <div className="col-sm-6 smallpad">
      <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
    </div>
  );
}

class Jumbotron extends React.Component {
  run = () => {
    buildData(1000);
  }

  runLots = () => {
    buildData(10000);
  }

  add = () => {
    buildData(1000, true);
  }

  update = () => {
    let data = get(rowstr);
    let item;
    for (let i=0; i<data.length; i+=10) {
      item = data[i];
      data[i] = { id: item.id, label: item.label + ' !!!' };
    }
    set(rowstr, data);
  }

  clear = () => {
    set(rowstr, []);
  }

  swapRows = () => {
    let data = get(rowstr);
    if (data.length > 998) {
      let temp = data[1];
      data[1] = data[998];
      data[998] = temp;
      set(rowstr, data);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React+XSM keyed</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" cb={this.run} />
              <Button id="runlots" title="Create 10,000 rows" cb={this.runLots} />
              <Button id="add" title="Append 1,000 rows" cb={this.add} />
              <Button id="update" title="Update every 10th row" cb={this.update} />
              <Button id="clear" title="Clear" cb={this.clear} />
              <Button id="swaprows" title="Swap Rows" cb={this.swapRows} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const select = (self) => {
  let lastthis = get('lastthis');
  if( lastthis === self ) return;
  self.selected = true;
  if( lastthis ) {
      lastthis.selected = false;
      lastthis.forceUpdate();
  }
  self.forceUpdate();
  set('lastthis', self);
};

const remove = (self) => {
    let data = get(rowstr);
    
    data.splice(data.indexOf(self.props.row), 1);
    self.props.row.id = 0;
    self.forceUpdate();
};


class MyRow  extends React.Component {

  onSelect = (evt) => {
      select(this);
  }

  onRemove = () => {
      remove(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.row !== this.props.row;
  }

  render() {
    let row  = this.props.row;
    if( !row.id ) return null;

    return (<tr className={this.selected?"danger":""}>
      <td className="col-md-1">{row.id}</td>
      <td className="col-md-4"><a onClick={this.onSelect}>{row.label}</a></td>
      <td className="col-md-1"><a onClick={this.onRemove}>{GlyphIcon}</a></td>
      <td className="col-md-6"></td>
    </tr>);
  }
}

class Holder  {
    constructor() {
        bindState(this, {lastthis: null});
    }
    forceUpdate() {};
}
const holder = new Holder();

class Table  extends React.Component {
    constructor() {
        super();
        bindState(this, {rows: []});
    }

    render() {
      return this.rows.map(row => <MyRow key={row.id} row={row} />)
   }
}

class Main extends React.Component {
  render() {
    return (<div className="container">
      <Jumbotron />
      <table className="table table-hover table-striped test-data"><tbody><Table /></tbody></table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>);
  }
}

ReactDOM.render(
  <Main />,
  document.getElementById('main'),
);
