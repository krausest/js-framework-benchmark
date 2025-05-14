import { ComponentContext, jsx, ObservableEvent } from 'butterfloat'
import { RowViewModel } from './row-vm'
import { of } from 'rxjs'

export interface RowProps {
  vm: RowViewModel
}

export interface RowEvents {
  select: ObservableEvent<MouseEvent>
  remove: ObservableEvent<MouseEvent>
}

export function Row(
  { vm }: RowProps,
  { bindImmediateEffect, events }: ComponentContext<RowEvents>,
) {
  bindImmediateEffect(vm.alive, () => {})
  bindImmediateEffect(events.select, () => vm.select())
  bindImmediateEffect(events.remove, () => vm.remove())

  return (
    <tr classBind={{ danger: vm.selected }}>
      <td class="col-md-1" bind={{ innerText: of(vm.id.toString()) }}></td>
      <td class="col-md-4">
        <a bind={{ innerText: vm.label }} events={{ click: events.select }}></a>
      </td>
      <td class="col-md-1">
        <a events={{ click: events.remove }}>
          <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
        </a>
      </td>
      <td class="col-md-6"></td>
    </tr>
  )
}
