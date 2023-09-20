import { customElement, FASTElement, html, attr, css, FAST } from '@microsoft/fast-element';
import { provideFASTDesignSystem, fastButton, fastCheckbox } from '@microsoft/fast-components';
provideFASTDesignSystem().register(fastButton()).register(fastCheckbox());

const template = html<TodoItem>`
  <fast-checkbox checked=${x => x.done} @change=${x => x.toggleDone()}></fast-checkbox>
  <span class="list-text ${x => (x.done ? 'done' : '')}"> ${x => x.description} </span>
  <fast-button @click=${x => x.removeTodo()}>&times;</fast-button>
`;

const styles = css`
  :host {
    display: flex;
  }

  span {
    display: inline-block;
    align-self: center;
    margin: 0 8px;
    flex: 1;
  }

  .done {
    text-decoration: line-through;
  }
`;

@customElement({
  name: 'todo-item',
  template,
  styles
})
export class TodoItem extends FASTElement {
  @attr public description = '';
  @attr({ mode: 'boolean' }) public done = false;

  public toggleDone() {
    this.done = !this.done;
  }

  public removeTodo() {
    this.$emit('todo-remove');
  }
}
