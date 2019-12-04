import {wire} from 'hyperhtml';

export default (data, selected, {id, label}) => wire(data, `html:${id}`)`
  <tr id=${id} class=${id === selected ? 'danger' : ''}>
    <td class="col-md-1">${id}</td>
    <td class="col-md-4">
      <a data-action='select'>${label}</a>
    </td>
    <td class="col-md-1">
      <a data-action='remove'>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
`;
