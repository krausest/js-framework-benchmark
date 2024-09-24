import type { Item } from '@/utils/data';
import { Component } from '@lifeart/gxt';
import type { ModifierReturn } from '@glint/template/-private/integration';
import { RemoveIcon } from './RemoveIcon.gts';

type RowArgs = {
  Args: {
    item: Item;
    selected: number;
    onRemove: (item: Item) => void;
    onSelect: (item: Item) => void;
  };
};

export class Row extends Component<RowArgs> {
  get className() {
    return this.args.selected === this.args.item.id ? 'danger' : '';
  }
  onClick = () => {
    this.args.onSelect(this.args.item);
  };
  onClickRemove = () => {
    this.args.onRemove(this.args.item);
  };
  <template>
    <tr class={{this.className}}>
      <td class='col-md-1'>{{@item.id}}</td>
      <td class='col-md-4'>
        <a {{on 'click' this.onClick}}>{{@item.label}}</a>
      </td>
      <td class='col-md-1'>
        <a {{on 'click' this.onClickRemove}}>
          <RemoveIcon />
        </a>
      </td>
      <td class='col-md-6'></td>
    </tr>
  </template>
}
