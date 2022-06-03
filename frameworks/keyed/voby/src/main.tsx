
/* IMPORT */

import {createElement, Fragment} from 'voby';
import {$, render, template, useSelector, For} from 'voby';
import type {FunctionMaybe, Observable, ObservableMaybe} from 'voby';

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
    $data ( buildData ( length ) );
  };

  const add = (): void => {
    $data ( data => [...data, ...buildData ( 1000 )] );
  };

  const update = (): void => {
    const data = $data ();
    for ( let i = 0, l = data.length; i < l; i += 10 ) {
      data[i].label ( label => label + ' !!!' );
    }
  };

  const swapRows = (): void => {
    const data = $data ().slice ();
    if ( data.length <= 998 ) return;
    const datum1 = data[1];
    const datum998 = data[998];
    data[1] = datum998;
    data[998] = datum1;
    $data ( data );
  };

  const clear = (): void => {
    $data ( [] );
  };

  const remove = ( id: number ): void  => {
    $data ( data => {
      const idx = data.findIndex ( datum => datum.id === id );
      return [...data.slice ( 0, idx ), ...data.slice ( idx + 1 )];
    });
  };

  const select = ( id: number ): void => {
    $selected ( id );
  };

  const isSelected = useSelector ( $selected );

  return { $data, $selected, run, runLots, runWith, add, update, swapRows, clear, remove, select, isSelected };

})();

/* MAIN */

const Button = ({ id, text, onClick }: { id: string | number, text: string, onClick: ObservableMaybe<(( event: MouseEvent ) => any)> }): JSX.Element => (
  <div class="col-sm-6 smallpad">
    <button id={id} class="btn btn-primary btn-block" type="button" onClick={onClick}>{text}</button>
  </div>
);

const Row = template (({ id, label, className, onSelect, onRemove }: { id: FunctionMaybe<string | number>, label: FunctionMaybe<string>, className: FunctionMaybe<Record<string, FunctionMaybe<boolean>>>, onSelect: ObservableMaybe<(( event: MouseEvent ) => any)>, onRemove: ObservableMaybe<(( event: MouseEvent ) => any)> }): JSX.Element => (
  <tr class={className}>
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
));

const App = (): JSX.Element => {

  const {$data, run, runLots, add, update, swapRows, clear, remove, select, isSelected} = Model;

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
              const selected = isSelected ( id, { observable: true } );
              const className = { danger: selected };
              const onSelect = select.bind ( undefined, id );
              const onRemove = remove.bind ( undefined, id );
              const props = {id, label, className, onSelect, onRemove};
              return Row ( props );
            }}
          </For>
        </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" ariaHidden={true}></span>
    </div>
  );

};

render ( <App />, document.getElementById ( 'main' ) );
