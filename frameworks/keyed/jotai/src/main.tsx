import { memo, FC } from "react";
import ReactDOM from "react-dom";
import { atom } from "jotai";
import { useUpdateAtom, useAtomValue } from "jotai/utils";

import { buildData, Data } from "./utils";

const stateAtom = atom<{ data: Data[]; selected: number }>({
  data: [],
  selected: 0,
});

const createRowsAtom = atom(null, (_, set, amount: number) =>
  set(stateAtom, { data: buildData(amount), selected: 0 })
);

const appendRowsAtom = atom(null, (_, set) =>
  set(stateAtom, (state) => ({
    data: state.data.concat(buildData(1000)),
    selected: 0,
  }))
);

const updateRowsAtom = atom(null, (_, set) =>
  set(stateAtom, (state) => {
    const newState = { ...state };
    for (let i = 0; i < newState.data.length; i += 10) {
      const r = newState.data[i];
      newState.data[i] = { id: r.id, label: r.label + " !!!" };
    }
    return newState;
  })
);

const removeRowAtom = atom(null, (_, set, id: number) =>
  set(stateAtom, (state) => {
    const newState = { ...state };
    const idx = newState.data.findIndex((d) => d.id === id);
    newState.data.splice(idx, 1);
    return newState;
  })
);

const selectRowAtom = atom(null, (_, set, selected: number) =>
  set(stateAtom, (state) => ({ data: state.data, selected }))
);

const clearStateAtom = atom(null, (_, set) =>
  set(stateAtom, () => ({
    data: [],
    selected: 0,
  }))
);

const swapRowsAtom = atom(null, (_, set) =>
  set(stateAtom, (state) => {
    const newState = { ...state };
    const tmp = newState.data[1];
    newState.data[1] = newState.data[998];
    newState.data[998] = tmp;
    return newState;
  })
);

const GlyphIcon = (
  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
);

interface RowProps {
  id: number;
  label: string;
  isSelected: boolean;
}

const Row = memo<RowProps>(({ id, label, isSelected }) => {
  const selectRow = useUpdateAtom(selectRowAtom);
  const removeRow = useUpdateAtom(removeRowAtom);
  return (
    <tr className={isSelected ? "danger" : ""}>
      <td className="col-md-1">{id}</td>
      <td className="col-md-4">
        <a onClick={() => selectRow(id)}>{label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => removeRow(id)}>{GlyphIcon}</a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
});

const RowList = memo(() => {
  const { data, selected } = useAtomValue(stateAtom);
  return (
    <>
      {data.map((item) => (
        <Row
          key={item.id}
          id={item.id}
          label={item.label}
          isSelected={selected === item.id}
        />
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
              <Button
                id="add"
                title="Append 1,000 rows"
                cb={appendRows}
              />
              <Button
                id="update"
                title="Update every 10th row"
                cb={updateRows}
              />
              <Button
                id="clear"
                title="Clear"
                cb={clearState}
              />
              <Button
                id="swaprows"
                title="Swap Rows"
                cb={swapRows}
              />
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
