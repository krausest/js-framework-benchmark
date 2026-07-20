import { atom, reatomLinkedList } from '@reatom/core'
import { mount, type JSX } from '@reatom/jsx'

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
] as const

const COLORS = [
  'red',
  'yellow',
  'blue',
  'green',
  'pink',
  'brown',
  'purple',
  'white',
  'black',
  'orange',
] as const

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
] as const

let nextId = 1

const rows = reatomLinkedList(
  (id: number, label: string) => ({
    id,
    label: atom(label, `label-${id}`),
    selected: atom(false, `selected-${id}`),
  }),
  'rows',
)

type RowNode = ReturnType<typeof rows.create>

let selectedRow: RowNode | null = null

const rowElements = rows.reatomMap((row) => <Row row={row} />, 'rowElements')

const run = () => {
  rows.clear()
  rows.createMany(buildRowParams(1000))
}

const runLots = () => {
  rows.clear()
  rows.createMany(buildRowParams(10000))
}

const add = () => {
  rows.createMany(buildRowParams(1000))
}

const update = () => {
  let i = 0
  rows.find((row) => {
    if (i % 10 === 0) {
      row.label.set((state) => `${state} !!!`)
    }
    i += 1
    return false
  })
}

const clear = () => {
  rows.clear()
}

const swapRows = () => {
  const { head, tail, LL_NEXT, LL_PREV } = rows()
  const first = head?.[LL_NEXT]
  const second = tail?.[LL_PREV]
  if (first && second) {
    rows.swap(first, second)
  }
}

const removeRow = (row: RowNode) => {
  if (selectedRow === row) {
    selectedRow = null
  }
  rows.remove(row)
}

const selectRow = (row: RowNode) => {
  selectedRow?.selected.set(false)
  selectedRow = row
  row.selected.set(true)
}

const buildRowParams = (count: number): Array<[number, string]> => {
  const params: Array<[number, string]> = []
  for (let i = 0; i < count; i += 1) {
    params.push([nextId, buildLabel()])
    nextId += 1
  }
  return params
}

const buildLabel = (): string => {
  const adjective = ADJECTIVES[random(ADJECTIVES.length)]
  const color = COLORS[random(COLORS.length)]
  const noun = NOUNS[random(NOUNS.length)]
  return `${adjective} ${color} ${noun}`
}

const random = (max: number): number => Math.floor(Math.random() * max)

const Button = ({
  id,
  label,
  onClick,
}: {
  id: string
  label: string
  onClick: () => void
}): JSX.Element => (
  <div class="col-sm-6 smallpad">
    <button type="button" class="btn btn-primary btn-block" id={id} on:click={onClick}>
      {label}
    </button>
  </div>
)

const App = (): JSX.Element => (
  <div class="container">
    <div class="jumbotron">
      <div class="row">
        <div class="col-md-6">
          <h1>Reatom JSX keyed</h1>
        </div>
        <div class="col-md-6">
          <div class="row">
            <Button id="run" label="Create 1,000 rows" onClick={run} />
            <Button id="runlots" label="Create 10,000 rows" onClick={runLots} />
            <Button id="add" label="Append 1,000 rows" onClick={add} />
            <Button id="update" label="Update every 10th row" onClick={update} />
            <Button id="clear" label="Clear" onClick={clear} />
            <Button id="swaprows" label="Swap Rows" onClick={swapRows} />
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover table-striped test-data">
      <tbody>{rowElements}</tbody>
    </table>
    <span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>
)

const Row = ({ row }: { row: RowNode }): JSX.Element => (
  <tr class={() => (row.selected() ? 'danger' : undefined)}>
    <td class="col-md-1">{row.id}</td>
    <td class="col-md-4">
      <a on:click={() => selectRow(row)}>{row.label}</a>
    </td>
    <td class="col-md-1">
      <a on:click={() => removeRow(row)}>
        <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
      </a>
    </td>
    <td class="col-md-6"></td>
  </tr>
)

mount(document.getElementById('main')!, <App />)
