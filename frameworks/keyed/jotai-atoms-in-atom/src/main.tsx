import { memo, FC } from "react";
import ReactDOM from "react-dom";
import { atom, useAtom, PrimitiveAtom } from "jotai";
import { useUpdateAtom, useAtomValue } from "jotai/utils";

import { buildData, Data } from "./utils";

type RowAtom = PrimitiveAtom<Data & { selected: boolean }>;

function buildAtomData(amount: number) {
  return buildData(amount).map((data) => atom({ ...data, selected: false }));
}

const stateAtom = atom<RowAtom[]>([]);

const createRowsAtom = atom(null, (_, set, amount: number) =>
  set(stateAtom, buildAtomData(amount))
);

const appendRowsAtom = atom(null, (_, set) =>
  set(stateAtom, (state) => state.concat(buildAtomData(1000)))
);

const updateRowsAtom = atom(null, (get, set) =>
  set(stateAtom, (state) => {
    const newData = state.slice(0);
    for (let i = 0; i < newData.length; i += 10) {
      const row = get(newData[i]);
      newData[i] = atom({
        id: row.id,
        label: row.label + " !!!",
        selected: row.selected,
      });
    }
    return newData;
  })
);

const removeRowAtom = atom(null, (_, set, atom: RowAtom) =>
  set(stateAtom, (state) => {
    const idx = state.findIndex((d) => d === atom);
    return [...state.slice(0, idx), ...state.slice(idx + 1)];
  })
);

const selectRowAtom = atom(null, (get, set, atom: RowAtom) => {
  const rowAtoms = get(stateAtom);
  const rowAtom = rowAtoms.find((rowAtom) => rowAtom === atom);
  const selectedAtom = rowAtoms.find(
    (rowAtom) => get(rowAtom).selected === true
  );
  selectedAtom && set(selectedAtom, (prev) => ({ ...prev, selected: false }));
  rowAtom && set(rowAtom, (prev) => ({ ...prev, selected: true }));
});

const clearStateAtom = atom(null, (_, set) => set(stateAtom, []));

const swapRowsAtom = atom(null, (_, set) =>
  set(stateAtom, (state) => {
    return state.length > 998
      ? [state[0], state[998], ...state.slice(2, 998), state[1], state[999]]
      : state;
  })
);

const GlyphIcon = (
  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
);

interface RowProps {
  atom: RowAtom;
}

const Row = memo<RowProps>(({ atom }) => {
  const rowAtom = useAtomValue(atom);
  const [, selectRow] = useAtom(selectRowAtom);
  const [, removeRow] = useAtom(removeRowAtom);

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

const RowList = memo(() => {
  const rowAtoms = useAtomValue(stateAtom);
  return (
    <>
      {rowAtoms.map((atom) => (
        <Row key={String(atom)} atom={atom} />
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
  const createRows = useUpdateAtom(createRowsAtom);
  const appendRows = useUpdateAtom(appendRowsAtom);
  const updateRows = useUpdateAtom(updateRowsAtom);
  const clearState = useUpdateAtom(clearStateAtom);
  const swapRows = useUpdateAtom(swapRowsAtom);
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
          <RowList />
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
