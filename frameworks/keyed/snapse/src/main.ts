import { SnapseRoot, peek, state } from 'snapse'
import { a, button, div, h1, span, table, tbody, td, tr } from 'snapse/DOM'

const adjectives = [
  'pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean',
  'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important',
  'inexpensive', 'cheap', 'expensive', 'fancy',
]
const colours = [
  'red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange',
]
const nouns = [
  'table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse',
  'keyboard',
]
const pick = (dict: string[]) => dict[Math.round(Math.random() * 1000) % dict.length]
const createRows = (count: number) => {
  const rows = []
  for (let i = 0; i < count; i++) rows.push(`${pick(adjectives)} ${pick(colours)} ${pick(nouns)}`)
  return rows
}

const Button = (id: string, label: string, click: () => void) =>
  div({ class: 'col-sm-6 smallpad' },
    button({ type: 'button', class: 'btn btn-primary btn-block', id, click }, label),
  )

let idCounter = 0
const rows = state<string[]>([])
const selected = state(-1)

const ActionButtons = () =>
  div({ class: 'jumbotron' },
    div({ class: 'row' },
      div({ class: 'col-md-6' }, h1('Snapse')),
      div({ class: 'col-md-6' },
        div({ class: 'row' },
          Button('run', 'Create 1,000 rows', () => rows.set(createRows(1000))),
          Button('runlots', 'Create 10,000 rows', () => rows.set(createRows(10000))),
          Button('add', 'Append 1,000 rows', () => rows.push(...createRows(1000))),
          Button('update', 'Update every 10th row', () => {
            const l = rows.length
            for (let i = 0; i < l; i += 10) (rows[i] as string) += ' !!!'
          }),
          Button('clear', 'Clear', () => rows.set([])),
          Button('swaprows', 'Swap Rows', () =>
            rows.length > 998 && rows.splice(998, 1, rows.splice(1, 1, rows[998])[0]),
          ),
        ),
      ),
    ),
  )

const TableRow = (row: string) => {
  const id = ++idCounter
  return tr({ class: { danger: selected.is(id) } },
    td({ class: 'col-md-1' }, id),
    td({ class: 'col-md-4' },
      a({ click: () => selected.set(id) }, row),
    ),
    td({ class: 'col-md-1' },
      a(
        span({
          class: 'glyphicon glyphicon-remove',
          'aria-hidden': 'true',
          click: () => rows.splice(peek(rows).indexOf(row), 1),
        }),
      ),
    ),
    td({ class: 'col-md-6' }),
  )
}

SnapseRoot(() =>
  div({ id: 'main' },
    div({ class: 'container' },
      ActionButtons,
      table({ class: 'table table-hover table-striped test-data' },
        tbody(rows.map(TableRow)),
      ),
    ),
  ),
)
