import {State} from 'js-framework-benchmark-utils';
import {
  neverland as $, html, render,
  useCallback, useMemo, useReducer
} from 'neverland';

const GlyphIcon = () => html`<span class="glyphicon glyphicon-remove" aria-hidden="true" />`;

const Row = $(({data, item, dispatch, selected}) => {
  const {id, label} = item;

  const select = useCallback(() => dispatch({type: 'select', id}), [id]),
    remove = useCallback(() => dispatch({type: 'remove', id}), [id]);

  return html.for(data, id)`
    <tr class=${selected ? "danger" : ""}>
      <td class="col-md-1">${id}</td>
      <td class="col-md-4"><a onclick=${select}>${label}</a></td>
      <td class="col-md-1"><a onclick=${remove}>${GlyphIcon()}</a></td>
      <td class="col-md-6" />
    </tr>
  `;
});

const Button = ({id, title, cb}) => html`
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id=${id} onclick=${cb}>${title}</button>
  </div>
`;

const Jumbotron = ({dispatch}) => html`
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>neverland keyed</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          ${Button({id: 'run', title: 'Create 1,000 rows', cb: () => dispatch({type: 'run'})})}
          ${Button({id: 'runlots', title: 'Create 10,000 rows', cb: () => dispatch({type: 'runLots'})})}
          ${Button({id: 'add', title: 'Append 1,000 rows', cb: () => dispatch({type: 'add'})})}
          ${Button({id: 'update', title: 'Update every 10th row', cb: () => dispatch({type: 'update'})})}
          ${Button({id: 'clear', title: 'Clear', cb: () => dispatch({type: 'clear'})})}
          ${Button({id: 'swaprows', title: 'Swap Rows', cb: () => dispatch({type: 'swapRows'})})}
        </div>
      </div>
    </div>
  </div>
`;

// This is a bit awkward, but also necessary because all methods in the State
// are self-bound, meaning these will refer to an older state when changes happen.
// With this update, the list reducer will refer always
// to the updated object instead of the previously shallow copied one.
let state = State($ => {state = $});

// As result, the listReducer will always return a shallow copy of the initial state,
// instead of returning a copy of the previous shallow copy that won't be referenced.
const listReducer = (_, action) => {
  const {type} = action;
  switch (type) {
    case 'remove':
    case 'select':
      state[type](action.id);
      break;
    default:
      state[type]();
      break;
  }
  return {...state};
};

const Main = $(() => {
  const [{data, selected}, dispatch] = useReducer(listReducer, state);
  const jumbotron = useMemo(() => Jumbotron({dispatch}), []);

  return html`
    <div class="container">
      ${jumbotron}
      <table class="table table-hover table-striped test-data">
        <tbody>
        ${data.map(item => Row({data, item, dispatch, selected: item.id === selected}))}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  `;
});

render(document.getElementById('main'), Main);
