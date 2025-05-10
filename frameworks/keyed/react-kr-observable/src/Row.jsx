import { observer } from 'kr-observable';
import { rowsStore } from "./RowsStore";

export const Row = observer(function row({ data }) {
  return (
    <tr className={data.selected ? 'danger' : ''}>
      <td className="col-md-1">{data.id}</td>
      <td className="col-md-4">
        <a id={data.id} onClick={() => rowsStore.select(data.id)}>{data.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => rowsStore.delete(data.id)}>
          <span
            id={data.id}
            className="glyphicon glyphicon-remove"
            aria-hidden="true"
          ></span>
        </a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
});
