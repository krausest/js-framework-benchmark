import { app, View } from 'apprun';
import { state, update, State, Events } from './store';

const getId = (elem: any) => elem.closest('tr').id;

const click = (state: State, e: Event) => {
  const t = e.target as HTMLElement;
  if (!t) return;
  e.preventDefault();
  if (t.tagName === 'BUTTON' && t.id) {
    component.run(t.id as Events);
  } else if (t.matches('.remove')) {
    const id = getId(t);
    component.run('delete', id);
  } else if (t.matches('.lbl')) {
    const id = getId(t);
    component.run('select', id);
  }
}

const view:View<State> = state => <div class="container" $onclick={click}>
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>AppRun</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="run">Create 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="runlots">Create 10,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="add">Append 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="update">Update every 10th row</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="clear">Clear</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type="button" class="btn btn-primary btn-block" id="swaprows">Swap Rows</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <table class="table table-hover table-striped test-data" id="main-table">
    <tbody>
      {state.data.map(item => {
        const selected = item.id == state.selected ? 'danger' : undefined;
        return <tr class={selected} id={item.id} key={item.id}>
        <td class="col-md-1">{item.id}</td>
        <td class="col-md-4">
          <a class="lbl">{item.label}</a>
        </td>
        <td class="col-md-1">
          <a class="remove">
            <span class="glyphicon glyphicon-remove remove" aria-hidden="true"></span>
          </a>
        </td>
        <td class="col-md-6"></td>
      </tr>;
      })}
    </tbody>
  </table>
  <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
</div>;

const component = app.start<State, Events>('main', state, view, update);

