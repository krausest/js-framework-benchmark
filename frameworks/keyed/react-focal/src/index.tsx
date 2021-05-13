import ReactDOM from 'react-dom'
import { F, Atom } from '@grammarly/focal'

const A = [
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
const C = [
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
const N = [
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

const random = (max: number) => Math.round(Math.random() * 1000) % max

interface Item {
  id: number
  label: string
}

let nextId = 1
function buildData(count: number): Item[] {
  const data = new Array(count)
  for (let i = 0; i < count; i++) {
    const id = nextId++
    data[i] = {
      id,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`
    }
  }
  return data
}

const items = Atom.create<Item[]>([])
const selectedItem = Atom.create<null | number>(null)

const onReset = (amount: number) => items.set(buildData(amount))
const onAdd = () => items.modify(data => data.concat(buildData(1000)))
const onUpdate = () =>
  items.modify(newData => {
    const d = newData.slice()

    for (let i = 0; i < d.length; i += 10) {
      const r = d[i]!
      d[i] = { id: r.id, label: r.label + ' !!!' }
    }

    return d
  })
const onClear = () => items.set([])
const onSwap = () =>
  items.modify(newData => {
    const d = newData.slice()
    const tmp = d[1]!
    d[1] = d[998]!
    d[998] = tmp
    return d
  })
const onRemove = (id: number) =>
  items.modify(newData => {
    const idx = newData.findIndex(d => d.id === id)
    return [...newData.slice(0, idx), ...newData.slice(idx + 1)]
  })

const onSelect = (id: number) => selectedItem.set(id)

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true" />

const Row = ({ item }: { item: Item }) => (
  <F.tr className={selectedItem.view(id => (id === item.id ? 'danger' : ''))}>
    <td className="col-md-1">{item.id}</td>
    <td className="col-md-4">
      <a onClick={() => onSelect(item.id)}>{item.label}</a>
    </td>
    <td className="col-md-1">
      <a onClick={() => onRemove(item.id)}>{GlyphIcon}</a>
    </td>
    <td className="col-md-6" />
  </F.tr>
)

const Button = ({ id, title, cb }: { id: string; title: string; cb: () => void }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>
      {title}
    </button>
  </div>
)

const Main = () => (
  <div className="container">
    <div className="jumbotron">
      <div className="row">
        <div className="col-md-6">
          <h1>React + Focal 0.8.5</h1>
        </div>
        <div className="col-md-6">
          <div className="row">
            <Button id="run" title="Create 1,000 rows" cb={() => onReset(1000)} />
            <Button id="runlots" title="Create 10,000 rows" cb={() => onReset(10000)} />
            <Button id="add" title="Append 1,000 rows" cb={onAdd} />
            <Button id="update" title="Update every 10th row" cb={onUpdate} />
            <Button id="clear" title="Clear" cb={onClear} />
            <Button id="swaprows" title="Swap Rows" cb={onSwap} />
          </div>
        </div>
      </div>
    </div>
    <table className="table table-hover table-striped test-data">
      <F.tbody>{items.view(rows => rows.map(item => <Row key={item.id} item={item} />))}</F.tbody>
    </table>
    <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true" />
  </div>
)

ReactDOM.render(<Main />, document.getElementById('main'))
