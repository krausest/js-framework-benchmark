import { createRoot } from 'react-dom/client';
import { observer } from 'kr-observable';
import { Row } from './Row';
import { rowsStore } from './RowsStore';
import { Fragment } from "react";

const Button = ({ children, id, onClick }) => {
  return (
    <div className="col-sm-6 smallpad">
      <button
        type="button"
        className="btn btn-primary btn-block"
        id={id}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};

const RowList = observer(function list() {
  return (
    <Fragment>
      {rowsStore.rows.map(row => (
          <Row
            key={row.id}
            data={row}
          />
        )
      )}
    </Fragment>
  )
})


function Main() {
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>Preact + kr-observable</h1>
          </div>

          <div className="col-md-6">
            <div className="row">
              <Button id="run" onClick={rowsStore.run}>
                Create 1,000 rows
              </Button>

              <Button id="runlots" onClick={rowsStore.runLots}>
                Create 10,000 rows
              </Button>

              <Button id="add" onClick={rowsStore.add}>
                Append 1,000 rows
              </Button>

              <Button id="update" onClick={rowsStore.update}>
                Update every 10th row
              </Button>

              <Button id="clear" onClick={rowsStore.clear}>
                Clear
              </Button>

              <Button id="swaprows" onClick={rowsStore.swapRows}>
                Swap Rows
              </Button>
            </div>
          </div>
        </div>
      </div>

      <table className="table table-hover table-striped test-data">
        <tbody>
        <RowList />
        </tbody>
      </table>

      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      />
    </div>
  );
}


createRoot(document.getElementById('main')).render(<Main />);
