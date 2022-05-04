function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}


class Row extends art.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.item !== this.props.item || nextProps.selected !== this.props.selected;
  }
  onSelect = () => {
    this.props.select(this.props.item);
  }
  
  onRemove = () => {
    this.props.remove(this.props.item);
  }
  
  render() {
    let { selected, item } = this.props;
    return (<tr className={selected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4"><a onClick={this.onSelect}>{item.label}</a></td>
      <td className="col-md-1"><a onClick={this.onRemove}><span className="glyphicon glyphicon-remove" ariaHidden="true"></span></a></td>
      <td className="col-md-6"></td>
    </tr>);
  }
}
class Button extends art.Component {
  render() {
    return (
      <div className="col-sm-6 smallpad">
        <button type="button" className="btn btn-primary btn-block" id={this.props.id} onClick={this.props.cb}>{this.props.title}</button>
      </div>
    );
  }
}


class Jumbotron extends art.Component {
  render() {
    const { run, runLots, add, update, clear, swapRows } = this.props;
    return (
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>Art</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" cb={run} />
              <Button id="runlots" title="Create 10,000 rows" cb={runLots} />
              <Button id="add" title="Append 1,000 rows" cb={add} />
              <Button id="update" title="Update every 10th row" cb={update} />
              <Button id="clear" title="Clear" cb={clear} />
              <Button id="swaprows" title="Swap Rows" cb={swapRows} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Main extends art.Component {
  data = {
    data: [],
    selected: 0,
  };

  run = () => {
    this.setDataNow({ data: buildData(1000), selected: 0 });
  }

  runLots = () => {
    this.setDataNow({ data: buildData(10000), selected: 0 });
  }

  add = () => {
    this.setDataNow({ data: this.data.data.concat(buildData(1000)) });
  }

  update = () => {
    const data = this.data.data;
    for (let i = 0; i < data.length; i += 10) {
      const item = data[i];
      data[i] = { id: item.id, label: item.label + ' !!!' };
    }
    this.forceUpdate();
  }

  select = (item) => {
    this.setDataNow({ selected: item.id });
  }

  remove = (item) => {
    const data = this.data.data;
    data.splice(data.indexOf(item), 1);
    this.forceUpdate();
  }

  clear = () => {
    this.setDataNow({ data: [], selected: 0 });
  }

  swapRows = () => {
    const data = this.data.data;
    if (data.length > 998) {
      let temp = data[1];
      data[1] = data[998];
      data[998] = temp;
    }
    this.forceUpdate();
  }

  render() {
    return (<div className="container">
      <Jumbotron run={this.run} runLots={this.runLots} add={this.add} update={this.update} clear={this.clear} swapRows={this.swapRows} />
      <table className="table table-hover table-striped test-data"><tbody>
        {this.data.data.map((item, i) => (
          <Row key={i} item={item} selected={this.data.selected === item.id} select={this.select} remove={this.remove}></Row>
        ))}
      </tbody></table>
      <span className="preloadicon glyphicon glyphicon-remove" ariaHidden="true"></span>
    </div>);
  }
}

art.render(
  <Main />,
  document.getElementById('root'),
);
