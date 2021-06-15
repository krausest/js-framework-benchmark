import React, { memo, FC } from "react";
import ReactDOM from "react-dom";
import { atom, useAtom, PrimitiveAtom } from "jotai";
import { useUpdateAtom } from "jotai/utils";

import { Data, buildDataAtoms } from "./utils";

const dataAtom = atom<PrimitiveAtom<Data>[]>([]);
const selectedAtom = atom<PrimitiveAtom<Data> | null>(null);

const createRowsAtom = atom(null, (_, set, amount: number) => {
  set(dataAtom, buildDataAtoms(amount));
  set(selectedAtom, null);
});

const appendRowsAtom = atom(null, (_, set) => {
  set(dataAtom, (data) => data.concat(buildDataAtoms(1000)));
  set(selectedAtom, null);
});

const updateRowsAtom = atom(null, (get, set) => {
  const data = get(dataAtom);
  for (let i = 0; i < data.length; i += 10) {
    set(data[i], (r) => ({ id: r.id, label: r.label + " !!!" }));
  }
});

const removeRowAtom = atom(null, (_, set, item: PrimitiveAtom<Data>) =>
  set(dataAtom, (data) => {
    const idx = data.findIndex((d) => d === item);
    return [...data.slice(0, idx), ...data.slice(idx + 1)];
  })
);

const selectRowAtom = atom(null, (_, set, selected: PrimitiveAtom<Data>) => {
  set(selectedAtom, selected);
});

const clearStateAtom = atom(null, (_, set) => {
  set(dataAtom, []);
  set(selectedAtom, null);
});

const swapRowsAtom = atom(null, (get, set) => {
  const data = get(dataAtom);
  if (data.length > 998) {
    set(dataAtom, [data[0], data[998], ...data.slice(2, 998), data[1], data[999]])
  }
});

const GlyphIcon = (
  <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
);

interface RowProps {
  item: PrimitiveAtom<Data>;
  isSelected: boolean;
}

const Row = memo<RowProps>(({ item, isSelected }) => {
  const [{ id, label }] = useAtom(item);
  const selectRow = useUpdateAtom(selectRowAtom);
  const removeRow = useUpdateAtom(removeRowAtom);
  return (
    <tr className={isSelected ? "danger" : ""}>
      <td className="col-md-1">{id}</td>
      <td className="col-md-4">
        <a onClick={() => selectRow(item)}>{label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => removeRow(item)}>{GlyphIcon}</a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
});


const RowList = memo(() => {
  const [data] = useAtom(dataAtom);
  const [selected] = useAtom(selectedAtom);
  return (
    <>
      {data.map((item) => (
        <Row
          key={String(item)}
          item={item}
          isSelected={item === selected}
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
