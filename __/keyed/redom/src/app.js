import { el, list } from 'redom';

const { performance, setTimeout } = window;

export class App {
  constructor ({ store }) {
    this.store = store;
    this.el = el('.container',
      el('.jumbotron',
        el('.row',
          el('.col-md-6',
            el('h1', 'RE:DOM')
          ),
          el('.col-md-6',
            el('.row',
              el('.col-sm-6.smallpad',
                el('button#run.btn.btn-primary.btn-block', { type: 'button', onclick: e => this.run() },
                  'Create 1,000 rows'
                )
              ),
              el('.col-sm-6.smallpad',
                el('button#runlots.btn.btn-primary.btn-block', { type: 'button', onclick: e => this.runLots() },
                  'Create 10,000 rows'
                )
              ),
              el('.col-sm-6.smallpad',
                el('button#add.btn.btn-primary.btn-block', { type: 'button', onclick: e => this.add() },
                  'Append 1,000 rows'
                )
              ),
              el('.col-sm-6.smallpad',
                el('button#update.btn.btn-primary.btn-block', { type: 'button', onclick: e => this.update() },
                'Update every 10th row'
                )
              ),
              el('.col-sm-6.smallpad',
                el('button#clear.btn.btn-primary.btn-block', { type: 'button', onclick: e => this.clear() },
                  'Clear'
                )
              ),
              el('.col-sm-6.smallpad',
                el('button#swaprows.btn.btn-primary.btn-block', { type: 'button', onclick: e => this.swapRows() },
                  'Swap Rows'
                )
              )
            )
          )
        )
      ),
      el('table.table.table-hover.table-striped.test-data',
        this.table = list('tbody', Tr, 'id', { app: this, store })
      ),
      el('span.preloadicon.glyphicon.glyphicon-remove', { 'aria-hidden': true })
    );
  }
  add () {
    this.store.add();
    this.render();
  }
  remove (id) {
    this.store.delete(id);
    this.render();
  }
  select (id) {
    this.store.select(id);
    this.render();
  }
  run () {
    this.store.run();
    this.render();
  }
  update () {
    this.store.update();
    this.render();
  }
  runLots () {
    this.store.runLots();
    this.render();
  }
  clear () {
    this.store.clear();
    this.render();
  }
  swapRows () {
    this.store.swapRows();
    this.render();
  }
  render () {
    this.table.update(this.store.data);
  }
}

class Tr {
  constructor ({ app, store }) {
    this.data = {};
    this.app = app;
    this.store = store;
    this.isSelected = false;
    this.el = el('tr',
      this.id = el('td.col-md-1'),
      el('td.col-md-4',
        this.label = el('a', { onclick: e => app.select(this.data.id) })
      ),
      el('td.col-md-1',
        el('a', { onclick: e => app.remove(this.data.id) },
          el('span.glyphicon.glyphicon-remove', { 'aria-hidden': true })
        )
      ),
      el('td.col-md-6')
    );
  }
  update (data) {
    const { id, label } = data;
    const { selected } = this.store;

    if (id !== this.data.id) {
      this.id.textContent = id;
    }

    if (label !== this.data.label) {
      this.label.textContent = label;
    }

    if (id === selected && !this.isSelected) {
      this.el.classList.add('danger');
      this.isSelected = true;
    } else if (this.isSelected) {
      this.el.classList.remove('danger');
      this.isSelected = false;
    }

    this.data = { id, label };
  }
}
