import { memo, FC } from "react";
import ReactDOM from "react-dom";
import { atom, useAtom, PrimitiveAtom } from "jotai";
import { useUpdateAtom, useAtomValue } from "jotai/utils";

import { buildData, Data } from "./utils";

function buildAtomData(amount: number) {
  return buildData(amount).map((data) => atom(data));
}

const stateAtom = atom<{ data: PrimitiveAtom<Data>[]; selected: number }>({
  data: [],
  selected: 0,
});

const selectedIdAtom = atom((get) => get(stateAtom).selected);

const createRowsAtom = atom(null, (_, set, amount: number) =>
  set(stateAtom, { data: buildAtomData(amount), selected: 0 })
);

const appendRowsAtom = atom(null, (_, set) =>
  set(stateAtom, (state) => ({
    data: state.data.concat(buildAtomData(1000)),
    selected: 0,
  }))
);

const updateRowsAtom = atom(null, (get, set) =>
  set(stateAtom, ({ data, selected }) => {
    const newData = data.slice(0);
    for (let i = 0; i < newData.length; i += 10) {
      const r = newData[i];
      newData[i] = atom({ id: get(r).id, label: get(r).label + " !!!" });
    }
    return { data: newData, selected };
  })
);

const removeRowAtom = atom(null, (_, set, atom: PrimitiveAtom<Data>) =>
  set(stateAtom, ({ data, selected }) => {
    const idx = data.findIndex((d) => d === atom);
    return { data: [...data.slice(0, idx), ...data.slice(idx + 1)], selected };
  })
);

const selectRowAtom = atom(null, (get, set, atom: PrimitiveAtom<Data>) => {
  const rowAtoms = get(stateAtom);
  const rowAtom = rowAtoms.data.find((rowAtom) => rowAtom === atom);
  if (rowAtom) {
    set(stateAtom, (prev) => ({ data: prev.data, selected: get(rowAtom).id }));
  }
});

const clearStateAtom = atom(null, (_, set) =>
  set(stateAtom, () => ({
    data: [],
    selected: 0,
  }))
);

const swapRowsAtom = atom(null, (_, set) =>
  set(stateAtom, (state) => {
    const { data, selected } = state;
    return data.length > 998
      ? {
          data: [data[0], data[998], ...data.slice(2, 998), data[1], data[999]],
          selected,
        }
      : state;
  })
);

const GlyphIcon = (
  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
);

interface RowProps {
  atom: PrimitiveAtom<Data>;
}

const Row = memo<RowProps>(({ atom }) => {
  const rowAtom = useAtomValue(atom);
  const [, selectRow] = useAtom(selectRowAtom);
  const [, removeRow] = useAtom(removeRowAtom);
  const selectedRow = useAtomValue(selectedIdAtom);
  const isSelected = rowAtom.id === selectedRow;
  return (
    <tr className={isSelected ? "danger" : ""}>
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
  const { data } = useAtomValue(stateAtom);
  return (
    <>
      {data.map((atom) => (
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
