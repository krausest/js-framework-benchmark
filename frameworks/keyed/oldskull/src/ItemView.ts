import {
    OsfModelView,
    OsfReference,
    MODEL_CHANGED_EVENT,
} from 'oldskull';

import { ItemModel } from './ItemModel';

export class ItemView extends OsfModelView<ItemModel> {
  getHTML(): string {
    const m = this.model.attrs;
    return `
      <tr>
        <td class='col-md-1'>
          ${ m.id }
        </td>
        <td class='col-md-4'>
          <a class='lbl'>
            ${ m.label }
          </a>
        </td>
        <td class='col-md-1'>
          <a class='remove'><span class='remove glyphicon glyphicon-remove' aria-hidden='true'></span></a>
        </td>
        <td class='col-md-6'>
                
        </td>
      </tr>
            
    `;
  }
  modelEvents = [
    { on: MODEL_CHANGED_EVENT, call: this.updateLabel.bind(this) },
  ];
  domEvents = [
   { el: '.lbl', on: 'click', call: this.highlight.bind(this) },
   { el: '.remove', on: 'click', call: this.remove.bind(this) },
  ];
  label = new OsfReference(this, '.lbl');
  updateLabel() {
    const el = this.label.get();
    if (el) {
      el.innerHTML = this.model.attrs.label;
    }
  }
  highlight() {
    if (this.el) {
      this.trigger('unhighlight');
      this.el.classList.add('danger');
    }
  }
  unhighlight() {
    if (this.el) {
      this.el.classList.remove('danger');
    }
  }
}
