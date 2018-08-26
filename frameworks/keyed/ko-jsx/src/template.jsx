import { r, selectOn, delegateEvent } from 'ko-jsx'

export default function({data, selected, run, runLots, add, update, clear, swapRows, select, del}) {
  let selectClass, clickSelect, clickRemove, tbody;
  return (
    <div class='container'>
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
      <table class='table table-hover table-striped test-data'><tbody ref={tbody}>{
        (selectClass = selectOn(selected, (el, selected) => el.className = selected ? 'danger' : ''),
        clickSelect = delegateEvent(tbody, 'click', select),
        clickRemove = delegateEvent(tbody, 'click', del),
        data.map(row =>
          <tr $selectClass={row.id}>
            <td class='col-md-1' textContent={((row.id))} />
            <td class='col-md-4'><a $clickSelect={row.id}>{row.label}</a></td>
            <td class='col-md-1'><a $clickRemove={row.id}><span class='delete glyphicon glyphicon-remove' /></a></td>
            <td class='col-md-6'/>
          </tr>
        ))
      }</tbody></table>
      <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
    </div>
  )
}