import { computed } from 'knockout';

const Button = ({id, text, fn}) =>
  <div class='col-sm-6 smallpad'>
    <button id={id} class='btn btn-primary btn-block' type='button' onClick={fn}>{text}</button>
  </div>

const selectRow = (selected, rows) => {
  let tr;
  const cached = computed(rows);
  computed(() => {
    const s = selected();
    if (tr) tr.className = '';
    if (tr = s && cached().find(tr => tr.model === s)) tr.className = 'danger';
  });
  return cached;
}

export default function({data, selected, run, runLots, add, update, clear, swapRows, remove, select}) {
  let rowId;
  const items = selectRow(selected, data.memoMap(row => (
    rowId = row.id,
    <tr model={rowId}>
      <td class='col-md-1' textContent={rowId} />
      <td class='col-md-4'><a onClick={select} textContent={row.label()} /></td>
      <td class='col-md-1'><a onClick={remove}><span class='glyphicon glyphicon-remove' aria-hidden='true' /></a></td>
      <td class='col-md-6'/>
    </tr>
  )));

  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class='col-md-6'><h1>KnockoutJSX-keyed</h1></div>
      <div class='col-md-6'><div class='row'>
        <Button id='run' text='Create 1,000 rows' fn={run} />
        <Button id='runlots' text='Create 10,000 rows' fn={runLots} />
        <Button id='add' text='Append 1,000 rows' fn={add} />
        <Button id='update' text='Update every 10th row' fn={update} />
        <Button id='clear' text='Clear' fn={clear} />
        <Button id='swaprows' text='Swap Rows' fn={swapRows} />
      </div></div>
    </div></div>
    <table class='table table-hover table-striped test-data'><tbody>{
      items
    }</tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>
}