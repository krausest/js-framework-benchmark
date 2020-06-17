import React from "react";
import { useApp } from "./app";

const GlyphIcon = (
  <span className="glyphicon glyphicon-remove" aria-hidden="true" />
);

function RowInternal(props) {
  const { actions } = useApp();
  const { item } = props;
  return (
    <tr className={item.selected ? "danger" : ""}>
      <td className="col-md-1">{item.id}</td>
      <td className="col-md-4">
        <a onClick={() => actions.select(item)}>{item.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => actions.remove(item)}>{GlyphIcon}</a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
}

export const Row = React.memo(RowInternal);
