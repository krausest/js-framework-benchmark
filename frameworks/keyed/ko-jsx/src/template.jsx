import { r, selectWhen } from 'ko-jsx'

const Button = ({id, text, fn}) =>
  <div class ='col-sm-6 smallpad'>
    <button id={id} class='btn btn-primary btn-block' type='button' onClick={fn}>{text}</button>
  </div>

export default function({data, selected, run, runLots, add, update, clear, swapRows, clickRow}) {
  return <div class='container'>
    <div class='jumbotron'><div class='row'>
      <div class ='col-md-6'><h1>KnockoutJSX-keyed</h1></div>
      <div class ='col-md-6'><div class ='row'>
        <Button id='run' text='Create 1,000 rows' fn={run} />
        <Button id='runlots' text='Create 10,000 rows' fn={runLots} />
        <Button id='add' text='Append 1,000 rows' fn={add} />
        <Button id='update' text='Update every 10th row' fn={update} />
        <Button id='clear' text='Clear' fn={clear} />
        <Button id='swaprows' text='Swap Rows' fn={swapRows} />
      </div></div>
    </div></div>
    <table class='table table-hover table-striped test-data'><tbody onClick={clickRow}>
      <$ each={data()} afterRender={selectWhen(selected, 'danger')}>{
        row =>
          <tr model={row.id}>
            <td class='col-md-1' textContent={row.id} />
            <td class='col-md-4'><a>{row.label}</a></td>
            <td class='col-md-1'><a action={'remove'}><span class='glyphicon glyphicon-remove' /></a></td>
            <td class='col-md-6'/>
          </tr>
      }</$>
    </tbody></table>
    <span class='preloadicon glyphicon glyphicon-remove' aria-hidden="true" />
  </div>
}