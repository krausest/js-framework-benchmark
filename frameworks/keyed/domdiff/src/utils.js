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

const createRow = (select, remove, id, label) => {
  const row = tr.cloneNode(true);
  const td = row.querySelector('td');
  td.textContent = (row.id = id);

  const [selector, remover] = row.querySelectorAll('a');
  selector.textContent = label;
  selector.addEventListener('click', () => select(id));
  remover.addEventListener('click', () => remove(id));

  return {danger: false, id, label, row, selector, td};
};

const {create} = Object;
const rows = new WeakMap;

const setCache = data => {
  const cache = create(null);
  rows.set(data, cache);
  return cache;
};

export const getRow = (data, select, remove, id, label) => {
  const cache = rows.get(data) || setCache(data);
  return cache[id] || (cache[id] = createRow(select, remove, id, label));
};
