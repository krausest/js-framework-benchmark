
/* IMPORT */

import {Observable, ObservableMaybe} from 'voby';
import {$, createElement, render, template, For, Fragment} from 'voby';

window.React = {createElement, Fragment};

/* TYPES */

type IDatum = Observable<{ id: string, label: Observable<string>, selected: Observable<boolean>, className: Observable<string> }>;

type IData = IDatum[];

/* HELPERS */

const rand = ( max: number ): number => {
  return Math.round ( Math.random () * 1000 ) % max;
};

const uuid = (() => {
  let counter = 0;
  return (): string => {
    return String ( counter++ );
  };
})();

const buildData = (() => {
  const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
  const colors = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
  const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
  return ( length: number ): IData => {
    const data: IData = new Array ( length );
    for ( let i = 0; i < length; i++ ) {
      const id = uuid ();
      const adjective = adjectives[rand ( adjectives.length )];
      const color = colors[rand ( colors.length )];
      const noun = nouns[rand ( nouns.length )];
      const label = $(`${adjective} ${color} ${noun}`);
      const selected = $(false);
      const className = $('');
      const datum = $( { id, label, selected, className } );
      data[i] = datum;
    };
    return data;
  };
})();

/* MODEL */

const Model = (() => {

  /* STATE */

  let $data = $<IDatum[]>( [] );
  let $selected: IDatum | null = null;

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
    $data ( [...$data (), ...buildData ( 1000 )] );
  };

  const update = (): void => {
    const data = $data ();
    for ( let i = 0, l = data.length; i < l; i += 10 ) {
      const $datum = data[i];
      const datum = $datum ();
      datum.label ( datum.label () + ' !!!' );
    }
  };

  const swapRows = (): void => {
    const data = $data ();
    if ( data.length <= 998 ) return;
    const pos1$ = data[1];
    const pos998$ = data[998];
    const data2 = data.slice ();
    data2[1] = pos998$;
    data2[998] = pos1$;
    $data ( data2 );
  };

  const clear = (): void => {
    $data ( [] );
  };

  const remove = ( id: string ): void => {
    const data = $data ();
    const index = data.findIndex ( datum => datum.sample ().id === id );
    $data ( [...data.slice ( 0, index ), ...data.slice ( index + 1 )] );
  };

  const select = ( id: string ): void => {
    if ( $selected ) {
      const datum = $selected ();
      datum.selected ( false );
      datum.className ( '' );
    }
    const data = $data ();
    const $datum = data.find ( datum => datum.sample ().id === id )!;
    const datum = $datum ();
    datum.selected ( true );
    datum.className ( 'danger' );
    $selected = $datum;
  };

  return { $data, $selected, run, runLots, runWith, add, update, swapRows, clear, remove, select };

})();

/* MAIN */

const Button = ({ id, text, onClick }: { id: string, text: string, onClick: (( event: MouseEvent ) => any) }): JSX.Element => (
  <div class="col-sm-6 smallpad">
    <button id={id} class="btn btn-primary btn-block" type="button" onClick={onClick}>{text}</button>
  </div>
);

const RowDynamic = ({ id, label, className, onSelect, onRemove }: { id: ObservableMaybe<string>, label: ObservableMaybe<string>, className: ObservableMaybe<string>, onSelect: ObservableMaybe<(( event: MouseEvent ) => any)>, onRemove: ObservableMaybe<(( event: MouseEvent ) => any)> }): JSX.Element => (
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
);

const RowTemplate = template ( RowDynamic );

const App = (): JSX.Element => {

  const {$data, run, runLots, add, update, clear, swapRows, select, remove} = Model;

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
            {( $datum: IDatum ) => {
              const {id, label, className} = $datum ();
              const onSelect = () => select ( id );
              const onRemove = () => remove ( id );
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
