const template = document.createElement('template');
template.innerHTML = `
<tr>
  <td class="col-md-1"></td>
  <td class="col-md-4">
    <a></a>
  </td>
  <td class="col-md-1"><a><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
  <td class="col-md-6"></td>
</tr>
`.trim();
const tr = template.content.firstChild;

const rows = [];
const createRow = (select, remove, id, label, index) => {
  const row = tr.cloneNode(true);
  const td = row.querySelector('td');
  td.textContent = (row.id = id);

  const [selector, remover] = row.querySelectorAll('a');
  selector.textContent = label;
  selector.addEventListener('click', () => select(+row.id));
  remover.addEventListener('click', () => remove(+row.id));

  const info = {danger: false, id, label, row, selector, td};
  return (rows[index] = info);
};

export const getRow = (index, select, remove, id, label) =>
                      rows[index] || createRow(select, remove, id, label, index);

export const spliceRows = (length) => {
  rows.splice(length);
};
