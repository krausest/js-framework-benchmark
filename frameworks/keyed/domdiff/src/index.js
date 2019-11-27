import domdiff from 'domdiff';
import {Scope, getRow} from './utils.js';

const tbody = document.querySelector('tbody');
let rows = [].slice.call(tbody.children);
const scope = new Scope(({data, selected}) => {
  rows = domdiff(
    tbody,
    rows,
    data.map(item => {
      const info = getRow(scope, item);
      const {row, select, td} = info;
      const {id, label} = item;
      if (info.id !== id)
        td.textContent = (row.id = (info.id = id));
      if (info.label !== label)
        select.textContent = (info.label = label);
      const danger = id === selected;
      if (info.danger !== danger)
        row.classList.toggle('danger', (info.danger = danger));
      return row;
    })
  );
});

Object.keys(scope).forEach(id => {
  const button = document.querySelector(`#${id.toLowerCase()}`);
  if (button)
    button.addEventListener('click', () => scope[id]());
});
