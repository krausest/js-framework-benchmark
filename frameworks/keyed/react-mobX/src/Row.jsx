import { observer } from 'mobx-react-lite';

const _Row = ({ data, isSelected, onDelete, onSelect }) => {
  return (
    <tr className={isSelected ? 'danger' : ''}>
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
};

export const Row = observer(_Row);
