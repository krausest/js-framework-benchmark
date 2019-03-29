import React from 'react';
import ReactDOM from 'react-dom';
import {Djinn, DjinnService} from 'djinn-state';
import {createUseService} from 'djinn-state-react';

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    }
  }
  return data;
}


class Service extends DjinnService {
  state = {
    data: [],
    selected: 0,
  };

  run = () => {
    this.patch({ data: buildData(1000), selected: 0 });
  };

  runLots = () => {
    this.patch({ data: buildData(10000), selected: 0 });
  };

  add = () => {
    const { data, selected } = this.state;
    this.patch({ data: data.concat(buildData(1000)), selected });
  };

  update = () => {
    const { data, selected } = this.state;
    const newData = data.slice();

    for (let i = 0; i < newData.length; i += 10) {
      const r = newData[i];
      newData[i] = { id: r.id, label: r.label + " !!!" };
    }

    this.patch({ data: newData, selected });
  };

  remove = (id) => {
    const { data, selected } = this.state;
    const idx = data.findIndex((d) => d.id === id);

    this.patch({ data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected });
  };

  select = (id) => {
    this.patch({ selected: id });
  };

  clear = () => this.patch({ data: [], selected: 0 });

  swapRows = () => {
    const { data, selected } = this.state;
    this.patch({ data: [data[0], data[998], ...data.slice(2, 998), data[1], data[999]], selected });
  }
}


const djinn = new Djinn();
const useService = createUseService(djinn);

djinn.register(Service);

djinn.start();


const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"/>;


class Row extends React.Component {
  onSelect = () => {
    this.props.onSelect(this.props.item.id);
  }

  onRemove = () => {
    this.props.onRemove(this.props.item.id);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.item !== this.props.item || nextProps.selected !== this.props.selected;
  }

  render() {
    let { selected, item } = this.props;
    return (<tr className={selected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4"><a onClick={this.onSelect}>{item.label}</a></td>
      <td className="col-md-1"><a onClick={this.onRemove}>{GlyphIcon}</a></td>
      <td className="col-md-6"/>
    </tr>);
  }
}

const RowList = ({ data, selected, onSelect, onRemove }) => data.map((item) => (
  <Row key={item.id}
       item={item}
       selected={item.id === selected}
       onSelect={onSelect}
       onRemove={onRemove}/>
));

function Button(props) {
  return (
    <div className="col-sm-6 smallpad">
      <button type="button" className="btn btn-primary btn-block" id={props.id} onClick={props.cb}>{props.title}</button>
    </div>
  );
}

const Main = () => {
  const service = useService(Service);

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React + Djinn</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button id="run" title="Create 1,000 rows" cb={service.run} />
              <Button id="runlots" title="Create 10,000 rows" cb={service.runLots} />
              <Button id="add" title="Append 1,000 rows" cb={service.add} />
              <Button id="update" title="Update every 10th row" cb={service.update} />
              <Button id="clear" title="Clear" cb={service.clear} />
              <Button id="swaprows" title="Swap Rows" cb={service.swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
          <RowList data={service.state.data}
                   selected={service.state.selected}
                   onSelect={service.select}
                   onRemove={service.remove}/>
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"/>
    </div>
  );
};

ReactDOM.render(
  <Main />,
  document.getElementById("main")
);
