import { ignoreDependencies, computed } from "knockout";
import { wrap } from "ko-jsx";

const Button = ({id, text, fn}) =>
  <div class='col-sm-6 smallpad'>
    <button id={id} class='btn btn-primary btn-block' type='button' onClick={fn}>{text}</button>
  </div>

const List = props => {
  const mapped = computed(props.each.memoMap(props.children));
  wrap(tr => {
    let i, s = props.selected();
    ignoreDependencies(() => {
      if (tr) tr.className = "";
      if ((tr = s && (i = props.each().findIndex(el => el.id === s)) > -1 && mapped()[i]))
        tr.className = "danger";
    });
    return tr;
  });
  return mapped;
};

export default function({data, selected, run, runLots, add, update, clear, swapRows, remove}) {
  let rowId;
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
    <table class='table table-hover table-striped test-data'><tbody>
      <List each={ data } selected={ selected }>{ row => (
        rowId = row.id,
        <tr>
          <td class='col-md-1' textContent={ rowId } />
          <td class='col-md-4'><a onClick={[selected, rowId]} textContent={ row.label() } /></td>
          <td class='col-md-1'><a onClick={[remove, rowId]}><span class='glyphicon glyphicon-remove' aria-hidden="true" /></a></td>
          <td class='col-md-6'/>
        </tr>
      )}</List>
    </tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>
}