import { OsfModel } from 'oldskull';

interface IItem {
  id: number;
  label: string;
}

export class ItemModel extends OsfModel<IItem> {
  getId(): number {
    return this.attrs.id;
  }
}
