import { memo } from 'react';
import { useStore } from '@nanostores/react';
import { rows, selectedId, run, runLots, add, update, clear, swapRows, removeRow, select } from './store.js';

const Button = ({ id, title, fn }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={fn}>
      {title}
    </button>
  </div>
);

const Jumbotron = memo(
  () => (
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>Astro React Nano Stores keyed</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <Button id="run" title="Create 1,000 rows" fn={run} />
            <Button id="runlots" title="Create 10,000 rows" fn={runLots} />
            <Button id="add" title="Append 1,000 rows" fn={add} />
            <Button id="update" title="Update every 10th row" fn={update} />
            <Button id="clear" title="Clear" fn={clear} />
            <Button id="swaprows" title="Swap Rows" fn={swapRows} />
          </div>
        </div>
      </div>
    </div>
  ),
  () => true,
);

const Row = memo(
  ({ item, selected }) => (
    <tr className={selected ? 'danger' : ''}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => select(item.id)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => removeRow(item.id)}>
          <span className="glyphicon glyphicon-remove" aria-hidden="true" />
        </a>
      </td>
      <td className="col-md-6" />
    </tr>
  ),
  (prev, next) => prev.selected === next.selected && prev.item === next.item,
);

export default function App() {
  const $rows = useStore(rows);
  const $selectedId = useStore(selectedId);

  return (
    <div className="container">
      <Jumbotron />
      <table className="table table-hover table-striped test-data">
        <tbody>
          {$rows.map((item) => (
            <Row key={item.id} item={item} selected={$selectedId === item.id} />
          ))}
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  );
}
