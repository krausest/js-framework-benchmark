import * as ui from "hyperoop"
import { Actions } from './store'

export default ({ act }: { act: Actions}) => act.State.data.map(({ id, label }, i) =>
    <tr key={id} class={id === act.State.selected ? "danger" : ""}>
        <td class="col-md-1">{id}</td>
        <td class="col-md-4">
            <a onclick={_ => act.select(id)}>{label}</a>
        </td>
        <td class="col-md-1">
            <a onclick={_ => act.delete(id)}>
                <span class="glyphicon glyphicon-remove" aria-hidden="true">
                </span>
            </a>
        </td>
        <td class="col-md-6"></td>
    </tr>
)
