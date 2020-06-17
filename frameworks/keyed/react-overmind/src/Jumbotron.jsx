import React from "react";
import { useApp } from "./app";

function Button({ id, cb, title }) {
    return (
      <div className="col-sm-6 smallpad">
        <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
      </div>
    );
  }

export function Jumbotron() {
  const { actions } = useApp();

  return (
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>React and Overmind</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <Button id="run" title="Create 1,000 rows" cb={actions.run} />
            <Button
              id="runlots"
              title="Create 10,000 rows"
              cb={actions.runLots}
            />
            <Button id="add" title="Append 1,000 rows" cb={actions.add} />
            <Button
              id="update"
              title="Update every 10th row"
              cb={actions.update}
            />
            <Button id="clear" title="Clear" cb={actions.clear} />
            <Button id="swaprows" title="Swap Rows" cb={actions.swapRows} />
          </div>
        </div>
      </div>
    </div>
  );
}
