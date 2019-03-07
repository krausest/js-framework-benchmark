import SifrrDom from '@sifrr/dom'
const Sifrr = { Dom: SifrrDom };

const template = `
<link href="/css/currentStyle.css" rel="stylesheet"/>
<div class="container">
  <div class="jumbotron">
    <div class="row">
      <div class="col-md-6">
        <h1>Sifrr</h1>
      </div>
      <div class="col-md-6">
        <div class="row">
          <div class="col-sm-6 smallpad">
            <button type='button' class='btn btn-primary btn-block' _click=\${this.run} id='run'>Create 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type='button' class='btn btn-primary btn-block' _click=\${this.runlots} id='runlots'>Create 10,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type='button' class='btn btn-primary btn-block' _click=\${this.add} id='add'>Append 1,000 rows</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type='button' class='btn btn-primary btn-block' _click=\${this.clickUpdate} id='update'>Update every 10th row</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type='button' class='btn btn-primary btn-block' _click=\${this.clear} id='clear'>Clear</button>
          </div>
          <div class="col-sm-6 smallpad">
            <button type='button' class='btn btn-primary btn-block' _click=\${this.swaprows} id='swaprows'>Swap Rows</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <table class="table table-hover table-striped test-data">
    <tbody data-sifrr-repeat=\${this.state.data} data-sifrr-key='id' data-sifrr-default-state='{"class":false}'>
      <tr class=\${this.state.class}>
        <td class='col-md-1 id'>\${this.state.id}</td>
        <td class='col-md-4'><a class='lbl'>\${this.state.label}</a></td>
        <td class='col-md-1'><a class='remove'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a></td>
        <td class='col-md-6'></td>
      </tr>
    </tbody>
  </table>
  <span class='glyphicon glyphicon-remove' aria-hidden='true'>
</div>`;
window.from = 1;

function _random(max) {
  return Math.round(Math.random() * 1000) % max;
}

let buildData = window.buildData = function(count = 1000, frm = window.from) {
  const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive',
    'cheap', 'expensive', 'fancy'
  ];
  const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
  const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];
  let data = [];
  for (let i = 0; i < count; i++)
    data.push({
      id: i + frm,
      label: adjectives[_random(adjectives.length)] + ' ' + colours[_random(colours.length)] + ' ' + nouns[_random(nouns.length)],
      class: false
    });
  window.from = window.from + count;
  return data;
};

function getParent(elem) {
  while (elem.nodeName !== 'TR') elem = elem.parentNode;
  return elem;
}

class MainElement extends Sifrr.Dom.Element {
  static get template() {
    const temp = Sifrr.Dom.template(template);
    return temp;
  }

  onConnect() {
    const me = this;
    Sifrr.Dom.Event.addListener('click', '.remove', (e, target) => {
      const id = getParent(target).state.id;
      const data = me.state.data;
      const todel = data.findIndex(d => d.id === id);
      data.splice(todel, 1);
      me.state = { data: data };
    });
    Sifrr.Dom.Event.addListener('click', '.lbl', (e, target) => {
      const id = getParent(target).state.id;
      const data = me.state.data, l = me.state.data.length;
      let k = 0;
      for (let i = 0; i < l; i++) {
        if (me.state.data[i].class) me.state.data[i].class = false, k++;
        if (me.state.data[i].id === id) me.state.data[i].class = 'danger', k++;
        if (k > 1) break;
      }
      me.state = { data: data };
    });
  }

  run() {
    this.state = {
      data: buildData(1000)
    };
  }

  runlots() {
    this.state = {
      data: buildData(10000)
    };
  }

  add() {
    this.state = {
      data: this.state.data.concat(buildData(1000))
    };
  }

  // update is reserved in Sifrr.Dom.Element
  clickUpdate() {
    const state = this.state;
    const l = this.state.data.length;
    for (let i = 0; i < l; i += 10) {
      state.data[i].label = state.data[i].label + ' !!!';
    }
    this.state = state;
  }

  clear() {
    this.state = {
      data: []
    };
  }

  swaprows() {
    const data = this.state.data;
    if (data.length > 998) {
      const a = data[1];
      data[1] = data[998];
      data[998] = a;
      this.state = {
        data: data
      };
    }
  }
}
MainElement.defaultState = {
  data: []
};

Sifrr.Dom.register(MainElement);
