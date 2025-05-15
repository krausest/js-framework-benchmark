import { ComponentContext, jsx, ObservableEvent } from 'butterfloat'
import { RowViewModel } from './row-vm'
import { concat, filter, NEVER, of, takeUntil } from 'rxjs'

export interface RowProps {
  vm: RowViewModel
}

export interface RowEvents {
  attach: ObservableEvent<HTMLElement>
  select: ObservableEvent<MouseEvent>
  remove: ObservableEvent<MouseEvent>
}

export function Row(
  { vm }: RowProps,
  { bindEffect, bindImmediateEffect, events }: ComponentContext<RowEvents>,
) {
  bindImmediateEffect(events.attach, (element) => {
    element.dataset.id = vm.id.toString()
  })
  bindImmediateEffect(events.select, () => vm.select())
  bindImmediateEffect(events.remove.pipe(takeUntil(vm.removed)), () =>
    vm.remove(),
  )
  bindEffect(vm.app.rowsToUpdate.pipe(filter((id) => id === vm.id)), () =>
    vm.updateLabel(),
  )

  const id = concat(of(vm.id.toString()), NEVER)

  return (
    <tr
      classBind={{ danger: vm.selected }}
      events={{ bfDomAttach: events.attach }}
    >
      <td class="col-md-1" bind={{ innerText: id }}></td>
      <td class="col-md-4">
        <a bind={{ innerText: vm.label }} events={{ click: events.select }}></a>
      </td>
      <td class="col-md-1">
        <a type="button" events={{ click: events.remove }}>
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  )
}
