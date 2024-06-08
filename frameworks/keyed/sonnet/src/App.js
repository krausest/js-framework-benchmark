import { $component, SonnetComponent } from '@sonnetjs/core';

const ADJECTIVES = [
  'pretty',
  'large',
  'big',
  'small',
  'tall',
  'short',
  'long',
  'handsome',
  'plain',
  'quaint',
  'clean',
  'elegant',
  'easy',
  'angry',
  'crazy',
  'helpful',
  'mushy',
  'odd',
  'unsightly',
  'adorable',
  'important',
  'inexpensive',
  'cheap',
  'expensive',
  'fancy',
];
const COLOURS = [
  'red',
  'yellow',
  'blue',
  'green',
  'pink',
  'brown',
  'purple',
  'brown',
  'white',
  'black',
  'orange',
];
const NOUNS = [
  'table',
  'chair',
  'house',
  'bbq',
  'desk',
  'car',
  'pony',
  'cookie',
  'sandwich',
  'burger',
  'pizza',
  'mouse',
  'keyboard',
];

const nts = (n) => Math.round(n / 100);

class App extends SonnetComponent {
  script = () => {    
    this.index = 1;
    this.data = [];
    this.labels = null;
    this.invalidLabels = true;
    this.selected = null;

    this.TBODY = document.getElementsByTagName('tbody')[0];

    this.adjectivesLength = ADJECTIVES.length;
    this.coloursLength = COLOURS.length;
    this.nounsLength = NOUNS.length;

    this.TBODY.onclick = (e) => {
      e.stopPropagation;
      if (e.target.matches('a.lbl')) {
        e.preventDefault;
        const element = e.target.parentNode.parentNode;
        if (element === this.selected)
          this.selected.className = this.selected.className ? '' : 'danger';
        else {
          if (this.selected) this.selected.className = '';
          element.className = 'danger';
          this.selected = element;
        }
      } else if (e.target.matches('span.remove')) {
        const element = e.target.parentNode.parentNode.parentNode;
        const index = Array.prototype.indexOf.call(this.TBODY.children, element);
        element.remove();
        this.data.splice(index, 1);
        this.invalidLabels = true;
      }
    };

    for (let [key, value] of Object.entries({
      run: this.run,
      runlots: () => this.run(10000),
      add: this.add,
      update: this.update,
      clear: this.clear,
      swaprows: this.swaprows,
    })) {
      document.getElementById(key).onclick = (e) => {
        e.stopPropagation();
        value();
      };
    }
  }

  run = (n = 1000) => {
    if (this.data.length) this.clear();
    this.add(n);
  }

  add = (n = 1000) => {
    const nt = nts(n);
    let i,
      j = 0,
      r1,
      r2,
      r3;

    const itemTemplates = document.getElementById(`t${n}`).content; // .cloneNode(true);
    if (itemTemplates.children.length < nt) {
      const itemTemplate = itemTemplates.firstElementChild;
      while (nt >= itemTemplates.children.length * 2)
        itemTemplates.appendChild(itemTemplates.cloneNode(true));
      while (nt > itemTemplates.children.length)
        itemTemplates.appendChild(itemTemplate.cloneNode(true));
    }
    const ids = Array.prototype.map.call(
      itemTemplates.querySelectorAll(`td:first-child`),
      (i) => i.firstChild,
    );
    const labels = Array.prototype.map.call(
      itemTemplates.querySelectorAll(`a.lbl`),
      (i) => i.firstChild,
    );

    while ((n -= nt) >= 0) {
      for (i = 0; i < nt; i++, j++) {
        r1 = Math.round(Math.random() * 1000) % this.adjectivesLength;
        r2 = Math.round(Math.random() * 1000) % this.coloursLength;
        r3 = Math.round(Math.random() * 1000) % this.nounsLength;
        ids[i].nodeValue = this.index++;
        this.data.push(
          (labels[
            i
          ].nodeValue = `${ADJECTIVES[r1]} ${COLOURS[r2]} ${NOUNS[r3]}`),
        );
      }
      this.TBODY.appendChild(itemTemplates.cloneNode(true));
    }
    this.invalidLabels = true;
  }

  update = () => {
    if (this.invalidLabels) this.labels = this.TBODY.querySelectorAll('a.lbl');
    this.invalidLabels = false;
    const length = this.labels.length;
    let i;
    for (i = 0; i < length; i += 10)
      this.labels[i].firstChild.nodeValue = this.data[i] += ' !!!';
  }
  
  clear = () => {
    this.TBODY.textContent = '';
    this.data = [];
    this.invalidLabels = true;
  }

  swaprows = () => {
    if (this.TBODY.children.length < 999) return;
    this.invalidLabels = true;
    const first = this.TBODY.firstElementChild;
    [this.data[1], this.data[998]] = [this.data[998], this.data[1]];
    this.TBODY.insertBefore(
      this.TBODY.insertBefore(first.nextElementSibling, this.TBODY.children[998])
        .nextElementSibling,
      first.nextElementSibling,
    );
  }

  get = () => {
    return /*html*/ `
      <div class="container">
        <div class="jumbotron">
          <div class="row">
            <div class="col-md-6">
              <h1>Vanillajs-3-"keyed"</h1>
            </div>
            <div class="col-md-6">
              <div class="row">
                <div class="col-sm-6 smallpad">
                  <button
                    type="button"
                    class="btn btn-primary btn-block"
                    id="run"
                  >
                    Create 1,000 rows
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    type="button"
                    class="btn btn-primary btn-block"
                    id="runlots"
                  >
                    Create 10,000 rows
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    type="button"
                    class="btn btn-primary btn-block"
                    id="add"
                  >
                    Append 1,000 rows
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    type="button"
                    class="btn btn-primary btn-block"
                    id="update"
                  >
                    Update every 10th row
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    type="button"
                    class="btn btn-primary btn-block"
                    id="clear"
                  >
                    Clear
                  </button>
                </div>
                <div class="col-sm-6 smallpad">
                  <button
                    type="button"
                    class="btn btn-primary btn-block"
                    id="swaprows"
                  >
                    Swap Rows
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table class="table table-hover table-striped test-data">
          <tbody id="tbody"></tbody>
        </table>
        <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
      </div>
    `;
  }
}

export default $component(App);
