import { isle, PlaitProps, useStore } from 'plaited'

type RowAttrs = { id: number; label: string; selected: boolean }
const TableRow = (item: RowAttrs) => {
  return (
    <tr
      id={item.id}
      class={item.selected ? 'danger' : ''}
      data-target={`row-${item.id}`}
    >
      <td class='col-md-1'>{item.id}</td>
      <td class='col-md-4'>
        <a data-target={`label-${item.id}`}>{item.label}</a>
      </td>
      <td data-id={item.id} class='col-md-1' data-interaction='delete'>
        <a>
          <span class='glyphicon glyphicon-remove' aria-hidden='true'>
          </span>
        </a>
      </td>
      <td class='col-md-6'></td>
    </tr>
  )
}

isle(
  { tag: 'benchmark-island' },
  (base) =>
    class extends base {
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
        let did = parseInt(tbody?.lastElementChild?.id)|| 1
        const buildData = (count: number) => {
          const data = []
          for (let i = 0; i < count; i++) {
            data.push({
              id: did++,
              label: `${adjectives[random(adjectives.length)]} ${
                colours[random(colours.length)]
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
              const id = parseInt((td.parentNode as Element).id)
    
              if (interaction === 'delete') {
                trigger({ type: 'delete', detail: { id } })
              } else {
                trigger({ type: 'select', detail: { id } })
              }
            }
          },
          delete({ id }: { id: string }) {
            $(`row-${id}`)?.remove()
          },
          select({ id }: { id: string }) {
            const cur = getSelected()
            if (cur > -1) {
              $(`row-${cur}`)?.attr('class', '')
            }
            $(`row-${id}`)?.attr('class', 'danger')
            setSelected(parseInt(id))
          },
          swapRows() {
            const rows = $('row', {all:true, mod:'^='})
            tbody?.insertBefore(rows[1], rows[999])
            tbody?.insertBefore(rows[998], rows[2])
          },
          update() {
            const labels = $('label', {all:true, mod:'^='})
            const length = labels.length
            for (let i = 0; i < length; i += 10) {
              labels[i].innerHTML = labels[i].textContent + ' !!!'
            }
          },
        })
      }
    },
)()
