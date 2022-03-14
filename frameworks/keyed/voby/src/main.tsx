
/* IMPORT */

import {FunctionMaybe, Observable, ObservableMaybe} from 'voby';
import {$, createElement, render, template, useSelector, For, Fragment} from 'voby';

window.React = {createElement, Fragment};

/* TYPES */

type IDatum = { id: number, label: Observable<string> };

type IData = IDatum[];

/* HELPERS */

const rand = ( max: number ): number => {
  return Math.round ( Math.random () * 1000 ) % max;
};

const buildData = (() => {
  const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
  const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
  const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
  let uuid = 1;
  return ( length: number ): IData => {
    const data: IData = new Array ( length );
    for ( let i = 0; i < length; i++ ) {
      const id = uuid++;
      const adjective = adjectives[rand ( adjectives.length )];
      const color = colors[rand ( colors.length )];
      const noun = nouns[rand ( nouns.length )];
      const label = $(`${adjective} ${color} ${noun}`);
      const datum = { id, label };
      data[i] = datum;
    };
    return data;
  };
})();

/* MODEL */

const Model = (() => {

  /* STATE */

  const $data = $<IDatum[]>( [] );
  const $selected = $( -1 );

  /* API */

  const run = (): void => {
    runWith ( 1000 );
  };

  const runLots = (): void => {
    runWith ( 10000 );
  };

  const runWith = ( length: number ): void => {
    clear ();
    $data ( buildData ( length ) );
  };

  const add = (): void => {
    const data = $data ();
    data.push.apply ( data, buildData ( 1000 ) );
    $data.emit ();
  };

  const update = (): void => {
    const data = $data ();
    for ( let i = 0, l = data.length; i < l; i += 10 ) {
      const {label} = data[i];
      label.update ( label => label + ' !!!' );
    }
  };

  const swapRows = (): void => {
    const data = $data ();
    if ( data.length <= 998 ) return;
    const datum1 = data[1];
    const datum998 = data[998];
    data[1] = datum998;
    data[998] = datum1;
    $data.emit ();
  };

  const clear = (): void => {
    $data ( [] );
  };

  const remove = ( id: number ): void => {
    const data = $data ();
    const index = data.findIndex ( datum => datum.id === id );
    if ( index === -1 ) return;
    data.splice ( index, 1 );
    $data.emit ();
  };

  const select = ( id: number ): void => {
    $selected ( id );
  };

  return { $data, $selected, run, runLots, runWith, add, update, swapRows, clear, remove, select };

})();

/* MAIN */

const Button = ({ id, text, onClick }: { id: string | number, text: string, onClick: ObservableMaybe<(( event: MouseEvent ) => any)> }): JSX.Element => (
  <div class="col-sm-6 smallpad">
    <button id={id} class="btn btn-primary btn-block" type="button" onClick={onClick}>{text}</button>
  </div>
);

const RowDynamic = ({ id, label, className, onSelect, onRemove }: { id: FunctionMaybe<string | number>, label: FunctionMaybe<string>, className: FunctionMaybe<string>, onSelect: ObservableMaybe<(( event: MouseEvent ) => any)>, onRemove: ObservableMaybe<(( event: MouseEvent ) => any)> }): JSX.Element => (
  <tr className={className}>
    <td class="col-md-1">{id}</td>
    <td class="col-md-4">
      <a onClick={onSelect}>{label}</a>
    </td>
    <td class="col-md-1">
      <a onClick={onRemove}>
        <span class="glyphicon glyphicon-remove" ariaHidden={true}></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
);

const RowTemplate = template ( RowDynamic, { recycle: true } );

const App = (): JSX.Element => {

  const {$data, $selected, run, runLots, add, update, clear, swapRows, select, remove} = Model;
  const isSelected = useSelector ( $selected );

  return (
    <div class="container">
      <div class="jumbotron">
        <div class="row">
          <div class="col-md-6">
            <h1>Voby</h1>
          </div>
          <div class="col-md-6">
            <div class="row">
              <Button id="run" text="Create 1,000 rows" onClick={run} />
              <Button id="runlots" text="Create 10,000 rows" onClick={runLots} />
              <Button id="add" text="Append 1,000 rows" onClick={add} />
              <Button id="update" text="Update every 10th row" onClick={update} />
              <Button id="clear" text="Clear" onClick={clear} />
              <Button id="swaprows" text="Swap Rows" onClick={swapRows} />
            </div>
          </div>
        </div>
      </div>
      <table class="table table-hover table-striped test-data">
        <tbody>
          <For values={$data}>
            {( datum: IDatum ) => {
              const {id, label} = datum;
              const className = () => isSelected ( id ) ? 'danger' : '';
              const onSelect = select.bind ( undefined, id );
              const onRemove = remove.bind ( undefined, id );
              const props = {id, label, className, onSelect, onRemove};
              return RowTemplate ( props );
              // return RowDynamic ( props );
            }}
          </For>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" ariaHidden={true}></span>
    </div>
  );

};

render ( <App />, document.getElementById ( 'main' ) );
