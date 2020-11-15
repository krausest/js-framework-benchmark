import {View} from 'redrunner'
import {store} from './store'


export class MainView extends View {
  __html__ = `
    <div class="container">
      <use:Jumbotron />
      <table class="table table-hover table-striped test-data">
        <tbody id="tbody" :items="*|.rows|Row"></tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  `
  rows() {
    const selectedId = store.selected
    return store.items.map(item => ({item: item, selected: item.id == selectedId}))
  }
}

class Jumbotron extends View {
  __html__ = `
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>RedRunner keyed</h1>
        </div>
        <div :items="|.buttons|Button" class="col-md-6">
        </div>
      </div>
    </div>
  `
  buttons() {
    return [
      {id: 'run', title: 'Create 1,000 rows', cb: 'run'},
      {id: 'runlots', title: 'Create 10,000 rows', cb: 'runLots'},
      {id: 'add', title: 'Append 1,000 rows', cb: 'add'},
      {id: 'update', title: 'Update every 10th row', cb: 'update10th'},
      {id: 'clear', title: 'Clear', cb: 'clear'},
      {id: 'swaprows', title: 'Swap Rows', cb: 'swapRows'}
    ].map(o => {
      o.cb = store[o.cb].bind(store)
      return o
    })
  }
}

class Button extends View {
  __html__ = `
    <div class="col-sm-6 smallpad">
      <button id="{id}" :onClick="cb" class="btn btn-primary btn-block">{title}</button>
    </div>
  `
}

class Row extends View {
  __clone__ = `
    <tr class="{selected|(n ? 'danger' : '')}">
      <td class="col-md-1">{item.id}</td>
      <td class="col-md-4">
        <a :onClick=".selectMe" class="lbl">{item.label}</a>
      </td>
      <td class="col-md-1">
        <a class="remove" :onClick=".removeMe">
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6">
      </td>
    </tr>
  `
  // Same as shouldComponentUpdate() in React's implementation
  setProps(nextProps) {
    if (nextProps.item !== this.props.item || nextProps.selected !== this.props.selected) {
      super.setProps(nextProps)
    }
  }
  selectMe() {
    store.select(this.props.item)
  }
  removeMe() {
    store.remove(this.props.item)
  }
}
