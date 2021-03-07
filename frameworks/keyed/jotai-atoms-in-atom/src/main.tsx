import { memo, FC } from "react";
import ReactDOM from "react-dom";
import { atom, useAtom, PrimitiveAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";

import { buildData, Data } from "./utils";

type RowAtom = PrimitiveAtom<Data & { selected: boolean }>;

function buildAtomData(amount: number) {
  return buildData(amount).map((data) => atom({ ...data, selected: false }));
}

const stateAtom = atom<{
  data: RowAtom[];
  selectedAtom: RowAtom | null;
}>({ data: [], selectedAtom: null });

const createRowsAtom = atom(null, (_, set, amount: number) =>
  set(stateAtom, { data: buildAtomData(amount), selectedAtom: null })
);

const appendRowsAtom = atom(null, (_, set) =>
  set(stateAtom, (state) => ({
    ...state,
    data: state.data.concat(buildAtomData(1000))
  }))
);

const updateRowsAtom = atom(null, (get, set) => {
  const { data } = get(stateAtom);
  for (let i = 0; i < data.length; i += 10) {
    set(data[i], (row) => ({
      id: row.id,
      label: row.label + " !!!",
      selected: row.selected,
    }));
  }
});

const removeRowAtom = atom(null, (_, set, row: RowAtom) =>
  set(stateAtom, (state) => {
    const idx = state.data.indexOf(row);
    return {
      ...state,
      data: [...state.data.slice(0, idx), ...state.data.slice(idx + 1)]
    };
  })
);

const selectRowAtom = atom(null, (get, set, row: RowAtom) => {
  const { data, selectedAtom } = get(stateAtom);
  if (selectedAtom) {
    set(selectedAtom, (prev) => ({ ...prev, selected: false }));
  }
  set(row, (prev) => ({ ...prev, selected: true }));
  set(stateAtom, { data, selectedAtom: row });
});

const clearStateAtom = atom(null, (_, set) => set(stateAtom, {
  data: [],
  selectedAtom: null,
}));

const swapRowsAtom = atom(null, (_, set) =>
  set(stateAtom, (state) => {
    return state.data.length > 998
      ? {
        ...state,
        data: [state.data[0], state.data[998], ...state.data.slice(2, 998), state.data[1], state.data[999]]
      }
      : state;
  })
);

const GlyphIcon = (
  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
);

interface RowProps {
  atom: RowAtom;
  selectRow: (atom: RowAtom) => void;
  removeRow: (atom: RowAtom) => void;
}

const Row = memo<RowProps>(({ atom, selectRow, removeRow }) => {
  const [rowAtom] = useAtom(atom);
  /*
  const [, selectRow] = useAtom(selectRowAtom);
  const [, removeRow] = useAtom(removeRowAtom);
  */

  return (
    <tr className={rowAtom.selected ? "danger" : ""}>
      <td className="col-md-1">{rowAtom.id}</td>
      <td className="col-md-4">
        <a onClick={() => selectRow(atom)}>{rowAtom.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => removeRow(atom)}>{GlyphIcon}</a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
});

interface RowListProp {
  selectRow: (atom: RowAtom) => void;
  removeRow: (atom: RowAtom) => void;
}

const RowList = memo<RowListProp>(({ selectRow, removeRow }) => {
  const [state] = useAtom(stateAtom);
  return (
    <>
      {state.data.map((atom) => (
        <Row key={String(atom)} atom={atom} selectRow={selectRow} removeRow={removeRow} />
      ))}
    </>
  );
});

interface ButtonProps {
  id: string;
  title: string;
  cb: () => void;
}

const Button = memo<ButtonProps>(({ id, title, cb }) => (
  <div className="col-sm-6 smallpad">
    <button
      type="button"
      className="btn btn-primary btn-block"
      id={id}
      onClick={cb}
    >
      {title}
    </button>
  </div>
));

const Main: FC = () => {
  /*
  const [, createRows] = useAtom(createRowsAtom);
  const [, appendRows] = useAtom(appendRowsAtom);
  const [, updateRows] = useAtom(updateRowsAtom);
  const [, clearState] = useAtom(clearStateAtom);
  const [, swapRows] = useAtom(swapRowsAtom);
  */
  const createRows = useUpdateAtom(createRowsAtom);
  const appendRows = useUpdateAtom(appendRowsAtom);
  const updateRows = useUpdateAtom(updateRowsAtom);
  const clearState = useUpdateAtom(clearStateAtom);
  const swapRows = useUpdateAtom(swapRowsAtom);
  const selectRow = useUpdateAtom(selectRowAtom);
  const removeRow = useUpdateAtom(removeRowAtom);
  return (
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>Jotai</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <Button
                id="run"
                title="Create 1,000 rows"
                cb={() => createRows(1000)}
              />
              <Button
                id="runlots"
                title="Create 10,000 rows"
                cb={() => createRows(10000)}
              />
              <Button id="add" title="Append 1,000 rows" cb={appendRows} />
              <Button
                id="update"
                title="Update every 10th row"
                cb={updateRows}
              />
              <Button id="clear" title="Clear" cb={clearState} />
              <Button id="swaprows" title="Swap Rows" cb={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody>
          <RowList selectRow={selectRow} removeRow={removeRow} />
        </tbody>
      </table>
      <span
        className="preloadicon glyphicon glyphicon-remove"
        aria-hidden="true"
      ></span>
    </div>
  );
};

ReactDOM.render(<Main />, document.getElementById("main"));
