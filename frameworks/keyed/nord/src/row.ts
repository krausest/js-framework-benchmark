import { Grain, derived } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import { Item } from './data';

type RowProps = { selected: Grain<boolean>; item: Item; onSelect: () => void; onRemove: () => void };
export const Row = ({ selected, item, onSelect, onRemove }: RowProps) => {
    return html`<tr class="${derived(selected, (is) => (is ? 'danger' : ''))}">
        <td class="col-md-1">${item.id}</td>
        <td class="col-md-4">
            <a ${on('click', onSelect)}>${item.label}</a>
        </td>
        <td class="col-md-1">
            <a ${on('click', onRemove)}>
                <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
            </a>
        </td>
        <td class="col-md-6"></td>
    </tr>`;
};
