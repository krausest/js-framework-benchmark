import { r, selectWhen } from 'ko-jsx'

export default function({data, selected, run, runLots, add, update, clear, swapRows, clickRow}) {
  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class ='col-md-6'><h1>KnockoutJSX-keyed</h1></div>
      <div class ='col-md-6'><div class ='row'>
        <div class ='col-sm-6 smallpad'>
          <button id='run' class='btn btn-primary btn-block' type='button' onClick={run}>Create 1,000 rows</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='runlots' class='btn btn-primary btn-block' type='button' onClick={runLots}>Create 10,000 rows</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='add' class='btn btn-primary btn-block' type='button' onClick={add}>Append 1,000 rows</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='update' class='btn btn-primary btn-block' type='button' onClick={update}>Update every 10th row</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='clear' class='btn btn-primary btn-block' type='button' onClick={clear}>Clear</button>
        </div>
        <div class='col-sm-6 smallpad'>
          <button id='swaprows' class='btn btn-primary btn-block' type='button' onClick={swapRows}>Swap Rows</button>
        </div>
      </div></div>
    </div></div>
    <table class='table table-hover table-striped test-data'><tbody onClick={clickRow}>{
      selectWhen(selected, (el, selected) => el.className = selected ? 'danger' : '')
      (data.each(row =>
        <tr model={((row.id))}>
          <td class='col-md-1' textContent={((row.id))} />
          <td class='col-md-4'><a>{row.label}</a></td>
          <td class='col-md-1'><a><span class='delete glyphicon glyphicon-remove' /></a></td>
          <td class='col-md-6'/>
        </tr>
      ))
    }</tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>
}