import {
  signal,
  update,
  record,
  deleteIndex,
  updateList,
  computed,
  clearList,
  assignKey
} from 'nanoviews/store'
import {
  div,
  h1,
  button,
  table,
  tbody,
  tr,
  td,
  a,
  span,
  trackById,
  for$,
  mount
} from 'nanoviews'

const adjectives = [
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
  'fancy'
]
const colours = [
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
  'orange'
]
const nouns = [
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
  'keyboard'
]

function _random(max) {
  return Math.round(Math.random() * 1000) % max
}

let rowId = 1

function item() {
  return {
    id: rowId++,
    label: `${adjectives[_random(adjectives.length)]} ${colours[_random(colours.length)]} ${nouns[_random(nouns.length)]}`
  }
}

function buildData(count = 1000) {
  const data = new Array(count)

  for (let i = 0; i < count; i++) {
    data[i] = item()
  }

  return data
}

export function App() {
  const $data = signal([])
  const $selected = signal()
  const add = () => {
    update($data, data => [...data, ...buildData(1000)])
  }
  const clear = () => {
    clearList($data)
  }
  const partialUpdate = () => {
    updateList($data, (data) => {
      for (let i = 0, len = data.length; i < len; i += 10) {
        data[i] = assignKey(data[i], 'label', `${data[i].label} !!!`)
      }
    })
  }
  const remove = (index) => {
    deleteIndex($data, index)
  }
  const run = () => {
    $data(buildData(1000))
  }
  const runLots = () => {
    $data(buildData(10000))
  }
  const swapRows = () => {
    if ($data().length > 998) {
      updateList($data, (data) => {
        const tmp = data[1]

        data[1] = data[998]
        data[998] = tmp
      })
    }
  }

  return div({ id: 'main', class: 'container' })(
    div({ class: 'jumbotron' })(
      div({ class: 'row' })(
        div({ class: 'col-md-6' })(
          h1()('Nanoviews (w. Kida) (keyed)')
        ),
        div({ class: 'col-md-6' })(
          div({ class: 'row' })(
            div({ class: 'col-sm-6 smallpad' })(
              button({
                type: 'button',
                class: 'btn btn-primary btn-block',
                id: 'run',
                onClick: run
              })(
                'Create 1,000 rows'
              )
            ),
            div({ class: 'col-sm-6 smallpad' })(
              button({
                type: 'button',
                class: 'btn btn-primary btn-block',
                id: 'runlots',
                onClick: runLots
              })(
                'Create 10,000 rows'
              )
            ),
            div({ class: 'col-sm-6 smallpad' })(
              button({
                type: 'button',
                class: 'btn btn-primary btn-block',
                id: 'add',
                onClick: add
              })(
                'Append 1,000 rows'
              )
            ),
            div({ class: 'col-sm-6 smallpad' })(
              button({
                type: 'button',
                class: 'btn btn-primary btn-block',
                id: 'update',
                onClick: partialUpdate
              })(
                'Update every 10th row'
              )
            ),
            div({ class: 'col-sm-6 smallpad' })(
              button({
                type: 'button',
                class: 'btn btn-primary btn-block',
                id: 'clear',
                onClick: clear
              })(
                'Clear'
              )
            ),
            div({ class: 'col-sm-6 smallpad' })(
              button({
                type: 'button',
                class: 'btn btn-primary btn-block',
                id: 'swaprows',
                onClick: swapRows
              })(
                'Swap Rows'
              )
            )
          )
        )
      )
    ),
    table({
      class: 'table table-hover table-striped test-data'
    })(
      tbody()(
        for$($data, trackById)(
          ($row, $index) => {
            $row = record($row)

            return tr({
              class: computed(() => $selected() === $row.$id() ? 'danger' : '')
            })(
              td({ class: 'col-md-1' })(
                $row.$id
              ),
              td({ class: 'col-md-4' })(
                a({
                  onClick() {
                    $selected($row.$id())
                  }
                })(
                  $row.$label
                )
              ),
              td({ class: 'col-md-1' })(
                a({
                  onClick() {
                    remove($index())
                  }
                })(
                  span({ class: 'glyphicon glyphicon-remove', 'aria-hidden': true })
                )
              ),
              td({ class: 'col-md-6' })
            )
          }
        )
      )
    ),
    span({
      class: 'preloadicon glyphicon glyphicon-remove',
      'aria-hidden': true
    })
  )
}


mount(App, document.getElementById('main'))
