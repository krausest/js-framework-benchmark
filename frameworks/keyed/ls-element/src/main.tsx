import { Attribute, AutonomousCustomElement, h, LSCustomElement } from '@lsegurado/ls-element';

function random(max) {
  return Math.round(Math.random() * 1000) % max;
}

const A = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean',
  'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
  'cheap', 'expensive', 'fancy'];
const C = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
const N = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse',
  'keyboard'];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

@AutonomousCustomElement({shadow: false})
export class MainElement extends HTMLElement implements LSCustomElement {
    @Attribute() _rows = [];
    @Attribute() _selected = 0;

    render() {
      return (
        <div id="container" class="container" dynamicAttributes={[]}>
          <div id="jumbotron" class="jumbotron" dynamicAttributes={[]} staticChildren>
            <div id="1" class="row">
              <div id="2" class="col-md-6">
                <h1 id="3">LS-Element keyed</h1>
              </div>
              <div id="4" class="col-md-6">
                <div id="5" class="row">
                  <div id="6" class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="run" onclick={() => this._run()}>Create 1,000 rows</button>
                  </div>
                  <div id="7" class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="runlots" onclick={() => this._runLots()}>Create 10,000 rows</button>
                  </div>
                  <div id="8" class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="add" onclick={() => this._add()}>Append 1,000 rows</button>
                  </div>
                  <div id="9" class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="update" onclick={() => this._update()}>Update every 10th row</button>
                  </div>
                  <div id="10" class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="clear" onclick={() => this._clear()}>Clear</button>
                  </div>
                  <div id="11" class="col-sm-6 smallpad">
                    <button type="button" class="btn btn-primary btn-block" id="swaprows" onclick={() => this._swapRows()}>Swap Rows</button>
                  </div >
                </div >
              </div >
            </div >
          </div >
          <table id="table" class="table table-hover table-striped test-data" dynamicAttributes={[]}>
            <tbody id="body" dynamicAttributes={[]}>{this._rows.map(item => (
              <tr id={`row-${item.id}`} class={item.id === this._selected ? 'danger' : undefined} dynamicAttributes={['class']}>
                <td id={`row-${item.id}-1`} class="col-md-1" dynamicAttributes={[]} staticChildren>{item.id}</td>
                <td id={`row-${item.id}-2`} class="col-md-4" dynamicAttributes={[]}>
                  <a id={`row-${item.id}-3`} onclick={() => this._select(item.id)} dynamicAttributes={[]}>{item.label}</a>
                </td>
                <td id={`row-${item.id}-4`} class="col-md-1" dynamicAttributes={[]} staticChildren>
                  <a id={`row-${item.id}-5`} onclick={() => this._remove(item.id)}>
                    <span id={`row-${item.id}-6`} class="glyphicon glyphicon-remove" aria-hidden="true"/>
                  </a>
                </td>
                <td id={`row-${item.id}-7`} class="col-md-6" dynamicAttributes={[]} staticChildren />
              </tr>))}
            </tbody>
          </table >
          <span id="icon" class="preloadicon glyphicon glyphicon-remove" aria-hidden="true" dynamicAttributes={[]} staticChildren />
        </div >
      );
    }
    _run() {
      this._rows = buildData(1000);
      this._selected = 0;
    }
    _runLots() {
      this._rows = buildData(10000);
      this._selected = 0;
    }
    _add() {
      this._rows = this._rows.concat(buildData(1000));
    }
    _remove(id) {
      this._rows = this._rows.filter(x => x.id !== id);
    }
    _select(id) {
      this._selected = id;
    }
    _update(_mod = 10) {
      const newData = [];
      for (let i = 0; i < this._rows.length; i++) {
        if (i % _mod === 0) {
          newData[i] = Object.assign({}, this._rows[i], { label: `${this._rows[i].label  } !!!` });
        } else {
          newData[i] = this._rows[i];
        }
      }
      this._rows = newData;
    }
    _clear() {
      this._rows = [];
      this._selected = 0;
    }
    _swapRows() {
      if (this._rows.length > 998) {
        const d1 = this._rows[1];
        const d998 = this._rows[998];

        this._rows = this._rows.map((data, i) => {
          if (i === 1) {
            return d998;
          }
          else if (i === 998) {
            return d1;
          }
          return data;
        });
      }
    }
}
  