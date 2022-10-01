import {
  OsfView,
  OsfCollectionView,
  MODEL_ADDED_EVENT,
  COLLECTION_RESETED_EVENT,
} from 'oldskull';

import { ItemModel } from './ItemModel';
import { ItemView } from './ItemView';
import { insertAfter } from './utils';

export class ItemCollectionView extends OsfCollectionView<ItemModel, ItemView, OsfView> {
  collectionEvents = [
    { on: MODEL_ADDED_EVENT, call: this.handleAdd },
    { on: COLLECTION_RESETED_EVENT, call: this.handleReset },
  ];
  childViewEvents = [
    {
      on: 'unhighlight', call: this.unhighlight.bind(this),
    },
  ];
  getHTML(): string {
    return `<tbody id="tbody"></tbody>`;
  }
  async handleAdd(model: unknown) {
    await this.addChildView(<ItemModel>model);
  }
  async handleReset() {
    this.removeAllChildViews();
    this.addChildView(this.collection.models);
  }
  unhighlight() {
    this.children.forEach((child: ItemView) => child.unhighlight());
  }
  swap() {
    if(this.children.length > 998) {
      const view0 = this.children[0];
      const view1 = this.children[1];
      const view997 = this.children[997];
      const view998 = this.children[998];
      if (
        view0.el &&
        view1.el &&
        view997.el &&
        view998.el
      ) {
        insertAfter(view998.el, view0.el);
        insertAfter(view1.el, view997.el);
        const cache = this.children[1];
        this.children[1] = this.children[998];
        this.children[998] = cache;
      }
    }
  }
}
