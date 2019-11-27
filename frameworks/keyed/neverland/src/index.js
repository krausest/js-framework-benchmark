import {
  neverland as $, html, render,
  useCallback,
  useMemo,
  useReducer
} from '../node_modules/neverland/esm/index.js';

import {Scope, listReducer} from './utils.js';


const GlyphIcon = () => html`<span class="glyphicon glyphicon-remove" aria-hidden="true" />`;

const Row = $(({item, dispatch, selected}) => {
  const select = useCallback(() => dispatch({type: 'select', id: item.id}), [item]),
    remove = useCallback(() => dispatch({type: 'delete', id: item.id}), [item]);

  return html.for(item)`
    <tr class=${selected ? "danger" : ""}>
      <td class="col-md-1">${item.id}</td>
      <td class="col-md-4"><a onclick=${select}>${item.label}</a></td>
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

const Main = $(() => {
  const [state, dispatch] = useReducer(listReducer, Scope);
  const jumbotron = useMemo(() => Jumbotron({dispatch}), []);

  return html`
    <div class="container">
      ${jumbotron}
      <table class="table table-hover table-striped test-data">
        <tbody>
        ${state.data.map(item => Row({item, dispatch, selected: item.id === state.selected}))}
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
    </div>
  `;
});

render(document.getElementById('main'), Main);
