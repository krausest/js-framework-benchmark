import {h, setupSyntheticEvent} from 'stage0'
import {reuseNodes} from 'stage0/reuseNodes'

let did = 1
function buildData(count) {
    var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
    var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
    var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
    var data = [];
    for (var i = 0; i < count; i++) {
        data.push({
            id: did++,
            label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)]
        });
    }
    return data;
}

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

const itemView = h`
  <tr>
      <td class="col-md-1">#id</td>
      <td class="col-md-4">
          <a #select>#label</a>
      </td>
      <td class="col-md-1"><a #del><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
      <td class="col-md-6"></td>
  </tr>
`
function Item(item, scope) {
  const root = itemView.cloneNode(true)
  const refs = itemView.collect(root)

  const {id, label, select, del} = refs

  id.nodeValue = item.id
  label.nodeValue = item.label
  select.__click = () => scope.select(item)
  del.__click = () => scope.del(item)

  let a = '', a2, 
      b = item.label, b2
  root.update = function(newItem, selected) {
    if (newItem !== item) {
      item = newItem
      id.nodeValue = item.id
    }

    a2 = item.id === selected ? 'danger' : ''
    b2 = item.label
    
    if (a2 !== a) a = root.className = a2
    if (b2 !== b) b = label.nodeValue = b2
  }

  return root
}

const mainView = h`
  <div class="container" id="main">
      <div class="jumbotron">
          <div class="row">
              <div class="col-md-6">
                  <h1>stage0</h1>
              </div>
              <div class="col-md-6">
                  <div class="row">
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary btn-block" id="run" #run>Create 1,000 rows</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary btn-block" id="runlots" #runlots>Create 10,000 rows</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary
                          btn-block" id="add" #add>Append 1,000 rows</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary
                          btn-block" id="update" #update>Update every 10th row</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary
                          btn-block" id="clear" #cleardata>Clear</button>
                      </div>
                      <div class="col-sm-6 smallpad">
                          <button type="button" class="btn btn-primary
                          btn-block" id="swaprows" #swaprows>Swap Rows</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <table class="table table-hover table-striped test-data">
          <tbody #tbody>
          </tbody>
      </table>
      <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>
`
function Main() {
  setupSyntheticEvent('click')

  let root = mainView
  let refs = mainView.collect(root)

  let data = [],
      selected

  const {tbody} = refs

  refs.run.__click = () => {
    data = buildData(1000)
    update()
  }
  refs.runlots.__click = () => {
    data = buildData(10000)
    update()
  }
  refs.add.__click = () => {
    data = data.concat(buildData(1000))
    update()
  }
  refs.update.__click = () => {
    for (let i = 0; i < data.length; i += 10) {
        data[i].label += ' !!!'
    }
    update()
  }
  refs.cleardata.__click = () => {
    data = []
    update()
  }
  refs.swaprows.__click = () => {
    if(data.length > 998) {
      var tmp = data[1];
      data[1] = data[998];
      data[998] = tmp;
    }
    update()
  }

  const scope = {
    select: item => {
        selected = parseInt(item.id)
        update()
    },
    del: item => {
      const id = item.id
      const idx = data.findIndex(d => d.id === id);
      data.splice(idx, 1)
      update()
    }
  }

  let renderedData = []
  function update() {
    reuseNodes(
      tbody,
      renderedData,
      data,
      item => Item(item, scope),
      (node, item) => node.update(item, selected)
    )
    renderedData = data.slice()
  }

  return root
}

const app = Main()
document.getElementById('main').appendChild(app)
