import { observer } from 'kr-observable';

export const Row = observer(function row({ data, store, onDelete, onSelect }) {
  return (
    <tr className={store.selectedRowId === data.id ? 'danger' : ''}>
      <td className="col-md-1">{data.id}</td>
      <td className="col-md-4">
        <a onClick={() => onSelect(data.id)}>{data.label}</a>
      </td>
      <td className="col-md-1">
        <a onClick={() => onDelete(data.id)}>
          <span
            className="glyphicon glyphicon-remove"
            aria-hidden="true"
          ></span>
        </a>
      </td>
      <td className="col-md-6"></td>
    </tr>
  );
});
