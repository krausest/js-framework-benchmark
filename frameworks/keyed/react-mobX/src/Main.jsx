import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Row } from './Row';
import { RowsStore } from './RowsStore';

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

const _RowList = ({ store }) => {
  return store.rows.map((row) => (
    <Row
      key={row.id}
      data={row}
      onSelect={store.select}
      onDelete={store.delete}
      isSelected={store.selectedRowId === row.id}
    />
  ));
};

const RowList = observer(_RowList);

const _Main = () => {
  const [store] = useState(() => new RowsStore());

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>React + Mobx</h1>
          </div>

          <div className="col-md-6">
            <div className="row">
              <Button id="run" onClick={store.run}>
                Create 1,000 rows
              </Button>

              <Button id="runlots" onClick={store.runLots}>
                Create 10,000 rows
              </Button>

              <Button id="add" onClick={store.add}>
                Append 1,000 rows
              </Button>

              <Button id="update" onClick={store.update}>
                Update every 10th row
              </Button>

              <Button id="clear" onClick={store.clear}>
                Clear
              </Button>

              <Button id="swaprows" onClick={store.swapRows}>
                Swap Rows
              </Button>
            </div>
          </div>
        </div>
      </div>

      <table className="table table-hover table-striped test-data">
        <tbody>
          <RowList store={store} />
        </tbody>
      </table>

      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      />
    </div>
  );
};

const Main = observer(_Main);

createRoot(document.getElementById('main')).render(<Main />);
