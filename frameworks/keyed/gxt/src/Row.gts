import type { Item } from '@/utils/data';
import { Component, cellFor } from '@lifeart/gxt';
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
  get id() {
    return this.args.item.id;
  }
  get label() {
    return this.args.item.label;
  }
  get isSelected() {
    return this.args.selected === this.id;
  }
  get className() {
    return this.isSelected ? 'danger' : '';
  }
  onClick = () => {
    this.args.onSelect(this.args.item);
  };
  onClickRemove = () => {
    this.args.onRemove(this.args.item);
  };
  <template>
    <tr class={{this.className}}>
      <td class='col-md-1'>{{this.id}}</td>
      <td class='col-md-4'>
        <a {{on 'click' this.onClick}}>{{this.label}}</a>
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
