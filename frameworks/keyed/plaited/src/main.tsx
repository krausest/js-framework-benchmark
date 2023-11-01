import { Component, PlaitProps, useStore, FT } from 'plaited'

const TableRow:FT<{
  id: number;
  label: string;
  selected: boolean
}> = item => {
  return (
    <tr
      id={item.id}
      className={item.selected ? 'danger' : ''}
      data-target={`row-${item.id}`}
    >
      <td className='col-md-1'>{item.id}</td>
      <td className='col-md-4'>
        <a data-target={`label`}>{item.label}</a>
      </td>
      <td data-id={item.id} className='col-md-1' data-interaction='delete'>
        <a>
          <span className='glyphicon glyphicon-remove' aria-hidden='true'>
          </span>
        </a>
      </td>
      <td className='col-md-6'></td>
    </tr>
  )
}


class BenchMark extends Component({
  tag: 'js-benchmark',
  template: <><link href="/css/currentStyle.css" rel="stylesheet" />
    <div className="container">
      <div className="jumbotron">
        <div className="row">
          <div className="col-md-6">
            <h1>Plaited-next-"keyed"</h1>
          </div>
          <div className="col-md-6">
            <div className="row">
              <div className="col-sm-6 smallpad">
                <button type='button' className='btn btn-primary btn-block' id='run'
                  data-trigger={{ click: 'run' }}>Create 1,000
                  rows</button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type='button' className='btn btn-primary btn-block' id='runlots'
                  data-trigger={{ click: 'runLots' }}>Create 10,000
                  rows</button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type='button' className='btn btn-primary btn-block' id='add'
                  data-trigger={{ click: 'add' }}>Append 1,000
                  rows</button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type='button' className='btn btn-primary btn-block' id='update'
                  data-trigger={{ click: 'update' }}>Update every 10th
                  row</button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type='button' className='btn btn-primary btn-block' id='clear'
                  data-trigger={{ click: 'clear' }}>Clear</button>
              </div>
              <div className="col-sm-6 smallpad">
                <button type='button' className='btn btn-primary btn-block' id='swaprows'
                  data-trigger={{ click: 'swapRows' }}>Swap Rows</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table className="table table-hover table-striped test-data">
        <tbody id="tbody" data-trigger={{ click: 'interact' }} data-target='tbody'>
        </tbody>
      </table>
      <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
    </div>
  </> 
}){
  plait({ feedback, $, trigger }: PlaitProps) {
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
      'fancy',
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
      'orange',
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
      'keyboard',
    ]
    const [getSelected, setSelected] = useStore(-1)
    const random = (max: number) => {
      return Math.round(Math.random() * 1000) % max
    }
    const tbody = $('tbody')
    let did = parseInt(tbody?.lastElementChild?.id) || 1
    const buildData = (count: number) => {
      const data = []
      for (let i = 0; i < count; i++) {
        data.push({
          id: did++,
          label: `${adjectives[random(adjectives.length)]} ${colours[random(colours.length)]
            } ${nouns[random(nouns.length)]}`,
          selected: false,
        })
      }
      return data
    }
    feedback({
      add() {
        tbody?.render(
          <>{buildData(1000).map((d) => <TableRow {...d} />)}</>,
          'beforeend',
        )
      },
      run() {
        tbody?.render(
          <>{buildData(1000).map((data) => <TableRow {...data} />)}</>,
        )
      },
      runLots() {
        tbody?.render(
          <>{buildData(10000).map((data) => <TableRow {...data} />)}</>,
        )
      },
      clear() {
        tbody.replaceChildren()
      },
      interact(e: MouseEvent) {
        const td = (e.target as HTMLElement)?.closest<HTMLTableCellElement>(
          'td',
        )
        if (td) {
          const interaction = td.dataset.interaction
          const id = parseInt(td.parentElement.id)

          if (interaction === 'delete') {
            trigger({ type: 'delete', detail: { id } })
          } else {
            trigger({ type: 'select', detail: { id } })
          }
        }
      },
      delete({ id }: { id: number }) {
        $(`row-${id}`)?.remove()
      },
      select({ id }: { id: number }) {
        const cur = getSelected()
        if (cur > -1) {
          $(`row-${cur}`)?.attr('class', null)
        }
        $(`row-${id}`)?.attr('class', 'danger')
        setSelected(id)
      },
      swapRows() {
        const rows = $('row', { all: true, mod: '^=' })
        tbody?.insertBefore(rows[1], rows[999])
        tbody?.insertBefore(rows[998], rows[2])
      },
      update() {
        const labels = $('label', { all: true })
        const length = labels.length
        for (let i = 0; i < length; i += 10) {
          labels[i].textContent = labels[i].textContent + ' !!!'
        }
      },
    })
  }
}

  customElements.define(BenchMark.tag, BenchMark)
