import { observable, trigger, html, map } from 'naiv'

// data
let id = 1
const random = max => Math.round(Math.random() * 1000) % max
const buildData = (count = 1000) => {
  const adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy']
  const colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange']
  const nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard']
  const data = []

  for (var i = 0; i < count; i++) {
    const label = `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]} ${nouns[random(nouns.length)]}`
    data.push({
      id: id++,
      label: observable(label),
      selected: observable()
    })
  }

  return data
}

// components
const Button = (id, onclick, label) => html`
  <div class='col-sm-6 smallpad'>
    <button 
      id=${id} 
      type='button' 
      class='btn btn-primary btn-block'
      onclick=${onclick}>
      ${label}
    </button>
  </div>
`

const App = () => {
  // data
  const data = observable([])

  const run = () => data(buildData(1000))
  const runlots = () => data(buildData(10000))
  const add = () => data(data().concat(buildData(1000)))
  const update = () => {
    for (let i = 0; i < data().length; i += 10) {
      const label = data[i].label
      label(label() + ' !!!')
    }
  }
  const clear = () => data([])
  const swaprows = () => {
    if (data.length > 998) {
      const temp = data[1]
      data[1] = data[998]
      data[998] = temp
      trigger(data)
    }
  }

  // remove row
  const remove = idx => {
    const arr = data()
    data([...arr.slice(0, idx), ...arr.slice(idx + 1)])
  }

  // select row
  let selectedRow
  const select = row => {
    selectedRow && selectedRow.selected(false)
    row.selected(true)
    selectedRow = row
  }

  return html`
    <div class='container'>
      <div class='jumbotron'>
        <div class='row'>
          <div class='col-md-6'>
            <h1>naiv-keyed</h1>
          </div>
          <div class='col-md-6'>
            <div class='row'>
              ${Button('run', run, 'Create 1,000 rows')}
              ${Button('runlots', runlots, 'Create 10,000 rows')}
              ${Button('add', add, 'Append 1,000 rows')}
              ${Button('update', update, 'Update every 10th row')}
              ${Button('clear', clear, 'Clear')}
              ${Button('swaprows', swaprows, 'Swap Rows')}
            </div>
          </div>
        </div>
      </div>
      <table class='table table-hover table-striped test-data'>
        ${map(
          data,
          (row) => row.id,
          html`<tbody id='tbody'></tbody>`,
          (row, idx) => html`
            <tr class=${() => row.selected() ? 'danger' : ''}>
              <td class="col-md-1">${row.id}</td>
              <td class="col-md-4">
                <a onclick=${() => select(row)}>${row.label}</a>
              </td>
              <td class="col-md-1">
                <a onclick=${() => remove(idx())}>
                  <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                </a>
              </td>
              <td class="col-md-6"></td>
            </tr>
          `
        )}
      </table>
      <span class='preloadicon glyphicon glyphicon-remove' aria-hidden='true'></span>
    </div>
  `
}

document.body.append(App())
