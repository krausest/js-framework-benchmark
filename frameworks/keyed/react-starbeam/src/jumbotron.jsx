import React from 'react';

function Button({ id, title, onClick }) {
  return (
    <div className="col-sm-6 smallpad">
      <button
        type="button"
        className="btn btn-primary btn-block"
        id={id}
        onClick={onClick}>{title}</button>
    </div>
  );
}

export function Jumbotron({ table }) {
  return (
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>React with starbeam keyed</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <Button id="run" title="Create 1,000 rows" onClick={table.run} />
            <Button id="runlots" title="Create 10,000 rows" onClick={table.runLots} />
            <Button id="add" title="Append 1,000 rows" onClick={table.add} />
            <Button id="update" title="Update every 10th row" onClick={table.update} />
            <Button id="clear" title="Clear" onClick={table.clear} />
            <Button id="swaprows" title="Swap Rows" onClick={table.swapRows} />
          </div>
        </div>
      </div>
    </div>
  )
}

